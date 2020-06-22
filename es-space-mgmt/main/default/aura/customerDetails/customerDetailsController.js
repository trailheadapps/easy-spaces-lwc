({
    draftReservation: function (component, event) {
        component.set('v.startDate', event.getParam('startDate'));
        component.set('v.endDays', event.getParam('endDays'));
        component.set('v.numberOfPeople', event.getParam('numberOfPeople'));
        component.set('v.requestedMarket', event.getParam('requestedMarket'));

        // Attribute provided by the lightning:availableForFlowScreens interface
        var navigate = component.get('v.navigateFlow');

        navigate('NEXT');
    }
});
