import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class CyberChefChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('cyberchef.lan', this.getIngressBackend());
  }

  private getIngressBackend() {
    const deploy = new kplus.Deployment(this, 'deployment', {
      containers: [
          new kplus.Container({
            image: 'mpepping/cyberchef',
            port: 8000
          })
      ]
    });
    return kplus.IngressBackend.fromService(deploy.expose(8000));
  }

}

const app = new App();
new CyberChefChart(app, 'cyberchef');
app.synth();
