/**
 * 创建一个rangy帮助类
 * var rangyHelper = RangyHelper.createNew();
 */
var RangyHelper = {
    /**
     * 创建的实例
     */
    instance: {},
    /**
     * 已创建实例的个数
     */
    instanceCount: 0,
    /**
     * 批注，批注
     * @param {String} remarkElementId 划词div元素的ID
     * @param {String} articlePartId 论文段落ID，非论文时为空
     * @param {number} operandId 文件ID
     * @param {number} checkFileType 检测文件类型
     * @param {number} tableModelId 自定义ID， 不是自定义时为空
     */
    createNew: function (remarkElementId, articlePartId, operandId, checkFileType, tableModelId) {

        //#region 自定义变量

        /**
         * 自定义属性名称
         */
        var attrArticleRemarkId = "articleRemarkId";
        /**
         * 标记实例
         */
        var highlighter;
        /**
         * 标记样式
         */
        var highlightStyleClass = "highlight";
        /**
         * 占位，没有具体的样式
         */
        var noStyleClass = "noStyle";
        /**
         * 占位实例
         */
        var noStyleLighter;
        //var outTimer = null; //超时计时器，单击和双击事件并存解决方案
        /**
         * 是否支持划词  1：支持  -1：超出文本框  0：浏览器不支持
         */
        var isSupportRange = 1;
        //var arId = $("#hdArticleRemarkId").val();
        /**
         * 原文，添加批注前的原文
         */
        var redContentHtml = "";
        /**
         * 参数
         */
        var options = {};
        /**
         * 类的实例
         */
        var rangyHelper = {};
        //#endregion

        //#region 初始化
        options["remarkElementId"] = remarkElementId || "";
        options["articlePartId"] = articlePartId || "";
        options["operandId"] = operandId || "0";
        options["checkFileType"] = checkFileType || "0";
        options["tableModelId"] = tableModelId || "0";

        if (checkValIsUndefinedOrNull(options.remarkElementId) ||
            (checkValIsUndefinedOrNull(options.articlePartId) &&
                (options.operandId <= 0 || options.checkFileType <= 0))) {
            if (console && console.error) {
                console.error("绑定划词批注功能失败，参数有误");
            };
            return false;
        } else {
            rangyRemark();
        };

        var openDialogHtml = '<div style="width:0; height:0; overflow:hidden;"><div id="gxf_rangy_maxredBox" class="easyui-dialog" data-options="closed:true,modal:true,closable: false" style=" width:800px; height:470px; text-align:left; padding:5px 20px;">'
            + '<div><input type="hidden" id="hdArticleRemarkId" value="" />'
            + '<input type="hidden" id="hdSelectedText" value="" />'
            + '<input type="hidden" id="hdSerializedSelection" value="" />'
            + '<p style="line-height: 30px;">'
            + '<span>批注人：</span><span id="lblCreatorName">---</span><span class="margl">批注时间：</span><span id="lblDatetime"></span>'
            + '</p>'
            + '<p style="word-break: break-word;">'
            //+ '<input id="txtRemark" type="text" class="easyui-textbox" data-options="multiline:true,height:160,width:760">'
            + '<script id="txtRemark" name="txtRemark" style="width: 760px; height:160px;" type="text/plain"></script>'
            + '</p>'
            + '<h3 style="margin: 10px 0;">选中批注的内容：</h3>'
            + '<p id="postilDetailContent"></p>'
            + '</div></div></div>';
        if ($('#gxf_rangy_maxredBox').length <= 0) {
            $(openDialogHtml).appendTo('body');
            initRangyUEditor(['txtRemark']);
        };
        var delDialogHtml = '<div style="width:0; height:0; overflow:hidden; "><div id="gxf_rangy_delModelBox" class="easyui-dialog" data-options="closed:true,modal:true" style=" width:400px; height: 200px; text-align:center; padding:30px"></div></div>'
        if ($('#gxf_rangy_delModelBox').length <= 0) {
            $(delDialogHtml).appendTo('body');
        };

        /**
         * 初始化
         */
        function rangyRemark() {
            redContentHtml = $("#" + options.remarkElementId).html();

            //初始化工具类rangy
            initRangy();

            //鼠标选择文本事件
            //bindMouseUpAndDown(remarkElementId);

            //初始化数据
            initArticleRemark();

        };
        //#endregion

        //#region 弹出批注编辑框
        /**
         * 划词后显示“批注”按钮
         * @param {any} pageX 鼠标位置
         * @param {any} pageY 鼠标位置
         */
        function showTooltip(pageX, pageY) {
            $("#hdSerializedSelection").val("");
            $("#hdSelectedText").val("");

            var x = 10;
            var y = 10;
            var selectedText = "";
            var serializedSelectionStr = "";
            try {
                isSupportRange = 1;
                selectedText = rangy.getSelection().toString(); //选中的文本
                if (selectedText != "") {
                    serializedSelectionStr = serializeSelection(options.remarkElementId); //确认选中区的位置
                };
            } catch (e) {
                if (e.message.indexOf("is not wholly contained within specified root node") >= 0) {
                    isSupportRange = -1;
                } else {
                    isSupportRange = 0;
                }
            }


            if (selectedText != "") {
                $("#hdSerializedSelection").val(serializedSelectionStr);
                $("#hdSelectedText").val(selectedText);

                var tip = "批注";
                var tooltip = "<input type='button' id='tooltip' class='formBtn' value='" + tip + "' />";
                if (role != 1 && role != 2) {
                    $("body").append(tooltip);
                };

                $("#tooltip").css({
                    "top": (pageY + y) + "px",
                    "left": (pageX + x) + "px",
                    "position": "absolute"
                }).show("fast");
            };
            return isSupportRange;
        };

        /**
         * 判断所选区域是否包含已经标记的区域，或是重叠区域
         * 1:所选区域包含整个已标记区域
         * 2:开始点或结束点在已标记区域内
         */
        function hasOverlap() {
            var has = 0;
            //1.所选区域包含整个已标记区域
            var selectedHtml = rangy.getSelection().toHtml();
            if (selectedHtml && selectedHtml.length > 0) {
                var regex = /class\s*=\s*['\"]([^'\"]+)['\"]/gi; //获取class值
                var matchs = selectedHtml.match(regex);
                if (matchs && matchs.length > 0) {
                    for (var i = 0; i < matchs.length; i++) {
                        if (matchs[i].indexOf(highlightStyleClass) >= 0) {
                            has = 1;
                            break;
                        };
                    };
                };
            };

            if (has <= 0) {
                //2.开始点或结束点在已标记区域内
                //判断父节点
                var checkParentNodes = function (iNode, iRootNode) {
                    var iHas = false;
                    if (!iNode) {
                        return iHas;
                    };

                    while (iNode != iRootNode) {
                        if (iNode.attributes) {
                            var attr = iNode.getAttribute("class") || "";
                            if (attr.indexOf(highlightStyleClass) >= 0) {
                                iHas = true;
                                break;
                            };
                        };
                        iNode = iNode.parentNode;
                    };
                    return iHas;
                };

                var range = rangy.getSelection().getRangeAt(0);
                var rootNode = document.getElementById(options.remarkElementId);
                if (checkParentNodes(range.startContainer, rootNode) ||
                    checkParentNodes(range.endContainer, rootNode)) {
                    has = 2;
                };
            };
            return has;
        };

        /**
         * 查看详情
         * @param {Number} arId 批注主键ID
         */
        function openDetailDialog(arId, whole, version) {
            // 打开批注弹框
            $('#gxf_rangy_maxredBox').dialog({
                title: '批注',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            if (role == 1 || role == 2) {
                                $('#gxf_rangy_maxredBox').dialog("close");
                                return;
                            };
                            var saveXhr = saveRemark(arId, whole);
                            saveXhr.done(function (data) {
                                if (data.isSuccess) {
                                    // 关闭弹框
                                    $('#gxf_rangy_maxredBox').dialog('close');
                                    var arIdNew = data.message;
                                    if (data.rows && data.rows.length > 0) {
                                        if (!checkValIsUndefinedOrNull(arId) && arId > 0) { //更新
                                            if (data.rows[0]["SerializedSelection"] == '0:0,0:0' || data.rows[0]["Version"] == 2) {
                                                document.getElementById(options.remarkElementId).innerHTML = redContentHtml;
                                                initArticleRemark();
                                            }
                                            updateRemarkOfRigthList(data.rows[0]);
                                        } else { //插入
                                            if (data.rows[0]["SerializedSelection"] == '0:0,0:0' || data.rows[0]["Version"] == 2) {
                                                addNewRemark2RightList(data.rows[0]);
                                            } else {
                                                deserializeSelection(data.rows[0]["SerializedSelection"]);
                                                var selectedText = rangy.getSelection().toString(); //选中的文本 SelectedText
                                                if (selectedText == data.rows[0]["SelectedText"] && hasOverlap() <= 0) {
                                                    highlightSelectedText(highlightStyleClass);
                                                    processSelectedText(arIdNew, data.rows[0]["Num"]);
                                                    addNewRemark2RightList(data.rows[0]);
                                                };
                                            }
                                        };
                                    };
                                } else {
                                    myMessage(data.message);
                                };
                            }).fail(function () {
                                myMessage("保存失败，请求异常");
                            });
                        }
                    }, {
                        text: '删除',
                        handler: function () {
                            if (role == 1 || role == 2) {
                                myMessage("您没有权限执行操作！");
                                return;
                            };
                            $("#gxf_rangy_delModelBox").text("你确定要删除这条批注吗？").dialog({
                                title: '删除批注',
                                buttons: [
                                    {
                                        text: '确定',
                                        handler: function () {
                                            var delXhr = delRemark(arId);
                                            delXhr.done(function (data) {
                                                if (data.isSuccess) {
                                                    //取消页面黄色部分,清除占位标记
                                                    //var arData = parseJson(data.message);
                                                    //var arList = arData.arList;
                                                    //if (arList && arList.length > 0) {
                                                    //    //清除标记
                                                    //    removeHighlightFromSelectedText(id);
                                                    //} else {
                                                    //    removeHighlightFromSelectedText(arData.arIds);
                                                    //}

                                                    //刷新
                                                    document.getElementById(options.remarkElementId).innerHTML = redContentHtml;
                                                    initArticleRemark();

                                                    $("#gxf_rangy_delModelBox").dialog("close");
                                                    $("#gxf_rangy_maxredBox").dialog("close");
                                                } else {
                                                    myMessage(data.message);
                                                };
                                            }).fail(function () {
                                                myMessage("删除失败，请求异常");
                                            });
                                        }
                                    }, {
                                        text: '取消',
                                        handler: function () {
                                            $('#gxf_rangy_delModelBox').dialog("close");
                                        }
                                    }
                                ]
                            });
                            $.parser.parse("#gxf_rangy_delModelBox");
                            $("#gxf_rangy_delModelBox").dialog("open").window('center');
                        }
                    }, {
                        text: ((role == 1 || role == 2) ? '关闭' : '取消'),
                        handler: function () {
                            if (version == 2 && whole == 0) {
                                unhighlightSelection(highlightStyleClass, true);
                                //刷新
                                document.getElementById(options.remarkElementId).innerHTML = redContentHtml;
                                //$.parser.parse("#" + options.remarkElementId);
                                //initArticleRemark();
                            }
                            $('#gxf_rangy_maxredBox').dialog("close");
                        }
                    }
                ],
                onBeforeOpen: function () {                    
                    //初始化
                    $("#hdArticleRemarkId").val("");
                    //$("#txtRemark").textbox("setValue", "");
                    setUEditorContent("txtRemark", "");
                    $("#lblCreatorName").text("---");
                    $("#lblDatetime").text("");
                    if (!checkValIsUndefinedOrNull(arId) && arId > 0) {
                        $("#postilDetailContent").html("");
                    } else {
                        $("#postilDetailContent").html($("#hdSelectedText").val());
                    };
                    if (whole == 1 && role != 2) {
                        $("#postilDetailContent").html("<p style='text-align: center; font-weight: 700; padding: 20px 0;'>整体批注</p>");
                    }
                    // 非教师只有查看的权限 不能修改
                    if (role == 1 || role == 2) {
                        //$("#txtRemark").textbox("disable");
                        setUEditorDisabled("txtRemark");
                    } else {
                        //$("#txtRemark").textbox('enable');
                        setUEditorEnabled("txtRemark");
                    };
                    //隐藏"删除"按钮
                    if (checkValIsUndefinedOrNull(arId) || arId <= 0 || role == 1 || role == 2) {
                        var buttons = $("#gxf_rangy_maxredBox").siblings(".dialog-button").find("a");
                        if (buttons && buttons.length > 0) {
                            $.each(buttons, function (index, btn) {
                                if ($(btn).find(".l-btn-text").text() == "删除" || ((role == 1 || role == 2) && $(btn).find(".l-btn-text").text() == "确定")) {
                                    $(btn).hide();
                                }
                            });
                        }
                    }

                    //获取详情
                    if (!checkValIsUndefinedOrNull(arId) && arId > 0) {
                        var getXhr = getRemark(arId);
                        getXhr.done(function (data) {
                            if (data.isSuccess) {
                                if (data.dataList) {
                                    var ar = data.dataList;
                                    $("#hdArticleRemarkId").val(ar.Id);
                                    //$("#txtRemark").textbox("setValue", decodeURIComponent(ar.Remark));
                                    setUEditorContent("txtRemark", decodeURIComponent(ar.Remark));
                                    $("#hdSerializedSelection").val(ar.SerializedSelection);
                                    $("#hdSelectedText").val(decodeURIComponent(ar.SelectedText));
                                    $("#lblCreatorName").text(ar.CreatorName);
                                    $("#lblDatetime").text(ar.LastEditTime);
                                    if (whole == 1 && role != 2) {
                                        $("#postilDetailContent").html("<p style='text-align: center; font-weight: 700; padding: 20px 0;'>整体批注</p>");
                                    } else {
                                        $("#postilDetailContent").html(decodeURIComponent(ar.SelectedText));
                                    }

                                    deserializeSelection(ar["SerializedSelection"]);
                                    var selectedText = ar["SelectedText"]
                                    if (selectedText && hasOverlap() <= 0) {
                                        highlightSelectedText(highlightStyleClass);
                                        //processSelectedText(arIdNew, data.rows[0]["Num"]);
                                    };

                                    //不是自己添加的不能修改
                                    if (!ar.CanEdit) {
                                        //$("#txtRemark").textbox("disable");
                                        setUEditorDisabled("txtRemark");
                                        var buttons = $("#gxf_rangy_maxredBox").siblings(".dialog-button").find("a");
                                        if (buttons && buttons.length > 0) {
                                            $.each(buttons, function (index, btn) {
                                                var btnText = $(btn).find(".l-btn-text").text();
                                                if (btnText == "删除" || btnText == "确定") {
                                                    $(btn).hide();
                                                }
                                            });
                                        }
                                    }
                                }
                            } else {
                                myMessage(data.message);
                            };
                        }).fail(function () {
                            myMessage("获取详细信息失败，请求异常");
                        });
                    };
                    //$('#txtRemark').next('span').find('textarea').focus();
                }
            });
            $.parser.parse("#gxf_rangy_maxredBox");
            $('#gxf_rangy_maxredBox').dialog("open").window('center');
            //openDetailDialog_onBeforeOpen(arId, whole, version);
        };

        //#endregion

        //#region 处理标记文本

        /**
         * 初始化批注标记
         */
        function initArticleRemark() {
            var getXhr = getRemarkList();
            getXhr.done(function (data) {
                if (data.isSuccess) {
                    if (data.rows && data.rows.length > 0) {
                        $.each(data.rows, function (index, item) {
                            try {
                                if (item["Version"] != 2) {
                                    deserializeSelection(item.SerializedSelection);
                                    var selectedText = rangy.getSelection().toString(); //选中的文本 SelectedText
                                    if (selectedText == item.SelectedText && hasOverlap() <= 0 && !checkValIsUndefinedOrNull(selectedText)) {
                                        if (item.IsDeleted == 0) {
                                            highlightSelectedText(highlightStyleClass);
                                            processSelectedText(item.Id, item.Num);
                                        } else {
                                            highlightSelectedText(noStyleClass);
                                            addHiddenNum(item.Id, item.Num);
                                        };
                                    };
                                }
                            } catch (ex) {
                                console.log(ex.message);
                            };
                        });
                        deserializeSelection("0:0,0:0");
                    };
                    initRightList(data.rows);
                } else {
                    myMessage(data.message);
                };
            }).fail(function () {
                myMessage("请求批注数据失败！");
            });
        };

        /**
         * 处理标记文本
         * @param {Number} arId 批注主键ID，如果指定ID，则先选中元素然后再删除标记，并且解除绑定事件；如果未指定ID，则删除默认选中区的标记
         * @param {Number} num 序号
         */
        function processSelectedText(arId, num) {
            var spanList = $("#" + options.remarkElementId + " span[class~='" + highlightStyleClass + "']:not([" + attrArticleRemarkId + "])");
            if (spanList.length > 0) {
                $.each(spanList, function (index, element) {
                    if (index == 0) {
                        $(element).prepend("<sup style='color: #f00; font-size:12px;'>[" + num + "]</sup>");
                    };
                    $(element).attr(attrArticleRemarkId, arId);

                    var eleTitle = element.title || "";
                    var titleStr = "单击鼠标左键，查看该段文字的批注或标注";
                    if (eleTitle.indexOf(titleStr) < 0) {
                        if (eleTitle.length > 0) {
                            eleTitle += '&#13;';
                        };
                        eleTitle += titleStr;
                        element.title = eleTitle;
                    };
                });
            };
        };

        /**
         * 添加隐藏序号
         * @param {Number} arId
         * @param {Number} num
         */
        function addHiddenNum(arId, num) {
            var spanList = $("#" + options.remarkElementId + " span[class~='" + noStyleClass + "']:not([" + attrArticleRemarkId + "])");
            if (spanList.length > 0) {
                $.each(spanList, function (index, element) {
                    if (index == 0) {
                        $(element).prepend("<sup style='color: #f00; font-size:0px;'>[" + num + "]</sup>");
                    };
                    $(element).attr(attrArticleRemarkId, arId);
                });
            };
        };

        /**
         * 加载右侧列表
         * @param {any} dataList 数据集
         */
        function initRightList(dataList) {
            var html = '';
            var richTextIds = [];
            if (dataList && dataList.length > 0) {
                $.each(dataList, function (index, value) {
                    if (value["IsDeleted"] == 0) {
                        html += '<li class="gxf_rangy_content" data-id = "' + value["Id"] + '">'
                            + '<div class="gxf_rangy_conRole">'
                            + '<span class="gxf_rangy_num">[' + value["Num"] + ']</span>';
                        if (value["SerializedSelection"] == '0:0,0:0') {
                            html += '<b class="allRangyIcon" title="这是一条整体批注的内容"></b>';
                        }
                        var linkId = "right_" + options.remarkElementId + "_a" + value["Id"];
                        richTextIds.push(linkId);
                        html += '<span class="mgL">' + value["姓名"] + '</span>'
                            + '<span class="mgL">' + value["LastEditTime"] + '</span>'
                            + '</div>'
                            + '<div class="gxf_rangy_conDetails">'
                            + '<a id="' + linkId + '" class="gxf_rangy_details" href="javascript:;" title="请点击“查看详情”查看具体批注内容">' + value["Remark"] + '</a>'
                            + '<a class="listA gxf_rangy_link" href="javascript:;" arId="' + value["Id"] + '" Version="' + value["Version"] + '" whole="' + (value["SerializedSelection"] == '0:0,0:0' ? 1 : 0) + '">查看详情</a>'
                            + '</div>'
                            + '</li>';
                    };
                });
            } else {
                if (role != 1 && role != 2) {
                    html = '<li class="gxf_rangy_noContent"><h3>暂无批注内容</h3><p>如需添加批注，请选中内容添加</p></li>';
                } else {
                    html = '<li class="gxf_rangy_noContent"><h3>暂无批注内容</h3></li>';
                };
            };
            $("#right_" + options.remarkElementId).html(html);
            uParseUEditor(richTextIds);
            // 设置右边ID
            ChangeTheHeight(options.remarkElementId);

            //if($("#right_box_" + options.remarkElementId).find(".gxf_rangy_right_top").height())

            //$("#right_box_" + options.remarkElementId).height($("#" + options.remarkElementId).height());
            //$("#right_" + options.remarkElementId).height($("#right_box_" + options.remarkElementId).height() - $("#right_box_" + options.remarkElementId).find(".gxf_rangy_right_top").height() - 17);
        };

        /**
         * 添加新批注到右侧列表
         * @param {any} data 数据集
         */
        function addNewRemark2RightList(data) {
            var arId = data.Id;
            if (!checkValIsUndefinedOrNull(arId)) {
                var rightLi = $("#right_" + options.remarkElementId + " li[data-id='" + arId + "']");
                if (rightLi && rightLi.length > 0) { //已经存在则更新
                    updateRemarkOfRigthList(data);
                    return;
                };
                var rightHtml = $("#right_" + options.remarkElementId).find("li");
                if (checkValIsUndefinedOrNull(rightHtml.attr("data-id"))) {
                    $("#right_" + options.remarkElementId).empty(); //第一次添加，去除说明
                };
                var html = '<li class="gxf_rangy_content" data-id = "' + data["Id"] + '">'
                    + '<div class="gxf_rangy_conRole">'
                    + '<span class="gxf_rangy_num">[' + data["Num"] + ']</span>'
                if (data["SerializedSelection"] == '0:0,0:0') {
                    html += '<b class="allRangyIcon" title="这是一条整体批注的内容"></b>';
                }
                var linkId = "right_" + options.remarkElementId + "_a" + arId;
                html += '<span class="margl">' + data["姓名"] + '</span>'
                    + '<span class="margl">' + data["LastEditTime"] + '</span>'
                    + '</div>'
                    + '<div class="gxf_rangy_conDetails">'
                    + '<a id="' + linkId + '" class="gxf_rangy_details" href="javascript:;" title="请点击“查看详情”查看具体批注内容">' + data["Remark"] + '</a>'
                    + '<a class="listA gxf_rangy_link" href="javascript:;" arId="' + data["Id"] + '" Version="' + data["Version"] + '" whole="' + (data["SerializedSelection"] == '0:0,0:0' ? 1 : 0) + '">查看详情</a>'
                    + '</div>'
                    + '</li>';
                $("#right_" + options.remarkElementId).append(html);
                uParseUEditor([linkId]);
            };
        };

        /**
         * 更新右侧列表中的数据
         * @param {any} data 数据集
         */
        function updateRemarkOfRigthList(data) {
            var arId = data.Id;
            if (!checkValIsUndefinedOrNull(arId)) {
                var html = '<div class="gxf_rangy_conRole">'
                    + '<span class="gxf_rangy_num">[' + data["Num"] + ']</span>'
                if (data["SerializedSelection"] == '0:0,0:0') {
                    html += '<b class="allRangyIcon" title="这是一条整体批注的内容"></b>';
                }
                var linkId = "right_" + options.remarkElementId + "_a" + arId;
                html += '<span class="margl">' + data["姓名"] + '</span>'
                    + '<span class="margl">' + data["LastEditTime"] + '</span>'
                    + '</div>'
                    + '<div class="gxf_rangy_conDetails">'
                    + '<a id="' + linkId + '" class="gxf_rangy_details" href="javascript:;" title="请点击“查看详情”查看具体批注内容">' + data["Remark"] + '</a>'
                    + '<a class="listA gxf_rangy_link" href="javascript:;" arId="' + data["Id"] + '"  Version="' + data["Version"] + '" whole="' + (data["SerializedSelection"] == '0:0,0:0' ? 1 : 0) + '">查看详情</a>'
                    + '</div>';
                $("#right_" + options.remarkElementId + " li[data-id='" + arId + "']").html(html);
                uParseUEditor([linkId]);
            };
        };

        /**
         * 删除选中文本的已有标记
         * @param {Number} arId 批注主键ID
         */
        function removeHighlightFromSelectedText(arId) {
            if (arId && arId.length > 0) {
                // 删除右侧列表
                var rightLiList = $("#right_" + options.remarkElementId).find("li");
                if (rightLiList && rightLiList.length > 0) {
                    for (var r = (rightLiList.length - 1); r >= 0; r--) {
                        var dataId = $(rightLiList[r]).attr("data-id");
                        if (dataId == arId) {
                            $(rightLiList[r]).remove();
                        };
                    };
                };

                // 删除左边文字黄色标记
                var spanList = $("#" + options.remarkElementId + " span[class~='" + highlightStyleClass + "'][" + attrArticleRemarkId + "='" + arId + "']");
                if (spanList && spanList.length > 0) {
                    //先删除标记序号
                    $.each(spanList, function (index, item) {
                        $(item).find("sup").remove();
                    });

                    var range = rangy.createRange();
                    for (var i = spanList.length - 1; i >= 0; i--) {
                        var span = $(spanList[i]);
                        //$(span).find("sup").remove();
                        var spanSiblings = $(span).siblings("span[class][" + attrArticleRemarkId + "]");
                        span.unbind('click'); //取消单击事件
                        span.removeAttr(attrArticleRemarkId); //删除自定义属性
                        var titleValue = span.attr("title"); //恢复title属性
                        var titleIndex = titleValue.indexOf("单击鼠标左键");
                        if (titleIndex <= 0) {
                            span.removeAttr("title");
                        } else {
                            var tempIndex = titleValue.indexOf("&#13;");
                            if (tempIndex >= 0) {
                                titleIndex = tempIndex;
                            };
                            span.attr("title", titleValue.substring(0, titleIndex));
                        };

                        range.selectNode(spanList[i]);
                        range.select();
                        unhighlightSelection(highlightStyleClass);

                        //取消标记，可能会把其他的节点的标记也取消了，所以要重新加上，否则不能正常删除span标签
                        for (var j = 0; j < i; j++) {
                            if (!$(spanList[j]).hasClass(highlightStyleClass)) {
                                range.selectNode(spanList[j]);
                                range.select();
                                highlightSelectedText(highlightStyleClass);
                            };
                        };

                        //紧挨着当前结点的其他标记也会受影响
                        $.each(spanSiblings,
                            function (index, item) {
                                if (!$(item).hasClass(highlightStyleClass)) {
                                    range.selectNode(item);
                                    range.select();
                                    highlightSelectedText(highlightStyleClass);
                                };
                            });
                    };
                };
            } else {
                unhighlightSelection(highlightStyleClass);
            };
            deserializeSelection("0:0,0:0"); //什么都不选中
        };

        //#endregion

        //#region 批注：增删改AJAX
        /**
         * 保存批注，返回jqXHR
         * @param {Number} arId 批注主键ID
         */
        function saveRemark(arId, whole) {
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                type: "post",
                dataType: "json",
                data: {
                    action: "SaveArticleRemark",
                    id: arId,
                    articlePartId: options.articlePartId,
                    serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                    remark: encodeURIComponent(getUEditorContent("txtRemark")),
                    selectedText: encodeURIComponent($("#hdSelectedText").val()), //选中的文本
                    operandId: options.operandId,
                    operandType: -(options.checkFileType),
                    tableModelId: (!checkValIsUndefinedOrNull(options.tableModelId) && options.tableModelId > 0)
                        ? options.tableModelId
                        : (-(options.checkFileType)),
                    whole: whole
                },
                beforeSend: function () {
                    open_loading();
                }
            }).always(function () {
                close_loading();
            });
            return jqxhr;
        };

        /**
         * 删除批注，返回jqXHR
         * @param {Number} arId 批注主键ID
         */
        function delRemark(arId) {
            var num = 1; //序号
            var sup = $("#" + options.remarkElementId + " span[class~='" + highlightStyleClass + "'][" + attrArticleRemarkId + "='" + arId + "']:eq(0)").find("sup");
            if (sup && sup.length > 0) {
                var supText = $(sup).text();
                if (!checkValIsUndefinedOrNull(supText) && supText.length >= 3) {
                    supText = supText.substring(1, supText.length - 1);
                    if (isNumber(supText) && supText > 0) {
                        num = supText;
                    }
                }
            }
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                type: "post",
                dataType: "json",
                data: {
                    action: "DelArticleRemark",
                    id: arId,
                    articlePartId: options.articlePartId,
                    serializedSelection: encodeURIComponent($("#hdSerializedSelection").val()), //如果不编码，冒号会被过滤
                    operandId: options.operandId,
                    operandType: -(options.checkFileType),
                    tableModelId: (!checkValIsUndefinedOrNull(options.tableModelId) && options.tableModelId > 0)
                        ? options.tableModelId
                        : (-(options.checkFileType)),
                    num: num
                },
                beforeSend: function () {
                    open_loading();
                }
            }).always(function () {
                close_loading();
            });
            return jqxhr;
        }

        /**
         * 获取批注详情，返回jqXHR
         * @param {Number} arId 批注主键ID
         */
        function getRemark(arId) {
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                data: {
                    action: "GetArticleRemark",
                    id: arId
                },
                type: "post",
                dataType: "json",
                beforeSend: function () {
                    open_loading();
                }
            }).always(function () {
                close_loading();
            });
            return jqxhr;
        }

        /**
         * 获取所有批注数据，返回jqXHR
         */
        function getRemarkList() {
            var jqxhr = $.ajax({
                url: "../Handler/ArticleRemarkRangyHandler.ashx",
                data: {
                    action: "GetArticleRemarkList",
                    articlePartId: options.articlePartId, //getUrlParam("sectionId"),
                    operandId: options.operandId,
                    operandType: -(options.checkFileType),
                    tableModelId: (!checkValIsUndefinedOrNull(options.tableModelId) && options.tableModelId > 0)
                        ? options.tableModelId
                        : (-(options.checkFileType))
                },
                type: "post",
                dataType: "json",
                beforeSend: function () {
                    open_loading();
                }
            })
                .always(function () {
                    close_loading();
                });
            return jqxhr;
        }
        //#endregion

        //#region 工具类rangy
        /**
         * 初始化工具类rangy
         */
        function initRangy() {
            try {
                rangy.init();
                highlighter = rangy.createHighlighter();
                highlighter.addClassApplier(rangy.createClassApplier(highlightStyleClass,
                    {
                        ignoreWhiteSpace: true,
                        tagNames: ["span"]
                    }));
                noStyleLighter = rangy.createHighlighter();
                noStyleLighter.addClassApplier(rangy.createClassApplier(noStyleClass,
                    {
                        ignoreWhiteSpace: true,
                        tagNames: ["span"]
                    }));
            } catch (ex) {
                myMessage("当前浏览器不支持划句批注功能，请更新至最新版本或更换为其他浏览器后重试。");
            }
        }

        /**
         * 解析JSON字符串
         * @param {String} jsonStr
         */
        function parseJson(jsonStr) {
            try {
                return JSON.parse(jsonStr);
            } catch (ex) {
                myMessage("当前浏览器不支持解析JSON字符串功能，请更新至最新版本或更换为其他浏览器后重试。");
                return [];
            }
        }

        /**
         * 选中区序列化
         */
        function serializeSelection() {
            var ss = rangy.serializeSelection(null, true, document.getElementById(options.remarkElementId));
            return ss;
        }

        /**
         * 反序列化，选中文本
         * @param {String} serializedValue 已经序列化后的位置
         */
        function deserializeSelection(serializedValue) {
            return rangy.deserializeSelection(serializedValue, document.getElementById(options.remarkElementId));
        }

        /**
         * 标记选中文本
         * @param {String} styleClassName CSS样式
         */
        function highlightSelectedText(styleClassName) {
            if (styleClassName == highlightStyleClass) {
                highlighter.highlightSelection(styleClassName, { containerElementId: options.remarkElementId });
            } else if (styleClassName == noStyleClass) {
                noStyleLighter.highlightSelection(styleClassName, { containerElementId: options.remarkElementId });
            }
        }

        /**
         * 删除选中文本的标记
         * @param {String} styleClassName CSS样式
         * @param {Boolean} clear 是否清除所有标记缓存
         */
        function unhighlightSelection(styleClassName, clear) {
            if (checkValIsUndefinedOrNull(clear)) {
                clear = false;
            }
            if (styleClassName == highlightStyleClass) {
                highlighter.unhighlightSelection();
                if (clear) {
                    highlighter.highlights = [];
                }
            } else if (styleClassName == noStyleClass) {
                noStyleLighter.unhighlightSelection();
                if (clear) {
                    noStyleLighter.highlights = [];
                }
            }
        }

        //#endregion

        //#region 接口
        rangyHelper.irangyRemark = rangyRemark;
        rangyHelper.ideserializeSelection = deserializeSelection;
        rangyHelper.ishowTooltip = showTooltip;
        rangyHelper.iopenDetailDialog = openDetailDialog;
        rangyHelper.ihasOverlap = hasOverlap;
        //#endregion

        //保存创建的实例
        if (RangyHelper.instanceCount <= 0) {
            RangyHelper.bindMouseup();
        }
        RangyHelper.instance[options.remarkElementId] = rangyHelper;
        RangyHelper.instanceCount++;
        return rangyHelper;
    },
    /**
     * 点击批注事件
     */
    bindMouseup: function () {
        var isSupportRangeOfTooltip = true;
        var rangyHelperOfTooltip = null;
        //划词
        $("body").off('mouseup', '.gxf_rangy_left').on("mouseup", ".gxf_rangy_left", function (e) {
            // 点击盒子的id
            var remarkElementId = $(this).prop("id");
            if (checkValIsUndefinedOrNull(remarkElementId)) {
                return;
            };

            try {
                rangyHelperOfTooltip = RangyHelper.instance[remarkElementId];
            } catch (ex) {
                if (console && console.error) {
                    console.error(ex);
                };
            };
            if (!rangyHelperOfTooltip) {
                return;
            };

            isSupportRangeOfTooltip = rangyHelperOfTooltip.ishowTooltip(e.pageX, e.pageY); //显示"批注"按钮

        }).off('mousedown', '.gxf_rangy_left').on('mousedown', '.gxf_rangy_left', function () {
            var tooltip = $("#tooltip");
            if (tooltip && tooltip.length > 0) {
                tooltip.remove();
            };
        });

        // 点击整体批注
        $("body").off('click', '.rangy_all').on("click", ".rangy_all", function () {
            // 点击盒子的id
            var remarkElementId = $(this).parent().parent().siblings(".gxf_rangy_left").prop("id");
            if (checkValIsUndefinedOrNull(remarkElementId)) {
                return;
            };
            try {
                rangyHelperOfTooltip = RangyHelper.instance[remarkElementId];
            } catch (ex) {
                if (console && console.error) {
                    console.error(ex);
                };
            };
            if (!rangyHelperOfTooltip) {
                return;
            };
            if (role == 1 || role == 2) {
                myMessage("您没有权限执行此操作！");
                return;
            }
            rangyHelperOfTooltip.iopenDetailDialog(-1, 1);
        });

        // 批注点击事件
        $("body").off('click', '#tooltip').on("click", "#tooltip", function () {
            var tooltip = $("#tooltip");
            if (tooltip && tooltip.length > 0) {
                tooltip.remove();
            }
            //权限
            if (role == 1 || role == 2) {
                myMessage("您没有权限执行此操作！");
                return;
            }
            //提示是否超出文本框
            if (isSupportRangeOfTooltip == -1) {
                myMessage("您所选择的内容超出文本框范围，请选择文本框内部的内容进行批注！");
                return;
            }
            //提示浏览器是否支持Range
            if (isSupportRangeOfTooltip == 0) {
                myMessage("当前浏览器不支持划句批注功能，请更新至最新版本或更换为其他浏览器后重试。");
                return;
            }
            if (rangyHelperOfTooltip) {
                //重叠判断
                rangyHelperOfTooltip.ideserializeSelection($("#hdSerializedSelection").val());
                if (rangyHelperOfTooltip.ihasOverlap() > 0) {
                    myMessage("请不要选择与已标记区域重叠的区域。");
                    return;
                }
                //弹窗
                rangyHelperOfTooltip.iopenDetailDialog(-1, 0);
            }
        });

        // 点击黄色区域
        $("body").off('click', '.highlight').on("click", ".highlight", function () {
            var arId = $(this).attr("articleremarkid");
            var rangyHelper = null;
            var eleId = $(this).closest("div[id]").prop("id");
            if (!checkValIsUndefinedOrNull(eleId)) {
                try {
                    rangyHelper = RangyHelper.instance[eleId];
                } catch (ex) {
                    if (console && console.error) {
                        console.error(ex);
                    };
                };
            };

            if (!checkValIsUndefinedOrNull(arId) && arId > 0 && rangyHelper) {
                rangyHelper.iopenDetailDialog(arId, 0);
            };
        });

        //点击“查看详情”
        $("body").off('click', '.gxf_rangy_conDetails a[arId]').on("click", ".gxf_rangy_conDetails a[arId]", function () {
            var arId = $(this).attr("arId");
            var whole = $(this).attr("whole");
            var version = $(this).attr("Version");
            var rangyHelper = null;
            var eleId = $(this).closest("ul[id]").prop("id");
            if (!checkValIsUndefinedOrNull(eleId) && eleId.indexOf('_') >= 0) {
                var temps = eleId.split('_');
                temps.shift();
                eleId = temps.join('_');
                rangyHelper = RangyHelper.instance[eleId];
                //highlightSelectedText(styleClassName)
            };
            if (!checkValIsUndefinedOrNull(eleId)) {
                try {
                    rangyHelper = RangyHelper.instance[eleId];
                } catch (ex) {
                    if (console && console.error) {
                        console.error(ex);
                    };
                };
            };
            if (!checkValIsUndefinedOrNull(arId) && arId > 0 && rangyHelper) {
                rangyHelper.iopenDetailDialog(arId, whole, version);
            };
        });
    }
};


