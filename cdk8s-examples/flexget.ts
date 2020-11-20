import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class FlexGetChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'flexget'};

        new PersistentVolumeClaim(this, 'flexget-config', {
            metadata: {
                name: 'flexget-config'
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

        new PersistentVolumeClaim(this, 'flexget-data', {
            metadata: {
                name: 'flexget-data'
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
            ports: [{port: 5050, targetPort: 5050}]
        });
        service.addSelector('app', 'flexget');

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
                            {name: 'flexget-config', persistentVolumeClaim: {claimName: 'flexget-config'}},
                            {name: 'flexget-data', persistentVolumeClaim: {claimName: 'flexget-data'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'movies', hostPath: {path: '/mnt/share/Movies'}},
                            {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
                        ],
                        containers: [{
                            name: 'flexget',
                            image: 'wiserain/flexget',

                            ports: [{containerPort: 5050}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'FG_WEBUI_PASSWD', value: 'password'},
                                {name: 'FG_LOG_LEVEL', value: 'info'}
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'flexget-config'},
                                {mountPath: '/data', name: 'flexget-data'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/movies', name: 'movies'},
                                {mountPath: '/tv', name: 'tv'}
                            ]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('flexget.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new FlexGetChart(app, 'flexget');
app.synth();
