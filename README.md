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