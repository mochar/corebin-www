define([
    'knockout',
    'text!./navigator.html',
    'jquery',
    'knockout-postbox',
    'bootstrap'
], function(ko, template, $) {
    
    function ViewModel(params) {
        var self = this;
        
        self.route = params.route;
        
        self.assemblies = ko.observableArray([]).syncWith('assemblies');
        self.assembly = ko.observable().publishOn('assembly');
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.binSet = ko.observable().publishOn('binSet');
        
        self.selectBinSet = function(binSet) { self.binSet(binSet); };
        self.selectAssembly = function(assembly) { 
            self.assembly(assembly); 
            $.getJSON('/a/' + assembly.id + '/bs', function(data) { 
                self.binSets(data.binSets); 
            });
        };
        
        self.binSetButtonVisible = ko.computed(function() {
            if (self.assemblies().length == 0) return false;
            return self.binSets().length == 0;
        });
        
        ko.computed(function() {
            var assemblies = self.assemblies();
            if (assemblies.length > 0 && !self.assembly()) self.assembly(assemblies[0]);
        });
        
        ko.computed(function() {
            var binSets = self.binSets();
            if (binSets.length > 0 && !self.binSet()) self.binSet(binSets[0]);
        });
        
        // Get data from server
        $.getJSON('/a', function(data) { 
            self.assemblies(data.assemblies); 
            $.getJSON('/a/' + data.assemblies[0].id + '/bs', function(data) { 
                self.binSets(data.binSets); 
            });
        });
    };
    
    return { viewModel: ViewModel, template: template };
});