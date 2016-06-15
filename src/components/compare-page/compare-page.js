define(['knockout', 'text!./compare-page.html', 'jquery', 'knockout-postbox'], function(ko, template, $) {

    function ViewModel(params) {
        var self = this;
        
        self.assembly = ko.observable().subscribeTo('assembly', true);
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.binSets = ko.observable().subscribeTo('binSets', true);
        self.otherBinSet = ko.observable();
        
        self.dirty = ko.observable(false);
        self.matrix = [
            [11975,  5871, 8916, 2868],
            [ 1951, 10048, 2060, 6171],
            [ 8010, 16145, 8090, 8045],
            [ 1013,   990,  940, 6907]];
        
        self.plot = function() {
            var params = {
                binset1: self.binSet().id, 
                binset2: self.otherBinSet().id};
            $.getJSON('/a/' + self.assembly().id + '/matrix', params, function(data) {
                self.matrix = data.matrix;
                self.dirty(true);
            });
        };
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});