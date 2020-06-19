
/**
 * 上传实例
 * @param {any} options
 * @example
 * options={
 *	server, //必填，上传接口
 *	pick, //可选，指定选择文件的按钮容器
 *  txtFileName, //可选，文件名textbox
 *  uploadTarget, //可选，指定进度条容器
 *	formData, //可选，自定义参数，name、id、type、lastModifiedDate、size、file这些参数已被占用
 *	accept, //可选，指定接受哪些类型的文件
 *	fileNumLimit, //可选，文件总数
 *	fileSingleSizeLimit, //可选，单个文件大小,
 *  alertMessageAfterUploadSuccess, //可选，默认true，上传成功后是否弹出提示框
 * }
 */
function extend(des, src, override) {
    if (src instanceof Array) {
        for (var i = 0, len = src.length; i < len; i++)
            extend(des, src[i], override);
    }
    for (var i in src) {
        if (override || !(i in des)) {
            des[i] = src[i];
        }
    }
    return des;
}

function createWebuploader(options) {
    var guid = WebUploader.Base.guid();//一个GUID
    if (!options.pick) {
        options.pick = {
            id: "#webUploaderPick",
            innerHTML: "浏览",
            multiple: false
        };
    }
    if (checkValIsUndefinedOrNull(options.txtFileName)) {
        options.txtFileName = "#txtFileName";
    }
    if (checkValIsUndefinedOrNull(options.uploadTarget)) {
        options.uploadTarget = "#divFileProgressContainer";
    }
    if (checkValIsUndefinedOrNull(options.swf)) {
        options.swf = "/Scripts/webuploader/Uploader.swf";
    }
    if (!options.accept) {
        options.accept = {
            title: 'File Types',
            extensions: 'doc,docx,pdf,wps,rar,zip',
            mimeTypes: '.doc,.docx,.pdf,.wps,.rar,.zip'
        };
    }
    if (!options.formData) {
        options.formData = {};
    }
    options.formData.guid = guid;
    if (getBrowserInfo) {
        options.formData.browserInfo = getBrowserInfo();
    }

    //if (typeof (options.alertMessageAfterUploadSuccess) !== "boolean") {
    //    options.alertMessageAfterUploadSuccess = true;
    //}
    
    var uploader = WebUploader.create({
        swf: options.swf,
        server: "../Handler/ReceiveFilesHandler.ashx",
        pick: options.pick,
        disableGlobalDnd: true, //禁掉整个页面的拖拽功能
        resize: false,
        formData: options.formData, //自定义参数
        accept: options.accept, //指定接受哪些类型的文件
        compress: false, //图片在上传前不进行压缩
        prepareNextFile: true, //是否允许在文件传输时提前把下一个文件准备好
        chunked: true, //是否要分片处理大文件上传
        chunkSize: 524288, //如果要分片，分多大一片？ 默认大小为5M
        chunkRetry: 2, //如果某个分片由于网络问题出错，允许自动重传多少次
        threads: 1, //上传并发数，允许同时最大上传进程数
        fileVal: "Filedata", //设置文件上传域的name
        fileNumLimit: 1, //文件总数
        fileSizeLimit: 6 * 1024 * 1024 * 1024,//6G 验证文件总大小是否超出限制, 超出则不允许加入队列
        fileSingleSizeLimit: options.fileSingleSizeLimit || 3 * 1024 * 1024 * 1024, //单个文件大小限制，单位是B
        duplicate: true //去重
    });

    /**
     * 当validate不通过时，会以派送错误事件的形式通知调用者
     * type {String} 错误类型
     */
    uploader.on('error', function (type) {
        switch (type) {
            case "Q_EXCEED_NUM_LIMIT":
                myMessage("最多选择" + this.options.fileNumLimit + "个文件！");
                break;
            case "Q_TYPE_DENIED":
                myMessage("请选择指定类型的文件上传！");
                break;
        }
    });

    /**
     * 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列
     * file {File} File对象
     */
    uploader.on('beforeFileQueued', function (file) {
        if (file.size > this.options.fileSingleSizeLimit) {
            myMessage("单个文件不能超过" + WebUploader.Base.formatSize(this.options.fileSingleSizeLimit, 0));
            return false;
        }
        var files = this.getFiles();
        if (files && files.length >= this.options.fileNumLimit) {
            this.removeFile(files[0], true);
            $(this.options.pick.id).siblings(options.txtFileName).attr("fileId", "").textbox("setValue", "");
        }
        
        return true;
    });

    var fileProgress = null; //进度条
    var startUploadTime = null;

    /**
     * 当文件被加入队列以后触发
     * file {File} File对象
     */
    uploader.on('fileQueued', function (file) {
        if (options.fileQueued && typeof (options.fileQueued) === "function") {
            options.fileQueued(file);
        } else {
            var $txtFileName = $(this.options.pick.id).siblings(options.txtFileName);
            $txtFileName.attr("fileId", file.id).textbox("setValue", file.name);

            var opts = $txtFileName.textbox('options');
            //opts.icons = opts.icons || [];
            opts.icons = []; //如果不重置，则获取的图标包括其他控件中的图标
            if (opts.icons.length <= 0) {
                opts.icons.unshift({
                    iconCls: 'icon-clear',
                    handler: function(e) {
                        var $target = $(e.data.target);
                        $target.attr("fileId", "").textbox("setValue", "");
                        if (fileProgress) {
                            fileProgress.reInit();
                        }
                        $(options.uploadTarget).hide();
                        $(this).css('visibility', 'hidden');
                    }
                });
                $txtFileName.textbox(opts);
                $txtFileName.textbox('getIcon', 0).removeClass("textbox-icon-disabled"); //只读控件会自动加上此样式
            } else {
                $txtFileName.textbox('getIcon', 0).css('visibility', 'visible');
            }

            //textbox-icon-disabled
            //$txtFileName.textbox({
            //    icons: [{
            //        iconCls: 'icon-clear',
            //        disabled: false,
            //        handler: function (e) {
            //            var $target = $(e.data.target);
            //            $target.attr("fileId", "").textbox("setValue", "");
            //            if (fileProgress) {
            //                fileProgress.reInit();
            //            }
            //            $(options.uploadTarget).hide();
            //            $(this).css('visibility', 'hidden');
            //        }
            //    }]
            //});
        }
        // 限制图片大小
        if (options.whLimit) {
            uploader.makeThumb(file, function (error, src) {//验证图片尺寸
                var imgWidth = file._info.width;
                var imgHeight = file._info.height;
                if (!(imgWidth <= options.whLimit.width[1] && imgWidth >= options.whLimit.width[0]
                    && imgHeight <= options.whLimit.height[1] && imgHeight >= options.whLimit.height[0])) {
                    fileProgress.setError();
                    fileProgress.setStatus("图片尺寸不符合要求，请重新上传！");

                    uploader.reset();
                    $txtFileName.attr("fileId", "");
                }
            }, 1, 1);
        }

        $(options.uploadTarget).show();
        fileProgress = new FileProgress(file, options.uploadTarget);
        fileProgress.setStatus("您所选文档已预保存成功，将在点击“提交”或“保存”等确认按钮后上传至系统");
        //fileProgress.toggleCancel(true, this);
    });

    /**
   某个文件开始上传之前触发
   */
    uploader.on('uploadStart', function (file) {
        this.options.formData.action = 'Add';
        var myguid = "";
        $.ajax({
            url: "../Handler/ReceiveFilesHandler.ashx",
            type: "POST",
            data: { action: 'GetPath' },
            async: false,  //同步方式发起请求
            success: function (response) {
                response = eval('(' + response + ')');
                myguid = response.message;
            }
        });
        this.options.formData.guid = myguid;
        //this.options.formData.guid = WebUploader.Base.guid();
    });

    /**
     * 开始上传
     * file {File} File对象
     */
    uploader.on('startUpload', function () {

        //检测是否使用了被占用的参数
        //if (this.options.formData) {
        //    var fieldList = ["name", "id", "type", "lastmodifieddate", "size", "file"]; //被占用的参数名称
        //    var msg = "";
        //    $.each(this.options.formData, function (key, value) {
        //        var index = $.inArray(key.toLowerCase(), fieldList);
        //        if (index >= 0) {
        //            msg += key + ",";
        //        }
        //    });
        //    if (msg.length > 0 && console && console.error) {
        //        console.error("这些上传参数已被占用，请使用其他参数名称，" + msg);
        //    }
        //}
        
        startUploadTime = new Date();
        if (fileProgress) {
            //fileProgress.setStatus("等待上传...");
            fileProgress.toggleCancel(true, this);
        }
        $(this.options.pick.id).siblings(options.txtFileName).textbox('getIcon', 0).css('visibility', 'hidden');
    });

    /**
     * 暂停上传
     * file {File} File对象
     */
    uploader.on('stopUpload', function () {
        if (fileProgress) {
            fileProgress.toggleCancel(false);
        }
        $(this.options.pick.id).siblings(options.txtFileName).textbox('getIcon', 0).css('visibility', 'visible');
    });

    /**
     * 上传进度
     * file {File} File对象
     * percentage {Number} 上传进度
     */
    uploader.on('uploadProgress', function(file, percentage) {
        try {
            var percent = Math.floor(percentage * 100);
            if (percent > 100) {
                percent = 100;
            }
            if (fileProgress) {
                fileProgress.setProgress(percent);
                if (percent === 100) {
                    fileProgress.setStatus("正在保存文件，请耐心等待......");
                    fileProgress.toggleCancel(false);
                } else {
                    //rndfilesize = round file size  
                    var rndfilesize = roundNumber(((file.size / 1024) / 1024), 1);
                    //uploaded = how much has been uploaded
                    var bytesLoaded = file.size * percentage;
                    var uploaded = roundNumber(((bytesLoaded / 1024) / 1024), 1);
                    //uTime = uploadTime (time spent uploading)
                    var currentTime = new Date();
                    var uTime = (Math.ceil(currentTime - startUploadTime) / 1000);
                    //uSpeed = uploadSpeed (40 kB/s)
                    var uSpeed = Math.floor(roundNumber(((bytesLoaded / uTime) / 1024), 2));
                    //tempTime = store time for following functions
                    //var tempTime = uTime;
                    //uploadTime in min:sec
                    //uTime = "用时" + minsec("m", tempTime) + "分:" + minsec("s", tempTime) + "秒";
                    //tempTime = reassign val
                    //tempTime = roundNumber(((((file.size - bytesLoaded) / uSpeed) / 60) / 10), 2);
                    //if (tempTime != "Infinity") {
                    //    if (tempTime > 0) {
                    //        //if greater than 0
                    //        //Timeleft in min:sec
                    //        Timeleft = minsec("m", tempTime) + "分:" + minsec("s", tempTime) + '秒';
                    //    } else {
                    //        Timeleft = "计算中...";
                    //    }
                    //} else {
                    //    Timeleft = "计算中...";
                    //}
                    
                    fileProgress.setStatus('进度...<b><font color=red>' + percent + '%</font></b>（上传速度: <b>' + uSpeed + '</b> KB/S , 已上传: <b>' + uploaded + '/' + rndfilesize + '</b> MB）');
                    //fileProgress.toggleCancel(true, this);
                }
            }
        } catch (ex) {
            if (console && console.log) {
                console.log(ex);
            }
        }
    });
    
    /**
     * 上传成功
     * file {File} File对象
     * response {Object} 服务端返回的数据
     */
    uploader.on('uploadSuccess', function (file, response) {
        //var formDatas = this.options.formData;
        this.options.formData.action = 'Merge';
        var nums = extend({}, [this.options.formData, { file_name: file.name, chunks: file.blocks.length, file_size: file.size }]);
        //formDatas["file_name"] = file.name
        $.ajax({
            url: "../Handler/ReceiveFilesHandler.ashx",
            type: "POST",
            data: nums,
            async: false,  //同步方式发起请求
            success: function (response) {
                response = eval('(' + response + ')');
                if (fileProgress) {
                    var msg = response.message;
                    if (response.isSuccess) {
                        fileProgress.setComplete();
                        if (checkValIsUndefinedOrNull(msg)) {
                            msg = "上传成功";
                        }
                        msg = "上传成功";
                        //fileProgress.setStatus(msg);
                    } else {
                        fileProgress.setError();
                        if (checkValIsUndefinedOrNull(msg)) {
                            msg = "上传失败";
                        }
                        fileProgress.setStatus(msg);
                    }
                }
                //myMessage(response.message, response.errorCode); options.alertMessageAfterUploadSuccess ||
                if (response.isSuccess) {
                    if (!checkValIsUndefinedOrNull(response.message) &&
                        (checkValIsUndefinedOrNull(response.errorCode) || response.errorCode != 999)) {
                        nums["saveFileName_Path"] = response.message
                        if (response.isSuccess && options.successCallback && typeof (options.successCallback) === "function") {
                            options.successCallback(response, nums);
                        }
                        if (!response.isSuccess && options.errorCallback && typeof (options.errorCallback) === "function") {
                            options.errorCallback(response, nums);
                        }
                    }
                } else {
                    nums["saveFileName_Path"] = response.message
                    if (response.isSuccess && options.successCallback && typeof (options.successCallback) === "function") {
                        options.successCallback(response, nums);
                    }
                    if (!response.isSuccess && options.errorCallback && typeof (options.errorCallback) === "function") {
                        options.errorCallback(response, nums);
                    }
                }
            }
        });
    });

    /**
     * 上传失败
     * file {File} File对象
     * reason {String} 出错的code
     */
    uploader.on('uploadError', function (file, reason) {
        if (fileProgress) {
            switch (reason) {
                case WebUploader.File.Status.CANCELLED: //上传取消
                    fileProgress.setCancelled();
                    fileProgress.setStatus("Cancelled");
                    fileProgress.toggleCancel(false);
                    break;
                default:
                    fileProgress.setError();
                    fileProgress.setStatus("上传失败");
                    fileProgress.toggleCancel(false);
                    break;
            }
        }
    });

    /**
     * 上传完成，成功或失败
     * file {File} File对象
     */
    uploader.on('uploadComplete', function (file) {
        //this.reset();
    });

    return uploader;
}

//roundNumber found via google
function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

//minsec
function minsec(time, tempTime) {
    var ztime;
    if (time == "m") {
        ztime = Math.floor(tempTime / 60);
        if (ztime < 10) {
            ztime = "0" + ztime;
        }
    } else if (time == "s") {
        ztime = Math.ceil(tempTime % 60);
        if (ztime < 10) {
            ztime = "0" + ztime;
        }
    } else {
        ztime = "minsec error...";
    }
    return ztime;
}

//
function fadeIn(element, opacity) {
    var reduceOpacityBy = 5;
    var rate = 30; // 15 fps


    if (opacity < 100) {
        opacity += reduceOpacityBy;
        if (opacity > 100) {
            opacity = 100;
        }

        if (element.filters) {
            try {
                element.filters.item("DXImageTransform.Microsoft.Alpha").opacity = opacity;
            } catch (e) {
                // If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
                element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ')';
            }
        } else {
            element.style.opacity = opacity / 100;
        }
    }

    if (opacity < 100) {
        setTimeout(function () {
            fadeIn(element, opacity);
        }, rate);
    }
}

/* ******************************************
*	FileProgress Object
*	Control object for displaying file info
* ****************************************** */
function FileProgress(file, targetId) {

    var progressWrappers = $(targetId + " .progressWrapper");
    this.fileProgressWrapper = null;
    if (progressWrappers && progressWrappers.length > 0) {
        this.fileProgressWrapper = progressWrappers[0];
    }

    //this.fileProgressWrapper = document.getElementById(this.fileProgressID);
    if (!this.fileProgressWrapper) {
        this.fileProgressWrapper = document.createElement("div");
        this.fileProgressWrapper.className = "progressWrapper";
        this.fileProgressWrapper.id = this.fileProgressID;

        this.fileProgressElement = document.createElement("div");
        this.fileProgressElement.className = "progressContainer";

        var progressCancel = document.createElement("a");
        progressCancel.className = "progressCancel";
        progressCancel.href = "javascript:;";
        progressCancel.title = "取消上传";
        progressCancel.style.visibility = "hidden";
        progressCancel.appendChild(document.createTextNode(" "));

        var progressText = document.createElement("div");
        progressText.className = "progressName";
        progressText.innerHTML = file.name;

        var progressBar = document.createElement("div");
        progressBar.className = "progressBarInProgress";

        var progressStatus = document.createElement("div");
        progressStatus.className = "progressBarStatus";
        progressStatus.innerHTML = "&nbsp;";

        this.fileProgressElement.appendChild(progressCancel);
        this.fileProgressElement.appendChild(progressText);
        this.fileProgressElement.appendChild(progressStatus);
        this.fileProgressElement.appendChild(progressBar);

        this.fileProgressWrapper.appendChild(this.fileProgressElement);

        $(targetId).append(this.fileProgressWrapper);
        fadeIn(this.fileProgressWrapper, 0);

    } else {
        this.fileProgressElement = this.fileProgressWrapper.firstChild;
        this.fileProgressElement.childNodes[1].innerHTML = file.name;
    }

    this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.setProgress = function (percentage) {
    this.fileProgressElement.className = "progressContainer green";
    this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
    this.fileProgressElement.childNodes[3].style.width = percentage + "%";
};
FileProgress.prototype.setComplete = function () {
    this.fileProgressElement.className = "progressContainer blue";
    this.fileProgressElement.childNodes[3].className = "progressBarComplete";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setError = function () {
    this.fileProgressElement.className = "progressContainer red";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setCancelled = function () {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setStatus = function (status) {
    this.fileProgressElement.childNodes[2].innerHTML = status;
};
FileProgress.prototype.toggleCancel = function (show, uploader) {
    this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
    if (uploader) {
        var $this = this;
        $this.fileProgressElement.childNodes[0].onclick = function () {
            uploader.stop(true);
            $this.setCancelled();
        };
    }
};
FileProgress.prototype.reInit = function () {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[1].innerHTML = "";
    this.fileProgressElement.childNodes[2].innerHTML = "";
};

/* == FileProgress End == */
