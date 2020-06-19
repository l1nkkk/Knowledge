var outputInterval; // 倒计时定时器
function showOutputList() {
    var box = $("#output_div");
    if (box && box.length <= 0) {
        box = $('<div id="output_div" class="easyui-dialog" style="width:850px;height:450px; padding: 0 8px;" data-options="closed:true,modal:true">'
            //+ '<div style="overflow-x:hidden; overflow-y:auto !important; height: 413px;">'
            + '<p id="exportDoc" class="clearfix" style="line-height: 40px;">提示：导出文档的下载有效期是96个小时，过期需要重新生成导出文档后才能下载！'
            + '</p>'
            + '<div><table id="output_list"></table></div>'
            //+ '</div>'
            + '</div>');
        $("body").append(box);
    };
    box.dialog({ "title": "文档导出列表" }).dialog({
        onClose: function () {
            clearInterval(outputInterval);
        }
    }).dialog("open").window('center');
    getTableListForExport("exportDoc");
};

// 导出弹框列表
function getTableListForExport(tableName) {
    if (tableName == "exportDoc") {
        var list = $("#output_list");
        var url = "../Handler/WordHandler.ashx";
        var paramsData = { action: "GetExportWordTask" };
        var columnData = [[
            { field: '任务名称', align: 'center', title: '任务名称', width: 50 },
            { field: '文件类型Text', align: 'center', title: '文件类型', width: 30 },
            { field: '提交时间', align: 'center', title: '提交时间', width: 30 },
            {
                field: '处理时间', align: 'center', title: '完成时间', width: 30,
                formatter: function (value, row, index) {
                    return ((row["处理结果"] < 0 || row["处理结果"] == 2) ? row["处理时间"] : "");
                }
            },
            {
                field: '处理结果Text', align: 'center', title: '处理结果', width: 30,
                formatter: function (value, row, index) {
                    return (row["处理结果Text"] || "等待处理");
                }
            },
            {
                field: '下载文件名', title: '下载', align: 'center', width: 30,
                formatter: function (value, row, index) {
                    var ret = "";
                    if (!checkValIsUndefinedOrNull(value)) {
                        ret += '<a class="listA" href="' + value + '">下载</a>';
                    }
                    var taskResult = row["处理结果"] || 0;
                    if (taskResult >= 0 && taskResult != 2) {
                        ret += '<a class="listA" href="javascript:cancelTask(\'' + tableName + '\',' + row["ID"] + ',\'' + row["任务名称"] + '\')">取消</a>';
                    }
                    return ret;
                }
            }
        ]];
    } else if (tableName == "exportReport") {
        var list = $("#download_list");
        var url = "../Handler/ReportFileHandler.ashx";
        var paramsData = { action: "GetExportReportTask" };
        var columnData = [[
            { field: '报告单名', align: 'center', title: '报告单', width: 50 },
            { field: '提交时间', align: 'center', title: '提交时间', width: 30 },
            {
                field: '处理结束时间', align: 'center', title: '完成时间', width: 30,
                formatter: function (value, row, index) {
                    return ((row["处理结果"] < 0 || row["处理结果"] == 2) ? row["处理时间"] : "");
                }
            },
            {
                field: '处理结果Text', align: 'center', title: '处理结果', width: 30,
                formatter: function (value, row, index) {
                    return (row["处理结果Text"] || "等待处理");
                }
            },
            {
                field: '下载文件名', title: '下载', align: 'center', width: 30,
                formatter: function (value, row, index) {
                    return (checkValIsUndefinedOrNull(value)) ? "" : ('<a class="listA" href="' + value + '">下载</a>');
                }
            }
        ]];
    }
    var idField = "下载文件名";

    GteTable(list, url, columnData, paramsData, idField).done(function (data) {
        if (data.isSuccess && data.rows && data.rows.length > 0) {
            var isOpen = false;
            $.each(data.rows, function (i, v) {
                var taskResult = v["处理结果"] || 0;
                if (taskResult >= 0 && taskResult != 2) {
                    isOpen = true;
                    return false;
                }
            });
            if (isOpen) {
                countDown(30, tableName);
            }
        }
    });
};

// 是否显示导出按钮
function showButtonBox(type, buttonBoxId) {
    $.ajax({
        url: "../Handler/WordHandler.ashx",
        data: { action: "HasTemplate", lx: type },
        dataType: "json",
        type: "POST",
        success: function (data) {
            if (data.isSuccess == true) {
                $("#" + buttonBoxId).show();
            } else {
                $("#" + buttonBoxId).hide();
            };
        }
    });
}

// 导出报告单
function showDownloadList() {
    var box = $("#download_div");
    if (box && box.length <= 0) {
        box = $('<div id="download_div" class="easyui-dialog" style="width:850px;height:450px; padding: 0 8px;" data-options="closed:true,modal:true">'
            + '<p id="exportReport" class="clearfix" style="line-height: 40px;">'
            + '<span>提示：压缩包的解压密码为您登录本系统的<span class="txt_red">账号</span>，如果账号中含有字母，请用小写字母！</span>'
            + '</p>'
            + '<div><table id="download_list"></table></div>'
            + '</div>');

        $("body").append(box);
    };
    box.dialog({ "title": "报告单导出列表" }).dialog({
        onClose: function () {
            clearInterval(outputInterval);
        }
    }).dialog("open").window('center');
    getTableListForExport("exportReport");
};

// 倒计时 s表示秒数
function countDown(s, id) {
    if ($("#countDownBox").length > 0) {
        clearInterval(outputInterval);
        $("#countDownBox").remove();
    }
    var html = '<div id="countDownBox" style="width: 230px; height: 30px; float: right;">'
        + '导出处理中，30秒后本页面自动刷新'
        + '<div id="countDownBox" style="width: 30px; height: 30px; float: right; margin-top: 5px;">'
        + '<div class="game_time" style = "width: 15px; height: 15px; position: relative; text-align: center;">'
        + '<div class="hold" style="width: 30px; height: 30px; position: absolute; z-index: 1;">'
        + '<div class="pie pie1" style="width: 30px; height: 30px; background-color: blue; border-radius: 10px; position: absolute; clip: rect(0px,30px,30px,15px); -o-transform: rotate(0deg);  -moz-transform: rotate(0deg); -webkit-transform: rotate(0deg); background-color: #fff;"></div>'
        + '</div>'
        + '<div class="hold" style="width: 30px; height: 30px; position: absolute; z-index: 1;">'
        + '<div class="pie pie2" style="width: 30px; height: 30px; background-color: blue; border-radius: 30px; position: absolute; clip: rect(0px,15px,30px,0px);   -o-transform: rotate(0deg); -moz-transform: rotate(0deg); -webkit-transform: rotate(0deg); background-color: #fff;"></div>'
        + '</div>'
        + '<div class="bg" style="width: 30px; height: 30px; border-radius: 30px; position: absolute; background-color: #22b3b8;"></div>'
        + '<div class="time" style="width: 24px; height: 24px; color: #f00; margin: 3px; background-color: #f0f9fe; border-radius: 12px; position: absolute; z-index: 1; text-align: center; line-height: 24px; font-size: 16px;"></div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $("#" + id).append(html);

    var rotate = 0; // 总度数   
    var total_time = s + 1;
    var MS = total_time * 1000; // 定义需要多少秒跑一圈   
    var loop_time = 10; // 每秒钟调用次数   
    var totle = 360; // 每一圈的度数
    var interval_time = 1000 / loop_time;

    $(".pie2,.pie1").css({
        "-o-transform": "rotate(" + 0 + "deg)",
        "-moz-transform": "rotate(" + 0 + "deg)",
        "-webkit-transform": "rotate(" + 0 + "deg)",
    });
    $(".pie2").css("background", "#fff");


    outputInterval = setInterval(function () {
        if (MS == 0) {
            clearInterval(outputInterval);
            rotate = 0;
            MS = 60;
            $("#countDownBox").remove();
            getTableListForExport(id);
            return false;
        }
        var interval_time = 1000 / loop_time;
        MS = MS - interval_time;
        $(".time").html(Math.floor(MS / 1000));

        rotate = rotate + totle / (total_time * loop_time);
        if (rotate <= totle / 2) {
            $(".pie1").css({
                "-o-transform": "rotate(" + rotate + "deg)",
                "-moz-transform": "rotate(" + rotate + "deg)",
                "-webkit-transform": "rotate(" + rotate + "deg)"
            });
        } else {
            $(".pie2").css({
                backgroundColor: '#22b3b8',
                "-o-transform": "rotate(" + rotate + "deg)",
                "-moz-transform": "rotate(" + rotate + "deg)",
                "-webkit-transform": "rotate(" + rotate + "deg)"
            });
        }
    }, interval_time);
};

//取消导出任务
function cancelTask(tableName, ID, tips) {
    var box = $("#download_delmessage_box");
    if (box && box.length <= 0) {
        $("body").append('<div id="download_delmessage_box" class="easyui - dialog" style=" text - align: center; width: 400px; height: 200px; padding: 10px; word - wrap: break-word; " data-options="closed: true, modal: true"></div>');
    };

    $("#download_delmessage_box").text("你确定要取消" + (tableName == 'exportReport' ? "报告单" : "任务") + "（ " + tips + " ）吗？").dialog({
        title: '提示',
        buttons: [{
            text: '确定', handler: function () {
                $.ajax({
                    url: "../Handler/WordHandler.ashx",
                    type: "post",
                    data: {
                        "action": 'CancelExportTask',
                        "taskId": ID
                    },
                    dataType: "json",
                    beforeSend: function () {
                        open_loading();
                    },
                    success: function (data) {
                        if (data.isSuccess) {
                            myMessage(data.message, function () {
                                getTableListForExport(tableName);
                                $("#download_delmessage_box").dialog("close");
                            });
                        } else {
                            myMessage(data.message)
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    complete: function () {
                        close_loading();
                    }
                });
            }
        },
        {
            text: '取消', handler: function () {
                $("#download_delmessage_box").dialog("close");
            }
        }]
    }).dialog("open").window('center');
};
