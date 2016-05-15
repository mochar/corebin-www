define(['knockout', 'text!./bin-set-modal.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.binSets = ko.observableArray([]).syncWith('binSets');
        
        self.uploadBinSet = function(formElement) {
            var formData = new FormData(formElement);
            formElement.reset();
            $.ajax({
                url: '/bs',
                type: 'POST',
                data: formData,
                async: false,
                success: function(data) {
                },
                complete: function() {
                    self.binSets.push(formData.get('name'));
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