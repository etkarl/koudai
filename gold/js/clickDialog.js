(function (window, $) {
    window.localDataStore = {
        hname: location.hostname ? location.hostname : 'localStatus',
        isLocalStorage: window.localStorage ? true : false,
        dataDom: null,
        initDom: function () {
            if (!this.dataDom) {
                try {
                    this.dataDom = document.createElement('input');
                    this.dataDom.type = 'hidden';
                    this.dataDom.style.display = "none";
                    this.dataDom.addBehavior('#default#userData');
                    document.body.appendChild(this.dataDom);
                    var exDate = new Date();
                    exDate = exDate.getDate() + 30;
                    this.dataDom.expires = exDate.toUTCString();
                } catch (ex) {
                    return false;
                }
            }
            return true;
        },
        set: function (key, value) {
            if (this.isLocalStorage) {
                window.localStorage.setItem(key, value);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.setAttribute(key, value);
                    this.dataDom.save(this.hname)
                }
            }
        },
        get: function (key) {
            if (this.isLocalStorage) {
                return window.localStorage.getItem(key);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    return this.dataDom.getAttribute(key);
                }
            }
        },
        remove: function (key) {
            if (this.isLocalStorage) {
                localStorage.removeItem(key);
            } else {
                if (this.initDom()) {
                    this.dataDom.load(this.hname);
                    this.dataDom.removeAttribute(key);
                    this.dataDom.save(this.hname)
                }
            }
        }
    };
    window.extendDialog = function (options) {
        var dialogId = 'extendDialog-' + (new Date()).getTime(),
            dialogType = options.type,
            dialogMsg = options.msg,
            callback = options.callback,
            closeEvent = options.closeEvent,
            dialogContent = {
                goToNewVersion: '<div class="dialog-welcome" id="' + dialogId + '">' +
                            '<input type="button" value="go to new page" class="e-btn callback" />' +
                            '<input type="button" value="close" class="e-btn close" />' +
                        '</div>'
            };
        $.use('ui-dialog', function () {
            $('body').append(dialogContent[dialogType]);
            console.log(dialogContent[dialogType]);
            var el = $('#' + dialogId);
            el.dialog({
                modalCSS: {
                    background: '#000',
                    opacity: 0.5
                },
                center: true
            }).delegate('.close', 'click', function (e) {
                if (closeEvent) {
                    closeEvent();
                }
                el.dialog('close');
                el.remove();
            }).delegate('.callback', 'click', function () {
                if (callback) {
                    callback();
                }
                el.dialog('close');
                el.remove();
            });
        });
    };
    window.getDateStrByAddDays = function (addDayCount, currentDate) {
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
        return y + "_" + m + "_" + d;
    };
})(window, jQuery);
; (function ($) {
    if(localDataStore.get('APLUSNEWPAGE_CLICK') == null){
        localDataStore.set('APLUSNEWPAGE_CLICK', getDateStrByAddDays(0));
    }
    if(localDataStore.get('APLUSNEWPAGE_CLICK') == getDateStrByAddDays(0)){
        localDataStore.set('APLUSNEWPAGE_CLICK', getDateStrByAddDays(1));
        extendDialog({
            type       : 'goToNewVersion',
            closeEvent : function(){
                
            },
            callback   : function(){
                
            }
        });
    }
})(jQuery);