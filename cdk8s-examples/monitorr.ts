import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class MonitorrChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'monitorr'};

        new PersistentVolumeClaim(this, 'monitorr', {
            metadata: {
                name: 'monitorr'
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
        service.addSelector('app', 'monitorr');

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
                            name: 'monitorr',
                            persistentVolumeClaim: {claimName: 'monitorr'}
                        }],
                        containers: [{
                            name: 'monitorr',
                            image: 'monitorr/monitorr',

                            ports: [{containerPort: 80}],
                            env: [
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'}
                            ],
                            volumeMounts: [{mountPath: '/app', name: 'monitorr'}]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('monitorr.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new MonitorrChart(app, 'monitorr');
app.synth();
