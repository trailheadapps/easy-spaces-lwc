@echo OFF
cd %CD%/..

rem Set parameters
set ORG_ALIAS=easy-spaces

@echo:
echo Installing Easy Spaces scratch org (%ORG_ALIAS%)
@echo:

rem Install script
echo Cleaning previous scratch org...
cmd.exe /c sfdx force:org:delete -p -u %ORG_ALIAS% 2>NUL
@echo:

echo Creating scratch org...
cmd.exe /c sfdx force:org:create -s -f config/project-scratch-def.json -d 30 -a %ORG_ALIAS%
call :checkForError
@echo:

echo Pushing source...
cmd.exe /c sfdx force:source:push
call :checkForError
@echo:

echo Assigning permission sets...
cmd.exe /c sfdx force:user:permset:assign -n EasySpacesObjects
call :checkForError
cmd.exe /c sfdx force:user:permset:assign -n SpaceManagementApp
call :checkForError
@echo:

echo Importing sample data...
cmd.exe /c sfdx force:data:tree:import -p data/Plan1.json
call :checkForError
cmd.exe /c sfdx force:data:tree:import -p data/Plan2.json
call :checkForError
@echo:

rem Report install success if no error
@echo:
if ["%errorlevel%"]==["0"] (
  echo Installation completed.
  @echo:
  cmd.exe /c sfdx force:org:open -p lightning/page/home
)

:: ======== FN ======
GOTO :EOF

rem Display error if the install has failed
:checkForError
if NOT ["%errorlevel%"]==["0"] (
    echo Installation failed.
    exit /b %errorlevel%
)