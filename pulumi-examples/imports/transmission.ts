import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Transmission extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Transmission', name, {}, opts);

        const appLabels = { app: 'transmission' };

        new kx.PersistentVolumeClaim('transmission-pvc', {
            metadata: { name: 'transmission', namespace: 'arr-apps'},
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

        new kx.Service('transmission-service', {
            metadata: { name: 'transmission', namespace: 'arr-apps'},
            spec: {
                selector: appLabels,
                ports: [{port: 9091, targetPort: 9091}]
            }
        });

        new k8s.networking.v1.Ingress('transmission-ingress', {
            metadata: { name: 'transmission', namespace: 'arr-apps'},
            spec: {
                rules: [{
                    host: 'transmission.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'transmission',
                                        port: {number: 9091}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('transmission', {
            metadata: { name: 'transmission', namespace: 'arr-apps'},
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes: [
                            {name: 'config', persistentVolumeClaim: {claimName: 'transmission'}},
                            {name: 'downloads', hostPath: {path: '/mnt/share/Downloads'}}
                        ],
                        containers: [{
                            name: 'transmission',
                            image: 'linuxserver/transmission:latest',

                            ports: [{containerPort: 9091}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'USER', value: 'transmission'},
                                {name: 'PASS', value: 'transmission'}
                            ],
                            volumeMounts: [
                                {mountPath: '/config', name: 'config'},
                                {mountPath: '/downloads', name: 'downloads'}
                            ]
                        }]
                    }
                }
            }
        });
    }
}

