import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class OmbiChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'ombi'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'ombi'
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
      ports: [{port: 3579, targetPort: 3579}]
    });
    service.addSelector('app', 'ombi');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'ombi', persistentVolumeClaim: {claimName: 'ombi'}}],
            containers: [{
              name: 'ombi',
              image: 'linuxserver/ombi',

              ports: [{containerPort: 3579}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'ombi'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('ombi.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new OmbiChart(app, 'ombi');
app.synth();
