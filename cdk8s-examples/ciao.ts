import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class CiaoChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('ciao.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'brotandgames/ciao',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 3000,
      volumeMounts:[{
        path: '/app/db/sqlite',
        volume: kplus.Volume.fromEmptyDir('data')
      }]
    });

    container.addEnv('SECRET_KEY_BASE', kplus.EnvValue.fromValue('sensitive_secret_key_base'));
    container.addEnv('SMTP_ADDRESS', kplus.EnvValue.fromValue('smtp.sendgrid.net'));
    container.addEnv('SMTP_EMAIL_FROM',   kplus.EnvValue.fromValue('noreply@ciao.lan'));
    container.addEnv('SMTP_EMAIL_TO',   kplus.EnvValue.fromValue('yourname@youremail.com'));
    container.addEnv('SMTP_PORT', kplus.EnvValue.fromValue('587'));
    container.addEnv('SMTP_AUTHENTICATION', kplus.EnvValue.fromValue('plain'));
    container.addEnv('SMTP_ENABLE_STARTTLS_AUTO', kplus.EnvValue.fromValue('true'));
    container.addEnv('SMTP_DOMAIN',   kplus.EnvValue.fromValue('smtp.sendgrid.net'));
    container.addEnv('SMTP_USERNAME',   kplus.EnvValue.fromValue('apikey'));
    container.addEnv('SMTP_PASSWORD',   kplus.EnvValue.fromValue('enter your sendgrid api password'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ CiaoChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(3000));
  }

}

const app = new App();
new CiaoChart(app, 'ciao');
app.synth();
