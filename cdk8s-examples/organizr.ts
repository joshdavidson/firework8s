import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class OrganizrChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'organizr'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'organizr'
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
      ports: [{port: 80, targetPort: 80}]
    });
    service.addSelector('app', 'organizr');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'organizr', persistentVolumeClaim: {claimName: 'organizr'}}],
            containers: [{
              name: 'organizr',
              image: 'organizr/organizr',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 80}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'},
                {name: 'fpm', value: 'false'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'organizr'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('organizr.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new OrganizrChart(app, 'organizr');
app.synth();
