// ----------------------------------------------------------------------
// utils
// ----------------------------------------------------------------------


// serialize form data to object
$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// unique array
var uniqueArray = function (arrArg) {
    return arrArg.filter(function (elem, pos, arr) {
        return arr.indexOf(elem) == pos;
    });
};