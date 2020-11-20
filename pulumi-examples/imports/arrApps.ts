import * as k8s from "@pulumi/kubernetes";
import * as pulumi from '@pulumi/pulumi';
import {Jackett} from "./jackett";
import {LazyLibrarian} from "./lazylibraran";
import {Lidarr} from "./lidarr";
import {Mylar} from "./mylar";
import {Radarr} from "./radarr";
import {Readarr} from "./readarr";
import {SickGear} from "./sickgear";
import {Sonarr} from "./sonarr";
import {Transmission} from "./transmission";

export class ArrApps extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions={}) {
        super('pkg:index:ArrApps', name, {}, opts);

            new Jackett('jackett' );
            new LazyLibrarian('lazylibrarian');
            new Lidarr('lidar');
            new Mylar('mylar');
            new Radarr('radarr');
            new Readarr('readarr');
            new SickGear('sickgear');
            new Sonarr('sonarr');
            new Transmission('transmission');

    }
}

