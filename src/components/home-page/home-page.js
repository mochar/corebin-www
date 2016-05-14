define(['knockout', 'text!./home-page.html'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});