import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class BookStack extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:BookStack', name, {}, opts);

        const appLabels = { app: 'bookstack' };

        new kx.PersistentVolumeClaim('bookstack-pvc', {
            metadata: { name: 'bookstack' },
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

        new kx.Service('bookstack-service', {
            metadata: {
                name: 'bookstack'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 80, targetPort: 80}]
            }
        });

        new k8s.networking.v1.Ingress('bookstack-ingress', {
            metadata: {
                name: 'bookstack'
            },
            spec: {
                rules: [{
                    host: 'bookstack.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'bookstack',
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

        new k8s.apps.v1.Deployment('bookstack', {
            metadata: {
                name: 'bookstack'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'bookstack'}
                                }],
                        containers: [{
                            name: 'bookstack',
                            image: 'linuxserver/bookstack',
                            //imagePullPolicy: 'Always',
                            ports: [{containerPort: 80}],
                            env: [
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'DB_HOST', value: 'mariadb'},
                                {name: 'DB_USER', value: 'root'},
                                {name: 'DB_PASS', value: 'password'},
                                {name: 'DB_DATABASE', value: 'bookstackapp'},
                                {name: 'APP_URL', value: 'http://bookstack.lan'}
                            ],
                            volumeMounts: [{ mountPath: '/config', name: 'config' }]
                        }]
                    }
                }
            }
        });
    }
}

