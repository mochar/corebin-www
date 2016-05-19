define(['jquery', 'knockout', 'd3', 'c3'], function($, ko, d3, c3) {
    ko.bindingHandlers.histChart = {
        init: function(element, valueAccessor, allBindings) {
            var chart = c3.generate({
                bindto: element,
                data: {
                    x: 'x',
                    columns: [['x'], ['frequency']],
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.8
                    }
                },
                axis: {
                    x: {
                        type: 'category'
                    }
                },
                legend: {
                    show: false
                }
            });
            $(element).data('chart', chart);
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = valueAccessor()();
            var chart = $(element).data('chart');
            chart.load({ columns: data });
        }
    }
});