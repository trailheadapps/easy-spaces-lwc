({
    getSpaces : function(component, event, helper) {
        var params = event.getParam('arguments');
        var mktRecord = params.marketRecordId;
        var action = component.get("c.getRelatedSpaces");
        action.setParams({
            recordId : mktRecord
        });
        action.setCallback(this, function(response){
            component.set("v.relatedSpaces", response.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    getStateMarkets: function(component, event, helper){
        var params = event.getParam('arguments');
        var currentState = params.state;
        var action = component.get("c.getMarketsByState");
        action.setParams({
            state : currentState
        });
        action.setCallback(this, function(response){
            var mkts = response.getReturnValue();
            if(mkts && mkts.length > 0){
                component.set("v.marketsByState", response.getReturnValue());
            } 
        });
        $A.enqueueAction(action);
    }
})
