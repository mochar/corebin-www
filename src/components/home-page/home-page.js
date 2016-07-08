define([
    'knockout',
    'text!./home-page.html',
    'jquery',
    'knockout-postbox',
    'bootstrap'
], function(ko, template, $) {
    
    function ViewModel() {
        var self = this;
        
        self.route = ko.observable({}).subscribeTo('route');
        self.assemblies = ko.observableArray([]).syncWith('assemblies');
        self.assembly = ko.observable().syncWith('assembly');
        self.binSet = ko.observable().syncWith('binSet');
        self.bins = ko.observableArray([]).syncWith('bins');
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.assemblyJobs = ko.observableArray([]).syncWith('assemblyJobs');
        self.binSetJobs = ko.observableArray([]).syncWith('binSetJobs');
        self.hmmerJobs = ko.observableArray([]).syncWith('hmmerJobs');
        self.assemblyLoading = ko.observable(true).publishOn('assemblyLoading');
        
        self.addAssembly = function(assembly) {
            self.assemblies.push(assembly);
            if (self.assemblies().length === 1)
                self.assembly(assembly);
        }
        
        self.addBinSet = function(binSet) {
            var assembly = self.assembly();
            if (binSet.assembly != assembly.id) return;
            self.binSets.push(binSet);
            if (self.binSets().length === 1)
                self.binSet(binSet);
        }
        
        self.checkAssemblyJobs = function() {
            var jobs = self.assemblyJobs();
            jobs.forEach(function(job) {
                $.getJSON(job.location, function(data, textStatus, jqXHR) {
                    if (jqXHR.status == 201) {
                        self.assemblyJobs.remove(job);
                        var location = jqXHR.getResponseHeader('Location');
                        $.getJSON(location, self.addAssembly);
                    } else {
                        job.meta.status(data.status);
                    };
                });
            });
        };
        
        self.checkHmmerJobs = function() {
            var jobs = self.hmmerJobs();
            jobs.forEach(function(job) {
                $.getJSON(job.location, function(data, textStatus, jqXHR) {
                    if (jqXHR.status == 201) {
                        self.hmmerJobs.remove(job);
                        if (self.binSet().id == job.meta.binSet) {
                            self.bins().forEach(function(bin) {
                                if (bin.id == job.meta.bin) {
                                    bin.contamination(data.contamination);
                                    bin.completeness(data.completeness);
                                    bin.assessing(false);
                                    return;
                                }
                            })
                        }
                    }
                });
            });
        };
        
        self.checkBinSetJobs = function() {
            var jobs = self.binSetJobs();
            jobs.forEach(function(job) {
                $.getJSON(job.location, function(data, textStatus, jqXHR) {
                    if (jqXHR.status == 201) {
                        self.binSetJobs.remove(job);
                        var location = jqXHR.getResponseHeader('Location');
                        $.getJSON(location, self.addBinSet);
                    }
                });
            });
        };
        
        setInterval(function() {
            self.checkAssemblyJobs();
            self.checkHmmerJobs();
            self.checkBinSetJobs();
        }, 5000);
        
        // Get data from server
        $.getJSON('/jobs', function(data) {
            var assemblyJobs = data.jobs.filter(function(j) { return j.meta.type == 'A' });
            self.assemblyJobs(assemblyJobs.map(function(job) {
                job.meta.status = ko.observable(job.meta.status);
                return job;
            }));
            
            var binSetJobs = data.jobs.filter(function(j) { return j.meta.type == 'B' });
            self.binSetJobs(binSetJobs);
            
            var hmmerJobs = data.jobs.filter(function(j) { return j.meta.type == 'C' });
            self.hmmerJobs(hmmerJobs);

            $.getJSON('/a', function(data) { 
                self.assemblies(data.assemblies);
                self.assembly(data.assemblies[0]);
                self.assemblyLoading(false);
            });
        })
    };
    
    return { 
        viewModel: { instance: new ViewModel() }, 
        template: template 
    };
});