import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class SmokePingChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'smokeping'};

    new PersistentVolumeClaim(this, 'smokeping-config', {
      metadata: {
        name: 'smokeping-config'
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

    new PersistentVolumeClaim(this, 'smokeping-data', {
      metadata: {
        name: 'smokeping-data'
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
    service.addSelector('app', 'smokeping');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [
              {name: 'smokeping-config', persistentVolumeClaim: {claimName: 'smokeping-config'}},
              {name: 'smokeping-data', persistentVolumeClaim: {claimName: 'smokeping-data'}}
            ],
            containers: [{
              name: 'smokeping',
              image: 'linuxserver/smokeping',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 80}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'smokeping-config'},
                {mountPath: '/data', name: 'smokeping-data'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('smokeping.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new SmokePingChart(app, 'smokeping');
app.synth();
