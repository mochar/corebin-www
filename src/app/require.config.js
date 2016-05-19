var require = {
    baseUrl: '/',
    paths : {
        'jquery': 'bower_components/jquery/dist/jquery',
        'knockout': 'bower_components/knockout/dist/knockout',
        'text': 'bower_components/text/text',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
        'crossroads': 'bower_components/crossroads/dist/crossroads.min',
        'hasher': 'bower_components/hasher/dist/js/hasher.min',
        'signals': 'bower_components/js-signals/dist/signals.min',
        'knockout-postbox': 'bower_components/knockout-postbox/build/knockout-postbox',
        'd3': 'bower_components/d3/d3',
        'c3': 'bower_components/c3/c3'
    },
    shim: {
        'bootstrap': { deps: ['jquery'] }
    }
};