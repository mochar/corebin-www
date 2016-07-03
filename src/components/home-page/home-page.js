define([
    'knockout',
    'text!./home-page.html',
    'jquery',
    'knockout-postbox',
    'bootstrap'
], function(ko, template, $) {
    
    function ViewModel(params) {
        var self = this;
        
        self.route = ko.observable({}).subscribeTo('route');
        self.assemblies = ko.observableArray([]).syncWith('assemblies');
        self.assembly = ko.observable().syncWith('assembly');
        self.binSet = ko.observable().syncWith('binSet');
        self.bins = ko.observableArray([]).syncWith('bins');
        self.assemblyJobs = ko.observableArray([]).syncWith('assemblyJobs');
        self.hmmerJobs = ko.observableArray([]).syncWith('hmmerJobs');
        self.assemblyLoading = ko.observable(true).publishOn('assemblyLoading');
        
        self.selectAssembly = function(assembly) { self.assembly(assembly); };
        
        self.unselectedAssemblies = ko.computed(function() {
            var assembly = self.assembly();
            return self.assemblies().filter(function(a) { return a != assembly });
        });
        
        self.checkAssemblyJobs = function() {
            var jobs = self.assemblyJobs();
            jobs.forEach(function(job) {
                $.getJSON(job.location, function(data, textStatus, jqXHR) {
                    if (jqXHR.status == 201) {
                        self.assemblyJobs.remove(job);
                        var location = jqXHR.getResponseHeader('Location');
                        $.getJSON(location, function(a) { self.assemblies.push(a); });
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
        
        setInterval(function() {
            self.checkAssemblyJobs();
            self.checkHmmerJobs();
        }, 5000);
        
        // Get data from server
        $.getJSON('/jobs', function(data) {
            var assemblyJobs = data.jobs.filter(function(j) { return j.meta.type == 'A' });
            self.assemblyJobs(assemblyJobs.map(function(job) {
                job.meta.status = ko.observable(job.meta.status);
                return job;
            }));
            
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