import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class TautulliChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'tautulli'};

    new PersistentVolumeClaim(this, 'tautulli-config', {
      metadata: {
        name: 'tautulli-config'
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

    new PersistentVolumeClaim(this, 'tautulli-logs', {
      metadata: {
        name: 'tautulli-logs'
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
      ports: [{port: 8181, targetPort: 8181}]
    });
    service.addSelector('app', 'tautulli');

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
              {name: 'tautulli-config', persistentVolumeClaim: {claimName: 'tautulli-config'}},
              {name: 'tautulli-logs', persistentVolumeClaim: {claimName: 'tautulli-logs'}}
            ],
            containers: [{
              name: 'tautulli',
              image: 'linuxserver/tautulli',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 8181}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'tautulli-config'},
                {mountPath: '/logs', name: 'tautulli-logs'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('tautulli.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new TautulliChart(app, 'tautulli');
app.synth();
