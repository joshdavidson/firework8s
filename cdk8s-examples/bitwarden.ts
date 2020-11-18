import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class BitwardenChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('bitwarden.lan', this.getIngressBackend());
  }

  private static getContainer() {
    return new kplus.Container( {
      image: 'bitwardenrs/server',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 80,
      volumeMounts:[{
        path: '/data',
        volume: kplus.Volume.fromEmptyDir('data'),
      }]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ BitwardenChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(80));
  }

}

const app = new App();
new BitwardenChart(app, 'bitwarden');
app.synth();
