define(['knockout', 'text!./assembly-table.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.contigs = ko.observableArray([]);
        self.loading = ko.observable(true);
        self.assembly = ko.observable().subscribeTo('assembly', true);
        
        ko.postbox.subscribe('bin', function(bin) {
            self.contigs([]);
            self.loading(true);
            if (!bin) return;
            var data = {items: 15, bins: bin.id};
            $.getJSON('/a/' + self.assembly().id + '/c', data, function(data) {
                self.contigs(data.contigs);
                self.loading(false);
            })
        }, true);
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});