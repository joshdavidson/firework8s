import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class HomeAssistantChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'homeassistant'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'homeassistant'
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
        });

        const service = new Service(this, 'service', {
            ports: [{port: 8123, targetPort: 8123}]
        });
        service.addSelector('app', 'homeassistant');

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{name: 'homeassistant', persistentVolumeClaim: {claimName: 'homeassistant'}}],
                        containers: [{
                            name: 'homeassistant',
                            image: 'homeassistant/home-assistant:stable',

                            ports: [{containerPort: 8123}],
                            env: [{name: 'TZ', value: 'America/New_York'}],
                            volumeMounts: [{mountPath: '/config', name: 'homeassistant'}]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('homeassistant.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new HomeAssistantChart(app, 'homeassistant');
app.synth();
