({
    handleToggle: function (component) {
        var collapse = component.get('v.collapsedView');
        var leftColumn = component.find('leftColumn');
        var rightColumn = component.find('rightColumn');

        component.set('v.collapsedView', !collapse);

        $A.util.toggleClass(leftColumn, 'collapsed');
        $A.util.toggleClass(leftColumn, 'expanded');
        $A.util.toggleClass(rightColumn, 'slds-size--12-of-12');
    }
});
