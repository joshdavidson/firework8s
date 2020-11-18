import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class HugginChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('huggin.lan', this.getIngressBackend());
  }

  private static getContainer() {
    return new kplus.Container( {
      image: 'huginn/huginn',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 3000,
      volumeMounts:[{
        path: '/var/lib/mysql',
        volume: kplus.Volume.fromEmptyDir('data'),
      }]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ HugginChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(3000));
  }

}

const app = new App();
new HugginChart(app, 'huggin');
app.synth();
