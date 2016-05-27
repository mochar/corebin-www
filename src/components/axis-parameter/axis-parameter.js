define(['knockout', 'text!./axis-parameter.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.axis = params.axis;
        self.samples = params.samples;
        self.name = params.name || '';
        
        self.toggleLog = function() {
            var axis = self.axis();
            self.axis().log(axis.log() ? false : true);
        }
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});