import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export class LazyLibrarianChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const ingress = new kplus.Ingress(this, 'ingress');
    ingress.addHostDefaultBackend('lazylibrarian.lan', this.getIngressBackend());
  }

  private static getContainer() {
    const container = new kplus.Container( {
      image: 'linuxserver/lazylibrarian',
      imagePullPolicy: kplus.ImagePullPolicy.ALWAYS,
      port: 5299,
      volumeMounts:[
        {
          path: '/config',
          volume: kplus.Volume.fromEmptyDir('config')
        },
        {
          path: '/books',
          volume: kplus.Volume.fromEmptyDir('books')
        },
        {
          path: '/comics',
          volume: kplus.Volume.fromEmptyDir('comics')
        },
        {
          path: '/downloads',
          volume: kplus.Volume.fromEmptyDir('downloads')
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
      containers: [ LazyLibrarianChart.getContainer() ]
    });
  }

  private getIngressBackend() {
    return kplus.IngressBackend.fromService(this.getDeployment().expose(5299));
  }

}

const app = new App();
new LazyLibrarianChart(app, 'lazylibrarian');
app.synth();
