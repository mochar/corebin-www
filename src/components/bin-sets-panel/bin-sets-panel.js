define(['knockout', 'text!./bin-sets-panel.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.loading = ko.observable(true);
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.binSet = ko.observable().syncWith('binSet');
        
        // Get bin sets of current selected assembly
        ko.postbox.subscribe('assembly', function(assembly) {
            self.loading(true);
            self.binSets([]);
            if (!assembly) return;
            $.getJSON('/a/' + assembly.id + '/bs', function(data) {
                self.loading(false);
                self.binSets(data.binSets);
                self.binSet(data.binSets[0]);
            })
        }, true);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});