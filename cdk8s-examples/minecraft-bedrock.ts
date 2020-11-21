import {Construct} from 'constructs';
import {App, Chart} from 'cdk8s';
import {Deployment, IntOrString, PersistentVolumeClaim, Service} from './imports/k8s'

export class MinecraftBedrockChart extends Chart {

    constructor(scope: Construct, name: string) {
        super(scope, name);
        const label = {app: 'minecraft-bedrock'};

        new PersistentVolumeClaim(this, 'minecraft-bedrock', {
            metadata: {
                name: 'minecraft-bedrock'
            },
            spec: {
                storageClassName: 'default',
                accessModes: ['ReadWriteOnce'],
                resources: {
                    requests: {
                        storage: '2Gi'
                    }
                }
            }
        });

        new Service(this, 'service', {
            spec: {
                type: 'NodePort',
                ports: [{port: 19132, nodePort: 19132, targetPort: IntOrString.fromNumber(19132), protocol: 'UDP'}],
                selector: label
            }
        });

        new Deployment(this, 'deployment', {
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: label
                },
                template: {
                    metadata: {labels: label},
                    spec: {
                        volumes: [{
                            name: 'data',
                            persistentVolumeClaim: {claimName: 'minecraft-bedrock'}
                        }],
                        containers: [{
                            name: 'minecraft-bedrock',
                            image: 'itzg/minecraft-bedrock-server',

                            env: [
                                {name: 'EULA', value: 'true'},
                                {name: 'GAMEMODE', value: 'creative'},
                                {name: 'DIFFICULTY', value: 'easy'}
                            ],
                            ports: [{containerPort: 19132, hostPort: 19132, protocol: 'UDP'}],
                            volumeMounts: [{mountPath: '/data', name: 'data'}],
                            readinessProbe: {
                                exec: {
                                    command: ['mc-monitor', 'status-bedrock', '-- host', '127.0.0.1']
                                },
                                initialDelaySeconds: 5,
                                periodSeconds: 5
                            }
                        }]
                    }
                }
            }
        });

    }
}

const app = new App();
new MinecraftBedrockChart(app, 'minecraft-bedrock');
app.synth();
