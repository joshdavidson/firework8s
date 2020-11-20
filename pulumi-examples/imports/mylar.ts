import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Mylar extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Mylar', name, {}, opts);

        const appLabels = { app: 'mylar' };

        new kx.PersistentVolumeClaim('mylar-pvc', {
            metadata: { name: 'mylar', namespace: 'arr-apps'},
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

        new kx.Service('mylar-service', {
            metadata: { name: 'mylar', namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 8090, targetPort: 8090}]
            }
        });

        new k8s.networking.v1.Ingress('mylar-ingress', {
            metadata: { name: 'mylar', namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'mylar.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'mylar',
                                        port: {number: 8090}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('mylar', {
            metadata: { name: 'mylar', namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'mylar'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'comics', hostPath: {path: '/mnt/share/Comics'}}
                        ],
                        containers: [{
                            name: 'mylar',
                            image: 'linuxserver/mylar3:latest',

                            ports: [{containerPort: 8090}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/comics', name: 'comics'},
                                {mountPath: '/downloads', name: 'downloads'},
                            ]
                        }]
                    }
                }
            }
        });
    }
}

