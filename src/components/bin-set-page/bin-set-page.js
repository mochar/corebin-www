define(['knockout', 'text!./bin-set-page.html'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.binSet = ko.observable().subscribeTo('binSet');
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});