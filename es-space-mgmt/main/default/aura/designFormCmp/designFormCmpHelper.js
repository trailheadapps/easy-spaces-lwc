({
    navigateFlow : function(component, helper){
        //attribute provided by the lightning:availableForFlowScreens interface
        var navigate = component.get("v.navigateFlow");
        navigate("NEXT");
    }
})
