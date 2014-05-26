/**
* 新版黄金策
* @author : huangjianhua
* @createTime : 2014-02-14
*/
;(function ($) {
    $(function () {
        if (localDataStore.get('isFirstTimeVisitGoldFlag') == null) {
            localDataStore.set('isFirstTimeVisitGoldFlag','yes');
            extendDialog({
                type: 'welcomeTips'
            });
        }
        $.use('ui-chosen', function () {
            $('.chosen-select-no-single').chosen({ disable_search_threshold: 10, no_results_text: '没符合条件的结果' });
        });
        window.Config = {
            Url: {
                getCategoryList: '/gold/part/categoryList.htm',
                getSingleCalendar: '/gold/part/singleCalendar.htm',
                getDoubleCalendar: '/gold/part/doubleCalendar.htm',
                getRangeInput: '/gold/part/rangeInput.htm',
                getListByCheckboxList: '/gold/part/checkboxList.htm',
                getListByTextArea: '/gold/part/textArea.htm',
                getListByMultipleChosen: '/gold/part/multipleChosen.htm',
                getListByMultipleSelect: '/gold/part/multipleSelect.htm',
                getDetail: '/gold/part/groupDetail.htm',
                getQuotaList: '/gold/part/quotaList.htm',
                getJson: '/gold/pub/ajaxResultPage.htm'
            }
        };
        var salerGold = new Gold({
            version: 'SALER' //卖家版
        });
    });
    var Gold = function (options) {
        this.init(options);
    };
    Gold.prototype = {
        init: function (options) {
            var that = this;
            that.options = {};
            $.extend(that.options, options);
            that.container = $('#J_Container');
            that.title = that.container.find('.J_Title'); //标题
            that.detailTitle = that.container.find('.J_DetailTitlePanel'); //详情标题
            that.mainPanel = that.container.find('.mod-main'); //主面板
            that.filterPanel = that.container.find('.filter'); //已选变量面板
            that.specialListPanel = that.filterPanel.find('.J_SpecialList'); //已选变量--特殊变量面板
            that.normalListPanel = that.filterPanel.find('.J_NormalList'); //已选变量--普通变量面板
            that.groupListPanel = that.container.find('.J_GroupList'); //群组列表面板
            that.labelGroupName = that.container.find('.J_LabelGroupName'); //群组名字标签
            that.inputGroupName = that.container.find('.J_InputGroupName'); //群组名字输入框
            that.labelAmmout = that.container.find('.J_TotalPv'); //群组卖家数标签
            that.inputQuotaTime = that.container.find('.J_InputQuotaTime'); //前置条件日期输入框
            that.selectQuotaBU = that.container.find('.J_SelectQuotaBU'); //前置条件业务线下拉选择框
            that.inputQuotaCategory = that.container.find('.J_InputQuotaCategory'); //前置条件类目输入框
            that.tableQuota = that.container.find('.J_QuotaTable'); //指标表格
            that.inputDetailTime = that.container.find('.J_InputDetailTime'); //详情数据日期输入框
            that.detailPanel = that.container.find('.J_DetailPanel'); //详情表格
            that.initQuotaCalendar(); //初始化前置日期条件选择
            that.initDetailCalendar(); //初始化详情日期条件选择
            that.bindEvents(); //绑定事件
        },
        bindEvents: function () {
            var that = this;
            //已选变量指标失效，生效控制
            that.filterPanel.delegate('.e-label-check', 'click', function () {
                if (!that.container.hasClass('gold-saler-step1')) {
                    return false;
                }
                var currentId = $(this).siblings('.title').eq(0).attr('data-id'),
                    currentLabelAmmout = $(this).siblings('.total').eq(0);
                $(this).toggleClass('on');
                if ($(this).hasClass('on')) {
                    that.getSalerAccount(that.getSingleQuotaList(currentId), function (o) {
                        if (o.returnType == 1) {
                            currentLabelAmmout.text(o.result);
                        }
                    });
                }
                that.getSalerAccount(that.getAllQuotaList(), function (o) {
                    if (o.returnType == 1) {
                        that.labelAmmout.text(o.result);
                    }
                });
            });
            //删除已选变量指标
            that.filterPanel.delegate('.e-delete', 'click', function (e) {
                if (!that.container.hasClass('gold-saler-step1')) {
                    return false;
                }
                extendDialog({
                    type: 'confirm',
                    msg: '确定删除该筛选条件吗？',
                    callback: function(){
                    	var el = $(e.currentTarget),
	                        parent = el.parents('li').eq(0),
	                        id = el.siblings('.title').attr('data-id');
	                    parent.remove();
	                    that.tableQuota.find('dd[data-id="' + id + '"]').removeClass('selected').attr('data-condition', '');
	                    that.getSalerAccount(that.getAllQuotaList(), function (o) {
	                        if (o.returnType == 1) {
	                            that.labelAmmout.text(o.result);
	                        }
	                    });
                    }
                });
            });
            //编辑已选变量指标
            that.filterPanel.delegate('.title', 'click', function () {
                if (!that.container.hasClass('gold-saler-step1')) {
                    return false;
                }
                var id = $(this).attr('data-id');
                that.tableQuota.find('dd[data-id="' + id + '"]').trigger('click');
            });
            //前置条件--选择业务线
            that.container.delegate('.J_SelectQuotaBU', 'change', function () {
                var el = $(this);
                if (el.val() == '') {
                    extendDialog({
                        type: 'alert',
                        msg:'亲，请选择一个业务线哦！',
                        callback: function () {
                        	el.val(el.attr('data-current')).trigger("liszt:updated");
                            return false;
                        }
                    });
                }
                else{
	                $(this).attr('data-current', $(this).val());
	                that.setSpecialQuota();
                }
            });
            //前置条件--选择类目
            that.container.delegate('.J_InputQuotaCategory', 'click', function (e) {
                var el = $(e.currentTarget), condition = el.attr('data-condition');
                var defaultParameter = {
                    variableId: -3,
                    variableName: '选择类目',
                    controlType: 7,
                    condition: condition
                };
                that.getDialogData({
                    param: defaultParameter,
                    url: Config.Url.getCategoryList,
                    containerSelector: '.category-list-dialog',
                    callback: function () {
                        var returnCondition = $('.category-list-dialog .v-result').attr('data-condition'),
                            returnConditionName = $('.category-list-dialog .v-result').attr('data-conditionName');
                        if (returnCondition == '') {
                        	extendDialog({
                                type: 'alert',
                                msg:'亲，请至少选择一个类目哦！'
                            });
                        	return false;
                        }
                        else {
                            el.attr('data-condition', returnCondition);
                            el.attr('data-conditionName', returnConditionName);
                            el.attr('title', returnConditionName);
                            el.val(returnConditionName.length > 80 ? returnConditionName.substring(0, 80) + '...' : returnConditionName);
                            that.setSpecialQuota();
                            return true;
                        }
                    }
                });
            });
            //普通指标条件变量--弹层选择
            that.tableQuota.find('dd').click(function (e) {
                if (!that.container.hasClass('gold-saler-step1')) {
                    return false;
                }
                var el = $(e.currentTarget), id = el.attr('data-id'), variableName = el.find('.J_VarName').text(), controlType = el.attr('data-control'), condition = el.attr('data-condition');
                var defaultParameter = {
                    variableId: id,
                    variableName: variableName,
                    controlType: controlType,
                    condition: condition
                };
                switch (controlType) {
                    case '1':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getSingleCalendar,
                            containerSelector: '.single-calendar-dialog',
                            callback: function () {
                                var singleDate = $('.single-calendar-dialog .v-single').val();
                                if (singleDate == '') {
                                    extendDialog({
                                        type: 'alert',
                                        msg:'亲，请选择日期！'
                                    });
                                	return false;
                                }
                                else {
                                    var returnCondition = singleDate;
                                    el.addClass('selected').attr('data-condition', returnCondition);
                                    defaultParameter['condition'] = returnCondition;
                                    defaultParameter['conditionName'] = returnCondition;
                                    that.setNormalQuota(defaultParameter);
                                    return true;
                                }
                            }
                        });
                        break;
                    case '2':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getDoubleCalendar,
                            containerSelector: '.double-calendar-dialog',
                            callback: function () {
                                var startDate = $('.double-calendar-dialog .v-start').val(),
                                    endDate = $('.double-calendar-dialog .v-end').val();
                                if (startDate == '' || endDate == '') {
                                    extendDialog({
                                        type: 'alert',
                                        msg:'亲，请选择日期区间！'
                                    });
                                    return false;
                                }
                                else {
                                    var returnCondition = startDate + ',' + endDate;
                                    el.addClass('selected').attr('data-condition', returnCondition);
                                    defaultParameter['condition'] = returnCondition;
                                    defaultParameter['conditionName'] = returnCondition;
                                    that.setNormalQuota(defaultParameter);
                                    return true;
                                }
                            }
                        });
                        break;
                    case '3':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getRangeInput,
                            containerSelector: '.range-input-dialog',
                            callback: function () {
                                var obj = that.getControlData(controlType);
                                el.addClass('selected').attr('data-condition', obj.condition);
                                defaultParameter['condition'] = obj.condition;
                                that.setNormalQuota(defaultParameter);
                                return true;
                            }
                        });
                        break;
                    case '4':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getListByCheckboxList,
                            containerSelector: '.checkbox-list-dialog',
                            callback: function () {
                            	var returnCondition = $('.checkbox-list-dialog .v-result').attr('data-condition'),
	                                returnConditionName = $('.checkbox-list-dialog .v-result').attr('data-conditionName');
	                            if (returnCondition == '') {
	                    	        extendDialog({
	                                    type: 'alert',
	                                    msg:'亲，请选择条件哦！'
	                                });
	                    	        return false;
	                            }
	                            else {
	                                el.addClass('selected').attr('data-condition', returnCondition);
	                                defaultParameter['condition'] = returnCondition;
	                                defaultParameter['conditionName'] = returnConditionName;
	                                that.setNormalQuota(defaultParameter);
	                                return true;
	                            }
                            }
                        });
                        break;
                    case '5':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getListByTextArea,
                            containerSelector: '.text-area-dialog',
                            callback: function () {
                                var returnCondition = $('.text-area-dialog .v-result').attr('data-condition'),
                                    returnConditionName = $('.text-area-dialog .v-result').attr('data-conditionName');
                                if (returnCondition == '') {
                        	        extendDialog({
                                        type: 'alert',
                                        msg:'亲，请填写条件哦！'
                                    });
                        	        return false;
                                }
                                else {
                                    el.addClass('selected').attr('data-condition', returnCondition);
                                    defaultParameter['condition'] = returnCondition;
                                    defaultParameter['conditionName'] = returnConditionName;
                                    that.setNormalQuota(defaultParameter);
                                    return true;
                                }
                            }
                        });
                        break;
                    case '6':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getListByMultipleChosen,
                            containerSelector: '.multiple-chosen-dialog',
                            callback: function () {
                                var obj = that.getControlData(controlType);
                                el.addClass('selected').attr('data-condition', obj.condition);
                                defaultParameter['condition'] = obj.condition;
                                defaultParameter['conditionName'] = obj.conditionName;
                                that.setNormalQuota(defaultParameter);
                                return true;
                            }
                        });
                        break;
                    case '7':
                        that.getDialogData({
                            param: defaultParameter,
                            url: Config.Url.getListByMultipleSelect,
                            containerSelector: '.multiple-select-dialog',
                            callback: function () {
                                var obj = that.getControlData(controlType);
                                el.addClass('selected').attr('data-condition', obj.condition);
                                defaultParameter['condition'] = obj.condition;
                                defaultParameter['conditionName'] = obj.conditionName;
                                that.setNormalQuota(defaultParameter);
                                return true;
                            }
                        });
                        break;
                }
            });
            //点击群组名称标签，显示群组输入框
            that.container.delegate('.J_LabelGroupName', 'click', function () {
                if (!that.container.hasClass('gold-saler-step1') && !that.container.hasClass('gold-saler-step2')) {
                    return false;
                }
                that.labelGroupName.hide();
                that.inputGroupName.show().focus();
            });
            //群组输入框失去焦点，显示群组标签
            that.container.delegate('.J_InputGroupName', 'blur', function () {
                if (!that.container.hasClass('gold-saler-step1') && !that.container.hasClass('gold-saler-step2')) {
                    return false;
                }
                var groupName = that.inputGroupName.val();
                if (groupName.trim() != '') {
                    that.labelGroupName.text(groupName).css('display','block');
                    that.inputGroupName.hide();
                }
            });
            //我的群组
            that.container.delegate('.J_BtnMyGroup', 'click', function () {
            	var goToGroupList = function(){
            		that.inputGroupName.hide();
                    that.title.text('我的群组');
                    that.getGroupList();
            	};
                if (that.container.hasClass('gold-saler-step1') || that.container.hasClass('gold-saler-step2')) {
                    extendDialog({
                        type: 'confirm',
                        msg: '亲，您还没有保存当前的群组，确定要离开此页面吗？',
                        callback: goToGroupList
                    });
                }
                else{
                	goToGroupList();
                }
            });
            //新建群组
            that.container.delegate('.J_BtnNewGroup', 'click', function () {
                that.title.text('新建群组');
                that.removeQuota();
            });
            //查看详情数据
            that.container.delegate('.J_BtnViewDetail', 'click', function (e) {
                if (!that.container.hasClass('gold-saler-step1')) {
                    return false;
                }
                var groupName = that.inputGroupName.val();
                if (groupName == '') {
                    that.inputGroupName.show();
                }
                that.title.text('详情数据');
                that.container.removeClass().addClass('layout clearfix gold-saler-step2');
                that.getDetail();
            });
            //修改条件
            that.container.delegate('.J_ConditionModify', 'click', function (e) {
                var groupName = that.inputGroupName.val();
                that.inputGroupName.focus().show();
                that.labelGroupName.hide();
                that.title.text('修改条件');
                that.container.removeClass().addClass('layout clearfix gold-saler-step1');
            });
            //复制群组
            that.container.delegate('.J_BtnCopy', 'click', function (e) {
                var el = that.groupListPanel.find('li.current').eq(0),
                    groupId = el.attr('data-id'),
                    groupName = el.find('h5').text(),
                    salerAmmout = el.find('.ammout').text();
                var defaultParameter = {
                    version: that.options.version,
                    action: 'analysis/GoldGroupAction',
                    event_submit_do_CloneGroup: 1,
                    groupId: groupId
                };
                that.getJsonData({
                    param: defaultParameter,
                    callback: function (o) {
                        if (o.returnType == 1 && o.groupId) {
                            var template = '<li data-id="' + o.groupId + '" class="current"><h5>副本-' + groupName + '</h5><b class="ammout">' + salerAmmout + '</b> </li>';
                            that.groupListPanel.prepend(template);
                            that.getInforByGroupId(o.groupId);
                            that.message('<i class="icon">&#x3436;</i>群组复制成功,可点击"修改条件"修改条件集合!');
                            setTimeout(function () { $('.dialog-message').remove() }, 3000);
                        }
                    }
                });
            });
            //删除群组
            that.container.delegate('.J_BtnDelete', 'click', function (e) {
            	extendDialog({
                    type: 'confirm',
                    msg: '确定删除该群组吗？',
                    callback: function(){
                    	var el = that.groupListPanel.find('li.current').eq(0),
	    	                groupId = el.attr('data-id');
	                    var defaultParameter = {
	                        version: that.options.version,
	                        action: 'analysis/GoldGroupAction',
	                        event_submit_do_DeleteGroup: 1,
	                        groupId: groupId
	                    };
	                    that.getJsonData({
	                        param: defaultParameter,
	                        callback: function (o) {
	                            if (o.returnType == 1) {
	                                that.getGroupList();
	                                that.message('<i class="icon">&#x3436;</i>群组删除成功!');
	                                setTimeout(function () { $('.dialog-message').remove() }, 3000);
	                            }
	                        }
	                    });
                    }
            	});
            });
            //保存群组
            that.container.delegate('.J_BtnSave', 'click', function (e) {
                if (that.container.hasClass('gold-saler-init')) {
                    return false;
                }
                var groupName = that.inputGroupName.val().trim(), isEditMode = that.groupListPanel.find('li.current').length;
                if (groupName == '') {
                    extendDialog({
                        type: 'alert',
                        msg:'亲，请先填写群组名称哦！'
                    });
                    that.labelGroupName.hide();
                    that.inputGroupName.show().focus();
                    return false;
                }
                if (groupName.replace(/[^\x00-\xff]/g, '**').length > 36) {
                    extendDialog({
                        type: 'alert',
                        msg:'亲，群组名称最多18个字哦！'
                    });
                    that.labelGroupName.hide();
                    that.inputGroupName.show();
                    return false;
                }
                var defaultParameter = {
                    version: that.options.version,
                    action: 'analysis/GoldGroupAction',
                    event_submit_do_saveGroup: 1,
                    groupName: groupName,
                    conditionList: JSON.stringify(that.getAllQuotaList())
                };
                if (isEditMode > 0) {
                    defaultParameter.groupId = that.groupListPanel.find('li.current').attr('data-id');
                }
                that.getJsonData({
                    type: "POST",
                    param: defaultParameter,
                    callback: function (o) {
                        if (o.returnType == 1) {
                            that.message('<i class="icon">&#x3436;</i>保存成功，即将跳转到我的群组!');
                            setTimeout(function () {
                                $('.dialog-message').remove();
                                that.title.text('我的群组');
                                that.container.removeClass().addClass('layout clearfix gold-saler-view');
                                that.getGroupList();
                            }, 3000);
                        }
                    }
                });
            });
            //切换群组列表
            that.groupListPanel.delegate('li', 'click', function (e) {
                var el = $(e.currentTarget), groupId = el.attr('data-id');
                that.getInforByGroupId(groupId);
            });
            //设置指标
            that.container.delegate('.J_BtnQuotaConfig', 'click', function (e) {
                var groupId = '', el = that.groupListPanel.find('li.current');
                if(el.length > 0){
                    groupId = el.eq(0).attr('data-id');
                }
                var defaultParameter = {
                    groupId : groupId
                };
                that.getDialogData({
                    param: defaultParameter,
                    url: Config.Url.getQuotaList,
                    containerSelector: '.quota-list-dialog',
                    callback: function () {
                        var returnCondition = $('.quota-list-dialog .v-result').attr('data-condition');
                        if (returnCondition == '') {
                        	extendDialog({
                                type: 'alert',
                                msg:'亲，请至少选择一个指标哦！'
                            });
                        	return false;
                        }
                        else {
                        	var quotaList = returnCondition.split(',');
                            that.getDetail(quotaList);
                            return true;
                        }
                    }
                });
            });
            //下载数据
            that.container.delegate('.J_BtnDownload', 'click', function (e) {
                document.location.href = '/gold/exception.htm?';
            });
        },
        //初始化前置变量日期选择控件
        initQuotaCalendar: function () {
            var that = this;
            $('#J_Gmt_N').click(function () {
                $('#J_SingleCalendarPanel_N').toggle();
            });
            $('#J_SingleCalendarPanel_N').DatePicker({
                mode: 'single',
                inline: true,
                date: DateUtil.strToDate($('#J_Gmt_N').val()), //日历选中的日期
                current: DateUtil.strToDate($('#J_Gmt_N').val()), //当前日历面板显示的年月，默认为today所在的月份
                onChange: function (date, el) {
                    $('#J_Gmt_N').val(DateUtil.dateToStr(date));
                    $(el).hide();
                    that.setSpecialQuota();
                },
                range: {
                    start: DateUtil.strToDate(DateUtil.getDateStrByAddDays(-31)),
                    end: DateUtil.strToDate(DateUtil.getDateStrByAddDays(-2))
                }
            });
            $('html').click(function () {
                if ($('#J_SingleCalendarPanel_N').is(":visible")) {
                    $('#J_SingleCalendarPanel_N').hide();
                }
            });
            $('#J_Gmt_N').click(function (e) {
                e.stopPropagation();
            });
        },
        //初始化详情查询日期选择控件
        initDetailCalendar: function () {
            var that = this;
            $('#J_Gmt_Q').click(function () {
                $('#J_SingleCalendarPanel_Q').toggle();
            });
            $('#J_SingleCalendarPanel_Q').DatePicker({
                mode: 'single',
                inline: true,
                date: DateUtil.strToDate($('#J_Gmt_Q').val()), //日历选中的日期
                current: DateUtil.strToDate($('#J_Gmt_Q').val()), //当前日历面板显示的年月，默认为today所在的月份
                onChange: function (date, el) {
                    $('#J_Gmt_Q').val(DateUtil.dateToStr(date));
                    $(el).hide();
                    that.getDetail();
                },
                range: {
                    start: DateUtil.strToDate(DateUtil.getDateStrByAddDays(-31)),
                    end: DateUtil.strToDate(DateUtil.getDateStrByAddDays(-2))
                }
            });
            $('html').click(function () {
                if ($('#J_SingleCalendarPanel_Q').is(":visible")) {
                    $('#J_SingleCalendarPanel_Q').hide();
                }
            });
            $('#J_Gmt_Q').click(function (e) {
                e.stopPropagation();
            });
        },
        //获取所有变量指标列表
        getAllQuotaList: function () {
            var that = this, arr = [];
            that.specialListPanel.find('span').each(function () {
                var el = $(this);
                var temp = {
                    variableId: el.attr('data-id'),
                    variableType: 0,
                    controlType: el.attr('data-control'),
                    condition: el.attr('data-condition'),
                    conditionName: el.attr('title')
                };
                arr.push(temp);
            });
            that.normalListPanel.find('li').each(function () {
                var el = $(this), currentLabel = el.find('.e-label-check'), currentSpan = el.find('.title');
                if (currentLabel.hasClass('on')) {
                    var temp = {
                        variableId: currentSpan.attr('data-id'),
                        variableType: 1,
                        controlType: currentSpan.attr('data-control'),
                        condition: currentSpan.attr('data-condition'),
                        conditionName: currentSpan.attr('title')
                    };
                    arr.push(temp);
                }
            });
            return arr;
        },
        //获取单个变量指标
        getSingleQuotaList: function (id) {
            var that = this, arr = [], el = that.normalListPanel.find('li .title[data-id= "' + id + '"]');
            that.specialListPanel.find('span').each(function () {
                var el = $(this);
                var temp1 = {
                    variableId: el.attr('data-id'),
                    variableType: 0,
                    controlType: el.attr('data-control'),
                    condition: el.attr('data-condition'),
                    conditionName: el.attr('title')
                };
                arr.push(temp1);
            });
            var temp = {
                variableId: el.attr('data-id'),
                variableType: 1,
                controlType: el.attr('data-control'),
                condition: el.attr('data-condition'),
                conditionName: el.attr('title')
            };
            arr.push(temp);
            return arr;
        },
        //根据条件获取卖家数
        getSalerAccount: function (conditionList, callback) {
            var that = this,
                defaultParameter = {
                    version: that.options.version,
                    action: 'analysis/GoldGroupAction',
                    event_submit_do_GetSellerCount: 1,
                    conditionList: JSON.stringify(conditionList)
                };
            that.getJsonData({
                type: "POST",
                param: defaultParameter,
                callback: callback
            });
        },
        //设置普通变量
        setNormalQuota: function (o) {
            var that = this, id = o.variableId, variableName = o.variableName, controlType = o.controlType, condition = o.condition, conditionName = o.conditionName, arr = conditionName.split(','), text = '';
            if (controlType == 2 || controlType == 3) {
                text = variableName + '：' + arr[0] + '至' + arr[1];
            }
            else {
                text = variableName + '：' + conditionName;
            }
            var template = '<label class="e-label-check on"></label>' +
                                '<span class="title" title="' + text + '" data-condition="' + condition + '" data-id="' + id + '" data-control="' + controlType + '">' + text + '</span>' +
                                '<span class="total">0</span>' +
                                '<i class="icon e-delete">&#x3438;</i>';
            var currentEl = that.normalListPanel.find('li .title[data-id= "' + id + '"]'), hasExist = currentEl.length > 0 ? true : false;
            if (hasExist) {
                currentEl.parent('li').eq(0).html(template);
            }
            else {
                that.normalListPanel.append('<li>' + template + '</li>');
            }
            that.getSalerAccount(that.getSingleQuotaList(id), function (o) {
                if (o.returnType == 1) {
                    that.normalListPanel.find('li .title[data-id= "' + id + '"]').siblings('.total').eq(0).text(o.result);
                }
            });
            that.getSalerAccount(that.getAllQuotaList(), function (o) {
                if (o.returnType == 1) {
                    that.labelAmmout.text(o.result);
                }
            });
        },
        //设置特殊变量
        setSpecialQuota: function () {
            var that = this;
            var quotaTime = that.inputQuotaTime.val(),
                quotaBU = that.selectQuotaBU.val(),
                quotaCatetory = that.inputQuotaCategory.attr('data-condition'),
                quotaCatetoryName = that.inputQuotaCategory.attr('data-conditionName'); ;
            if (quotaTime != '' && quotaBU != '' && quotaCatetory != '') {
                that.container.removeClass().addClass('layout clearfix gold-saler-step1');
                that.labelGroupName.hide();
                that.inputGroupName.show();
                var template = '<span title="' + quotaTime + '" data-id="-3" data-control="1" data-condition="' + quotaTime + '">' + quotaTime + '</span>' +
                    '<span title="' + quotaBU + '" data-id="-2" data-control="8" data-condition="' + quotaBU + '">' + quotaBU + '</span>' +
                    '<span title="' + quotaCatetoryName + '" data-condition="' + quotaCatetory + '" data-id="-1" data-control="5">' + (quotaCatetoryName.length > 60 ? (quotaCatetoryName.substring(0, 60) + '...') : quotaCatetoryName) + '</span>';
                that.specialListPanel.html(template);
                that.setResult();
            }
            else {
                that.container.removeClass().addClass('layout clearfix gold-saler-init');
            }
        },
        //设置卖家数
        setResult: function () {
            var that = this;
            if (!that.container.hasClass('gold-saler-step1')) {
                return false;
            }
            that.filterPanel.find('li').each(function () {
                var currentId = $(this).find('.title').eq(0).attr('data-id'),
                    currentLabelAmmout = $(this).find('.total').eq(0);
                if ($(this).find('.e-label-check').hasClass('on')) {
                    that.getSalerAccount(that.getSingleQuotaList(currentId), function (o) {
                        if (o.returnType == 1) {
                            currentLabelAmmout.text(o.result);
                        }
                    });
                }
            });
            that.getSalerAccount(that.getAllQuotaList(), function (o) {
                if (o.returnType == 1) {
                    that.labelAmmout.text(o.result);
                }
            });
        },
        //群组列表分页
        smartPageGroup:function(){
        	var count = that.groupListPanel.find('li').length, size = 8, currentPage = 0;
            if(count > 8){
                
            }
            that.groupListPanel.delegate('.preview-next', 'click', function(){
                
            });
        },
        //根据群组ID加载群组信息
        getInforByGroupId: function (groupId) {
            var that = this;
            var defaultParameter = {
                version: that.options.version,
                action: 'analysis/GoldSalerAction',
                event_submit_do_GetGroupDetail: 1,
                groupId: groupId
            };
            that.getJsonData({
                param: defaultParameter,
                callback: function (o) {
                    if (o.returnType == 1) {
                        that.specialListPanel.html('');
                        that.normalListPanel.html('');
                        that.tableQuota.find('dd').removeClass().attr('data-condition', '');
                        var currentEl = that.groupListPanel.find('li[data-id="' + groupId + '"]');
                        that.groupListPanel.find('li').removeClass('current');
                        currentEl.addClass('current');
                        that.labelAmmout.text(currentEl.find('.ammout').text());
                        that.inputGroupName.val(o.name).hide();
                        that.labelGroupName.text(o.name).show();
                        var conditionList = o.conditionList, specialTemplate = '', normalTemplate = '';
                        for (var i = 0, len = conditionList.length; i < len; i += 1) {
                            var temp = conditionList[i], variableId = temp.variableId, variableType = temp.variableType, controlType = temp.controlType, condition = temp.condition, newDate = DateUtil.dateToStr(DateUtil.strToDate(DateUtil.getDateStrByAddDays(-2))), conditionName = temp.conditionName, totalSaler = temp.totalSaler || 0;
                            if (variableType == 0) {
                                if (variableId == -3) {
                                    conditionName = newDate;
                                    condition = newDate;
                                    that.inputQuotaTime.val(conditionName);
                                    $('#J_SingleCalendarPanel_N').DatePickerSetDate(conditionName, true);
                                }
                                if (variableId == -2) {
                                    that.selectQuotaBU.attr('data-current', condition).val(condition).trigger("liszt:updated");
                                }
                                if (variableId == -1) {
                                    that.inputQuotaCategory.attr('data-condition', condition);
                                    that.inputQuotaCategory.attr('data-conditionName', conditionName);
                                    that.inputQuotaCategory.attr('title', conditionName);
                                    that.inputQuotaCategory.val(conditionName.length > 80 ? conditionName.substring(0, 80) + '...' : conditionName);
                                }
                                specialTemplate += '<span title="' + conditionName + '" data-id="' + variableId + '" data-control="' + controlType + '" data-condition="' + condition + '">' + (conditionName.length > 60 ? (conditionName.substring(0, 60) + '...') : conditionName) + '</span>';
                            }
                            if (variableType == 1) {
                                var el = that.tableQuota.find('dd[data-id="' + variableId + '"]');
                                el.addClass('selected').attr('data-condition', condition);
                                normalTemplate += '<li><label class="e-label-check on"></label>' +
                                    '<span class="title" title="' + conditionName + '" data-condition="' + condition + '" data-id="' + variableId + '" data-control="' + controlType + '">' + conditionName + '</span>' +
                                    '<span class="total">' + totalSaler + '</span>' +
                                    '<i class="icon e-delete">&#x3438;</i></li>';
                            }
                        }
                        that.specialListPanel.html(specialTemplate);
                        that.normalListPanel.html(normalTemplate);
                        that.getDetail();
                    }
                }
            });
        },
        //根据群组ID加载群组信息
        getDetail: function (quotaList) {
            var that = this, groupId = '', el = that.groupListPanel.find('li.current');
            if(el.length > 0){
                groupId = el.eq(0).attr('data-id');
            }
            var defaultParameter = {
                groupId: groupId,
                conditionList: JSON.stringify(that.getAllQuotaList()),
                date: that.inputDetailTime.val(),
                quotaList: JSON.stringify(quotaList)
            };
            $.ajax({
                url: Config.Url.getDetail,
                data: defaultParameter,
                dataType: 'HTML',
                contentType: "application/html; charset=utf-8",
                beforeSend: function () {
                    that.detailPanel.html('<div style="text-align:center;padding:50px 0;border: 1px solid #d2d2d2;border-top:none;background:#fff;"><img src="/images/loading.gif" /></div>');
                },
                success: function (data) {
                    that.detailPanel.html(data);
                }
            });
        },
        //更新群组列表并加载第一个群组详情
        getGroupList: function () {
            var that = this,
                defaultParameter = {
                    version: that.options.version,
                    action: 'analysis/GoldGroupAction',
                    event_submit_do_GetAllGroup: 1
                };
            that.getJsonData({
                param: defaultParameter,
                callback: function (o) {
                    if (o.returnType == 1) {
                        var groupList = o.allGroup;
                        if (groupList && groupList.length > 0) {
                            that.container.removeClass().addClass('layout clearfix gold-saler-view');
                            var template = '';
                            for (var i = 0, len = groupList.length; i < len; i += 1) {
                                var temp = groupList[i], css = (i == 0 ? ' class="current"' : '');
                                template += '<li data-id="' + temp.groupId + '"' + css + '><h5>' + temp.groupName + '</h5><b class="ammout">' + temp.salerAmmount + '</b> </li>';
                            }
                            that.groupListPanel.html(template);
                            that.getInforByGroupId(groupList[0].groupId);
                        }
                        else {
                            that.groupListPanel.html('');
                            that.detailPanel.html('');
                            that.container.removeClass().addClass('layout clearfix gold-saler-view empty');
                        }
                    }
                }
            });
        },
        //清除所有变量指标，新建群组
        removeQuota: function () {
            var that = this, newDate = DateUtil.dateToStr(DateUtil.strToDate(DateUtil.getDateStrByAddDays(-2)));
            that.specialListPanel.html('');
            that.normalListPanel.html('');
            that.labelGroupName.text('群主买家数').show();
            that.inputQuotaTime.val(newDate);
            $('#J_SingleCalendarPanel_N').DatePickerSetDate(newDate, true);
            that.inputGroupName.val('').hide();
            that.inputQuotaCategory.val('').attr('data-condition', '').attr('data-conditionName', '');
            that.groupListPanel.html('');
            that.labelAmmout.text('0');
            that.selectQuotaBU.val('').trigger("liszt:updated");
            that.container.removeClass().addClass('layout clearfix gold-saler-init');
            that.tableQuota.find('dd').removeClass().attr('data-condition', '');
        },
        //操作提示消息
        message: function (msg) {
            var template = '<div class="dialog-message">' + msg + '</div>';
            $('body').append(template);
        },
        //从后台获取JSON数据
        getJsonData: function (args) {
            $.ajax({
                url: args.url || Config.Url.getJson,
                type: args.type || "GET",
                data: args.param,
                dataType: 'JSON',
                //contentType: "application/json; charset=utf-8",
                success: function (o) {
                    args.callback(o);
                },
                error: function (xhr, statusText, err) {
                    console.log('xhr:' + xhr + 'statusText:' + statusText + 'err:' + err);
                }
            });
        },
        //获取弹层VM模板数据
        getDialogData: function (args) {
            $.ajax({
                url: args.url,
                type: args.type || "GET",
                data: args.param,
                dataType: 'HTML',
                contentType: "application/html; charset=utf-8",
                success: function (data) {
                    $("body").append(data);
                    $.use("ui-dialog", function () {
                        var el = $(args.containerSelector);
                        el.dialog({
                            modalCSS: {
                                background: "#000",
                                opacity: 0.4
                            },
                            css: {
                                position: "fixed",
                                left: document.documentElement.clientWidth - 602,
                                top: $(window).height() - 512 - $(document).scrollTop()
                            }
                        }).delegate('.close', 'click', function (e) {
                            el.dialog('close');
                            el.remove();
                        }).delegate('.btnOk.e-btn-primary', 'click', function (e) {
                            if (args.callback()) {
                                el.dialog('close');
                                el.remove();
                            }
                        });
                    });
                },
                error: function (xhr, statusText, err) {
                    console.log('xhr:' + xhr + 'statusText:' + statusText + 'err:' + err);
                }
            });
        }
    };
})(window.jQuery);
