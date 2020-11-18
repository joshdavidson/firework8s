import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class FlexGetChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('flexget.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'wiserain/flexget',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 5050,
      volumeMounts:[
        { path: '/config',
          volume: kplus.Volume.fromEmptyDir('config')
        },
        { path: '/data',
          volume: kplus.Volume.fromEmptyDir('data')
        }
      ]
    });

    container.addEnv('PUID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('PGID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));
    container.addEnv('FG_WEBUI_PASSWD',   kplus.EnvValue.fromValue('password'));
    container.addEnv('FG_LOG_LEVEL',   kplus.EnvValue.fromValue('info'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ FlexGetChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(5050));
  }

}

const app = new App();
new FlexGetChart(app, 'flexget');
app.synth();
