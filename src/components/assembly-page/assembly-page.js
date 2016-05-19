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
            })
        }, true);
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});