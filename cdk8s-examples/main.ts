import { App } from 'cdk8s';
import {BitwardenChart} from "./bitwarden";
import {BookstackChart} from "./bookstack";
import {CyberChefChart} from "./cyberchef";
import {HeimdallChart} from "./heimdall";
import {VsCodeChart} from "./vscode";

const app = new App();
new BitwardenChart(app, 'bitwarden');
new BookstackChart(app, 'bookstack');
new CyberChefChart(app, 'cyberchef');
new HeimdallChart(app, 'heimdall');
new VsCodeChart(app, 'vscode');

app.synth();
