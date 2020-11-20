import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Homer extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Homer', name, {}, opts);

        const appLabels = { app: 'homer' };

        new kx.PersistentVolumeClaim('homer-pvc', {
            metadata: { name: 'homer' },
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

        new kx.Service('homer-service', {
            metadata: {
                name: 'homer'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 8080, targetPort: 8080}]
            }
        });

        new k8s.networking.v1.Ingress('homer-ingress', {
            metadata: {
                name: 'homer'
            },
            spec: {
                rules: [{
                    host: 'homer.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'homer',
                                        port: {number: 8080}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('homer', {
            metadata: {
                name: 'homer'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'homer'}
                                }],
                        containers: [{
                            name: 'homer',
                            image: 'b4bz/homer',

                            ports: [{containerPort: 8080}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [{mountPath: '/www/assets', name: 'data'}]
                        }]
                    }
                }
            }
        });
    }
}

