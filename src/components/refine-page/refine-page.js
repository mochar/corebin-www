define(['knockout', 'text!./refine-page.html', 'jquery', 'knockout-postbox'], function(ko, template, $) {

    function Axis(data) {
        var self = this;
        self.data = ko.observable(data.data);
        self.log = ko.observable(data.log);
        self.label = ko.observable(true);
    }

    function ViewModel(params) {
        var self = this;
        
        self.loading = ko.observable(true);
        self.panning = ko.observable(true);
        self.tab = ko.observable('bin-table'); 
        self.color = ko.observable('bin');
        self.bins = ko.observableArray([]);
        self.selectedBins = ko.observableArray([]);
        self.selectedContigs = ko.observableArray([]);
        self.colorBinSet = ko.observable({name: '', id: 0});
        
        self.assembly = ko.observable().subscribeTo('assembly', true);
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.binSets = ko.observableArray([]).subscribeTo('binSets', true);
        
        // Plot options
        self.contigs = ko.observableArray([]);
        self.x = ko.observable(new Axis({data: 'gc', log: false}));
        self.y = ko.observable(new Axis({data: 'length', log: false}));
        
        // Get the contigs on bin selection change
        self.selectedBins.subscribe(function(changes) {
            changes.forEach(function(change) {
                if (change.status === 'added') { // Plot new contigs
                    self.getContigs(change.value)
                } else if (change.status === 'deleted') { // Remove plotted contigs
                    self.removeContigs(change.value)
                } 
            });
        }, null, 'arrayChange');
        
        self.getContigs = function(bin) {
            self.loading(true);
            var binSet = self.binSet()
                colorBinSet = self.colorBinSet();
                payload = {
                    fields: 'id,length,gc,name',
                    bins: bin.id,
                    coverages: true,
                    colors: true,
                    items: self.assembly().size
                };
            $.getJSON('/a/' + binSet.assembly + '/c', payload, function(data) {
                self.contigs(self.contigs().concat(data.contigs.map(function(contig) {
                    contig.bin = bin.id;
                    return contig;
                })));
                self.loading(false);
            });
        };
        
        self.removeContigs = function(bin) {
            self.contigs(self.contigs().filter(function(contig) {
                return contig.bin != bin.id;
            }));
        }
        
        // New bin set selected
        ko.postbox.subscribe('binSet', function(binSet) {
            self.loading(true);
            if (!binSet) { 
                self.bins([]);
                self.colorBinSet({name: '', id: 0});
                self.loading(false);
            } else {
                $.getJSON('/a/' + binSet.assembly + '/bs/' + binSet.id + '/b', function(data) {
                    self.bins(data.bins);
                    self.colorBinSet(binSet);
                    self.loading(false);
                })
            }
        }, true);
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});