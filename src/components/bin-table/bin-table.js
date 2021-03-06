define([
    'knockout', 
    'text!./bin-table.html', 
    'app/classes', 
    'knockout-postbox'
], function(ko, template, classes) {

    function ViewModel(params) {
        var self = this;
        
        self.bins = params.bins;
        self.binSet = params.binSet;
        self.selectedBins = params.selectedBins;
        self.loading = params.loading;
        self.newBin = ko.observable(false);
        
        self.createBin = function(formElement) {
            if (!self.newBin()) return;
            var binSet = self.binSet();
            if (!binSet) return;
            var formData = new FormData(formElement);
            $.ajax({
                url: '/a/' + binSet.assembly + '/bs/' + binSet.id + '/b',
                type: 'POST',
                data: formData,
                async: false,
                success: function(data) {
                    self.bins.push(classes.Bin(data, binSet.assembly));
                    formElement.reset();
                    self.newBin(false);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});