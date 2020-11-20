import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class GrocyChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'grocy'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'grocy'
            },
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

        const service = new Service(this, 'service', {
            ports: [{port: 80, targetPort: 80}]
        });
        service.addSelector('app', 'grocy');

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{name: 'grocy', persistentVolumeClaim: {claimName: 'grocy'}}],
                        containers: [{
                            name: 'grocy',
                            image: 'linuxserver/grocy',

                            ports: [{containerPort: 80}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'grocy'}]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('grocy.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new GrocyChart(app, 'grocy');
app.synth();
