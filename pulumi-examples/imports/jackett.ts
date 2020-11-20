import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Jackett extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Jackett', name, {}, opts);

        const appLabels = { app: 'jackett' };

        new kx.PersistentVolumeClaim('jackett-pvc', {
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

        new kx.Service('jackett-service', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 9117, targetPort: 9117}]
            }
        });

        new k8s.networking.v1.Ingress('jackett-ingress', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'jackett.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'jackett',
                                        port: {number: 9117}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('jackett', {
            metadata: { namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'jackett'}
                                }],
                        containers: [{
                            name: 'jackett',
                            image: 'linuxserver/jackett:latest',

                            ports: [{containerPort: 9117}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'AUTO_UPDATE', value: 'true'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'config'}]
                        }]
                    }
                }
            }
        });
    }
}

