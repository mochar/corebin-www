define(['knockout'], function(ko) {
    function _Bin(data) {
        this.assessing = ko.observable(false);
        this.setData(data);
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
    }
    
    _Bin.prototype.assessed = function() {
        return this.contamination() == null ? false : true;
    }
    
    
    return {
        Bin: function(data) { return new _Bin(data); } 
    }
});