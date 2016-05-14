define(['knockout', './router'], function(ko, router) {
    ko.components.register('navigator', {require: 'components/navigator/navigator'});
    
    ko.components.register('home-page', {
        template: { require: 'text!components/home-page/home-page.html' }
    });
    ko.components.register('home-sidebar', {require: 'components/home-sidebar/home-sidebar'});
    
    ko.components.register('assembly-page', {require: 'components/assembly-page/assembly-page'});
    ko.components.register('assembly-sidebar', {require: 'components/assembly-sidebar/assembly-sidebar'});
    ko.components.register('assembly-table', {require: 'components/assembly-table/assembly-table'});
    
    ko.components.register('bin-set-page', {require: 'components/bin-set-page/bin-set-page'});
    ko.components.register('bin-set-sidebar', {require: 'components/bin-set-sidebar/bin-set-sidebar'});
    
    ko.applyBindings({route: router.currentRoute, sidebar: router.currentSidebar});
});