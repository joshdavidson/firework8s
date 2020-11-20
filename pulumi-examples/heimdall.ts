import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Heimdall extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Heimdall', name, {}, opts);

        const appLabels = { app: 'heimdall' };

        new kx.PersistentVolumeClaim('heimdall-pvc', {
            metadata: { name: 'heimdall' },
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

        new kx.Service('heimdall-service', {
            metadata: {
                name: 'heimdall'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 80, targetPort: 80}]
            }
        });

        new k8s.networking.v1.Ingress('heimdall-ingress', {
            metadata: {
                name: 'heimdall'
            },
            spec: {
                rules: [{
                    host: 'heimdall.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'heimdall',
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

        new k8s.apps.v1.Deployment('heimdall', {
            metadata: {
                name: 'heimdall'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'heimdall'}
                                }],
                        containers: [{
                            name: 'heimdall',
                            image: 'linuxserver/heimdall',
                            //imagePullPolicy: 'Always',
                            ports: [{containerPort: 80}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'config'}]
                        }]
                    }
                }
            }
        });
    }
}

