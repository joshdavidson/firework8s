import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class HeimdallChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'heimdall'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'heimdall'
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
        service.addSelector('app', 'heimdall');

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{name: 'heimdall', persistentVolumeClaim: {claimName: 'heimdall'}}],
                        containers: [{
                            name: 'heimdall',
                            image: 'linuxserver/heimdall',

                            ports: [{containerPort: 80}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'heimdall'}]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('heimdall.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new HeimdallChart(app, 'heimdall');
app.synth();
