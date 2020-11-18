import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import {CyberChefChart} from "./cyberchef";
import {HeimdallChart} from "./heimdall";
import {VsCodeChart} from "./vscode";

export class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here

  }
}

const app = new App();
new CyberChefChart(app, 'cyberchef');
new HeimdallChart(app, 'heimdall');
new VsCodeChart(app, 'vscode');

app.synth();
