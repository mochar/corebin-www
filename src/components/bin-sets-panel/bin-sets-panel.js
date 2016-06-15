define(['knockout', 'text!./bin-sets-panel.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.loading = ko.observable(true);
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.binSet = ko.observable().publishOn('binSet');
        
        self.selectBinSet = function(binSet) { self.binSet(binSet); };
        
        // Get bin sets of current selected assembly
        ko.postbox.subscribe('assembly', function(assembly) {
            self.loading(true);
            self.binSets([]);
            if (!assembly) return;
            $.getJSON('/a/' + assembly.id + '/bs', function(data) {
                self.loading(false);
                self.binSets(data.binSets.map(function(bs) { 
                    bs.isSelected = ko.computed(function() {
                        var binSet = self.binSet();
                        return binSet && binSet.id == bs.id;
                    });
                    return bs;
                }));
                self.binSet(data.binSets[0]);
            })
        }, true);
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});