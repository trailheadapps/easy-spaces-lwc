({
    getFields : function(component, event, helper) {
        var params = event.getParam('arguments');
        var objType = params.sobject;
        var action = component.get("c.getCustomerFields");
        action.setParams({
            objectType : objType
        });
        action.setCallback(this, function(response){
            var custObj = response.getReturnValue();
            var fields = Object.values(custObj);
            component.set("v.customer", custObj);
            component.set("v.fieldsArray", fields);
        });
        $A.enqueueAction(action);
    }
})
