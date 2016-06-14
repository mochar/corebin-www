define([
    'knockout',
    'text!./navigator.html',
    'knockout-postbox',
], function(ko, template, $) {
    
    function ViewModel(params) {
        var self = this;
        self.route = params.route;
        self.assembly = ko.observable().subscribeTo('assembly');
    };
    
    return { viewModel: ViewModel, template: template };
});