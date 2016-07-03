define(['jquery', 'knockout', 'd3', 'd3-lasso'], function($, ko, d3) {
    ko.bindingHandlers.chordPlot = {
        init: function(element, valueAccessor, allBindings) {
            var margin = {top: 5, right: 30, bottom: 60, left: 30},
                fullWidth = parseInt(d3.select(element).style('width'), 10),
                width = fullWidth - margin.left - margin.right,
                height = fullWidth - margin.top - margin.bottom,
                innerRadius = Math.min(width, height) * .41,
                outerRadius = innerRadius * 1.1,
                arc = d3.svg.arc()
                    .innerRadius(outerRadius * 1.03).outerRadius(outerRadius * 1.06)
                    .startAngle(0).endAngle(0),
                svg = d3.select(element).append('svg')
                    .attr('width', width)
                    .attr('height', height)
                  .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            svg.append('g').attr('id', 'group');
            svg.append('g').attr('id', 'chord');
            
            // The two arcs around the chord groups
            var arcs = svg.append('g').attr('id', 'arc');
            arcs.append('path')
                .attr('id', 'arc1')
                .style('stroke', '#000000')
                .attr('d', arc);
            arcs.append('path')
                .attr('id', 'arc2')
                .style('stroke', '#000000')
                .attr('d', arc);
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var dirty = valueAccessor()(),
                matrix = viewModel.matrix,
                binSet = viewModel.binSet.peek(),
                otherBinSet = viewModel.otherBinSet.peek(),
                bins = viewModel.bins.peek(),
                otherBins = viewModel.otherBins.peek(),
                binsIndices = viewModel.binsIndices.peek(),
                otherBinsIndices = viewModel.otherBinsIndices.peek();
            if (!dirty) return;
            viewModel.dirty(false);
            
            var margin = {top: 5, right: 30, bottom: 60, left: 30},
                fullWidth = parseInt(d3.select(element).style('width'), 10),
                width = fullWidth - margin.left - margin.right,
                height = fullWidth - margin.top - margin.bottom,
                svg = d3.select(element).select('g'),
                innerRadius = Math.min(width, height) * .41,
                outerRadius = innerRadius * 1.1,
                arc = d3.svg.arc()
                    .innerRadius(outerRadius * 1.03).outerRadius(outerRadius * 1.06),
                chord = d3.layout.chord().padding(.05).matrix(matrix);
                
            function fade(opacity) {
                return function(g, i) {
                    svg.selectAll("#chord path")
                        .filter(function(d) { return d.source.index != i && d.target.index != i; })
                        .transition()
                        .style("opacity", opacity);
                };
            }
            
            function indexToBin(index) {
                if (index < bins.length) return bins[binsIndices[index]];
                return otherBins[otherBinsIndices[index - bins.length]];
            }
            
            // Update groups
            var groupPaths = svg.select('#group').selectAll('path')
                .data(chord.groups(), function(d) { return d.index; });

            groupPaths.enter().append("path")
                .style("stroke", '#000000')
                .style('opacity', 0)
                .on("mouseover", function(d, i) {
                    fade(.1)(d, i);
                })
                .on("mouseout", function(d, i) {
                    fade(1)(d, i);
                })
                .on('click', function(d, i) {
                });

            groupPaths.transition()
                .style("fill", function(d) {
                    return indexToBin(d.index).color;
                })
                .style('opacity', 1)
                .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

            groupPaths.exit()
                .transition()
                .remove();

            // Update chords
            var chordPaths = svg.select('#chord').selectAll('path')
                .data(chord.chords());

            chordPaths.enter()
                .append('path')
                .style('opacity', 0);

            chordPaths.transition()
                .style("fill", function(d) {
                    return indexToBin(d.source.index).color;
                })
                .style('opacity', 1)
                .attr('d', d3.svg.chord().radius(innerRadius));

            chordPaths.exit()
                .transition()
                .remove();
                
            // Update arcs
            if (matrix.length == 0) {
                svg.select('#arc').select('#arc1').attr('d', arc.startAngle(0).endAngle(0));
                svg.select('#arc').select('#arc2').attr('d', arc.startAngle(0).endAngle(0));
                return;
            }

            svg.select('#arc').select('#arc1')
                .attr('fill', binSet.color)
              .transition()
                .attr('d', arc
                    .startAngle(chord.groups()[0].startAngle)
                    .endAngle(chord.groups()[bins.length - 1].endAngle));

            svg.select('#arc').select('#arc2')
                .attr('fill', otherBinSet.color)
              .transition()
                .attr('d', arc
                    .startAngle(chord.groups()[bins.length].startAngle)
                    .endAngle(chord.groups()[bins.length + otherBins.length - 1].endAngle));
        }
    };

    ko.bindingHandlers.contigVis = {
        init: function(element, valueAccessor, allBindings) {
            var width = parseInt(d3.select(element).style('width'), 10),
                height = width / 16,
                svg = d3.select(element).append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('border', 1);
            
            svg.append('rect')
                .attr('class', 'contig-rect')
                .attr("x", 0)
       			.attr("y", 0)
                .attr("rx", 5)
       			.attr("ry", 5)
       			.attr("height", height)
       			.attr("width", width)
       			.style("stroke", '#ddd')
       			.style("fill", "none")
       			.style("stroke-width", 2);
       
            svg.append('rect')
                .attr('class', 'gc-rect')
                .attr("x", 0)
       			.attr("y", 0)
       			.attr("height", height)
       			.attr("width", 0)
       			.style("stroke", '#ddd')
       			.style("fill", "#337ab7")
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
                .attr('x', 0)
                .attr("y", height / 2)
                .attr('dy', '.35em')
                .style('text-anchor', 'end');
                
            svg.append('text')
                .attr('class', 'length-label')
                .attr('x', width - 3)
                .attr("y", height / 2)
                .attr('dy', '.35em')
                .style('text-anchor', 'end');
        },
        update: function(element, valueAccessor, allBindings) {
            var width = parseInt(d3.select(element).style('width'), 10),
                height = width / 16,
                svg = d3.select(element).select('svg'),
                contigs = ko.utils.unwrapObservable(valueAccessor());
            
            if ($.isArray(contigs)) {
                var gc = d3.mean(contigs, function(contig) { return contig.gc; }) || 0;
                var length = d3.mean(contigs, function(contig) { return contig.length; }) || 0;
            } else {
                var gc = contigs.gc;
                var length = contigs.length;
            }
            
            var lengthScale = d3.scale.log()
                .domain([10000, 200000])
                .range([width, width]);
            
            var gcScale = d3.scale.linear()
                .domain([0, 1])
                .range([0, lengthScale(length)]);
                
            var colorScale = d3.scale.linear()
                .domain([0.3, 0.7])
                .range(['blue', 'red']);
                
            svg.select('rect.contig-rect').transition()
                .attr('width', lengthScale(length));
            svg.select('rect.gc-rect').transition()
                .style('fill', colorScale(gc))
                .attr('width', gcScale(gc));
            svg.select('text.gc-label').transition()
                .text(d3.format('.2f')(gc))
                .attr('x', gcScale(gc) - 3);
            svg.select('text.length-label').transition()
                .text(length + "bp");
        }
    }
    
    ko.bindingHandlers.histPlot = {
        init: function(element, valueAccessor, allBindings) {
            var margin = {top: 5, right: 8, bottom: 18, left: 40},
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
            var margin = {top: 5, right: 8, bottom: 18, left: 40},
                width = parseInt(d3.select(element).style('width'), 10)
                width = width - margin.left - margin.right,
                height = parseInt(d3.select(element).style('width'), 10) * 0.6
                height = height - margin.top - margin.bottom,
                svg = d3.select(element).select('g');
                
            var data = valueAccessor()(),
                bins = data.bins,
                data = data.hist,
                tickFormat = allBindings.get('tickFormat');
                
            if (!data) return;
            
            // Thousands formatter: 23123 -> 23k
            var thousandsFormat = d3.format(".2s");
            var format = tickFormat == 'thousands' ? thousandsFormat : d3.format();
            
            // Setup x and y
            var x = d3.scale.ordinal().rangePoints([0, width]).domain(bins);
            var y = d3.scale.linear().range([height, 0]).domain([0, d3.max(data)]);
            var xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(format);
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
                    return "translate(" + x(bins[i]) + "," + y(d) + ")"; 
                });
                
            bar.append('rect')
                .attr('x', 1)
                .attr('y', height)
                .attr('width', function(d, i) { return width / data.length - 1; })
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
                rect = svg.select('rect');

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
                .domain([0.3, 0.7])
                .range(['blue', 'red']);
            
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
                })
                .on('mouseout', function(d) {
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
    
    ko.bindingHandlers.borderColor = {
        update: function(element, valueAccessor, allBindings) {
            var color = ko.unwrap(valueAccessor());
            var width = allBindings.get('borderWidth') || '4px';
            $(element).css('border-left-color', color);
            $(element).css('border-left-width', width);
        }
    };
    
    ko.bindingHandlers.popover = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            var contentSelector = allBindingsAccessor.get('contentSelector');
            var popoverTemplate = '<div id="ko-popover">' + $(contentSelector).html() + '</div>';
            options.content = popoverTemplate;
            options.trigger = 'manual';
            $(element).popover(options);
            
            $(element).click(function() {
                $(this).popover('toggle');
                var thePopover = document.getElementById('ko-popover');
                ko.applyBindings(viewModel, thePopover);
            });
        }
    };
});