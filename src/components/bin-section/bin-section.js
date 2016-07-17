define([
    'knockout', 
    'text!./bin-section.html', 
    'jquery', 
    'knockout-postbox', 
    'bootstrap'
], function(ko, template, $) {

    function ViewModel() {
        var self = this;
        
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.bin = ko.observable().syncWith('bin', true);
        self.bins = ko.observableArray().subscribeTo('bins', true);
        self.selectedBins = ko.observableArray().syncWith('selectedBins', true);
        self.hmmerJobs = ko.observableArray([]).syncWith('hmmerJobs', true);
        self.loading = ko.observable(true);
        self.editing = ko.observable(false);
        self.newName = ko.observable('');
        
        self.taxonList = ko.observable({});
        self.rank = ko.observable('domain');
        self.taxon = ko.observable('Bacteria');
        self.taxons = ko.computed(function() {
            return self.taxonList()[self.rank()];
        });
        
        self.edit = function() { self.editing(true); };
        
        self.rename = function(element) {
            var binSet = self.binSet();
            var bin = self.bin();
            var newName = self.newName();
            $.ajax({
                url: '/a/' + binSet.assembly + '/bs/' + binSet.id + '/b/' + bin.id,
                type: 'PUT',
                data: { name: newName },
                success: function(data) {
                    self.bin().name(newName);
                    self.newName('');
                    self.editing(false);
                }
            });
        };
        
        self.assess = function() {
            var bin = self.bin();
            var data = {bin: bin.id, rank: self.rank(), taxon: self.taxon()};
            $.post('/hmmer', data, function(data, textStatus, jqXHR) {
                bin.assessing(true);
                var job = { location: jqXHR.getResponseHeader('Location') };
                job.meta = data;
                self.hmmerJobs.push(job);
            });
            $('#a-ssesser').popover('toggle');
        };
        
        self.refine = function() {
            self.selectedBins.removeAll();
            self.selectedBins.push(self.bin());
            return true;
        };
        
        $.getJSON('/hmmer', function(data) { self.taxonList(data.taxonList); });
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});