import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class JackettChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'jackett'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'jackett'
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
            ports: [{port: 9117, targetPort: 9117}]
        });
        service.addSelector('app', 'jackett');

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{name: 'jackett', persistentVolumeClaim: {claimName: 'jackett'}}],
                        containers: [{
                            name: 'jackett',
                            image: 'linuxserver/jackett',

                            ports: [{containerPort: 9117}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'AUTO_UPDATE', value: 'true'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'jackett'}]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('jackett.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new JackettChart(app, 'jackett');
app.synth();
