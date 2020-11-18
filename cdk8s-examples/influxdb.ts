import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class InfluxDbChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    this.getDeployment().expose(8086);
  }

  private static getContainer() {
    return new kplus.Container( {
      image: 'influxdb',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8086,
      volumeMounts:[{
        path: '/var/lib/influxdb',
        volume: kplus.Volume.fromEmptyDir('data'),
      }]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ InfluxDbChart.getContainer() ]
    });
  }

}

const app = new App();
new InfluxDbChart(app, 'influxdb');
app.synth();
