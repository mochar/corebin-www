define(['knockout', 'text!./navigator.html', 'knockout-postbox', 'bootstrap'], function(ko, template) {
    
    function ViewModel(params) {
        var self = this;
        
        self.assemblies = ko.observableArray([]).publishOn('assemblies');
        self.assembly = ko.observable().publishOn('assembly');
        self.binSets = ko.observableArray([]).publishOn('binSets');
        self.binSet = ko.observable().publishOn('binSet');
        
        self.selectAssembly = function(assembly) { self.assembly(assembly); };
        self.selectBinSet = function(binSet) { self.binSet(binSet); };
        
        // Get data from server
        self.assemblies(['Synthetic', 'Bioreactor']);
        self.assembly(self.assemblies()[0]);
        self.binSets(['CONCOCT', 'MetaBat', 'GroopM']);
        self.binSet(self.binSets()[0]);
    };
    
    return { viewModel: ViewModel, template: template };
});