// 添加ajax全局事件处理。
//var jquery_extend_resend = 0;
(function () {

    /**
     * 重新发送AJAX
     * @param {any} e
     * @param {any} xhr
     * @param {any} opts
     */
    var reSendAjax = function (e, xhr, opts) {
        var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
        try {
            var re_url = opts.url;
            var re_data = urlParams2Obj(opts.data);
            if (getBrowserInfo) {
                re_data["browserInfo"] = getBrowserInfo();
            }
            re_data["jquery_extend_resend"] = 1;
            $.ajax({
                url: re_url,
                type: opts.type,
                data: re_data,
                dataType: opts.dataType
            }).done(function (data) {
                dtd.resolve(data); // 改变Deferred对象的执行状态，触发done()
            }).fail(function (err) {
                if (console && console.error) {
                    console.error(err);
                }
                dtd.reject(err);
            });
        } catch (ex) {
            if (console && console.error) {
                console.error(ex);
            }
            dtd.reject(ex);
        }
        return dtd.promise(); // 返回promise对象
    };

    /**
     * 重新发送请求，带上自动登录信息
     * @param {any} e
     * @param {any} xhr
     * @param {any} opts
     */
    var redirectUrl = function (e, xhr, opts) {
        var retData = xhr.responseJSON;
        if (retData && typeof (retData.isSuccess) == "boolean") {
            var tempdata = urlParams2Obj(opts.data);
            var jquery_extend_resend = tempdata.jquery_extend_resend || "0";
            if (jquery_extend_resend == 1) {
                if (opts.done) {
                    opts.done(retData);
                } else if (opts.success) {
                    opts.success(retData);
                }
                if (opts.always) {
                    opts.always();
                } else if (opts.complete) {
                    opts.complete();
                }
            }
            if (!retData.isSuccess) {
                //999没有登录、998没有毕设资格、997重复登录跳转、984用户信息被修改，唯一标识清空
                var errCode = +retData.errorCode;
                if (errCode == 999 ||
                    errCode == 998 ||
                    errCode == 997 ||
                    errCode == 984) {
                    if (errCode == 999 && jquery_extend_resend == 0) {
                        var re_e = e;
                        var re_xhr = xhr;
                        var re_opts = opts;
                        $.when(reSendAjax(e, xhr, opts))
                            .then(function(redata) {
                                re_xhr.responseJSON = redata;
                                re_xhr.responseText = JSON.stringify(redata);

                                tempdata["jquery_extend_resend"] = 1;
                                var optsDataStr = "";
                                for (var opKey in tempdata) {
                                    if (tempdata.hasOwnProperty(opKey)) {
                                        optsDataStr = optsDataStr + '&' + '' + opKey + '=' + tempdata[opKey] + '';
                                    }
                                }
                                re_opts.data = optsDataStr.substr(1);
                                redirectUrl(re_e, re_xhr, re_opts);
                            });
                    } else {
                        var loginUrl = "/Login.html";
                        if (retData.objData && !checkValIsUndefinedOrNull(retData.objData.casLoginoutUrl)) {
                            loginUrl = retData.objData.casLoginoutUrl;
                        } 
                        quitTabsToLogin(retData.message, successCallback);
                        function successCallback() {
                            if (self.frameElement && self.frameElement.tagName == "IFRAME") {
                                window.parent.location.href = loginUrl;
                            } else {
                                window.location.href = loginUrl;
                            }
                        };
                        
                        return;
                    }
                }
            }
        }
    };

    /**
     * 添加请求参数
     * @param {any} opts
     * @param {any} name
     * @param {any} value
     */
    var addPostDataStr = function (opts, name, value) {
        try {
            if ((opts.data || "").indexOf(name) >= 0 || (opts.url || "").indexOf(name) >= 0) {
                return;
            }

            if (checkValIsUndefinedOrNull(value)) {
                value = "";
            }
            var postDataStr = opts.data || "";
            if (checkValIsUndefinedOrNull(postDataStr)) {
                postDataStr = name + "=" + value;
            } else {
                postDataStr += "&" + name + "=" + value;
            }
            opts.data = postDataStr;
        } catch (ex) {
            if (console && console.error) {
                console.error(ex);
            }
        }
    };

    var isShowLoading = 0; //是否显示加载等待弹窗
    $(document).ajaxStart(function (e) {
        //console.log("start");
    }).ajaxSend(function (e, xhr, opts) {
        //console.log("send");
        var optsData = urlParams2Obj(opts.data);
        if (optsData && optsData.hasOwnProperty("isShowLoading")) {
            isShowLoading = optsData["isShowLoading"];
        }
        if (isShowLoading <= 0) {
            open_loading();
        }
        isShowLoading++
        //token
        addPostDataStr(opts, "authToken", getAuthToken());
        if (getBrowserInfo) {
            addPostDataStr(opts, "browserInfo", getBrowserInfo());
        }

        //域名前缀
        var rootUrl = "";
        if (self.frameElement && self.frameElement.tagName == "IFRAME") {
            rootUrl = window.parent.location.href;
        } else {
            rootUrl = window.location.href;
        }
        var dp = getStringParam(rootUrl, "dp");
        addPostDataStr(opts, "dp", dp);
        
    }).ajaxError(function (e, xhr, opts) {
        //console.log("error");
    }).ajaxSuccess(function (e, xhr, opts) {
        //console.log("success");
        //redirectUrl(e, xhr, opts);
        
    }).ajaxComplete(function (e, xhr, opts) {
        //console.log("complete");
        isShowLoading--;
        if (isShowLoading <= 0) {
            close_loading();
        }
        if (xhr.responseJSON) {
            var retData = xhr.responseJSON;
            if (!retData.isSuccess) {
                //999没有登录、998没有毕设资格、997重复登录跳转、984用户信息被修改，唯一标识清空
                var errCode = +retData.errorCode;
                if (errCode == 999 || errCode == 998 || errCode == 997 || errCode == 984) {
                    var loginUrl = "/Login.html";
                    if (retData.objData && !checkValIsUndefinedOrNull(retData.objData.casLoginoutUrl)) {
                        loginUrl = retData.objData.casLoginoutUrl;
                    } 
                    var redirectToLogin = function () {
                        if (self.frameElement && self.frameElement.tagName == "IFRAME") {
                            window.parent.location.href = loginUrl;
                        } else {
                            window.location.href = loginUrl;
                        }
                    };
                    quitTabsToLogin(retData.message, redirectToLogin);
                    return;
                }
            }
        }

    }).ajaxStop(function (e) {
        //console.log("stop");
    });

})();


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
