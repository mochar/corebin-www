define([
    'knockout',
    'text!./navigator.html',
    'knockout-postbox',
], function(ko, template, $) {
    
    function ViewModel(params) {
        var self = this;
        self.route = params.route;
        self.assembly = ko.observable().subscribeTo('assembly');
        self.assemblyLoading = ko.observable().subscribeTo('assemblyLoading');
        self.binSet = ko.observable().subscribeTo('binSet');
    };
    
    return { viewModel: ViewModel, template: template };
});