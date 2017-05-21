/**
 * Created by root on 2017/4/11.
 */
/*
* 定义初始化常量
*/
var IRHEADER = '<h4 class="modal-title">接口初始化</h4><small class="font-bold">初始化红外信息</small>';
var INITHEADER = '<h4 class="modal-title">接口初始化</h4><small class="font-bold">初始化接口信息</small>';
function RS_body(interface,type,none) {
    var str = '';
    if (arguments[2]){
        str = 'style="display:none"';
    }
    var RSBODY = '<div class="form-horizontal" '+ str +' data-interface="'+ interface +'" data-type="'+ type +'"><div class="form-group"><label class="col-sm-2 control-label">数据位</label><div class="col-sm-10"><select class="form-control m-b dataBit"><option value="0">7</option><option value="1">8</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">奇偶校验</label><div class="col-sm-10"><select class="form-control m-b checkBit"><option value="0">None</option><option value="1">Odd</option><option value="2">Even</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">停止位</label><div class="col-sm-10"><select class="form-control m-b stopBit"><option value="0">1</option><option value="1">2</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">比特率</label><div class="col-sm-10"><select class="form-control m-b baudrateBit"><option value="2">1200</option><option value="3">2400</option><option value="4">4800</option><option value="5">9600</option><option value="6">14400</option><option value="7">19200</option><option value="8">38400</option><option value="9">56000</option><option value="a">57600</option><option value="b">115200</option></select></div></div></div>';
    return RSBODY;
}
function IO_body(interface,type) {
    var IOBODY = '<div class="form-horizontal" data-interface="'+ interface +'" data-type="'+ type +'"><div class="form-group"><label class="col-sm-2 control-label">初始化模式</label><div class="col-sm-10"><select class="form-control m-b switchMode"><option value="1">闭合</option><option value="0">断开</option></select></div></div><div class="hr-line-dashed"></div></div>';
    return IOBODY;
}
function weak_body(interface,type) {
    var WEAKBODY = '<div class="form-horizontal" data-interface="'+ interface +'" data-type="'+ type +'"><div class="form-group"><label class="col-sm-2 control-label">配置模式</label><div class="col-sm-10"><select class="form-control m-b ioMode"><option value="1">输入</option><option value="0">输出</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">控制模式</label><div class="col-sm-10"><select class="form-control m-b electricLevel"><option value="1">高电平</option><option value="0">低电平</option></select></div></div><div class="hr-line-dashed"></div></div>';
    return WEAKBODY;
}
$("#device_table").footable();
// checkOrCancel(".checkAll",".check");

$(".selectDevice").select2();


var modal = $("#myModal9");
//取消初始化
modal.on("click",".init_cancel",function () {
    toConfig();
});
//初始化确定
modal.on("click",".init_sure",function () {
    toConfig();
});
//配置取消
modal.on("click",".config_cancel",function () {
   modal.modal("hide");
});
//配置确定
modal.on("click",".config_sure",function () {
    modal.modal("hide");
});
var configHead = $("#configure_header");
var configBody = $("#configure_body");
var initBody = $("#init_body");
var configurations = null;
//初始化配置option
var physic_binding = {
    message_type:"physic_binding",
    to:"device",
    device_type:"",
    device_sn:"",
    configurations:[
        {
            interface:1,
            configuration:{}
        },
        {
            interface:2,
            configuration:{}
        },
        {
            interface:3,
            configuration:{}
        },
        {
            interface:4,
            configuration:{}
        }
    ]
};
function RSchange(_this,selectV,port) {//选择串口时将接口二四改变
    var optionHtml = _this.children("option:selected").html();
    var option = $('<option value="'+ selectV +'">'+ optionHtml +'</option>')
    var port2Select = port.find($("select"));
    port2Select.append(option);
    port2Select.find(option).prop("selected",true);
    port2Select.prop("disabled",true);
}
function RSnoChange(port) {//串口取消选择时将接口二四置空
    var port2S = port.find($("select"));
    port2S.find($("option[value='4']")).remove();
    port2S.find($("option[value='3']")).remove();
    port2S.prop("disabled",false);
    port2S.find($("option[value='']")).prop("selected",true);
}
//输入框change改变JSON数据，执行函数
function changeJson(port) {
    console.log("cahnge");
    var objElement = $(this).parent().prev().find($(".form-horizontal")) || {};
    var interface = objElement.attr("data-interface")-0 || port;
    var type = objElement.attr("data-type") || "5";//如果没有，则是红外
    var config = physic_binding.configurations;

    switch (interface){
        case 1:
            filterInterface(thisInterface(config,interface),type);
            if (isSelectedRS1){
                filterInterface(thisInterface(config,2),type);
            }else{
                var obj2 = thisInterface(config,2);
                obj2.type = "";
                obj2.configuration = {};
            }
            break;
        case 3:
            filterInterface(thisInterface(config,interface),type);
            if (isSelectedRS2){
                filterInterface(thisInterface(config,4),type);
            }else{
                var obj2 = thisInterface(config,4);
                obj2.type = "";
                obj2.configuration = {};
            }
            break;
        default:
            filterInterface(thisInterface(config,interface),type);
            break;
    }
    function filterInterface(obj,type) {
        switch (type){
            case "1":
                obj.type = "1";
                obj.configuration = {
                    electric_level:objElement.find($(".electricLevel")).children("option:selected").val() - 0,
                    io_mode:objElement.find($(".ioMode")).children("option:selected").val() - 0
                }
                break;
            case "2":
                obj.type = "2";
                obj.configuration = {
                    switch_mode:objElement.find($(".switchMode")).children("option:selected").val() - 0,
                }
                break;
            case "3":
                obj.type = "3";
                obj.configuration = {
                    com_data:objElement.find($(".dataBit")).children("option:selected").val() - 0,
                    com_check:objElement.find($(".checkBit")).children("option:selected").val() - 0,
                    com_stop:objElement.find($(".stopBit")).children("option:selected").val() - 0,
                    com_baudrate:objElement.find($(".baudrateBit")).children("option:selected").val() - 0
                }
                break;
            case "4":
                obj.type = "4";
                obj.configuration = {
                    com_data:objElement.find($(".dataBit")).children("option:selected").val() - 0,
                    com_check:objElement.find($(".checkBit")).children("option:selected").val() - 0,
                    com_stop:objElement.find($(".stopBit")).children("option:selected").val() - 0,
                    com_baudrate:objElement.find($(".baudrateBit")).children("option:selected").val() - 0
                }
                break;
            case "5":
                obj.type = "5";
                obj.configuration = {
                    ir_data:"asdfasdfgsa"
                }
                break;
        }
    }
}
function thisInterface(arr,inter) {
    for (var i = 0;i < arr.length;i++){
        if (arr[i].interface == inter){
            return arr[i];
        }
    }
}

//确定提交JSON数据包
function sureToCommit() {
    var active = $(".clickActive");
    physic_binding.device_sn = active.attr("device_seq");//ABCD128E899D
    physic_binding.device_sn = "ABCD128E899D";
    physic_binding.device_type = "minicc-" + active.attr("device_type");
    var json = JSON.stringify(physic_binding);
    api.userPost("minicc/proxy",{"data":json},function (data) {
        if (data.code === 0){
            toastrSucceed("配置成功！");
        }else{
            toastrFail(data.message);
        }
    })
    console.log(json);
}

//物理接口逻辑切换
var isSelectedRS1 = false;//是否选择过串口，如果选过，则更改串口，下一个串口跟着发生变化
var isSelectedRS2 = false;
$(".port1").find($("select")).on("input",function () {
   //物理接口一
    var _this = $(this);
    var selectV = _this.children("option:selected").val();
    var header = "";
    var body = "";
    if (selectV === "5"){//红外IR口
        header = IRHEADER;
        body = RS_body(1,selectV,"none");
        if (isSelectedRS1){
            RSnoChange($(".port2"));
        }
        isSelectedRS1 = false;
    }else if (selectV === "4"){//RS485

        isSelectedRS1 = true;
        header = INITHEADER;
        body = RS_body(1,selectV);
        RSchange(_this,selectV,$(".port2"));

    }else if(selectV === "3"){//RS232

        isSelectedRS1 = true;
        header = INITHEADER;
        body = RS_body(1,selectV);
        RSchange(_this,selectV,$(".port2"));
    }else if(selectV === "2"){//弱继电器

        header = INITHEADER;
        body = IO_body(1,selectV);
        if (isSelectedRS1){
            RSnoChange($(".port2"));
        }
        isSelectedRS1 = false;
    }else if(selectV === "1"){//普通IO口

        header = INITHEADER;
        body = weak_body(1,selectV);
        if (isSelectedRS1){
            RSnoChange($(".port2"));
        }
        isSelectedRS1 = false;
    }else{
        return;
    }

    toInit(header,body);
});
$(".port2").find($("select")).on("input",function () {
    //物理接口二
    var selectV = $(this).children("option:selected").val();
    var header = "";
    var body = "";
    if (selectV === "5"){
        header = IRHEADER;
        body = RS_body(2,selectV,"none");
    }else if (selectV === "2"){
        header = INITHEADER;
        body = IO_body(2,selectV);
    }else if(selectV === "1"){
        header = INITHEADER;
        body = weak_body(2,selectV);
    }else{
        return;
    }

    toInit(header,body);
});
$(".port3").find($("select")).on("input",function () {
    console.log("触发input")
    //物理接口三
    var _this = $(this);
    var selectV = $(this).children("option:selected").val();
    var header = "";
    var body = "";
    if (selectV === "5"){
        header = IRHEADER;
        body = RS_body(3,selectV,"none");
    }else if (selectV === "4"){

        header = INITHEADER;
        body = RS_body(3,selectV);
        isSelectedRS2 = true;
        RSchange(_this,selectV,$(".port4"));
    }else if(selectV === "3"){

        header = INITHEADER;
        body = RS_body(3,selectV);
        isSelectedRS2 = true;
        RSchange(_this,selectV,$(".port4"));
    }else if(selectV === "2"){

        header = INITHEADER;

        body = IO_body(3,selectV);
        if (isSelectedRS2){
            RSnoChange($(".port4"));
        }
        isSelectedRS2 = false;
    }else if(selectV === "1"){

        header = INITHEADER;
        body = weak_body(3,selectV);
        if (isSelectedRS2){
            RSnoChange($(".port4"));
        }
        isSelectedRS2 = false;
    }else{
        return;
    }

    toInit(header,body);
});
$(".port4").find($("select")).on("input",function () {
    //物理接口四
    var selectV = $(this).children("option:selected").val();
    var header = "";
    var body = "";
    if (selectV === "5"){
        header = IRHEADER;
        body = RS_body(4,selectV,"none");
    }else if (selectV === "2"){
        header = INITHEADER;
        body = IO_body(4,selectV);
    }else if(selectV === "1"){
        header = INITHEADER;
        body = weak_body(4,selectV);
    }else{
        return;
    }

    toInit(header,body);
});
//切换至接口配置
function toConfig() {
    configHead.children().remove();
    var div = $('<h4 class="modal-title">物理接口绑定</h4><small class="font-bold">绑定物理接口并且初始化，手动配置或者导入原有配置</small>');
    div.css("position","relative");
    div.css("left","300px");
    div.animate({
        "left":"0px"
    });
    configHead.append(div);
    configBody.slideDown();
    initBody.slideUp();
    $(".init_cancel").removeClass("init_cancel").addClass("config_cancel");
    $(".init_sure").removeClass("init_sure").addClass("config_sure");
    $(".config_sure").unbind("click");
    $(".init_sure").unbind("click");
    $(".config_sure").bind("click",sureToCommit);
}

//切换至初始化配置
function toInit(head,body) {
    configHead.children().remove();
    initBody.children().remove();
    var head = $(head);
    var body = $(body);
    head.css("position","relative");
    head.css("left","300px");
    head.animate({
        "left":"0px"
    });
    configHead.append(head);
    initBody.append(body);
    configBody.slideUp();
    initBody.slideDown();
    $(".config_cancel").removeClass("config_cancel").addClass("init_cancel");
    $(".config_sure").removeClass("config_sure").addClass("init_sure");
    $(".config_sure").removeAttr("onclick");
    $(".config_sure").unbind("click");
    $(".init_sure").unbind("click");
    $(".init_sure").bind("click",changeJson);
}

//新增控制项
$("#myModalControl").on("click",".addControl",function () {
    $(".alert-danger").remove();
    var _this = $(this);
    var parent = _this.parent().parent();
    var controlName = parent.find($(".name")).val();
    var controlData = parent.find($(".data")).val();
    if (!controlName){
        var div = $('<div class="alert alert-danger">名称不能为空！</div>');
        $("#controlSetPanel").before(div);
        return;
    }
    if (!controlData){
        var div = $('<div class="alert alert-danger">数据不能为空！</div>');
        $("#controlSetPanel").before(div);
        return;
    }
   var formGroup = $('<div class="form-group"><div class="col-sm-3"><input type="text" class="form-control name" value="'+ controlName +'" disabled></div><div class="col-sm-5"><input type="text" class="form-control data" value="'+ controlData +'" disabled></div><div class="col-sm-4"><button type="button" class="btn btn-sm btn-danger2 deleteControl">删除</button> <button type="button" class="btn btn-sm btn-default editControl">编辑</button> <button type="button" class="btn btn-sm btn-info saveControl">保存</button></div></div>');
   $("#controlSetPanel").before(formGroup);
    parent.find($("input")).val("");
});
//删除控制项
$("#myModalControl").on("click",".deleteControl",function () {
    $(this).parent().parent().remove();
    $(".alert-danger").remove();
});
//编辑控制项
$("#myModalControl").on("click",".editControl",function () {
    var _this = $(this);
    var parent = _this.parent().parent();
    parent.find($(".name")).prop("disabled",false);
    parent.find($(".data")).prop("disabled",false);
});
//保存控制项
$("#myModalControl").on("click",".saveControl",function () {
    $(".alert-danger").remove();
    var _this = $(this);
    var parent = _this.parent().parent();
    var controlName = parent.find($(".name")).val();
    var controlData = parent.find($(".data")).val();
    if (!controlName){
        var div = $('<div class="alert alert-danger">名称不能为空！</div>');
        $("#controlSetPanel").before(div);
        return;
    }
    if (!controlData){
        var div = $('<div class="alert alert-danger">数据不能为空！</div>');
        $("#controlSetPanel").before(div);
        return;
    }
    parent.find($(".name")).prop("disabled",true);
    parent.find($(".data")).prop("disabled",true);
});

//取消设备保存
$(".cancel_person_btn").on("click",function  () {
    $("#addPerson input").val("");
});

//批量删除设备
$("#deleteMembers").on("click",function  () {
    var checked = $(".check:checked");
    if (checked.length == 0) {
        var text = "您未选择任何设备";
        toastrFail(text);
        return;
    }else{
        deleteMembers();
    }
});
function deleteMembers() {
    swal({
            title: "确定删除设备?",
            text: "删除的设备可重新添加",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，确定删除",
            cancelButtonText: "否,暂时取消",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                //删除成员
                deleteTheseMember();
            }
        });
}
function deleteTheseMember() {
    var checked = $(".check:checked");
    var arr = [];
    for (var i = 0;i < checked.length;i++) {
        var a = checked.eq(i).parent().parent().attr("equipment_id");
        arr.push(a);
    }
    var param = {
        "equipment_ids":arr,
        "minicc_id":$(".clickActive").attr("minicc-id")
    }
    api.userPost("minicc/removeFromMiniCC",param,function (data) {
        if (data.code === 0){
            checked.parent().parent().remove();
            toastrSucceed("删除成功");
        }else{
            toastrFail(data.message);
        }
    })
}

//Minicc列表
api.get("minicc/list",{},miniccList);
function miniccList(data) {
    if (data.code === 0){
        $(".treeMenu").children().remove();
        var arr = data.data;
        for (var i = 0;i < arr.length;i++){
            var status = "";
            switch (arr[i].device_status){
                case 1:
                    status = "在线";
                    break;
                case 2:
                    status = "离线";
                    break;
                case 3:
                    status = "故障";
                    break;
                default:
                    break;
            }
            var li = $('<li minicc-id="'+ arr[i].device_id +'" device_seq="'+ arr[i].device_seq +'" device_type="'+ arr[i].device_type +'"> <div class="checkbox checkbox-success checkbox-inline"><input type="checkbox" class="checkMiniCC"><label></label></div><span class="mini_name">'+ arr[i].device_name +'</span><span class="mini_status_online">('+ status +')</span><i class="pe-7s-more mini_set1" data-target="#myModalMore" data-toggle="modal"></i><i class="pe-7s-film mini_set" data-target="" data-toggle="modal"></i><i class="pe-7s-edit mini_set" data-target="#myModal9" data-toggle="modal"></i></li>')
            $(".treeMenu").append(li);
        }
        $(".treeMenu").children('li').eq(0).trigger("click");
    }
}

//获取minicc物理接口配置项
$(".treeMenu").on("click",".mini_set",function () {
   var deviceId = $(this).parent().attr("minicc-id");
   api.get("minicc/interfaceConfig",{"minicc_id":deviceId},function (data) {
       if(data.code === 0){
           if (data.data.length > 0){
               console.log(data);
               var json = data.data;
               configurations = json;
               var port1 = null,port2 = null,port3 = null,port4 = null;
               for (var i = 0;i < json.length;i++){
                   if (json[i].interface == 1){
                       port1 = json[i];
                   }else if (json[i].interface == 2){
                       port2 = json[i];
                   }else if (json[i].interface == 3){
                       port3 = json[i];
                   }else if (json[i].interface == 4){
                       port4 = json[i];
                   }
               };
               var modal = $("#myModal9");

               modal.find($(".port1 select")).children("option[value='"+ port1.type +"']").prop("selected",true);
               modal.find($(".port2 select")).children("option[value='"+ port2.type +"']").prop("selected",true);
               modal.find($(".port3 select")).children("option[value='"+ port3.type +"']").prop("selected",true);
               modal.find($(".port4 select")).children("option[value='"+ port4.type +"']").prop("selected",true);
               if (port2.type == "3" || port2.type == "4"){
                   isSelectedRS1 = true;
                   var option = $('<option value="'+ port2.type +'">'+ modal.find($(".port1 select")).children("option:selected").html() +'</option>');
                   var port2Select = modal.find($(".port2 select"));
                   port2Select.append(option);
                   port2Select.find(option).prop("selected",true);
                   port2Select.prop("disabled",true);
               }
               if (port4.type == "3" || port4.type == "4"){
                   isSelectedRS2 = true;
                   var option = $('<option value="'+ port4.type +'">'+ modal.find($(".port3 select")).children("option:selected").html() +'</option>');
                   var port4Select = modal.find($(".port4 select"));
                   port4Select.append(option);
                   port4Select.find(option).prop("selected",true);
                   port4Select.prop("disabled",true);
               }
           }
       }
   });
});

//点击勾选Minicc
$(".treeMenu").on("click",".checkMiniCC",function (e) {
    e.stopPropagation();
});
//树状列表点击事件
var treeMenu = $(".treeMenu");
treeMenu.on("click","li",function () {
    var _this = $(this);
    treeMenu.children("li").removeClass("clickActive");
    _this.addClass("clickActive");
    var minicc_id = _this.attr("minicc-id");
    api.get("minicc/equipments",{"minicc_id":minicc_id},relatedDeviceLists)
});
//关联的设备列表表格包含矩阵音量音频
function relatedDeviceLists(data) {
    if (data.code === 0){
        var defaultConfig = data.data.defaultConfig;
        var equipments = data.data.equipments;
        var deviceTbody = $("#device_table tbody");
        deviceTbody.children().remove();
        var miniccId = $(".clickActive").attr("minicc-id");
        var trs = $('<tr minicc-id="'+ miniccId +'"><td><input type="checkbox" class="check" disabled></td><td>矩阵</td><td>--</td><td>--</td><td>--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl" disabled>配置控制项</button> <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#matrixControl">控制</button></td></tr><tr minicc-id="'+ miniccId +'"><td><input type="checkbox" class="check" disabled></td><td>音量</td><td>--</td><td>--</td><td>--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl" disabled>配置控制项</button> <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#volumeControl">控制</button></td></tr><tr minicc-id="'+ miniccId +'"><td><input type="checkbox" class="check" disabled></td><td>音频</td><td>--</td><td>--</td><td>--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl" disabled>配置控制项</button> <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#audioControl">控制</button></td></tr>');
        deviceTbody.append(trs);

        for (var i = 0;i < equipments.length;i++){
            var tr = $('<tr minicc-id="'+ miniccId +'" equipment_bind_id="'+ equipments[i].equipment_bind_id +'" equipment_id="'+ equipments[i].equipment_id +'"><td><input type="checkbox" class="check"></td><td class="editMinicc">'+ equipments[i].equipment_name +'</td><td class="editMinicc">'+ equipments[i].category_name +'</td><td class="editMinicc">'+ equipments[i].interface_index +'</td><td class="editMinicc">--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl">配置控制项</button>  <button type="button" class="btn btn-default btn-xs otherControlBtn">控制</button></td></tr>');
            deviceTbody.append(tr);
        }

    }
}

//关联设备---设备下拉列表
$("#relateDeviceBtn").on("click",function () {
   api.get("equipment/listByCategory",{},function (data) {
       if (data.code === 0){
           var arr = data.data;
           var select = $("#selectDevice");
           select.children().remove();
           select.append('<option value="">请选择设备</option>');
           for (var i = 0;i < arr.length;i++){
               var options = "";
               for (var j = 0;j < arr[i].children.length;j++){
                  var option = '<option value="'+ arr[i].children[j].id +'">'+ arr[i].children[j].name +'</option>';
                   options += option;
               }
           var options = $('<optgroup label="'+ arr[i].name +'">'+ options +'</optgroup>');
               options.appendTo(select);
           }
       }
   })
});

//关联设备并展示
$(".contact_device_btn").on("click",function () {
    var deviceId = $("#selectDevice option:selected").val();
    var device = $("#selectDevice option:selected").html();
    var deviceType = $("#selectDevice option:selected").parent().attr("label");
    var portId = $("#phy_port option:selected").val();
    var port = $("#phy_port option:selected").html();
    var param = {
        "minicc_id":$(".clickActive").attr("minicc-id"),
        "equipment_id": deviceId,
        "interface_index":$("#phy_port option:selected").val()
    };
    api.userPost("minicc/relatedWithMiniCC",param,function (data) {
        if (data.code === 0){
            $("#selectDevice option[value='-1']").attr("selected","selected");
            $("#select2-chosen-1").html("请选择设备");
            $("#phy_port option[value='']").prop("selected",true);
            api.get("minicc/equipments",{"minicc_id":$(".clickActive").attr("minicc-id")},relatedDeviceLists);
            $("#myModal8").modal("hide");
        }else{
            toastrFail(data.message);
        }
    });
});


//版本更新
$("#version_update").on("click",function () {
    var checked = $(".checkMiniCC:checked");
   if (checked.length === 0){
       toastrFail("您未选择要更新的MiniCC");
   }else{
       checked.prop("checked",false);
       toastrSucceed("版本更新成功！");
   }
});

//
var setControl = $(".sets_control");
setControl.on("mouseenter","li",function () {
    var _this = $(this);
    setControl.children("li").css("backgroundColor","#ffffff");
    setControl.children("li").css("color","#6a6c6f");
    _this.css("backgroundColor","#7b9ce4");
    _this.css("color","#ffffff");
});
setControl.on("mouseleave",function () {
    setControl.children("li").css("backgroundColor","#ffffff");
    setControl.children("li").css("color","#6a6c6f");
});
setControl.on("click","li",function () {
    var _this = $(this);
    setControl.children("li").removeClass("clickLi");
    _this.addClass("clickLi");
});
var flexVolume = $(".flexVolume");
flexVolume.on("mouseenter","div",function () {
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
//添加Mini CC设备
var device_type = $("#device_type");
var auth_user = $("#auth_user").parent().parent();
var auth_passwd = $("#auth_passwd").parent().parent();
device_type.on("change",function () {
   if (device_type.children("option:selected").val() !== "2"){
       auth_user.hide();
       auth_user.next().hide();
       auth_passwd.hide();
       auth_passwd.next().hide();
   }else{
       auth_user.show();
       auth_user.next().show();
       auth_passwd.show();
       auth_passwd.next().show();
   }
});
$("#addMiniccSure").on("click",function () {
    var device_name = $("#device_name").val();
    var device_seq = $("#device_seq").val();
    var device_type = $("#device_type option:selected");
    var device_version = $("#device_version").val();
    var auth_user = $("#auth_user").val();
    var auth_passwd = $("#auth_passwd").val();
    var param = {
        "seq":device_seq,
        "type":device_type.val(),
        "name":device_name,
        "version":device_version,
        "user":auth_user,
        "password":auth_passwd,
    }
    api.userPost("minicc/addMinicc",param,function (data) {
        if (data.code === 0){
            toastrSucceed("添加成功！");
            api.get("minicc/list",{},miniccList);
            $("#addMiniccModal").modal("hide");
        }else{
            toastrFail(data.message);
        }
    });
});

//修改minicc
$(".editMinicc").on("click",function () {

});

//控制
$("#device_table").on("click",".otherControlBtn",function () {
    console.log("dafjskla")
    $("#otherControl").modal("show");
    var eq_bind_id = $(this).parent().parent().attr("equipment_bind_id");
    api.get("minicc/getEquipmentControlOptions",{"equipment_bind_id":eq_bind_id},customControl);
});

function customControl(data) {
    if (data.code === 0){
        var body = $("#customControl");
        body.children().remove();
        var arr = data.data;
        for (var i = 0;i < arr.length;i++){
            var li = $('<li equipment_bind_id="'+ arr[i].equipment_bind_id +'" control-id="'+ arr[i].control_id +'"><h4>'+ arr[i].control_name +'</h4><samll>'+ arr[i].control_value +'</samll></li>');
            body.append(li);
        }
    }
}
//矩阵控制
$("#matrixSureControl").on("click",function () {
    var param = {
        "device_id":$(".clickActive").attr("minicc-id"),
        "matrix_input":$("#matrixSignal option:selected").val(),
        "matrix_outpu":$("#matrixOutput option:selected").val(),
        "matrix_output_priority":$("#matrixUndelay option:selected").val(),
    };
    api.post("",param,function (data) {
        if (data.code === 0){
            toastrSucceed("矩阵控制成功！");
        }else{
            toastrFail(data.message);
        }
    });
});

//音量控制
$("#volumeSureControl").on("click",function () {
    var param = {
        "device_id":$(".clickActive").attr("minicc-id"),
        "sound_volume":$("#volume_title").html()-0,
        "is_mute":$(".flexVolume .clickLi").attr("is_mute")-0,
    };
    api.post("",param,function (data) {
        if(data.code === 0){
            toastrSucceed("音量控制成功！");
        }else{
            toastrFail(data.message);
        }
    });
});



//音量控制
var scale = function (btn,bar,title){
    this.btn=document.getElementById(btn);
    this.bar=document.getElementById(bar);
    this.title=document.getElementById(title);
    this.step=this.bar.getElementsByTagName("div")[0];
    this.init();
};
scale.prototype={
    init:function (){
        var f=this,g=document,b=window,m=Math;
        f.btn.onmousedown=function (e){
            var x=(e||b.event).clientX;
            var l=this.offsetLeft;
            var max=f.bar.offsetWidth-this.offsetWidth;
            g.onmousemove=function (e){
                var thisX=(e||b.event).clientX;
                var to=m.min(max,m.max(-2,l+(thisX-x)));
                f.btn.style.left=to+'px';
                f.ondrag(m.round(m.max(0,to/max)*100),to);
                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
            };
            g.onmouseup=new Function('this.onmousemove=null');
        };
    },
    ondrag:function (pos,x){
        this.step.style.width=Math.max(0,x)+'px';
        this.title.innerHTML=pos;
    }
}
new scale('volume_btn','volume_bar','volume_title');

//深复制对象方法
var cloneObj = function (obj) {
    var newObj = {};
    if (obj instanceof Array) {
        newObj = [];
    }
    for (var key in obj) {
        var val = obj[key];
        //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
        newObj[key] = typeof val === 'object' ? cloneObj(val): val;
    }
    return newObj;
};