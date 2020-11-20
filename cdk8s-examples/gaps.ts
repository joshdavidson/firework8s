import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class GapsChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'gaps'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'gaps'
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
      ports: [{port: 8484, targetPort: 8484}]
    });
    service.addSelector('app', 'gaps');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'gaps', persistentVolumeClaim: {claimName: 'gaps'}}],
            containers: [{
              name: 'gaps',
              image: 'housewrecker/gaps',

              ports: [{containerPort: 8484}],
              volumeMounts: [{mountPath: '/usr/data', name: 'gaps'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('gaps.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new GapsChart(app, 'gaps');
app.synth();
