import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class WallabagChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'wallabag'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'wallabag'
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
    service.addSelector('app', 'wallabag');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'wallabag', persistentVolumeClaim: {claimName: 'wallabag'}}],
            containers: [{
              name: 'wallabag',
              image: 'wallabag/wallabag',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 80}],
              env: [
                {name: 'SYMFONY__ENV__DOMAIN_NAME', value: 'http://wallabag.lan'},
                {name: 'POPULATE_DATABASE', value: 'True'},
              ],
              volumeMounts: [{mountPath: '/var/www/wallabag/data', name: 'wallabag'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('wallabag.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new WallabagChart(app, 'wallabag');
app.synth();
