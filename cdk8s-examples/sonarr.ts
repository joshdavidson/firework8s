import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class SonarrChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'sonarr'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'sonarr'
            },
            spec: {
                storageClassName: 'default',
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: '2Gi'
                    }
                }
            }
        });

        const service = new Service(this, 'service', {
            ports: [{port: 8989, targetPort: 8989}]
        });
        service.addSelector('app', 'sonarr');

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
                            {name: 'sonarr', persistentVolumeClaim: {claimName: 'sonarr'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
                        ],
                        containers: [{
                            name: 'sonarr',
                            image: 'linuxserver/sonarr',

                            ports: [{containerPort: 8989}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'sonarr'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/tv', name: 'tv'}
                            ]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('sonarr.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new SonarrChart(app, 'sonarr');
app.synth();
