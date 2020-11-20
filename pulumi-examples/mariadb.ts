import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class MariaDB extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:MariaDB', name, {}, opts);

        const appLabels = { app: 'mariadb' };

        new kx.PersistentVolumeClaim('mariadb-pvc', {
            metadata: { name: 'mariadb' },
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

        new kx.Service('mariadb-service', {
            metadata: {
                name: 'mariadb'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 3306, targetPort: 3306}]
            }
        });

        new k8s.apps.v1.Deployment('mariadb', {
            metadata: {
                name: 'mariadb'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'mariadb'}
                                }],
                        containers: [{
                            name: 'mariadb',
                            image: 'mariadb',
                            //imagePullPolicy: 'Always',
                            ports: [{containerPort: 3306}],
                            env: [
                                {name: 'MYSQL_DATABASE', value: 'mariadb'},
                                {name: 'MYSQL_ROOT_PASSWORD', value: 'password'},
                                {name: 'MYSQL_USER', value: 'mariadb'},
                                {name: 'MYSQL_PASSWORD', value: 'mariadb'}
                            ],
                            volumeMounts: [{ mountPath: '/var/lib/mysql', name: 'mariadb' }]
                        }]
                    }
                }
            }
        });
    }
}

