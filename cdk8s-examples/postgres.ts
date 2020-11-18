import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, IntOrString, PersistentVolumeClaim, Service } from './imports/k8s'

export class PostgresChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = { app: 'postgres' };

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'postgres'
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
        ports: [ { port: 5432, targetPort: IntOrString.fromNumber(5432) } ],
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
              name: 'postgres',
              persistentVolumeClaim:{claimName: 'postgres'}
            }],
            containers: [{
                name: 'postgres',
                image: 'postgres',
                imagePullPolicy: 'Always',
                ports: [{containerPort: 5432}],
                env: [{name: 'POSTGRES_PASSWORD', value: 'password'}],
              volumeMounts: [{mountPath: '/var/lib/postgres/data', name: 'postgres'}]
              }]
          }
        }
      }
    });
  }
}

const app = new App();
new PostgresChart(app, 'postgres');
app.synth();
