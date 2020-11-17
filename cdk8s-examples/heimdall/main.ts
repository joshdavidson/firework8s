import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class MyChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('heimdall.lan', this.getIngressBackend());
  }

  private getConfigMap() {
    const configMap = new kplus.ConfigMap(this, 'config');
    configMap.addData('PUID', '1000');
    configMap.addData('PGID', '1000');
    configMap.addData('TZ', 'America/New_York');

    return configMap;
  }

  private getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/heimdall',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 80,
      volumeMounts: []
    });
    container.addEnv('PUID', kplus.EnvValue.fromConfigMap(this.getConfigMap(), 'PUID'));
    container.addEnv('PGID', kplus.EnvValue.fromConfigMap(this.getConfigMap(), 'PGID'));
    container.addEnv('TZ',   kplus.EnvValue.fromConfigMap(this.getConfigMap(), 'TZ'));
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
new MyChart(app, 'heimdall');
app.synth();
