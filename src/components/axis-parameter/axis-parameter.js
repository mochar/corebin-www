define(['knockout', 'text!./axis-parameter.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
        
        self.axis = params.axis;
        self.samples = params.samples;
        self.hasFourmerfreqs = params.hasFourmerfreqs;
        self.name = params.name || '';
        
        self.toggleLog = function() {
            var axis = self.axis();
            self.axis().log(axis.log() ? false : true);
        }
        
        self.toggleLabel = function() {
            var axis = self.axis();
            self.axis().label(axis.label() ? false : true);
        }
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});