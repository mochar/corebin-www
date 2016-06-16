define(['knockout', 'text!./compare-page.html', 'jquery', 'knockout-postbox'], function(ko, template, $) {

    function ViewModel(params) {
        var self = this;
        
        self.binSets = ko.observable().subscribeTo('binSets', true);
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.bins = ko.observableArray([]).subscribeTo('bins', true);
        self.otherBinSet = ko.observable();
        self.otherBins = ko.observableArray([]);
        
        self.dirty = ko.observable(false);
        self.matrix = [
            [11975,  5871, 8916, 2868],
            [ 1951, 10048, 2060, 6171],
            [ 8010, 16145, 8090, 8045],
            [ 1013,   990,  940, 6907]];
        self.binsIndices = ko.observableArray([]);
        self.otherBinsIndices = ko.observableArray([]);
        
        self.mapIdToIndex = function(binIds, bins) {
            var ids = bins.map(function(bin) { return bin.id });
            return binIds.map(function(binId) { return ids.indexOf(binId); });
        }
        
        self.plot = function() {
            var binSet = self.binSet(),
                otherBinSet = self.otherBinSet(),
                params = {binset1: binSet.id, binset2: otherBinSet.id};
            $.when(
                $.getJSON('/a/' + binSet.assembly + '/matrix', params),
                $.getJSON('/a/' + binSet.assembly + '/bs/' + otherBinSet.id + '/b')
            ).then(
                function(respMatrix, respBins) {
                    self.otherBins(respBins[0].bins);
                    self.matrix = respMatrix[0].matrix;
                    self.binsIndices(self.mapIdToIndex(respMatrix[0].bins1, self.bins()));
                    self.otherBinsIndices(self.mapIdToIndex(respMatrix[0].bins2, self.otherBins()));
                    self.dirty(true);
                }
            );
        };
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});