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
    };
    
    ko.bindingHandlers.scatterPlot = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 550 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                svg = d3.select(element).append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // add the tooltip area
            d3.select(element).append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
            
            svg.append('rect')
                .attr('width', width)
                .attr('height', height)
                .style('fill', 'none')
                .style('pointer-events', 'all');
                
            // container for dots
            var container = svg.append("svg")
                .classed("container", true)
                .attr("width", width)
                .attr("height", height);

            // axes
            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
            .append('text')
                .attr('class', 'label')
                .attr('x', width)
                .attr('y', -6)
                .style('text-anchor', 'end');

            svg.append('g')
                .attr('class', 'y axis')
            .append('text')
                .attr('class', 'label')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end');
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var contigs = valueAccessor()(),
                panning = allBindings.get('panning')(),
                x = allBindings.get('x')(),
                y = allBindings.get('y')();
            
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 550 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                svg = d3.select(element).select('g'),
                tooltip = d3.select(element).select('.tooltip');

            // setup x
            var xValue = function(d) { return d[x.data()];}, // data -> value
                xScale = x.log() ? d3.scale.log().range([0, width]) : // value -> display
                                   d3.scale.linear().range([0, width]),
                xMap = function(d) { return xScale(xValue(d));}, // data -> display
                xAxis = d3.svg.axis().scale(xScale).orient('bottom');

            // setup y
            var yValue = function(d) { return d[y.data()];},
                yScale = y.log() ? d3.scale.log().range([height, 0]) :
                                   d3.scale.linear().range([height, 0]),
                yMap = function(d) { return yScale(yValue(d));},
                yAxis = d3.svg.axis().scale(yScale).orient('left');

            // don't want dots overlapping axis, so add in buffer to data domain
            xScale.domain([d3.min(contigs, xValue), d3.max(contigs, xValue)]);
            yScale.domain([d3.min(contigs, yValue), d3.max(contigs, yValue)]);
            
            // setup zoom
            var zoom = d3.behavior.zoom()
                .x(xScale)
                .y(yScale)
                .scaleExtent([0, 500])
                .on('zoom', function() {
                    svg.select('.x.axis').call(xAxis);
                    svg.select('.y.axis').call(yAxis);
                    svg.selectAll('circle').attr('transform', transform);
                });
            svg.call(zoom);

            // axes
            svg.select('.x').transition().duration(500).call(xAxis);
            svg.select('.x').select('.label').text(x.data());
            svg.select('.y').transition().duration(500).call(yAxis);
            svg.select('.y').select('.label').text(y.data());

            // draw dots
            var container = svg.select('svg.container');
            var dots = container.selectAll('.dot').data(contigs, function(d) { return d.id; });

            dots.exit()
                .transition()
                .attr('r', 0)
                .remove();

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', 0)
                .style('opacity', 0.5)
                .style('fill', function(d) { return d.color; })
                .on('mouseover', function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    tooltip.html(d.name)
                        .style('left', (d3.event.pageX + 5) + 'px')
                        .style('top', (d3.event.pageY - 28) + 'px');
                })
                .on('mouseout', function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                })
                .on('click', function(d) {
                });

            dots.transition()
                .style('fill', function(d) { return d.color; })
                .attr('r', 4)
                .attr('transform', transform);
                
            function transform(d) {
                return "translate(" + xMap(d) + "," + yMap(d) + ")";
            }
        }
    };
});