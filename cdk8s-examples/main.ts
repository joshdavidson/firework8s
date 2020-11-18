import { App } from 'cdk8s';
import {BitwardenChart} from "./bitwarden";
import {CyberChefChart} from "./cyberchef";
import {HeimdallChart} from "./heimdall";
import {VsCodeChart} from "./vscode";

const app = new App();
new BitwardenChart(app, 'bitwarden');
new CyberChefChart(app, 'cyberchef');
new HeimdallChart(app, 'heimdall');
new VsCodeChart(app, 'vscode');

app.synth();
