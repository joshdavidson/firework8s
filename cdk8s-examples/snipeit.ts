import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { ConfigMap, Deployment, PersistentVolumeClaim } from './imports/k8s'
import { Ingress, IngressBackend, Service } from 'cdk8s-plus';

export class SnipeItChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'snipeit'};

    new ConfigMap(this, 'configmap', {
      metadata: {
        name: 'snipeit-config'
      },
      data: {
        MYSQL_PORT_3306_TCP_ADDR: "mariadb",
        MYSQL_PORT_3306_TCP_PORT: "3306",
        MYSQL_ROOT_PASSWORD: "password",
        MYSQL_DATABASE: "snipeit",
        MYSQL_USER: "root",
        MYSQL_PASSWORD: "password",
        MAIL_PORT_587_TCP_ADDR: "smtp.sendgrid.net",
        MAIL_PORT_587_TCP_PORT: "587",
        MAIL_ENV_FROM_ADDR: "noreply@snipeit.lan",
        MAIL_ENV_FROM_NAME: "Snip-IT System E-mail",
        MAIL_ENV_ENCRYPTION: "tls",
        MAIL_ENV_USERNAME: "apikey",
        MAIL_ENV_PASSWORD: "YOUR_SENDGRID_KEY",
        APP_ENV: "production",
        APP_DEBUG: "false",
        APP_KEY: "base64:D5oGA+zhFSVA3VwuoZoQ21RAcwBtJv/RGiqOcZ7BUvI=",
        APP_URL: "http://snipeit.lan",
        APP_TIMEZONE: "US/New_York",
        APP_LOCALE: "en",
      }
    });

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'snipeit'
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
      ports: [{port: 80, targetPort: 80}]
    });
    service.addSelector('app', 'snipeit');

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'snipeit', persistentVolumeClaim: {claimName: 'snipeit'}}],
            containers: [{
              name: 'snipeit',
              image: 'snipeit/snipeit',
              //imagePullPolicy: 'Always',
              ports: [{containerPort: 80}],
              envFrom: [{ configMapRef: {name: 'snipeit-config'}}],
              volumeMounts: [
                {mountPath: '/config', name: 'snipeit'}
              ]
            }]
          }
        }
      }
    });

    const ingress = new Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('snipeit.lan', IngressBackend.fromService(service));
  }
}

const app = new App();
new SnipeItChart(app, 'snipeit');
app.synth();
