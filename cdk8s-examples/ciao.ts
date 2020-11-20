import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class CiaoChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);

    const label = {app: 'ciao'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {name: 'ciao'},
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
    service.addSelector('app', 'ciao');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{
              name: 'ciao',
              persistentVolumeClaim: {claimName: 'ciao'}
            }],
            containers: [{
              name: 'ciao',
              image: 'brotandgames/ciao',

              ports: [{containerPort: 3000}],
              env: [
                {name: 'SECRET_KEY_BASE', value: 'sensitive_secret_key_base'},
                {name: 'SMTP_ADDRESS', value: 'smtp.sendgrid.net'},
                {name: 'SMTP_EMAIL_FROM', value: 'noreply@ciao.lan'},
                {name: 'SMTP_EMAIL_TO', value: 'yourname@youremail.com'},
                {name: 'SMTP_PORT', value: '587'},
                {name: 'SMTP_AUTHENTICATION', value: 'plain'},
                {name: 'SMTP_DOMAIN', value: 'smtp.sendgrid.net'},
                {name: 'SMTP_ENABLE_STARTTLS_AUTO', value: 'true'},
                {name: 'SMTP_USERNAME', value: 'apikey'},
                {name: 'SMTP_PASSWORD', value: 'your sendgrid api key'}
              ],
              volumeMounts: [{mountPath: '/app/db/sqlite', name: 'ciao'}]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('ciao.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new CiaoChart(app, 'ciao');
app.synth();
