// 退出到登录页
function QuitTabsToLogin(message, successCallback) {
    if ($("#quitTipsbox").length <= 0) {
        $("body").append('<div id="quitTipsbox" class="easyui-dialog" style="text-align:center; padding: 10px;width:400px;height:200px" data-options="closed:true,modal:true"></div>');
    }
    if ($('#quitTipsbox').text()) {
        return;
    }
    $('#quitTipsbox').html(message).dialog({
        closable: false,
        title: '提示',
        buttons: [{
            text: '确定',
            handler: function () {
                successCallback();
                $("#quitTipsbox").dialog("close");
            }
        }]
    }).dialog("open").window('center');
};

// 消息提示框
function MyMessage(message, successCallback, disableBtn, selfClosing) {
    if ($("#myMessageTipsbox").length <= 0) {
        $('body').append('<div id="myMessageTipsbox" class="easyui-dialog" style="text-align:center; padding: 10px;width:420px;height:220px;" data-options="closed:true,modal:true"></div>');
    }
    if ($('#myMessageTipsbox').text() == message) {
        return false;
    }
    var Btn;
    if (disableBtn) {
        Btn = disableBtn;
    } else {
        Btn = $("input:button.formBtn,input:button.clearBtn");
    }
    Btn.prop("disabled", "disabled");
    if (selfClosing) {
        $('#myMessageTipsbox').html(message + '<div class="txt_red" style="position: absolute; bottom: 1px; left: 150px;">本提示框1秒后自动关闭</div>').dialog({ closable: false, title: '提示' }).dialog("open").window('center');
        window.setTimeout(function () {
            Btn.prop("disabled", false);
            $("#myMessageTipsbox").dialog("close");
            $("#myMessageTipsbox").remove();
            if (!checkValIsUndefinedOrNull(successCallback) && typeof (successCallback) == 'function') {
                successCallback();
            }
        }, 1000);
    } else {
        $('#myMessageTipsbox').html(message).dialog({
            closable: false,
            title: '提示',
            buttons: [{
                text: '确定',
                handler: function () {
                    Btn.prop("disabled", false);
                    $("#myMessageTipsbox").dialog("close");
                    $("#myMessageTipsbox").remove();
                    if (!checkValIsUndefinedOrNull(successCallback) && typeof (successCallback) == 'function') {
                        successCallback();
                    }
                }
            }]
        }).dialog("open").window('center');
    }
};