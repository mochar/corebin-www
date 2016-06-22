define(['knockout', 'text!./bin-section.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel() {
        var self = this;
        
        self.binSet = ko.observable().subscribeTo('binSet', true);
        self.bin = ko.observable().subscribeTo('bin', true);
        self.loading = ko.observable(true);
        self.editing = ko.observable(false);
        self.newName = ko.observable('');
        
        self.toggleEditing = function() { self.editing(!self.editing()); };
        
        self.rename = function(element) {
            var binSet = self.binSet();
            var bin = self.bin();
            var newName = self.newName();
            $.ajax({
                url: '/a/' + binSet.assembly + '/bs/' + binSet.id + '/b/' + bin.id,
                type: 'PUT',
                data: { name: newName },
                success: function(data) {
                    self.bin().name(newName);
                    self.newName('');
                    self.editing(false);
                }
            });
        };
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});