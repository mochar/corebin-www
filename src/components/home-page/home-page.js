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
        self.assemblyJob = ko.observable().syncWith('assemblyJob');
        self.binSetJob = ko.observable().syncWith('binSetJob');
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
        
        self.checkAssemblyJob = function() {
            var job = self.assemblyJob();
            console.log(job);
            $.getJSON(job.location, function(data, textStatus, jqXHR) {
                if (jqXHR.status == 201) {
                    self.assemblyJob(null);
                    var location = jqXHR.getResponseHeader('Location');
                    $.getJSON(location, self.addAssembly);
                } else {
                    job.meta.status(data.status);
                };
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
        
        self.checkBinSetJob = function() {
            var job = self.binSetJob();
            $.getJSON(job.location, function(data, textStatus, jqXHR) {
                if (jqXHR.status == 201) {
                    self.binSetJob(null);
                    var location = jqXHR.getResponseHeader('Location');
                    $.getJSON(location, self.addBinSet);
                }
            });
        };
        
        setInterval(function() {
            if (self.assemblyJob()) self.checkAssemblyJob();
            if (self.binSetJob()) self.checkBinSetJob();
            self.checkHmmerJobs();
        }, 5000);
        
        // Get data from server
        $.getJSON('/jobs', function(data) {
            data.jobs.forEach(function(job) {
                if (job.meta.type == 'A') { // assembly job
                    job.meta.status = ko.observable(job.meta.status);
                    self.assemblyJob(job);
                } else if (job.meta.type == 'B') { // bin set job
                    self.binSetJob(job);
                }
            });
            
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