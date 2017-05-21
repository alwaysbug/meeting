//Minicc列表
api.get("minicc/list",{},miniccList);
function miniccList(data) {
    if (data.code === 0){
        $("#mini-tree-menu").children().remove();
        $("#mini-tree-menu").append($('<h4 class="font-light m-b-xs" id="miniccV1">Mini CC一代</h4><div style="display: none;" id="mini-append-line"></div><h4 class="font-light m-b-xs" id="miniccV2">Mini CC二代</h4>'));
        var arr = data.data;
        for (var i = 0;i < arr.length;i++){
            var status = "";
            switch (arr[i].device_status){
                case 1:
                    status = "离线";
                    break;
                case 2:
                    status = "在线";
                    break;
                case 3:
                    status = "故障";
                    break;
                default:
                    break;
            }
            if(arr[i].device_type == 1){
                var li1 = $('<li minicc-id="'+ arr[i].device_id +'" device_seq="'+ arr[i].device_seq +'" device_type="'+ arr[i].device_type +'"><span class="ico_open"></span> <span class="mini_name" style="margin-left: 10px">'+ arr[i].device_name +'</span><span class="mini_status_online">('+ status +')</span></li>');
                $("#mini-append-line").before(li1);
            }else{
                var li2 = $('<li minicc-id="'+ arr[i].device_id +'" device_seq="'+ arr[i].device_seq +'" device_type="'+ arr[i].device_type +'"><span class="ico_open"></span> <span class="mini_name" style="margin-left: 10px">'+ arr[i].device_name +'</span><span class="mini_status_online">('+ status +')</span></li>')
                $("#miniccV2").after(li2);
            }
        }
        $("#mini-tree-menu").children('li').eq(0).trigger("click");
    }else{
        toastrFail(data.message);
    }
}
//面板列表
api.get("equipment_panel/publicPanel",{},function (json) {
    if(json.code == 0){
        var arr = json.data;
        var panelTreeDom = $("#panels-tree");
        panelTreeDom.children().remove();
        for(var i = 0;i < arr.length;i++){
            var dom = $('<li panel-id="'+ arr[i].panel_id +'" panel-index="'+ arr[i].panel_index +'"><span class="ico_open"></span> <span>'+ arr[i].panel_name +'</span></li>');
            panelTreeDom.append(dom);
        }
        $("#panels-tree").children('li').eq(0).trigger("click");
    }else{
        toastrFail(json.message);
    }
})

//树状列表点击事件

$("#mini-tree-menu").on("click","li",function () {
    var _this = $(this);
    $("#mini-tree-menu").children("li").removeClass("clickActive");
    _this.addClass("clickActive");
    api.get("equipment_scene/scene",{"device_id":$(this).attr("minicc-id")},scenesOfMinicc);
});
$("#panels-tree").on("click","li",function () {
    var _this = $(this);
    $("#panels-tree").children("li").removeClass("clickActivePanel");
    _this.addClass("clickActivePanel");
    var param = {
        "device_id":getDeviceId(),
        "panel_index":getPanelIndex()
    };
    api.get("equipment_panel/publicButton",param,panelsOfMinicc);
});
var getPanelId = function () {
    return $(".clickActivePanel").attr("panel-id");
};
var getPanelIndex = function () {
    return $(".clickActivePanel").attr("panel-index");
};


var buttonIndexArr = [];//要disabled从abled的普通互锁select选项框

var panelsOfMinicc = function (json) {
    if (json.code == 0){
        var datas = json.data;
        var tbody = $("#btn_table tbody");
        tbody.children().remove();
        for (var i = 0;i < datas.length;i++){

            var tr = $('<tr button-index="'+ datas[i].button_index +'"><td rowspan="2" style="line-height:60px;">'+ datas[i].button_name +' <button class="btn btn-info btn-xs activation-button">启用</button></td><td rowspan="2"><select class="form-control m-b btnType"style="margin-top: 10px;" disabled><option value="1">普通键</option><option value="2">自锁键</option><option value="3">互锁键</option></select></td><td>按下</td><td><button type="button" class="btn btn-info btn-xs btn-press-control btn-press-down" disabled>控制项</button></td></tr><tr><td>弹起</td><td><button type="button" class="btn btn-info btn-xs btn-press-control btn-press-up" disabled>控制项</button></td></tr>');

            tbody.append(tr);
        }
        api.get("equipment_panel/getButtonSet",{"device_id":getDeviceId(),"panel_index":getPanelIndex()},function (json) {
            if (json.code == 0){
                var data = json.data;
                buttonIndexArr = [];
                for(var i = 0;i < data.length;i++){
                    buttonIndexArr.push(data[i].button_index);
                    var d = tbody.find($("tr[button-index='"+ data[i].button_index +"']"));
                    d.find($("button")).prop("disabled",false);
                    d.next().find($("button")).prop("disabled",false);
                    d.find($(".activation-button")).remove();
                }
            }else{
                toastrFail(json.message);
            }
        })

    }else{
        toastrFail(json.message);
    }
};

var scenesOfMinicc = function (json) {
    if (json.code == 0){
        var arr = json.data;
        scenesToTable(arr);
    }else{
        toastrFail(json.message);
    }
};
var scenesToTable = function (args) {
    var scenesTbody = $("#scenes-table tbody");
    scenesTbody.children().remove();
    var arr = args;
    if (arr.length == 0){
        var tr = $('<tr><td colspan="4" style="text-align: center">暂无场景</td></tr>');
        tr.appendTo(scenesTbody);
    }else{

        for (var i = 0;i < arr.length;i++){
            var state = "";
            if (arr[i].state == 1){
                state = "闲置";
            }else if(arr[i].state == 2){
                state = "启用";
            }
            var tr = $('<tr scene-id="'+ arr[i].scene_id +'" launch-mode="'+ arr[i].launch_mode +'" scene-delay="'+ arr[i].scene_delay +'"><td><input type="checkbox" class="check"></td><td>'+ arr[i].scene_name +'</td><td>'+ state +'</td><td><button class="btn btn-default btn-xs btn-edit-scenes-control">编辑</button> <button class="btn btn-primary btn-xs add-control-btn">控制项</button> <button class="btn btn-info btn-xs">应用</button></td></tr>');
            tr.appendTo(scenesTbody);
        }
        checkOrCancel(".checkAll",".check");
    }
}
//重新刷新场景表格
var refreshTable = function () {
    api.get("equipment_scene/scene",{"device_id":getDeviceId()},scenesOfMinicc);
}
//添加场景
$(".btn-add-scene-submit").on("click",function () {
    var sceneName = $(".scenes-name-input").val();
    var launchMode = $("input[name=startMethod]:checked").val();
    var sceneDelay = "";
    if (launchMode == 1){
        sceneDelay = "0";
    }else if (launchMode == 2){
        sceneDelay = $("#timeOutTime").val();
    }
    var param = {
        "scene_name":sceneName,
        "launch_mode":launchMode,
        "scene_delay":sceneDelay,
        "device_id":getDeviceId()
    };
    api.userPost("equipment_scene/addScene",param,function (json) {
       if (json.code == 0){
           resetInit($("#myModal8"));
           $("#myModal8").modal("hide");
           refreshTable();
       }else{
           toastrFail(json.message);
       }
    });
});

var resetInit = function (dom) {
    dom.find($("input[type=number]")).val("");
    dom.find($("input[type=text]")).val("");
    dom.find($("input[type=radio]:eq(0)")).prop("checked",true);
    $("#timeOutTime").hide();
}
$("#myModal8 input[type=radio]").on("click",function () {
   if ($("#timeOutStart").prop("checked")){
        $("#timeOutTime").show();
   }else{
       $("#timeOutTime").val("");
       $("#timeOutTime").hide();
   }
});
$("#editScenes input[type=radio]").on("click",function () {
    if ($("#isTimeOutStart").prop("checked")){
        $("#editTimeOutTime").show();
    }else{
        $("#editTimeOutTime").val("");
        $("#editTimeOutTime").hide();
    }
});

var addScenesPanelDom = $("#myModal8");

addScenesPanelDom.on("click",".sure_empty_btn",function () {
    addScenesPanelDom.modal("hide");
    addScenesToTable();
   //  var url = "";
   //  var param = {
   //
   //  };
   // api.userPost(url,param,function (json) {
   //     if(json.code == 0){
   //         addScenesPanelDom.modal("hide");
   //          addScenesToTable();
   //     }else{
   //         toastrFail(json.message);
   //     }
   // })
});


var addScenesToTable = function () {
    var scenesName = $(".scenes-name").val();
    var tr = $('<tr><td><input type="checkbox"></td><td>'+ scenesName +'</td><td>使用中</td><td><button class="btn btn-default btn-sm add-control-btn">控制项</button> <button class="btn btn-info btn-sm">应用</button></td></tr>');
    tr.appendTo($("#scenes-table tbody"));
}

var flexVolume = $(".flexVolume");
flexVolume.on("mouseover","div",function () {
    var _this = $(this);
    flexVolume.children("div").css("backgroundColor","#ffffff");
    flexVolume.children("div").css("color","#6a6c6f");
    _this.css("backgroundColor","#7b9ce4");
    _this.css("color","#ffffff");
});
flexVolume.on("click","div",function () {
    var _this = $(this);
    flexVolume.children("div").removeClass("clickLi");
    _this.addClass("clickLi");
});
flexVolume.on("mouseleave",function () {
    flexVolume.children("div").css("backgroundColor","#ffffff");
    flexVolume.children("div").css("color","#6a6c6f");
});

//点击表格按钮  弹出场景控制项操作面板
$(document).on("click",".add-control-btn",function () {
    $("#myScenesControls").modal("show");
    $("#myScenesControls").find($(".form-horizontal")).attr("scene-id",$(this).parent().parent().attr("scene-id"));
    initShowPanel($(this).parent().parent().attr("scene-id"));

});

//场景控制项数据获取及显示
var showTheScene = function (data) {
    var sceneDom = $("#scenes-controls").find($(".flexVolume"));
    sceneDom.children().remove();
    for (var i = 0;i < data.length;i++){
        //当前值
        var currentV = "";
        if(data[i].option_details.control_type == 5){

            for(var j = 0; j < data[i].option_details.options.length;j++){

                if (data[i].control_value == data[i].option_details.options[j].option_value){
                        currentV = data[i].option_details.options[j].option_name;
                }
            }
        }else if(data[i].option_details.control_type == 2){
            currentV = data[i].control_value;
        }else if(data[i].option_details.control_type == 1){
            currentV = data[i].control_value;
        }

        //当前延迟时间
        var time = "";
        if (data[i].time_type == 0){
            time = "";
        }else if(data[i].time_type == 1){
            time = '<small>延时:'+ data[i].timer +'</small>';
        }
        var dom = $('<div interface-type="'+ data[i].interface_type +'" control-id="'+ data[i].option_details.control_id +'" control-type="'+ data[i].option_details.control_type +'" scene-control-id="'+ data[i].scene_control_id +'"><div class="flex-a"><i class="fa fa-times-circle-o delete-model"></i></div><i class="pe-7s-paperclip"></i><span>'+ data[i].option_details.control_name +'</span>'+ time +'</div>');
        sceneDom.append(dom);
    }
    var dom2 = $('<div class="add-model"><i class="fa fa-plus-circle"></i><span>添加控制项</span></div>');
    sceneDom.append(dom2);

}

$("#myScenesControls").on("click",".delete-model",function (e) {
    e.stopPropagation();
    if (confirm("确定删除该控制项？")){
        var param = {
            "scene_control_id":$(this).parent().parent().attr("scene-control-id"),
            "device_id":getDeviceId()
        };
        api.userPost("equipment_scene/softDeleteSceneOption",param,function (json) {
            if(json.code == 0){
                initShowPanel($("#myScenesControls").find($(".form-horizontal")).attr("scene-id"));
            }else{
                toastrFail(json.message);
            }
        });
        return
    }
});
$(document).on("click",".btn-edit-scenes-control",function () {
    $("#editScenes").modal("show");
    var _this = $(this);
    var val = _this.parent().prev().prev().html();
    $(".scenes-name").val(val);
    var sceneId = _this.parent().parent().attr("scene-id");
    var launchMode = _this.parent().parent().attr("launch-mode");
    var sceneDelay = _this.parent().parent().attr("scene-delay");
    $("#editScenes").find($(".form-horizontal")).attr("scene-id",sceneId);
    if (launchMode == 2){
        $("#editScenes").find($("input[name=startMethodEdit]").eq(1)).prop("checked",true);
        $("#editTimeOutTime").show();
        $("#editTimeOutTime").val(sceneDelay);
    }else{
        $("#editScenes").find($("input[name=startMethodEdit]").eq(0)).prop("checked",true);
        $("#editTimeOutTime").hide();
        $("#editTimeOutTime").val("");
    }
});
$(document).on("click",".btn-edit-submit",function () {
    var launch_mode = $("#editScenes").find($("input[type=radio]:checked")).val();
    var scene_delay = "";
    if (launch_mode == 1){
        scene_delay = "0";
    }else{
        scene_delay = $("#editTimeOutTime").val();
    }
    var param = {
        "scene_name":$(".scenes-name").val(),
        "launch_mode":launch_mode,
        "scene_delay":scene_delay,
        "device_id":getDeviceId(),
        "scene_id":$("#editScenes").find($(".form-horizontal")).attr("scene-id")
    };
    api.userPost("equipment_scene/editScene",param,function (json) {
        if(json.code == 0){
            $("#editScenes").modal("hide");
            refreshTable();
        }else{
            toastrFail(json.message);
        }
    });
});
//删除场景
$("#deleteScenes").on("click",function () {
    var checks = $(".check:checked");
    if (checks.length == 0){
        toastrFail("未选择任何场景");
        return;
    }else{

        if (confirm("确定删除场景？")){
            for (var i = 0;i < checks.length;i++){
                var id = checks.eq(i).parent().parent().attr("scene-id");
                var device_id = getDeviceId();
                var param = {
                    "scene_id":id,
                    "device_id":device_id
                };
                api.userPost("equipment_scene/softDeleteScene",param,function (json) {
                    if (json.code == 0){
                        toastrFail("删除成功");
                        refreshTable();
                    }else{
                        toastrFail(json.message);
                    }
                });
            }
        }
    }
});
var globalSceneObj = null;//初始化全局对象   存储场景控制项数据
var initShowPanel = function (sceneId) {
    $("#add-control").remove();
    $("#delay-time").remove();
    $("#scenes-controls").show();
    $(".back-prev-btn").remove();
    $(".btn-sure-add-control").remove();
    $(".btn-save-edit-control").remove();
    var param = {
        "device_id":getDeviceId(),
        "scene_id":sceneId
    };
    api.get("equipment_scene/sceneOption",param,function (json) {
        if(json.code == 0){
            globalSceneObj = json;
            showTheScene(json.data);
        }else{
            toastrFail(json.message);
        }
    });
};

var scenesControls = $("#myScenesControls");
//点击浮动控制项 更改延迟时间
scenesControls.on("click","#scenes-controls .flexVolume div",function () {
    if ($(this).hasClass("add-model")){
        return;
    }else{
        var sceneControlId = $(this).attr("scene-control-id");
        editSceneControl(globalSceneObj,sceneControlId);
    }
});

//修改场景控制项
var editSceneControl = function (json,sceneControlId) {
    $("#scenes-controls").hide();
    $("#delay-time").remove();
    var data = json.data;

    for (var i = 0;i < data.length;i++){
        if (data[i].scene_control_id == sceneControlId){
            if(data[i].option_details.control_type == 5){
                var op = "";
                for(var j = 0;j < data[i].option_details.options.length;j++){
                    op += "<option control-id='"+ data[i].option_details.options[j].control_id +"' value='"+ data[i].option_details.options[j].option_value  +"'>";
                    op += data[i].option_details.options[j].option_name;
                    op += "</option>";
                }

                var delayDom = $('<div id="delay-time" interface-index="'+ data[i].interface_index +'" interface-type="'+ data[i].interface_type +'" scene-control-id="'+ data[i].scene_control_id +'" scene-id="'+ data[i].scene_id +'" control-category="'+ data[i].control_category +'" control-id="'+ data[i].control_id +'" control-value="'+ data[i].option_details.control_value +'"><div class="form-group"><label class="col-sm-2 control-label">'+ data[i].option_details.control_name +'</label><div class="col-sm-10"><select class="form-control m-b edit-select-b">'+ op +'</select></div></div><div class="hr-line-dashed"></div><div class="form-group" ><label class="col-sm-2 control-label">延迟时间</label><div class="col-sm-10"><input type="number" class="form-control edit-delay-time-b" placeholder="重新修改延迟时间(0~999ms)"></div></div></div>');
                scenesControls.find($(".form-horizontal")).append(delayDom);
                delayDom.find($(".edit-select-b option[value='"+ data[i].control_value +"']")).prop("selected",true);
                var backBtnDom = $('<button type="button" class="btn btn-info back-prev-btn">返回上一级</button>');
                scenesControls.find($(".modal-footer")).prepend(backBtnDom);
                var saveBtnDom = $('<button type="button" class="btn btn-primary btn-save-edit-control">保存</button>');
                scenesControls.find($(".modal-footer")).append(saveBtnDom);

            }else if (data[i].option_details.control_type == 1){
                var delayDom = $('<div id="delay-time" interface-index="'+ data[i].interface_index +'" interface-type="'+ data[i].interface_type +'" scene-control-id="'+ data[i].scene_control_id +'" scene-id="'+ data[i].scene_id +'" control-category="'+ data[i].control_category +'" control-value="'+ data[i].option_details.control_value +'"><div class="form-group"><label class="col-sm-2 control-label">延迟时间</label><div class="col-sm-10"><input type="number" class="form-control edit-delay-time-b" placeholder="重新修改延迟时间(0~999ms)"></div></div></div>');
                scenesControls.find($(".form-horizontal")).append(delayDom);
                var backBtnDom = $('<button type="button" class="btn btn-info back-prev-btn">返回上一级</button>');
                scenesControls.find($(".modal-footer")).prepend(backBtnDom);
                var saveBtnDom = $('<button type="button" class="btn btn-primary btn-save-edit-control">保存</button>');
                scenesControls.find($(".modal-footer")).append(saveBtnDom);
            }
        }
    }
}

//延迟时间更改保存
scenesControls.on("click",".btn-save-edit-control",function () {
    var delayDom = $("#myScenesControls").find($("#delay-time"));
    var val = $(".edit-delay-time-b").val();
    var timeType = 0;
    if(val){
        timeType = 1;
    }
    var param = {
        "device_id":getDeviceId(),
        "scene_id":delayDom.attr("scene-id"),
        "control_id":delayDom.attr("control-id"),
        "scene_control_id":delayDom.attr("scene-control-id"),
        "interface_type":delayDom.attr("interface-type"),
        "interface_index":delayDom.attr("interface-index"),
        "control_value":$(".edit-select-b option:selected").val() || delayDom.attr("control-value"),
        "control_category":delayDom.attr("control-category"),
        "time_type":timeType,
        "timer":val || "0",
    }
    api.userPost("equipment_scene/editSceneOption",param,function (json) {
        if(json.code == 0){
            console.log("修改成");
            console.log(json);
            initShowPanel($("#myScenesControls").find($(".form-horizontal")).attr("scene-id"));
        }else{
            toastrFail(json.message);
        }
    })
});

//场景增加控制项
scenesControls.on("click",".add-model",function () {
    $("#scenes-controls").hide();
    $("#delay-time").remove();
    $("#add-control").remove();
    $(".back-prev-btn").remove();
    api.get("minicc/equipments",{"minicc_id":getDeviceId()},function (json) {
        if (json.code == 0) {
            var datas = json.data.equipments;
            var op = "";
            for (var i = 0; i < datas.length; i++) {
                op += '<option interface-index="'+ datas[i].interface_index +'" interface-type="'+ datas[i].interface_type +'" value="' + datas[i].equipment_id + '">';
                op += datas[i].equipment_name;
                op += '</option>';
            }
            var addControlDom = $('<div id="add-control"><div class="form-group"><label class="col-sm-2 control-label">选择设备</label><div class="col-sm-10"><select class="form-control m-b scene-sec-device"><option value="">请选择设备</option>'+ op +'</select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">选择模块</label><div class="col-sm-10"><select class="form-control m-b scene-sec-model"><option value="">请选择模块</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">选择控制项</label><div class="col-sm-10"><select class="form-control m-b scene-sec-control"><option value="">请选择控制项</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">延迟时间</label><div class="col-sm-10"><input type="number" class="form-control" id="input-a" placeholder="0~99999ms(不填为无延迟)"></div></div></div>');
            scenesControls.find($(".form-horizontal")).append(addControlDom);
            var backBtnDom = $('<button type="button" class="btn btn-info back-prev-btn">返回上一级</button>');
            scenesControls.find($(".modal-footer")).prepend(backBtnDom);
            var sureDom = $('<button type="button" class="btn btn-primary btn-sure-add-control">确定</button>');
            scenesControls.find($(".modal-footer")).append(sureDom);
        }else{
            toastrFail(json.message);
        }
    });
});

$(".scene-sec-model").select2();
//设备、模块、控制项三级联动
scenesControls.on("change",".scene-sec-device",function () {
    $(".scene-sec-model").children().remove();
    $(".scene-sec-control").children().remove();
    $(".scene-sec-model").append($("<option>请选择模块</option>"));
    $(".scene-sec-control").append($("<option>请选择控制项</option>"));

    var param = {
        "equipment_id":$(this).val()
    };
    api.userPost("equipment_controller/getEquipmentDefaultModel",param,function (json) {


        if (json.code == 0){
            var datas = json.data;
            if (datas.length != 0){
                var op = "";
                for (var i = 0;i < datas.length;i++){
                    op += '<option value="'+ datas[i].id +'">';
                    op += datas[i].model_name;
                    op += '</option>';
                }
                var ops = $('<optgroup data-value="1" label="缺省模块">'+ op +'</optgroup>');
                $('.scene-sec-model').append(ops);
            }
            api.userPost("equipment_controller/getModel",param,function (data) {

                if (json.code == 0){
                    var arr = data.data;
                    if (arr.length != 0){
                        var o = "";
                        for (var i = 0;i < arr.length;i++){
                            o += '<option value="'+ arr[i].id +'">';
                            o += arr[i].model_name;
                            o += '</option>';
                        }

                        var os = $('<optgroup data-value="2" label="自定义模块">'+ o +'</optgroup>');
                        $('.scene-sec-model').append(os);
                    }


                }else{
                    toastrFail(json.message);
                }
            });
        }else{
            toastrFail(json.message);
        }
    });
});

var optionDataObj = null;//用来存放选择控制项时候的返回对象   便于选择control-type为5时候的信息处理
scenesControls.on("change",".scene-sec-model",function () {
    $(".scene-sec-control").children().remove();
    $(".scene-sec-control").append($("<option>请选择控制项</option>"));
    var dataValue = $(".scene-sec-model option:selected").parent().attr("data-value");
    if (dataValue == 1){
        var param = {
            "equipment_id":$(".scene-sec-device option:selected").val(),
            "model_id":$(".scene-sec-model option:selected").val()
        }
        api.userPost("equipment_controller/getEquipmentDefaultOption",param,function (json) {
            if (json.code == 0){
                controlsSec(json.data);
                optionDataObj = json.data;
            }else{
                toastrFail(json.message);
            }
        });
    }else if(dataValue == 2){

        var param = {
            "equipment_id":$(".scene-sec-device option:selected").val(),
            "model_id":$(".scene-sec-model option:selected").val()
        };
        api.userPost("equipment_controller/getOption",param,function (json) {
            if (json.code == 0){
                controlsSec(json.data);
                optionDataObj = json.data;
            }else{
                toastrFail(json.message);
            }
        });
    }

});

var controlsSec = function (data) {
    var op = "";
    for (var item in data){
        op += '<option control-type="'+ data[item].control_type +'" value="' + data[item].control_id + '">';
        op += data[item].control_name;
        op += '</option>';
    }
    $(".scene-sec-control").append(op);
};
//点击场景选择控制项时根据control-type显示不同控制项信息
scenesControls.on("change",".scene-sec-control",function () {
    var thisOption = $(this).children("option:selected").attr("control-type");
    $(".volume-a").remove();
    $(".matix-a").remove();
    if (thisOption == 2){
        var input = $('<div class="volume-a"><div class="form-group"><label class="col-sm-2 control-label">'+ $(this).children("option:selected").html() +'</label><div class="col-sm-10"><input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="50"/> <span id="ex6CurrentSliderValLabel">当前'+ $(this).children("option:selected").html() +': <span id="ex6SliderVal">0</span></span></div></div><div class="hr-line-dashed"></div></div>');
        $("#add-control").children().last().before(input);
        //音量控件显示
        var mySlider = $("#ex1").bootstrapSlider();
        var volumeValue = mySlider.bootstrapSlider('getValue');
        $('#ex1').bootstrapSlider({
            tooltip_position:'bottom',
            formatter: function(value) {
                volumeValue = value;
                return '当前'+ $(".scene-sec-control").children("option:selected").html() +':' + value;
            }
        });
        $("#ex1").on("change", function() {
            $("#ex6SliderVal").text(volumeValue);
        });
    }else if(thisOption == 5){
        whileControlType5(optionDataObj);
    }
});


//control-type = 5  寻找被选择的控制项，并将option展示
var whileControlType5 = function (optionDataObj) {
    var val = $(".scene-sec-control option:checked").val();
    for (var item in optionDataObj){
        if (optionDataObj[item].control_id == val){
            var option = "";
            for (var i = 0;i < optionDataObj[item].options.length;i++){
                option += '<option control-id="'+ optionDataObj[item].options[i].control_id +'" value="'+ optionDataObj[item].options[i].option_value +'">';
                option += optionDataObj[item].options[i].option_name;
                option += '</option>';
            };
            var dom = $('<div class="matix-a"><div class="form-group"><label class="col-sm-2 control-label">'+ optionDataObj[item].control_name +'</label><div class="col-sm-10"><select class="form-control m-b scene-c">'+ option +'</select></div></div><div class="hr-line-dashed"></div></div>');
            $("#add-control").children().last().before(dom);
        }
    }
}


scenesControls.on("click",".back-prev-btn",function () {
    initShowPanel($("#myScenesControls").find($(".form-horizontal")).attr("scene-id"));
});

scenesControls.on("click",'.btn-sure-add-control',function () {
   //

    var sceneControler = $(".scene-sec-control option:selected");
    var currentValue = "";
    //根据sceneControler值判断当前value值发送的内容
    if (sceneControler.attr("control-type") == 1){
        currentValue = sceneControler.val();
    }else if(sceneControler.attr("control-type") == 2){
        var mySlider = $("#ex1").bootstrapSlider();
        currentValue = mySlider.bootstrapSlider('getValue');
    }else if(sceneControler.attr("control-type") == 5){
        currentValue = $(".scene-c option:selected").val();
    }
    var timeType = 1;
    if (!$("#input-a").val()){
        timeType = 0;
    }else{
        timeType = 1;
    };
    //类别id
    var category = 1;

    if ($(".scene-sec-model option:selected").parent().attr("data-value") == 1){
        category = 3;
    }else if($(".scene-sec-model option:selected").parent().attr("data-value") == 2){
        category = 2;
    }
    var param = {
        "model_name":$(".scene-sec-model option:selected").html(),
        "equipment_id":$(".scene-sec-device option:selected").val(),
        "device_id":getDeviceId(),
        "scene_id":$("#myScenesControls").find($('.form-horizontal')).attr("scene-id"),
        "control_id":$(".scene-sec-control option:selected").val(),
        "interface_type":$(".scene-sec-device option:selected").attr("interface-type"),
        "interface_index":$(".scene-sec-device option:selected").attr("interface-index"),
        "control_category":category,
        "control_type":$(".scene-sec-control option:selected").attr("control-type"),
        "control_value":currentValue,
        "time_type":timeType,
        "timer":$("#input-a").val()
    };
    api.userPost("equipment_scene/addSceneOption",param,function (json) {
        if (json.code == 0){
            initShowPanel($("#myScenesControls").find($(".form-horizontal")).attr("scene-id"));
        }else{
            toastrFail(json.message);
        }
    });
});


//面板
var tableDom = $("#btn_table");
tableDom.on("click",".btn-press-control",function () {
    $("#myModalSmall").modal("show");

    var domMyModal = $("#myModalSmall").find($(".form-horizontal"));
    var buttonOption = 1;
    if($(this).hasClass("btn-press-down")){
        buttonOption = 1;
        domMyModal.attr("button-index",$(this).parent().parent().attr("button-index"));
        domMyModal.attr("button-option",buttonOption);
    }else if($(this).hasClass("btn-press-up")){
        buttonOption = 2;
        domMyModal.attr("button-index",$(this).parent().parent().prev().attr("button-index"));
        domMyModal.attr("button-option",buttonOption);
    }
    var param = {
        "device_id":getDeviceId(),
        "panel_index":getPanelIndex(),
        "button_index":$(this).parent().parent().attr("button-index") || $(this).parent().parent().prev().attr("button-index"),
        "button_option":buttonOption
    };
    api.get("equipment_panel/panelOption",param,function (json) {
       if(json.code == 0){
           initShowPanelsPanel();
       }else{
           toastrFail(json.message);
       }
    });
});

//点击面板配置控制项弹性布局div
var myModalSmall = $("#myModalSmall");
myModalSmall.on("click","#panel-controls .flexVolume div",function () {
    if ($(this).hasClass("add-model")){
        return;
    }else{
        $("#panel-controls").hide();
        $("#panel-delay-time").remove();
        var delayDom = $('<div class="form-group" id="panel-delay-time"><label class="col-sm-2 control-label">延迟时间</label><div class="col-sm-8"><input type="number" class="form-control change_panel_control_time" placeholder="重新修改延迟时间(0~999ms)"></div><div class="col-sm-2"><button class="btn btn-info btn-save-panel-delay-time">保存</button></div></div>');
        myModalSmall.find($(".form-horizontal")).append(delayDom);
        var backBtnDom = $('<button type="button" class="btn btn-info btn-back-prev-panel">返回上一级</button>');
        myModalSmall.find($(".modal-footer")).prepend(backBtnDom);
    }
});
//面板延迟时间更改保存
myModalSmall.on("click",".btn-save-panel-delay-time",function () {
    initShowPanelsPanel();
});

//面板增加控制项
myModalSmall.on("click",".add-model",function () {
    $("#panel-controls").hide();
    $("#panel-delay-time").remove();
    $("#panel-add-control").remove();
    $(".btn-back-prev-panel").remove();
    $("#btn-sure-add-panel-control").remove();
    api.get("minicc/equipments",{"minicc_id":getDeviceId()},function (json) {
       if (json.code == 0){
           var datas = json.data.equipments;
           var op = "";
           for (var i = 0;i < datas.length;i++){
               op += '<option interface-index="'+ datas[i].interface_index +'" interface-type="'+ datas[i].interface_type +'" value="' + datas[i].equipment_id + '">';
                op += datas[i].equipment_name;
                op += '</option>';
           }
           var addControlDom = $('<div id="panel-add-control"><div class="form-group"><label class="col-sm-2 control-label">选择设备</label><div class="col-sm-10"><select class="form-control m-b sec-device"><option value="">请选择设备</option>'+ op +'</select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">选择模块</label><div class="col-sm-10"><select class="form-control m-b panel-sec-model"><option value="">请选择模块</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">选择控制项</label><div class="col-sm-10"><select class="form-control m-b panel-sec-control"><option value="">请选择控制项</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">延迟时间</label><div class="col-sm-10"><input type="number" class="form-control" id="input-b" placeholder="0~99999ms(不填为无延迟)"></div></div></div>');
           myModalSmall.find($(".form-horizontal")).append(addControlDom);
           var backBtnDom = $('<button type="button" class="btn btn-info btn-back-prev-panel">返回上一级</button>');
           var sureDom = $('<button type="button" class="btn btn-primary btn-sure-add-panel-control">确定</button>');
           myModalSmall.find($(".modal-footer")).prepend(backBtnDom);
           myModalSmall.find($(".modal-footer")).append(sureDom);

       }else{
           toastrFail(json.message);
       }
    });

});


$(".panel-sec-model").select2();
//面板设备、模块、控制项三级联动
myModalSmall.on("change",".sec-device",function () {
    $(".panel-sec-model").children().remove();
    $(".panel-sec-control").children().remove();
    $(".panel-sec-model").append($("<option>请选择模块</option>"));
    $(".panel-sec-control").append($("<option>请选择控制项</option>"));

    var param = {
        "equipment_id":$(this).val()
    };
    api.userPost("equipment_controller/getEquipmentDefaultModel",param,function (json) {


        if (json.code == 0){
            var datas = json.data;
            if (datas.length != 0){
                var op = "";
                for (var i = 0;i < datas.length;i++){
                    op += '<option value="'+ datas[i].id +'">';
                    op += datas[i].model_name;
                    op += '</option>';
                }
                var ops = $('<optgroup data-value="1" label="缺省模块">'+ op +'</optgroup>');
                $('.panel-sec-model').append(ops);
            }
            api.userPost("equipment_controller/getModel",param,function (data) {

                if (json.code == 0){
                    var arr = data.data;
                    if (arr.length != 0){
                        var o = "";
                        for (var i = 0;i < arr.length;i++){
                            o += '<option value="'+ arr[i].id +'">';
                            o += arr[i].model_name;
                            o += '</option>';
                        }

                        var os = $('<optgroup data-value="2" label="自定义模块">'+ o +'</optgroup>');
                        $('.panel-sec-model').append(os);
                    }


                }else{
                    toastrFail(json.message);
                }
            });
        }else{
            toastrFail(json.message);
        }
    });
});

var panelOptionObj = null;//用来存放选择控制项时候的返回对象   便于选择control-type为5时候的信息处理
myModalSmall.on("change",".panel-sec-model",function () {
    $(".panel-sec-control").children().remove();
    $(".panel-sec-control").append($("<option>请选择控制项</option>"));
    var dataValue = $(".panel-sec-model option:selected").parent().attr("data-value");
    if (dataValue == 1){
        var param = {
            "equipment_id":$(".sec-device option:selected").val(),
            "model_id":$(".panel-sec-model option:selected").val()
        }
        api.userPost("equipment_controller/getEquipmentDefaultOption",param,function (json) {
            if (json.code == 0){
                controlsSecPanel(json.data);
                panelOptionObj = json.data;
            }else{
                toastrFail(json.message);
            }
        });
    }else if(dataValue == 2){

        var param = {
            "equipment_id":$(".sec-device option:selected").val(),
            "model_id":$(".panel-sec-model option:selected").val()
        };
        api.userPost("equipment_controller/getOption",param,function (json) {
            if (json.code == 0){
                controlsSecPanel(json.data);
                panelOptionObj = json.data;
            }else{
                toastrFail(json.message);
            }
        });
    }

});

var controlsSecPanel = function (data) {
    var op = "";
    for (var item in data){
        op += '<option control-type="'+ data[item].control_type +'" value="' + data[item].control_id + '">';
        op += data[item].control_name;
        op += '</option>';
    }
    $(".panel-sec-control").append(op);
};

//点击面板选择控制项时根据control-type显示不同控制项信息
myModalSmall.on("change",".panel-sec-control",function () {
    var thisOption = $(this).children("option:selected").attr("control-type");
    $(".volume-b").remove();
    $(".matix-b").remove();
    if (thisOption == 2){
        var input = $('<div class="volume-b"><div class="form-group"><label class="col-sm-2 control-label">'+ $(this).children("option:selected").html() +'</label><div class="col-sm-10"><input id="ex2" data-slider-id="ex2Slider" type="text" data-slider-min="0" data-slider-max="100" data-slider-step="1" data-slider-value="50"/> <span id="ex2CurrentSliderValLabel">当前'+ $(this).children("option:selected").html() +': <span id="ex2SliderVal">0</span></span></div></div><div class="hr-line-dashed"></div></div>');
        $("#panel-add-control").children().last().before(input);
        //音量控件显示
        var mySlider = $("#ex2").bootstrapSlider();
        var volumeValue = mySlider.bootstrapSlider('getValue');
        $('#ex2').bootstrapSlider({
            tooltip_position:'bottom',
            formatter: function(value) {
                volumeValue = value;
                return '当前'+ $(".panel-sec-control").children("option:selected").html() +':' + value;
            }
        });
        $("#ex2").on("change", function() {
            $("#ex2SliderVal").text(volumeValue);
        });
    }else if(thisOption == 5){
        whilePanelControlType5(panelOptionObj);
    }
});


//control-type = 5  面板寻找被选择的控制项，并将option展示
var whilePanelControlType5 = function (panelOptionObj) {
    var val = $(".panel-sec-control option:checked").val();
    for (var item in panelOptionObj){
        if (panelOptionObj[item].control_id == val){
            var option = "";
            for (var i = 0;i < panelOptionObj[item].options.length;i++){
                option += '<option control-id="'+ panelOptionObj[item].options[i].control_id +'" value="'+ panelOptionObj[item].options[i].option_value +'">';
                option += panelOptionObj[item].options[i].option_name;
                option += '</option>';
            };
            var dom = $('<div class="matix-b"><div class="form-group"><label class="col-sm-2 control-label">'+ panelOptionObj[item].control_name +'</label><div class="col-sm-10"><select class="form-control m-b panel-c">'+ option +'</select></div></div><div class="hr-line-dashed"></div></div>');
            $("#panel-add-control").children().last().before(dom);
        }
    }
}

//面板增加控制项
myModalSmall.on("click",'.btn-sure-add-panel-control',function () {

    var panelControler = $(".panel-sec-control option:selected");
    var currentValue = "";
    //根据sceneControler值判断当前value值发送的内容
    if (panelControler.attr("control-type") == 1){
        currentValue = panelControler.val();
    }else if(panelControler.attr("control-type") == 2){
        var mySlider = $("#ex2").bootstrapSlider();
        currentValue = mySlider.bootstrapSlider('getValue');
    }else if(panelControler.attr("control-type") == 5){
        currentValue = $(".panel-c option:selected").val();
    }
    var timeType = 1;
    if (!$("#input-b").val()){
        timeType = 0;
    }else{
        timeType = 1;
    };
    //类别id
    var category = 1;//MiniCc默认类型

    if ($(".panel-sec-model option:selected").parent().attr("data-value") == 1){
        category = 3;
    }else if($(".panel-sec-model option:selected").parent().attr("data-value") == 2){
        category = 2;
    }
    var param = {
        "device_id":getDeviceId(),
        "panel_index":getPanelIndex(),
        "button_index":$("#myModalSmall").find($(".form-horizontal")).attr("button-index"),
        "control_id":$(".panel-sec-control option:selected").val(),
        "interface_type":$(".sec-device option:selected").attr("interface-type"),
        "interface_index":$(".sec-device option:selected").attr("interface-index"),
        "control_category":category,
        "control_type":$(".panel-sec-control option:selected").attr("control-type"),
        "control_value":currentValue,
        "time_type":timeType,
        "timer":$("#input-b").val(),
        "button_option":$("#myModalSmall").find($(".form-horizontal")).attr("button-option"),
    };
    api.userPost("equipment_panel/addPanelOption",param,function (json) {
        if (json.code == 0){
            // initShowPanelsPanel($("#myScenesControls").find($(".form-horizontal")).attr("scene-id"));
            initShowPanelsPanel();
            console.log(json);
        }else{
            toastrFail(json.message);
        }
    });
});




myModalSmall.on("click",".btn-back-prev-panel",function () {
    initShowPanelsPanel();
});
myModalSmall.on("click",'.btn-sure-add-panel-control',function () {
    initShowPanelsPanel();
});


var getDeviceId = function () {
    return $(".clickActive").attr("minicc-id");
};

//面板启用按钮
var panelTable = $("#btn_table");
panelTable.on("click",".activation-button",function () {
    var _this = $(this);
    var willAbled = _this.parent().parent();
    var param = {
        "device_id":getDeviceId(),
        "panel_index":getPanelIndex(),
        "button_index":willAbled.attr("button-index"),
        "lock_type":1
    }
    api.userPost("equipment_panel/addButton",param,function (json) {
        if(json.code == 0){
            console.log(json);
            willAbled.find($("select")).prop("disabled",false);
            willAbled.find($("button")).prop("disabled",false);
            willAbled.next().find($("button")).prop("disabled",false);
            _this.remove();
        }else{
            toastrFail(json.message);
        }
    })
});

//点击面板状态编辑按钮将普通互锁选框解锁
panelTable.on("click",".panel-status-a",function () {
    var tbody = panelTable.find($("tbody"));
   for (var i = 0;i < buttonIndexArr.length;i++){
       var d = tbody.find($("tr[button-index='"+ buttonIndexArr[i] +"']"));
       d.find($("select")).prop("disabled",false);
       d.find($(".activation-button")).remove();
   }
   $(this).removeClass("panel-status-a").addClass("panel-status-b");
    $(this).html("完成");
});
//点击面板状态已完成按钮将普通互锁选框锁
panelTable.on("click",".panel-status-b",function () {
    var tbody = panelTable.find($("tbody"));
   for (var i = 0;i < buttonIndexArr.length;i++){
       var d = tbody.find($("tr"));
       d.find($("select")).prop("disabled",true);
   }
   $(this).removeClass("panel-status-b").addClass("panel-status-a");
    $(this).html("编辑");
});

//面板控制项展示
var globalPanelObj = null;//初始化全局对象   存储场景控制项数据
var initShowPanelsPanel = function () {
    var myDom = $("#myModalSmall").find($(".form-horizontal"));
    $("#panel-controls").show();
    $(".btn-back-prev-panel").remove();
    $("#panel-add-control").remove();
    $("#panel-delay-time").remove();
    $(".btn-sure-add-panel-control").remove();
    $(".btn-save-edit-panel-control").remove();
    var param = {
        "device_id":getDeviceId(),
        "panel_index":getPanelIndex(),
        "button_index":myDom.attr("button-index"),
        "button_option":myDom.attr("button-option")
    };
    api.get("equipment_panel/panelOption",param,function (json) {
        if(json.code == 0){
            globalPanelObj = json;
            showThePanel(json.data);
        }else{
            toastrFail(json.message);
        }
    });
};

//面板控制项数据获取及显示
var showThePanel = function (data) {
    var panelDom = $("#panel-controls").find($(".flexVolume"));
    panelDom.children().remove();
    for (var i = 0;i < data.length;i++){
        //当前值
        var currentV = "";
        if(data[i].option_details.control_type == 5){

            for(var j = 0; j < data[i].option_details.options.length;j++){

                if (data[i].control_value == data[i].option_details.options[j].option_value){
                    currentV = data[i].option_details.options[j].option_name;
                }
            }
        }else if(data[i].option_details.control_type == 2){
            currentV = data[i].control_value;
        }else if(data[i].option_details.control_type == 1){
            currentV = data[i].control_value;
        }

        //当前延迟时间
        var time = "";
        if (data[i].time_type == 0){
            time = "";
        }else if(data[i].time_type == 1){
            time = '<small>延时:'+ data[i].timer +'</small>';
        }
        var dom = $('<div interface-type="'+ data[i].interface_type +'" control-id="'+ data[i].option_details.control_id +'" control-type="'+ data[i].option_details.control_type +'" scene-control-id="'+ data[i].scene_control_id +'"><div class="flex-a"><i class="fa fa-times-circle-o delete-model"></i></div><i class="pe-7s-paperclip"></i><span>'+ data[i].option_details.control_name +'</span>'+ time +'</div>');
        panelDom.append(dom);
    }
    var dom2 = $('<div class="add-model"><i class="fa fa-plus-circle"></i><span>添加控制项</span></div>');
    panelDom.append(dom2);

}