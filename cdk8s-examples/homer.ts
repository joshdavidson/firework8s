import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class HomerChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('homer.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'b4bz/homer',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8080,
      volumeMounts:[{
        path: '/www/assets',
        volume: kplus.Volume.fromEmptyDir('assets'),
      }]
    });

    container.addEnv('UID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('GID', kplus.EnvValue.fromValue('1000'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ HomerChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8080));
  }

}

const app = new App();
new HomerChart(app, 'homer');
app.synth();
