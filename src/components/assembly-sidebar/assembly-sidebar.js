define(['knockout', 'text!./assembly-sidebar.html'], function(ko, template) {

    function ViewModel(params) {
        var self = this;
    };
    
    return {
        viewModel: ViewModel,
        template: template
    };
});