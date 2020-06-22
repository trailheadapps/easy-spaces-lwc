({
    handleSelect: function (component, event, helper) {
        var recId = event.getParam('customerId');
        var objType = event.getParam('sobjectType');
        var state = event.getParam('state');

        component.set('v.recordId', recId);
        component.set('v.sobjectType', objType);
        component.set('v.state', state);
        helper.launchFlow(component, event, helper);
    },
    handleStatusChange: function (component, event, helper) {
        if (event.getParam('status') === 'FINISHED') {
            helper.refreshTab(component);
        }
    }
});
