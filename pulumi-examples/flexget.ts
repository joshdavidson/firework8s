import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class FlexGet extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:FlexGet', name, {}, opts);

        const appLabels = { app: 'flexget' };

        new kx.PersistentVolumeClaim('flexget-conf', {
            metadata: { name: 'flexget-conf' },
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
        new kx.PersistentVolumeClaim('flexget-data', {
            metadata: { name: 'flexget-data' },
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

        new kx.Service('flexget-service', {
            metadata: {
                name: 'flexget'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 5050, targetPort: 5050}]
            }
        });

        new k8s.networking.v1.Ingress('flexget-ingress', {
            metadata: {
                name: 'flexget'
            },
            spec: {
                rules: [{
                    host: 'flexget.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'flexget',
                                        port: {number: 5050}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('flexget', {
            metadata: {
                name: 'flexget'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'flexget-conf', persistentVolumeClaim: {claimName: 'flexget-config'}},
                            {name: 'flexget-data', persistentVolumeClaim: {claimName: 'flexget-data'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'movies', hostPath: {path: '/mnt/share/Movies'}},
                            {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
                        ],
                        containers: [{
                            name: 'flexget',
                            image: 'wiserain/server',

                            ports: [{containerPort: 5050}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'FG_WEBUI_PASSWD', value: 'password'},
                                {name: 'FG_LOG_LEVEL', value: 'info'}
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'flexget-conf'},
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
    }
}

