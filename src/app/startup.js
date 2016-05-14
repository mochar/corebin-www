define(['knockout', './router'], function(ko, router) {
    ko.components.register('navigator', {require: 'components/navigator/navigator'});
    ko.components.register('home-page', {require: 'components/home-page/home-page'});
    ko.components.register('assembly-page', {require: 'components/assembly-page/assembly-page'});
    ko.components.register('bin-set-page', {require: 'components/bin-set-page/bin-set-page'});
    
    ko.applyBindings({route: router.currentRoute});
});