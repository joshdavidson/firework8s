import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class HomerChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'homer'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'homer'
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
    service.addSelector('app', 'homer');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'homer', persistentVolumeClaim: {claimName: 'homer'}}],
            containers: [{
              name: 'homer',
              image: 'b4bz/homer',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 8080}],
              env: [
                {name: 'UID', value: '1000'},
                {name: 'GID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [{mountPath: '/www/assets', name: 'homer'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('homer.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new HomerChart(app, 'homer');
app.synth();
