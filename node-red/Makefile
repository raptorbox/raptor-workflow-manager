.PHONY: docker/push docker/build

TAG ?= $(shell cat node_modules/node-red/package.json | jq ".version")
IMAGE ?= raptorbox/node-red

docker/build:
	echo "${IMAGE}"
	docker build . -t $(IMAGE):$(TAG)

docker/push:
  	docker push $(IMAGE):$(TAG)
