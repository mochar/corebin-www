define(['knockout', 'crossroads', 'hasher'], function(ko, crossroads, hasher) {
    return new Router({
        routes: [
            { url: '', params: { page: 'home-page' } },
            { url: 'assembly', params: { page: 'assembly-page' } },
            { url: 'bin-set', params: { page: 'bin-set-page' } }
        ]
    });

    function Router(config) {
        var currentRoute = this.currentRoute = ko.observable({});
        this.currentSidebar = ko.computed(function() {
            if (this.currentRoute().page === undefined) return;
            return this.currentRoute().page.split('-page')[0] + '-sidebar';
        }, this)

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