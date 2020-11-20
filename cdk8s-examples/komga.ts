import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class KomgaChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'komga'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'komga'
      },
      spec: {
        storageClassName: 'default',
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '250Mi'
          }
        }
      }
    });
    
    const service = new Service(this, 'service', {
      ports: [{port: 8080, targetPort: 8080}]
    });
    service.addSelector('app', 'komga');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [
              {name: 'komga', persistentVolumeClaim: {claimName: 'komga'}},
              {name: 'comics', hostPath: {path: '/mnt/share/Comics'}}
            ],
            containers: [{
              name: 'komga',
              image: 'gotson/komga',

              ports: [{containerPort: 8080}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'komga'},
                {mountPath: '/comics', name: 'comics'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('komga.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new KomgaChart(app, 'komga');
app.synth();
