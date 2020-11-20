import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Grocy extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Grocy', name, {}, opts);

        const appLabels = { app: 'grocy' };

        new kx.PersistentVolumeClaim('grocy-pvc', {
            metadata: { name: 'grocy' },
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

        new kx.Service('grocy-service', {
            metadata: {
                name: 'grocy'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 80, targetPort: 80}]
            }
        });

        new k8s.networking.v1.Ingress('grocy-ingress', {
            metadata: {
                name: 'grocy'
            },
            spec: {
                rules: [{
                    host: 'grocy.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'grocy',
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

        new k8s.apps.v1.Deployment('grocy', {
            metadata: {
                name: 'grocy'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'grocy'}
                                }],
                        containers: [{
                            name: 'grocy',
                            image: 'linuxserver/grocy',
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

