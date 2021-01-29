#!/bin/bash
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd $SCRIPT_PATH/..

# Set parameters
ORG_ALIAS="easy-spaces"

echo ""
echo "Installing Easy Spaces scratch org ($ORG_ALIAS)"
echo ""

# Install script
echo "Cleaning previous scratch org..."
sfdx force:org:delete -p -u $ORG_ALIAS &> /dev/null
echo ""

echo "Creating scratch org..." && \
sfdx force:org:create -s -f config/project-scratch-def.json -d 30 -a $ORG_ALIAS && \
echo "" && \

echo "Pushing source..." && \
sfdx force:source:push && \
echo "" && \

echo "Assigning permission sets..." && \
sfdx force:user:permset:assign -n EasySpacesObjects && \
sfdx force:user:permset:assign -n SpaceManagementApp && \
echo "" && \

echo "Importing sample data..." && \
sfdx force:data:tree:import -p data/Plan1.json && \
sfdx force:data:tree:import -p data/Plan2.json && \
echo "" && \

echo "Opening org..." && \
sfdx force:org:open -p /lightning/page/home && \
echo ""

EXIT_CODE="$?"
echo ""

# Check exit code
echo ""
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "Installation completed."
else
    echo "Installation failed."
fi
exit $EXIT_CODE
