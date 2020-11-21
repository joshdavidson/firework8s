import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, PersistentVolumeClaim} from './imports/k8s'
import {Ingress, IngressBackend, Service} from 'cdk8s-plus';

export class HuginnChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'huginn'};

        new PersistentVolumeClaim(this, 'pvc', {
            metadata: {
                name: 'huginn'
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
            ports: [{port: 3000, targetPort: 3000}]
        });
        service.addSelector('app', 'huginn');

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{name: 'pvc', persistentVolumeClaim: {claimName: 'huginn'}}],
                        containers: [{
                            name: 'huginn',
                            image: 'huginn/huginn',

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
                            volumeMounts: [{mountPath: '/www/lib/mysql', name: 'huginn'}]
                        }]
                    }
                }
            }
        });

        const ingress = new Ingress(this, 'ingress');
        ingress.addHostDefaultBackend('huginn.lan', IngressBackend.fromService(service));
    }
}

const app = new App();
new HuginnChart(app, 'huginn');
app.synth();
