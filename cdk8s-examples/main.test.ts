import {Testing} from 'cdk8s';
import {BitwardenChart} from "./bitwarden";
import {BookstackChart} from "./bookstack";
import {CiaoChart} from "./ciao";
import {CyberChefChart} from "./cyberchef";
import {FlexGetChart} from "./flexget";
import {GapsChart} from "./gaps";
import {GrafanaChart} from "./grafana";
import {GrocyChart} from "./grocy";
import {HeimdallChart} from "./heimdall";
import {HomeAssistantChart} from "./homeassistant";
import {HomerChart} from "./homer";
import {HugginChart} from "./huggin";
import {InfluxDbChart} from "./influxdb";
import {JackettChart} from "./jackett";
import {JellyfinChart} from "./jellyfin";
import {KomgaChart} from "./komga";
import {LazyLibrarianChart} from "./lazylibrarian";
import {LidarrChart} from "./lidarr";
import {MariaDbChart} from "./mariadb";
import {StuffInSpaceChart} from "./stuffinspace";
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
    const chart = new BookstackChart(app, 'test-bookstack');
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
  test('Huggin', () => {
    const app = Testing.app();
    const chart = new HugginChart(app, 'test-huggin');
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
  test('StuffInSpace', () => {
    const app = Testing.app();
    const chart = new StuffInSpaceChart(app, 'test-stuffinspace');
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
