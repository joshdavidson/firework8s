import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class Ciao extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:Ciao', name, {}, opts);

        const appLabels = { app: 'ciao' };

        new kx.PersistentVolumeClaim('ciao-pvc', {
            metadata: { name: 'ciao' },
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

        new kx.Service('ciao-service', {
            metadata: {
                name: 'ciao'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 3000, targetPort: 3000}]
            }
        });

        new k8s.networking.v1.Ingress('ciao-ingress', {
            metadata: {
                name: 'ciao'
            },
            spec: {
                rules: [{
                    host: 'ciao.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'ciao',
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

        new k8s.apps.v1.Deployment('ciao', {
            metadata: {
                name: 'ciao'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'data',
                                   persistentVolumeClaim: {
                                     claimName: 'ciao'}
                                }],
                        containers: [{
                            name: 'ciao',
                            image: 'brotandgames/ciao',

                            ports: [{containerPort: 3000}],
                            env: [
                                {name: 'SECRET_KEY_BASE', value: 'sensitive_secret_key_base'},
                                {name: 'SMTP_ADDRESS', value: 'smtp.sendgrid.net'},
                                {name: 'SMTP_EMAIL_FROM', value: 'noreply@ciao.lan'},
                                {name: 'SMTP_EMAIL_TO', value: 'yourname@youremail.com'},
                                {name: 'SMTP_PORT', value: '587'},
                                {name: 'SMTP_AUTHENTICATION', value: 'plain'},
                                {name: 'SMTP_DOMAIN', value: 'smtp.sendgrid.net'},
                                {name: 'SMTP_ENABLE_STARTTLS_AUTO', value: 'true'},
                                {name: 'SMTP_USERNAME', value: 'apikey'},
                                {name: 'SMTP_PASSWORD', value: 'your sendgrid api key'}
                            ],
                            volumeMounts: [{ mountPath: '/app/db/sqlite', name: 'data' }]
                        }]
                    }
                }
            }
        });
    }
}

