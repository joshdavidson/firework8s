import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class LazyLibrarianChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'lazylibrarian'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'lazylibrarian'
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
            ports: [{port: 5299, targetPort: 5299}]
        });
        service.addSelector('app', 'lazylibrarian');

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
                            {name: 'lazylibrarian', persistentVolumeClaim: {claimName: 'lazylibrarian'}},
                            {name: 'books', hostPath: {path: '/mnt/share/eBooks'}}
                        ],
                        containers: [{
                            name: 'lazylibrarian',
                            image: 'linuxserver/lazylibrarian',

                            ports: [{containerPort: 5299}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'lazylibrarian'},
                                {mountPath: '/books', name: 'books'}
                            ]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('lazylibrarian.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new LazyLibrarianChart(app, 'lazylibrarian');
app.synth();
