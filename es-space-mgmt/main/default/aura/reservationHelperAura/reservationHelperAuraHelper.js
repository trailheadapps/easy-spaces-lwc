({
    launchFlow: function (component) {
        var flow = component.find('flowCmp');
        var rec = component.get('v.recordId');
        var sobj = component.get('v.sobjectType');
        var state = component.get('v.state');
        var inputVariables = [
            { name: 'varRecordId', type: 'String', value: rec },
            { name: 'varSobjectType', type: 'String', value: sobj },
            { name: 'varState', type: 'String', value: state }
        ];

        if (flow) {
            flow.startFlow('createReservation', inputVariables);
        }
    },
    refreshTab: function (component) {
        var lwcHelper = component.find('reservHelperLWC');
        var sobj = component.get('v.sobjectType');

        lwcHelper.handleFlowExit({ detail: sobj });
        var navItemAPI = component.find('navigationItemAPI');

        navItemAPI
            .refreshNavigationItem()
            .then(function (response) {
                // Response is true or false, depending on page state
                // True on successful refresh, false if unsaved changes block refresh
                // eslint-disable-next-line no-console
                console.log('navRefresh', response);
            })
            .catch(function (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }
});
