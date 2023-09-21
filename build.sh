#!/bin/env bash

source ../.env

# Build the Docker image and tag it with the version number
docker build -t "$DOCKER_IMAGE_SERVER" .

# Optionally, also tag the image as 'latest'
# docker tag "${DOCKER_IMAGE_SERVER}" jackgray/"$CONTAINER_NAME_SERVER":latest

# Push the image to Docker Hub
docker push "$DOCKER_IMAGE_SERVER"
# docker push jackgray/"$CONTAINER_NAME_SERVER":latest