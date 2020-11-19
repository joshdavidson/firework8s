import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Huginn extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions | undefined) {
        super('pkg:index:Huginn', name, {}, opts);

        const appLabels = { app: 'huginn' };

        new kx.PersistentVolumeClaim('huginn-pvc', {
            metadata: { name: 'huginn' },
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

        new kx.Service('huginn-service', {
            metadata: {
                name: 'huginn'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 3000, targetPort: 3000}]
            }
        });

        new k8s.networking.v1.Ingress('huginn-ingress', {
            metadata: {
                name: 'huginn'
            },
            spec: {
                rules: [{
                    host: 'huginn.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'huginn',
                                        port: {number: 3000}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('huginn', {
            metadata: {
                name: 'huginn'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'huginn'}
                                }],
                        containers: [{
                            name: 'huginn',
                            image: 'huginn/huginn',
                            imagePullPolicy: 'Always',
                            ports: [{containerPort: 3000}],
                            env: [
                                {name: 'RAILS_ENV', value: 'production'},
                                {name: 'DOMAIN', value: 'huginn.lan'},
                                {name: 'DATABASE_ADAPTER', value: 'mysql2'},
                                {name: 'DATABASE_NAME', value: 'huginn'},
                                {name: 'DATABASE_USERNAME', value: 'root'},
                                {name: 'DATABASE_PASSWORD', value: 'password'},
                                {name: 'DATABASE_HOST', value: 'mariadb'},
                                {name: 'DATABASE_PORT', value: '3306'},
                                {name: 'DATABASE_ENCODING', value: 'utf8mb4'},
                            ],
                            volumeMounts: [{mountPath: '/www/lib/mysql', name: 'data'}]
                        }]
                    }
                }
            }
        });
    }
}

