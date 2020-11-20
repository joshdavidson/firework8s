import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Radarr extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Radarr', name, {}, opts);

        const appLabels = { app: 'radarr' };

        new kx.PersistentVolumeClaim('radarr-pvc', {
            metadata: { name: 'radarr-pvc', namespace: 'arr-apps'},
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

        new kx.Service('radarr-service', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 7878, targetPort: 7878}]
            }
        });

        new k8s.networking.v1.Ingress('radarr-ingress', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'radarr.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'radarr',
                                        port: {number: 7878}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('radarr', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'radarr-pvc'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'movies', hostPath: {path: '/mnt/share/Movies'}}
                        ],
                        containers: [{
                            name: 'radarr',
                            image: 'linuxserver/radarr:nightly',

                            ports: [{containerPort: 7878}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/movies', name: 'movies'},
                            ]
                        }]
                    }
                }
            }
        });
    }
}

