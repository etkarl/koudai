(function ($) {
    window.Util = window.Util || {};
    Util.getValuesByProperty = function (arr, property) {
        var values = [];
        if (toString.apply(arr) === '[object Array]') {
            for (var i = 0, l = arr.length; i < l; i += 1) {
                var o = arr[i];
                values.push(o[property]);
            }
        }
        return values;
    };
})(window.jQuery);

