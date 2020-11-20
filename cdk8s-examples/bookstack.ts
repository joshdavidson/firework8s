import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class BookStackChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'bookstack'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'bookstack'
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
    service.addSelector('app', 'bookstack');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{
              name: 'bookstack',
              persistentVolumeClaim: {claimName: 'bookstack'}
            }],
            containers: [{
              name: 'bookstack',
              image: 'linuxserver/bookstack',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 80}],
              env: [
                {name: 'TZ', value: 'America/New_York'},
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'DB_HOST', value: 'mariadb'},
                {name: 'DB_USER', value: 'root'},
                {name: 'DB_PASS', value: 'password'},
                {name: 'DB_DATABASE', value: 'bookstackapp'},
                {name: 'APP_URL', value: 'http://bookstack.lan'}
              ],
              volumeMounts: [{mountPath: '/config', name: 'bookstack'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('bookstack.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new BookStackChart(app, 'bookstack');
app.synth();
