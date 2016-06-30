define([
	'knockout',
	'text!./help-page.html',
	'knockout-postbox'
], function(ko, template) { 

	function ViewModel() { 
		var self = this; 
		self.globalVar = null; 
	};
	return {
    viewModel: ViewModel,
    template: template
};
});

