import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class SickGearChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'sickgear'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'sickgear'
      },
      spec: {
        storageClassName: 'default',
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '2Gi'
          }
        }
      }
    });
    
    const service = new Service(this, 'service', {
      ports: [{port: 8081, targetPort: 8081}]
    });
    service.addSelector('app', 'sickgear');

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
              {name: 'sickgear', persistentVolumeClaim: {claimName: 'sickgear'}},
              {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
              {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
            ],
            containers: [{
              name: 'sickgear',
              image: 'linuxserver/sickgear',

              ports: [{containerPort: 8081}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'sickgear'},
                {mountPath: '/downloads', name: 'downloads'},
                {mountPath: '/tv', name: 'tv'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('sickgear.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new SickGearChart(app, 'sickgear');
app.synth();
