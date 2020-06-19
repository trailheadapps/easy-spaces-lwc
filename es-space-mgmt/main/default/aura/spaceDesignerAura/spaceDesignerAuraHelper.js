({
    startFlow: function (component, recId, market) {
        var flow = component.find('flowCmp');
        var inputVariables = [
            { name: 'varReservId', type: 'String', value: recId },
            { name: 'varMarketId', type: 'String', value: market }
        ];

        if (flow) {
            flow.startFlow('spaceDesigner', inputVariables);
        }
    }
});
