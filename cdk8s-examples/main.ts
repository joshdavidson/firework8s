import { App } from 'cdk8s';
import {BitwardenChart} from "./bitwarden";
import {BookstackChart} from "./bookstack";
import {CiaoChart} from "./ciao";
import {CyberChefChart} from "./cyberchef";
import {FlexGetChart} from "./flexget";
import {GapsChart} from "./gaps";
import {HeimdallChart} from "./heimdall";
import {JackettChart} from "./jackett";
import {VsCodeChart} from "./vscode";

const app = new App();
new BitwardenChart(app, 'bitwarden');
new BookstackChart(app, 'bookstack');
new CiaoChart(app, 'ciao');
new CyberChefChart(app, 'cyberchef');
new FlexGetChart(app, 'flexget');
new GapsChart(app, 'gaps');
new HeimdallChart(app, 'heimdall');
new JackettChart(app, 'jackett');
new VsCodeChart(app, 'vscode');

app.synth();
