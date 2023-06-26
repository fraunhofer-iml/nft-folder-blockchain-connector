#!/bin/bash

# Use Namespace already provided or the default given here
NAMESPACE="${NAMESPACE:=blockchain-connector}"

# Switch to project if it exists or create a new one
oc project "$NAMESPACE"

# Upgrade or install
helm upgrade --namespace "$NAMESPACE" -i sfbdc-blockchain-connector .

# Ensure image stream picks up the new docker image right away
oc import-image blockchain-connector
