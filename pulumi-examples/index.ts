import { CodeServer } from './code-server';
import { BitWarden } from './bitwarden';
import { BookStack } from './bookstack';
import { Ciao} from './ciao';
import { CyberChef } from './cyberchef';
import { FlexGet} from "./flexget";
import { Gaps} from "./gaps";
import { Grafana} from "./grafana";
import { Grocy} from "./grocy";
import { Heimdall} from "./heimdall";
import { HomeAssistant} from "./homeassistant";
import { Homer } from "./homer";
import { Huginn } from "./huginn";
import { InfluxDB } from "./influxdb";
import { MariaDB } from './mariadb';

new BitWarden('bitwarden',{});
new BookStack('bookstack',{});
new Ciao('ciao',{});
new CodeServer('code-server',{});
new CyberChef('cyberchef',{});
new FlexGet('flexget',{});
new Gaps('gaps',{});
new Grafana('grafana',{});
new Grocy('grocy',{});
new Heimdall('heimdall',{});
new Homer('homer',{});
new Huginn('huginn',{});
new InfluxDB('influxdb',{});
new HomeAssistant('homeassistant',{});




new MariaDB('mariadb',{});