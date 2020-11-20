import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class ReadarrChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'readarr'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'readarr'
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
      ports: [{port: 8787, targetPort: 8787}]
    });
    service.addSelector('app', 'readarr');

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
              {name: 'readarr', persistentVolumeClaim: {claimName: 'readarr'}},
              {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
              {name: 'books', hostPath: {path: '/mnt/share/eBooks'}}
            ],
            containers: [{
              name: 'readarr',
              image: 'hotio/readarr:nightly',

              ports: [{containerPort: 8787}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'readarr'},
                {mountPath: '/downloads', name: 'downloads'},
                {mountPath: '/books', name: 'books'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('readarr.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new ReadarrChart(app, 'readarr');
app.synth();
