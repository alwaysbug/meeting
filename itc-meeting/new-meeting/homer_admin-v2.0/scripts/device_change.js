//Minicc列表
api.get("minicc/list",{},miniccList);
function miniccList(data) {
    if (data.code === 0){
        $(".treeMenu").children().remove();
        $(".treeMenu").append($('<h4 class="font-light m-b-xs" id="miniccV1">Mini CC一代</h4><div style="display: none;" id="mini-append-line"></div><h4 class="font-light m-b-xs" id="miniccV2">Mini CC二代</h4>'));
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
                var li1 = $('<li minicc-id="'+ arr[i].device_id +'" device_seq="'+ arr[i].device_seq +'" device_type="'+ arr[i].device_type +'"> <div class="checkbox checkbox-success checkbox-inline"><input type="checkbox" class="checkMiniCC"><label></label></div><span class="mini_name">'+ arr[i].device_name +'</span><span class="mini_status_online">('+ status +')</span><i class="pe-7s-edit mini_set" data-target="#myModal9" data-toggle="modal"></i></li>');
                $("#mini-append-line").before(li1);
            }else{
                var li2 = $('<li minicc-id="'+ arr[i].device_id +'" device_seq="'+ arr[i].device_seq +'" device_type="'+ arr[i].device_type +'"> <div class="checkbox checkbox-success checkbox-inline"><input type="checkbox" class="checkMiniCC"><label></label></div><span class="mini_name">'+ arr[i].device_name +'</span><span class="mini_status_online">('+ status +')</span><i class="pe-7s-more mini_set1" data-target="#myModalMore" data-toggle="modal"></i><i class="pe-7s-film mini_set" data-target="" data-toggle="modal"></i><i class="pe-7s-edit mini_set" data-target="#myModal9" data-toggle="modal"></i></li>')
                $("#miniccV2").after(li2);
            }
        }
        $(".treeMenu").children('li').eq(0).trigger("click");
    }else{
        toastrFail(data.message);
    }
}
$("#device_table").footable();

$(".selectDevice").select2();

var selectStatus = 1;//控制状态  1.从普通到普通 2.选择串口 3.从串口到普通
var selectStatus2 = 1;//控制状态  1.从普通到普通 2.选择串口 3.从串口到普通
//初始化配置option
var physic_binding = {
    message_type:"physic_binding",
    to:"device",
    device_type:"minicc-1",
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

var select1 = $(".port1").find($("select"));
var select2 = $(".port2").find($("select"));
var select3 = $(".port3").find($("select"));
var select4 = $(".port4").find($("select"));


$("#setFirstConfigBtn").on("click",function (e) {
    e.stopPropagation();
    var val = select1.children("option:selected").val();
    var con = null;
    for (var i = 0;i < physic_binding.configurations.length;i++){
        if (physic_binding.configurations[i].interface == 1){
            con = physic_binding.configurations[i];
        }
    }
    var header="",body="";
    switch (val){//接口一类型  1、普通IO 2、弱继电器 3、RS232串口 4、RS485串口 5、红外IR口
        case "1":
            header = INITHEADER;
            body = weak_body(1,val);
            toInit(header,body);
            if (con.type == 1){
                var val1 = con.configuration.io_mode;
                var val2 = con.configuration.electric_level;
                $("#init_body").find($(".form-horizontal")).find($(".ioMode")).children("option[value='"+ val1 +"']").prop("selected",true);
                $("#init_body").find($(".form-horizontal")).find($(".electricLevel")).children("option[value='"+ val2 +"']").prop("selected",true);
            }
            break;
        case "2":
            header = INITHEADER;
            body = IO_body(1,val);
            toInit(header,body);
            if (con.type == 2){
                $("#init_body").find($(".form-horizontal")).find($(".switchMode")).children("option[value='"+ con.configuration.switch_mode +"']").prop("selected",true);
            }
            break;
        case "3":
            header = INITHEADER;
            body = RS_body(1,val);
            toInit(header,body);
            if (con.type == 3){
                var b = $("#init_body").find($(".form-horizontal"));
                b.find($(".dataBit")).children("option[value='"+ con.configuration.com_data +"']").prop("selected",true);
                b.find($(".checkBit")).children("option[value='"+ con.configuration.com_check +"']").prop("selected",true);
                b.find($(".stopBit")).children("option[value='"+ con.configuration.com_stop +"']").prop("selected",true);
                b.find($(".baudrateBit")).children("option[value='"+ con.configuration.com_baudrate +"']").prop("selected",true);
            }
            break;
        case "4":
            header = INITHEADER;
            body = RS_body(1,val);
            toInit(header,body);
            if (con.type == 4){
                var b = $("#init_body").find($(".form-horizontal"));
                b.find($(".dataBit")).children("option[value='"+ con.configuration.com_data +"']").prop("selected",true);
                b.find($(".checkBit")).children("option[value='"+ con.configuration.com_check +"']").prop("selected",true);
                b.find($(".stopBit")).children("option[value='"+ con.configuration.com_stop +"']").prop("selected",true);
                b.find($(".baudrateBit")).children("option[value='"+ con.configuration.com_baudrate +"']").prop("selected",true);
            }
            break;
        case "5":
            header = IRHEADER;
            body = RS_body(1,val,"none");
            toInit(header,body);
            break;
        default:
            toastrFail("请选择接口一类型");
            return;
    }

});

$("#setSecondConfigBtn").on("click",function (e) {
    e.stopPropagation();
    var val = select2.children("option:selected").val();
    var header="",body="";
    var con = null;
    for (var i = 0;i < physic_binding.configurations.length;i++){
        if (physic_binding.configurations[i].interface == 2){
            con = physic_binding.configurations[i];
        }
    }
    switch (val){//接口一类型  1、普通IO 2、弱继电器  5、红外IR口
        case "1":
            header = INITHEADER;
            body = weak_body(2,val);
            toInit(header,body);
            if (con.type == 1){
                var val1 = con.configuration.io_mode;
                var val2 = con.configuration.electric_level;
                var b = $("#init_body").find($(".form-horizontal"));
                b.find($(".ioMode")).children("option[value='"+ val1 +"']").prop("selected",true);
                b.find($(".electricLevel")).children("option[value='"+ val2 +"']").prop("selected",true);
            }
            break;
        case "2":
            header = INITHEADER;
            body = IO_body(2,val);
            toInit(header,body);
            if (con.type == 2){
                $("#init_body").find($(".form-horizontal")).find($(".switchMode")).children("option[value='"+ con.configuration.switch_mode +"']").prop("selected",true);
            }
            break;
        case "5":
            header = IRHEADER;
            body = RS_body(2,val,"none");
            toInit(header,body);
            break;
        default:
            toastrFail("请选择接口二类型");
            return;
    }

});

$("#setThirdConfigBtn").on("click",function (e) {
    e.stopPropagation();
    var val = select3.children("option:selected").val();
    var con = null;
    for (var i = 0;i < physic_binding.configurations.length;i++){
        if (physic_binding.configurations[i].interface == 4){
            con = physic_binding.configurations[i];
        }
    }
    var header="",body="";
    switch (val){//接口一类型  1、普通IO 2、弱继电器 3、RS232串口 4、RS485串口 5、红外IR口
        case "1":
            header = INITHEADER;
            body = weak_body(3,val);
            toInit(header,body);
            if (con.type == 1){
                var val1 = con.configuration.io_mode;
                var val2 = con.configuration.electric_level;
                $("#init_body").find($(".form-horizontal")).find($(".ioMode")).children("option[value='"+ val1 +"']").prop("selected",true);
                $("#init_body").find($(".form-horizontal")).find($(".electricLevel")).children("option[value='"+ val2 +"']").prop("selected",true);
            }
            break;
        case "3":
            header = INITHEADER;
            body = RS_body(3,val);
            toInit(header,body);
            if (con.type == 3){
                var b = $("#init_body").find($(".form-horizontal"));
                b.find($(".dataBit")).children("option[value='"+ con.configuration.com_data +"']").prop("selected",true);
                b.find($(".checkBit")).children("option[value='"+ con.configuration.com_check +"']").prop("selected",true);
                b.find($(".stopBit")).children("option[value='"+ con.configuration.com_stop +"']").prop("selected",true);
                b.find($(".baudrateBit")).children("option[value='"+ con.configuration.com_baudrate +"']").prop("selected",true);
            }
            break;
        case "4":
            header = INITHEADER;
            body = RS_body(3,val);
            toInit(header,body);
            if (con.type == 4){
                var b = $("#init_body").find($(".form-horizontal"));
                b.find($(".dataBit")).children("option[value='"+ con.configuration.com_data +"']").prop("selected",true);
                b.find($(".checkBit")).children("option[value='"+ con.configuration.com_check +"']").prop("selected",true);
                b.find($(".stopBit")).children("option[value='"+ con.configuration.com_stop +"']").prop("selected",true);
                b.find($(".baudrateBit")).children("option[value='"+ con.configuration.com_baudrate +"']").prop("selected",true);
            }
            break;
        case "5":
            header = IRHEADER;
            body = RS_body(3,val,"none");
            toInit(header,body);
            break;
        default:
            toastrFail("请选择接口三类型");
            return;
    }

});

$("#setFourthConfigBtn").on("click",function (e) {
    e.stopPropagation();
    var val = select4.children("option:selected").val();
    var header="",body="";
    var con = null;
    for (var i = 0;i < physic_binding.configurations.length;i++){
        if (physic_binding.configurations[i].interface == 4){
            con = physic_binding.configurations[i];
        }
    }
    switch (val){//接口一类型  1、普通IO 2、弱继电器  5、红外IR口
        case "1":
            header = INITHEADER;
            body = weak_body(4,val);
            toInit(header,body);
            if (con.type == 1){
                var val1 = con.configuration.io_mode;
                var val2 = con.configuration.electric_level;
                $("#init_body").find($(".form-horizontal")).find($(".ioMode")).children("option[value='"+ val1 +"']").prop("selected",true);
                $("#init_body").find($(".form-horizontal")).find($(".electricLevel")).children("option[value='"+ val2 +"']").prop("selected",true);
            }
            break;
        case "5":
            header = IRHEADER;
            body = RS_body(4,val,"none");
            toInit(header,body);
            break;
        default:
            toastrFail("请选择接口四类型");
            return;
    }

});


//限制物理接口一三选中RS串口时，二四串口跟一三一致不能修改
var bool1 = true,bool2 = true;
var bool3 = true,bool4 = true;
select1.on("change",function () {
    var _this = $(this).children("option:selected");
   if (_this.val() == "3" || _this.val() == "4"){
       RSchange(select1,_this.val(),$(".port2"));
       bool1 = false;
       selectStatus = 2;
   }
   if ((bool1 == false) && (_this.val() != "3" && _this.val() != "4") && (bool2 == true)){
       RSnoChange($(".port2"));
       bool2 = false;
       selectStatus = 3;
   }
   if ((bool1 == false) && (_this.val() != "3" && _this.val() != "4") && (bool2 == false)){
       var port2 = $(".port2").find($("select"));
       port2.find($("option[value='4']")).remove();
       port2.find($("option[value='3']")).remove();
       $(".port2").find($("button")).prop("disabled",false);
       port2.prop("disabled",false);
       bool2 = false;
       selectStatus = 4;
   }
});
select3.on("change",function () {
    var _this = $(this).children("option:selected");
    if (_this.val() == "3" || _this.val() == "4"){
        RSchange(select3,_this.val(),$(".port4"));
        bool3 = false;
        selectStatus2 = 2;
    }
    if ((bool3 == false) && (_this.val() != "3" && _this.val() != "4") && (bool4 == true)){
        RSnoChange($(".port4"));
        bool4 = false;
        selectStatus2 = 3;
    }
    if ((bool3 == false) && (_this.val() != "3" && _this.val() != "4") && (bool4 == false)){
        var port4 = $(".port4").find($("select"));
        port4.find($("option[value='4']")).remove();
        port4.find($("option[value='3']")).remove();
        $(".port4").find($("button")).prop("disabled",false);
        port4.prop("disabled",false);
        bool4 = false;
        selectStatus2 = 4;
    }
});
var configHead = $("#configure_header");
var configBody = $("#configure_body");
var initBody = $("#init_body");
var modal = $("#myModal9");
//取消初始化
modal.on("click",".init_cancel",function () {
    toConfig();
});
//取消配置
modal.on("click",".config_cancel",function () {
    modal.modal("hide");
});
//初始化确定
modal.on("click",".init_sure",function () {
    toConfig();
    //传递参数
    var _this = $(this);
    var objElement = _this.parent().prev().find($(".form-horizontal"));
    var interface = objElement.attr("data-interface") - 0;
    var type = objElement.attr("data-type") - 0;

    switch (interface){
        case 1:
            switch (selectStatus){
                case 1:
                    filterInterface(thisInterface(physic_binding.configurations,interface),type);
                    break;
                case 2:
                    filterInterface(thisInterface(physic_binding.configurations,interface),type);
                    filterInterface(thisInterface(physic_binding.configurations,2),type);
                    break;
                case 3:
                    var obj2 = thisInterface(physic_binding.configurations,2);
                    obj2.type = 1;
                    obj2.configuration = {
                        electric_level:0,
                        io_mode:0
                    };
            }
            break;
        case 3:
            switch (selectStatus2){
                case 1:
                    filterInterface(thisInterface(physic_binding.configurations,interface),type);
                    break;
                case 2:
                    filterInterface(thisInterface(physic_binding.configurations,interface),type);
                    filterInterface(thisInterface(physic_binding.configurations,4),type);
                    break;
                case 3:
                    var obj4 = thisInterface(physic_binding.configurations,4);
                    obj4.type = 1;
                    obj4.configuration = {
                        electric_level:0,
                        io_mode:0
                    };
            }
            break;
        default:
            filterInterface(thisInterface(physic_binding.configurations,interface),type);
            break;
    }
    function filterInterface(obj,type) {
        switch (type){
            case 1:
                obj.type = 1;
                obj.configuration = {
                    electric_level:objElement.find($(".electricLevel")).children("option:selected").val() - 0,
                    io_mode:objElement.find($(".ioMode")).children("option:selected").val() - 0
                }
                break;
            case 2:
                obj.type = 2;
                obj.configuration = {
                    switch_mode:objElement.find($(".switchMode")).children("option:selected").val() - 0,
                }
                break;
            case 3:
                obj.type = 3;
                obj.configuration = {
                    com_data:objElement.find($(".dataBit")).children("option:selected").val() - 0,
                    com_check:objElement.find($(".checkBit")).children("option:selected").val() - 0,
                    com_stop:objElement.find($(".stopBit")).children("option:selected").val() - 0,
                    com_baudrate:objElement.find($(".baudrateBit")).children("option:selected").val() - 0 || objElement.find($(".baudrateBit")).children("option:selected").val()
                }
                break;
            case 4:
                obj.type = 4;
                obj.configuration = {
                    com_data:objElement.find($(".dataBit")).children("option:selected").val() - 0,
                    com_check:objElement.find($(".checkBit")).children("option:selected").val() - 0,
                    com_stop:objElement.find($(".stopBit")).children("option:selected").val() - 0,
                    com_baudrate:objElement.find($(".baudrateBit")).children("option:selected").val() - 0 || objElement.find($(".baudrateBit")).children("option:selected").val()
                }
                break;
            case 5:
                obj.type = 5;
                obj.configuration = {
                    ir_data:"asdfasdfgsa"
                }
                break;
        }
    }
});
//配置确定
modal.on("click",".config_sure",function () {
    var active = $(".clickActive");
    physic_binding.device_sn = active.attr("device_seq").toUpperCase();//AABBCCDDEE00  //
    physic_binding.device_type = "minicc-" + active.attr("device_type");
    physic_binding.device_id = active.attr("minicc-id")-0;
    var  pObj = cloneObj(physic_binding);
    var json = JSON.stringify(pObj);
    console.log(json);
    api.userPost("minicc/proxy",{"data":json},function (data) {
        if (data.code === 0){
            $(".alert-danger").remove();
            var configs = data.data.configurations;
            // for (var i = 0;i < physic_binding.configurations.length;i++){
            //     for (var j = 0;j < configs.length;j++){
            //         if(physic_binding.configurations[i].interface == configs[j].interface){
            //             physic_binding.configurations[i].configuration = configs[j].configuration
            //
            //         }
            //     }
            // }

            for (var i = 0;i < configs.length;i++){
                if (configs[i].configuration.status == "failed"){

                    if (configs[i].interface == 1){
                        if (configs[i].status == "success"){
                            var div = $('<div class="alert alert-danger">接口一配置成功，参数配置失败！</div>');
                            $(".port1").before(div);
                        }else{
                            var div = $('<div class="alert alert-danger">接口一配置失败，参数配置失败！</div>');
                            $(".port1").before(div);
                        }
                    }else if(configs[i].interface == 2){
                        if (configs[i].status == "success"){
                            var div = $('<div class="alert alert-danger">接口二配置成功，参数配置失败！</div>');
                            $(".port2").before(div);
                        }else{
                            var div = $('<div class="alert alert-danger">接口二配置失败，参数配置失败！</div>');
                            $(".port2").before(div);
                        }
                    }else if(configs[i].interface == 3){
                        if (configs[i].status == "success"){
                            var div = $('<div class="alert alert-danger">接口三配置成功，参数配置失败！</div>');
                            $(".port3").before(div);
                        }else{
                            var div = $('<div class="alert alert-danger">接口三配置失败，参数配置失败！</div>');
                            $(".port3").before(div);
                        }
                    }else if(configs[i].interface == 4){
                        if (configs[i].status == "success"){
                            var div = $('<div class="alert alert-danger">接口四配置成功，参数配置失败！</div>');
                            $(".port4").before(div);
                        }else{
                            var div = $('<div class="alert alert-danger">接口四配置失败，参数配置失败！</div>');
                            $(".port4").before(div);
                        }
                    }
                    return;
                }
            }

            // for (var i = 0;i < physic_binding.configurations.length;i++){
            //     delete physic_binding.configurations[i].configuration.status;
            // }
            modal.modal("hide");
            toastrSucceed("配置成功！");
        }else{
            toastrFail(data.message);
        }
    })
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
        var trs = $('<tr minicc-id="'+ miniccId +'" model-id="1"><td><input type="checkbox" class="check" disabled></td><td>矩阵</td><td>--</td><td>--</td><td>--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl" disabled>配置控制项</button> <button type="button" class="btn btn-default btn-xs" id="matrix-control-btn">控制</button></td></tr><tr minicc-id="'+ miniccId +'"  model-id="2"><td><input type="checkbox" class="check" disabled></td><td>音量</td><td>--</td><td>--</td><td>--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl" disabled>配置控制项</button> <button type="button" class="btn btn-default btn-xs" id="volumn-control-btn">控制</button></td></tr><tr minicc-id="'+ miniccId +'"  model-id="3"><td><input type="checkbox" class="check" disabled></td><td>音频</td><td>--</td><td>--</td><td>--</td><td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModalControl" disabled>配置控制项</button> <button type="button" class="btn btn-default btn-xs" id="audio-control-btn">控制</button></td></tr>');
        deviceTbody.append(trs);

        for (var i = 0;i < equipments.length;i++){
            var tr = $('<tr minicc-id="'+ miniccId +'" equipment_bind_id="'+ equipments[i].equipment_bind_id +'" equipment_id="'+ equipments[i].equipment_id +'" interface_type="'+ equipments[i].interface_type +'"><td><input type="checkbox" class="check"></td><td class="editMinicc">'+ equipments[i].equipment_name +'</td><td class="editMinicc">'+ equipments[i].category_name +'</td><td class="editMinicc">'+ equipments[i].interface_index +'</td><td class="editMinicc">--</td><td><button type="button" class="btn btn-primary btn-xs control-s-btn">配置控制项</button>  <button type="button" class="btn btn-default btn-xs otherControlBtn">控制</button></td></tr>');
            deviceTbody.append(tr);
        }
        $("#device_table").trigger("footable_initialize");
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

//获取minicc物理接口配置项
$(".treeMenu").on("click",".mini_set",function () {
    bool1 = true;
    bool2 = true;
    bool3 = true;
    bool4 = true;
    var configureBody = $("#configure_body");
    configureBody.find($("select").prop("disabled",false));
    $(".alert-danger").remove();
    var deviceId = $(this).parent().attr("minicc-id");
    api.get("minicc/interfaceConfig",{"minicc_id":deviceId},function (data) {
        if(data.code === 0){

            if (data.data.length > 0){
                var arr = data.data;
                for (var i = 0;i < arr.length;i++){
                    for (var j = 0;j < physic_binding.configurations.length;j++){
                        if (arr[i].interface_index == physic_binding.configurations[j].interface){
                            physic_binding.configurations[j].configuration = arr[i].interface_config;
                            physic_binding.configurations[j].type = arr[i].interface_type;
                        }
                    }
                }

                var p1 = null,p2 = null,p3 = null,p4 = null;
                for (var m = 0;m < physic_binding.configurations.length;m++){
                    if (physic_binding.configurations[m].interface == 1){
                        p1 = physic_binding.configurations[m];
                    }else if(physic_binding.configurations[m].interface == 2){
                        p2 = physic_binding.configurations[m];
                    }else if(physic_binding.configurations[m].interface == 3){
                        p3 = physic_binding.configurations[m]
                    }else if(physic_binding.configurations[m].interface == 4){
                        p4 = physic_binding.configurations[m]
                    }
                }

                configureBody.find($("#firstPhy")).children("option[value='"+ p1.type +"']").prop("selected",true);
                configureBody.find($("#secondPhy")).children("option[value='"+ p2.type +"']").prop("selected",true);
                configureBody.find($("#thirdPhy")).children("option[value='"+ p3.type +"']").prop("selected",true);
                configureBody.find($("#fourPhy")).children("option[value='"+ p4.type +"']").prop("selected",true);
                if (p1.type == 3){
                    var o = $("<option value='3'>RS-232</option>");
                    var second =  configureBody.find($("#secondPhy"));
                    second.append(o);
                    second.find(o).prop("selected",true);
                    second.prop("disabled",true);
                    second.parent().next().children().prop("disabled",true);
                    bool1 = false;
                    bool2 = true;
                }
                if (p1.type == 4){
                    var o = $("<option value='4'>RS-485</option>");
                    var second = configureBody.find($("#secondPhy"));
                    second.append(o);
                    second.find(o).prop("selected",true);
                    second.prop("disabled",true);
                    second.parent().next().children().prop("disabled",true);
                    bool1 = false;
                    bool2 = true;
                }
                if (p3.type == 3){
                    var o = $("<option value='3'>RS-232</option>");
                    var four = configureBody.find($("#fourPhy"));
                    four.append(o);
                    four.find(o).prop("selected",true);
                    four.prop("disabled",true);
                    four.parent().next().children().prop("disabled",true);
                    bool3 = false;
                    bool4 = true;
                }
                if (p3.type == 4){
                    var o = $("<option value='4'>RS-485</option>");
                    var four = configureBody.find($("#fourPhy"));
                    four.append(o);
                    four.find(o).prop("selected",true);
                    four.prop("disabled",true);
                    four.parent().next().children().prop("disabled",true);
                    bool3 = false;
                    bool4 = true;
                }
            }else{
                bool1 = true;
                bool2 = true;
                bool3 = true;
                bool4 = true;
                configureBody.find($("#secondPhy")).parent().next().children().prop("disabled",false);
                configureBody.find($("#fourPhy")).parent().next().children().prop("disabled",false);
                physic_binding.configurations = [
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
                ];
                configureBody.find($("#firstPhy")).children("option[value='']").prop("selected",true);
                configureBody.find($("#secondPhy")).children("option[value='']").prop("selected",true);
                configureBody.find($("#thirdPhy")).children("option[value='']").prop("selected",true);
                configureBody.find($("#fourPhy")).children("option[value='']").prop("selected",true);
            }
            if ($(".port1").find($("select")).children("option:selected").val() != 3 && $(".port1").find($("select")).children("option:selected").val() != 4){
                $(".port2").find($("select")).prop("disabled",false);
                $(".port2").find($("select")).children("option[value='3']").remove();
                $(".port2").find($("select")).children("option[value='4']").remove();
            }
            if ($(".port3").find($("select")).children("option:selected").val() != 3 && $(".port1").find($("select")).children("option:selected").val() != 4){
                $(".port4").find($("select")).prop("disabled",false);
                $(".port4").find($("select")).children("option[value='3']").remove();
                $(".port4").find($("select")).children("option[value='4']").remove();
            }
        }
    });
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


//矩阵控制
// $("#matrixSureControl").on("click",function () {
//     var param = {
//         "device_id":$(".clickActive").attr("minicc-id"),
//         "matrix_input":$("#matrixSignal option:selected").val(),
//         "matrix_outpu":$("#matrixOutput option:selected").val(),
//         "matrix_output_priority":$("#matrixUndelay option:selected").val(),
//     };
//     api.post("",param,function (data) {
//         if (data.code === 0){
//             toastrSucceed("矩阵控制成功！");
//         }else{
//             toastrFail(data.message);
//         }
//     });
// });

//音量控制
// $("#volumeSureControl").on("click",function () {
//     var param = {
//         "device_id":$(".clickActive").attr("minicc-id"),
//         "sound_volume":$("#volume_title").html()-0,
//         "is_mute":$(".flexVolume .clickLi").attr("is_mute")-0,
//     };
//     api.post("",param,function (data) {
//         if(data.code === 0){
//             toastrSucceed("音量控制成功！");
//         }else{
//             toastrFail(data.message);
//         }
//     });
// });

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
    var _this = $(this);
    //删除控制项后台数据交互
    deleteControl(_this);
});
//编辑控制项
$("#myModalControl").on("click",".editControl",function () {
    var _this = $(this);
    var parent = _this.parent().parent();
    parent.find($(".name")).prop("disabled",false);
    parent.find($(".data")).prop("disabled",false);
    _this.next().prop("disabled",false);
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
    _this.prop("disabled",true);
    //修改控制项保存
    editControlSave(_this);
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
    // $(".config_sure").unbind("click");
    // $(".init_sure").unbind("click");
    // $(".config_sure").bind("click",sureToCommit);
}

//切换至初始化配置
function toInit(head,body) {
    configHead.children().remove();
    initBody.children().remove();
    var head = $(head);
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
    // $(".config_sure").removeAttr("onclick");
    // $(".config_sure").unbind("click");
    // $(".init_sure").unbind("click");
    // $(".init_sure").bind("click",changeJson);
}
function RSchange(_this,selectV,port) {//选择串口时将接口二四改变
    var optionHtml = _this.children("option:selected").html();
    var option = $('<option value="'+ selectV +'">'+ optionHtml +'</option>');
    var port2Select = port.find($("select"));
    port2Select.append(option);
    port2Select.find(option).prop("selected",true);
    port.find($("button")).prop("disabled",true);
    port2Select.prop("disabled",true);
}
function RSnoChange(port) {//串口取消选择时将接口二四置空
    var port2S = port.find($("select"));
    port2S.find($("option[value='4']")).remove();
    port2S.find($("option[value='3']")).remove();
    port.find($("button")).prop("disabled",false);
    port2S.prop("disabled",false);
    port2S.find($("option[value='']")).prop("selected",true);
}
/*
 * 定义初始化常量
 */
var IRHEADER = '<h4 class="modal-title">接口初始化</h4><small class="font-bold">初始化红外信息</small>';
var INITHEADER = '<h4 class="modal-title">接口初始化</h4><small class="font-bold">初始化接口信息</small>';
function RS_body(interface,type,none) {
    var str = '';
    if (arguments[2]){//如果第三个形参存在，即隐藏界面
        str = 'style="display:none"';
    }
    var RSBODY = $('<div class="form-horizontal" '+ str +' data-interface="'+ interface +'" data-type="'+ type +'"><div class="form-group"><label class="col-sm-2 control-label">数据位</label><div class="col-sm-10"><select class="form-control m-b dataBit"><option value="0">7</option><option value="1">8</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">奇偶校验</label><div class="col-sm-10"><select class="form-control m-b checkBit"><option value="0">None</option><option value="1">Odd</option><option value="2">Even</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">停止位</label><div class="col-sm-10"><select class="form-control m-b stopBit"><option value="0">1</option><option value="1">2</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">比特率</label><div class="col-sm-10"><select class="form-control m-b baudrateBit"><option value="2">1200</option><option value="3">2400</option><option value="4">4800</option><option value="5">9600</option><option value="6">14400</option><option value="7">19200</option><option value="8">38400</option><option value="9">56000</option><option value="a">57600</option><option value="b">115200</option></select></div></div></div>');
    return RSBODY;
}
function IO_body(interface,type) {
    var IOBODY = $('<div class="form-horizontal" data-interface="'+ interface +'" data-type="'+ type +'"><div class="form-group"><label class="col-sm-2 control-label">初始化模式</label><div class="col-sm-10"><select class="form-control m-b switchMode"><option value="1">闭合</option><option value="0">断开</option></select></div></div><div class="hr-line-dashed"></div></div>');
    return IOBODY;
}
function weak_body(interface,type) {
    var WEAKBODY = $('<div class="form-horizontal" data-interface="'+ interface +'" data-type="'+ type +'"><div class="form-group"><label class="col-sm-2 control-label">配置模式</label><div class="col-sm-10"><select class="form-control m-b ioMode"><option value="1">输入</option><option value="0">输出</option></select></div></div><div class="hr-line-dashed"></div><div class="form-group"><label class="col-sm-2 control-label">控制模式</label><div class="col-sm-10"><select class="form-control m-b electricLevel"><option value="1">高电平</option><option value="0">低电平</option></select></div></div><div class="hr-line-dashed"></div></div>');
    return WEAKBODY;
}
function thisInterface(arr,inter) {
    for (var i = 0;i < arr.length;i++){
        if (arr[i].interface == inter){
            return arr[i];
        }
    }
}
//点击配置按钮显示配置控制项浮动层
$(document).on("click",".control-s-btn",function () {
    $("#myModalControl").modal("show");
    var equipment_id = $(this).parent().parent().attr("equipment_id");
    var interface_type = $(this).parent().parent().attr("interface_type");

    initShow(equipment_id,interface_type);
});

var initShow = function initShow(equipment_id,interface_type) {
    $(".go-back").hide();
    $("#model-set").show();
    $("#controlSetPanel").hide();
    $("#edit-set-model").remove();
    $("#addModelDom").remove();
    $(".default-set").remove();
    $("#myModalControl .form-horizontal").attr("equipment_id",equipment_id);
    $("#myModalControl .form-horizontal").attr("interface_type",interface_type);
    var param = {
        "equipment_id":equipment_id
    }
    //获取自定义模块
    api.userPost("equipment_controller/getModel",param,getCustomModel);

    //获取缺省模块
    api.userPost("equipment_controller/getEquipmentDefaultModel",param,getDefaultModel);
};

var getCustomModel = function (json) {
    $(".custom-model .flexVolume").children().remove();
    $(".init-model").show();
    if(json.code == 0){
        var data = json.data;
        for (var i = 0;i < data.length;i++){
            var customDOM = $('<div m-id="'+ data[i].id +'"><div class="flex-a"><i class="fa fa-times-circle-o delete-model"></i><i class="fa fa-pencil-square-o edit-model"></i></div><i class="pe-7s-mute"></i><span>'+ data[i].model_name +'</span></div>');
            customDOM.appendTo($(".custom-model .flexVolume"));
        };
        var otherDom = $('<div><i class="pe-7s-mute"></i><span>其他</span></div><div class="add-model" style="font-size: 13px;"><i class="fa fa-plus-circle"></i><span>没找到需要的模式？点击添加</span></div>');
        otherDom.appendTo($(".custom-model .flexVolume"));
    };
}
var getDefaultModel = function (json) {
    $(".init-model .flexVolume").children().remove();
    $(".init-model").show();
    if(json.code == 0){
        var data = json.data;
        if (data.length > 0){
            for (var i = 0;i < data.length;i++){
                var defaultDOM = $('<div m-id="'+ data[i].id +'"><i class="pe-7s-mute"></i><span>'+ data[i].model_name +'</span></div>');
                defaultDOM.appendTo($(".init-model .flexVolume"));
            };
        }else{
            $(".init-model .flexVolume").children().remove();
            $(".init-model").hide();
        }
    };
};


var myModalControl = $("#myModalControl");
//配置控制项模式分类  点击设置模式下的控制项
myModalControl.on("click",".init-model .flexVolume div",function () {
    $(".control-add-set").hide();
    var equipment_id = $("#myModalControl .form-horizontal").attr("equipment_id");

    var param = {
        "equipment_id":equipment_id,
        "model_id":$(this).attr("m-id")
    }
    var url = "equipment_controller/getEquipmentDefaultOption";
    getOption(url,param);
});
myModalControl.on("click",".custom-model .flexVolume div",function () {
    if ($(this).hasClass("add-model")){
        return;
    }
    $(".control-add-sure-btn").attr("model-id",$(this).attr("m-id"));
    $(".control-add-set").show();
    var equipment_id = $("#myModalControl .form-horizontal").attr("equipment_id");
    var param = {
        "equipment_id":equipment_id,
        "model_id":$(this).attr("m-id")
    }
    var url = "equipment_controller/getOption";
    getOption(url,param);

});

var getOption = function (url,param) {
    var controlPanel = $("#controlSetPanel");
    var controlExitsDom = $(".control-exits-set");
    controlExitsDom.children().remove();
    controlExitsDom.append($("<samll>已有控制项</samll>"));
    api.userPost(url,param,function (json) {
        if (json.code == 0){
            var data = json.data;
            if (data){
                controlExitsDom.show();
                for (var item in data){

                    switch (data[item].control_type){
                        case 5:
                            var option = '';
                            for (var i = 0;i < data[item].options.length;i++){
                                option += '<option value="'+ data[item].options[i].option_value +'">'+ data[item].options[i].option_name +'</option>';
                            }
                            var selectDom = '<select class="form-control m-b">'+ option +'</select>';
                            var dom = $('<div class="form-group default-set" control-id="'+ data[item].control_id +'"><label class="col-sm-2 control-label">'+ data[item].control_name +'</label><div class="col-sm-10">'+ selectDom +'</div></div>');
                            dom.find($("select option[value='"+ data[item].current_value +"']")).prop("selected",true);
                            controlPanel.find(controlExitsDom).append(dom);
                            break;

                        case 1:
                            var formGroup = $('<div class="form-group" control_id="'+ data[item].control_id +'" model_id="'+ data[item].model_id +'"><div class="col-sm-3"><input type="text" class="form-control name" value="'+ data[item].control_name +'" disabled></div><div class="col-sm-5"><input type="text" class="form-control data" value="'+ data[item].control_value +'" disabled></div><div class="col-sm-4"><button type="button" class="btn btn-sm btn-danger2 deleteControl">删除</button> <button type="button" class="btn btn-sm btn-default editControl">编辑</button> <button type="button" class="btn btn-sm btn-info saveControl" disabled>保存</button></div></div>');
                            controlPanel.find(controlExitsDom).append(formGroup);
                            break;
                    }

                }
            }
            if (data.length == 0){
                controlExitsDom.hide();
            }
            //如果为无线或者红外口
            var type = $("#myModalControl").find($(".form-horizontal")).attr("interface_type") - 0;

            if (type == 64){
                //红外IR口
                var studyDom = $('<button type="button" class="btn btn-sm btn-default study-btn">学习</button>')
                $(".control-add-set").find($(".col-sm-4")).prepend(studyDom)
            }else if(type == 80){
                //无线
            }

            $("#model-set").hide();
            $("#controlSetPanel").show();
        }else{
            toastrFail(json.message);
        }
    });
};

myModalControl.on("click",".control-add-sure-btn",function () {
    var _this = $(this);
    var param = {
        "control_name":$(".control-name").val(),
        "control_value":$(".control-value").val(),
        "wireless_ir_id":0,
        "equipment_id":$("#myModalControl").find($(".form-horizontal")).attr("equipment_id"),
        "model_id":_this.attr("model-id") || "",
        "control_type":1
    };
    api.userPost("equipment_controller/addControllerOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            var equipment_id = $("#myModalControl .form-horizontal").attr("equipment_id");
            var p = {
                "equipment_id":equipment_id,
                "model_id":_this.attr("model-id") || ""
            }
            getOption("equipment_controller/getOption",p);
            $(".control-name").val("");
            $(".control-value").val("");
        }else{
            toastrFail(json.message);
        }
    });
});

myModalControl.on("click",".custom-model .flexVolume .add-model",function () {
    $("#model-set").hide();
    var addModelDom = $('<div class="form-group" id="addModelDom"><div class="col-sm-8"><input type="text" class="form-control model-name" placeholder="模块名称"></div><div class="col-sm-4"><button type="button" class="btn btn-sm btn-info add-model-sure">保存</button></div></div>');
    myModalControl.find($(".form-horizontal")).append(addModelDom);
});

myModalControl.on("click",".add-model-sure",function () {
    var equipment_id = myModalControl.find($(".form-horizontal")).attr("equipment_id");
    var param = {
        "equipment_id":equipment_id,
        "model_name":$(".model-name").val()
    };
    api.userPost("equipment_controller/addModel",param,function (json) {
        if (json.code == 0){
            initShow(equipment_id);
            $(".model-name").val("");
        }else{
            toastrFail(json.message);
        }
    });
});
//点击删除模块
myModalControl.on("click","#model-set .delete-model",function (e) {
    e.stopPropagation();
    if (confirm("删除此模块?")){
        var param = {
            "id":$(this).parent().parent().attr("m-id")
        };
        api.userPost("equipment_controller/deleteModel",param,function (json) {
            if (json.code == 0){
                initShow($("#myModalControl .form-horizontal").attr("equipment_id"));
            }else{
                toastrFail(json.message);
            }
        });
    }
});
//点击编辑模块
myModalControl.on("click","#model-set .edit-model",function (e) {
    e.stopPropagation();
    $("#model-set").hide();
    var editDom = $('<div class="form-group" id="edit-set-model"><label class="col-sm-3 control-label">'+ $(this).parent().next().next().html() +'</label><div class="col-sm-5"><input type="text" class="form-control edit-rename" placeholder="重命名模块名称"></div><div class="col-sm-4"><button type="button" class="btn btn-sm btn-info edit-sure-model" m-id="'+ $(this).parent().parent().attr("m-id") +'">保存</button></div></div>');
    editDom.appendTo($("#myModalControl .form-horizontal"));
});
//编辑模块保存
myModalControl.on("click",".edit-sure-model",function () {
    var equipment_id = $("#myModalControl .form-horizontal").attr("equipment_id");
    var param = {
        "model_name":$(".edit-rename").val(),
        "equipment_id":equipment_id,
        "id":$(this).attr("m-id")
    };
    api.userPost("equipment_controller/editModel",param,function (data) {
        if (data.code == 0){
            $("#edit-set-model").remove();
            initShow(equipment_id)
        }else{
            toastrFail(data.message);
        }
    })
});

//点击返回上一级
myModalControl.on("click",".flexVolume div",function () {
   $(".go-back").show();
});
myModalControl.on("click",".go-back",function () {
   initShow(myModalControl.find($(".form-horizontal")).attr("equipment_id"));
});

//类型1编辑保存控制项
var editControlSave = function (dom) {
    var _this = dom;
    var parent = _this.parent().parent();
    var controlName = parent.find($(".name")).val();
    var controlData = parent.find($(".data")).val();
    var param = {
        "control_id":_this.parent().parent().attr("control_id"),
        "control_name":controlName,
        "control_value":controlData,
        "wireless_ir_id":0,
        "equipment_id":myModalControl.find($(".form-horizontal")).attr("equipment_id"),
        "model_id":_this.parent().parent().attr("model_id"),
        "control_type":1
    };
    api.userPost("equipment_controller/editControllerOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
        }else{
            toastrFail(json.message);
        }
    });
};

//类型1删除控制项
var deleteControl = function (dom) {
    var _this = dom;
    console.log(_this);
    var param = {
        "control_id":_this.parent().parent().attr("control_id"),
        "equipment_id":myModalControl.find($(".form-horizontal")).attr("equipment_id")
    };
    api.userPost("equipment_controller/deleteControllerOption",param,function (json) {
        if (json.code == 0){
            _this.parent().parent().remove();
            $(".alert-danger").remove();
        }else{
            toastrFail(json.message);
        }
    });
};


/*
    控制
 */
//控制项模块列表
$("#device_table").on("click",".otherControlBtn",function () {
    $("#otherControl").modal("show");
    $("#control-set-c").show();
    $("#control-cs").hide();
    var _this = $(this);
    var eq_bind_id = _this.parent().parent().attr("equipment_id");
    var interface_type = _this.parent().parent().attr("interface_type");
    $("#otherControl").find($(".modal-body")).attr("equipment_id",eq_bind_id);
    $("#otherControl").find($(".modal-body")).attr("interface_type",interface_type);
    getControlOption(eq_bind_id);
});

var getControlOption = function (equipment_id) {
    $(".go-back-set").hide();

    var param = {
        "equipment_id":equipment_id
    };
    api.userPost("equipment_controller/getEquipmentDefaultModel",param,function (json) {
        $(".init-model-c .flexVolume").children().remove();
        if (json.code == 0){
            var data = json.data;
            if (data.length == 0){
                $(".init-model-c").hide();
            }
            for (var i = 0;i < data.length;i++){
                var flexDom = $('<div model-id="'+ data[i].id +'"><i class="pe-7s-volume"></i><span>'+ data[i].model_name +'</span></div>');
                $(".init-model-c .flexVolume").append(flexDom);
            }
        }else{
            toastrFail(json.message);
        }
    });

    api.userPost("equipment_controller/getModel",param,function (json) {
        $(".custom-model-c .flexVolume").children().remove();
        if (json.code == 0){
            var data = json.data;
            for (var i = 0;i < data.length;i++){
                var flexDom = $('<div model-id="'+ data[i].id +'"><i class="pe-7s-volume"></i><span>'+ data[i].model_name +'</span></div>');
                $(".custom-model-c .flexVolume").append(flexDom);
            }
            var flexDom2 = $('<div><i class="pe-7s-volume"></i><span>其他</span></div>');
            $(".custom-model-c .flexVolume").append(flexDom2);
        }else{
            toastrFail(json.message);
        }
    });
}

//点击控制项
var control = $("#otherControl");
control.on("click",".init-model-c .flexVolume div",function () {
    $("#control-set-c").hide();
    $("#control-cs").show();
    $("#control-cs").attr("control-category","3");
    $(".go-back-set").show();
    var param = {
        "equipment_id":$("#otherControl").find($(".modal-body")).attr("equipment_id"),
        "model_id":$(this).attr("model-id") || ""
    }
    api.userPost("equipment_controller/getEquipmentDefaultOption",param,function (json) {
        $("#control-cs .flexVolume").children().remove();
        if (json.code == 0){
            var data = json.data;
            if (data){

                for(var item in data){

                    switch (data[item].control_type){
                        case 1:
                            var flex = $('<div model-id="'+ data[item].model_id +'" equipment_id="'+ data[item].equipment_id +'" control-id="'+ data[item].control_id +'"><span>'+ data[item].control_name +'</span><small>'+ data[item].control_value +'</small></div>');
                            flex.appendTo($("#control-cs .flexVolume"));
                            break;
                    }
                }
            }
        }else{
            toastrFail(json.message);
        }
    });
});
control.on("click",".custom-model-c .flexVolume div",function () {
    $("#control-set-c").hide();
    $("#control-cs").show();
    $("#control-cs").attr("control-category","2");
    $(".go-back-set").show();
    var param = {
        "equipment_id":$("#otherControl").find($(".modal-body")).attr("equipment_id"),
        "model_id":$(this).attr("model-id") || ""
    }
    api.userPost("equipment_controller/getOption",param,function (json) {
        $("#control-cs .flexVolume").children().remove();
        if (json.code == 0){
            var data = json.data;
            if (data){

                for(var item in data){

                    switch (data[item].control_type){
                        case 1:
                            var flex = $('<div model-id="'+ data[item].model_id +'" equipment_id="'+ data[item].equipment_id +'" control-id="'+ data[item].control_id +'"><span>'+ data[item].control_name +'</span><small>'+ data[item].control_value +'</small></div>');
                            flex.appendTo($("#control-cs .flexVolume"));
                            break;
                    }
                }
            }
        }else{
            toastrFail(json.message);
        }
    });
});
control.on("click",".go-back-set",function () {
    $("#control-set-c").show();
    $("#control-cs").hide();
    getControlOption($("#otherControl").find($(".modal-body")).attr("equipment_id"));
});
control.on("click","#control-cs .flexVolume div",function () {
    var _this = $(this);
    var interfaceType = $("#otherControl").find($(".modal-body")).attr("interface_type")-0;
    var typeStr = '';
    switch (interfaceType){
        case 1:
            typeStr = 'INF_IO';
            break;
        case 2:
            typeStr = 'INF_RELAY';
            break;
        case 3:
            typeStr = 'INF_COM';
            break;
        case 4:
            typeStr = 'INF_COM';
            break;
        case 5:
            typeStr = 'INF_IR';
            break;
    }
    var param = {
        "equipment_id": _this.attr("equipment_id"),
        "control_id": _this.attr("control-id"),
        "control_value":_this.children().last().html(),
        "interface_type":typeStr,
        "control_category":$("#control-cs").attr("control-category"),
    };
   api.userPost("equipment_controller/sendOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            toastrSucceed("控制成功！");
        }else{
            toastrFail(json.message);
        }
   });
});

//minicc自有属性控制项   矩阵
$("#matrixSureControl").on("click",function () {

    var arrParams = {
        "matrix_input":$("#matrixSignal").children("option:selected").val(),
        "matrix_output":$("#matrixOutput").children("option:selected").val(),
        "matrix_output_priority":$("#matrixUndelay").children("option:selected").val()
    };

    var controlObj = {
        "1":{
            control_id:1,
            control_value:$("#matrixSignal").children("option:selected").val()
        },
        "2":{
            control_id:2,
            control_value:$("#matrixOutput").children("option:selected").val()
        },
        "3":{
            control_id:3,
            control_value:$("#matrixUndelay").children("option:selected").val()
        }
    };
    var param = {
        "equipment_id": $(".clickActive").attr("minicc-id"),
        "control_id": "1,2,3",
        "interface_type":"INF_MATRIX",
        "control_info":controlObj,
        "params":arrParams,
    };
    api.userPost("equipment_controller/sendMiniccOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            $("#matrixControl").modal("hide");
        }else{
            toastrFail(json.message);
        }
    });
});
//音量控件显示
var mySlider = $("#ex1").bootstrapSlider();

var volumeValue = mySlider.bootstrapSlider('getValue');
$('#ex1').bootstrapSlider({
    tooltip_position:'bottom',
    formatter: function(value) {
        volumeValue = value;
        return '当前音量:' + value;
    }
});
$("#ex1").on("change", function() {
    $("#ex6SliderVal").text(volumeValue);
});

//minicc自有属性控制项   音量
$("#volumeSureControl").on("click",function () {

    var isMute = $("#volumeControl").find($(".clickLi")).attr("is_mute")-0;
    var arrParams = {
        "sound_volume":volumeValue,
        "is_mute":isMute || 0,
    };

    var controlObj = {
        "volume":{
            control_id:6,
            control_value:volumeValue
        }
    };
    if (isMute){
        controlObj.is_mute = {
            control_id:4,
            control_value:1
        }
    }else{
        controlObj.is_mute = {
            control_id:5,
            control_value:0
        }
    }
    var controlId = "";
    if (controlObj.is_mute == 4){
        controlId = "4,6";
    }else{
        controlId = "5,6";
    }
    var param = {
        "equipment_id": $(".clickActive").attr("minicc-id"),
        "control_id": controlId,
        "interface_type":"INF_DSP",
        "control_info":controlObj,
        "params":arrParams,
    };
    api.userPost("equipment_controller/sendMiniccOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            $("#volumeControl").modal("hide");
        }else{
            toastrFail(json.message);
        }
    });
});

//minicc自有属性控制项   音频
$("#audioSureControl").on("click",function () {

    var arrParams = {
        "audio_input":$("#audio-select").children("option:selected").val() - 0
    };

    var controlObj = {
        "1":{
            control_id:7,
            control_value:$("#audio-select").children("option:selected").val()
        }
    };

    var param = {
        "equipment_id": $(".clickActive").attr("minicc-id"),
        "control_id": "7",
        "interface_type":"INF_AUDIO",
        "control_info":controlObj,
        "params":arrParams,
    };
    api.userPost("equipment_controller/sendMiniccOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            $("#audioControl").modal("hide");
        }else{
            toastrFail(json.message);
        }
    });
});

//拉取矩阵控制项列表
$(document).on("click","#matrix-control-btn",function () {
    $("#matrixControl").modal("show");
    $("#matrixsignal").children("option[value='']").prop("selected",true);
    $("#matrixOutput").children("option[value='']").prop("selected",true);
    $("#matrixUndelay").children("option[value='']").prop("selected",true);
    var _this = $(this);
    var param = {
        "device_id":_this.parent().parent().attr("minicc-id"),
        "model_id":_this.parent().parent().attr("model-id")
    };
    api.userPost("equipment_controller/modelDefaultOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            var data = json.data;
            $("#matrixsignal").children("option[value='"+ data[1].current_value +"']").prop("selected",true);
            $("#matrixOutput").children("option[value='"+ data[2].current_value +"']").prop("selected",true);
            $("#matrixUndelay").children("option[value='"+ data[3].current_value +"']").prop("selected",true);
        }else{
            toastrFail(json.message);
        }
    });
});

//拉取音量控制项列表
$(document).on("click","#volumn-control-btn",function () {
    $("#volumeControl").modal("show");
    $(".clickLi").removeClass("clickLi");
    $("#ex6SliderVal").html("0");
    mySlider.bootstrapSlider('setValue', 0);
    var _this = $(this);
    var param = {
        "device_id":_this.parent().parent().attr("minicc-id"),
        "model_id":_this.parent().parent().attr("model-id")
    };
    api.userPost("equipment_controller/modelDefaultOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            var data = json.data;
            mySlider.bootstrapSlider('setValue', data[6].current_value);
            $("#ex6SliderVal").html(data[6].current_value);
        }else{
            toastrFail(json.message);
        }
    });
});
//拉取音频控制项列表
$(document).on("click","#audio-control-btn",function () {
    $("#audioControl").modal("show");
    $("#audio-select").children("option[value='']").prop("selected",true);
    var _this = $(this);
    var param = {
        "device_id":_this.parent().parent().attr("minicc-id"),
        "model_id":_this.parent().parent().attr("model-id")
    };
    api.userPost("equipment_controller/modelDefaultOption",param,function (json) {
        if (json.code == 0){
            console.log(json);
            var data = json.data;
            $("#audio-select").children("option[value='"+ data[7].current_value +"']").prop("selected",true);
        }else{
            toastrFail(json.message);
        }
    });
});