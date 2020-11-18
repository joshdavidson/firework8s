import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class GapsChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('gaps.lan', this.getIngressBackend());
  }

  private static getContainer() {
    return new kplus.Container( {
      image: 'housewrecker/gaps',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8484,
      volumeMounts:[{
        path: '/usr/data',
        volume: kplus.Volume.fromEmptyDir('data'),
      }]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [GapsChart.getContainer()]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8484));
  }

}

const app = new App();
new GapsChart(app, 'gaps');
app.synth();
