import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class JackettChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('jackett.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/jackett',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 9117,
      volumeMounts:[{
        path: '/config',
        volume: kplus.Volume.fromEmptyDir('config'),
      }]
    });

    container.addEnv('PUID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('PGID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));
    container.addEnv('AUTO_UPDATE',   kplus.EnvValue.fromValue('true'));


    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ JackettChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(9117));
  }

}

const app = new App();
new JackettChart(app, 'jackett');
app.synth();
