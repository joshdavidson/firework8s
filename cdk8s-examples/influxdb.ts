import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, IntOrString, PersistentVolumeClaim, Service } from './imports/k8s'

export class InfluxDbChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = { app: 'influxdb' };

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'influxdb'
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
        ports: [ { port: 8086, targetPort: IntOrString.fromNumber(8086) } ],
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
              name: 'influxdb',
              persistentVolumeClaim:{claimName: 'influxdb'}
            }],
            containers: [{
                name: 'influxdb',
                image: 'influxdb',

                ports: [{containerPort: 8086}],
                volumeMounts: [{mountPath: '/var/lib/influxdb', name: 'influxdb'}]
              }]
          }
        }
      }
    });
  }
}

const app = new App();
new InfluxDbChart(app, 'influxdb');
app.synth();
