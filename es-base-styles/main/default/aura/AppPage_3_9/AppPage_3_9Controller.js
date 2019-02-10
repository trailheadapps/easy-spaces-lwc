({
    handleToggle: function(component, event, helper) {
        var collapse = component.get('v.collapsedView');
        component.set('v.collapsedView', !collapse);
        var leftColumn = component.find('leftColumn');
        var rightColumn = component.find('rightColumn');
        $A.util.toggleClass(leftColumn, 'collapsed');
        $A.util.toggleClass(leftColumn, 'expanded');
        $A.util.toggleClass(rightColumn, 'slds-size--12-of-12');
    }
});
