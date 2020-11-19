import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class ObserviumChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'observium'};

    new PersistentVolumeClaim(this, 'observium-config', {
      metadata: {
        name: 'observium-config'
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

    new PersistentVolumeClaim(this, 'observium-data', {
      metadata: {
        name: 'observium-data'
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
      ports: [{port: 8668, targetPort: 8668}]
    });
    service.addSelector('app', 'observium');

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
              {name: 'observium-config', persistentVolumeClaim: {claimName: 'observium-config'}},
              {name: 'observium-data', persistentVolumeClaim: {claimName: 'observium-data'}}
            ],
            containers: [{
              name: 'observium',
              image: 'uberchuckie/observium',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 8668}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'},

              ],
              volumeMounts: [
                {mountPath: '/config', name: 'observium-config'},
                {mountPath: '/opt/observium/rrd', name: 'observium-data'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('observium.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new ObserviumChart(app, 'observium');
app.synth();
