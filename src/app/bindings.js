define(['jquery', 'knockout'], function($, ko) {
    ko.bindingHandlers.pieChart = {
        init: function(element, valueAccessor) {
            console.log('init');
        },
        update: function(element, valueAccessor) {
            console.log('update');
        }
    }
});