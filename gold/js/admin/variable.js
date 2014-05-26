(function ($) {
    $(function () {
        $('#J_Tree').jstree({
            'core': {
                'data': {
                    'state': { 'opened': true },
                    'text': '已配置的分层模板',
                    'children': [{
                        'state': { 'opened': true },
                        'id': 'type-1' ,
                        'text': '数字分层',
                        'children': [{
                            'text': '0-100-200-1k',
                            'id': 1 ,
                        }, {
                            'text': '0-1-2-3-4',
                            'id': 2 ,
                        }, {
                            'text': '0-10-20-50-100-200',
                            'id': 3 ,
                        }, {
                            'text': '0-1w-2w-5w-10w',
                            'id': 4 ,
                        }, {
                            'text': '0-100-200-1k',
                            'id': 5 ,
                        }]
                    }, {
                        'state': { 'opened': true },
                        'id': 'type-2',
                        'text': '枚举归类',
                        'children': [{
                            'text': '交易类型分组',
                            'id': 6 ,
                        }, {
                            'text': '一级类目分组',
                            'id': 7 ,
                        }, {
                            'text': '星座分组',
                            'id': 8 ,
                        }, {
                            'text': '职业分组',
                            'id': 9 ,
                        }, {
                            'text': '性格特征分组',
                            'id': 10 ,
                        }]
                    }, {
                        'state': { 'opened': true },
                        'id': 'type-3',
                        'text': 'Raw列表',
                        'children': [{
                            'text': '一级类目',
                            'id': 11 ,
                        }, {
                            'text': '职业',
                            'id': 12 ,
                        }]
                    }]
                }
            }
        });
    });
    $('#J_Tree').bind("changed.jstree", function (e, data) {
        if (data.instance.is_leaf(data.selected[0])) {
            var id = data.instance.get_node(data.selected[0]).li_attr['id'],
                parentId = data.instance.get_parent(data.selected[0]),
                type = $('#' + parentId).attr('id');
            if(type =='type-1'){
                $('#J_Container').load('part/numberTemplate.htm?id=' + id);
            }
            if(type =='type-3'){
                $('#J_Container').load('part/rawTemplate.htm?id=' + id);
            }
        }
    });
})(window.jQuery);




