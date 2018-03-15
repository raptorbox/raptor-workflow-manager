.PHONY: docker/push docker/build

TAG := $(shell cat node_modules/node-red/package.json | jq ".version")
IMAGE := raptorbox/node-red

deps:
	sudo apt-get install jq
	npm i

docker/build:
	docker build . -t $(IMAGE):$(TAG)
	docker tag $(IMAGE):$(TAG) $(IMAGE):latest

docker/push: docker/build
	docker push $(IMAGE):$(TAG)
	docker push $(IMAGE):latest

docker/run:
	docker run --rm --name raptorbox_nodered -v ${PWD}/config:/config -e CONFIG=/config/workflow.json raptorbox/node-red
