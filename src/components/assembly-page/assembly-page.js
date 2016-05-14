define(['knockout', 'text!./assembly-page.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.assembly = ko.observable().subscribeTo('assembly');
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});