/**
 * Created by root on 2017/4/11.
 */
var pageNum;
//设备分类
function equipmentCateory() {
    api.get("equipmentCategory/lists",{},function (data) {
        if (data.code === 0){
            var arr = data.data;
            for (var i = 0;i < arr.length;i++){
                var option = $('<option value="'+ arr[i].id +'">'+ arr[i].name +'</option>');
                $(".equipCategory").append(option);
            }
        }
    })
}
equipmentCateory();

//新增设备种类
$(".sureAddEquipCategory").on("click",function () {
    if (!$("#addEquipCategoryInp").val()){
        $(".alert").remove();
        $("#addEquipCategoryInp").parent().parent().before($('<div class="alert alert-danger">名称不能为空！</div>'));
        return;
    }else{
        api.userPost("equipmentCategory/create",{"name":$("#addEquipCategoryInp").val()},function (data) {
            if(data.code === 0){
                var option = $('<option value="'+ data.data +'">'+ $("#addEquipCategoryInp").val() +'</option>');
                $(".equipCategory").append(option);
                $("#addEquipCategoryInp").val("");
                $("#myModal9").modal("hide");
                toastrSucceed("添加成功");
            }else{
                $("#myModal9").modal("hide");
                toastrFail(data.message);
            }
        })
    }
});
//添加设备表单为空验证
function customEuipValidate(objs) {
    for (var i = 0;i < objs.length;i++){
        if (objs[i].children("option").length === 0){
            //不是select框
            if(!objs[i].val()){
                var alert = $('<div class="alert alert-danger">'+ objs[i].parent().prev().html() +'不能为空！</div>');
                objs[i].parent().parent().before(alert);
            }

        }else{
            //是select框
            if(!objs[i].children("option:selected").val()){
                var alert = $('<div class="alert alert-danger">请选择'+ objs[i].parent().prev().html() +'！</div>');
                objs[i].parent().parent().before(alert);
            }
        }
    }
}
//
$("#customMeetRoom").select2();
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//点击添加设备按钮才开始进行会议室列表加载并更新时间
$("#addEquipmentBtn").on("click",function () {
    var customMeetRoom = $("#customMeetRoom");
    ajaxGetMeetRoom(customMeetRoom);
    //更新时间为现在时间
    $("#customBuyTime").val(getNowFormatDate());
    $("#customUseTime").val(getNowFormatDate());
    $('.input-group.date').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
    });
})

function ajaxGetMeetRoom(customMeetRoom) {
    customMeetRoom.children().remove();
    //会议室列表
    api.get("meeting_room/all",{},function (data) {
        var meetRoomArr = data.data;
        customMeetRoom.append($('<option value="">请选择会议室</option>'));
        for(var i = 0;i < meetRoomArr.length;i++){
            var meetRoom = $('<option value="'+ meetRoomArr[i].id +'">'+ meetRoomArr[i].name +'</option>');
            customMeetRoom.append(meetRoom);
        }
    });
}

//添加设备
$("#sureAddEquipment").on("click",function () {
    $(".alert").remove();
    customEuipValidate([$("#customName"),$("#customCategory"),$("#customAssetCate"),$("#customBrand"),$("#customModal"),$("#customSeries"),$("#customMeetRoom"),$("#customStatus")]);
    var param = {
        "category_id":$("#customCategory option:selected").val(),
        "brand":$("#customBrand").val(),
        "type":$("#customModal").val(),
        "serial_no":$("#customSeries").val(),
        "name":$("#customName").val(),
        "is_fixed":$("#customAssetCate option:selected").val(),
        "bought_at":$("#customBuyTime").val(),
        "used_at":$("#customUseTime").val(),
        "room_id":$("#customMeetRoom option:selected").val(),
        "status":$("#customStatus option:selected").val()
    };
    api.userPost("equipment/create",param,function (data) {
        if (data.code === 0){
            toastrSucceed("添加成功！");
            $("#myModal8").modal("hide");
            var param = {
                "q":$("#searchDevice").val(),
                "page":pageNum || '',
                "category_id":$("#equipCategory option:selected").val()
            }
            ajaxTable(param);
        }else{
            toastrFail(data.message);
        }
    })

});

(function () {
    ajaxTable();
})(null);

function ajaxTable(param) {
    var tbody = $("#device_table tbody");
    tbody.children().remove();
    api.get("equipmentCategory/listEquipments",param,function (data) {
       if(data.code === 0){
           var arr = data.data;
           if (arr.length === 0){
               var tr = $('<tr><td colspan="11" style="text-align: center">无设备</td></tr>');
               tbody.append(tr);
               $("#paginationTable").hide();
               return;
           }
           for (var i = 0;i < arr.length;i++){
               var isMiniCC = arr[i].is_minicc === 0 ? arr[i].category_name : '<a href="device.html">'+ arr[i].category_name +'</a>';//是否是Mini CC
               var isRelated = arr[i].related_with === 0 ? "否" : "是";//是否已关联Mini CC
               var statu = "";
               switch (arr[i].status){
                   case 1:
                       statu = "正常";
                       break;
                   case 2:
                       statu = "维修中";
                       break;
                   case 3:
                       statu = "故障";
                       break;
                   default:
                       break;
               }
               var tr = $('<tr device-id="'+ arr[i].id +'" is_fixed="'+ arr[i].is_fixed +'"><td><input type="checkbox" class="check"></td><td class="ifChange">'+ arr[i].name +'</td><td  class="ifChange" categroy-id="'+ arr[i].category_id +'">'+ isMiniCC +'</td><td  class="ifChange">'+ arr[i].brand_name +'</td><td  class="ifChange">'+ arr[i].type_name +'</td><td  class="ifChange">'+  arr[i].serial_no +'</td><td room-id="'+ arr[i].meeting_room_id +'" class="ifChange">'+ arr[i].meeting_room_name +'</td><td class="ifChange">'+  arr[i].bought_at.split(" ")[0] +'</td><td  class="ifChange">'+ arr[i].used_at.split(" ")[0] +'</td><td status-id="'+ arr[i].status +'" class="ifChange">'+ statu +'</td><td  class="ifChange">'+ isRelated +'</td></tr>');
                tbody.append(tr);
           }
           if (arr.length > 8){
               $("#paginationTable").show();
               $("#device_table").trigger("footable_initialize");
           }else{
               $("#paginationTable").hide();
           }
           checkOrCancel(".checkAll",".check");
       }
    });
}

//由设备种类筛选设备
$("#equipCategory").on("change",function () {
    var val = $(this).children("option:selected").val();
    if (val === undefined || val === ""){
        $(".editEquipCateBtn").prop("disabled",true);
        ajaxTable(null);
    }else{
        $(".editEquipCateBtn").prop("disabled",false);
        var param = {
            "category_id":val,
            "q":$("#searchDevice").val(),
            "page":pageNum || '',
        };
        ajaxTable(param);
    }
});

//由搜索框搜索设备
$("#searchDevice").on("input",function () {
    var param = {
        "category_id":$(".equipCategory option:selected").val(),
        "q":$("#searchDevice").val(),
        "page":1,
    };
   ajaxTable(param);
});

//由固定资产流动资产筛选
var filter = $("#filterAsset");
filter.on("change",function () {
    var isfixed = filter.children("option:selected").val();
    var param = {
        "category_id":$(".equipCategory option:selected").val(),
        "q":$("#searchDevice").val(),
        "page":1,
        "is_fixed":isfixed
    };
    ajaxTable(param);
});

//修改设备分类名称
$(".editEquipCateBtn").on("click",function () {
    $("#editEquipCategoryInp").val($(".equipCategory option:selected").html());
})

$(".sureEditEquipCategory").on("click",function () {
    var inp = $("#editEquipCategoryInp");
    var val = $(".equipCategory option:selected").val();
    customEuipValidate([inp]);
    var param = {
        "name":inp.val(),
        "id":val
    };
    api.userPost("equipmentCategory/update",param,function (data) {
        if (data.code === 0){
            $(".equipCategory").children().remove();
            $(".equipCategory").append($('<option value="">请选择设备种类</option>'));
            equipmentCateory();
            toastrSucceed("修改成功！");
            $("#myModal10").modal("hide");
        }else{
            toastrFail(data.message);
        }
    })
});
//删除设备分类
$("#deleteEquipCategory").on("click",function () {
    var val = $(".equipCategory option:selected").val();
    api.deleteIt("equipmentCategory/delete",{"id":val},function (data) {
        if(data.code === 0){
            $(".equipCategory").children().remove();
            $(".equipCategory").append($('<option value="">请选择设备种类</option>'))
            toastrSucceed("删除成功");
            equipmentCateory();
            $("#myModal10").modal("hide");
        }
    });
});

var deviceId = "";
//修改设备信息拉取设备信息
$("#device_table").on("click",".ifChange",function () {

    $("#myModalEdit").modal("show");
    var editMeetRoom = $("#editMeetRoom");
    var _thisTr = $(this).parent();
    deviceId = _thisTr.attr("device-id");
        $("#editName").val(_thisTr.children().eq(1).html());
    $("#editCategory").children("option[value='"+ _thisTr.children().eq(2).attr("categroy-id") +"']").prop("selected",true);
    $("#editBrand").val(_thisTr.children().eq(3).html());
    $("#editModal").val(_thisTr.children().eq(4).html());
    $("#editSeries").val(_thisTr.children().eq(5).html());
    $("#editAssetCate").children("option[value='"+ _thisTr.attr("is_fixed") +"']").prop("selected",true);
    editMeetRoom.children().remove();
    //会议室列表
    api.get("meeting_room/all",{},function (data) {
        var meetRoomArr = data.data;
        editMeetRoom.append($('<option value="">请选择会议室</option>'));
        for(var i = 0;i < meetRoomArr.length;i++){
            var meetRoom = $('<option value="'+ meetRoomArr[i].id +'">'+ meetRoomArr[i].name +'</option>');
            editMeetRoom.append(meetRoom);
        }
        editMeetRoom.children("option[value='"+ _thisTr.children().eq(6).attr("room-id") +"']").prop("selected",true);
    });
    $("#editStatus").children("option[value='"+ _thisTr.children().eq(9).attr("status-id") +"']").prop("selected",true);
    var timeBuy = _thisTr.children().eq(7).html().split(" ")[0];
    var timeUse = _thisTr.children().eq(8).html().split(" ")[0];
    $("#editBuyTime").val(timeBuy);
    $("#editUseTime").val(timeUse);
    $('.input-group.date').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
    });
});

//修改设备信息
$("#sureEditEquipment").on("click",function () {
    var param = {
        "category_id":$("#editCategory option:selected").val(),
        "brand":$("#editBrand").val(),
        "type":$("#editModal").val(),
        "serial_no":$("#editSeries").val(),
        "id":deviceId,
        "name":$("#editName").val(),
        "is_fixed":$("#editAssetCate option:selected").val(),
        "status":$("#editStatus option:selected").val(),
        "bought_at":$("#editBuyTime").val(),
        "used_at":$("#editUseTime").val(),
        "room_id":$("#editMeetRoom option:selected").val()
    };
    api.userPost("equipment/update",param,function (data) {
        if(data.code === 0){
            toastrSucceed("修改成功！");
            $("#myModalEdit").modal("hide");
            $("#myModalEdit").find($("input")).val("");
            $("#myModalEdit").find($("select")).children("option[value='']").prop("selected",true);
            var param = {
                "category_id":$(".equipCategory option:selected").val(),
                "q":$("#searchDevice").val(),
                "page":pageNum || '',
            };
            ajaxTable(param);
        }else{
            toastrFail(data.message);
        }
    });
});
// 取消修改设备信息
$("#cancelEditEquipment").on("click",function () {
    $("#myModalEdit").modal("hide");
    $("#myModalEdit").find($("input")).val("");
    $("#myModalEdit").find($("select")).children("option[value='']").prop("selected",true);
});
//批量导入设备
$(".export_file").on("click",function () {
    var options = {
        headers:{
            Authorization: api.checkCookieOrSession()
        },
        url: api.host +"equipment/import",
        dataType:"json",
        success:function (data) {
            if(data.code == 0){
                $("#fileToUpload").val("");
                toastrSucceed("导入成功！");
                var param = {
                    "category_id":$(".equipCategory option:selected").val(),
                    "q":$("#searchDevice").val(),
                    "page":pageNum || '',
                };
                ajaxTable(param);
                $("#myModal").modal("hide");
            }else{
                $("#fileToUpload").val("");
                toastrFail("导入失败！");
            }
        }
    }
    $("#myForm").ajaxSubmit(options);
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
            confirmButtonText: "是",
            cancelButtonText: "否",
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
    var arrId = [];
    for (var i = 0;i < checked.length;i++) {
        arrId.push(checked.eq(i).parent().parent().attr("device-id"));

    };
    var param = {
        "id":arrId,
        "_method":"DELETE"
    }
    api.userPost("equipment/delete",param,function (data) {
        if (data.code === 0){
            checked.parent().parent().remove();
            toastrSucceed("删除成功");
        }else{
            toastrFail(data.message);
        }
    })
}



