import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Protocol, Service} from 'cdk8s-plus';

export class TransmissionChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'transmission'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'transmission'
      },
      spec: {
        storageClassName: 'default',
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '1Gi'
          }
        }
      }
    });
    
    const service = new Service(this, 'service', {
      ports: [{port: 9091}]
    });
    service.addSelector('app', 'transmission');

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
              {name: 'transmission', persistentVolumeClaim: {claimName: 'transmission'}},
              {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}}
            ],
            containers: [{
              name: 'transmission',
              image: 'linuxserver/transmission',
              imagePullPolicy: 'Always',
              ports: [{containerPort: 9091},
                      {containerPort: 51413, protocol: Protocol.UDP}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'},
                {name: 'USER', value: 'transmission'},
                {name: 'PASS', value: 'transmission'}
              ],
              volumeMounts: [
                {mountPath: '/config', name: 'transmission'},
                {mountPath: '/downloads', name: 'downloads'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('transmission.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new TransmissionChart(app, 'transmission');
app.synth();
