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
        self.assembly = ko.observable().syncWith('assembly');
        
        self.selectAssembly = function(assembly) { self.assembly(assembly); };
        
        // Get data from server
        $.getJSON('/a', function(data) { 
            self.assemblies(data.assemblies); 
            self.assembly(data.assemblies[0]);
        });
    };
    
    return { viewModel: ViewModel, template: template };
});