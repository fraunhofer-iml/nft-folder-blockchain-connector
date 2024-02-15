#!/bin/bash

while getopts 'r:' flag
do
    case "${flag}" in
        r) RELEASE=${OPTARG};;
        *) echo "Error"
    esac
done

# Set variables
NAMESPACE="${NAMESPACE:=blockchain-connector}"
VALUES_COMMON=."/helm/app/values_common.yaml"
VALUES_PROJECT="./helm/app/values_$RELEASE.yaml"
HELM_PATH="./helm/app"

# Switch to project if it exists or create a new one
oc project "$NAMESPACE"

# Upgrade or install
echo "### Deploying RELEASE=$RELEASE | NAMESPACE=$NAMESPACE | VALUES_COMMON=$VALUES_COMMON | VALUES_PROJECT=$VALUES_PROJECT | HELM_PATH=$HELM_PATH"
helm upgrade --namespace "$NAMESPACE" --values "$VALUES_COMMON" --values "$VALUES_PROJECT" -i "$RELEASE" "$HELM_PATH"
