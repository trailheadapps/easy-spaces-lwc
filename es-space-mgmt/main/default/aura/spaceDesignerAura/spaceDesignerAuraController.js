({
    handleChoice: function (component, event, helper) {
        var recId = event.getParam('reservationId');
        var market = event.getParam('marketId');
        var customer = event.getParam('customerName');

        component.set('v.reservation', recId);
        component.set('v.customer', customer);
        helper.startFlow(component, recId, market);
    },

    handleReset: function (component, event) {
        if (event.getParam('status') === 'FINISHED') {
            var spaceDesignerLWC = component.find('spaceDesignerLWC');

            spaceDesignerLWC.handleFlowExit();
            var navigationItemAPI = component.find('navigationItemAPI');

            navigationItemAPI.refreshNavigationItem().catch(function (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            });
        }
    }
});
