import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class KomgaChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('komga.lan', this.getIngressBackend());
  }

  private static getContainer() {
    return new kplus.Container( {
      name: 'komga',
      image: 'gotson/komga',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8080,
      args:[ '--user 1000:1000' ],
      volumeMounts:[
        {
          path: '/config',
          volume: kplus.Volume.fromEmptyDir('config')
        },
        {
          path: '/comics',
          volume: kplus.Volume.fromEmptyDir('comics')
        }
      ]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ KomgaChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8080));
  }

}

const app = new App();
new KomgaChart(app, 'komga');
app.synth();
