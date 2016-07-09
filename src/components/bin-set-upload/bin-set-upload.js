define(['knockout', 'text!./bin-set-upload.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel() {
        var self = this;
        
        self.binSet = ko.observable().syncWith('binSet', true);
        self.binSets = ko.observableArray([]).syncWith('binSets', true);
        self.assembly = ko.observable().subscribeTo('assembly', true);
        self.binSetJobs = ko.observableArray([]).syncWith('binSetJobs', true);
        self.loading = ko.observable(false);
        
        self.uploadBinSet = function(formElement) {
            self.loading(true);
            var assembly = self.assembly();
            if (!assembly) return;
            
            var formData = new FormData(formElement);
            $.ajax({
                url: '/a/' + assembly.id + '/bs',
                type: 'POST',
                data: formData,
                async: true,
                success: function(data, textStatus, jqXHR) {
                    var job = { location: jqXHR.getResponseHeader('Location') };
                    job.meta = data;
                    self.binSetJobs.push(job);
                    formElement.reset();
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