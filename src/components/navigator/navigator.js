define([
    'knockout',
    'text!./navigator.html',
    'knockout-postbox',
], function(ko, template) {
    
    function ViewModel() {
        var self = this;
        
        self.route = ko.observable().syncWith('route', true);
        self.assembly = ko.observable().syncWith('assembly');
        self.assemblies = ko.observableArray([]).subscribeTo('assemblies');
        self.assemblyLoading = ko.observable().subscribeTo('assemblyLoading');
        self.binSet = ko.observable().syncWith('binSet');
        self.binSets = ko.observableArray([]).subscribeTo('binSets');
        
        self.selectAssembly = function(assembly) { 
            self.assembly(assembly);
            return true;
        };
        
        self.selectBinSet = function(binSet) { 
            self.binSet(binSet); 
            return true; 
        };
    };
    
    return { viewModel: { instance: new ViewModel() }, template: template };
});