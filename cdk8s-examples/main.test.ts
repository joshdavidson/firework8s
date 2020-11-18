import {Testing} from 'cdk8s';
import {BitwardenChart} from "./bitwarden";
import {CyberChefChart} from "./cyberchef";
import {HeimdallChart} from "./heimdall";
import {VsCodeChart} from "./vscode";
import {BookstackChart} from "./bookstack";

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
  test('CyberChef', () => {
    const app = Testing.app();
    const chart = new CyberChefChart(app, 'test-cyberchef');
    const results = Testing.synth(chart)
    expect(results).toMatchSnapshot();
  });
  test('Heimdall', () => {
    const app = Testing.app();
    const chart = new HeimdallChart(app, 'test-heimdall');
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
