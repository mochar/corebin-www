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
        self.assemblyJobs = ko.observableArray([]).syncWith('assemblyJobs');
        self.assemblyLoading = ko.observable(true).publishOn('assemblyLoading');
        
        self.selectAssembly = function(assembly) { self.assembly(assembly); };
        
        self.unselectedAssemblies = ko.computed(function() {
            var assembly = self.assembly();
            return self.assemblies().filter(function(a) { return a != assembly });
        });
        
        setInterval(function() {
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
        }, 3000);
        
        // Get data from server
        $.getJSON('/jobs/', function(data) {
            var assembliesInJob = [];
            self.assemblyJobs(data.jobs.map(function(job) {
                assembliesInJob.push(job.meta.id);
                job.meta.status = ko.observable(job.meta.status);
                return job;
            }));
            $.getJSON('/a', function(data) { 
                var assemblies = data.assemblies.filter(function(assembly) {
                    return assembliesInJob.indexOf(assembly.id) === -1;
                }); 
                self.assemblies(assemblies);
                self.assembly(assemblies[0]);
                self.assemblyLoading(false);
            });
        })
    };
    
    return { 
        viewModel: { instance: new ViewModel() }, 
        template: template 
    };
});