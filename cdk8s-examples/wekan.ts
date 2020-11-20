import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment } from './imports/k8s'
import { Ingress, IngressBackend, Service } from 'cdk8s-plus';

export class WekanChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'wekan'};

    const service = new Service(this, 'service', {
      ports: [{port: 8080, targetPort: 8080}]
    });
    service.addSelector('app', 'wekan');

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
              name: 'wekan',
              image: 'wekan/wekan',

              ports: [{containerPort: 8080}],
              env: [
                {name: 'BIGEVENTS_PATTERN', value: 'NONE'},
                {name: 'BROWSER_POLICY_ENABLED', value: 'true'},
                {name: 'CARD_OPENED_WEBHOOK_ENABLED', value: 'false'},
                {name: 'MAIL_FROM', value: 'Wekan Notifications <noreply.wekan@mydomain.com>'},
                {name: 'MAIL_URL', value: 'smtp://smtp.sendgrid.net:25/?ignoreTLS=true&tls={rejectUnauthorized:false}'},
                {name: 'MONGO_URL', value: 'mongodb://mongo:27017/wekan'},
                {name: 'RICHER_CARD_COMMENT_EDITOR', value: 'false'},
                {name: 'ROOT_URL', value: 'http://wekan.lan'},
                {name: 'SCROLLAMOUNT', value: 'auto'},
                {name: 'SCROLLINERTIA', value: '0'},
                {name: 'WITH_API', value: 'true'}
              ],
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('wekan.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new WekanChart(app, 'wekan');
app.synth();
