import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Grafana extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Grafana', name, {}, opts);

        const appLabels = { app: 'grafana' };

        new kx.PersistentVolumeClaim('grafana-pvc', {
            metadata: { name: 'grafana' },
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

        new kx.Service('grafana-service', {
            metadata: {
                name: 'grafana'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 3000, targetPort: 3000}]
            }
        });

        new k8s.networking.v1.Ingress('grafana-ingress', {
            metadata: {
                name: 'grafana'
            },
            spec: {
                rules: [{
                    host: 'grafana.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'grafana',
                                        port: {number: 3000}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('grafana', {
            metadata: {
                name: 'grafana'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'grafana'}
                                }],
                        containers: [{
                            name: 'grafana',
                            image: 'grafana/grafana',
                            //imagePullPolicy: 'Always',
                            ports: [{containerPort: 3000}],
                            env: [
                                {name: 'GF_INSTALL_PLUGINS', value: 'grafana-piechart-panel,grafana-worldmap-panel'},
                                {name: 'GF_PATHS_DATA', value: '/config/data'},
                                {name: 'GF_PATHS_LOGS', value: '/config/logs'},
                                {name: 'GF_PATHS_PLUGINS', value: '/config/plugins'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'config'}]
                        }]
                    }
                }
            }
        });
    }
}

