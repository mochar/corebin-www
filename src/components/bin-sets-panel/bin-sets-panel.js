define(['knockout', 'text!./bin-sets-panel.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.loading = ko.observable(true);
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.binSet = ko.observable().publishOn('binSet');
        self.bins = ko.observableArray([]).syncWith('bins');
        self.bin = ko.observable(); // selected bin
        
        self.selectBinSet = function(binSet) { self.binSet(binSet); };
        
        self.isSelectedBinSet = function(binSetId) { 
            var binSet = self.binSet();
            return binSet && binSet.id == binSetId;
        };
        
        self.isSelectedBin = function(binId) {
            var bin = self.bin();
            return bin && bin.id == binId;
        };
        
        // Get bin sets of current selected assembly
        ko.postbox.subscribe('assembly', function(assembly) {
            self.binSets([]);
            self.binSet(null);
            self.loading(true);
            if (!assembly) return;
            $.getJSON('/a/' + assembly.id + '/bs', function(data) {
                self.binSets(data.binSets);
                self.binSet(data.binSets[0]);
            })
        }, true);
        
        // Get bins of current selected bin set
        ko.postbox.subscribe('binSet', function(binSet) {
            self.loading(true);
            self.bins([]);
            if (!binSet) {
                self.loading(false);
                return;
            }
            var url = '/a/' + binSet.assembly + '/bs/' + binSet.id + '/b';
            $.getJSON(url, function(data) {
                self.bins(data.bins);
                self.loading(false);
            })
        }, true);
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});