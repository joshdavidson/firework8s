import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, IntOrString, PersistentVolumeClaim, Service } from './imports/k8s'

export class MySqlChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = { app: 'mysql' };

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'mysql'
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

    new Service(this, 'service', {
      spec: {
        ports: [ { port: 3306, targetPort: IntOrString.fromNumber(3306) } ],
        selector: label
      }
    });

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            volumes:[
            {
              name: 'mysql',
              persistentVolumeClaim:{claimName: 'mysql'}
            }],
            containers: [{
                name: 'mysql',
                image: 'mysql',
                //imagePullPolicy: 'Always',
                ports: [{containerPort: 3306}],
                env: [
                  {name: 'MYSQL_DATABASE', value: 'mysql'},
                  {name: 'MYSQL_ROOT_PASSWORD', value: 'password'},
                  {name: 'MYSQL_USER', value: 'mysql'},
                  {name: 'MYSQL_PASSWORD', value: 'mysql'}
                ],
              volumeMounts: [{mountPath: '/var/lib/mysql', name: 'mysql'}]
              }]
          }
        }
      }
    });
  }
}

const app = new App();
new MySqlChart(app, 'mysql');
app.synth();
