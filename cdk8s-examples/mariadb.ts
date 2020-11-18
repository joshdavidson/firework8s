import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class MariaDbChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    this.getDeployment().expose(3306 );
  }

  private static getContainer() {
    return new kplus.Container( {
      image: 'mariadb',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 3306,
      volumeMounts:[{
        path: '/var/lib/mysql',
        volume: kplus.Volume.fromEmptyDir('data'),
      }]
    });
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ MariaDbChart.getContainer() ]
    });
  }

}

const app = new App();
new MariaDbChart(app, 'mariadb');
app.synth();
