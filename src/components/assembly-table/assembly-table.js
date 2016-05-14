define(['knockout', 'text!./assembly-table.html'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.contigs = ko.observableArray([]);
        
        // Get data
        self.contigs([
            {name: 'contig-1', gc: 0.42, length: 1000},
            {name: 'contig-2', gc: 0.42, length: 1000},
            {name: 'contig-3', gc: 0.42, length: 1000},
            {name: 'contig-4', gc: 0.42, length: 1000},
            {name: 'contig-5', gc: 0.42, length: 1000},
            {name: 'contig-6', gc: 0.42, length: 1000},
            {name: 'contig-7', gc: 0.42, length: 1000},
            {name: 'contig-8', gc: 0.42, length: 1000},
            {name: 'contig-9', gc: 0.42, length: 1000},
            {name: 'contig-10', gc: 0.42, length: 1000}
        ]);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});