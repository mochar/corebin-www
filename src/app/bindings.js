define(['jquery', 'knockout', 'd3', 'c3'], function($, ko, d3, c3) {
    ko.bindingHandlers.histChart = {
        init: function(element, valueAccessor, allBindings) {
            var chart = c3.generate({
                bindto: element,
                data: {
                    x: 'x',
                    columns: [['data'], ['x']],
                    type: 'bar',
                    groups: [['data']]
                },
                legend: { show: false },
                axis: { x: { type: 'category' } }
            });
            $(element).data('chart', chart);
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = valueAccessor()();
            var chart = $(element).data('chart');
            chart.load({ unload: true, columns: data.columns || [['data'], ['x']] });
            chart.groups(data.groups || [['data']]);
        }
    }
});