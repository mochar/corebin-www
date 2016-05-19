define([
    'knockout',
    'text!./assembly-page.html',
    'jquery',
    'd3',
    'c3',
    'knockout-postbox',
    'app/bindings'
], function(ko, template, $, d3, c3) {

    function ViewModel(params) {
        var self = this;
        
        self.lengthData = ko.observable({});
        self.gcData = ko.observable([]);
        
        ko.postbox.subscribe('assembly', function(assembly) {
            if (!assembly) return;
            var url = '/a/' + assembly.id + '/c';
            $.getJSON(url, {fields: 'gc', items: 10000}, function(data) {
                var gc = data.contigs.map(function(c) { return c.gc; });
                var x = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1];
                var hist = d3.layout.histogram().bins(x)(gc);
                var lengths = hist.map(function(bin) { return bin.length; });
                self.gcData([['x'].concat(x.slice(0, -1)), 
                             ['frequency'].concat(lengths)]);
            });
            
            $.getJSON(url, {fields: 'length', items: 10000}, function(data) {
                var x = ['< 1.0 kb', '1.0 - 3.5 kb', '3.5 - 7.0 kb', '7.0 - 15.0 kb', 
                         '15.0 - 30.0 kb', '30.0 - 60.0 kb', '> 60.kb'];
                var frequency = [0, 0, 0, 0, 0, 0, 0];
                data.contigs.forEach(function(c) { 
                    if (c.length < 1000) {
                        frequency[0]++;
                    } else if (c.length < 3500) {
                        frequency[1]++;
                    } else if (c.length < 7000) {
                        frequency[2]++;
                    } else if (c.length < 15000) {
                        frequency[3]++;
                    } else if (c.length < 30000) {
                        frequency[4]++;
                    } else if (c.length < 60000) {
                        frequency[5]++;
                    } else {
                        frequency[6]++;
                    }
                });
                self.lengthData([['x'].concat(x), 
                                 ['frequency'].concat(frequency)]);
            });
        }, true);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});