import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class WekanChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('wekan.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'wekanteam/wekan',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8080
    });

    container.addEnv('BIGEVENTS_PATTERN', kplus.EnvValue.fromValue('NONE'));
    container.addEnv('BROWSER_POLICY_ENABLED', kplus.EnvValue.fromValue('true'));
    container.addEnv('CARD_OPENED_WEBHOOK_ENABLED', kplus.EnvValue.fromValue('false'));
    container.addEnv('MAIL_FROM', kplus.EnvValue.fromValue('Wekan Notifications <noreply.wekan@mydomain.com>'));
    container.addEnv('MAIL_URL', kplus.EnvValue.fromValue('smtp://smtp.sendgrid.net:25/?ignoreTLS=true&tls={rejectUnauthorized:false}'));
    container.addEnv('MONGO_URL', kplus.EnvValue.fromValue('mongodb://mongo:27017/wekan'));
    container.addEnv('RICHER_CARD_COMMENT_EDITOR', kplus.EnvValue.fromValue('false'));
    container.addEnv('ROOT_URL', kplus.EnvValue.fromValue('http://wekan.lan'));
    container.addEnv('SCROLLAMOUNT', kplus.EnvValue.fromValue('auto'));
    container.addEnv('SCROLLINERTIA', kplus.EnvValue.fromValue('0'));
    container.addEnv('WITH_API', kplus.EnvValue.fromValue('true'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ WekanChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8080));
  }

}

const app = new App();
new WekanChart(app, 'wekan');
app.synth();
