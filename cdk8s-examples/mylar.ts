import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class MylarChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'mylar'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'mylar'
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
      ports: [{port: 8090, targetPort: 8090}]
    });
    service.addSelector('app', 'mylar');

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
              {name: 'mylar', persistentVolumeClaim: {claimName: 'mylar'}},
              {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
              {name: 'comics', hostPath: {path: '/mnt/share/Comics'}}
            ],
            containers: [{
              name: 'mylar',
              image: 'linuxserver/mylar3',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 8090}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'},

              ],
              volumeMounts: [
                {mountPath: '/config', name: 'mylar'},
                {mountPath: '/downloads', name: 'downloads'},
                {mountPath: '/comics', name: 'comics'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('mylar.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new MylarChart(app, 'mylar');
app.synth();
