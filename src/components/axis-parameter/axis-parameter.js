define(['knockout', 'text!./axis-parameter.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.data = params.data;
        self.samples = params.samples;
        self.name = params.name || '';
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});