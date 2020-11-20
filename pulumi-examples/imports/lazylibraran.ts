import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class LazyLibrarian extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:LazyLibrarian', name, {}, opts);

        const appLabels = { app: 'lazylibrarian' };

        new kx.PersistentVolumeClaim('lazylibrarian-pvc', {
            metadata: { namespace: 'arr-apps'},
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

        new kx.Service('lazylibrarian-service', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 5299, targetPort: 5299}]
            }
        });

        new k8s.networking.v1.Ingress('lazylibrarian-ingress', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'lazylibrarian.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'lazylibrarian',
                                        port: {number: 5299}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('lazylibrarian', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'lazylibrarian'}},
                            {name: 'books', hostPath: {path: '/mnt/share/eBooks'}}
                        ],
                        containers: [{
                            name: 'lazylibrarian',
                            image: 'linuxserver/lazylibrarian:latest',

                            ports: [{containerPort: 5299}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/books', name: 'books'}
                            ]
                        }]
                    }
                }
            }
        });
    }
}

