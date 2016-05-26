define([
    'knockout',
    'text!./overview-page.html',
    'jquery',
    'd3',
    'c3',
    'knockout-postbox',
    'app/bindings'
], function(ko, template, $, d3, c3) {

    function ViewModel(params) {
        var self = this;
        
        self.assembly = ko.observable();
        self.lengthData = ko.observable({});
        self.gcData = ko.observable({});
        
        self.updateCharts = function(binSetId) {
            var assembly = self.assembly();
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
                    // Length plot
                    var x = Object.keys(data.length);
                    var d = ['data'].concat(x.map(function(v) { return data.length[v] }));
                    var columns = [['x'].concat(x), d];
                    self.lengthData({ columns: columns });
                    
                    // GC plot
                    var x = Object.keys(data.gc);
                    var d = ['data'].concat(x.map(function(v) { return data.gc[v] }));
                    var columns = [['x'].concat(x), d];
                    self.gcData({ columns: columns });
                });
            }
        }
        
        ko.postbox.subscribe('assembly', function(assembly) {
            if (!assembly) return;
            self.assembly(assembly);
            // if (assembly.bin_sets.length == 0) self.updateCharts();
            self.updateCharts();
        }, true);
        
        ko.postbox.subscribe('binSet', function(binSet) {
            if (!binSet) return;
            // self.updateCharts(binSet.id);
        }, true);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});