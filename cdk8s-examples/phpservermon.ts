import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment } from './imports/k8s'
import { Ingress, IngressBackend, Service } from 'cdk8s-plus';

export class PhpServerMonChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'phpservermon'};
    
    const service = new Service(this, 'service', {
      ports: [{port: 80, targetPort: 80}]
    });
    service.addSelector('app', 'phpservermon');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            containers: [{
              name: 'phpservermon',
              image: 'benoitpodwinski/phpservermon',

              ports: [{containerPort: 80}],
              env: [
                {name: 'PSM_BASE_URL', value: 'http://phpservermon.lan/'},
                {name: 'PSM_DB_HOST', value: 'mariadb'},
                {name: 'PSM_DB_NAME', value: 'phpservermon'},
                {name: 'PSM_DB_USER', value: 'root'},
                {name: 'PSM_DB_PASS', value: 'password'},
                {name: 'PSM_DB_PREFIX', value: 'psm_'},
                {name: 'PHP_TIMEZONE', value: 'America/New_York'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('phpservermon.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new PhpServerMonChart(app, 'phpservermon');
app.synth();
