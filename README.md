# Firework8s
Firework8s is a collection of Kubernetes objects (YAML files) for deploying workloads in a home lab with k8s. The 
home lab used for development of this project consists of a 3 node cluster managed by Rancher.

## Project Structure
Folder | Description 
--------------- | ---------------
yaml-examples   | Contains pure handcrafted Kubernetes YAML; These files can be considered the gold standard for the project
cdk8s-examples  | Contains [Cloud Development for Kubernetes (cdk8s)](https://github.com/awslabs/cdk8s) TypeScript files that can be used by cdk8s to generate Kubernetes YAML

## Deploy
### Using yaml-examples
Execute kubectl apply -f against the directory you wish to deploy.  For example:
```shell script
cd yaml-examples
kubectl apply -f sonarr
```
Would deploy Sonarr to your Kubernetes cluster...

### Using cdk8s-examples
Create a new cdk8s project project in Typescript and use it to generate Kubernetes YAML files for deployment: 
```shell script
cd cdk8s-examples
mkdir build && cd build
cdk8s init typescript-app
npm run watch &
cp ../*.ts .
cdk8s synth
```

Execute kubectl apply -f against the application you wish to deploy.  For example:
```shell script
kubectl apply -f dist/jackett.k8s.yaml
```
Would deploy Jackett from the cdk8s generated YAML to your Kubernetes cluster...

## Applications
The following applications are included as yaml and cdk8s examples.

Name | Description | Website
------------ | ------------- | -------------
bitwarden | Free and open-source password management service that stores credentials in an encrypted vault | https://bitwarden.com/
bookstack | Free and open source Wiki designed for creating beautiful documentation | https://www.bookstackapp.com
ciao | Private and public HTTP(S) monitoring | https://brotandgames.com/ciao/
cyberchef | The cyber swiss army knife | https://gchq.github.io/cyberchef
flexget | Multipurpose automation tool for all your media | https://flexget.com
gaps | Gaps recommends gaps in your Plex Server movie library based on collection searches | https://github.com/JasonHHouse/gaps 
grafana| Open source analytics and interactive visualization web application | https://grafana.com/
grocy | Groceries and household management solution for your home | https://grocy.info/
heimdalll | Application dashboard and launcher | https://github.com/linuxserver/Heimdall
homeassistant | Open source home automation | https://www.home-assistant.io/ 
homer | A very simple static homepage for your server | https://github.com/bastienwirtz/homer
huggin | Create agents that monitor and act on your behalf | https://github.com/huginn/huginn
influxdb| Open-source time series database | https://www.influxdata.com/
jackett | API support for your favorite torrent trackers | https://github.com/Jackett/Jackett
jellyfin | The free software media system | https://jellyfin.org/
komga | Media server for comics/mangas/BDs with API and OPDS support | https://komga.org/
lazylibrarian | Follow authors and grab metadata for all your digital reading needs | https://github.com/lazylibrarian/LazyLibrarian
lidarr | Music collection manager | https://lidarr.audio/
mariadb | Community-developed, commercially supported fork of the MySQL | https://mariadb.org/
minecraft | Minecraft server with selectable version | https://hub.docker.com/r/itzg/minecraft-server
minecraft-bedrock | Minecraft Bedrock Dedicated Server with selectable version | https://hub.docker.com/r/itzg/minecraft-bedrock-server
mongodb | NoSQL database | https://www.mongodb.com/
monitorr | Monitors the status of local and remote network services, websites, and applications | https://github.com/Monitorr/Monitorr
mylar | An automated Comic Book downloader (cbr/cbz) for use with SABnzbd, NZBGet and torrents | https://github.com/evilhero/mylar
mysql | Open-source relational database management system | https://www.mysql.com/
observium | Network monitoring platform | https://www.observium.org/
ombi |  Gives your shared Plex or Emby users the ability to request content by themselves | https://ombi.io/
organizr | An HTPC/Homelab services organizer | https://organizr.app
perkeep | Software for modeling, storing, searching, sharing and synchronizing data | https://perkeep.org/
phpservermon | PHP server monitor | http://www.phpservermonitor.org/
postgres | Open source object-relational database system | https://www.postgresql.org/
raneto | Markdown powered knowledge base for Nodejs | http://raneto.com/
readarr | Book, magazine, comics eBook and audiobook manager (Sonarr for eBooks) | http://readarr.com/
sickgear |  SickGear has proven the most reliable stable TV fork of the great Sick-Beard family | https://github.com/SickGear/SickGear
smokeping | Smokeping keeps track of your network latency | https://github.com/linuxserver/docker-smokeping
snipe-it | Free and open source IT asset management | https://github.com/snipe/snipe-it
sonarr | Smart PVR for newsgroup and bittorrent users | https://sonarr.tv/
stuffinspace | A real-time interactive WebGL visualisation of objects in Earth orbit | http://stuffin.space
transmission | BitTorrent client | https://transmissionbt.com/
tautulli | Python based monitoring and tracking tool for Plex Media Server | https://github.com/Tautulli/Tautulli
trilium | Hierarchical note taking application | https://github.com/zadam/trilium
ubooquity | Home server for your comics and ebooks | https://github.com/linuxserver/docker-ubooquity
varken | Standalone application to aggregate data from the Plex ecosystem into InfluxDB | https://github.com/Boerderij/Varken
vscode | VS Code running on a remote server, accessible through the browser | https://github.com/linuxserver/docker-code-server
wallabag | Self hosted application for saving web pages | https://wallabag.org/
wekan | The open-source kanban (built with Meteor) | https://wekan.github.io/
