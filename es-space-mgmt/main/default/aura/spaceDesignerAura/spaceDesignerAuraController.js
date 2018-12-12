({

    handleChoice : function(component, event, helper){
        var recId = event.getParam("reservationId");
        var market = event.getParam("marketId");
        var customer = event.getParam("customerName");
        component.set("v.reservation", recId);
        component.set("v.customer", customer);
        helper.startFlow(component, recId, market);
    },

    handleReset : function(component, event, helper){
        if(event.getParam("status") === "FINISHED"){
            var spaceDesignerLWC = component.find("spaceDesignerLWC");
            spaceDesignerLWC.handleFlowExit();
            var navigationItemAPI = component.find("navigationItemAPI");
            navigationItemAPI.refreshNavigationItem().then(function(response) {
                //for illustration of the refreshNavigationItem() promise response
                //true on refresh, false if refresh blocked
                console.log('navRefresh',response);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }
})
