var require = {
    baseUrl: '/',
    paths : {
        'jquery': 'bower_components/jquery/dist/jquery',
        'd3': 'bower_components/d3.js',
        'knockout': 'bower_components/knockout/dist/knockout',
        'text': 'bower_components/text/text',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
        'crossroads': 'bower_components/crossroads/dist/crossroads.min',
        'hasher': 'bower_components/hasher/dist/js/hasher.min',
        'signals': 'bower_components/js-signals/dist/signals.min',
        'knockout-postbox': 'bower_components/knockout-postbox/build/knockout-postbox'
    },
    shim: {
        'bootstrap': { deps: ['jquery'] }
    }
};