import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class RanetoChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'raneto'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'raneto'
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
      ports: [{port: 3000, targetPort: 3000}]
    });
    service.addSelector('app', 'raneto');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'raneto', persistentVolumeClaim: {claimName: 'raneto'}}],
            containers: [{
              name: 'raneto',
              image: 'linuxserver/raneto',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 3000}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [{mountPath: '/config', name: 'raneto'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('raneto.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new RanetoChart(app, 'raneto');
app.synth();
