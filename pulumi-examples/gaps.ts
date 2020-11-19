import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Gaps extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions | undefined) {
        super('pkg:index:Gaps', name, {}, opts);

        const appLabels = { app: 'gaps' };

        new kx.PersistentVolumeClaim('gaps-pvc', {
            metadata: { name: 'gaps' },
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

        new kx.Service('gaps-service', {
            metadata: {
                name: 'gaps'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 8484, targetPort: 8484}]
            }
        });

        new k8s.networking.v1.Ingress('gaps-ingress', {
            metadata: {
                name: 'gaps'
            },
            spec: {
                rules: [{
                    host: 'gaps.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'gaps',
                                        port: {number: 8484}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('gaps', {
            metadata: {
                name: 'gaps'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'gaps'}
                                }],
                        containers: [{
                            name: 'gaps',
                            image: 'housewrecker/gaps',
                            imagePullPolicy: 'Always',
                            ports: [{containerPort: 8484}],
                            volumeMounts: [{ mountPath: '/usr/data', name: 'data' }]
                        }]
                    }
                }
            }
        });
    }
}

