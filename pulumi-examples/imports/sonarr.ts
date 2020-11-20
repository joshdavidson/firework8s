import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Sonarr extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Sonarr', name, {}, opts);

        const appLabels = { app: 'sonarr' };

        new kx.PersistentVolumeClaim('sonarr-pvc', {
            metadata: { name: 'sonarr', namespace: 'arr-apps'},
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

        new kx.Service('sonarr-service', {
            metadata: { name: 'sonarr', namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 8989, targetPort: 8989}]
            }
        });

        new k8s.networking.v1.Ingress('sonarr-ingress', {
            metadata: { name: 'sonarr', namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'sonarr.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'sonarr',
                                        port: {number: 8989}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('sonarr', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'sonarr'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
                        ],
                        containers: [{
                            name: 'sonarr',
                            image: 'linuxserver/sonarr:latest',

                            ports: [{containerPort: 8989}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/tv', name: 'tv'},
                            ]
                        }]
                    }
                }
            }
        });
    }
}

