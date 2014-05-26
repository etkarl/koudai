(function ($) {
    window.extendDialog = function (options) {
        var dialogId = 'extendDialog-' + (new Date()).getTime(),
            dialogType = options.type,
            dialogMsg = options.msg,
            callback = options.callback,
            dialogContent = {
                confirm: '<div style="width:450px" class="e-dialog e-dialog-small" id="' + dialogId + '">' +
	                        '<header>' +
	                        '<h2 class="title">系统提示</h2>' +
	                        '<span title="关闭" class="dialog-close-btn close"></span>' +
	                        '</header>' +
	                        '<div class="content" style="padding:30px 15px;line-height:21px;text-align:center">' + dialogMsg +
	                        '</div>' +
	                        '<footer>' +
                            '<input type="button" value="确定" class="e-btn w80 mr10 e-btn-primary callback"><input type="button" value="取消" class="e-btn w80 close">' +
	                        '</footer>' +
	                    '</div>',
                welcomeTips: '<div class="dialog-welcome" id="' + dialogId + '">' +
                            '<input type="button" value="更多新版秘密" class="e-btn callback" />' +
                            '<input type="button" value="参观新版" class="e-btn close" />' +
                        '</div>'
            };
        $.use('ui-dialog', function () {
            $('body').append(dialogContent[dialogType]);
            var el = $('#' + dialogId);
            el.dialog({
                modalCSS: {
                    background: '#000',
                    opacity: 0.5
                },
                center: true
            }).delegate('.close', 'click', function (e) {
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
    }
})(window.jQuery);