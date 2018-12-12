#!/bin/bash

DURATION=7

if [ "$#" -eq 1 ]; then
  DURATION=$1
fi

sfdx force:org:create -a easyspaces -s -f config/project-scratch-def.json -d $DURATION
sfdx force:source:push
sfdx force:user:permset:assign -n EasySpacesObjects
sfdx force:user:permset:assign -n SpaceManagementApp
sfdx force:data:tree:import --plan ./data/Plan1.json
sfdx force:data:tree:import --plan ./data/Plan2.json
sfdx force:org:open -p /lightning/page/home
echo "Org is set up"
