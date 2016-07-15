define([
    'knockout', 
    'text!./contig-table.html', 
    'app/classes',
    'knockout-postbox'
], function(ko, template, classes) {

    function Pagination(contigs) {
        var self = this;
        self.contigs = contigs;
        self.items = 15;
        self.page = ko.observable(1);
        self.pages = ko.computed(function() {
            return Math.ceil(self.contigs().length / self.items);
        });
        self.offset = ko.computed(function() {
            return (self.page() - 1) * self.items;
        });
        self.showContigs = ko.computed(function() {
            var offset = self.offset();
            return self.contigs().slice(offset, offset + self.items + 1);
        });
        self.prev = function() { if (self.canPrev()) self.page(self.page() - 1); };
        self.next = function() { if (self.canNext()) self.page(self.page() + 1); };
        self.canPrev = ko.computed(function() { return self.page() > 1; });
        self.canNext = ko.computed(function() { return self.page() < self.pages(); });
    }

    function ViewModel(params) {
        var self = this;
        
        self.contigs = params.contigs; // selected contigs
        self.allContigs = params.allContigs; // all contigs
        self.bins = params.bins;
        self.selectedBins = params.selectedBins;
        self.loading = params.loading;
        self.showInfo = ko.observable();
        self.action = ko.observable('');
        self.pagination = new Pagination(self.contigs);
        self.toBin = ko.observable();
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.assembly = ko.observable().subscribeTo('assembly', true);
        
        self.fromBin = ko.computed(function() {
            // Get unique bin ids from selected contigs
            var bins = self.contigs().map(function(c) { return c.bin });
            bins = bins.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
            // If more than one bin id is present, return null, else bin id
            var bin = self.bins().filter(function(bin) { return bin.id == bins[0]})[0];
            return bins.length == 1 ? bin : null;
        });
        
        self.updateBin = function(bin, newBin) {
            delete newBin.contigs;
            bin.setData(newBin);
        };
        
        self.updateContigs = function(fromBin, toBin) {
            var contigs = self.contigs().map(function(c) { return c.id; });
            var selectedBins = self.selectedBins().map(function(b) { return b.id; });
            // Update bin value of moved contigs
            var allContigs = self.allContigs().map(function(contig) {
                if (contigs.indexOf(contig.id) > -1) {
                    contig.bin = toBin.id;
                    contig['color_' + toBin.bin_set_id] = toBin.color;
                }
                [fromBin, toBin].forEach(function(bin) {
                    if (contig.bin == bin.id) {
                        contig['pc_1'] = bin.pcs[contig.id]['pc_1']
                        contig['pc_2'] = bin.pcs[contig.id]['pc_2']
                        contig['pc_3'] = bin.pcs[contig.id]['pc_3']
                    }
                });
                return contig;
            });
            // Only keep contigs of selected bins
            allContigs = allContigs.filter(function(contig) {
                return selectedBins.indexOf(contig.bin) > -1;
            });
            self.allContigs(allContigs);
        };
        
        self.move = function() {
            self.loading(true);
            var binSet = self.binSet(),
                toBin = self.toBin(),
                fromBin = self.fromBin(),
                url = '/a/' + binSet.assembly + '/bs/' + binSet.id + '/b/',
                contigs = self.contigs().map(function(c) { return c.id }).join(',');
            $.when(
                $.ajax({
                    url: url + fromBin.id,
                    type: 'PUT',
                    data: {contigs: contigs, action: 'remove'}
                }),
                $.ajax({
                    url: url + toBin.id,
                    type: 'PUT',
                    data: {contigs: contigs, action: 'add'}
                })
            ).done(function(from, to) {
                self.updateContigs(from[0], to[0])
                self.updateBin(fromBin, from[0]);
                self.updateBin(toBin, to[0]);
                self.bins.valueHasMutated();
                self.contigs([]);
                self.action(null);
                self.toBin(null);
                self.loading(false);
            });
        }
        
        self.remove = function() {
            self.action(null);
        }
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});