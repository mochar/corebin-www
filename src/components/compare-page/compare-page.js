define(['knockout', 'text!./compare-page.html', 'knockout-postbox'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});