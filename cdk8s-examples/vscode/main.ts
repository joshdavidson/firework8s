import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class MyChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('vscode.lan', this.getIngressBackend());
  }

  private getConfigMap() {
    const configMap = new kplus.ConfigMap(this, 'config');
    configMap.addData('PUID', '1000');
    configMap.addData('PGID', '1000');
    configMap.addData('TZ', 'America/New_York');
    configMap.addData('PASSWORD', 'password');
    configMap.addData('SUDO_PASSWORD', 'password');

    return configMap;
  }

  private getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/code-server',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8443,
      volumeMounts: []
    });

    let keys = ['PUID', 'PGID', 'TZ', 'PASSWORD', 'SUDO_PASSWORD'];
    for (let key in keys) {
      container.addEnv(key, kplus.EnvValue.fromConfigMap(this.getConfigMap(), key));
    }
    container.mount('/config', MyChart.getVolume());

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [this.getContainer()]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(80));
  }

  private static getVolume() {
    return kplus.Volume.fromEmptyDir('config');
  }

}


const app = new App();
new MyChart(app, 'vscode');
app.synth();
