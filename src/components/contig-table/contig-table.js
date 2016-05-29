define(['knockout', 'text!./contig-table.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.contigs = params.contigs;
        self.bins = params.bins;
        self.action = ko.observable('');
        self.toBin = ko.observable();
        
        self.move = function() {
            self.action(null);
            self.toBin(null);
        }
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});