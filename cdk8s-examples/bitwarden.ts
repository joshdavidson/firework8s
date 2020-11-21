import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class BitwardenChart extends Chart {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        const label = {app: 'bitwarden'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: { name: 'bitwarden' },
            spec: {
                storageClassName: 'default',
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: '250Mi'
                    }
                }
            }
        });

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{
                            name: 'data',
                            persistentVolumeClaim: {claimName: 'bitwarden'}
                        }],
                        containers: [{
                            name: 'bitwarden',
                            image: 'bitwardenrs/server',
                            ports: [{containerPort: 80}],
                            volumeMounts: [{mountPath: '/data', name: 'data'}]
                        }]
                    }
                }
            }
        });

        const service = new Service(this, 'service',{
            ports: [{port: 80, targetPort: 80}],
        });
        service.addSelector('app', label.app);

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('bitwarden.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new BitwardenChart(app, 'bitwarden');
app.synth();
