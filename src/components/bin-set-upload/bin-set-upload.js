define(['knockout', 'text!./bin-set-upload.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel() {
        var self = this;
        
        self.binSet = ko.observable().syncWith('binSet', true);
        self.binSets = ko.observableArray([]).syncWith('binSets', true);
        self.assembly = ko.observable().subscribeTo('assembly', true);
        
        self.uploadBinSet = function(formElement) {
            var assembly = self.assembly();
            if (!assembly) return;
            
            var formData = new FormData(formElement);
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
                    if (self.binSets().length === 1) self.binSet(data);
                    formElement.reset();
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