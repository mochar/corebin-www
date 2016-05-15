define(['knockout', 'text!./assembly-modal.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.assemblies = ko.observableArray([]).syncWith('assemblies');
        
        self.uploadAssembly = function(formElement) {
            var formData = new FormData(formElement);
            formElement.reset();
            $.ajax({
                url: '/a',
                type: 'POST',
                data: formData,
                async: false,
                success: function(data) {
                    self.assemblies.push(data);
                },
                complete: function() {
                    self.assemblies.push(formData.get('name'));
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