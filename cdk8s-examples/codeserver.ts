import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class VsCodeChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'vscode'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'vscode'
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
      ports: [{port: 8443, targetPort: 8443}]
    });
    service.addSelector('app', 'vscode');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: { matchLabels: label },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'vscode', persistentVolumeClaim: {claimName: 'vscode'}}],
            containers: [{
              name: 'vscode',
              image: 'linuxserver/code-server',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 8443}],
              env: [
                {name: 'PUID', value: '1000'},
                {name: 'PGID', value: '1000'},
                {name: 'TZ', value: 'America/New_York'},
                {name: 'PASSWORD', value: 'password'},
                {name: 'SUDO_PASSWORD', value: 'password'}
              ],
              volumeMounts: [{mountPath: '/config', name: 'vscode'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('vscode.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new VsCodeChart(app, 'vscode');
app.synth();
