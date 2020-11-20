import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class PerkeepChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'perkeep'};

    new PersistentVolumeClaim(this, 'perkeep-config', {
      metadata: {
        name: 'perkeep-config'
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

    new PersistentVolumeClaim(this, 'perkeep-data', {
      metadata: {
        name: 'perkeep-data'
      },
      spec: {
        storageClassName: 'default',
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '10Gi'
          }
        }
      }
    });
    
    const service = new Service(this, 'service', {
      ports: [{port: 3179, targetPort: 3179}]
    });
    service.addSelector('app', 'perkeep');

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
              {name: 'perkeep-config', persistentVolumeClaim: {claimName: 'perkeep-config'}},
              {name: 'perkeep-data', persistentVolumeClaim: {claimName: 'perkeep-data'}}
            ],
            containers: [{
              name: 'perkeep',
              image: 'jhillyerd/perkeep',

              ports: [{containerPort: 3179}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'},

              ],
              volumeMounts: [
                {mountPath: '/config', name: 'perkeep-config'},
                {mountPath: '/storage', name: 'perkeep-data'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('perkeep.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new PerkeepChart(app, 'perkeep');
app.synth();
