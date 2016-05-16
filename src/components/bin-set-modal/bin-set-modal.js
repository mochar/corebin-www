define(['knockout', 'text!./bin-set-modal.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.assembly = ko.observable().subscribeTo('assembly');
        
        self.uploadBinSet = function(formElement) {
            var formData = new FormData(formElement);
            formElement.reset();
            var assembly = self.assembly();
            if (!assembly) return;
            $.ajax({
                url: '/a/' + assembly.id + '/bs',
                type: 'POST',
                data: formData,
                async: false,
                success: function(data) {
                    self.binSets.push(data);
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