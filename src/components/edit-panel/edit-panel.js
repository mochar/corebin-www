define([
	'knockout',
	'text!./edit-panel.html',
	'knockout-postbox'
], function(ko, template) { 

	function ViewModel(params) { 
		var self = this; 
		
		self.object = params.object;
		self.name = params.name;
		self.cssName = self.name.replace(' ', '-') + '-name';
		self.beforeContent = '#' + self.cssName + '::before { content: "' + self.name + ' ";}';
		self.canRename = params.canRename || true;
		self.canDelete = params.canDelete || true;
		self.canDownload = params.canDownload || false;
		
        self.assembly = ko.observable().subscribeTo('assembly', true);
		
		self.renaming = ko.observable(false);
		self.newName = ko.observable('');
		self.busyRenaming = ko.observable(false);
		
		self.toggleRename = function() { self.renaming(!self.renaming()); };
		
		self.rename = function() {
			self.busyRenaming(true);
			$.ajax({
				url: self.object().url,
				type: 'PUT',
				data: {'name': self.newName()},
				success: function() {
					self.object().name(self.newName());
				},
				complete: function() { 
					self.newName('');
					self.busyRenaming(false); 
					self.renaming(false);
				}
			});
		};

		self.download = function() {
			// TODO: download
		};
	};
	
    return {
        viewModel: ViewModel,
        template: template
    };
});

