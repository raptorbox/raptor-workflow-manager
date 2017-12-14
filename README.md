# Raptorbox Workflow Manager

Raptorbox Workflow Manager offer a node-red based editor to easily sketch your application logic based on sensor data.

## Usage


### Start the runtime

`docker-compose up -d`

### Create a new instance

`curl -X POST http://workflow.localhost:3000/v2/instances/test1`

### Stop an instance

`curl -X DELETE http://workflow.localhost:3000/v2/instances/test1`



## License

Apache 2 license

Copyright FBK/CREATE-NET https://create-net.fbk.eu/en/openiot/
