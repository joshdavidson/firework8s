import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class JellyfinChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('jellyfin.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/jellyfin',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 8096,
      volumeMounts:[
        {
          path: '/config',
          volume: kplus.Volume.fromEmptyDir('config')
        },
        {
          path: '/data/tvshows',
          volume: kplus.Volume.fromEmptyDir('tv')
        },
        {
          path: '/data/movies',
          volume: kplus.Volume.fromEmptyDir('movies')
        },
      ]
    });

    container.addEnv('PUID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('PGID', kplus.EnvValue.fromValue('1000'));
    container.addEnv('TZ',   kplus.EnvValue.fromValue('America/New_York'));

    return container;
  }

  private getDeployment() {
    return new kplus.Deployment(this, 'deployment', {
      containers: [ JellyfinChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(8096));
  }

}

const app = new App();
new JellyfinChart(app, 'jellyfin');
app.synth();
