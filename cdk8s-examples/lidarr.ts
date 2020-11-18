import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class LidarrChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'lidarr'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'lidarr'
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
      ports: [{port: 8686, targetPort: 8686}]
    });
    service.addSelector('app', 'lidarr');

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
              {name: 'lidarr', persistentVolumeClaim: {claimName: 'lidarr'}},
              {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
              {name: 'music', hostPath: {path: '/mnt/share/Music'}}
            ],
            containers: [{
              name: 'lidarr',
              image: 'linuxserver/lidarr:nightly',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 8686}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'lidarr'},
                {mountPath: '/downloads', name: 'downloads'},
                {mountPath: '/music', name: 'music'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('lidarr.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new LidarrChart(app, 'lidarr');
app.synth();
