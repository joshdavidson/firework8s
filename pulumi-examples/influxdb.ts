import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class InfluxDB extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:InfluxDB', name, {}, opts);

        const appLabels = { app: 'influxdb' };

        new kx.PersistentVolumeClaim('influxdb-pvc', {
            metadata: { name: 'influxdb' },
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

        new kx.Service('influxdb-service', {
            metadata: {
                name: 'influxdb'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 8086, targetPort: 8086}]
            }
        });

        new k8s.apps.v1.Deployment('influxdb', {
            metadata: {
                name: 'influxdb'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'influxdb'}
                                }],
                        containers: [{
                            name: 'influxdb',
                            image: 'influxdb',

                            ports: [{containerPort: 8086}],
                            volumeMounts: [{mountPath: '/www/lib/influxdb', name: 'data'}]
                        }]
                    }
                }
            }
        });
    }
}

