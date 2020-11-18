import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class WallabagChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('wallabag.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'wallabag/wallabag',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 80,
      volumeMounts:[{
        path: '/var/www/wallabag/data',
        volume: kplus.Volume.fromEmptyDir('data'),
      }]
    });

    container.addEnv('SYMFONY__ENV__DOMAIN_NAME', kplus.EnvValue.fromValue('http://wallabag.lan'));
    container.addEnv('POPULATE_DATABASE', kplus.EnvValue.fromValue('True'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ WallabagChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(80));
  }

}

const app = new App();
new WallabagChart(app, 'wallabag');
app.synth();
