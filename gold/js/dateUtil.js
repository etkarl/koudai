(function ($) {
    window.DateUtil = window.DateUtil || {};
    DateUtil.strToDate = function (strDate) {
        if (typeof strDate == "string") {
            var date = eval("new Date(" + strDate.replace(/\d+(?=-[^-]+$)/,
			function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ")");
            return date;
        }
    };
    DateUtil.dateToStr = function (date) {
        var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
    };
    DateUtil.getDateStrByAddDays = function (addDayCount, currentDate) {
        var dd = new Date();
        if (currentDate) {
            dd = currentDate;
        }
        dd.setDate(dd.getDate() + addDayCount);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = dd.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
    };
})(window.jQuery);