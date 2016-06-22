define([
	'knockout',
	'text!./new-comp.html',
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

