({
    updateReservation: function (component, event, helper) {
        var rec = event.getParam('recordId');

        component.set('v.selectedSpace', rec);
        helper.navigateFlow(component, helper);
    },
    updateAndGo: function (component, event, helper) {
        var rec = event.getParam('recordId');

        component.set('v.selectedSpace', rec);
        component.set('v.popTabOnFinish', true);
        helper.navigateFlow(component, helper);
    }
});
