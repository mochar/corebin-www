define([
    'knockout',
    'text!./navigator.html',
    'knockout-postbox',
], function(ko, template, $) {
    
    function ViewModel(params) {
        var self = this;
        self.route = params.route;
        self.assembly = ko.observable().syncWith('assembly');
        self.assemblies = ko.observableArray([]).subscribeTo('assemblies');
        self.assemblyLoading = ko.observable().subscribeTo('assemblyLoading');
        self.binSet = ko.observable().syncWith('binSet');
        self.binSets = ko.observableArray([]).subscribeTo('binSets');
        
        self.selectAssembly = function(assembly) { self.assembly(assembly); };
        self.selectBinSet = function(binSet) { self.binSet(binSet); };
    };
    
    return { viewModel: ViewModel, template: template };
});