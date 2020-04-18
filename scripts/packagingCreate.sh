#!/bin/bash

# Create packages - initial action
# sfdx force:package:create --name "ESObjects" --path ./es-base-objects --packagetype Unlocked
# sfdx force:package:create --name "ESBaseCodeLWC" --path ./es-base-code --packagetype Unlocked
# sfdx force:package:create --name "ESBaseStylesLWC" --path ./es-base-styles --packagetype Unlocked
# sfdx force:package:create --name "ESSpaceMgmtLWC" --path ./es-space-mgmt --packagetype Unlocked

# Create versions
sfdx force:package:version:create --package "ESObjects" --installationkey test1234 --wait 10
sfdx force:package:version:create --package "ESBaseCodeLWC" --installationkey test1234 --wait 10
sfdx force:package:version:create --package "ESBaseStylesLWC" --installationkey test1234 --wait 10
sfdx force:package:version:create --package "ESSpaceMgmtLWC" --installationkey test1234 --wait 10

# Install packages
sfdx force:package:install --package "ESObjects@4.0.0-1" --installationkey test1234
sfdx force:package:install --package "ESBaseCodeLWC@4.0.0-1" --installationkey test1234
sfdx force:package:install --package "ESBaseStylesLWC@4.0.0-1" --installationkey test1234
sfdx force:package:install --package "ESSpaceMgmtLWC@4.0.0-1" --installationkey test1234

# Assign permission sets
sfdx force:user:permset:assign -n EasySpacesObjects
sfdx force:user:permset:assign -n SpaceManagementApp

# Import data
sfdx force:data:tree:import --plan ./data/Plan1.json
sfdx force:data:tree:import --plan ./data/Plan2.json
