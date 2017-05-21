/**
 * Created by root on 2017/3/28.
 */

var groupObj = {};//全局对象，存储树状列表的点击所在部门所有信息


api.get("group/tree",{},groupAll);

var setting = {
    view: {
        dblClickExpand:true,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback:{
        onClick:clickNode,
        beforeDrag: false,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRename:reName,
        onRemove:removeGroup,
    },
};
function groupAll (data) {
    //清除树状图
    $("#zTree").children().remove();
    //修改为zTree
    var dataObj = data.data;

    var zTreeNodes = [];
    var zTreeObj = {
        name:dataObj.companyName,
        open:true,
        dataId:"0"
    }
    var str = JSON.stringify(data);
    var node1 = str.split("\"groups\":")[1].split("\},\"message\"")[0];
    var node2 = node1.replace(/\"id\"/g,'\"dataId\"');
    var itNodes = JSON.parse(node2);
    zTreeObj.children = itNodes;
    zTreeNodes.push(zTreeObj);

    $.fn.zTree.init($("#zTree"), setting, zTreeNodes);
    var tree = $.fn.zTree.getZTreeObj("zTree");
    var firstTree = tree.getNodeByParam("dataId",0,null);
    clickNode(event,zTree,firstTree);
    tree.selectNode(firstTree);
}

/*
 *
 * 增删改查
 *
 */
function beforeEditName() {
    return true;
}
var deleteTreeNode;
function beforeRemove(treeId,treeNode) {
    deleteTreeNode = treeNode;
    $("#deleteGroupModal").modal("show");
    return false;
}
$("#deleteGroupAndPerson").on("click",function () {
    var id = deleteTreeNode.dataId;
    var param = {
        "id":id,
        "delete_type":"all",
    };
    api.deleteIt("group/delete",param,function (data) {
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        zTree.removeNode(deleteTreeNode);
        $("#deleteGroupModal").modal("hide");
    });
});
$("#deleteGroupOnly").on("click",function () {
    var id = deleteTreeNode.dataId;
    var param = {
        "id":id,
        "delete_type":"group",
    }
    api.deleteIt("group/delete",param,function (data) {
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        zTree.removeNode(deleteTreeNode);
        $("#deleteGroupModal").modal("hide");
    });
});
function beforeRename(treeId, treeNode, newName, isCancel) {
    if (newName.length == 0) {
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        zTree.cancelEditName();
    }
}

function reName(e, treeId, treeNode, isCancel) {
    var param = {
        "name":treeNode.name,
        "description":"",
        "parent_id":treeNode.parent_id,
        "id":treeNode.dataId
    }
    api.userPost("group/update",param,function (data) {
        if (data.code !== 0){
            var title = "名称编辑失败";
            var text = data.message;
            alertMessage(title,text);
        }else{
            return;
        }
    });
}

function removeGroup(e,treeId,treeNode) {

}

function showRemoveBtn(treeId, treeNode) {
    if(treeNode.dataId == 0 || treeNode.dataId == -1){
        return false;
    }
    return !treeNode.isParent;
}
function showRenameBtn(treeId, treeNode) {
    if(treeNode.dataId == 0 || treeNode.dataId == -1){
        return false;
    }
    return true;
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {
    if (treeNode.dataId == -1){
        return false;
    }
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='添加子部门' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        var zName = "新部门" + (newCount++);
        var param = {
            "name":zName,
            "description":"",
            "parent_id":treeNode.dataId
        }
        api.userPost("group/create",param,function (data) {
            if (data.code !== 0){
                var title = "部门添加失败";
                var text = data.message;
                alertMessage(title,text);
            }else{
            	console.log(data);
                var newNode = zTree.addNodes(treeNode, {name:zName,dataId:data.data,parent_id:treeNode.dataId})[0];
                zTree.editName(newNode);
            }
        });
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

function alertMessage(title,text) {
    if(isIE8()){
        alert(text);
    }else{
        swal({
            title: title,
            text: text
        });
    }
}







$("#group_table").footable();
//点击树节点
var personTbody = $("#group_table tbody");
function clickNode(event, treeId, treeNode) {
    $(".ztree .switch").css("color","#333333");
    $("#" + treeNode.tId + "_switch").css("color","#ffffff");
    groupObj = treeNode;
    $("#group_name").html(treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj("zTree");
    var id = treeNode.dataId;
    if (treeNode.dataId == 0){
        id = -1;
    };
    //选择部门请求子部门列表
    var param = {
        "parent_id":id,
        "activated":"0"
    };
    api.get("group/children",param,function  (data) {
        var arr = data.data.members;
        if(arr.length > 8){
            $("#paginationContent").show();
        }
        personTbody.children().remove();
        if (arr.length == 0) {
            var $trs = $('<tr><td colspan="8" style="text-align: center">此部门暂无成员</td></tr>');
            personTbody.append($trs);
        }else{
            for (var i = 0;i < arr.length;i++) {
                var sex = arr[i].gender == "M" ? "男" : "女";
                var status = arr[i].status;
                var staText = "";
                var staClas = "";
                var manager = "";
                if (arr[i].role_id === 1){
                    manager = "管理员";
                }else if (arr[i].role_id === 2){
                    manager = "普通";
                }else if(arr[i].role_id === 3){
                    manager = "后勤";
                }
                if(status == 0 || status == 1){

                    //未验证（未加入）
                    staText = "等待加入";
                    staClas = "activetion noVefied";
                }else if (status == 2){

                    //已加入公司
                    staText = "已加入";
                    staClas = "activetion joined";
                }else if(status == 3){

                    //拒绝加入
                    staText = "已拒绝";
                    staClas = "activetion refuse";
                }else if(status == 4){

                    //已被公司移除
                    staText = "已移除";
                    staClas = "activetion removed";
                }else{

                    //等待激活
                    staText = "激活";
                    staClas = "activetion waitActived";
                }
                var $trs = $('<tr member-id="'+ arr[i].id +'"><td><input type="checkbox" class="check"></td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ arr[i].nickname +'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ sex +'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ arr[i].jobTitle +'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ arr[i].contact +'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ arr[i].email +'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ manager +'</td><td><button type="button" class="btn btn-primary btn-xs">'+ staText +'</button></td></tr>')
                personTbody.append($trs);
            }
        }
        //将生成的成员列表添加正反选
        checkOrCancel(".checkAll",".check");
        $("#group_table").trigger("footable_initialize");
    });
}


//搜索分组
var searchInp = $(".searchIt");
searchInp.on("input",function () {
    if(searchInp.val() == ""){
        api.get("group/tree",{},groupAll);
    }else{
        var param = {
            "q":searchInp.val()
        }
        api.get("group/all",param,function (data) {
            //清除以前的树状图,防止二次调用重复
            $("#zTree").children().remove();
            var arr = data.data.data;
            var arrStr = JSON.stringify(arr);
            var arrA = JSON.parse(arrStr.replace(/\"id\"/g,'\"dataId\"'));
            $.fn.zTree.init($("#zTree"), setting, arrA);
        });
    }
});

//添加用户保存
$(".add_person_btn").on("click",function  () {
    var param = {
        "nickname":$('.name').val(),
        "role_id":$(".role option:selected").val(),
        "serial_no":$(".serial_no").val(),
        "mobile":$(".phone").val(),
        "job_title":$(".job").val(),
        "group_id":groupObj.dataId,
        "gender":$(".sex option:selected").val() == 1 ? "M" : "F",
    }
    api.userPost("user/create",param,function (data) {
        if (data.code == 0) {
            var text = "成功";
            toastrSucceed(text);
            $("#addPerson input").val("");
            clickNode(event,zTree,groupObj);
        }else{
            var text = data.message;
            toastrFail(text);
        }
    });
});


//取消用户保存
$(".cancel_person_btn").on("click",function  () {
    $("#addPerson input").val("");
});

//批量导入
$(".export_file").on("click",function () {
    $("#hiddenIn").val(groupObj.dataId);
    var options = {
        headers:{
            Authorization: api.checkCookieOrSession()
        },
        url: api.host +"user/import",
        dataType:"json",
        success:function (data) {
            if(data.code == 0){
                var text = "导入成功";
                toastrSucceed(text);
                clickNode(event,zTree,groupObj);
                $("#fileToUpload").val("");
            }else{
                var text = data.message;
                toastrFail(text);
                clickNode(event,zTree,groupObj);
                $("#fileToUpload").val("");
            }
        }
    }
    $("#myForm").ajaxSubmit(options);
});

//批量删除成员
$("#deleteMembers").on("click",function  () {
    var checked = $(".check:checked");
    if (checked.length == 0) {
        var text = "您未选择任何成员";
        toastrFail(text);
        return;
    }else{
        deleteMembers();
    }
});



function deleteMembers() {
    if (isIE8()){
        if (confirm("确定删除成员?")){
            deleteTheseMember();
        }
    }else{
        swal({
                title: "确定删除成员?",
                text: "删除的成员可再次邀请",
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
}

function deleteTheseMember() {
    var checked = $(".check:checked");
    for (var i = 0;i < checked.length;i++) {
        var param = {
            "uid":checked.eq(i).parent().parent().attr("member-id"),
            "group_id":groupObj.dataId
        };
        api.userPost("user/removeFromGroup",param,function  (data) {
            if (data.code == 0){
                var text = "删除成功";
                toastrSucceed(text);
                checked.parent().parent().remove();
            }else{
                var text = data.message;
                toastrFail(text);
            }
        })
    }
}
$("#group-g").select2tree({
    tags: true
});
//修改用户 点击表格tr弹出用户编辑框
var editUsrId = null;
personTbody.on("click",".clickTr",function () {
    editUsrId = $(this).parent().attr("member-id");
    $("#editMembers input").val("");
    $(".e_group").html("");
    api.get("group/lists",{},function (data) {
        var arrG = data.data;
        for (var i = 1;i < arrG.length;i++){
            var option = $('<option value="'+ arrG[i].id +'" parent="'+ arrG[i].parent_id || '' +'">'+ arrG[i].name +'</option>');
            $(".e_group").append(option);
        }
        if(groupObj.dataId == -1 || groupObj.dataId == 0){
            var op = $('<option value="0">请选择部门</option>');
            $(".e_group").prepend(op);
        }
        api.get("companyUser/info",{"id":editUsrId},function (data) {
            var em = data.data;
            $(".e_name").val(em.nickname);
            var val = em.gender == "M" ? 1 : 2;
            $('.e_sex option[value="'+ val +'"]').prop("selected",true);
            $(".e_phone").val(em.mobile);
            $(".e_job").val(em.jobTitle);
            $(".e_serial_no").val(em.serialNo);
            $(".e_email").val(em.email);
            $('.e_role option[value="'+ em.roleId +'"]').prop("selected",true);
            //所在部门数组
            //["root", "level21"]
            $("#group-g").val(em.groupId).trigger('change');
            $('.e_group option[value="'+ em.groupId +'"]').prop("selected",true);
        });
    });

});
//编辑成员
$(".edit_person_btn").on("click",function () {
    var param = {
        "id":editUsrId,
        "nickname":$(".e_name").val(),
        "gender":$(".e_sex option:selected").val() == 1 ? "M" : "F",
        "mobile":$(".e_phone").val(),
        "role_id":$(".e_role option:selected").val(),
        "job_title":$(".e_job").val(),
        "group_id":$(".e_group option:selected").val(),
        "serial_no":$(".e_serial_no").val(),
        "email":$(".e_email").val()
    };
    api.userPost("companyUser/updateEmployee",param,function (data) {
        if(data.code == 0){
            var text = "修改成功";
            toastrSucceed(text);
            $("#editMembers input").val("");
            clickNode(event,zTree,groupObj);
        }else{
            var text = data.message;
            toastrFail(text);
        }
    });
})

