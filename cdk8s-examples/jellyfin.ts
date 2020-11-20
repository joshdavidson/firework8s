import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class JellyfinChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'jellyfin'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'jellyfin'
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
      ports: [{port: 8096, targetPort: 8096}]
    });
    service.addSelector('app', 'jellyfin');

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
              {name: 'jellyfin', persistentVolumeClaim: {claimName: 'jellyfin'}},
              {name: 'movies', hostPath: {path: '/mnt/share/Movies'}},
              {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
            ],
            containers: [{
              name: 'jellyfin',
              image: 'linuxserver/jellyfin',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 8096}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'jellyfin'},
                {mountPath: '/data/movies', name: 'movies'},
                {mountPath: '/data/tvshows', name: 'tv'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('jellyfin.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new JellyfinChart(app, 'jellyfin');
app.synth();
