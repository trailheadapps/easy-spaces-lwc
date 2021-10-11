({
    // Method name required by lightning:availableForFlowActions interface
    invoke: function (component) {
        var recordId = component.get('v.recordId');
        var sobject = component.get('v.sobject');
        var workspaceAPI = component.find('workspace');

        workspaceAPI
            .openTab({
                url: '/lightning/r/' + sobject + '/' + recordId + '/view'
            })
            .then(function (response) {
                workspaceAPI.focusTab({ tabId: response });
                // Local action 'opens' before flow changes hit cache, so we need to refresh to grab current data
                workspaceAPI.refreshTab({
                    tabId: response,
                    includeAllSubtabs: false
                });
            })
            .catch(function (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            });
    }
});
