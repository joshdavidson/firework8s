import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class SickGear extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:SickGear', name, {}, opts);

        const appLabels = { app: 'sickgear' };

        new kx.PersistentVolumeClaim('sickgear-pvc', {
            metadata: { name: 'sickgear', namespace: 'arr-apps' },
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

        new kx.Service('sickgear-service', {
            metadata: { name: 'sickgear', namespace: 'arr-apps' },
            spec: {
                selector: appLabels,
                ports: [{port: 8081, targetPort: 8081}]
            }
        });

        new k8s.networking.v1.Ingress('sickgear-ingress', {
            metadata: { name: 'sickgear', namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'sickgear.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'sickgear',
                                        port: {number: 8081}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('sickgear', {
            metadata: { name: 'sickgear', namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'sickgear'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'tv', hostPath: {path: '/mnt/share/Television'}}
                        ],
                        containers: [{
                            name: 'sickgear',
                            image: 'linuxserver/sickgear:latest',
                            //imagePullPolicy: 'Always',
                            ports: [{containerPort: 8081}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/tv', name: 'tv'},
                            ]
                        }]
                    }
                }
            }
        });
    }
}

