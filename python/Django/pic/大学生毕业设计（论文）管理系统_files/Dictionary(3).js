// 数据字典

/*
 * 六个文档、题目类型、题目来源自定义
 * 1 开题报告 2 中期检查   3 指导记录  4 外文译文和原件 5 文献综述 6 毕业设计（论文） 7 题目类型 8 题目来源
 */

function GetDictionaries() {
    var dictionaries = [
        { "自定义编号": 1, "名称": "开题报告" },
        { "自定义编号": 2, "名称": "中期检查" },
        { "自定义编号": 3, "名称": "指导记录" },
        { "自定义编号": 4, "名称": "外文译文和原件" },
        { "自定义编号": 5, "名称": "文献综述" },
        { "自定义编号": 6, "名称": "毕业论文" },
        { "自定义编号": 7, "名称": "题目类型" },
        { "自定义编号": 8, "名称": "题目来源" },
        { "自定义编号": 9, "名称": "任务书" },
        { "自定义编号": 10, "名称": "初期检查" },
        { "自定义编号": 11, "名称": "初稿" },
        { "自定义编号": 12, "名称": "主任" },
        { "自定义编号": 13, "名称": "副主任" },
        { "自定义编号": 14, "名称": "委员" },
        { "自定义编号": 15, "名称": "秘书" },
        { "自定义编号": 16, "名称": "写作记录卡" },
        { "自定义编号": 17, "名称": "成果类型" }
    ];
    $.ajax({
        url: "../Handler/UserHandler.ashx?action=GetSchoolYearDicName",
        dataType: "json",
        type: "POST",
        async: false,
        beforeSend: function () {
            open_loading();
        },
        success: function (data) {
            if (data && data.isSuccess && data.dataList && data.dataList.length > 0) {
                $.each(dictionaries, function (index, value) {
                    $.each(data.dataList, function (i, v) {
                        if (value["自定义编号"] == v["自定义编号"]) {
                            value["名称"] = v["名称"];
                            return false;
                        }
                    });
                });
            }
            sessionStorage.setItem("dictionaries", JSON.stringify(dictionaries));
        },
        error: function (err) {
            console.log(err);
            sessionStorage.setItem("dictionaries", JSON.stringify(dictionaries));
        },
        complete: function () {
            close_loading();
        }
    });
};

// 参数type表示自定义编号
function SetDictionary(type) {
    if (checkValIsUndefinedOrNull(type) && type > 0) {
        return false;
    } else {
        if (checkValIsUndefinedOrNull(sessionStorage.getItem("dictionaries"))) {
            GetDictionaries();
        }
        if (checkValIsUndefinedOrNull(sessionStorage.getItem("dictionaries"))) {
            var DicArr = [
                { "自定义编号": 1, "名称": "开题报告" },
                { "自定义编号": 2, "名称": "中期检查" },
                { "自定义编号": 3, "名称": "指导记录" },
                { "自定义编号": 4, "名称": "外文译文和原件" },
                { "自定义编号": 5, "名称": "文献综述" },
                { "自定义编号": 6, "名称": "毕业论文" },
                { "自定义编号": 7, "名称": "题目类型" },
                { "自定义编号": 8, "名称": "题目来源" },
                { "自定义编号": 9, "名称": "任务书" },
                { "自定义编号": 10, "名称": "初期检查" },
                { "自定义编号": 11, "名称": "初稿" },
                { "自定义编号": 12, "名称": "主任" },
                { "自定义编号": 13, "名称": "副主任" },
                { "自定义编号": 14, "名称": "委员" },
                { "自定义编号": 15, "名称": "秘书" },
                { "自定义编号": 16, "名称": "写作记录卡" },
                { "自定义编号": 17, "名称": "成果类型" }
            ];
        } else {
            var DicArr = JSON.parse(sessionStorage.getItem("dictionaries"));
        }
        var name = '';
        for (var i = 0; i < DicArr.length; i++) {
            if (DicArr[i]["自定义编号"] == type) {
                name = DicArr[i]["名称"];
                break;
            }
        }
        return name;
    }
};