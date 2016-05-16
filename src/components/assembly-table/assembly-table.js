define(['knockout', 'text!./assembly-table.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.contigs = ko.observableArray([]);
        self.loading = ko.observable(true);
        
        ko.postbox.subscribe('assembly', function(assembly) {
            if (!assembly) return;
            $.getJSON('/a/' + assembly.id + '/c', {'items': 10}, function(data) {
                self.contigs(data.contigs);
                self.loading(false);
            })
        }, true);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});