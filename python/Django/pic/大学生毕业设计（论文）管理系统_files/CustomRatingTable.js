//自定义评分表处理开始
var requestDataUrl = "../Handler/CustomRatingTable.ashx";
function GetcustomTableId() {
    var rs = false;
    $.ajax({
        url: requestDataUrl,
        data: {
            "action": "GetCustomTableId",
            projectId: projectId,
            ScoreType: ScoreType//因为有多种成绩，需要此参数区别
        },
        dataType: "json",
        async: false,//同步处理
        type: "POST",
        success: function (data) {
            if (data.isSuccess == true) {
                rs = true;
            };
        }
    });
    return rs;
};
//打开对话框，获取数据
function inputDetailScoreDialog(oper) {
    if (!GetcustomTableId()) { return; };
    $("#div_InputScoreDialog").dialog({ title: "成绩录入" });
    $("#div_InputScoreDialog").dialog('open').window('center');

    getDetailScoreInfo(oper);
};

/**
获取打分表仅查看lookDetailScoreInfo()
open:空为提交,'select'隐藏提交按钮
tid：教师的tid
*/
function lookDetailScoreInfo(open, tid) {
    $("#div_scoreDetail").empty();//清空指定的区域
    var data = {
        action: "GetDetailScoreInfo",
        ScoreType: ScoreType,//因为教师有两种成绩，需要此参数区别
        tid: tid,
        open: open
    };
    if (!checkValIsUndefinedOrNull(sid)) {
        data["sId"] = sid;
    };
    if (!checkValIsUndefinedOrNull(projectId)) {
        data["projectId"] = projectId;
    };
    $.ajax({
        type: "POST",
        data: data,
        url: requestDataUrl,
        dataType: "json",
        success: function (result) {
            if (result == null) {
                myMessage("出现异常");
                return;
            };
            $("#div_InputScoreDialog").dialog({ title: "成绩录入" }).dialog('open').window('center');//弹框打开
          
            $("#divBtnList").show();//确定关闭按钮，框显示
            $("#div_scoreDetail").append(result.message);//写入HTML
             //console.log(result.message);
            var trClass = "tr2";
            $.each($("#div_scoreDetail table tr[class!='tr1']"), function (index, item) {
                if ($(this).attr("class") != "tr4") {
                    var prevClass = $(this).prev().attr("class");
                    if (prevClass != undefined && prevClass == "tr1") {
                        trClass = "tr2";
                    } else if (prevClass != undefined && prevClass == "tr2") {
                        trClass = "tr2";
                    } else if (prevClass != undefined) {
                        trClass = "tr2";
                    };
                    $(this).attr("class", trClass);
                };
            });
            if (open == "select") {
                $("#table_scoreDetail :text").attr("disabled", "disabled");
                $("#btn_sureInputDetailScore").hide();
            };


            $('#div_scoreDetail .gxf_teacher_tabs>ul>li>a').click(function () {
                $(this).addClass("active").parent().siblings().find("a").removeClass("active");
                var arr = $("#table_" + $(this).attr("data-val") + " .rev-inp");
                var a = 0;
                $.each(arr, function (i, v) {
                    a += v.value * 1000000;
                    $("#real_sum").text(!isNaN(a) ? a / 1000000 : ' 请输入正确的评分！')
                });
                //实时显示各tab的 输入的分数总和。
                $("#table_" + $(this).attr("data-val") + " .rev-inp").keyup(function () {
                    var sum = 0;
                    $.each(arr, function (i, v) {
                        sum += v.value * 1000000;
                        $("#real_sum").text(!isNaN(sum) ? sum / 1000000 : ' 请输入正确的评分！')
                    });
                });
            });
            $('.gxf_teacher_tabs>ul>li').eq(0).find("a").click();
            //$('.tab-lef input').eq(0).click();
        }
    });

};

//获取HTML
function getDetailScoreInfo(open) {
    $("#div_scoreDetail").empty();//清空指定写入区域
    var data = {
        action: "GetDetailScoreInfo",
        ScoreType: ScoreType//因为教师有两种成绩，需要此参数区别
        //tableId: customTableId,
        //tableName: tableName
    };
    if (!checkValIsUndefinedOrNull(sid)) {
        data["sId"] = sid;
    };
    if (!checkValIsUndefinedOrNull(projectId)) {
        data["projectId"] = projectId;
    };
    $.ajax({
        type: "POST",
        data: data,
        url: requestDataUrl,
        dataType: "json",
        success: function (result) {
            if (result == null) {
                myMessage("出现异常");
                return;
            };
            $("#divBtnList").show();
            $("#div_scoreDetail").append(result.message);//写入HTML
            //console.log('给我的数据是' + result.message);
           
            var trClass = "tr2";
            $.each($("#div_scoreDetail table tr[class!='tr1']"), function (index, item) { //循环的是input的tr
                if ($(this).attr("class") != "tr4") {
                    var prevClass = $(this).prev().attr("class");

                    if (prevClass != undefined && prevClass == "tr1") {
                        trClass = "tr2";
                    } else if (prevClass != undefined && prevClass == "tr2") {
                        trClass = "tr2";
                    } else if (prevClass != undefined) {
                        trClass = "tr2";
                    };
                    $(this).attr("class", trClass);
                };
            });

            if (open == "select") {
                $("#table_scoreDetail :text").attr("disabled", "disabled");
                $("#btn_sureInputDetailScore").hide();
            };            

            $('#div_scoreDetail .gxf_teacher_tabs>ul>li>a').click(function () {
                $(this).addClass("active").parent().siblings().find("a").removeClass("active");
                var arr = $("#table_" + $(this).attr("data-val") + " .rev-inp");
                var a = 0;
                $.each(arr, function (i, v) {
                    a += v.value * 1000000;
                    $("#real_sum").text(!isNaN(a) ? a / 1000000 : ' 请输入正确的评分！')
                });
                //实时显示各tab的 输入的分数总和。
                $("#table_" + $(this).attr("data-val") + " .rev-inp").keyup(function () {
                    var sum = 0;
                    $.each(arr, function (i, v) {
                        sum += v.value * 1000000;
                        $("#real_sum").text(!isNaN(sum) ? sum / 1000000 : ' 请输入正确的评分！')
                    });
                });
            });
            //注释代码：默认不在选中第一个表格
            //如果只有一个表格，选中点击
            if ($('.gxf_teacher_tabs>ul>li').length == 1) {
                $('.gxf_teacher_tabs>ul>li').eq(0).find("a").click();
            } else {
                $('.gxf_teacher_tabs>ul>li>a.active').click();
            }
        }
    });

};
//提交打分表
function submitDetailScore() {
    var customTableId = null;
    $.each($('.gxf_teacher_tabs>ul>li'), function (i, v) {
        if ($(v).find("a").hasClass("active")) {
            customTableId = $(v).find("a").attr("data-val");
        }
    });
    //var customTableId = $('input:radio[name="DataTableID"]:checked').val();//获取表格ID
    if (customTableId == null) {
        myMessage("请选中一个表格!");
        return;
    };
    var dataTableId = $("#table_" + customTableId + " :text");
    var pms = {
        action: "SubmitDetailScore",
        tableId: customTableId,//获取表格ID
        roleType: role,
        ScoreType: ScoreType//成绩类型,因为教师有两种成绩，需要此参数区别
    };
    if (!checkValIsUndefinedOrNull(sid)) {
        pms["sId"] = sid;
    };
    if (!checkValIsUndefinedOrNull(projectId)) {
        pms["projectId"] = projectId;
    };
    var sum = 0.0;
    var isSubmit = true;
    $.each(dataTableId, function (index, item) {
        var parentTr = $(this).parent().parent();
        var text = parentTr.children("td:eq(0)").text();
        if (this.value == undefined || this.value.length == 0) {
            myMessage(text + "行的分数不能为空");
            isSubmit = false;
            return false;
        };
        if (!verifyScore(this.value)) {
            myMessage(text + "行的分数最多为1位小数");
            isSubmit = false;
            return false;
        };
        if (this.value < 0) {
            myMessage(text + " 行的分数不能小于0");
            isSubmit = false;
            return false;
        };
        var maxVal = parseFloat(parentTr.find("td:last").children("input[type='hidden']").val());
        if (this.value > maxVal) {
            myMessage(text + "行的分数不能大于" + maxVal);
            isSubmit = false;
            return false;
        };
        sum += parseFloat(this.value);
        pms["" + this.name + ""] = this.value;
    });
    if (!isSubmit)
        return;
    $.ajax({
        type: "POST",
        data: pms,
        url: requestDataUrl,
        dataType: "json",
        success: function (result) {
            if (result == null) {
                myMessage("出现网络异常,请稍后重新提交");
                return;
            };
            if (result.isSuccess) {
                //判断角色
                if (role == '3') {//指导教师
                    if (ScoreType == "1") {
                        $("#txt_ZhiDaoChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "6") {
                        $("#txt_ZhongQiChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "4") {
                        $("#txt_DaBian_teacherChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "2") {
                        $("#txt_ZhuanyeChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "9") {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    } else if (ScoreType == '7') {
                        $("#txt_GuiFanChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "13") {
                        $("#txtOpenReportGrade").val(sum.toFixed(1));
                    } else if (ScoreType == 10) {
                        $("#txtUsualGrade").val(sum.toFixed(1));
                    } else if (ScoreType == 14) {
                        $("#txtEarlyGrade").val(sum.toFixed(1));
                    } else if (ScoreType == 15) {
                        $("#txtMidGrade").val(sum.toFixed(1));
                    }
                } else if (role == '4') {//专业负责人
                    if (ScoreType == "2") {
                        $("#txt_ZhuanyeChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "7") {
                        $("#txt_GuiFanChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "4") {
                        $("#txt_DaBian_teacherChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "9") {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    };
                } else if (role == '5') {//教学秘书
                    if (ScoreType == "4") {
                        $("#txt_DaBian_teacherChengJi").val(sum.toFixed(1));
                    }
                    else if (ScoreType == "7") {
                        $("#txt_GuiFanChengJi").val(sum.toFixed(1));
                    } 
                    else if (ScoreType == "9") {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    };
                } else if (role == '9') {//评阅专家
                    if (ScoreType == "3") {
                        $("#txt_PyzjChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "12" || ScoreType == "11") {
                        $("#txt_PyzjLwChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "4") {
                        $("#txt_DaBian_teacherChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "9") {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    };
                } else if (role == '7') {//答辩录入员
                    if (ScoreType == "4") {
                        $("#txt_DaBianChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "9") {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    };
                } else if (role == '6') {//院长
                    if (ScoreType == "4") {
                        $("#txt_DaBian_teacherChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == '9') {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    }
                } else if (role == '10') {//第二导师
                    if (ScoreType == "4") {
                        $("#txt_DaBian_teacherChengJi").val(sum.toFixed(1));
                    } else if (ScoreType == "9") {
                        $("#openAnswerScore").val(sum.toFixed(1));
                    }
                } else if (role == 11) {
                    if (ScoreType == 14) {
                        $("#txtEarlyGrade").val(sum.toFixed(1));
                    } else if (ScoreType == 15) {
                        $("#txtMidGrade").val(sum.toFixed(1));
                    }
                }
            };
            myMessage(result.message, function () {
                closeInputDetailScoreDialog();
            }, result.isSuccess);
        },
        error: function () {
            myMessage("出现错误");
            return;
        }
    });
};
//关闭
function closeInputDetailScoreDialog() {
    $("#divBtnList").hide();
    $("#btn_sureInputDetailScore").show();
    $("#div_InputScoreDialog :text").val("");
    $("#div_InputScoreDialog").dialog("close");
};
//切换自定义表格
function SelectTab(ID) {
    $("#div_info table").hide();
    $("#" + 'table_' + ID).show();
};
//自定义评分表处理结束