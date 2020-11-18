import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class VsCodeChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('vscode.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/code-server',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8443,
      volumeMounts:[{
        path: '/config',
        volume: kplus.Volume.fromEmptyDir('config'),
      }]
    });

    container.addEnv('PUID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('PGID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));
    container.addEnv('PASSWORD', kplus.EnvValue.fromValue('PASSWORD'));
    container.addEnv('SUDO_PASSWORD', kplus.EnvValue.fromValue('PASSWORD'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [VsCodeChart.getContainer()]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8443));
  }

}


const app = new App();
new VsCodeChart(app, 'vscode');
app.synth();
