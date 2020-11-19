import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, IntOrString, PersistentVolumeClaim, Service } from './imports/k8s'

export class MongoDbChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = { app: 'mongo' };

    new PersistentVolumeClaim(this, 'mongo', {
      metadata: {
        name: 'mongo'
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

    new PersistentVolumeClaim(this, 'mongo-dump', {
      metadata: {
        name: 'mongo-dump'
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
        ports: [ { port: 27017, targetPort: IntOrString.fromNumber(27017) } ],
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
              name: 'mongo',
              persistentVolumeClaim:{claimName: 'mongo'}
            },
            {
              name: 'mongo-dump',
              persistentVolumeClaim:{claimName: 'mongo-dump'}
            }],
            containers: [{
                name: 'mongo',
                image: 'mongo',
                imagePullPolicy: 'Always',
                args: [ 'mongod', '--oplogSize', '128' ],
                ports: [{containerPort: 27017}],
                volumeMounts: [{mountPath: '/data/db', name: 'mongo'},
                               {mountPath: '/dump', name: 'mongo-dump'}]
              }]
          }
        }
      }
    });
  }
}

const app = new App();
new MongoDbChart(app, 'mongo');
app.synth();
