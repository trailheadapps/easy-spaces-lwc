#!/bin/bash

# Script for packaging branch creation

# Instructions:
#
# - It uses the CIRCLE_BRANCH environment variable as first parameter, passed via the
#   CircleCI job config, as value to determine for which package a new version should
#   be created and which packages should only be deployed. It also uses the CI environment
#   variable as safeguard for making sure that the script runs in the CI environment.
# - For a manual run from a developer workstation pass the name of the the package alias
#   as parameter (instead of the CIRCLE_BRANCH environment variable).

# Default values
BRANCH=$1
SFDX_CLI_EXEC=sfdx
TARGET_ORG=''
NIGHTLY=false
PACKAGE_VERSION_BASE_OBJECTS="ESObjects@2.0.0-1"
PACKAGE_VERSION_BASE_CODE="ESBaseCodeLWC@2.0.0-1"
PACKAGE_VERSION_BASE_STYLES="ESBaseStylesLWC@2.0.0-1"
PACKAGE_VERSION_SPACE_MGMT="ESSpaceMgmtLWC@2.0.0-1"

if [ "$#" -eq 0 ]; then
  NIGHTLY=true
  echo "No parameter provided, this will be full package installation"
fi

if [ "$#" -eq 2 ]; then
  TARGET_ORG="-u $2"
  echo "Using specific org $2"
fi

# Defining Salesforce CLI exec, depending if it's CI or local dev machine
if [ $CI ]; then
  echo "Script is running on CI"
  SFDX_CLI_EXEC=node_modules/sfdx-cli/bin/run
  TARGET_ORG="-u ciorg"
fi

# Reading the to be installed package version based on the alias@version key from sfdx-project.json
PACKAGE_VERSION_BASE_OBJECTS="$(cat sfdx-project.json | jq --arg VERSION "$PACKAGE_VERSION_BASE_OBJECTS" '.packageAliases | .[$VERSION]' | tr -d '"')"
PACKAGE_VERSION_BASE_CODE="$(cat sfdx-project.json | jq --arg VERSION "$PACKAGE_VERSION_BASE_CODE" '.packageAliases | .[$VERSION]' | tr -d '"')"
PACKAGE_VERSION_BASE_STYLES="$(cat sfdx-project.json | jq --arg VERSION "$PACKAGE_VERSION_BASE_STYLES" '.packageAliases | .[$VERSION]' | tr -d '"')"
PACKAGE_VERSION_SPACE_MGMT="$(cat sfdx-project.json | jq --arg VERSION "$PACKAGE_VERSION_SPACE_MGMT" '.packageAliases | .[$VERSION]' | tr -d '"')"

# We're in a packaging/* branch, so we need to create a new version
if [ $BRANCH = *"es-base-objects"* ] || [ $NIGHTLY = true]; then
  echo "Creating new package version for es-base-objects"
  PACKAGE_VERSION_BASE_OBJECTS="$($SFDX_CLI_EXEC force:package:version:create -p ESObjects -x -w 10 --json | jq '.result.SubscriberPackageVersionId' | tr -d '"')"
  sleep 300 # We've to wait for package replication.
fi
if [ $BRANCH = *"es-base-code"* ] || [ $NIGHTLY = true]; then
  echo "Creating new package version for es-base-code"
  PACKAGE_VERSION_BASE_CODE="$($SFDX_CLI_EXEC force:package:version:create -p ESBaseCodeLWC -x -w 10 --json | jq '.result.SubscriberPackageVersionId' | tr -d '"')"
  sleep 300 # We've to wait for package replication.
fi
if [ $BRANCH = *"es-base-styles"* ] || [ $NIGHTLY = true]; then
  echo "Creating new package version for es-base-styles"
  PACKAGE_VERSION_BASE_STYLES="$($SFDX_CLI_EXEC force:package:version:create -p ESBaseStylesLWC -x -w 10 --json | jq '.result.SubscriberPackageVersionId' | tr -d '"')"
  sleep 300 # We've to wait for package replication.
fi
if [ $BRANCH = *"es-space-mgmt"* ] || [ $NIGHTLY = true]; then
  echo "Creating new package version for es-space-mgmt"
  PACKAGE_VERSION_BASE_SPACE_MGMT="$($SFDX_CLI_EXEC force:package:version:create -p ESSpaceMgmtLWC -x -w 10 --json | jq '.result.SubscriberPackageVersionId' | tr -d '"')"
  sleep 300 # We've to wait for package replication.
fi

# Installation in dependency order
echo "Package installation es-base-objects"
$SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION_BASE_OBJECTS -w 10 $TARGET_ORG
echo "Package installation es-base-code"
$SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION_BASE_CODE -w 10 $TARGET_ORG
echo "Package installation es-base-styles"
$SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION_BASE_STYLES -w 10 $TARGET_ORG
echo "Package installation es-space-mgmt"
$SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION_SPACE_MGMT -w 10 $TARGET_ORG
echo "Done"
