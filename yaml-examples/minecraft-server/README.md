If you need port 25565 for this deployment, you can run the following command on each node that has a pod:
```shell script
kubectl port-forward --address 0.0.0.0 service/minecraft 25565
```