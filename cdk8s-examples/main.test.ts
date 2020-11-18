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
import {JackettChart} from "./jackett";
import {VsCodeChart} from "./vscode";

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
  test('Jackett', () => {
    const app = Testing.app();
    const chart = new JackettChart(app, 'test-jackett');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('VsCode', () => {
    const app = Testing.app();
    const chart = new VsCodeChart(app, 'test-vscode');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
});
