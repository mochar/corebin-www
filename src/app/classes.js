define(['knockout', 'knockout-postbox'], function(ko) {

    // Bin
    function _Bin(data, assembly) {
        this.assessing = ko.observable(false);
        this.assembly = assembly;
        this.setData(data, assembly);
        this.assessed = ko.computed(this.assessed, this);
    }
    
    _Bin.prototype.setData = function(data) {
        this.name = ko.observable(data.name);
        this.color = data.color;
        this.bin_set_id = data.bin_set_id;
        this.n50 = data.n50;
        this.gc = data.gc;
        this.contamination = ko.observable(data.contamination);
        this.completeness = ko.observable(data.completeness);
        this.size = data.size;
        this.id = data.id;
        this.url = '/a/' + this.assembly + '/bs/' + this.bin_set_id + '/b/' + this.id;
    }
    
    _Bin.prototype.assessed = function() {
        return this.contamination() == null ? false : true;
    }
    
    _Bin.prototype.remove = function() {
        var bins = ko.observableArray([]).syncWith('bins', true);
        bins.remove(this);
        ko.observable().syncWith('bin', true)(bins()[0]);
    }
    
    // Assembly
    function _Assembly(data) {
        this.id = data.id;
        this.name = ko.observable(data.name);
        this.binSets = data.binSets;
        this.hasFourmerfreqs = data.hasFourmerfreqs;
        this.samples = data.samples;
        this.size = data.size;
        this.url = '/a/' + data.id;
    }
    
    _Assembly.prototype.remove = function() {
        var assemblies = ko.observableArray([]).syncWith('assemblies', true);
        assemblies.remove(this);
        ko.observable().syncWith('assembly', true)(assemblies()[0]);
    }
    
    // Bin set
    function _BinSet(data) {
        this.id = data.id;
        this.name = ko.observable(data.name);
        this.bins = data.bins;
        this.color = data.color;
        this.assembly = data.assembly;
        this.url = '/a/' + data.assembly + '/bs/' + data.id;
    }
    
    _BinSet.prototype.remove = function() {
        var binSets = ko.observableArray([]).syncWith('binSets', true);
        binSets.remove(this);
        ko.observable().syncWith('binSet', true)(binSets()[0]);
    }
    
    return {
        Bin: function(data, assembly) { return new _Bin(data, assembly); },
        Assembly: function(data) { return new _Assembly(data); },
        BinSet: function(data) { return new _BinSet(data); }
    }
});