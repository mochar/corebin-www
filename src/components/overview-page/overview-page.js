define([
    'knockout',
    'text!./overview-page.html',
    'jquery',
    'd3',
    'knockout-postbox',
    'app/bindings'
], function(ko, template, $, d3) {

    function ViewModel(params) {
        var self = this;
        
        self.assembly = ko.observable().subscribeTo('assembly', true);
        self.binSets = ko.observableArray([]).subscribeTo('binSets', true);
        self.lengthData = ko.observable({'data': [], 'bins': []});
        self.gcData = ko.observable({'data': [], 'bins': []});
        
        self.updateCharts = function(assembly, binSetId) {
            var url = '/a/' + assembly.id + '/c/plot';
            
            binSetId = null; // Bin set plot slow, normal plot for now
            if (binSetId) {
                $.getJSON(url, {bs: binSetId}, function(data) {
                    // Length plot
                    var binSets = Object.keys(data.length);
                    var x = Object.keys(data.length[binSets[0]]);
                    var columns = binSets.map(function(binSet) {
                        var d = x.map(function(v) { return data.length[binSet][v]; });
                        return [binSet].concat(d);
                    });
                    columns.push(['x'].concat(x));
                    self.lengthData({ columns: columns, groups: [binSets] });
                    
                    // GC plot
                    var binSets = Object.keys(data.gc);
                    var x = Object.keys(data.gc[binSets[0]]);
                    var columns = binSets.map(function(binSet) {
                        var d = x.map(function(v) { return data.gc[binSet][v]; });
                        return [binSet].concat(d);
                    });
                    columns.push(['x'].concat(x));
                    self.gcData({ columns: columns, groups: [binSets] });
                });
            } else {
                $.getJSON(url, function(data) {
                    self.lengthData(data.length);
                    self.gcData(data.gc);
                });
            }
        }
        
        ko.postbox.subscribe('assembly', function(assembly) {
            if (!assembly) return;
            self.updateCharts(assembly);
        }, true);
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});