import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class StuffInSpaceChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('stuffinspace.lan', this.getIngressBackend());
  }
  private static getContainer() {
    const container = new kplus.Container({
      image: 'joshdavidson/stuffinspace',
      port: 80
    });

    container.addEnv('APACHE_SERVER_NAME', kplus.EnvValue.fromValue('stuffinspace.lan'));
    container.addEnv('CONTAINER_TIMEZONE', kplus.EnvValue.fromValue('America/New_York'));

    return container;
  }
  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers:[ StuffInSpaceChart.getContainer() ]
    });
  }
  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(80));
  }
}

const app = new App();
new StuffInSpaceChart(app, 'stuffinspace');
app.synth();
