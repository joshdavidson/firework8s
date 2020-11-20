import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Readarr extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Readarr', name, {}, opts);

        const appLabels = { app: 'readarr' };

        new kx.PersistentVolumeClaim('readarr-pvc', {
            metadata: { name: 'readarr-pvc', namespace: 'arr-apps'},
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

        new kx.Service('readarr-service', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 8787, targetPort: 8787}]
            }
        });

        new k8s.networking.v1.Ingress('readarr-ingress', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'readarr.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'readarr',
                                        port: {number: 8787}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('readarr', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'readarr-pvc'}},
                            {name: 'books', hostPath: {path: '/mnt/share/eBooks'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}}
                        ],
                        containers: [{
                            name: 'readarr',
                            image: 'hotio/readarr:nightly',

                            ports: [{containerPort: 8787}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/books', name: 'books'},
                                {mountPath: '/downloads', name: 'downloads'},
                            ]
                        }]
                    }
                }
            }
        });
    }
}

