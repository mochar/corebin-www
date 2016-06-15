define(['knockout', 'crossroads', 'hasher', 'knockout-postbox'], function(ko, crossroads, hasher) {
    return new Router({
        routes: [
            { url: '', params: { page: 'home-page' } },
            { url: 'home', params: { page: 'home-page' } },
            { url: 'overview', params: { page: 'overview-page' } },
            { url: 'compare', params: { page: 'compare-page' } },
            { url: 'refine', params: { page: 'refine-page' } }
        ]
    });

    function Router(config) {
        var currentRoute = this.currentRoute = ko.observable({}).publishOn('route');
        ko.utils.arrayForEach(config.routes, function(route) {
            crossroads.addRoute(route.url, function(requestParams) {
                currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        activateCrossroads();
    }

    function activateCrossroads() {
        function parseHash(newHash, oldHash) { crossroads.parse(newHash); }
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    }
});