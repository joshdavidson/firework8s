import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class CodeServer extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions | undefined) {
        super('pkg:index:CodeServer', name, {}, opts);

        const appLabels = {app: 'code-server'};

        new kx.PersistentVolumeClaim('pvc', {
            metadata: {
                name: 'code-server'
            },
            spec: {
                storageClassName: 'default',
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: '250Mi'
                    }
                }
            }
        })

        new kx.Service('service', {
            metadata: {
                name: 'code-server'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 8443, targetPort: 8443}]
            }
        });

        new k8s.networking.v1.Ingress('ingress', {
            metadata: {
                name: 'code-server'
            },
            spec: {
                rules: [{
                    host: 'code-server.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'code-server',
                                        port: {number: 8443}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('code-server', {
            metadata: {
                name: 'code-server'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'code-server'}
                                }],
                        containers: [{
                            name: 'code-server',
                            image: 'linuxserver/code-server:latest',
                            imagePullPolicy: 'Always',
                            ports: [{containerPort: 8443}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [{ mountPath: '/config', name: 'config' }]
                        }]
                    }
                }
            }
        });
    }
}

