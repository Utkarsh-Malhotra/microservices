Download skaffold
include in both blog and ticketing directory

run ./skaffold dev


See a database in kubernetes
kubectl get pods
kubectl exec -it POD_NAME mongo
show dbs
use DB_NAME
db.COLEECTION_NAME
RUN mongo commands now like the following
db.tickets.find({ price: 600 })



Github Action
Run github action any time we push a code, create a pull request or update a pull request

add this command in package.json
"test:ci": "jest"   
 It will run test one time only in github

 There are three folders of k8s with slight changes in ingress-srv for each to be used for local,dev and production




Three Important Changes Needed to Deploy on production - Do Not Skip!
In the upcoming lecture, we will be configuring our project to use the new domain name that was purchased. There are 3 major things that need to be addressed in order for the deployment to work.

1. Update the baseURL in client service's build-client file:

In api/build-client.js, change the baseURL to your purchased domain:

From this:

    // We are on the server
 
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
to:

    // We are on the server
 
    return axios.create({
      baseURL: 'Whatever_your_purchased_domain_is',
      headers: req.headers,
    });
Since I purchased ticketing-app-prod.xyz, I would update this line to:

baseURL: 'http://www.ticketing-app-prod.xyz/'



2. Disable HTTPS Checking

You may recall that we configured all of our services to only use cookies when the user is on an HTTPS connection.  This will cause auth to fail while we do the initial deployment of our app since we don't have HTTPS set up right now.

To disable the HTTPS checking, go to the app.ts file in the auth, orders, tickets, and payments services. 

At the cookie-session middleware, change the following:

  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
to:

  cookieSession({
    signed: false,
    secure: false,
  })


3. Add Load Balancer

There is currently a bug with ingress-nginx on Digital Ocean.  You can read more about this bug here: https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/docs/controllers/services/examples/README.md#accessing-pods-over-a-managed-load-balancer-from-inside-the-cluster

To fix it, add the following to the bottom of your ingress-srv.yaml manifest. 

Also, update the URL on this line in the annotations to the domain name you're using:

 service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.ticketing-app-prod.xyz'

---
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: 'true'
    service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.ticketing-app-prod.xyz'
  labels:
    helm.sh/chart: ingress-nginx-2.0.3
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/version: 0.32.0
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: controller
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  type: LoadBalancer
  externalTrafficPolicy: Local
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: http
    - name: https
      port: 443
      protocol: TCP
      targetPort: https
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/component: controller




Read 
cert-manager.io for https