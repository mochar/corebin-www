define(['jquery', 'knockout', 'd3', 'd3-lasso'], function($, ko, d3) {
    ko.bindingHandlers.contigVis = {
        init: function(element, valueAccessor, allBindings) {
            var width = parseInt(d3.select(element).style('width'), 10),
                height = width / 8,
                svg = d3.select(element).append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('border', 1);
            
            svg.append('rect')
                .attr("x", 0)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", width)
       			.style("stroke", 'black')
       			.style("fill", "none")
       			.style("stroke-width", 2);
       
            svg.append('rect')
                .attr('class', 'gc-border')
                .attr("x", 0)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", 0)
       			.style("stroke", 'black')
       			.style("fill", "yellow")
                .style('opacity', 0.4)
       			.style("stroke-width", 2);
                   
            svg.append('text')
                .text('GC')
                .attr('x', 3)
                .attr("y", height / 2)
                .attr('dy', '.35em')
                .attr('font-weight', 'bold')
                .style('text-anchor', 'begin');
                
            svg.append('text')
                .attr('class', 'gc-label')
                .attr('x', width - 3)
                .attr("y", height / 2)
                .attr('dy', '.35em')
                .style('text-anchor', 'end');
        },
        update: function(element, valueAccessor, allBindings) {
            var width = parseInt(d3.select(element).style('width'), 10),
                height = width / 8,
                svg = d3.select(element).select('svg');
            
            var contigs = valueAccessor()(),
                gc = d3.mean(contigs, function(contig) { return contig.gc; }) || 0,
                length = d3.mean(contigs, function(contig) { return contig.length; }) || 0;
            
            var x = d3.scale.linear()
                .domain([0, 1])
                .range([0, width]);
                
            svg.select('rect.gc-border').transition()
                .attr('width', x(gc));
            svg.select('text.gc-label').transition()
                .text(d3.format('.2f')(gc))
                .attr('x', x(gc) - 3);
        }
    }
    ko.bindingHandlers.histPlot = {
        init: function(element, valueAccessor, allBindings) {
            var margin = {top: 5, right: 5, bottom: 18, left: 40},
                width = parseInt(d3.select(element).style('width'), 10)
                width = width - margin.left - margin.right,
                height = parseInt(d3.select(element).style('width'), 10) * 0.6
                height = height - margin.top - margin.bottom,
                svg = d3.select(element).append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
            svg.append("g")
                .attr("class", "x axis hist-axis")
                .attr("transform", "translate(0," + height + ")");
            
            svg.append("g")
                .attr("class", "y axis hist-axis");
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var margin = {top: 5, right: 5, bottom: 18, left: 40},
                width = parseInt(d3.select(element).style('width'), 10)
                width = width - margin.left - margin.right,
                height = parseInt(d3.select(element).style('width'), 10) * 0.6
                height = height - margin.top - margin.bottom,
                svg = d3.select(element).select('g');
                
            var data = valueAccessor()(),
                bins = data.bins,
                data = data.hist;
                
            if (!data) return;
            
            // Setup x and y
            var x = d3.scale.linear().range([0, width]).domain([0, bins.length]);
            var y = d3.scale.linear().range([height, 0]).domain([0, d3.max(data)]);
            var xAxis = d3.svg.axis().scale(x).orient('bottom');//.tickValues(bins);
            var yAxis = d3.svg.axis().scale(y).orient('left');
            svg.select('.x').call(xAxis);
            svg.select('.y').call(yAxis);
            
            // Remove all bars
            svg.selectAll('.bar').remove();
            
            // Update with new bars
            var bar = svg.selectAll('.bar').data(data);
            
            bar.enter().append('g')
                .attr('class', 'bar')
                .attr("transform", function(d, i) { 
                    return "translate(" + x(i) + "," + y(d) + ")"; 
                });
                
            bar.append('rect')
                .attr('x', 1)
                .attr('y', height)
                .attr('width', function(d, i) { return width / bins.length - 1; })
                .attr('height', function(d) { return height - y(d); });
                
            bar.selectAll('rect').transition()
                .attr('y', 0);
        }
    };
    
    ko.bindingHandlers.scatterPlot = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = parseInt(d3.select(element).style('width'), 10)
                width = width - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                svg = d3.select(element).append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var selected = allBindings.get('selected');

            // add the tooltip area
            d3.select(element).append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
            
            // container for events
            var rect = svg.append('rect')
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
                
            // setup zoom
            var zoom = d3.behavior.zoom().scaleExtent([0, 500]);
            svg.call(zoom);
            $(element).data('zoom', zoom);
            
            // setup lasso
            var lasso = d3.lasso()
                .items(container.selectAll('.dot'))
                .area(rect)
                .on('end', function() {
                    var _selected = lasso.items()
                        .filter(function(d) {return d.selected})
                        .style('opacity', 1);
                    var allSelected = selected().concat(_selected.data());
                    var unique = allSelected.filter(function(value, i, arr) { 
                        return arr.indexOf(value) === i; 
                    });
                    selected(unique);
                });
            svg.call(lasso);
            $(element).data('lasso', lasso);
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var contigs = valueAccessor()(),
                panning = allBindings.get('panning')(),
                x = allBindings.get('x')(),
                y = allBindings.get('y')(),
                selected = allBindings.get('selected'),
                colorMethod = allBindings.get('color')(),
                colorBinSet = allBindings.get('colorBinSet')();
            
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = parseInt(d3.select(element).style('width'), 10)
                width = width - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                svg = d3.select(element).select('g'),
                container = svg.select('svg.container'),
                rect = svg.select('rect'),
                tooltip = d3.select(element).select('.tooltip');

            var zoom = $(element).data('zoom'),
                lasso = $(element).data('lasso');
             
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

            // axes
            svg.select('.x').transition().duration(500).call(xAxis);
            svg.select('.y').transition().duration(500).call(yAxis);
            svg.select('.x')
                .select('.label')
                .text(x.data())
                .attr('visibility', x.label() ? 'visible' : 'hidden');
            svg.select('.y')
                .select('.label')
                .text(y.data())
                .attr('visibility', y.label() ? 'visible' : 'hidden');

            // color gradient scale for gc-content
            var colorScale = d3.scale.linear()
                .range(['lightgreen', 'red']) 
                .domain([0.4, 0.6]); 
            
            // draw dots
            var dots = container.selectAll('.dot').data(contigs, function(d) { return d.id; });

            dots.exit()
                .transition()
                .attr('r', 0)
                .remove();

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', 0)
                .style('opacity', 0.5)
                .style('fill', function(d) { 
                    return colorMethod === 'gc' ? colorScale(d.gc) : d['color_' + colorBinSet.id]; 
                })
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
                    var isSelected = selected.indexOf(d) > -1; 
                    d3.select(this).style('opacity', isSelected ? 0.5 : 1);
                    isSelected ? selected.remove(d) : selected.push(d);
                });

            dots.transition()
                .style('fill', function(d) { 
                    return colorMethod === 'gc' ? colorScale(d.gc) : d['color_' + colorBinSet.id]; 
                })
                .attr('r', 4)
                .attr('transform', transform);
            
            // Update zoom and lasso behavior
            zoom.x(xScale).y(yScale).on('zoom', function() {
                    svg.select('.x.axis').call(xAxis);
                    svg.select('.y.axis').call(yAxis);
                    svg.selectAll('.dot').attr('transform', transform);
                });
            lasso.items(container.selectAll('.dot'));
            if (panning) {
                rect.on(".dragstart", null);
                rect.on(".drag", null);
                rect.on(".dragend", null);
                svg.select('g.lasso').remove();
                svg.call(zoom);
            } else {
                svg.on('mousedown.zoom', null);
                svg.call(lasso);
            }
            if (selected().length === 0) { 
                lasso.items()
                    .style('opacity', 0.5)
                    .forEach(function(d) {
                        d.selected = false;
                    });
            }
                
            function transform(d) {
                return "translate(" + xMap(d) + "," + yMap(d) + ")";
            }
        }
    };
    
    ko.bindingHandlers.toggleClick = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();

            ko.utils.registerEventHandler(element, "click", function () {
                value(!value());
            });
        }
    };
});