import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Lidarr extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Lidarr', name, {}, opts);

        const appLabels = { app: 'lidarr' };

        new kx.PersistentVolumeClaim('lidarr-pvc', {
            metadata: { name: 'lidarr', namespace: 'arr-apps'},
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

        new kx.Service('lidarr-service', {
            metadata: { name: 'lidarr', namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 8686, targetPort: 8686}]
            }
        });

        new k8s.networking.v1.Ingress('lidarr-ingress', {
            metadata: { name: 'lidarr', namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'lidarr.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'lidarr',
                                        port: {number: 8686}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('lidarr', {
            metadata: { name: 'lidarr', namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'lidarr'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}},
                            {name: 'music', hostPath: {path: '/mnt/share/Music'}}
                        ],
                        containers: [{
                            name: 'lidarr',
                            image: 'linuxserver/lidarr',
                            //imagePullPolicy: 'Always',
                            ports: [{containerPort: 8686}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/downloads', name: 'downloads'},
                                {mountPath: '/music', name: 'music'},
                            ]
                        }]
                    }
                }
            }
        });
    }
}

