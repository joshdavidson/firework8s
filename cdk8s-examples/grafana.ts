import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class GrafanaChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('grafana.lan', this.getIngressBackend());
  }

  private static getContainer() {
    return new kplus.Container( {
      image: 'grafana/grafana',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 3000,
      volumeMounts:[{
        path: '/config',
        volume: kplus.Volume.fromEmptyDir('config'),
      }]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [GrafanaChart.getContainer()]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(3000));
  }

}

const app = new App();
new GrafanaChart(app, 'grafana');
app.synth();
