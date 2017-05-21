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
$(".slide-wrapper").on("click",function  () {
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
        $(".tips").slideUp(200);
    })
})
var thisObjGlobal = null;//定义全局变量，指定所点击分类
var tree = null;
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
//左边下拉列表
api.get("equipmentCategory/lists",{},groupAll);
function groupAll (data) {
    //清除以前的树状图,防止二次调用重复
    $("#zTree").children().remove();
    var dataObj = data.data;
    var zTreeNodes = [];
    var zTreeObj = {
        name:"资产分类",
        open:true,
        dataId:"0"
    }

    var str = JSON.stringify(dataObj);
    var node1 = str.replace(/\"id\"/g,'\"dataId\"');
    var itNodes = JSON.parse(node1);
    zTreeObj.children = itNodes;
    zTreeNodes.push(zTreeObj);
    $.fn.zTree.init($("#zTree"), setting, zTreeNodes);
    tree = $.fn.zTree.getZTreeObj("zTree");
}

function clickNode(event, treeId, treeNode) {
    if (treeNode.level == 0){
        //点击资产分类添加设备按钮更换为添加分类
        $(".add_equip_btn").hide();
        $(".edit_equip_groups_btn").hide();
        $(".add_equip_groups_btn").show();
    }else{
        $(".add_equip_groups_btn").hide();
        $(".edit_equip_groups_btn").show();
        $(".add_equip_btn").show();
    }
}

//编辑分类
$(".edit_equip_groups_btn").on("click",function  () {
    $(".sidebar").hide();
    slideShow($(".edit_equips_groups"));
});
//保存编辑分类
$(".sava_edit_eq_group").on("click",function  () {
    var param = {
        "name":$(".edit_eq_group_name").val(),
        "id":tree.getSelectedNodes()[0].dataId
    };
    api.userPost("equipmentCategory/update",param,function  (data) {
        if (data.code == 0) {
            alert("修改成功！");
            api.get("equipmentCategory/lists",{},groupAll);
        }
    })
});
//取消修改分类
$(".delete_edit_eq_group").on("click",function () {
    slideHide();
})
//删除分类
$(".delete_edit_eq_group").on("click",function  () {
    if (confirm("确定删除分组？")) {
        var param = {
            "id":thisObjGlobal.id
        };
        api.deleteIt("equipmentCategory/delete",param,function  (data) {
            console.log(data);
        })
    };
})

//添加设备
$(".add_equip_btn").on("click",function  () {
    $(".sidebar").hide();
    slideShow($(".add_equipment"));
})
//取消添加设备
$(".add_eq_cancel").on("click",function () {
    slideHide();
});
//批量导入
$(".upload_equips_btn").on("click",function  () {
    $(".sidebar").hide();
    slideShow($(".upload_equipments"));
})

//添加设备分类
$(".add_equip_groups_btn").on("click",function  () {
    $(".sidebar").hide();
    slideShow($(".add_equips_groups"));
});
//取消添加设备分类
$(".delete_group_cancel").on("click",function () {
    slideHide();
});
//添加设备分类保存
$(".sava_eq_group").on("click",function  () {
    var param = {
        "name":$(".eq_group_name").val()
    };
    api.userPost("equipmentCategory/create",param,function  (data) {
        if (data.code == 0) {
            alert("创建成功！");
            $(".slide-wrapper").hide();
            api.get("equipmentCategory/lists",{},groupAll);
        }else{
            alert(data.message);
        }
    })
});

//批量删除设备
$(".delete_more").on("click",function () {
   if ($(".check:checked").length == 0){
       $(".notice_text").html("未选择设备");
       $("#notice").modal("show");
       delayDisapper(800);
   }else{
        $("#delete_device_checked").modal("show");
   }
});
//确认删除设备
$(".delete_this_device").on("click",function () {
    $("#delete_device_checked").modal("hide");
    //待补充内容
});

//提示信息延迟几秒消失
function delayDisapper(delayTime) {
    setTimeout(function () {
        $("#notice").modal('hide');
    },delayTime);
}

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
    $('#tree').treeview('clearSearch');
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
