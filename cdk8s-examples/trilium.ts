import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class TriliumChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'trilium'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'trilium'
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
      ports: [{port: 8080}]
    });
    service.addSelector('app', 'trilium');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'trilium', persistentVolumeClaim: {claimName: 'trilium'}}],
            containers: [{
              name: 'trilium',
              image: 'zadam/trilium',

              ports: [{containerPort: 8080}],
              volumeMounts: [
                {mountPath: '/root/trilium-data', name: 'trilium'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('trilium.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new TriliumChart(app, 'trilium');
app.synth();
