#!/bin/bash

ALIAS=easyspaces

if [ "$#" -eq 1 ]; then
  ALIAS=$1
fi

sfdx force:org:create -a $ALIAS -s -f config/project-scratch-def.json

echo "Scratch org created. Installing packages."
sfdx force:package:install --package 04t1I0000036tXgQAI
sleep 60
sfdx force:package:install --package 04t1I0000036tXlQAI
sleep 60
sfdx force:package:install --package 04t1I0000036tXqQAI
sleep 60
sfdx force:package:install --package 04t1I0000036tXvQAI
sleep 60
echo "Packages installed. Setting up data and permissions."
sfdx force:user:permset:assign -n EasySpacesObjects
sfdx force:user:permset:assign -n SpaceManagementApp
sfdx force:data:tree:import --plan ./data/Plan1.json
sfdx force:data:tree:import --plan ./data/Plan2.json
echo "Org set up. Launching NOW!"
sfdx force:org:open -p /lightning/page/home
