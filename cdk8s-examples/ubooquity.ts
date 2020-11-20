import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class UbooquityChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'ubooquity'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'ubooquity'
            },
            spec: {
                storageClassName: 'default',
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: '1Gi'
                    }
                }
            }
        });

        const service = new Service(this, 'service', {
            ports: [{port: 2202}]
        });
        service.addSelector('app', 'ubooquity');

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [
                            {name: 'ubooquity', persistentVolumeClaim: {claimName: 'ubooquity'}},
                            {name: 'books', hostPath: {path: '/mnt/share/eBooks'}},
                            {name: 'comics', hostPath: {path: '/mnt/share/Comics'}}
                        ],
                        containers: [{
                            name: 'ubooquity',
                            image: 'linuxserver/ubooquity',

                            ports: [{containerPort: 2202},
                                {containerPort: 2203}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'ubooquity'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/books', name: 'books'}
                            ]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('ubooquity.lan', IngressBackend.fromService(service));
        ingress.addRule("/ubooquity", IngressBackend.fromService(service));
    }
}

const app = new App();
new UbooquityChart(app, 'ubooquity');
app.synth();
