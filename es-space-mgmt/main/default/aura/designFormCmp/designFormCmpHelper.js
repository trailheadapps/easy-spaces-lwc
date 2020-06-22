({
    navigateFlow: function (component) {
        // Attribute provided by the lightning:availableForFlowScreens interface
        var navigate = component.get('v.navigateFlow');

        navigate('NEXT');
    }
});
