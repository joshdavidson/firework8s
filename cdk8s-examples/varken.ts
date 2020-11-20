import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, PersistentVolumeClaim } from './imports/k8s'

export class VarkenChart extends Chart {

  constructor(scope: Construct, name: string) {
    super(scope, name);
    const label = {app: 'varken'};

    new PersistentVolumeClaim(this, 'pvc', {
      metadata: {
        name: 'varken'
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

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: {labels: label},
          spec: {
            volumes: [{name: 'varken', persistentVolumeClaim: {claimName: 'varken'}}],
            containers: [{
              name: 'varken',
              image: 'boerderij/varken',

              env: [
                {name: 'TZ', value: 'America/New_York'},
                {name: 'VRKN_GLOBAL_LIDARR_SERVER_IDS', value: '1'},
                {name: 'VRKN_GLOBAL_MAXMIND_LICENSE_KEY', value: 'https://support.maxmind.com/account-faq/license-keys/how-do-i-generate-a-license-key/'},
                {name: 'VRKN_GLOBAL_OMBI_SERVER_IDS', value: '1'},
                {name: 'VRKN_GLOBAL_RADARR_SERVER_IDS', value: '1'},
                {name: 'VRKN_GLOBAL_SICKCHILL_SERVER_IDS', value: 'false'},
                {name: 'VRKN_GLOBAL_SONARR_SERVER_IDS', value: '1'},
                {name: 'VRKN_GLOBAL_TAUTULLI_SERVER_IDS', value: '1'},
                {name: 'VRKN_GLOBAL_UNIFI_SERVER_IDS', value: 'false'},
                {name: 'VRKN_INFLUXDB_PASSWORD', value: 'root'},
                {name: 'VRKN_INFLUXDB_PORT', value: '8086'},
                {name: 'VRKN_INFLUXDB_SSL', value: 'false'},
                {name: 'VRKN_INFLUXDB_URL', value: 'influxdb'},
                {name: 'VRKN_INFLUXDB_USERNAME', value: 'root'},
                {name: 'VRKN_INFLUXDB_VERIFY_SSL', value: 'false'},
                {name: 'VRKN_LIDARR_1_APIKEY', value: 'ADD LIDARR API KEY'},
                {name: 'VRKN_LIDARR_1_FUTURE_DAYS', value: '30'},
                {name: 'VRKN_LIDARR_1_FUTURE_DAYS_RUN_SECONDS', value: '300'},
                {name: 'VRKN_LIDARR_1_MISSING_DAYS', value: '30'},
                {name: 'VRKN_LIDARR_1_MISSING_DAYS_RUN_SECONDS', value: '300'},
                {name: 'VRKN_LIDARR_1_QUEUE', value: 'true'},
                {name: 'VRKN_LIDARR_1_QUEUE_RUN_SECONDS', value: '300'},
                {name: 'VRKN_LIDARR_1_SSL', value: 'false'},
                {name: 'VRKN_LIDARR_1_URL', value: 'lidarr:8086'},
                {name: 'VRKN_LIDARR_1_VERIFY_SSL', value: 'false'},
                {name: 'VRKN_OMBI_1_APIKEY', value: 'ADD OMBI API KEY'},
                {name: 'VRKN_OMBI_1_GET_ISSUE_STATUS_COUNTS', value: 'true'},
                {name: 'VRKN_OMBI_1_GET_REQUEST_TOTAL_COUNTS', value: 'true'},
                {name: 'VRKN_OMBI_1_GET_REQUEST_TYPE_COUNTS', value: 'true'},
                {name: 'VRKN_OMBI_1_ISSUE_STATUS_RUN_SECONDS', value: '300'},
                {name: 'VRKN_OMBI_1_REQUEST_TOTAL_RUN_SECONDS', value: '300'},
                {name: 'VRKN_OMBI_1_REQUEST_TYPE_RUN_SECONDS', value: '300'},
                {name: 'VRKN_OMBI_1_SSL', value: 'false'},
                {name: 'VRKN_OMBI_1_URL', value: 'ombi:3579'},
                {name: 'VRKN_OMBI_1_VERIFY_SSL', value: 'false'},
                {name: 'VRKN_RADARR_1_APIKEY', value: 'ADD RADAR API KEY'},
                {name: 'VRKN_RADARR_1_GET_MISSING', value: 'true'},
                {name: 'VRKN_RADARR_1_GET_MISSING_RUN_SECONDS', value: '300'},
                {name: 'VRKN_RADARR_1_QUEUE', value: 'true'},
                {name: 'VRKN_RADARR_1_QUEUE_RUN_SECONDS', value: '300'},
                {name: 'VRKN_RADARR_1_SSL', value: 'false'},
                {name: 'VRKN_RADARR_1_URL', value: 'radarr:7878'},
                {name: 'VRKN_RADARR_1_VERIFY_SSL', value: 'false'},
                {name: 'VRKN_SONARR_1_APIKEY', value: 'ADD SONARR API KEY'},
                {name: 'VRKN_SONARR_1_FUTURE_DAYS', value: '1'},
                {name: 'VRKN_SONARR_1_FUTURE_DAYS_RUN_SECONDS', value: '300'},
                {name: 'VRKN_SONARR_1_MISSING_DAYS', value: '7'},
                {name: 'VRKN_SONARR_1_MISSING_DAYS_RUN_SECONDS', value: '300'},
                {name: 'VRKN_SONARR_1_QUEUE', value: 'true'},
                {name: 'VRKN_SONARR_1_QUEUE_RUN_SECONDS', value: '300'},
                {name: 'VRKN_SONARR_1_SSL', value: 'false'},
                {name: 'VRKN_SONARR_1_URL', value: 'sonarr:8989'},
                {name: 'VRKN_SONARR_1_VERIFY_SSL', value: 'false'},
                {name: 'VRKN_TAUTULLI_1_APIKEY', value: 'ADD TAUTULLI API KEY'},
                {name: 'VRKN_TAUTULLI_1_GET_ACTIVITY', value: 'true'},
                {name: 'VRKN_TAUTULLI_1_GET_ACTIVITY_RUN_SECONDS', value: '30'},
                {name: 'VRKN_TAUTULLI_1_GET_STATS', value: 'true'},
                {name: 'VRKN_TAUTULLI_1_GET_STATS_RUN_SECONDS', value: '3600'},
                {name: 'VRKN_TAUTULLI_1_SSL', value: 'false'},
                {name: 'VRKN_TAUTULLI_1_URL', value: 'tautulli:8181'},
                {name: 'VRKN_TAUTULLI_1_VERIFY_SSL', value: 'false'}
              ],
              volumeMounts: [{mountPath: '/config', name: 'varken'}]
            }]
          }
        }
      }
    });
  }
}

const app = new App();
new VarkenChart(app, 'varken');
app.synth();
