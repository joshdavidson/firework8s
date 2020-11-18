import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class LidarrChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('lidarr.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/lidarr:nightly',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8686,
      volumeMounts:[
        {
          path: '/config',
          volume: kplus.Volume.fromEmptyDir('config'),
        },
        {
          path: '/downloads',
          volume: kplus.Volume.fromEmptyDir('downloads'),
        },
        {
          path: '/music',
          volume: kplus.Volume.fromEmptyDir('music'),
        }
      ]
    });

    container.addEnv('PUID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('PGID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ LidarrChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8686));
  }

}

const app = new App();
new LidarrChart(app, 'lidarr');
app.synth();
