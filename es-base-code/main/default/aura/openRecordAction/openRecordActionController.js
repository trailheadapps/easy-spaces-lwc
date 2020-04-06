({
    //method name required by lightning:availableForFlowActions interface
    invoke: function (component, event, helper) {
        var recordId = component.get('v.recordId');
        var sobject = component.get('v.sobject');
        var workspaceAPI = component.find('workspace');
        workspaceAPI
            .openTab({
                url: '/lightning/r/' + sobject + '/' + recordId + '/view'
            })
            .then(function (response) {
                console.log('openRecord detected.');
                workspaceAPI.focusTab({ tabId: response });
                //local action 'opens' before flow changes hit cache, so we need to refresh to grab current data
                workspaceAPI.refreshTab({
                    tabId: response,
                    includeAllSubtabs: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});
