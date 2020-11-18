import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class HomeAssistantChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('homeassistant.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'homeassistant/home-assistant:stable',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8123,
      volumeMounts:[{
        path: '/config',
        volume: kplus.Volume.fromEmptyDir('config'),
      }]
    });
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ HomeAssistantChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8123));
  }

}

const app = new App();
new HomeAssistantChart(app, 'homeassistant');
app.synth();
