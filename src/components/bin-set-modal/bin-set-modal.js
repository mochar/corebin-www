define(['knockout', 'text!./bin-set-modal.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.binSets = ko.observableArray([]).syncWith('binSets');
        self.assembly = ko.observable().subscribeTo('assembly');
        self.binSet = ko.observable().subscribeTo('binSet');
        
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
                    data.isSelected = ko.computed(function() {
                        var binSet = self.binSet();
                        return binSet && binSet.id == data.id;
                    });
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