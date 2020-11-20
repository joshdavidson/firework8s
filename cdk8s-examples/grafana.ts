import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class GrafanaChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'grafana'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'grafana'
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
      ports: [{port: 3000, targetPort: 3000}]
    });
    service.addSelector('app', 'grafana');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'grafana', persistentVolumeClaim: {claimName: 'grafana'}}],
            containers: [{
              name: 'grafana',
              image: 'grafana/grafana',

              ports: [{containerPort: 3000}],
              env: [
                {name: 'GF_INSTALL_PLUGINS', value: 'grafana-piechart-panel,grafana-worldmap-panel'},
                {name: 'GF_PATHS_DATA', value: '/config/data'},
                {name: 'GF_PATHS_LOGS', value: '/config/logs'},
                {name: 'GF_PATHS_PLUGINS', value: '/config/plugins'}
              ],
              volumeMounts: [{mountPath: '/config', name: 'grafana'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('grafana.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new GrafanaChart(app, 'grafana');
app.synth();
