import * as k8s from '@pulumi/kubernetes';
import * as kx from '@pulumi/kubernetesx';
import * as pulumi from '@pulumi/pulumi';

export class HomeAssistant extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:HomeAssistant', name, {}, opts);

        const appLabels = { app: 'homeassistant' };

        new kx.PersistentVolumeClaim('homeassistant-pvc', {
            metadata: { name: 'homeassistant' },
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

        new kx.Service('homeassistant-service', {
            metadata: {
                name: 'homeassistant'
            },
            spec: {
                selector: appLabels,
                ports: [{port: 8123, targetPort: 8123}]
            }
        });

        new k8s.networking.v1.Ingress('homeassistant-ingress', {
            metadata: {
                name: 'homeassistant'
            },
            spec: {
                rules: [{
                    host: 'homeassistant.lan', http: {
                        paths: [{
                            backend: {
                                service:
                                    {
                                        name: 'homeassistant',
                                        port: {number: 8123}
                                    }
                            },
                            path: '/',
                            pathType: 'ImplementationSpecific'
                        }]
                    }
                }]
            }
        });

        new k8s.apps.v1.Deployment('homeassistant', {
            metadata: {
                name: 'homeassistant'
            },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: {
                        volumes:[{ name: 'config',
                                   persistentVolumeClaim: {
                                     claimName: 'homeassistant'}
                                }],
                        containers: [{
                            name: 'homeassistant',
                            image: 'homeassistant/home-assistant:stable',

                            ports: [{containerPort: 8123}],
                            env: [
                                {name: 'PUID', value: '1000'},
                                {name: 'PGID', value: '1000'},
                                {name: 'TZ', value: 'America/New_York'}
                            ],
                            volumeMounts: [{mountPath: '/config', name: 'config'}]
                        }]
                    }
                }
            }
        });
    }
}

