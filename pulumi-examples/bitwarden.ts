import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class BitWarden extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:BitWarden', name, {}, opts);

        const appLabels = { app: 'bitwarden' };

        new kx.PersistentVolumeClaim('bitwarden-pvc', {
            metadata: { name: 'bitwarden' },
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

        new kx.Service('bitwarden-service', {
            metadata: {
                name: 'bitwarden'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 80, targetPort: 80}]
            }
        });

        new k8s.networking.v1.Ingress('bitwarden-ingress', {
            metadata: {
                name: 'bitwarden'
            },
            spec: {
                rules: [{
                    host: 'bitwarden.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'bitwarden',
                                        port: {number: 80}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('bitwarden', {
            metadata: {
                name: 'bitwarden'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'bitwarden'}
                                }],
                        containers: [{
                            name: 'bitwarden',
                            image: 'bitwardenrs/server',

                            ports: [{containerPort: 80}],
                            volumeMounts: [{ mountPath: '/data', name: 'data' }]
                        }]
                    }
                }
            }
        });
    }
}
