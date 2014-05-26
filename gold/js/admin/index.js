(function ($) {
    //e-table
    $(".e-table tbody tr").mouseenter(function () {
        $(this).addClass("selected");
    }).mouseleave(function () {
        $(this).removeClass("selected");
    });
    $(".e-table thead th").mouseenter(function () {
        var index = $(this).parent().children("th").index(this);
        $(this).addClass("selected");
        $(this).parent().parent().siblings("tbody").children("tr").each(function (i) {
            $(this).children("td").removeClass("selected").eq(index).addClass("selected");
        });
    }).mouseleave(function () {
        $(this).removeClass("selected");
        $(this).parent().parent().parent().find("td").removeClass("selected");
    });

    //add table
    $("#J_AddTable").click(function () {
        $.get("part/addTable.htm", function (data) {
            $("body").append(data);
            $.use("ui-dialog", function () {
                var el = $("#J_AddTableDialog");
                el.dialog({
                    modalCSS: {
                        background: "#000",
                        opacity: 0.4
                    },
                    center: true
                }).delegate('.close,.dialog-close-btn', 'click', function (e) {
                    el.dialog('close');
                    el.remove();
                }).delegate('.okBtn', 'click', function (e) {
                    alert('新增');
                });
            });
        });
    });

    
    $("#J_TableList").delegate('a', 'click', function (e) {
        var el = $(e.currentTarget);
        if (el.hasClass('e-flow')) {
            loadFlowDialog();
        }
        if (el.hasClass('e-edit')) {
            loadEditeDialog();
        }
    });
    //权限审批
    function loadFlowDialog() {
        $.get("part/setFlow.htm", function (data) {
            $("body").append(data);
            $.use("ui-dialog", function () {
                var el = $("#J_FlowDialog");
                el.dialog({
                    modalCSS: {
                        background: "#000",
                        opacity: 0.4
                    },
                    center: true
                }).delegate('.close,.dialog-close-btn', 'click', function (e) {
                    el.dialog('close');
                    el.remove();
                }).delegate('.okBtn', 'click', function (e) {
                    alert('提交到后台保存');
                });
            });
        });
    }
    //编辑字段
    function loadEditeDialog() {
        $.get("part/fieldEdit.htm", function (data) {
            $("body").append(data);
            $.use("ui-dialog", function () {
                var el = $("#J_EditeDialog");
                el.dialog({
                    modalCSS: {
                        background: "#000",
                        opacity: 0.4
                    },
                    center: true
                }).delegate('.close,.dialog-close-btn', 'click', function (e) {
                    el.dialog('close');
                    el.remove();
                }).delegate('.okBtn', 'click', function (e) {
                    alert('提交到后台更新');
                });
            });
        });
    }
})(window.jQuery);