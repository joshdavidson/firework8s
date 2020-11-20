import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class CyberChef extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:CyberChef', name, {}, opts);

        const appLabels = {app: 'cyberchef'};

        new kx.Service('cyberchef-svc', {
            metadata: {
                name: 'cyberchef'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 8000, targetPort: 8000}]
            }
        });

        new k8s.networking.v1.Ingress('cyberchef-ingress', {
            metadata: {
                name: 'cyberchef'
            },
            spec: {
                rules: [{
                    host: 'cyberchef.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'cyberchef',
                                        port: {number: 8000}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('cyberchef', {
            metadata: {
                name: 'cyberchef'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        containers: [{
                            name: 'cyberchef',
                            image: 'mpepping/cyberchef',

                            ports: [{containerPort: 8000}]
                        }]
                    }
                }
            }
        });
    }
}
