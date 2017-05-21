/**
 * Created by root on 2017/3/28.
 */
//个人中心
api.userPost("user/me",{},myCompany);
function myCompany (data) {
    if (data.data.user.companies.length > 1) {//如果公司只有一个，隐藏下拉按钮

        $('.down_arrow').show();
    }
    $('.company').html(data.data.user.companies[0].companyName);
    $('.user').html(data.data.user.user.nickname);
}
//退出登录
$('.user_loginOut_icon').on('click',function  () {
    $("#login_out").modal("show");
});
//确定退出登录
$(".login_out_btn").on("click",function  () {
    api.userPost("auth/logout",{},function  () {
        window.location.href = "register.html?login";
    })
});

//所有组选项
var departTbody = $('.depart_lists_add');

var groupsId = "0";//全局变量，存储树状列表的点击所在部门的id
var groupObj = {};//全局对象，存储树状列表的点击所在部门所有信息


api.get("group/tree",{},groupAll);


var tree = null;//存储zTree对象
var setting = {
    view: {
        showIcon: false,
        showTitle:false,
        showLine:false,
    },
    callback:{
        onClick:clickNode
    },
    data: {
        simpleData: {
            enable: true
        }
    },

};
function groupAll (data) {
    //清除以前的树状图,防止二次调用重复
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

    tree = $.fn.zTree.getZTreeObj("zTree");
    var firstTree = tree.getNodeByParam("dataId",0,null);
    clickNode(event,zTree,firstTree);
    tree.selectNode(firstTree);
}

//点击树节点
function clickNode(event, treeId, treeNode) {
    $("#company_title").html(treeNode.name);
    if(treeNode.dataId == 0 || treeNode.dataId == -1){
        $(".edit_depart_name").hide();
    }else{
        $(".edit_depart_name").show();
    }
    //面包屑
    var breadcrumb = $(".breadcrumb");
    breadcrumb.children().remove();
    var parent = treeNode;
    var a = parent;
    for(var i = 0;i < treeNode.level;i++){
        a = a.getParentNode();
        var li = $('<li><a href="javascript:;" dataId="'+ a.dataId +'">'+ a.name +'</a></li>');
        breadcrumb.prepend(li);
    }
    var liend = $('<li class="active">'+ treeNode.name +'</li>');
    breadcrumb.append(liend);
    groupObj = treeNode;
    var param = {
        "parent_id":treeNode.dataId,
        "activated":"0"
    };
    var department = $('.department');
    var persons = $('.persons');
    var person_lists = $(".person_list");

    //选择部门请求子部门列表
    api.get("group/children",param,function  (data) {
        var arr = data.data.groups;
        $(".depart_lists_add").children().remove();
        if (arr.length == 0) {
            var $trs = $('<tr><td colspan="2" style="text-align: center;">无子部门</td></tr>')
            departTbody.append($trs);
        }else{
            for (var i = 0;i < arr.length;i++) {
                var $trs = $('<tr data-group-id="'+ arr[i].id +'"><td>'+ arr[i].name +'<span class="glyphicon glyphicon-chevron-right right_icon"></span></td></tr>')
                departTbody.append($trs);
            }
        }

        //选择部门请求部门成员列表
        var membersArr = data.data.members;
        //清除表格内容
        person_lists.children().remove();
        if (membersArr.length == 0) {
            var $trs = $('<tr><td colspan="6" style="text-align: center;width: 900px;height: 50px;border-bottom: 1px solid #f2f2f2;">此部门暂无成员</td></tr>')
            person_lists.append($trs);
        }else{
            for (var i = 0;i < membersArr.length;i++) {
                var sex = membersArr[i].gender == "M" ? "男" : "女";
                var status = membersArr[i].status;
                var staText = "";
                var staClas = "";
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
                var $trs = $('<tr member-id="'+ membersArr[i].id +'"><td><input type="checkbox" class="check"/></td><td class="clickTr">'+ membersArr[i].nickname +'</td><td class="clickTr">'+ sex +'</td><td class="clickTr">'+ membersArr[i].jobTitle +'</td><td class="clickTr">'+ membersArr[i].contact +'</td><td><button class="'+ staClas +'">'+ staText +'</button></td></tr>')
                person_lists.append($trs);
            }
        }

        //将生成的成员列表添加正反选
        checkOrCancel(".checkAll",".check");

    });
}
//点击表格进入下一级
var tableListTr = $(".depart_lists_add");
tableListTr.on("mouseover","tr",function () {
    if(!$(this).attr("data-group-id")){
        return;
    }
    tableList.children().css("backgroundColor","#ffffff");
    $(this).css("backgroundColor","rgba(236, 239, 244,0.7)");
})
tableListTr.on("mouseout","tr",function () {
    tableList.children().css("backgroundColor","#ffffff");
})
//点击成员表格
var personListTr = $(".person_list");
personListTr.on("mouseover","tr",function () {
    if(!$(this).attr("member-id")){
        return;
    }
    personListTr.children().css("backgroundColor","#ffffff");
    $(this).css("backgroundColor","rgba(236, 239, 244,0.7)");
})
personListTr.on("mouseout","tr",function () {
    personListTr.children().css("backgroundColor","#ffffff");
})
//
var tableList = $(".depart_lists_add");
tableList.on("click","tr",function () {
    if(!$(this).attr("data-group-id")){
        return;
    }
    var thisNode = tree.getNodeByParam("dataId",$(this).attr("data-group-id"));
    clickNode(event,zTree,thisNode,null);
    tree.expandNode(thisNode, true, false, false);
    tree.selectNode(thisNode);
});
//点击面包屑
$(".breadcrumb").on("click","a",function () {
    var node = tree.getNodeByParam("dataId", $(this).attr("dataId"), null);
    tree.selectNode(node);
    clickNode(event,zTree,node);
    tree.expandNode(node, false, true, false);
});


//搜索分组
$(".search").on("input",function () {
    if($(".search").val() == ""){
        api.get("group/tree",{},groupAll);
    }else{
        var param = {
            "q":$(".search").val()
        }
        api.get("group/all",param,function (data) {
            //清除以前的树状图,防止二次调用重复
            $("#zTree").children().remove();
            var arr = data.data.data;
            var arrStr = JSON.stringify(arr);
            var arrA = JSON.parse(arrStr.replace(/\"id\"/g,'\"dataId\"'));
            console.log(arrA);
            $.fn.zTree.init($("#zTree"), setting, arrA);
        });
    }
});

//添加用户
$('.add_usr_child').on('click',function  () {
    $('.sidebar').hide();
    slideShow($('.add_usr_silde'));
});
//添加用户保存
$(".user_create").on("click",function  () {
    var param = {
        "nickname":$('.name').val(),
        "role_id":$(".role option:selected").val(),
        "serial_no":$(".serial_no").val(),
        "mobile":$(".phone").val(),
        "job_title":$(".job").val(),
        "group_id":groupObj.dataId,
        "gender":$(".sex option:selected").val() == 1 ? "M" : "F",
    }
    api.userPost("user/create",param,function  (data) {
        if (data.code == 0) {
            $('.sidebar').hide();
            $(".tips_text").html("添加成功");
            $("#no_groups").modal("show");
            delayDisapper(800);
            clickNode(event,zTree,groupObj);
        }else{
            $(".tips_text").html(data.message);
            $("#no_groups").modal("show");
            delayDisapper(800);
        }

    });
});
//取消用户保存
$(".user_delete_cancel").on("click",function  () {
    $('.name').val("");
    $(".serial_no").val("");
    $(".phone").val("");
    $(".job").val("");
    slideHide();
});

//添加子部门
$('.add_depart_child').on("click",function  () {
    $('.sidebar').hide();
    slideShow ($('.add_departs_silde'))
});
//添加子部门并在本地刷新
$(".add_departs_save").on("click",function  () {
    var name = $('.depart_name').val()
    var param = {
        "name":name,
        "description":$(".description").val(),
        "parent_id":groupObj.dataId
    };
    api.userPost("group/create",param,function  (data) {
        if (data.code == 0) {
            slideHide();
            var newNode = {
                "name":name,
                "dataId":data.data,
                "parent_id":groupObj.dataId
            }
            tree.addNodes(groupObj,newNode);
            //表格刷新
            $('.depart_name').val("");
            $(".description").val("");
        }else{
            $(".tips_text").html(data.message);
            $("#no_groups").modal("show");
            delayDisapper(800);
        }
    });
});
//取消添加子部门
$(".add_departs_cancel").on("click",function  () {
    slideHide();
    $('.depart_name').val("");
    $(".description").val("");
})

//修改部门
$('.edit_depart_name').on("click",function  () {
    $('.sidebar').hide();
    $(".depart_change_name").val("");
    $(".description_change").val("");
    var param = {
        "group_id":groupObj.dataId
    };
    api.get("group/briefInfo",param,function (data) {
        var d = data.data;
        $(".depart_change_name").val(d.name);
        $(".description_change").val(d.description);
    });
    slideShow($('.change_departs_silde'));
});
//取消编辑部门
$(".change_departs_delete").on("click",function  () {
    $(".depart_change_name").val("");
    slideHide();
});
//删除部门
$(".departs_delete").on("click",function () {
    $(".delete_groups").modal("show");
});
//删除部门确定
$(".delete_this_group").on("click",function  () {
    var param = {
        "id":groupObj.dataId,
    };
    api.deleteIt("group/delete",param,function  (data) {
        if(data.code == 0){
            $(".tips_text").html(data.message);
            $("#no_groups").modal("show");
            var node = tree.getNodeByParam("dataId", groupObj.dataId, null);
            var cNode = node.getPreNode() || node.getNextNode() || node.getParentNode();
            tree.removeNode(node);
            clickNode(event,zTree,cNode);
            tree.selectNode(cNode);
            delayDisapper(800);
            $(".depart_change_name").val("");
            slideHide();
        }else{
            $(".tips_text").html(data.message);
            $("#no_groups").modal("show");
            delayDisapper(800);
        }
    })
    $("#delete_groups").modal('hide');
});
//修改部门名称保存
$(".change_departs_save").on("click",function  () {
        var param = {
            "name":$(".depart_change_name").val(),
            "description":$(".description_change").val(),
            "parent_id":groupObj.parent_id,
            "id":groupObj.dataId,
            //"manager_id":"1"
        };
    api.userPost("group/update",param,function  (data) {
        if (data.code == 0) {
            slideHide();
            //本地重新获取tree列表
            api.asyncGet("group/tree",{},groupAll);
        }else{
            $(".tips_text").html(data.message);
            $("#no_groups").modal("show");
            delayDisapper(800);
        }
    })
});

//批量导入
$(".uoload_user_btn").on("click",function  () {
    $('.sidebar').hide();
    slideShow($(".upload_users"));
});
//批量导入
function upLoad() {
    $("#hiddenIn").val(groupObj.dataId);
    var options = {
        headers:{
            Authorization: api.checkCookieOrSession()
        },
        url: api.host +"user/import",
        dataType:"json",
        success:function (data) {
            if(data.code == 0){
                $(".tips_text").html("批量导入成功！");
                $("#no_groups").modal("show");
                delayDisapper(800);
                clickNode(event,zTree,groupObj);
                api.get("group/tree",{},groupAll);
                $("#fileToUpload").val("");
                slideHide();
            }else{
                $(".tips_text").html(data.message);
                $("#no_groups").modal("show");
                delayDisapper(800);
                clickNode(event,zTree,groupObj);
                $("#fileToUpload").val("");
                slideHide();
            }
        }
    }
    $("#myForm").ajaxSubmit(options);
}

//提示信息延迟几秒消失
function delayDisapper(delayTime) {
    setTimeout(function () {
        $("#no_groups").modal('hide');
    },delayTime);
}

//批量删除成员
$(".delete_more_users").on("click",function  () {
    var checked = $(".check:checked");
    if (checked.length == 0) {
        $(".tips_text").html("您未选择任何成员");
        $("#no_groups").modal('show');
        delayDisapper(800);
        return;
    };
    $(".delete_users_checked").modal("show");
});
//批量删除成员确定
$(".delete_these_users").on("click",function  () {
    var checked = $(".check:checked");
    for (var i = 0;i < checked.length;i++) {
        var param = {
            "uid":checked.eq(i).parent().parent().attr("member-id"),
            "group_id":groupObj.dataId
        };
        api.userPost("user/removeFromGroup",param,function  (data) {
            if (data.code == 0){
                $(".tips_text").html(data.message);
                $("#no_groups").modal("show");
                delayDisapper(800);
                checked.parent().parent().remove();
                ($(".check:checked").length == $(".check").length) && $(".check").length != 0 ? $(".checkAll").prop("checked", true) : $(".checkAll").prop("checked", false);
            }else{
                $(".tips_text").html(data.message);
                $("#no_groups").modal("show");
                delayDisapper(800);
            }
        })
    }
    $(".delete_users_checked").modal("hide");
});
//批量删除部门
$(".delete_more_depart").on("click",function  () {
    var checked = $(".depart_lists_add input[type=checkbox]:checked");
    if (checked.length == 0) {
        $(".tips_text").html("您未选择任何部门");
        $("#no_groups").modal('show');
        delayDisapper(800);
        return;
    };
    $(".delete_groups_checked").modal("show");
})
//确定批量删除部门
$(".delete_these_group").on("click",function  () {
    var checked = $(".depart_lists_add input[type=checkbox]:checked");
    $(".delete_groups_checked").modal("hide");
    for (var i = 0;i < checked.length;i++) {
        var param = {
            "id":checked.eq(i).parent().parent().attr("data-group-id"),
        };
        api.deleteIt("group/delete",param,function  (data) {
            if(data.code == 0){
                $(".tips_text").html(data.message);
                $("#no_groups").modal("show");
                delayDisapper(800);
                var node = tree.getNodeByParam("dataId", checked.eq(i).parent().parent().attr("data-group-id"), null);
                tree.removeNode(node);
                checked.parent().parent().remove();
            }else{
                $(".tips_text").html(data.message);
                $("#no_groups").modal("show");
                delayDisapper(800);
            }
        });

    };

});

//修改用户 点击表格tr弹出用户编辑框
var editUsrId = null;
$(".new_person_list_table").on("click",".clickTr",function () {
    $('.sidebar').hide();
    slideShow($(".edit_usr_silde"));
    editUsrId = $(this).parent().attr("member-id");
    $(".e_group").html("");
    $(".e_name").val("");
    $(".e_phone").val("");
    $(".e_job").val("");
    $(".e_serial_no").val("");
    api.get("group/lists",{},function (data) {
        var arrG = data.data;
        for (var i = 1;i < arrG.length;i++){
            var option = $('<option value="'+ arrG[i].id +'">'+ arrG[i].name +'</option>');
            $(".e_group").append(option);
        }
        if(groupObj.dataId == -1){
            var op = $('<option value="0"></option>');
            $(".e_group").prepend(op);
        }
        api.get("companyUser/info",{"id":editUsrId},function (data) {
            var em = data.data;
            console.log(em)
            $(".e_name").val(em.nickname);
            var val = sexVal(em);
            console.log(val);
            $('.e_sex option[value="'+ val +'"]').prop("selected",true);
            $(".e_phone").val(em.mobile);
            $(".e_job").val(em.jobTitle);
            $('.e_group option[value="'+ em.groupId +'"]').prop("selected",true);
            $(".e_serial_no").val(em.serialNo);
            $('.e_role option[value="'+ em.roleId +'"]').prop("selected",true);
        });
    });

});

function sexVal(em) {

   return em.gender === "M" ? "1" : "2";
}

$(".e_user_create").on("click",function () {
    var param = {
        "id":editUsrId,
        "nickname":$(".e_name").val(),
        "gender":$(".e_sex option:selected").val() == 1 ? "M" : "F",
        "mobile":$(".e_phone").val(),
        "role_id":$(".e_role option:selected").val(),
        "job_title":$(".e_job").val(),
        "group_id":$(".e_group option:selected").val(),
        "serial_no":$(".e_serial_no").val()
    };
    api.userPost("companyUser/updateEmployee",param,function (data) {
        if(data.code == 0){
            $(".tips_text").html("修改成功");
            $("#no_groups").modal("show");
            delayDisapper(800);
            $(".e_name").val("");
            $(".e_phone").val("");
            $(".e_job").val("");
            $(".e_serial_no").val("");
            clickNode(event,zTree,groupObj);
            slideHide();
        }else{
            $(".tips_text").html(data.message);
            $("#no_groups").modal("show");
            delayDisapper(800);
            slideHide();
        }
    });
})
//取消用户修改
$(".e_user_delete_cancel").on("click",function () {
    slideHide();
})
var tipsSlideSpeed = 200;
//通知面板
$(".user_news_icon").on("click",function  () {
    $(".person_sets").slideUp(tipsSlideSpeed);
    $(".companys").slideUp(tipsSlideSpeed);
    $(".person_tips").slideToggle(tipsSlideSpeed);
});
//用户设置面板
$(".user_set_icon").on("click",function  () {
    $(".person_tips").slideUp(tipsSlideSpeed);
    $(".companys").slideUp(tipsSlideSpeed);
    $(".person_sets").slideToggle(tipsSlideSpeed);
});
$(".down_arrow").on("click",function () {
    $(".person_sets").slideUp(tipsSlideSpeed);
    $(".person_tips").slideUp(tipsSlideSpeed);
    $(".companys").slideToggle(tipsSlideSpeed);
})
$(".companys").on("click","li",function () {
    $(".companys").slideUp(tipsSlideSpeed);
})
//点击wrapper隐藏面板
$(".wrap").on("click",function  () {
    $(".tips").slideUp(tipsSlideSpeed);
    $(".companys").slideUp(tipsSlideSpeed);
});
//解决点击到右侧未显示div无法隐藏面板的bug
$(".slide-wrapper").on("click",function  (event) {
    event.stopPropagation();
    $(".tips").slideUp(tipsSlideSpeed);
});



//修改密码
$(".sureChange").on("click",function  () {
    var param = {
        "old_password":$(".oldpassword").val(),
        "new_password":$(".newpassword").val()
    }
    api.userPost("user/password",param,function  (data) {
        $(".tips_text").html(data.message);
        $("#no_groups").modal("show");
        delayDisapper(800);
        $(".tips").slideUp(200);
    })
})


//清空输入框操作
var $clear_val = $('.clear_val');
var $search = $('.search');
var slide_speed = 100;
$search.on('input',function  () {
    if ($(this).val() != "") {
        $clear_val.slideDown(slide_speed);
    }else{
        $clear_val.slideUp(slide_speed);
    }
});
$clear_val.on('click',function  () {
    $search.val("");
    $clear_val.slideUp(slide_speed);
    api.get("group/tree",{},groupAll);
});


//右侧slide滑入滑出效果
var slideDiv = $('.sidebar');
var slideMask = $('.slide-mask');
function slideShow (obj) {
    slideMask.show();
    obj.show();
    slideDiv.animate({
        "right":"0",
    },250)
}
function slideHide () {
    slideMask.hide();
    slideDiv.animate({
        "right":"-500",
    },250);
    setTimeout(function  () {
        slideDiv.hide();
    },250);
}
slideMask.on("click",function  () {
    slideHide();
});

//简单封装全选反选功能
function checkOrCancel (checkA,check) {
    var $checkAll = $(checkA);
    var $check = $(check);
    $checkAll.on('click',function  () {
        $check.prop("checked",$(this).prop("checked"));
    });
    $check.on("click",function  () {
        $(check + ":checked").length == $check.length ? $checkAll.prop("checked", true) : $checkAll.prop("checked", false);
    });
}
