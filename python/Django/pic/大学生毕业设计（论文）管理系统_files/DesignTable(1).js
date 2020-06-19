// 是否设置多个自定义
function IsSetMultipleDesignTable(type, xybh, zybh) {
    var xhr = $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        data: {
            "action": "IshasSetMoreDesignTableCommon",
            "type": type,
            "xybh": xybh,
            "zybh": zybh
        },
        dataType: "json",
        type: "POST"
    });
    return xhr;
};

// 多个自定义样式展示
function designTableMultipleSelect(data, htmlId, designTableHtmlId, hideId, tableId, selectDetailsFunction) {
    if (data && data.length > 0) {
        if (data.length > 1) { // 多个自定义表单
            var selectHtml = '<div id="dt_select_list_box" class="dt_selected_box">'
            selectHtml += '<div class="dt_select_title"> 您所在学校配置了多个表单，请根据学校要求选择。 </div >';
            selectHtml += '<ul class="dt_selected_details clearfix">';
            $.each(data, function (i, v) {

                selectHtml += '<li class="clearfix selcetDenginTable" title="点击选择该表单" data-tableId="' + v["tableId"] + '">';
                selectHtml += '<a class="listA selectShowDetails" data-tableId="' + v["tableId"] + '" href="javascript:void(0);">查看表单效果 </a>';
                selectHtml += '<i></i>';
                selectHtml += '<p class="tableNametext">' + v["tableHeadName"] + '</p>';
                selectHtml += '<a class="listA" href="javascript:void(0);">点击这里选择该表单</a>';
                selectHtml += '</li>';
            });
            selectHtml += '</ul></div>';
            selectHtml += '<div id="dt_select_details_box" class="dt_selected_box selDel" style="display: none;"></div>';
            if (!checkValIsUndefinedOrNull(tableId) && tableId > 0) {
                $(htmlId).html(selectHtml)
            } else {
                $(htmlId).html(selectHtml).show();
            }

            $(htmlId).find(".selectShowDetails").off('click').on('click', designTableShowDetails);
            $(htmlId).find(".selcetDenginTable").off('click').on('click', function () {
                var tableId = $(this).attr("data-tableId");
                var tableName = $(this).find(".tableNametext").text();
                designTableSelectDetails(designTableHtmlId, htmlId, tableId, tableName, true, hideId, selectDetailsFunction);
            });

            if (!checkValIsUndefinedOrNull(tableId) && tableId > 0) {
                $(htmlId).show().find(".dt_selected_box").hide().find(".selcetDenginTable[data-tableId=" + tableId + "]").click();
            }
        } else {
            designTableSelectDetails(designTableHtmlId, htmlId, data[0]["tableId"], data[0]["tableHeadName"], false, hideId, selectDetailsFunction)
        }
    } else {
        selectDetailsFunction(false, false)
    }
};

function designTableSelectDetails(designTableHtmlId, htmlId, tableId, tableName, isMore, hideId, selectDetailsFunction) {
    $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        type: "post",
        data: {
            "action": "GetTableModelByTableIDCommon",
            "tableID": tableId
        },
        dataType: "json",
        success: function (data) {
            if (data && data.isSuccess && data.rows && data.rows.length > 0) {
                selectDetailsFunction(data, tableId);
                //design_table_data = data.rows;
                if (isMore) {
                    $(htmlId).find("#dt_select_list_box").hide();
                    var selHtml = '<span>当前选择的表单是【</span>';
                    selHtml += '<span class="txt_red fontWeigt">' + tableName + '</span>';
                    selHtml += '<a class="listA mgL selectShowDetails" data-tableId="' + tableId + '" href="javascript: void (0);"> 查看表单详情 </a>';
                    selHtml += '<span>】</span>';
                    selHtml += '<span class="mgL">若需要更换已选择的表单，请<a class="listA goToselectShowDetails" href="javascript: void (0);">返回表单选择页面</a></span>';

                    $(htmlId).find("#dt_select_details_box").empty().html(selHtml).show();
                    $(htmlId).find(".selectShowDetails").off('click').on('click', designTableShowDetails);
                    $(htmlId).find(".goToselectShowDetails").off().on("click", function () {
                        $(htmlId).find("#dt_select_list_box").show();
                        $(htmlId).find("#dt_select_details_box").empty().hide();
                        $("#" + designTableHtmlId).empty().hide();
                        $(hideId).hide();
                    });
                }
            } else {
                myMessage(data.message);
            }
        },
        error: function (err) {
            if (console && console.log) {
                console.log(err.statusText);
            };
        }
    });
};

// 已经选择的自定义表提示几查看 （没有返回选择）
function designTableSelectedDetail(htmlId, tableId, tableName, isMore, selectDetailsFunction) {
    $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        type: "post",
        data: {
            "action": "GetTableModelByTableIDCommon",
            "tableID": tableId
        },
        dataType: "json",
        success: function (data) {
            if (data && data.isSuccess && data.rows && data.rows.length > 0) {
                selectDetailsFunction(data, tableId);
                if (isMore) {
                    //$(htmlId).find("#dt_select_list_box").hide();
                    var selHtml = '<div class="dt_selected_box selDel"><span>当前选择的表单是【</span>';
                    selHtml += '<span class="txt_red fontWeigt">' + tableName + '</span>';
                    selHtml += '<a class="listA mgL selectShowDetail" data-tableId="' + tableId + '" href="javascript: void (0);"> 查看表单详情 </a>';
                    selHtml += '<span>】</span></div>';

                    $(htmlId).empty().html(selHtml).show();

                    $(htmlId).find(".selectShowDetail").off('click').on('click', designTableShowDetails);
                }
            } else {
                myMessage(data.message);
            }
        },
        error: function (err) {
            if (console && console.log) {
                console.log(err.statusText);
            };
        }
    });
};


// 查看自定义模版
function designTableShowDetails(e) {
    e.stopPropagation()
    var tableId = $(this).attr("data-tableId");
    $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        type: "post",
        data: {
            "action": "GetTableModelByTableIDCommon",
            "tableID": tableId
        },
        dataType: "json",
        success: function (data) {
            if (data && data.isSuccess && data.rows && data.rows.length > 0) {
                if ($("#dt_ShowDetailsModel").length <= 0) {
                    var modelHtml = '<div id="dt_ShowDetailsModel" class="easyui-dialog" data-options="closed:true,modal:true" style=" width:90%; height: 600px; padding: 5px;"></div>';
                    $("body").append(modelHtml);
                }

                var detailsHtml = '<div class="gxf_designTable_content">'
                detailsHtml += '<p class="txt_red">本页面是该表单的详情展示页面，不能填写和提交。若需提交，请返回选择表单操作。<p>'
                detailsHtml += '<ul class="gxf_designTable_box">'
                detailsHtml += SetDesignTable(data.rows, "", true, true);
                detailsHtml += '</ul></div>';
                $("#dt_ShowDetailsModel").empty().html(detailsHtml).dialog({ title: '查看表单详情' }).dialog('open').window('center');
                $.parser.parse('#dt_ShowDetailsModel');
                $.each(data.rows, function (i, v) {
                    if (v['失效'] == 0 && (v['类型'] == 0 || v['类型'] == 1)) {
                        showWriteTextNum.bindKeyup("#txt_" + v['ID'] + "_" + v['列名'] + "_Modal");
                    };
                });
            } else {
                myMessage(data.message);
            }
        },
        error: function (err) {
            if (console && console.log) {
                console.log(err.statusText);
            }
        }
    });
};


/*
    * 是否设置自定义
    * type   自定义type
    * xybh  学院编号
    * zybh  转业编号
*/
function isSetDesignTable(type, xybh, zybh) {
    var xhr = $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        data: {
            "action": "IshasSetDesignTableCommon",
            "type": type,
            "xybh": xybh,
            "zybh": zybh
        },
        dataType: "json",
        type: "POST"
    });
    return xhr;
};
/*
    * 是否设置自定义
    * type   自定义type
    * xybh  学院编号
    * zybh  转业编号
    * ktbh  转业编号
*/
function isSetDesignTableByProjectID(type, xybh, zybh, ktbh) {
    var xhr = $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        data: {
            "action": "IshasSetDesignTableCommon",
            "type": type,
            "xybh": xybh,
            "zybh": zybh,
            "ktbh": ktbh
        },
        dataType: "json",
        type: "POST"
    });
    return xhr;
};
/*
    * 是否设置自定义 ,区分角色
    * type   自定义type
    * xybh  课题学院编号
    * zybh  课题专业编号
    * rolnum 角色
*/
function IshasSetDesignTableCommonRoleType(type, xybh, zybh, rolnum) {
    var xhr = $.ajax({
        url: "../Handler/DesignTableHandler.ashx",
        data: {
            "action": "IshasSetDesignTableCommonRoleType",
            "type": type,
            "xybh": xybh,
            "zybh": zybh,
            "rolnum": rolnum
        },
        dataType: "json",
        type: "POST"
    });
    return xhr;
};

/*
    * 自定义表初次提交
    * data   自定义表
    * htmlID  页面ul的id
    * checType  是否直接返回html字符串（审核用）
*/
function SetDesignTable(data, htmlID, checType, isModal) {
    if (data) {
        var richTextId = [];// 富文本ID
        var newStr = "";
        newStr += setDTSeachData(data, isModal, richTextId, 0)
        if (checType || checkValIsUndefinedOrNull(htmlID)) {
            return newStr;
        } else {
            $("#" + htmlID).append(newStr);    //添加到页面
            $.parser.parse('#' + htmlID);       // 重新渲染EasyUI
            if (richTextId.length > 0) {
                initUEditor(richTextId);         // 富文本编辑框初始化
            }
            $.each(data, function (i, v) {
                if (v["失效"] == 0 && (v['类型'] == 0 || v['类型'] == 1)) {
                    showWriteTextNum.bindKeyup("#txt_" + v['ID'] + "_" + v['列名'] + (isModal ? "_Modal" : ""));
                }
                if (v['失效'] == 0 && v['类型'] == 2) {
                    radioChangeEvent.bindChange('radio_' + v['ID'] + '_' + v['列名'] + (isModal ? "_Modal" : ""), data, isModal);
                }
            });
        }
    }
};

function setDTSeachData(data, isModal, richTextId, guanlian, guanliannId, morenzhi) {
    var newStr = "";
    guanlian = guanlian == 1 ? 1 : 0;
    $.each(data, function (i, v) {
        if (v["失效"] == 0 && v['是否关联项'] == guanlian && (guanliannId > 0 ? (v['关联ID'] == guanliannId) : true)) {
            var leixing = v["类型"];
            var zhushi = (v["注释"] || "");
            var TMleixing = v["标题类型"];
            var arrangement = v["排列方式"];
            if (TMleixing == 0) {
                if (leixing == "0") {// 文本
                    var txt = v['限制'];
                    var idName = 'txt_' + v['ID'] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    //var idName = 'txt_' + (guanlian == 1 ? ('_' + v['关联ID'] + '_' + v['关联值']) : v['ID']) + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>' //()
                    if (txt == "" || txt == null) {//文本默认  
                        newStr += '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                            + '<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                            + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width:100%">';
                    } else {
                        txt = txt.split("-")[1];
                        if (txt <= 80) { // 文本小
                            newStr += '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + '<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" style="width:100%"/>';
                        } else { // 文本大
                            newStr += '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + '<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width:100%">';
                        }
                    }
                    newStr += '</li>';
                }
                if (leixing == "1") {//数字
                    var idName = 'txt_' + v["ID"] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                        + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="height:30" style="width:100%"/>'
                        + '</li>';
                }
                if (leixing == "2") {//单选
                    var idName = 'radio_' + v["ID"] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (v["默认项"] && v["默认项"].indexOf(raido[i]) >= 0) {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" checked ="checked"  />' + '<label for="' + idName + i + '">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" />' + '<label for="' + idName + i + '">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                    if (v["是否关联项"] == 0) {
                        var moren = checkValIsUndefinedOrNull(v["默认项"]) ? -1 : v['中文列名'].indexOf(v["默认项"]);
                        newStr += setDTSeachData(data, isModal, richTextId, 1, v['ID'], moren);
                    }
                }
                if (leixing == "3") {//多选
                    var nameName = 'checkbox_' + v['ID'] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        var id = v["列名"].split(",")
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            var idName = 'checkbox_' + v["ID"] + '_' + id[i] + (isModal ? "_Modal" : "");
                            if (v["默认项"] && v["默认项"].indexOf(raido[i]) >= 0) {
                                newStr += '<input class="margl" type="checkbox" name="' + nameName + '" id="' + idName + '" value="' + i + '" checked="checked"/>' + '<label for="' + idName + '">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input class="margl" type="checkbox" name="' + nameName + '" id="' + idName + '" value="' + i + '" />' + '<label for="' + idName + '">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                }
                if (leixing == "4") {//时间
                    var idName = 'date_' + v["ID"] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="designTable_radio">'
                        + '<span class="margl"></span><input id="' + idName + '" type="text" class="easyui-datebox mgL" data-options="prompt:\'请选择正确的时间\','
                        + 'showSeconds:false,editable: false,height:24,width:180" panelheight="240" >'
                        + '</div></li>';
                }
                if (leixing == "6") {//富文本
                    var idName = 'txt_' + v["ID"] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    richTextId.push(idName);
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                        //+ '<textarea class="ad-txt" id="' + idName + '" name="' + idName + '" style="width: 100%;"></textarea>'
                        + '<script id="' + idName + '" name="' + idName + '" style="width: 100%;" type="text/plain"></script>'
                        + '</li>';
                }
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p></li>';
                }
            } else if (TMleixing == 1) { //二级自定义标题
                if (leixing == "0") {//文本
                    var idName = "txt_" + v['ID'] + "_" + v['列名'] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                    var txtLen = v['限制'];
                    if (txtLen == "" || txtLen == null) {
                        newStr += '<div class="gxf_designTable_secondTitle">'
                            + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                            + ' <span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                            + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width:100%">'
                            + '</div>';
                    } else {
                        txtLen = txtLen.split("-");
                        if (txtLen[1] <= 80) {// 文本长度小于80
                            newStr += '<div class="gxf_designTable_secondTitle">'
                                + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + ' <span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" style="width:100%">'
                                + '</div>';
                        } else {// 文本长度大于
                            newStr += '<div class="gxf_designTable_secondTitle">'
                                + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + ' <span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width:100%">'
                                + '</div>';
                        }
                    }
                    newStr += '</li>'
                }
                if (leixing == "1") {//数字
                    var idName = "txt_" + v['ID'] + "_" + v['列名'] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                        + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" style="width:100%">'
                        + '</div></li>';
                }
                if (leixing == "2") {//单选
                    var idName = 'radio_' + v["ID"] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (v["默认项"] && v["默认项"].indexOf(raido[i]) >= 0) {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '"  checked="checked"/>' + ' <label class="margr" for="' + idName + i + '">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" />' + ' <label class="margr" for="' + idName + i + '">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                    if (v["是否关联项"] == 0) {
                        var moren = checkValIsUndefinedOrNull(v["默认项"]) ? -1 : v['中文列名'].indexOf(v["默认项"]);
                        newStr += setDTSeachData(data, isModal, richTextId, 1, v['ID'], moren);
                    }
                }
                if (leixing == "3") {//多选
                    var nameName = 'checkbox_' + v['ID'] + '_' + v["列名"] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        var id = v["列名"].split(",")
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            var idName = 'checkbox_' + v["ID"] + '_' + id[i] + (isModal ? "_Modal" : "");
                            if (v["默认项"] && v["默认项"].indexOf(raido[i]) >= 0) {
                                newStr += '<input class="margl" type="checkbox" name="' + nameName + '" id="' + idName + '" value="' + i + '" checked = "checked"/>' + ' <label class="margr"  for="' + idName + '">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input class="margl" type="checkbox" name="' + nameName + '" id="' + idName + '" value="' + i + '" />' + ' <label class="margr"  for="' + idName + '">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                }
                if (leixing == "4") {//时间
                    var idName = "date_" + v['ID'] + "_" + v['列名'] + (isModal ? "_Modal" : "");
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="designTable_radio">'
                        + '<span class="margl"></span><input id="' + idName + '" type="text" class="easyui-datebox mgL" data-options="prompt:\'请选择正确的时间\',showSeconds:false,editable: false,height:24,width:180" panelheight="240" >'
                        + '</div></li>';
                }
                if (leixing == "6") {//富文本
                    var idName = "txt_" + v['ID'] + "_" + v['列名'] + (isModal ? "_Modal" : "");
                    richTextId.push(idName);
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + ' <span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                        //+ '<textarea class="ad-txt" id="' + idName + '" name="' + idName + '" style="width: 100%;"></textarea>'
                        + '<script id="' + idName + '" name="' + idName + '" style="width: 100%;" type="text/plain"></script>'
                        + '</div></li>';
                }
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == morenzhi) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + ' <span class="statement margl">' + zhushi + '</span></h3>'
                        + '</div></li>';
                }
            }
        }
    });
    return newStr;
};

/*
    * 自定义表修改时
    * data   自定义表
    * value  提交的数据
    * htmlID  页面ul的id
    * checType  是否直接返回html字符串（审核用）
*/
function SetValueDesignTable(data, value, htmlID, checType) {
    if (data) {
        var richTextId = [];// 富文本id
        var richTextContent = [];// 富文本内容
        var textValue = {};
        var newStr = setValueDTSeachData(data, value, textValue, richTextContent, richTextId, 0);

        if (checType || checkValIsUndefinedOrNull(htmlID)) {
            var obj = {
                str: newStr,
                txt: textValue,
                richTextContent: richTextContent
            };
            return obj;
        } else {
            $("#" + htmlID).append(newStr);         //添加到页面
            $.parser.parse('#' + htmlID);       // 重新渲染页面
            $.each(textValue, function (i, v) {
                $("#" + i).textbox("setText", retrieveUnequa(v));
            });
            $.each(data, function (i, v) {
                if (v['类型'] == 0 || v['类型'] == 1) {
                    showWriteTextNum.bindKeyup("#txt_" + v['ID'] + "_" + v['列名']);
                }
                if (v['失效'] == 0 && v['类型'] == 2) {
                    radioChangeEvent.bindChange('radio_' + v['ID'] + '_' + v['列名'], data);
                }
            });
            if (richTextId.length > 0) {
                initUEditor(richTextId);                 // 富文本编辑框初始化
                $.each(richTextContent, function (i, v) {
                    setUEditorContent(v.name, v.value);
                });
            };
        }
    }
};

function setValueDTSeachData(data, value, textValue, richTextContent, richTextId, guanlian, guanliannId, guanlianValue) {
    var newStr = "";
    guanlian = guanlian == 1 ? 1 : 0;
    value = checkValIsUndefinedOrNull(value) ? {} : value
    guanlianValue = checkValIsUndefinedOrNull(guanlianValue) ? -1 : guanlianValue 
    $.each(data, function (i, v) {
        if (v["失效"] == 0 && v['是否关联项'] == guanlian && (guanliannId > 0 ? (v['关联ID'] == guanliannId) : true)) {
            var leixing = v["类型"];
            var zhushi = v["注释"] || "";
            var TMleixing = v["标题类型"];
            var arrangement = v["排列方式"];
            var contentText = (checkValIsUndefinedOrNull(value[v["列名"]]) ? "" : (leixing == 6 ? retrieveUnequa(value[v["列名"]], true) : retrieveUnequa(value[v["列名"]])));
            if (TMleixing == 0) {
                if (leixing == "0") {// 文本
                    var txt = v['限制'];
                    var idName = 'txt_' + v["ID"] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                    if (checkValIsUndefinedOrNull(txt)) {//文本默认
                        textValue[idName] = contentText;
                        newStr += '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                            + '<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + contentText.replace(/\s|\r|\n/g, "").length + ' </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                            + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">';
                    } else {
                        txt = txt.split("-")[1];
                        if (txt <= 80) {
                            textValue[idName] = contentText;
                            newStr += '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + '<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + contentText.replace(/\s|\r|\n/g, "").length + ' </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" style="width: 100%"/>';
                        } else {
                            textValue[idName] = contentText;
                            newStr += '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + '<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + contentText.replace(/\s|\r|\n/g, "").length + ' </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">';
                        }
                    }
                    newStr += '</li>';
                }
                if (leixing == "1") {//数字
                    var idName = 'txt_' + v["ID"] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + ("" + contentText).length + ' </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                        + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" value="' + contentText + '" style="width: 100%"/>'
                        + '</li>';
                }
                if (leixing == "2") {//单选
                    var idName = 'radio_' + v["ID"] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v["列名"]] == i) {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" checked="checked"/>' + '<label for="' + idName + i + '">' + raido[i] + '</label>'
                            } else {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" />' + '<label for="' + idName + i + '">' + raido[i] + '</label>'
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                    if (v["是否关联项"] == 0) {
                        var selData = checkValIsUndefinedOrNull(value[v["列名"]]) ? -1 : value[v["列名"]];
                        newStr += setValueDTSeachData(data, value, textValue, richTextContent, richTextId, 1, v['ID'], selData);
                    }
                }
                if (leixing == "3") {//多选
                    var nameName = 'checkbox_' + v['ID'] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        var id = v["列名"].split(",")
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            var idName = 'checkbox_' + v["ID"] + '_' + id[i];
                            if (value[v["列名"].split(",")[i]] == '1') {
                                newStr += '<input class="margl" type="checkbox" id="' + idName + '" name="' + nameName + '" value="' + i + '" checked="checked"/>' + '<label for="' + idName + '">' + raido[i] + '</label>'
                            } else {
                                newStr += '<input class="margl" type="checkbox" id="' + idName + '" name="' + nameName + '" value="' + i + '" />' + '<label for="' + idName + '">' + raido[i] + '</label>'
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                }
                if (leixing == "4") {//时间
                    var idName = 'date_' + v["ID"] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="designTable_radio"><span class="margl">'
                        + '</span><input id="' + idName + '" type="text" value="' + contentText + '" class="easyui-datebox mgL" data-options="prompt:\'请选择正确的时间\',showSeconds:false,editable: false,height:24,width:180" panelheight="240" >'
                        + '</div></li>';
                }
                if (leixing == "6") {//富文本
                    var idName = 'txt_' + v["ID"] + '_' + v["列名"];
                    richTextId.push(idName);
                    richTextContent.push({ name: idName, value: contentText });
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + contentText.replace(/\s|\r|\n/g, "").length + ' </i>字符</span><span class="statement margl">' + zhushi + '</span></p>'
                        //+ '<textarea class="ad-txt" id="' + idName + '" name="' + idName + '" style="width: 100%;">' + contentText + '</textarea>'
                        + '<script id="' + idName + '" name="' + idName + '" style="width: 100%;" type="text/plain"></script>'
                        + '</li>';
                }
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '</li>';
                }
            } else if (TMleixing == 1) {
                //二级自定义标题
                if (leixing == "0") {//文本
                    var idName = "txt_" + v['ID'] + "_" + v['列名'];
                    var txtLen = v['限制'];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                    if (txtLen == "" || txtLen == null) {
                        textValue["txt_" + v['ID'] + "_" + v['列名']] = contentText;
                        newStr += '<div class="gxf_designTable_secondTitle">'
                            + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                            + '<span class="writerText margl"> 共输入<i style="color: #f00;">' + contentText.replace(/\s|\r|\n/g, "").length + '</i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                            + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">'
                            + '</div></li>';
                    } else {
                        txtLen = txtLen.split("-");
                        if (txtLen[1] <= 80) {// 文本长度小于80
                            textValue["txt_" + v['ID'] + "_" + v['列名']] = contentText;
                            newStr += '<div class="gxf_designTable_secondTitle">'
                                + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + '<span class="writerText margl"> 共输入<i style="color: #f00;">' + contentText.replace(/\s|\r|\n/g, "").length + '</i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" style="width: 100%">'
                                + '</div>';
                        } else {// 文本长度大于
                            textValue["txt_" + v['ID'] + "_" + v['列名']] = contentText;
                            newStr += '<div class="gxf_designTable_secondTitle">'
                                + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                                + '<span class="writerText margl"> 共输入<i style="color: #f00;">' + contentText.replace(/\s|\r|\n/g, "").length + '</i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                                + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">'
                                + '</div>';
                        }
                    }
                    newStr += '</li>'
                }
                if (leixing == "1") {//数字
                    var idName = "txt_" + v['ID'] + "_" + v['列名'];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;">' + ("" + contentText).length + '</i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                        + '<input id="' + idName + '" type="text" class="easyui-textbox" data-options="multiline:true,height:30" value="' + contentText + '" style="width: 100%">'
                        + '</div></li>';
                }
                if (leixing == "2") {//单选
                    var idName = 'radio_' + v["ID"] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v["列名"]] == i) {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" checked="checked"/>' + '<label  for="' + idName + i + '">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input class="margl" type="radio" id="' + idName + i + '" name="' + idName + '" value="' + i + '" />' + '<label for="' + idName + i + '">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                    if (v["是否关联项"] == 0) {
                        var selData = checkValIsUndefinedOrNull(value[v["列名"]]) ? -1 : value[v["列名"]];
                        newStr += setValueDTSeachData(data, value, textValue, richTextContent, richTextId, 1, v['ID'], selData);
                    }
                }
                if (leixing == "3") {//多选
                    var nameName = 'checkbox_' + v['ID'] + '_' + v["列名"];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="designTable_radio">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        var id = v["列名"].split(",")
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            var idName = 'checkbox_' + v["ID"] + '_' + id[i];
                            if (value[v["列名"].split(",")[i]] == '1') {
                                newStr += '<input class="margl" type="checkbox" id="' + idName + '" name="' + nameName + '" value="' + i + '" checked="checked"/>' + '<label for="' + idName + '">' + raido[i] + '</label>'
                            } else {
                                newStr += '<input class="margl" type="checkbox" id="' + idName + '" name="' + nameName + '" value="' + i + '" />' + '<label for="' + idName + '">' + raido[i] + '</label>'
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        }
                    }
                    newStr += '</div></li>';
                }
                if (leixing == "4") {//时间
                    var idName = "date_" + v['ID'] + "_" + v['列名'];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="designTable_radio"><span class="margl"></span>'
                        + '<input id="' + idName + '" type="text"  value="' + contentText + '" class="easyui-datebox mgL" data-options="prompt:\'请选择正确的时间\',showSeconds:false,editable: false,height:24,width:180" panelheight="240">'
                        + '</div></li>';
                }
                if (leixing == "6") {//富文本
                    var idName = "txt_" + v['ID'] + "_" + v['列名'];
                    richTextId.push(idName);
                    richTextContent.push({ name: idName, value: contentText });
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v["是否为空"] == 0 ? '<b style="color: #f00;position:relative;top:3px;"> * </b>' : "") + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + '<span class="writerText margl"> 共输入<i style="color: #f00;">' + contentText.replace(/\s|\r|\n/g, "").length + '</i>字符</span><span class="statement margl">' + zhushi + '</span></h3>'
                        //+ '<textarea class="ad-txt" id="' + idName + '" name="' + idName + '" style="width: 100%;">' + contentText + '</textarea>'
                        + '<script id="' + idName + '" name="' + idName + '" style="width: 100%;" type="text/plain"></script>'
                        + '</div></li>';
                }
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + ' <span class="statement margl">' + zhushi + '</span></h3>'
                        + '</div></li>';
                }
            }
        }
    });
    return newStr;
}


/*
    * 自定义表-详情-没有划词
    * data   自定义表
    * value  提交的数据
    * htmlID  页面ul的id
    * checType  是否直接返回html字符串（审核用）
*/
function GetDetailesDesignTable(data, value, htmlID, checType) {
    if (data) {
        var richTextIds = []; // 富文本容器ID
        var newStr = getDtSeachData(data, value, 0);
        if (checType) {
            return { newStr: newStr, richTextIds: richTextIds };
        } else {
            $("#" + htmlID).append(newStr);      // 添加到页面
            $.parser.parse("#" + htmlID);             // 重新渲染
            //uParseUEditor(richTextIds);
        };
    };
};

function getDtSeachData(data, value, guanlian, guanliannId, guanlianValue) {
    var random = getRandom(6);
    var newStr = '';
    guanlian = guanlian == 1 ? 1 : 0;
    value = checkValIsUndefinedOrNull(value) ? {} : value
    $.each(data, function (i, v) {
        if (v["失效"] == 0 && v['是否关联项'] == guanlian && (guanliannId > 0 ? (v['关联ID'] == guanliannId) : true)) {
            var leixing = v["类型"];
            var zhushi = v["注释"] || "";
            var TMleixing = v["标题类型"];
            var arrangement = v["排列方式"];
            var contentText = (checkValIsUndefinedOrNull(value[v["列名"]]) ? " " : (leixing == 6 ? retrieveUnequa(value[v["列名"]], true) : retrieveUnequa(value[v["列名"]])));
            if (TMleixing == 0) {
                // 一级标题
                if (leixing == "0") {// 文本
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                    newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                        if (value["检测类型"] == 0) {
                            newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                        } else if (value["检测类型"] == 16) {
                            if (getTextNumber(contentText) <= 200) {
                                newStr += '<span class="margl" style="font-size: 12px;">内容过短，不支持检测（不计入正文检测结果）</span>';
                            }
                        }
                    }
                    newStr += '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_detailes clearfix">' + (replaceBr(contentText).replace(/\s/g, "&nbsp;")) + '</div>'
                        + '</li>';
                };
                if (leixing == "1") {// 数字
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_detailes clearfix">' + (contentText) + '</div>'
                        + '</li>';
                };
                if (leixing == "2") {// 单选框
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_detailes">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名']] == i) {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" checked="checked" disabled="disabled"/>' + ' <label  class="margr">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" disabled="disabled"/>' + ' <label class="margr" >' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div></li>';
                    if (v["是否关联项"] == 0) {
                        var selData = checkValIsUndefinedOrNull(value[v["列名"]]) ? -1 : value[v["列名"]];
                        newStr += getDtSeachData(data, value, 1, v['ID'], selData);
                    }
                };
                if (leixing == "3") {//多选
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_detailes">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名'].split(",")[i]] == 1) {
                                newStr += '<input type="checkbox"  value="' + i + '" checked="checked" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input type="checkbox" value="' + i + '" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div></li>';
                };
                if (leixing == "4") {
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_detailes">'
                        + (contentText.indexOf(" ") >= 0 ? contentText.split(" ")[0] : contentText)
                        + '</div></li>';
                };
                if (leixing == "6") {// 富文本
                    var idName = "txt_" + v['ID'] + "_" + v['列名'];
                    //richTextIds.push(idName);
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                    //if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                    //    newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                    //}
                    //newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    newStr += '<span class="statement margl">' + zhushi + '</span></p>';
                    newStr += '<div id="' + idName + '" class="gxf_designTable_detailes clearfix">' + (contentText) + '</div>'
                    newStr += '</li>';
                };
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p></li>';
                };
            } else if (TMleixing == 1) {
                // 二级标题
                if (leixing == "0") {//文本
                    var name = "txt_" + v['ID'] + "_" + v['列名'];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>'
                    newStr += (v['题目'].replace(/#cnkibrcnki#/g, '<br />'));
                    newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                        if (value["检测类型"] == 0) {
                            newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                        } else if (value["检测类型"] == 16) {
                            if (getTextNumber(contentText) <= 200) {
                                newStr += '<span class="margl" style="font-size: 12px;">内容过短，不支持检测（不计入正文检测结果）</span>';
                            }
                        }
                    }
                    newStr += '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_detailes clearfix"> ' + (replaceBr(contentText).replace(/\s/g, "&nbsp;"))
                        + '</div></div></li>';
                };
                if (leixing == "1") {//数字
                    var name = "txt_" + v['ID'] + "_" + v['列名'];
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_detailes clearfix"> ' + contentText
                        + '</div></div></li>';
                };
                if (leixing == "2") {//单选
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_detailes clearfix"> '
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名']] == i) {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" checked="checked" disabled="disabled"/>' + '<label class="margr">' + raido[i] + '</label>'
                            } else {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" disabled="disabled"/>' + '<label class="margr">' + raido[i] + '</label>'
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div></div></li>';;
                    if (v["是否关联项"] == 0) {
                        var selData = checkValIsUndefinedOrNull(value[v["列名"]]) ? -1 : value[v["列名"]];
                        newStr += getDtSeachData(data, value, 1, v['ID'], selData);
                    }
                };
                if (leixing == "3") {//多选
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_detailes clearfix"> '
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            var idName = 'checkbox_' + v["ID"] + '_' + raido[i];
                            if (value[v['列名'].split(",")[i]] == 1) {
                                newStr += '<input type="checkbox"  value="' + i + '" checked="checked" disabled="disabled"/>' + '<label class="margr">' + raido[i] + '</label>'
                            } else {
                                newStr += '<input type="checkbox"  value="' + i + '" disabled="disabled"/>' + '<label class="margr">' + raido[i] + '</label>'
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div></div></li>';
                };
                if (leixing == "4") {//时间
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_detailes clearfix"> '
                        + (contentText.indexOf(" ") >= 0 ? contentText.split(" ")[0] : contentText)
                        + '</div></div></li>';
                };
                if (leixing == "6") {//富文本
                    var idName = "txt_" + v['ID'] + "_" + v['列名'];
                    //richTextIds.push(idName);
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                    //if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                    //    newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                    //}
                    //newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    newStr += '<span class="statement margl">' + zhushi + '</span></h3>';
                    newStr += '<div id="' + idName + '" class="gxf_designTable_detailes clearfix">' + (contentText);
                    newStr += '</div></div></li>';
                };
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                        + ' <span class="statement margl">' + zhushi + '</span></h3>'
                        + '</div></li>';
                };
            }
        }
    });
    return newStr
}

/*
    * 自定义表-详情-有划词
    * data   自定义表
    * value  提交的数据
    * htmlID  页面ul的id
    * rangyType  划词参数 type
*/
function GetDetailesDesignTableForRangy(data, value, htmlID, rangyType) {
    if (data) {
        var newStr = getDtfSeachData(data, value, 0);
        $("#" + htmlID).append(newStr);      // 添加到页面
        $.parser.parse("#" + htmlID);             // 重新渲染
        //uParseUEditor(richTextIds);
        $.each(data, function (idx, val) {// 划词
            if (val["类型"] == 0 || val["类型"] == 6) {
                var submitid = value["文件ID"];
                RangyHelper.createNew('left_' + val["列名"], '', submitid, rangyType, val["ID"]);
            };
        });
        $(window).resize(function () {
            $.each(data, function (idx, val) {
                if (val["类型"] == 0 || val["类型"] == 6) {
                    ChangeTheHeight(("left_" + val['列名']));
                }
            });
        });
    }
};

function getDtfSeachData(data, value, guanlian, guanliannId, guanlianValue) {
    var role = get_current_role();
    var random = getRandom(6);
    var newStr = '';
    guanlian = guanlian == 1 ? 1 : 0;
    value = checkValIsUndefinedOrNull(value) ? {} : value
    $.each(data, function (i, v) {
        if (v["失效"] == 0 && v['是否关联项'] == guanlian && (guanliannId > 0 ? (v['关联ID'] == guanliannId) : true)) {
            var TMleixing = v["标题类型"];
            var arrangement = v["排列方式"];
            var leixing = v["类型"];
            var zhushi = v["注释"] || "";
            var contentText = (checkValIsUndefinedOrNull(value[v["列名"]]) ? " " : (leixing == 6 ? retrieveUnequa(value[v["列名"]], true) : retrieveUnequa(value[v["列名"]])));
            if (TMleixing == 0) {// 一级标题
                if (leixing == "0") {// 文本
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'));
                    newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                        if (value["检测类型"] == 0) {
                            newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                        } else if (value["检测类型"] == 16) {
                            if (getTextNumber(contentText) <= 200) {
                                newStr += '<span class="margl" style="font-size: 12px;">内容过短，不支持检测（不计入正文检测结果）</span>';
                            }
                        }
                    }
                    newStr += '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div id="left_' + v["列名"] + '" tableModelId = "' + v["ID"] + '" class="gxf_rangy_left"><p><span>' + (contentText.replace(/(\n\n\n)|(\n\n)|\n/g, '</span></p><p><span>').replace(/\s/g, '&nbsp;')) + '</span></p></div>'
                        + '<div id="right_box_left_' + v["列名"] + '" class="gxf_rangy_right_box">';
                    if (role != 2) {
                        newStr += '<p class="gxf_rangy_right_top">支持左侧选择文字批注，也支持★<a class="listA rangy_all" href="javascript:;">整体批注</a></p>';
                    }
                    newStr += '<ul id="right_left_' + v["列名"] + '" class="gxf_rangy_right"></ul></div>'
                        + '</div></li>';
                };
                if (leixing == "1") {//数字
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">' + contentText + '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul>'
                        + '</div></div></li>';
                };
                if (leixing == "2") {// 单选框
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名']] == i) {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" checked="checked" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" disabled="disabled"/>' + ' <label class="margr" >' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul></div></div></li>';
                    if (v["是否关联项"] == 0) {
                        var selData = checkValIsUndefinedOrNull(value[v["列名"]]) ? -1 : value[v["列名"]];
                        newStr += getDtfSeachData(data, value, 1, v['ID'], selData);
                    }
                };
                if (leixing == "3") {//多选
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名'].split(",")[i]] == 1) {
                                newStr += '<input type="checkbox"  value="' + i + '" checked="checked" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input type="checkbox"  value="' + i + '" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul></div></div></li>';
                };
                if (leixing == "4") {
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">'
                        + (contentText.indexOf(" ") >= 0 ? contentText.split(" ")[0] : contentText) + '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul>'
                        + '</div></div></li>';
                };
                if (leixing == "6") {//富文本
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                    //if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                    //    newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                    //}
                    //newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    var idName = 'left_' + v["列名"];
                    //richTextIds.push(idName);
                    newStr += '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div id="' + idName + '" tableModelId = "' + v["ID"] + '" class="gxf_rangy_left">' + contentText + '</div>' //<p><span>' + (.replace(/(\n\n\n)|(\n\n)|\n/g, '</span></p><p><span>')) + '</span></p>
                        + '<div id="right_box_left_' + v["列名"] + '" class="gxf_rangy_right_box">'
                    if (role != 2) {
                        newStr += '<p class="gxf_rangy_right_top">支持左侧选择文字批注，也支持★<a class="listA rangy_all" href="javascript:;">整体批注</a></p>';
                    }
                    newStr += '<ul id="right_left_' + v["列名"] + '" class="gxf_rangy_right"></ul>'
                        + '</div></div></li>';
                };
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li><p style="margin-left: 5px;">' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></p></li>';
                };
            } else if (TMleixing == 1) {
                // 二级标题
                if (leixing == "0") {//文本
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'));
                    newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                        if (value["检测类型"] == 0) {
                            newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                        } else if (value["检测类型"] == 16) {
                            if (getTextNumber(contentText) <= 200) {
                                newStr += '<span class="margl" style="font-size: 12px;">内容过短，不支持检测（不计入正文检测结果）</span>';
                            }
                        }
                    }
                    newStr += '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div id="left_' + v["列名"] + '" tableModelId = "' + v["ID"] + '" class="gxf_rangy_left"><p><span>' + (contentText.replace(/(\n\n\n)|(\n\n)|\n/g, '</span></p><p><span>').replace(/\s/g, '&nbsp;')) + '</span></p></div>'
                        + '<div id="right_box_left_' + v["列名"] + '" class="gxf_rangy_right_box">';
                    if (role != 2) {
                        newStr += '<p class="gxf_rangy_right_top">支持左侧选择文字批注，也支持★<a class="listA rangy_all" href="javascript:;">整体批注</a></p>';
                    }
                    newStr += '<ul id="right_left_' + v["列名"] + '" class="gxf_rangy_right"></ul>'
                        + '</div></div></div></li>';
                };
                if (leixing == "1") {//数字
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">' + (contentText) + '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul>'
                        + '</div></div></div></li>';
                };
                if (leixing == "2") {//单选
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名']] == i) {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" checked="checked" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input type="radio" name="radio_' + v['ID'] + '_' + v["列名"] + '_' + random + '" value="' + i + '" disabled="disabled"/>' + ' <label class="margr" >' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul></div></div></div></li>';
                    if (v["是否关联项"] == 0) {
                        var selData = checkValIsUndefinedOrNull(value[v["列名"]]) ? -1 : value[v["列名"]];
                        newStr += getDtfSeachData(data, value, 1, v['ID'], selData);
                    }
                };
                if (leixing == "3") {//多选
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">';
                    if (v["中文列名"] !== "") {
                        var raido = v["中文列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            newStr += arrangement == 1 ? "<div style='padding: 2px 0;'>" : "";
                            if (value[v['列名'].split(",")[i]] == 1) {
                                newStr += '<input type="checkbox"  value="' + i + '" checked="checked" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            } else {
                                newStr += '<input type="checkbox" value="' + i + '" disabled="disabled"/>' + ' <label class="margr">' + raido[i] + '</label>';
                            }
                            newStr += arrangement == 1 ? "</div>" : "";
                        };
                    };
                    newStr += '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul></div></div></div></li>';
                };
                if (leixing == "4") {//时间
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div class="gxf_rangy_left gxf_noRangy">'
                        + (contentText.indexOf(" ") >= 0 ? contentText.split(" ")[0] : contentText) + '</div>'
                        + '<div class="gxf_rangy_right_box gxf_noRangy">'
                        + '<ul class="gxf_rangy_right gxf_noRangy"><li class="gxf_rangy_noContent"><h3>该内容暂不支持批注</h3></li></ul>'
                        + '</div></div></div></li>';
                };
                if (leixing == "6") {//富文本
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'))
                    //if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                    //    newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                    //}
                    //newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    var idName = 'left_' + v["列名"];
                    //richTextIds.push(idName);
                    newStr += '<span class="statement margl">' + zhushi + '</span></h3>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div id="' + idName + '" tableModelId = "' + v["ID"] + '" class="gxf_rangy_left">' + contentText + '</div>'//<p><span>' + (contentText.replace(/(\n\n\n)|(\n\n)|\n/g, '</span></p><p><span>')) + '</span></p>
                        + '<div id="right_box_left_' + v["列名"] + '" class="gxf_rangy_right_box">'
                    if (role != 2) {
                        newStr += '<p class="gxf_rangy_right_top">支持左侧选择文字批注，也支持★<a class="listA rangy_all" href="javascript:;">整体批注</a></p>';
                    }
                    newStr += '<ul id="right_left_' + v["列名"] + '" class="gxf_rangy_right"></ul>'
                        + '</div></div></div></li>';
                };
                if (leixing == 7) {//只显示标题 不显示内容
                    newStr += '<li ' + (guanlian == 1 ? (v['关联ID'] > 0 && v['关联值'] == guanlianValue) ? '' : 'style="display: none;"' : '') + '>'
                        + '<div class="gxf_designTable_secondTitle">'
                        + '<h3 class="gxf_designTable_secondTitle_Title"><i> </i>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />')) + ' <span class="statement margl">' + zhushi + '</span></h3>'
                        + '</div></li>';
                };
            }
        }
    });
    return newStr;
}

//  非自定义划词详情
function GetDetailesNoDesignTableForRangy(data, value, htmlID) {
    if (data) {
        value = checkValIsUndefinedOrNull(value) ? {} : value
        var role = get_current_role();
        var newStr = '';
        $.each(data, function (i, v) {
            var TMleixing = v["标题类型"];
            var leixing = v["类型"];
            var zhushi = v["注释"] || "";
            var contentText = (checkValIsUndefinedOrNull(value[v["中文列名"]]) ? "" : (value[v["中文列名"]] == 'DesignTable' ? "" : retrieveUnequa(value[v["中文列名"]])));
            if (TMleixing == 0) {// 一级标题
                if (leixing == "0") {// 文本
                    newStr += '<li><p>' + (v['题目'].replace(/#cnkibrcnki#/g, '<br />'));
                    newStr += '<span class="writerText margl"> 共输入<i style="color: #f00;">' + getTextNumber(contentText) + '</i>字符</span>';
                    if (!checkValIsUndefinedOrNull(value["检测状态"]) && value["检测状态"] != '-1') {
                        if (value["检测类型"] == 0) {
                            newStr += '<span class="margl" style="font-size: 12px;">' + GetCheckResult(11, value["文件ID"], v["ID"], 1) + '</span>';
                        } else if (value["检测类型"] == 16) {
                            if (getTextNumber(contentText) <= 200) {
                                newStr += '<span class="margl" style="font-size: 12px;">内容过短，不支持检测（不计入正文检测结果）</span>';
                            }
                        }
                    }
                    newStr += '<span class="statement margl">' + zhushi + '</span></p>'
                        + '<div class="gxf_designTable_rangy clearfix">'
                        + '<div id="left_' + v["列名"] + '" class="gxf_rangy_left"><p><span>' + (contentText.replace(/(\n\n\n)|(\n\n)|\n/g, '</span></p><p><span>').replace(/\s/g, '&nbsp;')) + '</span></p></div>'
                        + '<div id="right_box_left_' + v["列名"] + '" class="gxf_rangy_right_box">';
                    if (role != 2) {
                        newStr += '<p class="gxf_rangy_right_top">支持左侧选择文字批注，也支持★<a class="listA rangy_all" href="javascript:;">整体批注</a></p>';
                    }
                    newStr += '<ul id="right_left_' + v["列名"] + '" class="gxf_rangy_right"></ul></div>'
                        + '</div></li>';
                }
            }
        });
        $("#" + htmlID).append(newStr);      // 添加到页面
        $.parser.parse("#" + htmlID);             // 重新渲染
        $.each(data, function (idx, val) {   // 划词
            if (val["类型"] == 0 || val["类型"] == 6) {
                var submitid = value["文件ID"];
                RangyHelper.createNew('left_' + val["列名"], '', submitid, val['rangyType'], "");
            };
        });
        $(window).resize(function () {
            $.each(data, function (idx, val) {
                if (val["类型"] == 0 || val["类型"] == 6) {
                    ChangeTheHeight(("left_" + val['列名']));
                }
            });
        });
    }
};

// 调整划词左右框的高度
function ChangeTheHeight(idName) {
    var leftHeight = $("#" + idName).height();
    var rightBoxHeight = $("#right_box_" + idName).height();
    var rightTopHeight = $("#right_box_" + idName).find(".gxf_rangy_right_top").height();
    var rightHeight = $("#right_" + idName).height();

    if (rightTopHeight > 41) {
        if (leftHeight < (rightTopHeight + 17 + 58)) {
            $("#" + idName + ",#right_box_" + idName).height((rightTopHeight + 17 + 58));
        } else {
            $("#right_box_" + idName).height($("#" + idName).height());
        }
    } else {
        if (leftHeight < (rightTopHeight + 17 + 58)) {
            $("#" + idName + ",#right_box_" + idName).height((rightTopHeight + 17 + 58));
        } else {
            $("#right_box_" + idName).height($("#" + idName).height());
        }
    }

    $("#right_" + idName).height($("#right_box_" + idName).height() - $("#right_box_" + idName).find(".gxf_rangy_right_top").height() - 17);
};


/*
* 自定义表-提交传参
* DesignTable   自定义表
* params  提交的data对象
*/
function submitDesignTableValue(DesignTable, params, guanlian, guanlianID, guanlianValue) {
    if (DesignTable) {
        guanlian = guanlian == 1 ? 1 : 0
        $.each(DesignTable, function (index, value) {
            var leixing = value['类型'];
            if (value["失效"] == 0 && value['是否关联项'] == guanlian && (guanlianID > 0 ? (value['关联ID'] == guanlianID && value['关联值'] == guanlianValue) : true)) {
                if (leixing == '0' || leixing == '1') {
                    params['txt_' + value['ID'] + '_' + value['列名']] = replaceUnequa($('#txt_' + value['ID'] + '_' + value['列名']).textbox("getText"));
                };
                if (leixing == '2') {
                    var val = $("input[name='radio_" + value['ID'] + "_" + value['列名'] + "']:checked").val();
                    params['radio_' + value['ID'] + '_' + value['列名']] = val;
                    if (value['是否关联项'] == 0) {
                        submitDesignTableValue(DesignTable, params, 1, value['ID'], val);
                    }
                };
                if (leixing == '3') {
                    if (value["列名"]) {
                        var raido = value["列名"].split(",");
                        for (var i = 0; i < raido.length; i++) {
                            if ($("#checkbox_" + value["ID"] + '_' + raido[i]).prop('checked') == true) {
                                params['checkbox_' + value['ID'] + '_' + raido[i]] = $("#checkbox_" + value["ID"] + '_' + raido[i]).val();
                            };
                        };
                    };
                };
                if (leixing == '4') {
                    params['txt_' + value['ID'] + '_' + value['列名']] = $('#date_' + value['ID'] + '_' + value['列名']).datebox('getValue');
                }
                if (leixing == '6') { //富文本
                    //params['txt_' + value['ID'] + '_' + value['列名']] = $('#txt_' + value['ID'] + '_' + value['列名']).val();
                    params['txt_' + value['ID'] + '_' + value['列名']] = getUEditorContent('txt_' + value['ID'] + '_' + value['列名']);
                }
            }
        });
    }
    return params;
};

// 自定义数据校验
function SubmitCheckData(dt, guanlian, guanlianID, guanlianValue) {
    var isTrue = true;
    if (!checkValIsUndefinedOrNull(dt)) {
        guanlian = guanlian == 1 ? 1 : 0
        for (var i = 0; i < dt.length; i++) {
            if (dt[i]["失效"] == 0 && dt[i]['是否关联项'] == guanlian && (guanlianID > 0 ? (dt[i]['关联ID'] == guanlianID && dt[i]['关联值'] == guanlianValue) : true)) {
                if (dt[i]["类型"] == 0) {
                    var txt = $('#txt_' + dt[i]['ID'] + '_' + dt[i]['列名']).textbox("getText");
                    if (dt[i]["是否为空"] == 0) {
                        if (checkValIsUndefinedOrNull(txt)) {
                            myMessage(('“' + dt[i]["题目"] + '”，不允许为空，请重新输入！'));
                            isTrue = false;
                            break;
                        }
                        if (!checkValIsUndefinedOrNull(dt[i]["限制"])) {
                            var xz = dt[i]["限制"].split('-');
                            if (xz[0] > 0) {
                                if (txt.length < xz[0]) {
                                    myMessage(('“' + dt[i]["题目"] + '”，字符数不能小于' + xz[0] + '，请重新输入！'));
                                    isTrue = false;
                                    break;
                                }
                            }
                            if (xz[1] > 0) {
                                if (txt.length > xz[1]) {
                                    myMessage(('“' + dt[i]["题目"] + '”，字符数不能大于' + xz[1] + '，请重新输入！'));
                                    isTrue = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (dt[i]["类型"] == 1) {//数字
                    if (dt[i]["是否为空"] == 0) {
                        if (!isNumber($('#txt_' + dt[i]['ID'] + '_' + dt[i]['列名']).textbox("getText"))) {
                            myMessage(('“' + dt[i]["题目"] + '”，只能输入数字，请重新输入！'), function () {
                                $('#txt_' + dt[i]['ID'] + '_' + dt[i]['列名']).textbox("setText", "");
                            });
                            isTrue = false;
                            break;
                        }
                    }
                }
                if (dt[i]["类型"] == 2) {
                    if (dt[i]["是否为空"] == 0) {
                        if (checkValIsUndefinedOrNull($("input[name='radio_" + dt[i]['ID'] + "_" + dt[i]['列名'] + "']:checked").val())) {
                            myMessage(('“' + dt[i]["题目"] + '”，单选必须选择一个，请重新选择！'));
                            isTrue = false;
                            break;
                        }
                    }
                    if (dt[i]['是否关联项'] == 0) {
                        var val = $("input[name='radio_" + dt[i]['ID'] + "_" + dt[i]['列名'] + "']:checked").val();
                        SubmitCheckData(dt, 1, dt[i]['ID'], val);
                    }
                }
                if (dt[i]["类型"] == 3) {
                    if (dt[i]["是否为空"] == 0) {
                        var raido = dt[i]["列名"].split(",");
                        var isChecked = false;
                        for (var j = 0; j < raido.length; j++) {
                            if ($("#checkbox_" + dt[i]["ID"] + '_' + raido[j]).prop('checked') == true) {
                                isChecked = true;
                            }
                        }
                        if (!isChecked) {
                            myMessage(('“' + dt[i]["题目"] + '”，多选必须选择一个，请重新选择！'));
                            isTrue = false;
                            break;
                        }
                    }
                }
                if (dt[i]["类型"] == 4) { //时间
                    if (dt[i]["是否为空"] == 0) {
                        var date = $('#date_' + dt[i]['ID'] + '_' + dt[i]['列名']).datebox('getValue');
                        if (checkValIsUndefinedOrNull(date)) {
                            myMessage(('“' + dt[i]["题目"] + '”不能为空，请重输入！'));
                            isTrue = false;
                            break;
                        }
                    }
                }
                if (dt[i]["类型"] == 6) { //时间
                    var date = getUEditorContent('txt_' + dt[i]['ID'] + '_' + dt[i]['列名']);
                    if (dt[i]["是否为空"] == 0) {
                        if (checkValIsUndefinedOrNull(date)) {
                            myMessage(('“' + dt[i]["题目"] + '”不能为空，请重输入！'));
                            isTrue = false;
                            break;
                        }
                    }
                    if (GetCharLength(date) > 5242880) {
                        myMessage(('“' + dt[i]["题目"] + '”富文本输入框内录入的内容过长或者图片过多、过大，不支持提交。请适当删减内容、压缩或删减图片后再进行提交。！'));
                        isTrue = false;
                        break;
                    }
                }
            }
        }
    }
    return isTrue;
};

/*
* 检测结果
* type            文件类型
* id                文件id
* colunnID     自定义colunnID
* isDesign      是否自定义   1是 
* htmlID        页面显示位置 htmlID 
*/
function GetCheckResult(type, id, colunnID, isDesign, htmlID) {
    var html = "";
    $.ajax({
        url: "../Handler/GetCheck.ashx",
        data: {
            action: "GetCheckResult",
            type: type,
            ID: id,
            columnID: colunnID,
            isdesign: isDesign
        },
        dataType: "json",
        async: false,
        type: "POST",
        success: function (data) {
            if (data.isSuccess) {
                html = data.dataList[0]["检测结果"];
            } else {
                myMessage(data.message);
            };
        },
        error: function (err) {
            console.log(err);
        }
    });
    if (htmlID) {
        $("#" + htmlID).html(html);
    } else {
        return html;
    }
};


// 字符数
function getTextNumber(text) {
    var num = 0;
    if (!checkValIsUndefinedOrNull(text)) {
        if (text == "DesignTable") {
            num = 0;
        } else {
            num = ('' + text).replace(/\s|\r|\n/g, "").length;
        }
    }
    return num;
};

function getNoDesignTableText(text) {
    var txt = " ";
    if (!checkValIsUndefinedOrNull(text)) {
        txt = (text == "DesignTable" ? " " : replaceBr(text).replace(/\s/g, '&nbsp;'));
    }
    return txt;
}

// 输入时 显示字符数
var showWriteTextNum = {
    bindKeyup: function (inputID) {
        var input = $(inputID);
        if (input && input.length > 0) {
            input.textbox('textbox').bind('keyup', function (e) {
                input.prev().find(".writerText>i").html(" " + getTextNumber(input.textbox("getText")) + " ");
            });
        }
    }
};

// 子项事件
var radioChangeEvent = {
    bindChange: function (radioBoxName, data, isModal) {
        isModal = checkValIsUndefinedOrNull(isModal) ? '' : isModal
        var radio = $("input[type=radio][name=" + radioBoxName + "]");
        if (radio && radio.length > 0) {
            radio.on('click', function () {
                var value = $(this).val()
                var ID = $(this).prop('name').split('_')[1]
                var typeArr = ['txt', 'txt', 'radio', 'checkbox', 'date', '', 'txt']
                $.each(data, function (i, v) {
                    if (v['失效'] == 0 && v['关联ID'] == ID && v['是否关联项'] == 1) {
                        if (v['关联值'] == value) {
                            if (v['类型'] == 2 || v['类型'] == 3) {
                                var idLength = $('input[name=' + typeArr[v['类型']] + '_' + v['ID'] + '_' + v['列名'] + (isModal ? "_Modal" : "")+ ']')
                                if (idLength && idLength.length > 0) {
                                    $(idLength[0]).parent().parent().parent().show();
                                    $.parser.parse(idLength.parent().parent().parent())
                                }
                            } else {
                                var idLength = $('#' + typeArr[v['类型']] + '_' + v['ID'] + '_' + v['列名'] + (isModal ? "_Modal" : ""))
                                if (idLength && idLength.length > 0) {
                                    if (v['标题类型'] == 0) {
                                        idLength.parent().show();
                                        $.parser.parse(idLength.parent())
                                    } else {
                                        idLength.parent().parent().show();
                                        $.parser.parse(idLength.parent().parent())
                                    }
                                }
                            }
                        } else {
                            if (v['类型'] == 2 || v['类型'] == 3) {
                                var idLength = $('input[name=' + typeArr[v['类型']] + '_' + v['ID'] + '_' + v['列名'] + (isModal ? "_Modal" : "") + ']')
                                if (idLength && idLength.length > 0) {
                                    $(idLength[0]).parent().parent().parent().hide();
                                }
                            } else {
                                var idLength = $('#' + typeArr[v['类型']] + '_' + v['ID'] + '_' + v['列名'] + (isModal ? "_Modal" : ""))
                                if (idLength && idLength.length > 0) {
                                    if (v['标题类型'] == 0) {
                                        idLength.parent().hide();
                                    } else {
                                        idLength.parent().parent().hide();
                                    }
                                }
                            }
                        }
                    }
                })
            });
        }
    }
}

//判断字符串所占的字节数
function GetCharLength(str) {
    var iLength = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            iLength += 2;
        } else {
            iLength += 1;
        }
    }
    return iLength;
};