define(['knockout', './router', './bindings'], function(ko, router, bindings) {
    require(bindings);
    
    ko.components.register('navigator', {require: 'components/navigator/navigator'});
    ko.components.register('axis-parameter', {require: 'components/axis-parameter/axis-parameter'});
    ko.components.register('contig-table', {require: 'components/contig-table/contig-table'});
    ko.components.register('bin-table', {require: 'components/bin-table/bin-table'});
    ko.components.register('edit-panel', {require: 'components/edit-panel/edit-panel'});
    
    ko.components.register('assembly-table', {require: 'components/assembly-table/assembly-table'});
    ko.components.register('assembly-upload', {require: 'components/assembly-upload/assembly-upload'});
    
    ko.components.register('bin-set-upload', {require: 'components/bin-set-upload/bin-set-upload'});
    ko.components.register('bin-sets-panel', {require: 'components/bin-sets-panel/bin-sets-panel'});
    ko.components.register('bin-section', {require: 'components/bin-section/bin-section'});
    
    ko.components.register('home-page', {require: 'components/home-page/home-page'});
    ko.components.register('overview-page', {require: 'components/overview-page/overview-page'});
    ko.components.register('compare-page', {require: 'components/compare-page/compare-page'});
    ko.components.register('refine-page', {require: 'components/refine-page/refine-page'});
    ko.components.register('help-page', {require: 'components/help-page/help-page'});
    
    ko.applyBindings({ route: router.currentRoute });
});