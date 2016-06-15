define([
    'knockout',
    'text!./home-page.html',
    'jquery',
    'knockout-postbox',
    'bootstrap'
], function(ko, template, $) {
    
    function ViewModel(params) {
        var self = this;
        
        self.route = ko.observable({}).subscribeTo('route');
        self.assemblies = ko.observableArray([]).syncWith('assemblies');
        self.assembly = ko.observable().syncWith('assembly');
        
        self.selectAssembly = function(assembly) { self.assembly(assembly); };
        
        self.unselectedAssemblies = ko.computed(function() {
            var assembly = self.assembly();
            return self.assemblies().filter(function(a) { return a != assembly });
        });
        
        // Get data from server
        $.getJSON('/a', function(data) { 
            self.assemblies(data.assemblies); 
            self.assembly(data.assemblies[0]);
        });
    };
    
    return { 
        viewModel: { instance: new ViewModel() }, 
        template: template 
    };
});