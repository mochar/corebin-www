define(['knockout', 'text!./refine-page.html', 'jquery', 'knockout-postbox'], function(ko, template, $) {

    function Axis(data) {
        var self = this;
        self.data = ko.observable(data.data);
        self.log = ko.observable(data.log);
        self.label = ko.observable(true);
    }

    function ViewModel(params) {
        var self = this;
        
        self.loading = ko.observable(false);
        self.panning = ko.observable(true);
        self.tab = ko.observable('bin-table'); 
        self.color = ko.observable('bin');
        self.bins = ko.observableArray([]).syncWith('bins', true);
        self.selectedBins = ko.observableArray([]);
        self.selectedContigs = ko.observableArray([]);
        self.hoveredContig = ko.observable();
        
        self.assembly = ko.observable().subscribeTo('assembly', true);
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.binSets = ko.observableArray([]).subscribeTo('binSets', true);
        self.colorBinSet = ko.observable(self.binSet());
        
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
            var binSet = self.binSet(),
                assembly = self.assembly(),
                colorBinSet = self.colorBinSet(),
                payload = {
                    fields: 'id,length,gc,name',
                    bins: bin.id,
                    coverages: true,
                    pca: assembly.hasFourmerfreqs,
                    colors: true,
                    items: assembly.size
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
        
        ko.computed(function() {
            var binSet = self.binSet();
            self.colorBinSet(binSet);
        });
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});