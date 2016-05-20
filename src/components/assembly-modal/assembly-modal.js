define(['knockout', 'text!./assembly-modal.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.assemblies = ko.observableArray([]).syncWith('assemblies');
        self.assembly = ko.observable().syncWith('assembly');
        
        self.resetForm = function() {
            self.hasHeaders = ko.observable(true);
            self.samples = ko.observableArray([]);
            self._samples = [];
        };
        self.resetForm();
        
        self.onFileChange = function(file) {
            var reader = new FileReader();
            reader.onload = function() {
                var allTextLines = this.result.split(/\r\n|\n/);
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
            var formData = new FormData(formElement);
            
            // Add sample names
            var samples = self.samples()
            for (var i = 0; i < samples.length; i++) {
                formData.append('samples[]', samples[i]);
            }
            
            // Reset form
            formElement.reset();
            self.resetForm();
            
            $.ajax({
                url: '/a',
                type: 'POST',
                data: formData,
                async: false,
                success: function(data) {
                    self.assemblies.push(data);
                    self.assembly(data);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        };
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});