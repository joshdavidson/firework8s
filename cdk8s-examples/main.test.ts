import {Testing} from 'cdk8s';
import {BitwardenChart} from "./bitwarden";
import {BookStackChart} from "./bookstack";
import {CiaoChart} from "./ciao";
import {CyberChefChart} from "./cyberchef";
import {FlexGetChart} from "./flexget";
import {GapsChart} from "./gaps";
import {GrafanaChart} from "./grafana";
import {GrocyChart} from "./grocy";
import {HeimdallChart} from "./heimdall";
import {HomeAssistantChart} from "./homeassistant";
import {HomerChart} from "./homer";
import {HuginnChart} from "./huginn";
import {InfluxDbChart} from "./influxdb";
import {JackettChart} from "./jackett";
import {JellyfinChart} from "./jellyfin";
import {KomgaChart} from "./komga";
import {LazyLibrarianChart} from "./lazylibrarian";
import {LidarrChart} from "./lidarr";
import {MariaDbChart} from "./mariadb";
import {MinecraftChart} from "./minecraft";
import {MinecraftBedrockChart} from "./minecraft-bedrock";
import {MongoDbChart} from "./mongo";
import {MonitorrChart} from "./monitorr";
import {MylarChart} from "./mylar";
import {MySqlChart} from "./mysql";
import {ObserviumChart} from "./observium";
import {OmbiChart} from "./ombi";
import {OrganizrChart} from "./organizr";
import {PerkeepChart} from "./perkeep";
import {PhpServerMonChart} from "./phpservermon";
import {PostgresChart} from "./postgres";
import {RadarrChart} from "./radarr";
import {RanetoChart} from "./raneto";
import {ReadarrChart} from "./readarr";
import {SickGearChart} from "./sickgear";
import {SmokePingChart} from "./smokeping";
import {SonarrChart} from "./sonarr";
import {StuffInSpaceChart} from "./stuffinspace";
import {TautulliChart} from "./tautulli";
import {TransmissionChart} from "./transmission";
import {TriliumChart} from "./trilium";
import {UbooquityChart} from "./ubooquity";
import {VarkenChart} from "./varken";
import {VsCodeChart} from "./vscode";
import {WallabagChart} from "./wallabag";
import {WekanChart} from "./wekan";

describe('Placeholder', () => {
  test('Bitwarden', () => {
    const app = Testing.app();
    const chart = new BitwardenChart(app, 'test-bitwarden');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Bookstack', () => {
    const app = Testing.app();
    const chart = new BookStackChart(app, 'test-bookstack');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Ciao', () => {
    const app = Testing.app();
    const chart = new CiaoChart(app, 'test-ciao');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('CyberChef', () => {
    const app = Testing.app();
    const chart = new CyberChefChart(app, 'test-cyberchef');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('FlexGet', () => {
    const app = Testing.app();
    const chart = new FlexGetChart(app, 'test-flexget');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Gaps', () => {
    const app = Testing.app();
    const chart = new GapsChart(app, 'test-gaps');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Grafana', () => {
    const app = Testing.app();
    const chart = new GrafanaChart(app, 'test-grafana');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Grocy', () => {
    const app = Testing.app();
    const chart = new GrocyChart(app, 'test-grocy');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Heimdall', () => {
    const app = Testing.app();
    const chart = new HeimdallChart(app, 'test-heimdall');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('HomeAssistant', () => {
    const app = Testing.app();
    const chart = new HomeAssistantChart(app, 'test-homeassistant');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Homer', () => {
    const app = Testing.app();
    const chart = new HomerChart(app, 'test-homer');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Huginn', () => {
    const app = Testing.app();
    const chart = new HuginnChart(app, 'test-huginn');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('InfluxDB', () => {
    const app = Testing.app();
    const chart = new InfluxDbChart(app, 'test-influxdb');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Jackett', () => {
    const app = Testing.app();
    const chart = new JackettChart(app, 'test-jackett');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Jellyfin', () => {
    const app = Testing.app();
    const chart = new JellyfinChart(app, 'test-jellyfin');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Komga', () => {
    const app = Testing.app();
    const chart = new KomgaChart(app, 'test-komga');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('LazyLibrarian', () => {
    const app = Testing.app();
    const chart = new LazyLibrarianChart(app, 'test-lazylibrarian');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Lidarr', () => {
    const app = Testing.app();
    const chart = new LidarrChart(app, 'test-lidarr');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('MariaDB', () => {
    const app = Testing.app();
    const chart = new MariaDbChart(app, 'test-mariadb');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Minecraft', () => {
    const app = Testing.app();
    const chart = new MinecraftChart(app, 'test-minecraft');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('MinecraftBedrock', () => {
    const app = Testing.app();
    const chart = new MinecraftBedrockChart(app, 'test-minecraft-bedrock');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('MongoDb', () => {
    const app = Testing.app();
    const chart = new MongoDbChart(app, 'test-mongodb');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Monitorr', () => {
    const app = Testing.app();
    const chart = new MonitorrChart(app, 'test-monitorr');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Mylar', () => {
    const app = Testing.app();
    const chart = new MylarChart(app, 'test-mylar');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('MySQL', () => {
    const app = Testing.app();
    const chart = new MySqlChart(app, 'test-mysql');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Observium', () => {
    const app = Testing.app();
    const chart = new ObserviumChart(app, 'test-observium');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Ombi', () => {
    const app = Testing.app();
    const chart = new OmbiChart(app, 'test-ombi');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Organizr', () => {
    const app = Testing.app();
    const chart = new OrganizrChart(app, 'test-organizr');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Perkeep', () => {
    const app = Testing.app();
    const chart = new PerkeepChart(app, 'test-perkeep');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('PhpServerMon', () => {
    const app = Testing.app();
    const chart = new PhpServerMonChart(app, 'test-phpservermon');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Postgres', () => {
    const app = Testing.app();
    const chart = new PostgresChart(app, 'test-postgres');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Radarr', () => {
    const app = Testing.app();
    const chart = new RadarrChart(app, 'test-radarr');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Raneto', () => {
    const app = Testing.app();
    const chart = new RanetoChart(app, 'test-raneto');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Readarr', () => {
    const app = Testing.app();
    const chart = new ReadarrChart(app, 'test-readarr');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('SickGear', () => {
    const app = Testing.app();
    const chart = new SickGearChart(app, 'test-sickgear');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('SmokePing', () => {
    const app = Testing.app();
    const chart = new SmokePingChart(app, 'test-smokeping');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Sonarr', () => {
    const app = Testing.app();
    const chart = new SonarrChart(app, 'test-sonarr');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('StuffInSpace', () => {
    const app = Testing.app();
    const chart = new StuffInSpaceChart(app, 'test-stuffinspace');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Tautulli', () => {
    const app = Testing.app();
    const chart = new TautulliChart(app, 'test-tautulli');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Transmission', () => {
    const app = Testing.app();
    const chart = new TransmissionChart(app, 'test-transmission');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Trilium', () => {
    const app = Testing.app();
    const chart = new TriliumChart(app, 'test-trilium');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Ubooquity', () => {
    const app = Testing.app();
    const chart = new UbooquityChart(app, 'test-ubooquity');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Varken', () => {
    const app = Testing.app();
    const chart = new VarkenChart(app, 'test-varken');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('VsCode', () => {
    const app = Testing.app();
    const chart = new VsCodeChart(app, 'test-vscode');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Wallabag', () => {
    const app = Testing.app();
    const chart = new WallabagChart(app, 'test-wallabag');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Wekan', () => {
    const app = Testing.app();
    const chart = new WekanChart(app, 'test-wekan');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
});
