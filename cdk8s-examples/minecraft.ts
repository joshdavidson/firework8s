import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, IntOrString, PersistentVolumeClaim, Service } from './imports/k8s'

export class MinecraftChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = { app: 'minecraft' };

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'minecraft'
      },
      spec: {
        storageClassName: 'default',
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '2Gi'
          }
        }
      }
    });

    new Service(this, 'service', {
      spec: {
        type: 'NodePort',
        ports: [ { port: 25565, nodePort: 25565, targetPort: IntOrString.fromNumber(25565) } ],
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
            volumes:[{
              name: 'data',
              persistentVolumeClaim:{claimName: 'minecraft'}
            }],
            containers: [{
                name: 'minecraft',
                image: 'itzg/minecraft-server',

                env: [{name: 'EULA', value: 'true'}],
                ports: [{containerPort: 25565, hostPort: 25565}],
                volumeMounts: [{mountPath: '/data', name: 'data'}],
                readinessProbe:{
                  exec:{
                    command: ['mc-monitor', 'status', '-- host', '127.0.0.1']
                  },
                  initialDelaySeconds: 5,
                  periodSeconds: 5
                }
              }]
          }
        }
      }
    });

  }
}

const app = new App();
new MinecraftChart(app, 'minecraft');
app.synth();
