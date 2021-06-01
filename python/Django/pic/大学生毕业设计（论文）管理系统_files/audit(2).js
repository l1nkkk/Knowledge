
/**
 * 查询审核信息，提交审核结果
 */
var co_audit;
(function (audit) {

    //#region 自定义变量
    /**
     * 参数集合
     * tableElement:绑定Table
     * projectId:课题编号
     * queryUrl:查询请求URL
     * queryParams:查询请求参数集合
     * entrust:委托人角色
     * submitUrl:提交审核结果URL
     * submitData:除审核结果、审核意见、课题编号、审核日志ID外，补充提交数据
     */
    var audit_options = {};

    /**
     * 审核成功后回调函数
     */
    var audit_callback;
    /**
     * 获取详情后回调函数
     */
    var detail_callback;
    /**
     * OperationLogType
     */
    var opeType = -1;

    /**
     * 上传实例
     */
    var audit_submitUploader;
    var audit_updateUploader;
    var audit_resetLastAuditStateUploader;
    //#endregion

    /**
     * 删除附件
     * @param {any} fileName
     */
    audit.delAttachmentClick = function (fileName) {
        $('body').append('<div id="delAttchmentBox" class="easyui-dialog" style=" text-align:center;width:400px;height:200px; padding: 10px; word-wrap:break-word;" data-options="closed:true,modal:true"></div>');

        $('#delAttchmentBox').text("你确定要删除附件（ " + fileName + " ）吗？").dialog({
            title: '删除附件',
            buttons: [
                {
                    text: '确定',
                    handler: function () {
                        $("#audit_scfj").html("上传审核有关附件，支持附件格式为doc，docx，pdf，wps，rar，zip。");
                        $("#audit_scfj").attr("AttachmentNum", "-1");
                        $("#delAttchmentBox").dialog("close");
                        $("#delAttchmentBox").remove();
                    }
                },
                {
                    text: '取消',
                    handler: function () {
                        $("#delAttchmentBox").dialog("close");
                        $("#delAttchmentBox").remove();
                    }
                }
            ]
        }).dialog("open").window('center');
    };

    /**
     * 提交审核 或者提交最终审核状态
     * @returns {} 
     */
    var audit_submit = function () {
        var opeKeyId = $(this).siblings(".hdOpeKeyId").val();
        var projectId = $(this).siblings(".hdOpeKeyId").attr('projectId');
        var isUpdateLastState = $(this).siblings(".hdOpeKeyId").attr('isUpdateLastState') || false;
        var auditState = $("._checkState_ input[name=rdoAudit]:checked").val();
        var isDesign = $(this).siblings(".designTableModel").attr('isDesign'); // 是否自定义
        var pdata = audit_options.submitData || {};
        if (isDesign == 'true') {
            var designTableModel = JSON.parse($(this).siblings(".designTableModel").val());
            if (!SubmitCheckData(designTableModel)) { return }
            submitDesignTableValue(designTableModel, pdata);
        } else {
            var auditSuggest = $(audit_options.tableElement).find("#txtAuditSuggest").textbox('getText');
            if (checkValIsUndefinedOrNull(auditSuggest)) {
                myMessage("审核意见不能为空");
                return;
            };
            pdata["suggestion"] = replaceUnequa(auditSuggest);
        };
        if (auditState != 1 && auditState != -1) {
            myMessage("请选择审核结果");
            return;
        };
        if (isUpdateLastState) {
            pdata['designTableInfo'] = $(this).siblings('.designTableModel').attr('aesdesigntableinfo');
            pdata["recheck"] = 0;
            pdata["resetLastAuditState"] = 1;
        } else {
            pdata["recheck"] = 0;
            pdata["resetLastAuditState"] = 0;
        }
        pdata["opeKeyId"] = opeKeyId;
        pdata["projectId"] = projectId;
        pdata["auditState"] = auditState;
        if (auditState == 1) {
            if ($("#txtUsualGrade").length > 0) {
                var UsualGrade = $("#txtUsualGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(UsualGrade)) || UsualGrade < 0 || UsualGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = UsualGrade;
                pdata["ScoreType"] = 10;
            } else if ($("#txtOpenReportGrade").length > 0) {
                var OpGrade = $("#txtOpenReportGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(OpGrade)) || OpGrade < 0 || OpGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = OpGrade;
                pdata["ScoreType"] = 13;
            } else if ($("#txtMidGrade").length > 0) {
                var MidGrade = $("#txtMidGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(MidGrade)) || MidGrade < 0 || MidGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = MidGrade;
                pdata["ScoreType"] = 15;
            } else if ($("#txtEarlyGrade").length > 0) {
                var EarlyGrade = $("#txtEarlyGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(EarlyGrade)) || EarlyGrade < 0 || EarlyGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = EarlyGrade;
                pdata["ScoreType"] = 14;
            }
        } else if (auditState == -1) {
            if ($("#txtFinalScore").length > 0) {
                var FinalScore = $("#txtFinalScore").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(FinalScore)) || FinalScore < 0 || FinalScore > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = FinalScore;
                pdata["ScoreType"] = 5;
            }
        }

        pdata["entrust"] = audit_options.entrust;
        var fileId = $(audit_options.tableElement).find("#txtFileNameOfAudit").attr("fileId");
        open_loading();
        if ((audit_submitUploader || audit_resetLastAuditStateUploader) && !checkValIsUndefinedOrNull(fileId)) {
            pdata["ASPSESSID"] = getid();
            pdata["fileCount"] = 1;
            if (audit_submitUploader) {
                $.extend(audit_submitUploader.options.formData, pdata);
                audit_submitUploader.upload(fileId);
            }
            if (audit_resetLastAuditStateUploader) {
                $.extend(audit_resetLastAuditStateUploader.options.formData, pdata);
                audit_resetLastAuditStateUploader.upload(fileId);
            }
        } else {
            if ($("#audit_scfj").attr('AttachmentNum')) {
                pdata["fileCount"] = $("#audit_scfj").attr('AttachmentNum');
            } else {
                pdata["fileCount"] = 0;
            }
            $.ajax({
                url: audit_options.submitUrl,
                type: "post",
                data: pdata,
                dataType: "json",
                success: function (data) {
                    if (data) {
                        if (data.isSuccess) {
                            myMessage("审核成功", function () {
                                if (isUpdateLastState) {
                                    var tab = getCurrentTab();
                                    reloadTable(getUrlParam("prevTitle"), 'list');//刷新前一个页
                                    refreshTab2(tab);//刷新当前页
                                } else {
                                    var tabTitle = getCurrentTabTitle(); //当前tabTitle
                                    //刷新前一个页面
                                    var prevTitle = getUrlParam("prevTitle");
                                    reloadTable(prevTitle, 'list');
                                    closeTab(tabTitle);//关闭当前页
                                }
                            }, true);
                        } else {
                            myMessage(data.message);
                        };
                    }
                },
                error: function (err) {
                    if (console && console.log) {
                        console.log(err.statusText);
                    }
                },
                complete: function () {
                    close_loading();
                }
            });
        }
    };

    /**
     * 取消修改
     */
    var audit_update_cancel = function () {
        refreshTab2(getCurrentTab());//刷新当前页
    };

    /**
     * 提交修改意见
     */
    var audit_update_submit = function () {
        var auditState = $("._checkState_ input[name=rdoAudit]:checked").val();
        var opeKeyId = $(this).siblings('.hdOpeKeyId').val();
        var projectId = $(this).siblings('.hdOpeKeyId').attr('projectId');
        var sid = $(this).siblings('.hdOpeKeyId').attr('sid');
        var keyId = $(this).siblings('.hdOpeKeyId').attr('id');
        var isDesign = $(this).siblings('.designTableModel').attr('isDesign'); // 是否自定义
        var opeType = $(this).siblings('.hdOpeKeyId').attr('opeType');
        var pdata = {
            action: "UpdateAuditLog"
        };
        if (isDesign == 'true') {
            var designTableModel = JSON.parse($(this).siblings('.designTableModel').val());
            if (!SubmitCheckData(designTableModel)) { return }
            submitDesignTableValue(designTableModel, pdata);
        } else {
            var auditSuggest = $(audit_options.tableElement).find("#txtAuditSuggest").textbox('getText');
            if (checkValIsUndefinedOrNull(auditSuggest)) {
                myMessage("审核意见不能为空");
                return;
            };
            pdata["suggestion"] = replaceUnequa(auditSuggest);
        };
        pdata['designTableInfo'] = $(this).siblings('.designTableModel').attr('aesdesigntableinfo');
        pdata["opeKeyId"] = opeKeyId;
        pdata["projectId"] = projectId;
        pdata["keyId"] = keyId;
        pdata["sid"] = sid;
        pdata["auditState"] = auditState;
        pdata["opeType"] = opeType;
        if (auditState == 1) {
            if ($("#txtUsualGrade").length > 0) {
                var UsualGrade = $("#txtUsualGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(UsualGrade)) || UsualGrade < 0 || UsualGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = UsualGrade;
                pdata["ScoreType"] = 10;
            } else if ($("#txtOpenReportGrade").length > 0) {
                var OpGrade = $("#txtOpenReportGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(OpGrade)) || OpGrade < 0 || OpGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = OpGrade;
                pdata["ScoreType"] = 13;
            } else if ($("#txtMidGrade").length > 0) {
                var MidGrade = $("#txtMidGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(MidGrade)) || MidGrade < 0 || MidGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = MidGrade;
                pdata["ScoreType"] = 15;
            } else if ($("#txtEarlyGrade").length > 0) {
                var EarlyGrade = $("#txtEarlyGrade").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(EarlyGrade)) || EarlyGrade < 0 || EarlyGrade > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = EarlyGrade;
                pdata["ScoreType"] = 14;
            }
        } else if (auditState == -1) {
            if ($("#txtFinalScore").length > 0) {
                var FinalScore = $("#txtFinalScore").val();
                if ((!/^\d*\.{0,1}\d{0,1}$/.test(FinalScore)) || FinalScore < 0 || FinalScore > 100) {
                    myMessage("成绩只能是0-100的正整数,支持保留1位小数，请按照提示输入正确的成绩！");
                    return;
                }
                pdata["score"] = FinalScore;
                pdata["ScoreType"] = 5;
            }
        }

        var fileId = $(audit_options.tableElement).find("#txtFileNameOfAudit").attr("fileId");
        open_loading();
        if (audit_updateUploader && !checkValIsUndefinedOrNull(fileId)) {
            pdata["ASPSESSID"] = getid();
            pdata["fileCount"] = 1;
            $.extend(audit_updateUploader.options.formData, pdata);
            audit_updateUploader.upload(fileId);
        } else {
            if ($("#audit_scfj").attr('AttachmentNum')) {
                pdata["fileCount"] = $("#audit_scfj").attr('AttachmentNum');
            } else {
                pdata["fileCount"] = 0;
            }
            $.ajax({
                url: '../Handler/AuditHandler.ashx',
                type: "post",
                data: pdata,
                dataType: "json",
                success: function (data) {
                    if (data.isSuccess) {
                        myMessage("修改成功", function () {
                            refreshTab2(getCurrentTab());//刷新当前页
                        }, true);
                    } else {
                        myMessage(data.message);
                    };
                },
                error: function (err) {
                    if (console && console.log) {
                        console.log(err.statusText);
                    }
                },
                complete: function () {
                    close_loading();
                }
            });
        };
    };

    /**
     * 修改审核意见
     */
    var audit_update = function () {
        var currentRole = get_current_role();
        var thisBox = $(this).parent().parent().parent('.gxf_designTable_box');
        var aesdesigntableinfo = thisBox.find(".designTableModel").attr('aesdesigntableinfo'); // 是否自定义参数
        var details = thisBox.find(".designTableModel").val(); //详情
        var opeKeyId = thisBox.find(".hdOpeKeyId").val();
        var projectId = thisBox.find(".hdOpeKeyId").attr('projectId');
        var roleType = thisBox.find(".hdOpeKeyId").attr('roletype');
        var sid = thisBox.find(".hdOpeKeyId").attr('sid');
        var id = thisBox.find(".hdOpeKeyId").attr('id');
        var canUpload = false;
        var showAttachment = thisBox.find(".showAttachment").val();
        var checkState = thisBox.find(".hdOpeKeyId").attr('checkState');
        var attachmentHtml = "";
        var opeType = $(this).attr('opeType');
        var score = $(this).attr('score');
        var Sorts = thisBox.find(".hdOpeKeyId").attr('sort');
        if (showAttachment == 'true') {
            canUpload = true;
            attachmentHtml = '<li>';
            var fileName = thisBox.find(".showAttachment").attr('fileName');
            if (checkValIsUndefinedOrNull(fileName)) {
                attachmentHtml += '<p>添加附件：<span class="statement" id="audit_scfj" AttachmentNum = "0">新上传的文件将以附件的形式显示，支持附件格式为doc，docx，pdf，wps，rar，zip</span></p>';
            } else {
                attachmentHtml += '<p>添加附件：<span class="statement" id="audit_scfj" AttachmentNum = "0">已上传有关审核附件：<span style="color:#ff6632;">' + fileName + '<a href="javascript:co_audit.delAttachmentClick(\'' + fileName + '\');" class="listA margl">删除 </a></span>；'
                    + ' 新上传的文件将以附件的形式显示，支持附件格式为doc，docx，pdf，wps，rar，zip</span></p>';
            }
            attachmentHtml = attachmentHtml
                + '<input type="text" id="txtFileNameOfAudit" class="easyui-textbox" data-options="width:285,readonly:true" />'
                + '<span id="webUploaderPickOfAudit"></span>'
                + '<div id="divFileProgressContainerOfAudit" style=""></div>'
                + '</li>';
        }
        var htmlArr = ['', '', '', '', '', ''];
        var html = '';
        htmlArr[1] = '<li class="_checkState_">';
        htmlArr[1] += '<p>审核状态<span class="statement margl right_txt_red">' + audit_getFormSortTipsMsg(Sorts, 1) + '</span></p>';
        htmlArr[1] += '<div class="designTable_radio">';
        if (checkState == 1) {
            htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1" checked="checked" disabled="disabled"/><label for="rdoPass">通过</label>';
            htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1" disabled="disabled"/><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
        } else if (checkState == -1) {
            htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1" disabled="disabled"/><label for="rdoPass">通过</label>';
            htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1" checked="checked" disabled="disabled"/><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
        } else {
            htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1" disabled="disabled"/><label for="rdoPass">通过</label>';
            htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1" disabled="disabled"/><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
        }
        htmlArr[1] += '</div>';
        htmlArr[1] += '</li>';

        if (currentRole == 3) {
            if (opeType == 3) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示平时成绩"] == 1) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["平时成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>单次平时成绩</p>';
                    }
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtUsualGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtUsualGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="" disabled="disabled" autocomplete="off"/>';
                    }

                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(3) + '时，给定学生对应的“' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩")
                            + '”；系统将按照“多次平时成绩计算平均分”的方法计算学生的“' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '”，并按照设定的权重计入总成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(3) + '时，给定学生对应的“单次平时成绩”；系统将按照“多次平时成绩计算平均分”的方法计算学生的“单次平时成绩”，并按照设定的权重计入总成绩</div>';
                    }
                    htmlArr[2] += '</li>';
                }
            } else if (opeType == 1) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示开题报告成绩"] == 1) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["开题报告成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>开题报告成绩</p>';
                    }
                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtOpenReportGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtOpenReportGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" disabled="disabled" onclick="inputDetailScoreDialog()" value="" autocomplete="off"/>';
                    }
                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(1) + '时，给定学生对应的“' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩")
                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(1) + '时，给定学生对应的“开题报告成绩”；系统将按照设定的规则，计算相关成绩</div>';
                    }
                    htmlArr[2] += '</div></li>';
                }
            }
        }
        if (currentRole == 3 || currentRole == 11) {
            if (opeType == 5) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示中期检查成绩"] == 1 && (isShowScore['中期检查成绩评分角色'] == 0
                    || (isShowScore['中期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['中期检查成绩评分角色'] == 2 && roleType == 11))) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["中期检查绩名称"] || "中期检查成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["中期检查成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>中期检查成绩</p>';
                    }
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtMidGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtMidGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="" disabled="disabled" autocomplete="off"/>';
                    }

                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(2) + '时，给定学生对应的“' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩")
                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(2) + '时，给定学生对应的“初期检查成绩”；系统将按照设定的规则，计算相关成绩</div>';
                    }
                    htmlArr[2] += '</li>';
                }
            } else if (opeType == 26) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示初期检查成绩"] == 1 && (isShowScore['初期检查成绩评分角色'] == 0
                    || (isShowScore['初期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['初期检查成绩评分角色'] == 2 && roleType == 11))) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["初期检查成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>初期检查成绩</p>';
                    }
                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtEarlyGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtEarlyGrade" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="" disabled="disabled" autocomplete="off"/>';
                    }
                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(10) + '时，给定学生对应的“' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩")
                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(10) + '时，给定学生对应的“初期检查成绩”；系统将按照设定的规则，计算相关成绩</div>';
                    }
                    htmlArr[2] += '</div></li>';
                }
            }
        } else if (currentRole == 12) {
            if (opeType == 28) {
                htmlArr[2] += '<li class="usuallyResults">';
                htmlArr[2] += '<p>最终成绩</p>';
                htmlArr[2] += '<input id="txtFinalScore" disabled="disabled" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;"  value="' + score + '" autocomplete="off"/>';
                var tipsTxt = GetUsuallyResultsTipsTxt();
                if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                    htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                }
                htmlArr[2] += '<div class="statement txt_red">*仅选择“审核不通过”时，可以在本次审核最终成绩时，给定学生对应的“最终成绩”；</div>';
                htmlArr[2] += '</li>';
            }
        }
        $.ajax({
            url: "../Handler/DesignTableHandler.ashx",
            type: "post",
            data: {
                "action": "IshasSetDesignTableCommon",
                "designTableInfo": aesdesigntableinfo
            },
            dataType: "json"
        }).done(function (data) {
            var designTableValue;
            if (data.isSuccess) {
                var obj = {}
                try { obj = JSON.parse(details)[0] } catch (err) { obj = {} }
                designTableValue = SetValueDesignTable(data.rows, obj, "", true);
                htmlArr[3] += designTableValue['str'];
                if (showAttachment == 'true') {
                    htmlArr[4] += attachmentHtml;
                };
            } else {
                htmlArr[3] += '<li>';
                htmlArr[3] += '<p>审核意见<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + (details.replace(/\s|\r|\n/g, "").length) + ' </i>字符</span><span class="statement margl">请按照学校的要求，在下方输入相关内容，若无内容请填写“无”</span></p>';
                htmlArr[3] += '<input id="txtAuditSuggest" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">';
                htmlArr[3] += '</li>';
                if (showAttachment == 'true') {
                    htmlArr[4] += attachmentHtml;
                };
            };

            htmlArr[5] += "<li>";
            htmlArr[5] += "<input type='hidden' class='hdOpeKeyId' value='" + opeKeyId + "' projectId='" + projectId + "' sid='" + sid + "' id='" + id + "' roleType='" + roleType + "'  opeType='" + opeType + "'/>";
            if (data.isSuccess) {
                htmlArr[5] += "<input type='hidden' class='designTableModel' value='" + JSON.stringify(data.rows) + "' isDesign='true' aesdesigntableinfo='" + aesdesigntableinfo + "' />";
            } else {
                htmlArr[5] += "<input type='hidden' class='designTableModel' value='' isDesign='false' aesdesigntableinfo='" + aesdesigntableinfo + "' />";
            };
            htmlArr[5] += "<input type='button' id='btnUpdate_check' value='修改' class='formBtn margt'/><input type='button' id='btnCancel_check' value='取消' class='clearBtn margl margt'/></li>";
            if (!checkValIsUndefinedOrNull(Sorts)) {
                var htmlSort = [htmlArr[0], '', '', '', '', htmlArr[5]];
                $.each(JSON.parse(Sorts), function (i, v) {
                    if (!checkValIsUndefinedOrNull(htmlArr[v["Element"]])) {
                        htmlSort[v["Sort"]] = htmlArr[v["Element"]];
                    }
                });
                $.each(htmlSort, function (I, v) {
                    html += v;
                });
            } else {
                $.each(htmlArr, function (I, v) {
                    html += v;
                });
            }
            thisBox.empty().html(html);
            $.parser.parse(audit_options.tableElement); //重新渲染EasyUI
            if (data.isSuccess) {
                $.each(designTableValue['txt'], function (i, v) {
                    $("#" + i).textbox("setText", retrieveUnequa(v));
                });
            };
            if (data.isSuccess) {
                var richTextId = [];
                $.each(data.rows, function (i, v) {
                    if (v['失效'] == 0 && (v['类型'] == 0 || v['类型'] == 1)) {
                        showWriteTextNumber.createNew("CheckDetail", "txt_" + v['ID'] + "_" + v['列名']);
                    } else if (v['失效'] == 0 && v['类型'] == 6) {
                        richTextId.push("txt_" + v['ID'] + "_" + v['列名']);
                    } else if (v['失效'] == 0 && v['类型'] == 2) {
                        radioChangeEvent.bindChange('radio_' + v['ID'] + '_' + v['列名'], data.rows, '');
                    }
                });
                if (richTextId.length > 0) {
                    initUEditor(richTextId);         // 富文本编辑框初始化
                };
                $.each(designTableValue['richTextContent'], function (i, v) {
                    setUEditorContent(v.name, v.value);
                });
            } else {
                showWriteTextNumber.createNew("CheckDetail", "txtAuditSuggest");
                $("#txtAuditSuggest").textbox('setText', retrieveBr(details));
            };

            if (canUpload) {
                //创建上传实例
                audit_updateUploader = createWebuploader({
                    pick: {
                        id: "#webUploaderPickOfAudit",
                        innerHTML: "浏览",
                        multiple: false
                    },
                    txtFileName: "#txtFileNameOfAudit",
                    uploadTarget: "#divFileProgressContainerOfAudit",
                    successCallback: function (data, params) {
                        if (data.isSuccess) {
                            auditUploadSuccessFun("../Handler/AuditHandler.ashx", "UpdateAuditLog", params, 3);
                        } else {
                            myMessage(data.message);
                        }
                    }
                });
            };

            $(audit_options.tableElement).find("#btnUpdate_check").on("click", audit_update_submit);
            $(audit_options.tableElement).find("#btnCancel_check").on("click", audit_update_cancel);
        }).fail(function (err) {
            console.log(err);
        });
    };

    /**
     * 修改审核状态
     */
    var audit_recheck = function () {
        $('body').append('<div id="updateAuditState" class="easyui-dialog" style=" text-align:center;width:400px;height:200px; padding: 10px; word-wrap:break-word;" data-options="closed:true,modal:true"></div>');

        $('#updateAuditState').html("你确定要修改审核状态吗？").dialog({
            title: '提示',
            buttons: [{
                text: '确定', handler: function () {
                    var pdata = audit_options.submitData || {};
                    pdata["opeKeyId"] = $("#linkRecheck").attr('opeKeyId');
                    pdata["projectId"] = $("#linkRecheck").attr('projectId');
                    pdata["auditState"] = -1;
                    pdata["suggestion"] = "recheck"; //随意写的，没有具体作用
                    pdata["entrust"] = audit_options.entrust;
                    pdata["fileCount"] = 0;
                    pdata["recheck"] = 1;
                    pdata["resetLastAuditState"] = 0;

                    $.ajax({
                        url: audit_options.submitUrl,
                        type: "post",
                        data: pdata,
                        dataType: "json"
                    }).done(function (data) {
                        if (data.isSuccess) {
                            myMessage("修改成功", function () {
                                $("#updateAuditState").dialog("close");
                                $("#updateAuditState").remove();

                                var tab = getCurrentTab();
                                //刷新前一个页面
                                reloadTable(getUrlParam("prevTitle"), 'list');
                                //刷新当前页
                                refreshTab2(tab);
                            }, true);
                        } else {
                            myMessage(data.message);
                        };
                    }).fail(function (err) {
                        if (console && console.log) {
                            console.log(err);
                        }
                        myMessage("修改审核状态请求异常");
                    });
                }
            },
            {
                text: '取消', handler: function () {
                    $("#updateAuditState").dialog("close");
                    $("#updateAuditState").remove();
                }
            }]
        }).dialog("open").window('center');
    };

    /**
     * 修改最终审核状态
     */
    var audit_resetLastAuditState = function () {
        var currentRole = get_current_role();
        var thisBox = $(this).parent().parent().parent('.gxf_designTable_box');
        var aesdesigntableinfo = thisBox.find(".designTableModel").attr('aesdesigntableinfo'); // 是否自定义参数
        var details = thisBox.find(".designTableModel").val(); //详情
        var opeType = $(this).attr('opeType');
        var opeKeyId = thisBox.find(".hdOpeKeyId").val();
        var projectId = thisBox.find(".hdOpeKeyId").attr('projectId');
        var roleType = thisBox.find(".hdOpeKeyId").attr('roletype');
        var checkState = thisBox.find(".hdOpeKeyId").attr('checkState');
        var score = $(this).attr('score');
        var Sorts = thisBox.find(".hdOpeKeyId").attr('sort');
        //var usuallyRetult = thisBox.find(".usuallyResultsDetails").text(); // 平时成绩
        //var OPGrade = thisBox.find(".openReportGradeDetails").text(); // 开题报告成绩
        var canUpload = false;
        var showAttachment = thisBox.find(".showAttachment").val();
        var attachmentHtml = "";
        if (showAttachment == 'true') {
            canUpload = true;
            attachmentHtml = '<li>';
            var fileName = thisBox.find(".showAttachment").attr('fileName');
            if (checkValIsUndefinedOrNull(fileName)) {
                attachmentHtml += '<p>添加附件：<span class="statement" id="audit_scfj" AttachmentNum = "0">新上传的文件将以附件的形式显示，支持附件格式为doc，docx，pdf，wps，rar，zip</span></p>';
            } else {
                attachmentHtml += '<p>添加附件：<span class="statement" id="audit_scfj" AttachmentNum = "0">已上传有关审核附件：<span style="color:#ff6632;">' + fileName + '<a href="javascript:co_audit.delAttachmentClick(\'' + fileName + '\');" class="listA margl">删除 </a></span>；'
                    + ' 新上传的文件将以附件的形式显示，支持附件格式为doc，docx，pdf，wps，rar，zip</span></p>';
            }
            attachmentHtml = attachmentHtml
                + '<input type="text" id="txtFileNameOfAudit" class="easyui-textbox" data-options="width:285,readonly:true" />'
                + '<span id="webUploaderPickOfAudit"></span>'
                + '<div id="divFileProgressContainerOfAudit" style=""></div>'
                + '</li>';
        }
        var htmlArr = ['', '', '', '', '', ''];
        var html = '';
        htmlArr[1] = '<li class="_checkState_">';
        htmlArr[1] += '<p>审核状态<span class="statement margl right_txt_red">' + audit_getFormSortTipsMsg(Sorts, 1) + '</span></p>';
        htmlArr[1] += '<div class="designTable_radio">';
        if (checkState == 1) {
            htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1" checked="checked"/><label for="rdoPass">通过</label>';
            htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1"/><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
        } else if (checkState == -1) {
            htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1"/><label for="rdoPass">通过</label>';
            htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1" checked="checked"/><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
        } else {
            htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1"/><label for="rdoPass">通过</label>';
            htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1"/><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
        }

        htmlArr[1] += '</div>';
        htmlArr[1] += '</li>';
        if (currentRole == 3) {
            if (opeType == 3) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示平时成绩"] == 1) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["平时成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>单次平时成绩</p>';
                    }
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtUsualGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtUsualGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="" disabled="disabled" autocomplete="off"/>';
                    }
                    //htmlArr[2] += '<input type="text" id="txtUsualGrade" class="easyui-textbox" data-options="width:80,height:30" value="' + score+'"/>';
                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(3) + '时，给定学生对应的“' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩")
                            + '”；系统将按照“多次平时成绩计算平均分”的方法计算学生的“' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '”，并按照设定的权重计入总成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(3) + '时，给定学生对应的“单次平时成绩”；系统将按照“多次平时成绩计算平均分”的方法计算学生的“单次平时成绩”，并按照设定的权重计入总成绩</div>';
                    }
                    htmlArr[2] += '</li>';
                }
            } else if (opeType == 1) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示开题报告成绩"] == 1) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["开题报告成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>开题报告成绩</p>';
                    }
                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtOpenReportGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtOpenReportGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value=""  disabled="disabled" autocomplete="off"/>';
                    }
                    //htmlArr[2] += '<input type="text" id="" class="easyui-textbox" data-options="width:80,height:30" value="' + score+'"/>';
                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(1) + '时，给定学生对应的“' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩")
                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(1) + '时，给定学生对应的“开题报告成绩”；系统将按照设定的规则，计算相关成绩</div>';
                    }
                    htmlArr[2] += '</div></li>';
                }
            }
        }
        if (currentRole == 3 || currentRole == 11) {
            if (opeType == 5) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示中期检查成绩"] == 1 && (isShowScore['中期检查成绩评分角色'] == 0
                    || (isShowScore['中期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['中期检查成绩评分角色'] == 2 && roleType == 11))) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["中期检查成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>中期检查告成绩</p>';
                    }
                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtMidGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtMidGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value=""  disabled="disabled" autocomplete="off"/>';
                    }
                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(2) + '时，给定学生对应的“' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩")
                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(2) + '时，给定学生对应的“中期检查成绩”；系统将按照设定的规则，计算相关成绩</div>';
                    }
                    htmlArr[2] += '</div></li>';
                }
            } else if (opeType == 26) {
                var isShowScore = getUsuallyResultsIsShow();
                if (isShowScore && isShowScore["不显示初期检查成绩"] == 1 && (isShowScore['初期检查成绩评分角色'] == 0
                    || (isShowScore['初期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['初期检查成绩评分角色'] == 2 && roleType == 11))) {
                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                    htmlArr[2] += '<li  class="usuallyResults">';
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩");
                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩") + '占总成绩的权重为：<strong>'
                            + (weightTxt.rows[0]["初期检查成绩"] || 0) + '</strong>）</span></p>';
                    } else {
                        htmlArr[2] += '<p>初期检查成绩</p>';
                    }
                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                    if (checkState == 1) {
                        htmlArr[2] += '<input id="txtEarlyGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="' + score + '" autocomplete="off"/>';
                    } else {
                        htmlArr[2] += '<input id="txtEarlyGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" value="" disabled="disabled" autocomplete="off"/>';
                    }
                    var tipsTxt = GetUsuallyResultsTipsTxt();
                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                    }
                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(10) + '时，给定学生对应的“' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩")
                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                    } else {
                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(10) + '时，给定学生对应的“初期检查成绩”；系统将按照设定的规则，计算相关成绩</div>';
                    }
                    htmlArr[2] += '</div></li>';
                }
            }
        } else if (currentRole == 12) {
            if (opeType == 28) {
                htmlArr[2] += '<li class="usuallyResults">';
                htmlArr[2] += '<p>最终成绩</p>';
                htmlArr[2] += '<input id="txtFinalScore" disabled="disabled" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;"  value="' + score + '" autocomplete="off"/>';
                var tipsTxt = GetUsuallyResultsTipsTxt();
                if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                    htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                }
                htmlArr[2] += '<div class="statement txt_red">*仅选择“审核不通过”时，可以在本次审核最终成绩时，给定学生对应的“最终成绩”；</div>';
                htmlArr[2] += '</li>';
            }
        }

        $.ajax({
            url: "../Handler/DesignTableHandler.ashx",
            type: "post",
            data: {
                "action": "IshasSetDesignTableCommon",
                "designTableInfo": aesdesigntableinfo
            },
            dataType: "json"
        }).done(function (data) {
            var designTableValue;
            if (data.isSuccess) {
                var obj = {}
                try { obj = JSON.parse(details)[0] } catch (err) { obj = {} }
                designTableValue = SetValueDesignTable(data.rows, obj, "", true);
                htmlArr[3] += designTableValue['str'];
                if (showAttachment == 'true') {
                    htmlArr[4] += attachmentHtml;
                };
            } else {
                htmlArr[3] += '<li>';
                htmlArr[3] += '<p>审核意见<span class="writerText margl"> 共输入<i style="color: #f00;"> ' + (details.replace(/\s|\r|\n/g, "").length) + ' </i>字符</span><span class="statement margl">请按照学校的要求，在下方输入相关内容，若无内容请填写“无”</span></p>';
                htmlArr[3] += '<input id="txtAuditSuggest" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">';
                htmlArr[3] += '</li>';
                if (showAttachment == 'true') {
                    htmlArr[4] += attachmentHtml;
                };
            };

            htmlArr[5] += "<li>";
            htmlArr[5] += "<input type='hidden' class='hdOpeKeyId' value='" + opeKeyId + "' projectId='" + projectId + "' roleType='" + roleType + "' isUpdateLastState='1' />";
            if (data.isSuccess) {
                htmlArr[5] += "<input type='hidden' class='designTableModel' value='" + JSON.stringify(data.rows) + "' isDesign='true' aesdesigntableinfo='" + aesdesigntableinfo + "' />";
            } else {
                htmlArr[5] += "<input type='hidden' class='designTableModel' value='' isDesign='false' aesdesigntableinfo='" + aesdesigntableinfo + "' />";
            };
            htmlArr[5] += "<input type='button' id='btnUpdate_LastAuditState' value='修改' class='formBtn margt'/><input type='button' id='btnCancel_check' value='取消' class='clearBtn margl margt'/></li>";
            if (!checkValIsUndefinedOrNull(Sorts)) {
                var htmlSort = [htmlArr[0], '', '', '', '', htmlArr[5]];
                $.each(JSON.parse(Sorts), function (i, v) {
                    if (!checkValIsUndefinedOrNull(htmlArr[v["Element"]])) {
                        htmlSort[v["Sort"]] = htmlArr[v["Element"]];
                    }
                });
                $.each(htmlSort, function (I, v) {
                    html += v;
                });
            } else {
                $.each(htmlArr, function (I, v) {
                    html += v;
                });
            }
            thisBox.empty().html(html);
            $.parser.parse(audit_options.tableElement); //重新渲染EasyUI
            if (data.isSuccess) {
                $.each(designTableValue['txt'], function (i, v) {
                    $("#" + i).textbox("setText", retrieveUnequa(v));
                });
            };
            if (data.isSuccess) {
                var richTextId = [];
                $.each(data.rows, function (i, v) {
                    if (v['失效'] == 0 && (v['类型'] == 0 || v['类型'] == 1)) {
                        showWriteTextNumber.createNew("CheckDetail", "txt_" + v['ID'] + "_" + v['列名']);
                    } else if (v['失效'] == 0 && v['类型'] == 6) {
                        richTextId.push("txt_" + v['ID'] + "_" + v['列名']);
                    } else if (v['失效'] == 0 && v['类型'] == 2) {
                        radioChangeEvent.bindChange('radio_' + v['ID'] + '_' + v['列名'], data.rows, '');
                    }
                });
                if (richTextId.length > 0) {
                    initUEditor(richTextId);         // 富文本编辑框初始化
                };

                $.each(designTableValue['richTextContent'], function (i, v) {
                    setUEditorContent(v.name, v.value);
                });
            } else {
                showWriteTextNumber.createNew("CheckDetail", "txtAuditSuggest");
                $("#txtAuditSuggest").textbox('setText', retrieveBr(details));
            };


            if (canUpload) {
                //创建上传实例
                audit_resetLastAuditStateUploader = createWebuploader({
                    pick: {
                        id: "#webUploaderPickOfAudit",
                        innerHTML: "浏览",
                        multiple: false
                    },
                    txtFileName: "#txtFileNameOfAudit",
                    uploadTarget: "#divFileProgressContainerOfAudit",
                    successCallback: function (data, params) {
                        if (data.isSuccess) {
                            var url = audit_options.submitUrl.split("?")[0];
                            var action = audit_options.submitUrl.split("?")[1].split("=")[1];
                            auditUploadSuccessFun(url, action, params, 2);
                        } else {
                            myMessage(data.message);
                        }
                    }
                });
            };

            $(audit_options.tableElement).find("#btnUpdate_LastAuditState").on("click", audit_submit);
            $(audit_options.tableElement).find("#btnCancel_check").on("click", audit_update_cancel);
            $(audit_options.tableElement).find("input[name=rdoAudit]").off().on("click", isUsuallyResultsShow); // 平时成绩
        }).fail(function (err) {
            console.log(err);
        });
    };

    /**
     * 历史记录查看详情
     * @param {any} historyId
     * @param {any} designTableInfo
     * @param {any} roleName
     */
    var auditHistoryDtetails = function () {
        var historyId = $(this).attr("his-id");
        var designTableInfo = $(this).attr("his-dt");
        var roleName = $(this).attr("his-name");
        var Sorts = $(this).attr("his-sort");
        $('body').append('<div id="historyDetailsView" class="easyui-dialog" style="width:80%;height:500px; padding: 5px;" data-options="closed:true,modal:true"></div>');
        $.ajax({
            url: "../Handler/AuditHandler.ashx",
            type: "post",
            dataType: "json",
            data: {
                'action': "GetAuditLogDetail",
                'historyId': historyId,
                'designTableInfo': designTableInfo
            }
        }).done(function (data) {
            if (data.isSuccess) {
                var htmlArr = ['', '', '', '', '', ''];
                var html = '';
                var richTextIds = []; //富文本容器ID
                htmlArr[0] += '<div class="gxf_designTable_content">';
                htmlArr[0] += '<ul class="gxf_designTable_box">';
                htmlArr[0] += '<li  class="gxf_designTable_roleTime">';
                htmlArr[0] += '<span >审核人：' + (roleName || " ") + '</span><span class="margl">审核时间：' + (data.dataList['AuditTime'] || " ") + '</span>';
                htmlArr[0] += '</li>';
                htmlArr[1] += '<li  class="_checkState_"><p>审核状态</p>';
                htmlArr[1] += '<div class="gxf_designTable_detailes"><span class="' + getAuditCss(data.dataList['State']) + '">' + getAuditStateText(data.dataList['State'], data.dataList['OpeType']) + '</span>';
                htmlArr[1] += '</div></li>';
                if (data.dataList['IsDesign']) {
                    //htmlArr[3] += GetDetailesDesignTable(data.dataList['DesignTableModel'], data.dataList['DesignTableData'][0], "", true);
                    var designTableDetails = GetDetailesDesignTable(data.dataList['DesignTableModel'], data.dataList['DesignTableData'][0], "", true);
                    htmlArr[3] += designTableDetails.newStr;
                    //richTextIds.push(designTableDetails.richTextIds);
                } else {
                    htmlArr[3] += '<li><p>审核意见</p><div class="gxf_designTable_detailes">' + replaceBr(data.dataList['Suggestion']) + '</div></li>';
                };
                if (data.dataList['ShowAttachment']) {
                    if (!checkValIsUndefinedOrNull(data.dataList['Attachment']) && !checkValIsUndefinedOrNull(data.dataList['AttachmentUrl'])) {
                        htmlArr[4] += '<li>';
                        htmlArr[4] += '<p>附件</p><div class="gxf_designTable_detailes">' + data.dataList['Attachment'] + '<a class="listA margl" href="' + data.dataList['AttachmentUrl'] + '" download="' + data.dataList['Attachment'] + '" title="' + data.dataList['Attachment'] + '">点击下载</a></div>';
                        htmlArr[4] += '</li>';
                    };
                };
                htmlArr[5] += '</ul></div>';

                if (!checkValIsUndefinedOrNull(Sorts)) {
                    var htmlSort = [htmlArr[0], '', '', '', '', htmlArr[5]];
                    $.each(JSON.parse(Sorts), function (i, v) {
                        if (!checkValIsUndefinedOrNull(htmlArr[v["Element"]])) {
                            htmlSort[v["Sort"]] = htmlArr[v["Element"]];
                        }
                    });
                    $.each(htmlSort, function (I, v) {
                        html += v;
                    });
                } else {
                    $.each(htmlArr, function (I, v) {
                        html += v;
                    });
                }
                $('#historyDetailsView').html(html).dialog({
                    title: '审核历史记录',
                    buttons: [{
                        text: '确定', handler: function () {
                            $("#historyDetailsView").dialog("close");
                            $("#historyDetailsView").remove();
                        }
                    }]
                }).dialog("open").window('center');
                uParseUEditor(richTextIds);
            };
        }).fail(function (err) {
            console.log(err);
        });
    };

    /**
     * 解析审核信息
     * @param {any} auditDetail
     */
    var audit_parse = function (auditDetail, historyId, historyType) {
        var currentRole = get_current_role();
        var entrust = audit_options.entrust;
        if (currentRole == 3 || currentRole == 10) { //指导教师
            if (!checkValIsUndefinedOrNull(entrust)) { //委托审核，用委托人的角色
                currentRole = entrust;
            }
        } else if (currentRole == 1) { //管理员
            currentRole = 1000;
        }

        var canUpload = false; //是否可以上传附件
        if (auditDetail && auditDetail.OperationLogs && auditDetail.OperationLogs.length > 0) {
            //returnAuditHtml(auditDetail, currentRole);
            var opeType = auditDetail.OperationLogs[0].OpeType;
            for (var i = 0; i < auditDetail.OperationLogs.length; i++) {
                var htmlArr = ['', '', '', '', '', ''];
                var html = '';
                var operationLog = auditDetail.OperationLogs[i] // 
                var opeKeyId = operationLog.Id;
                var state = operationLog.State;
                var projectId = operationLog.ProjectId;
                var auditTime = operationLog.AuditTime || "          ";
                var auditSuggest = (operationLog.Suggestion);
                var auditor = operationLog.AuditorName || "      ";
                var roleType = operationLog.RoleType;
                var roleName = operationLog.RoleName;
                var auditCss = getAuditCss(state);
                var auditText = getAuditStateText(state, opeType);
                var isDesign = operationLog.IsDesign;// 是否自定义
                var designTableModel = operationLog.DesignTableModel;
                var designTableData = operationLog.DesignTableData;
                var showAttachment = operationLog.ShowAttachment; // 是否显示附件
                var aesDesignTableInfo = operationLog.AesDesignTableInfo; // 自定义修改时参数
                var UsuallyResult = operationLog.PeaceTimeScore; // 平时成绩
                var OpGrade = operationLog["OpeningReportScore"]; // 开题报告成绩
                var MidGrade_3 = operationLog["TeacherInterimCheckScore"]; // 中期检查成绩-教师
                var EarlyGrade_3 = operationLog["TeacherEarlyCheckScore"]; // 初期检查成绩-教师
                var MidGrade_11 = operationLog["CustomReviewerInterimCheckScore"]; // 中期检查成绩-自定义审核人人
                var EarlyGrade_11 = operationLog["CustomReviewerEarlyCheckScore"]; // 初期检查成绩-自定义审核人
                var FinalScore = operationLog['FinalScore'];
                var OpeId = operationLog["OpeId"];
                var canRecheck = operationLog.CanRecheck || false; //是否可以修改审核状态
                var canResetLastAuditState = operationLog.CanResetLastAuditState || false; //是否可以修改最终审核状态
                var fileName = operationLog.Attachment || "";//附件
                var fileLink = operationLog.AttachmentUrl || "";//附件
                var Sorts = operationLog["FlowFormSorts"];
                //var OpGrade = '25'; // 开题报告成绩
                if (checkValIsUndefinedOrNull(roleName) && historyType != 2) { //系统自动审核，不显示审核人
                    auditor = "      ";
                    auditTime = "          ";
                }
                var onlyShowRichTextIds = []; //富文本容器ID，用于展示内容的div
                var auditMode = '';
                if (currentRole != 3 && currentRole != 2 && (state == 1 || state == -1)) {
                    if (operationLog["BatchAudit"] == 1) {
                        auditMode = "<span class='BatchReview' title='该条数据的审核方式为“批量审核”'>批</span>";
                    } else {
                        auditMode = "<span class='BatchReview' title='该条数据的审核方式为进入审核页面进行的“单独审核”'>单</span>";
                    }
                }

                //历史记录
                var historyHtml = "";
                if (operationLog.HistoryLogs && operationLog.HistoryLogs.length > 0) {
                    historyHtml += "<li class='gxf_designTable_history' >";
                    var HisLength = operationLog.HistoryLogs.length;
                    for (var h = 0; h < operationLog.HistoryLogs.length; h++) {
                        var historyLog = operationLog.HistoryLogs[h];
                        historyHtml += "<div>" + historyLog['HistoryTime'] + "<span class='margl'> 第 " + (HisLength) + " 次审核意见</span>"
                            + "<a class='listA margl history' href='javascript:;' his-id='" + historyLog['Id'] + "' his-dt='" + aesDesignTableInfo + "' his-name='" + auditor
                            + "' his-sort='" + (checkValIsUndefinedOrNull(Sorts) ? "" : JSON.stringify(Sorts)) + "'>查看详情</a></div>";
                        HisLength--;
                    };
                    historyHtml += "</li>";
                };

                if (historyType != 2) {
                    htmlArr[0] += '<div class="gxf_designTable_check">' + roleName + '审核情况</div>';
                }
                if (state == 1) { //审核通过
                    htmlArr[0] += '<div class="gxf_designTable_content gxf_designTable_ResizefontSize" ' + ((historyType == 2 && i > 0) ? "style=\'border-top: 0 none;\'" : "") + '>';
                    htmlArr[0] += '<ul class="gxf_designTable_box">';
                    htmlArr[0] += '<li  class="gxf_designTable_roleTime">';
                    htmlArr[0] += '<span >审核人：' + auditor + '</span><span class="margl">审核时间：' + auditTime + '</span>';
                    if (checkValIsUndefinedOrNull(historyId)) {
                        if (auditDetail.CurrentTid > 0 && auditDetail.CurrentTid == operationLog.Auditor && currentRole > 0 && currentRole == roleType) { //审核通过，可以修改审核意见
                            if (canRecheck) {
                                htmlArr[0] += "<span><a id='linkRecheck' class='listA margl' projectId='" + projectId + "' opeKeyId='" + opeKeyId + "' href='javascript:void(0);'>修改审核状态</a></span>";
                            };
                            if (canResetLastAuditState) {
                                htmlArr[0] += "<span><a id='linkResetLastAuditState' class='listA margl' projectId='" + projectId + "' opeKeyId='" + opeKeyId + "' opeType='" + opeType + "' auditState='" + state
                                    + "' score='" + (UsuallyResult || OpGrade || MidGrade_3 || MidGrade_11 || EarlyGrade_3 || EarlyGrade_11 || FinalScore || '') + "' href='javascript:void(0);'>修改最终审核状态</a></span>";
                                htmlArr[0] += "<span class='statement mgL txt_red'>（上一次提交后30分钟内，您可以修改审核状态）</span>";
                            } else {
                                htmlArr[0] += "<span><a id='linkUpdateAuditLog' class='listA margl' projectId='" + projectId + "' opeKeyId='" + opeKeyId + "' opeType='" + opeType + "' auditState='" + state
                                    + "' score='" + (UsuallyResult || OpGrade || MidGrade_3 || MidGrade_11 || EarlyGrade_3 || EarlyGrade_11 || FinalScore || '') + "' href='javascript:void(0);'>修改审核内容</a></span>";
                            };
                        };
                    }
                    htmlArr[0] += '</li>';
                    htmlArr[1] += '<li  class="_checkState_"><p>审核状态</p>';
                    htmlArr[1] += "<input type='hidden' class='hdOpeKeyId' value='" + opeKeyId + "' projectId='" + projectId + "' roleType='" + roleType + "' checkState='1' sid='"
                        + audit_options["queryParams"]['sid'] + "' id='" + OpeId + "' sort='" + (checkValIsUndefinedOrNull(Sorts) ? "" : JSON.stringify(Sorts)) + "'/>";
                    htmlArr[1] += "<input type='hidden' class='showAttachment' value='" + showAttachment + "' fileName='" + fileName + "' fileLink='" + fileLink + "' />";
                    htmlArr[1] += "<input type='hidden' class='designTableModel' value='" + (checkValIsUndefinedOrNull(designTableData) ? replaceBr(auditSuggest) : replaceUnequa(JSON.stringify(designTableData)))
                        + "' aesDesignTableInfo='" + aesDesignTableInfo + "' />";
                    htmlArr[1] += '<div class="gxf_designTable_detailes"><span class="' + auditCss + '">' + auditText + '</span>' + auditMode;
                    htmlArr[1] += '</div></li>';
                    // 平时成绩
                    if (roleType == 3) {
                        if (opeType == 1) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示开题报告成绩"] == 1) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="openReportGradeDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["开题报告成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>开题报告成绩</p>';
                                }
                                htmlArr[2] += '<div class="gxf_designTable_detailes">' + (OpGrade || "未录入 ") + '</div></li>';
                            }
                        } else if (opeType == 3) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示平时成绩"] == 1) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="usuallyResultsDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["平时成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>单次平时成绩</p>';
                                }
                                htmlArr[2] += '<div class="gxf_designTable_detailes">' + (UsuallyResult || "未录入") + '</div></li>';
                            }
                        }
                    }
                    if (roleType == 3 || roleType == 11) {
                        if (opeType == 5) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示中期检查成绩"] == 1 && (isShowScore['中期检查成绩评分角色'] == 0
                                || (isShowScore['中期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['中期检查成绩评分角色'] == 2 && roleType == 11))) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="openReportGradeDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["中期检查成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>中期检查成绩</p>';
                                }
                                if (roleType == 3) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (MidGrade_3 || "未录入 ") + '</div></li>';
                                } else if (roleType == 11) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (MidGrade_11 || "未录入 ") + '</div></li>';
                                }
                            }
                        } else if (opeType == 26) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示初期检查成绩"] == 1 && (isShowScore['初期检查成绩评分角色'] == 0
                                || (isShowScore['初期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['初期检查成绩评分角色'] == 2 && roleType == 11))) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="usuallyResultsDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["初期检查成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>初期检查成绩</p>';
                                }
                                if (roleType == 3) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (EarlyGrade_3 || "未录入 ") + '</div></li>';
                                } else if (roleType == 11) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (EarlyGrade_11 || "未录入 ") + '</div></li>';
                                }
                            }
                        }
                    } else if (roleType == 12) {
                        if (opeType == 28) {
                            htmlArr[2] += '<li class="usuallyResults">';
                            htmlArr[2] += '<p>最终成绩</p>';
                            htmlArr[2] += '<div class="gxf_designTable_detailes">' + (FinalScore || "未录入") + '</div></li>';
                        }
                    }

                    if (isDesign) {
                        //htmlArr[3] += GetDetailesDesignTable(designTableModel, designTableData[0], "", true);
                        var designTableDetails = GetDetailesDesignTable(designTableModel, designTableData[0], "", true);
                        htmlArr[3] += designTableDetails.newStr;
                        onlyShowRichTextIds.push(designTableDetails.richTextIds);
                    } else {
                        htmlArr[3] += '<li><p>审核意见</p><div class="gxf_designTable_detailes">' + replaceBr(auditSuggest) + '</div></li>';
                    }
                    if (showAttachment) {
                        if (!checkValIsUndefinedOrNull(fileName) && !checkValIsUndefinedOrNull(fileLink)) {
                            htmlArr[4] += '<li>';
                            htmlArr[4] += '<p>附件</p><div class="gxf_designTable_detailes">' + fileName + '<a class="listA margl" href="' + fileLink + '" download="' + fileName + '" title="' + fileName + '">点击下载</a></div>';
                            htmlArr[4] += '</li>';
                        }
                    }
                    htmlArr[5] += historyHtml;
                    htmlArr[5] += '</ul></div>';
                } else if (state == -1) { //审核不通过
                    htmlArr[0] += '<div class="gxf_designTable_content gxf_designTable_ResizefontSize" ' + ((historyType == 2 && i > 0) ? "style=\'border-top: 0 none;\'" : "") + '>';
                    htmlArr[0] += '<ul class="gxf_designTable_box">';
                    htmlArr[0] += '<li  class="gxf_designTable_roleTime">';
                    htmlArr[0] += '<span >审核人：' + auditor + '</span><span class="margl">审核时间：' + auditTime + '</span>';
                    if (checkValIsUndefinedOrNull(historyId)) {
                        if (auditDetail.CurrentTid > 0 && auditDetail.CurrentTid == operationLog.Auditor && currentRole > 0 && currentRole == roleType) {
                            if (canResetLastAuditState) {
                                htmlArr[0] += "<span><a id='linkResetLastAuditState' class='listA margl' projectId='" + projectId + "' opeKeyId='" + opeKeyId + "' opeType='" + opeType + "' auditState='"
                                    + state + "' score='" + (UsuallyResult || OpGrade || MidGrade_3 || MidGrade_11 || EarlyGrade_3 || EarlyGrade_11 || FinalScore || '') + "' href='javascript:void(0);'>修改最终审核状态</a></span>";
                                htmlArr[0] += "<span class='statement mgL txt_red'>（上一次提交后30分钟内，您可以修改审核状态）</span>";
                            } else {
                                htmlArr[0] += "<span><a id='linkUpdateAuditLog' class='listA margl' projectId='" + projectId + "' opeKeyId='" + opeKeyId + "'opeType='" + opeType + "' auditState='" + state
                                    + "' score='" + (UsuallyResult || OpGrade || MidGrade_3 || MidGrade_11 || EarlyGrade_3 || EarlyGrade_11 || FinalScore || '') + "' href='javascript:void(0);'>修改审核内容</a></span>";
                            };
                        }
                    }
                    htmlArr[0] += '</li>';
                    htmlArr[1] += '<li  class="_checkState_"><p>审核状态</p>';
                    htmlArr[1] += "<input type='hidden' class='hdOpeKeyId' value='" + opeKeyId + "' projectId='" + projectId + "' roleType='" + roleType + "' checkState='-1' sid='"
                        + audit_options["queryParams"]['sid'] + "' id='" + OpeId + "' sort='" + (checkValIsUndefinedOrNull(Sorts) ? "" : JSON.stringify(Sorts)) + "'/>";
                    htmlArr[1] += "<input type='hidden' class='showAttachment' value='" + showAttachment + "' fileName='" + fileName + "' fileLink='" + fileLink + "' />";
                    htmlArr[1] += "<input type='hidden' class='designTableModel' value='" + (checkValIsUndefinedOrNull(designTableData) ? replaceBr(auditSuggest) : replaceUnequa(JSON.stringify(designTableData)))
                        + "' aesDesignTableInfo='" + aesDesignTableInfo + "' />";
                    htmlArr[1] += '<div class="gxf_designTable_detailes"><span class="' + auditCss + '">' + auditText + '</span>' + auditMode + '</div></li>';
                    // 平时成绩
                    if (roleType == 3) {
                        if (opeType == 3) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示平时成绩"] == 1) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="usuallyResultsDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["平时成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>单次平时成绩</p>';
                                }
                                htmlArr[2] += '<div class="gxf_designTable_detailes">' + (UsuallyResult || "未录入") + '</div></li>';
                            }
                        } else if (opeType == 1) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示开题报告成绩"] == 1) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="openReportGradeDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["开题报告成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>开题报告成绩</p>';
                                }
                                htmlArr[2] += '<div class="gxf_designTable_detailes">' + (OpGrade || "未录入") + '</div></li>';
                            }
                        }
                    }
                    if (roleType == 3 || roleType == 11) {
                        if (opeType == 5) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示中期检查成绩"] == 1 && (isShowScore['中期检查成绩评分角色'] == 0
                                || (isShowScore['中期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['中期检查成绩评分角色'] == 2 && roleType == 11))) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="usuallyResultsDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["中期检查成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>中期检查成绩</p>';
                                }
                                if (roleType == 3) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (MidGrade_3 || "未录入") + '</div></li>';
                                } else if (roleType == 11) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (MidGrade_11 || "未录入") + '</div></li>';
                                }
                            }
                        } else if (opeType == 26) {
                            var isShowScore = getUsuallyResultsIsShow();
                            if (isShowScore && isShowScore["不显示初期检查成绩"] == 1 && (isShowScore['初期检查成绩评分角色'] == 0
                                || (isShowScore['初期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['初期检查成绩评分角色'] == 2 && roleType == 11))) {
                                var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                htmlArr[2] += '<li  class="openReportGradeDetails">';
                                if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                    htmlArr[2] += '<p>' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩");
                                    htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩") + '占总成绩的权重为：<strong>'
                                        + (weightTxt.rows[0]["初期检查成绩"] || 0) + '</strong>）</span></p>';
                                } else {
                                    htmlArr[2] += '<p>初期检查成绩</p>';
                                }
                                if (roleType == 3) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (EarlyGrade_3 || "未录入") + '</div></li>';
                                } else if (roleType == 11) {
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">' + (EarlyGrade_11 || "未录入") + '</div></li>';
                                }
                            }
                        }
                    } else if (roleType == 12) {
                        if (opeType == 28) {
                            htmlArr[2] += '<li class="usuallyResults">';
                            htmlArr[2] += '<p>最终成绩</p>';
                            htmlArr[2] += '<div class="gxf_designTable_detailes">' + (FinalScore || "未录入") + '</div></li>';
                        }
                    }
                    if (isDesign) {
                        //htmlArr[3] += GetDetailesDesignTable(designTableModel, designTableData[0], "", true);
                        var designTableDetails = GetDetailesDesignTable(designTableModel, designTableData[0], "", true);
                        htmlArr[3] += designTableDetails.newStr;
                        onlyShowRichTextIds.push(designTableDetails.richTextIds);
                    } else {
                        htmlArr[3] += '<li><p>审核意见</p><div class="gxf_designTable_detailes">' + replaceBr(auditSuggest) + '</div></li>';
                    };
                    if (showAttachment) {
                        if (!checkValIsUndefinedOrNull(fileName) && !checkValIsUndefinedOrNull(fileLink)) {
                            htmlArr[4] += '<li>';
                            htmlArr[4] += '<p>附件</p><div class="gxf_designTable_detailes">' + fileName + '<a class="listA margl" href="' + fileLink + '" download="' + fileName + '" title="' + fileName + '">点击下载</a></div>';
                            htmlArr[4] += '</li>';
                        };
                    };
                    htmlArr[5] += historyHtml;
                    htmlArr[5] += '</ul></div>';
                } else if (state == 0) { //等待审核
                    if (currentRole != roleType || (currentRole == 12 && opeType == 28 && checkValIsUndefinedOrNull(audit_options.queryParams.isAuditScore))) {
                        htmlArr[0] += '<div class="gxf_designTable_content gxf_designTable_ResizefontSize" ' + ((historyType == 2 && i > 0) ? "style=\'border-top: 0 none;\'" : "") + '>';
                        htmlArr[0] += '<ul class="gxf_designTable_box">';
                        htmlArr[1] += '<li  class="_checkState_"><p>审核状态</p>';
                        htmlArr[1] += '<div class="gxf_designTable_detailes"><span class="' + auditCss + '">' + auditText + '</span></div></li>';
                        // 平时成绩
                        if (roleType == 3) {
                            if (opeType == 3) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示平时成绩"] == 1) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li  class="usuallyResultsDetails">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '占总成绩的权重为：<strong>'
                                            + (weightTxt.rows[0]["平时成绩"] || 0) + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>单次平时成绩</p>';
                                    }
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">等待录入</div></li>';
                                }
                            } else if (opeType == 1) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示开题报告成绩"] == 1) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li  class="openReportGradeDetails">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩") + '占总成绩的权重为：<strong>'
                                            + (weightTxt.rows[0]["开题报告成绩"] || 0) + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>开题报告成绩</p>';
                                    }
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">等待录入</div></li>';
                                }
                            }
                        }
                        if (roleType == 3 || roleType == 11) {
                            if (opeType == 5) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示中期检查成绩"] == 1 && (isShowScore['中期检查成绩评分角色'] == 0
                                    || (isShowScore['中期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['中期检查成绩评分角色'] == 2 && roleType == 11))) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li  class="usuallyResultsDetails">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩") + '占总成绩的权重为：<strong>'
                                            + (weightTxt.rows[0]["中期检查成绩"] || 0) + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>中期检查成绩</p>';
                                    }
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">等待录入</div></li>';
                                }
                            } else if (opeType == 26) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示初期检查成绩"] == 1 && (isShowScore['初期检查成绩评分角色'] == 0
                                    || (isShowScore['初期检查成绩评分角色'] == 1 && roleType == 3) || (isShowScore['初期检查成绩评分角色'] == 2 && roleType == 11))) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li  class="openReportGradeDetails">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩") + '占总成绩的权重为：<strong>'
                                            + (weightTxt.rows[0]["初期检查成绩"] || 0) + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>初期检查成绩</p>';
                                    }
                                    htmlArr[2] += '<div class="gxf_designTable_detailes">等待录入</div></li>';
                                }
                            }
                        } else if (roleType == 12) {
                            if (opeType == 28) {
                                htmlArr[2] += '<li class="usuallyResults">';
                                htmlArr[2] += '<p>最终成绩</p>';
                                htmlArr[2] += '<div class="gxf_designTable_detailes">' + (FinalScore || "未录入") + '</div></li>';
                            }
                        }
                        htmlArr[5] += '</ul></div>';
                    } else if (currentRole != 0) {
                        htmlArr[0] += '<div class="gxf_designTable_content" ' + ((historyType == 2 && i > 0) ? "style=\'border-top: 0 none;\'" : "") + '>';
                        htmlArr[0] += '<ul  class="gxf_designTable_box">';;
                        htmlArr[1] += '<li class="_checkState_">';
                        htmlArr[1] += '<p>审核状态<span class="statement margl right_txt_red">' + audit_getFormSortTipsMsg(Sorts, 1) + '</span></p>';
                        htmlArr[1] += '<div class="designTable_radio">';
                        htmlArr[1] += '<input id="rdoPass" class="margl" type="radio" name="rdoAudit" value="1" /><label for="rdoPass">通过</label>';
                        htmlArr[1] += '<input id="rdoUnPass" class="margl" type="radio" name="rdoAudit" value="-1" /><label for="rdoUnPass">' + getAuditStateText(-1, opeType).replace(/审核/g, '') + '</label>';
                        htmlArr[1] += '</div>';
                        htmlArr[1] += '</li>';
                        if (currentRole == 3) {
                            if (opeType == 3) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示平时成绩"] == 1) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li class="usuallyResults">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应平时成绩占总成绩的权重为：<strong>' + weightTxt.rows[0]["平时成绩"] + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>单次平时成绩</p>';
                                    }
                                    htmlArr[2] += '<input id="txtUsualGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" autocomplete="off"/>';
                                    var tipsTxt = GetUsuallyResultsTipsTxt();
                                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                                    }
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(3) + '时，给定学生对应的“' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩")
                                            + '”；系统将按照“多次平时成绩计算平均分”的方法计算学生的“' + (weightTxt.rows[0]["平时成绩名称"] || "单次平时成绩") + '”，并按照设定的权重计入总成绩</div>';
                                    } else {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(3) + '时，给定学生对应的“单次平时成绩”；系统将按照“多次平时成绩计算平均分”的方法计算学生的“单次平时成绩”，并按照设定的权重计入总成绩</div>';
                                    }
                                    htmlArr[2] += '</li>';
                                }
                            } else if (opeType == 1) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示开题报告成绩"] == 1) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li class="OpenReportGrade">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩") + '占总成绩的权重为：<strong>'
                                            + weightTxt.rows[0]["开题报告成绩"] + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>开题报告成绩</p>';
                                    }
                                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                                    htmlArr[2] += '<input id="txtOpenReportGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" autocomplete="off"/>';
                                    var tipsTxt = GetUsuallyResultsTipsTxt();
                                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                                    }
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(1) + '时，给定学生对应的“' + (weightTxt.rows[0]["开题报告成绩名称"] || "开题报告成绩")
                                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                                    } else {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(1) + '时，给定学生对应的“开题报告成绩”；系统将按照设定的规则，计算相关成绩</div>';
                                    }
                                    htmlArr[2] += '</div></li>';
                                }
                            }
                        }
                        if (currentRole == 3 || currentRole == 11) {
                            if (opeType == 5) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示中期检查成绩"] == 1 && (isShowScore['中期检查成绩评分角色'] == 0
                                    || (isShowScore['中期检查成绩评分角色'] == 1 && currentRole == 3) || (isShowScore['中期检查成绩评分角色'] == 2 && currentRole == 11))) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li class="usuallyResults">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩") + '占总成绩的权重为：<strong>' + weightTxt.rows[0]["中期检查成绩"] + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>中期检查成绩</p>';
                                    }
                                    htmlArr[2] += '<input id="txtMidGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" autocomplete="off"/>';
                                    var tipsTxt = GetUsuallyResultsTipsTxt();
                                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                                    }
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(2) + '时，给定学生对应的“' + (weightTxt.rows[0]["中期检查成绩名称"] || "中期检查成绩")
                                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                                    } else {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(2) + '时，给定学生对应的“中期检查成绩”；系统将按照设定的规则，计算相关成绩</div>';
                                    }
                                    htmlArr[2] += '</li>';
                                }
                            } else if (opeType == 26) {
                                var isShowScore = getUsuallyResultsIsShow();
                                if (isShowScore && isShowScore["不显示初期检查成绩"] == 1 && (isShowScore['初期检查成绩评分角色'] == 0
                                    || (isShowScore['初期检查成绩评分角色'] == 1 && currentRole == 3) || (isShowScore['初期检查成绩评分角色'] == 2 && currentRole == 11))) {
                                    var weightTxt = GetUsuallyResultsWeight(sid, projectId);
                                    htmlArr[2] += '<li class="OpenReportGrade">';
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<p>' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩");
                                        htmlArr[2] += '<span class="statement margl" style="color: #000;">（该学生对应' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩") + '占总成绩的权重为：<strong>'
                                            + weightTxt.rows[0]["初期检查成绩"] + '</strong>）</span></p>';
                                    } else {
                                        htmlArr[2] += '<p>初期检查成绩</p>';
                                    }
                                    htmlArr[2] += '<div class="designTable_radio designTable_radio">';
                                    htmlArr[2] += '<input id="txtEarlyGrade" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" onclick="inputDetailScoreDialog()" autocomplete="off"/>';
                                    var tipsTxt = GetUsuallyResultsTipsTxt();
                                    if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                                        htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                                    }
                                    if (weightTxt && weightTxt.isSuccess && weightTxt.rows && weightTxt.rows.length > 0) {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(10) + '时，给定学生对应的“' + (weightTxt.rows[0]["初期检查成绩名称"] || "初期检查成绩")
                                            + '”；系统将按照设定的规则，计算相关成绩</div>';
                                    } else {
                                        htmlArr[2] += '<div class="statement txt_red">*仅选择“审核通过”时，可以在本次审核' + SetDictionary(10) + '时，给定学生对应的“初期检查成绩”；系统将按照设定的规则，计算相关成绩</div>';
                                    }
                                    htmlArr[2] += '</div></li>';
                                }
                            }
                        } else if (currentRole == 12) {
                            if (opeType == 28) {
                                htmlArr[2] += '<li class="usuallyResults">';
                                htmlArr[2] += '<p>最终成绩</p>';
                                htmlArr[2] += '<input id="txtFinalScore" disabled="disabled" class="" type="text" style="width:80px; height: 30px; margin-left: 5px;" autocomplete="off"/>';
                                var tipsTxt = GetUsuallyResultsTipsTxt();
                                if (tipsTxt && tipsTxt.isSuccess && tipsTxt.dataList && tipsTxt.dataList.length > 0) {
                                    htmlArr[2] += '<span class="statement margl">' + tipsTxt.dataList[0]["提示"] + '</span>';
                                }
                                htmlArr[2] += '<div class="statement txt_red">*仅选择“审核不通过”时，可以在本次审核最终成绩时，给定学生对应的“最终成绩”；</div>';
                                htmlArr[2] += '</li>';
                            }
                        }
                        if (isDesign) {
                            htmlArr[3] += SetDesignTable(designTableModel, "", true);
                            if (showAttachment) {
                                canUpload = true;
                                htmlArr[4] += '<li>';
                                htmlArr[4] += '<p>添加附件：<span class="statement" id="scfj">上传有关审核的附件，上传的文件将以附件的形式显示。支持附件格式为doc，docx，pdf，wps，rar，zip</span></p>';
                                htmlArr[4] += '<input type="text" id="txtFileNameOfAudit" class="easyui-textbox" data-options="width:285,readonly:true" />';
                                htmlArr[4] += '<span id="webUploaderPickOfAudit"></span>';
                                htmlArr[4] += '<div id="divFileProgressContainerOfAudit"></div>';
                                htmlArr[4] += '</li>';
                            };
                        } else {
                            htmlArr[3] += '<li>';
                            htmlArr[3] += '<p>审核意见<span class="writerText margl"> 共输入<i style="color: #f00;"> 0 </i>字符</span><span class="statement margl">请按照学校的要求，在下方输入相关内容，若无内容请填写“无”</span></p>';
                            htmlArr[3] += '<input id="txtAuditSuggest" type="text" class="easyui-textbox" data-options="multiline:true,height:100" style="width: 100%">';
                            htmlArr[3] += '</li>';
                            canUpload = true;
                            htmlArr[4] += '<li>';
                            htmlArr[4] += '<p>添加附件：<span class="statement" id="scfj">上传有关审核的附件，上传的文件将以附件的形式显示。支持附件格式为doc，docx，pdf，wps，rar，zip</span></p>';
                            htmlArr[4] += '<input type="text" id="txtFileNameOfAudit" class="easyui-textbox" data-options="width:285,readonly:true" />';
                            htmlArr[4] += '<span id="webUploaderPickOfAudit"></span>';
                            htmlArr[4] += '<div id="divFileProgressContainerOfAudit"></div>';
                            htmlArr[4] += '</li>';
                        };
                        htmlArr[5] += "<li>";
                        htmlArr[5] += "<input type='hidden' class='hdOpeKeyId' value='" + opeKeyId + "' projectId='" + projectId + "' roleType='" + roleType + "' sort='" + (checkValIsUndefinedOrNull(Sorts) ? "" : JSON.stringify(Sorts)) + "'/>";
                        htmlArr[5] += "<input type='hidden' class='designTableModel' value='" + JSON.stringify(designTableModel) + "' isDesign='" + isDesign + "' />";
                        htmlArr[5] += "<input type='button' id='btnSubmit' value='提交' class='formBtn margt'/></li>";
                        htmlArr[5] += '</ul></div>';
                    };
                };
                if (!checkValIsUndefinedOrNull(Sorts)) {
                    var htmlSort = [htmlArr[0], '', '', '', '', htmlArr[5]];
                    $.each(Sorts, function (i, v) {
                        if (!checkValIsUndefinedOrNull(htmlArr[v["Element"]])) {
                            htmlSort[v["Sort"]] = htmlArr[v["Element"]];
                        }
                    });
                    $.each(htmlSort, function (I, v) {
                        html += v;
                    });
                } else {
                    $.each(htmlArr, function (I, v) {
                        html += v;
                    });
                }
                if (historyId > 0) {
                    $("#audit_history_content_" + historyId).append(html);
                } else {
                    $(audit_options.tableElement).append(html);
                }
                $.parser.parse(audit_options.tableElement); //重新渲染EasyUI
                uParseUEditor(onlyShowRichTextIds);
                if (isDesign) {
                    if (state == 0 && currentRole == roleType) {
                        var richTextId = [];
                        $.each(designTableModel, function (i, v) {
                            if (v['失效'] == 0 && (v['类型'] == 0 || v['类型'] == 1)) {
                                showWriteTextNumber.createNew("CheckDetail", "txt_" + v['ID'] + "_" + v['列名']);
                            } else if (v['失效'] == 0 && v['类型'] == 6) {
                                richTextId.push("txt_" + v['ID'] + "_" + v['列名']);
                            } else if (v['失效'] == 0 && v['类型'] == 2) {
                                radioChangeEvent.bindChange('radio_' + v['ID'] + '_' + v['列名'], designTableModel, '');
                            }
                        });
                        if (richTextId.length > 0) {
                            initUEditor(richTextId);         // 富文本编辑框初始化
                        };
                    }
                } else {
                    if (state == 0 && currentRole == roleType) {
                        showWriteTextNumber.createNew("CheckDetail", "txtAuditSuggest");
                    }
                }
            }
            $(audit_options.tableElement).find("#btnSubmit").off().on('click', audit_submit); // 提交
            $(audit_options.tableElement).find("#linkUpdateAuditLog").off().on("click", audit_update); // 修改
            $(audit_options.tableElement).find("#linkRecheck").off().on("click", audit_recheck); // 修该审核状态
            $(audit_options.tableElement).find("#linkResetLastAuditState").off().on("click", audit_resetLastAuditState); // 修改最终审核状态
            $(audit_options.tableElement).find("input[name=rdoAudit]").off().on("click", isUsuallyResultsShow); // 平时成绩
            $(audit_options.tableElement).find(".gxf_designTable_history .history").off().on("click", auditHistoryDtetails); // 历史记录

            // co_audit.
            $(audit_options.tableElement).find(".gxf_audit_history_box .title .historyShrinkage").off().on("click", function () {
                var index = $(this).attr("data-index");
                if ($(this).text().indexOf("收起") >= 0) {
                    $(this).text("展开>>");
                    $($(".gxf_audit_history_box>li")[index]).find(".content").stop(false, false).hide(400);
                } else {
                    $(this).text("收起>>");
                    $($(".gxf_audit_history_box>li")[index]).find(".content").stop(false, false).show(400);
                }
            });
        };

        if (canUpload) {
            //fileQueued_Audit
            //创建上传实例
            audit_submitUploader = createWebuploader({
                pick: {
                    id: "#webUploaderPickOfAudit",
                    innerHTML: "浏览",
                    multiple: false
                },
                txtFileName: "#txtFileNameOfAudit",
                uploadTarget: "#divFileProgressContainerOfAudit",
                successCallback: function (data, params) {
                    if (data.isSuccess) {
                        var url = audit_options.submitUrl.split("?")[0];
                        var action = audit_options.submitUrl.split("?")[1].split("=")[1];
                        auditUploadSuccessFun(url, action, params, 1);
                    } else {
                        myMessage(data.message);
                    }
                }
            });
        }
    };

    /**
     * 获取审核状态的注释信息
     * @param formSorts {Array} 审核元素排序数据
     * @param element {Number} 审核元素序号
     * */
    var audit_getFormSortTipsMsg = function (formSorts, element) {
        var msg = "";
        try {
            element = +element;
            if (!$.isArray(formSorts) && !checkValIsUndefinedOrNull(formSorts)) {
                formSorts = JSON.parse(formSorts);
            }
            if (formSorts == undefined || formSorts == null || !$.isArray(formSorts)) {
                return "";
            }
            $.each(formSorts, function (index, item) {
                if (item["Element"] == element) {
                    msg = item["TipsMessage"] || "";
                    return false;
                }
            });
        } catch (ex) {
            console.error(ex);
        }
        return msg;
    };

    // 平时成绩是否可以录入
    var isUsuallyResultsShow = function () {
        var $this = $(this);
        var $usuallyResultsHtml = $this.parent().parent().siblings(".usuallyResults,.OpenReportGrade");
        if ($usuallyResultsHtml.length > 0) {
            if ($this.attr("id") == 'rdoPass') {
                $('#txtOpenReportGrade,#txtEarlyGrade,#txtMidGrade,#txtUsualGrade').prop({ 'disabled': false });
                $('#txtFinalScore').prop({ 'value': "", 'disabled': true });
            } else if ($this.attr("id") == 'rdoUnPass') {
                $('#txtOpenReportGrade,#txtEarlyGrade,#txtMidGrade,#txtUsualGrade').prop({ 'value': "", 'disabled': true });
                $('#txtFinalScore').prop({ 'disabled': false });
            }
        }
    };

    var auditHistoryList = function (type) {
        var list = [];
        $.ajax({
            url: audit_options.historyUrl,
            type: "post",
            data: audit_options.historyParams,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data && data.isSuccess) {
                    if (type == 2) {
                        if (data.dataList && data.dataList.OperationLogs && data.dataList.OperationLogs.length > 0) {
                            list = data.dataList
                        }
                    } else {
                        if (data.rows && data.rows.length > 1) {
                            list = data.rows;
                        }
                    }
                };
            },
            error: function (err) {
                if (console && console.log) {
                    console.log(err.statusText);
                };
            }
        });
        return list;
    };

    var auditHistoryDetails = function (id) {
        audit_options.queryParams["isHistory"] = 1;
        audit_options.queryParams["id"] = id;
        $.ajax({
            url: audit_options.queryUrl,
            type: "post",
            data: audit_options.queryParams,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data && data.isSuccess && data.dataList) {
                    audit_parse(data.dataList, id);
                };
            },
            error: function (err) {
                console.log(err);
            }
        });
    };

    /**
     * 查询审核信息
     */
    var audit_query = function () {
        var projectId = audit_options.projectId;
        $.ajax({
            url: audit_options.queryUrl,
            type: "post",
            data: audit_options.queryParams,
            dataType: "json",
            success: function (data) {
                if (data) {
                    if (data.isSuccess) {
                        audit_parse(data.dataList);
                        if (detail_callback) {
                            detail_callback.call(this, data);
                        };
                    } else {
                        myMessage(data.message);
                    };
                };
            },
            error: function (err) {
                if (console && console.log) {
                    console.log(err.statusText);
                };
            },
            complete: function () {
                // 审核历史记录
                if (audit_options.queryParams["isHistory"] != 1 && audit_options["historyShow"] == 1) {
                    var historylist = auditHistoryList(audit_options["historyParams"]['history']);
                    if (audit_options["historyParams"]['history'] == 2) {
                        var html = '<ul class="gxf_audit_history_box">';
                        html += '<li><div class="title"><p>';
                        html += '<span class="fontWeigt"><i class="hisTitle_icon"></i>历史审核记录</span>';
                        html += '<span class="statement margl">展示学生提交的历史文档的审核记录，方便您比较新提交的文档是否按照之前的审核意见进行了修改</span>';
                        html += '<a href="javascript:void(0);" data-index="0" class="margl listA historyShrinkage">收起<<</a>';
                        html += '</div><div id="audit_history_content_1" class="content"></div>';
                        $(audit_options.tableElement).append(html);
                        audit_parse(historylist, '1', 2);
                    } else {
                        if (historylist.length > 0) {
                            var idx = 0;
                            for (var i = historylist.length - 2; i >= 0; i--) {
                                var html = '<ul class="gxf_audit_history_box">';
                                html += '<li><div class="title"><p>';
                                html += '<span class="fontWeigt"><i class="hisTitle_icon"></i>历史审核记录</span>';
                                html += '<span class="statement margl">展示学生提交的历史文档的审核记录，方便您比较新提交的文档是否按照之前的审核意见进行了修改</span>';
                                html += '<a href="javascript:void(0);" data-index="' + (idx++) + '" class="margl listA historyShrinkage">收起<<</a>';
                                html += '</div><div id="audit_history_content_' + historylist[i]["文件ID"] + '" class="content"></div>';
                                $(audit_options.tableElement).append(html);

                                auditHistoryDetails(historylist[i]["文件ID"]);
                            }
                        }
                    }
                }
            }
        });
    };

    /**
     * 绑定
     * @param {} options 参数集合
     * @param {callback} auditCallback 审核成功后回调函数
     * @param {callback} detailCallback 获取详情后回调函数
     * @returns {} 
     */
    audit.bind = function (options, auditCallback, detailCallback) {
        audit_options = options || {};
        audit_callback = auditCallback;
        detail_callback = detailCallback;
        opeType = -1;
        audit_submitUploader = null;
        audit_updateUploader = null;
        audit_resetLastAuditStateUploader = null;
        audit_query();
    }

})(co_audit || (co_audit = {}));


//获取平时成绩评分权重
function GetUsuallyResultsWeight(sid, projectId) {
    var params;
    $.ajax({
        url: "../Handler/ReviewHandler.ashx",
        type: "post",
        dataType: "json",
        data: {
            "action": "GetStudentScoringWeight",
            "sid": sid,
            "projectId": projectId
        },
        async: false,
        success: function (data) {
            params = data;
        },
        error: function (err) {
            console.log(err);
        }
    });
    return params;
};

// 获取平时成绩提示
function GetUsuallyResultsTipsTxt() {
    var params;
    $.ajax({
        url: "../Handler/ReviewHandler.ashx",
        type: "post",
        dataType: "json",
        data: {
            "action": "GetGetScoreRankToolTipsText"
        },
        async: false,
        success: function (data) {
            params = data;
        },
        error: function (err) {
            console.log(err);
        }
    });
    return params;
};

// 获取平时成绩是否显示
function getUsuallyResultsIsShow() {
    var params;
    $.ajax({
        url: "../Handler/ReviewHandler.ashx",
        type: "post",
        dataType: "json",
        data: {
            "action": "GetReviewColumn"
        },
        async: false,
        success: function (data) {
            if (data.isSuccess && data.dataList && data.dataList.length > 0) {
                params = data.dataList[0]
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
    return params;
};

// 文件上传成功后fun
function auditUploadSuccessFun(url, action, data, auditType) {
    if (checkValIsUndefinedOrNull(url) || checkValIsUndefinedOrNull(data)) {
        myMessage("出错了！");
        return;
    }
    var data = data || {};
    data["action"] = action;
    $.ajax({
        url: url,
        data: data,
        dataType: "json",
        type: "POST",
        beforeSend: function () {
            open_loading();
        },
        success: function (data) {
            if (data.isSuccess) {
                myMessage(data.message, function () {
                    if (auditType == 1) {
                        var tabTitle = getCurrentTabTitle(); //当前tabTitle
                        reloadTable(getUrlParam("prevTitle"), 'list');//刷新前一个页面
                        closeTab(tabTitle);//关闭当前页
                    } else if (auditType == 2) {
                        var tab = getCurrentTab();
                        reloadTable(getUrlParam("prevTitle"), 'list');//刷新前一个页面
                        refreshTab2(tab);//刷新当前页
                    } else {
                        refreshTab2(getCurrentTab());//刷新当前页
                    }
                }, true);
            } else {
                myMessage(data.message);
            }
        },
        error: function (err) {
            console.log(err)
        },
        complete: function () {
            close_loading();
        }
    });
};