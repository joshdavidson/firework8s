import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class RadarrChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'radarr'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'radarr'
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
    
    const service = new Service(this, 'service', {
      ports: [{port: 7878, targetPort: 7878}]
    });
    service.addSelector('app', 'radarr');

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
              {name: 'radarr', persistentVolumeClaim: {claimName: 'radarr'}},
              {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
              {name: 'movies', hostPath: {path: '/mnt/share/Movies'}}
            ],
            containers: [{
              name: 'radarr',
              image: 'linuxserver/radarr:nightly',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 7878}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'radarr'},
                {mountPath: '/downloads', name: 'downloads'},
                {mountPath: '/movies', name: 'movies'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('radarr.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new RadarrChart(app, 'radarr');
app.synth();
