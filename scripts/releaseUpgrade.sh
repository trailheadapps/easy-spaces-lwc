#!/bin/bash

sfdx force:project:upgrade -f
sfdx muenzpraeger:source:api:set
sfdx force:org:create -a es-release-test -s -f config/project-scratch-def.json -d 7
sfdx force:source:push
sfdx force:apex:test:run
sfdx force:org:open
echo "Org is set up"
