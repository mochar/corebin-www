define(['knockout', 'text!./bin-set-page.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(route) {
        var self = this;
        
        self.binSet = ko.observable().subscribeTo('binSet');
        self.tab = ko.observable(route.tab || 'overview');
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});