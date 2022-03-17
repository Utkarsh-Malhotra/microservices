To run in local run below command to connect to nats-pod inside kubernetes cluster

 kubectl port-forward POD-NAME 4222:4222

Then run

 npm run publish


To check monitoring 
  kubectl port-forward POD-NAME 8222:8222  

Then go on browser 
localhost:8222/streaming
http://localhost:8222/streaming/channelsz?subs=1

