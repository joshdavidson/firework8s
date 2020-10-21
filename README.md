# openhomelab
openhomelab is a collection of kubernetes yaml files for use in setting up services in a home lab
### To Deploy
Execute kubectl apply -f against the directory you wish to deploy.  For example:
```shell script
kubectl apply -f sonarr
```
Would deploy sonarr to your k8s cluster...