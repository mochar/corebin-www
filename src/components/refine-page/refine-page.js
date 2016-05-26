define(['knockout', 'text!./refine-page.html', 'jquery', 'knockout-postbox'], function(ko, template, $) {

    function ViewModel(params) {
        var self = this;
        
        self.loading = ko.observable(true);
        self.bins = ko.observableArray([]);
        self.selectedContigs = ko.observableArray([]);
        self.selectedBins = ko.observableArray([]);
        
        self.assembly = ko.observable().subscribeTo('assembly', true);
        self.binSet = ko.observable().subscribeTo('binSet', true);
        
        // Plot options
        self.contigs = ko.observableArray([]);
        self.x = ko.observable('gc');
        self.y = ko.observable('length');
        
        // Get the contigs on bin selection change
        self.selectedBins.subscribe(function(changes) {
            changes.forEach(function(change) {
                console.log(change);
                if (change.status === 'added') { // Plot new contigs
                    self.getContigs(change.value)
                } else if (change.status === 'deleted') { // Remove plotted contigs
                    self.removeContigs(change.value)
                } 
            });
        }, null, 'arrayChange');
        
        self.getContigs = function(bin) {
            console.log('getting contigs');
            self.loading(true);
            var payload = {
                fields: 'id,length,gc,name',
                bins: bin.id,
                coverages: true,
                items: self.assembly().size
            };
            $.getJSON('/a/' + self.binSet().assembly + '/c', payload, function(data) {
                self.contigs(data.contigs.map(function(contig) {
                    contig.color = bin.color;
                    contig.bin = bin.id;
                    return contig;
                }));
                self.loading(false);
            });
        };
        
        self.removeContigs = function(bin) {
            console.log('removing contigs');
            self.contigs(self.contigs().filter(function(contig) {
                return contig.bin != bin.id;
            }));
        }
        
        // New bin set selected
        ko.postbox.subscribe('binSet', function(binSet) {
            self.loading(true);
            if (!binSet) return;
            $.getJSON('/a/' + binSet.assembly + '/bs/' + binSet.id + '/b', function(data) {
                self.bins(data.bins);
                self.loading(false);
            })
        }, true);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});