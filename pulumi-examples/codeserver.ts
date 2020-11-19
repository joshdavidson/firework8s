import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

class CodeServer extends pulumi.ComponentResource {
    constructor(name, opts) {
        super('pkg:index:CodeServer', name, {}, opts);

        const appLabels = {app: 'codeserver'};

        new kx.PersistentVolumeClaim('pvc', {
            metadata: {
                name: 'codeserver'
            },
            spec: {
                storageClassName: 'default',
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: '250Mi'
                    }
                }
            }
        })

        new kx.Service('codeserver', {
            spec: {
                selector: appLabels,
                ports: [{port: 8443, targetPort: 8443}]
            }
        });

        new k8s.networking.v1.Ingress('codeserver', {
            spec: {
                rules: [{
                    host: 'codeserver.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'codeserver',
                                        port: {number: 8443}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('codeserver', {
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'codeserver'}
                                }],
                        containers: [{
                            name: 'codeserver',
                            image: 'mpepping/codeserver',
                            imagePullPolicy: 'Always',
                            ports: [{containerPort: 8443}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'},
                                {name: 'PASSWORD', value: 'password'},
                                {name: 'SUDO_PASSWORD', value: 'password'}
                            ],
                            volumeMounts: [{ mountPath: '/config', name: 'codeserver' }]
                        }]
                    }
                }
            }
        });
    }
}

module.exports.codeserver = CodeServer;

