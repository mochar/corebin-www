define([
    'knockout', 
    'text!./bin-sets-panel.html', 
    'app/classes', 
    'knockout-postbox'
], function(ko, template, classes) {

    function ViewModel() {
        var self = this;
        
        self.loading = ko.observable(true);
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.binSet = ko.observable().syncWith('binSet');
        self.bins = ko.observableArray([]).syncWith('bins');
        self.bin = ko.observable().syncWith('bin');
        self.hmmerJobs = ko.observableArray([]).subscribeTo('hmmerJobs', true);
        
        self.isSelectedBin = function(binId) {
            var bin = self.bin();
            return bin && bin.id == binId;
        };
        
        // Get bin sets of current selected assembly
        ko.postbox.subscribe('assembly', function(assembly) {
            self.binSets([]);
            self.binSet(null);
            self.bins([]);
            self.bin(null);
            self.loading(true);
            if (!assembly) return;
            $.getJSON('/a/' + assembly.id + '/bs', function(data) {
                self.binSets(data.binSets.map(function(bs) { return classes.BinSet(bs); }))
                if (data.binSets.length > 0) self.binSet(self.binSets()[0]);
            })
        }, true);
        
        // Get bins of current selected bin set
        ko.postbox.subscribe('binSet', function(binSet) {
            self.loading(true);
            if (!binSet) {
                self.loading(false);
                return;
            }
            var url = '/a/' + binSet.assembly + '/bs/' + binSet.id + '/b';
            $.getJSON(url, function(data) {
                var assessingBins = self.hmmerJobs().map(function(j) { return j.meta.bin });
                self.bins(data.bins.map(function(bin) { 
                    var bin = classes.Bin(bin, binSet.assembly);
                    if (assessingBins.indexOf(bin.id) > -1) bin.assessing(true);
                    return bin;
                }));
                if (data.bins.length > 0) self.bin(self.bins()[0]);
                self.loading(false);
            })
        }, true);
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});