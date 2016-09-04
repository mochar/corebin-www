define(['knockout', 'text!./assembly-upload.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.assemblyJob = ko.observable().syncWith('assemblyJob', true);
        self.assembly = ko.observable().syncWith('assembly', true);
        self.loading = ko.observable(false);
        
        self.resetForm = function() {
            self.hasHeaders = ko.observable(true);
            self.samples = ko.observableArray([]);
            self._samples = [];
        };
        self.resetForm();
        
        self.onFileChange = function(file) {
            var reader = new FileReader();
            reader.onload = function() {
                var allTextLines = this.result.split(/\r|\r\n|\n/);
                var headers = allTextLines[0].replace(/\t/g, ',').split(',');
                self._samples = headers.slice(1);
                self.samples(self._samples);
            };
            reader.readAsText(file);
        };
        
        ko.computed(function() {
            var hasHeaders = self.hasHeaders();
            var samples = [];
            for (var i = 0; i < self._samples.length; i++) {
                var j = i + 1;
                samples.push('sample_' + j);
            }
            self.samples(hasHeaders ? self._samples : samples);
        });
        
        self.uploadAssembly = function(formElement) {
            self.loading(true);
            var formData = new FormData(formElement);
            
            // Add sample names
            var samples = self.samples()
            for (var i = 0; i < samples.length; i++) {
                formData.append('samples[]', samples[i]);
            }
            
            $.ajax({
                url: '/a',
                type: 'POST',
                data: formData,
                async: true,
                success: function(data, textStatus, jqXHR) {
                    var job = { location: jqXHR.getResponseHeader('Location') };
                    job.meta = data;
                    job.meta.status = ko.observable(job.meta.status);
                    self.assemblyJob(job);
                    
                    // Reset form
                    formElement.reset();
                    self.resetForm();
                    self.loading(false);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        };
    };
    
    return {
        viewModel: { instance: new ViewModel() },
        template: template
    };
});