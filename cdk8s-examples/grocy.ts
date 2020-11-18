import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class GrocyChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('grocy.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/grocy',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 80,
      volumeMounts:[{
        path: '/config',
        volume: kplus.Volume.fromEmptyDir('config'),
      }]
    });

    container.addEnv('PUID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('PGID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ GrocyChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(80));
  }

}

const app = new App();
new GrocyChart(app, 'grocy');
app.synth();
