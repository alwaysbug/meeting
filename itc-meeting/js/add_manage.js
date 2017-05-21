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
var treeData = [];//树形菜单数据数组
var groupsId = "0";//全局变量，存储树状列表的点击所在部门的id
//var companyId = '0';//全局变量，存储所在公司的id
var groupObj = {};//全局对象，存储树状列表的点击所在部门所有信息
api.get("location/tree",{},groupAll);
var bolsGlobal = 0;//控制右侧输入框数量显示

var tree = null;//存储zTree对象
var thisTree = null;//存储所选中的tree对象
var setting = {
    view: {
        showIcon: false,
        showTitle:false,
        showLine:false
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
    $("#company_title").html(dataObj.companyName);
    var str = JSON.stringify(data);
    var node1 = str.split("\"locations\":")[1].split("\},\"message\"")[0];
    var node3 = node1.replace(/companyName/g,"name").replace(/locations/g,"children");
    var node2 = node3.replace(/\"id\"/g,'\"dataId\"');
    var itNodes = JSON.parse(node2);
    zTreeObj.children = itNodes;
    zTreeNodes.push(zTreeObj);

    $.fn.zTree.init($("#zTree"), setting, zTreeNodes);

    tree = $.fn.zTree.getZTreeObj("zTree");
    clickNode(event,zTree,tree.getNodeByParam("dataId",0,null));
    tree.selectNode(tree.getNodeByParam("dataId",0,null));
}


//点击树节点
function clickNode(event, treeId, treeNode) {
    //创建树状列表
    $(".add_usr_child").hide();//先将添加会议室按钮隐藏
            if (treeNode.level == 1) {
                bolsGlobal = 1;
                slideShow ($('.add_depart_child'));
                $(".add_usr_child").hide();
            }else if(treeNode.level == 2){
                bolsGlobal = 2;
                slideShow ($('.add_depart_child'));
                $(".add_usr_child").hide();
            }else if(treeNode.level == 0){
                bolsGlobal = 0;
                slideShow ($('.add_depart_child'));
                $(".add_usr_child").hide();
            }else{
                bolsGlobal = 3;
                $(".add_depart_child").hide();
                slideShow ($('.add_usr_child'));
            }
            
             groupObj = treeNode;
             
             if (changeG==1) {//搜索框改变层级 改变为楼层级
             	bolsGlobal = 3;
                $(".add_depart_child").hide();
                slideShow ($('.add_usr_child'));
             }else{
             	bolsGlobal = bolsGlobal;
             }
             
            var param = {
        "parent_id":treeNode.dataId,
        "activated":"0"
    };
    var department = $('.department');
    var persons = $('.persons');
    var person_lists = $(".person_list");
    //选择部门请求子部门列表
    api.get("location/children",param,function  (data) {
        slideHide();
        var arr = data.data;
        $(".depart_lists_add").children().remove();
        if ($('.search').val()=='') {
        if ((arr.length == 0) || (bolsGlobal== 3)) {
            var $trs = $('<tr><td colspan="2" style="text-align: center;">无子地点</td></tr>')
            departTbody.append($trs);
        }else{
            for (var i = 0;i < arr.length;i++) {
                var $trs = $('<tr data-group-id="'+ arr[i].id +'"><td><input type="checkbox"/></td><td>'+ arr[i].name +'</td></tr>')
                departTbody.append($trs);
            }
        }
        } else{
        	bolsGlobal = 3;
        	var $trs = $('<tr><td colspan="2" style="text-align: center;">无子地点</td></tr>')
            departTbody.append($trs);
        }
        //选择部门请求部门成员列表
        api.get("meeting_room/all",param,function  (data) {
            var membersArr = data.data;
            //清除表格内容
            person_lists.children().remove();
            if (membersArr.length == 0) {
                var $trs = $('<tr><td colspan="6" style="text-align: center;">无会议室</td></tr>')
                person_lists.append($trs);
            }else{
                for (var i = 0;i < membersArr.length;i++) {
                    if (membersArr[i].comment=='') {
                        var beizhu='无';
                    }else{
                    	beizhu=membersArr[i].comment.replace(/\>/g,"*").replace(/\</g,"*").replace(/alert/g,"ale*rt").replace(/console/g,"cons*ole");
                       console.log(beizhu);
                    }
                    if (membersArr[i].location_id==param.parent_id) {
                        var $trs = $('<tr member-id="'+ membersArr[i].id +'"><td><input type="checkbox" class="check"/></td><td>'+ membersArr[i].name +'</td><td>'+membersArr[i].seats+'</td><td>'+membersArr[i].location.campusName+'</td><td>'+beizhu+'</td></tr>')
                        person_lists.append($trs);
                        $(".btn_lists").nextAll().remove();
                    }
                }
            }
            //将生成的成员列表添加正反选
            checkOrCancel(".checkAll",".check");
        });
    });
}

var changeG=0;//搜索框改变层级 标识
//搜索分组
$(".search").on("input",function () {
    if($(".search").val() == ""){
        api.get("location/tree",{},groupAll);
    }else{
        var param = {
            "q":$(".search").val()
        }
        api.get("meeting_room/all",param,function (data) {
            //清除以前的树状图,防止二次调用重复
            $("#zTree").children().remove();
            var arr = data.data;
            var arrs = '';
            for (var i=0;i<arr.length;i++) {
            	if (i==0) {
            		arrs = JSON.stringify(arr[0].location);
            	} else{
            		if (arr[i].location.floorId == arr[i-1].location.floorId) {
            		if (arrs=='') {
            		arrs = arrs + JSON.stringify(arr[i].location);
            	    } else{
            		arrs = arrs;
            	    }
            	    } else{
            		if (arrs=='') {
            		arrs = arrs + JSON.stringify(arr[i].location);
            	    } else{
            		arrs = arrs +","+ JSON.stringify(arr[i].location);
            	    }
            	    }
            	}
            }
            arrStr = "[" + arrs + "]";
            var arrA = JSON.stringify(JSON.parse(arrStr.replace(/\"floorId\"/g,'\"dataId\"')));
            var arrB = JSON.parse(arrA.replace(/\"floorName\"/g,'\"name\"'));
            $.fn.zTree.init($("#zTree"), setting, arrB);
        });
    }
    //楼层级  搜索框改变层级
    changeG=1;
});


//		    新增方法
function showYuanqu () {
    $(".sidebar").hide();
    slideShow ($('.add_departs_silde'));
}
function  showDalou() {
    $(".sidebar").hide();
    slideShow ($('.add_dalou_silde'));
}
function  showLouceng() {
    $(".sidebar").hide();
    slideShow ($('.add_louceng_silde'));
}
//			修改方法
function changeYuanqu () {
    $(".sidebar").hide();
    slideShow ($('.change_departs_silde'));
}
function  changeDalou() {
    $(".sidebar").hide();
    slideShow ($('.change_dalou_silde'));
}
function  changeLouceng() {
    $(".sidebar").hide();
    slideShow ($('.change_louceng_silde'));
}


//var findCheckableNodess = function() {
//  return $('#tree').treeview('search', [ $(".search").val(), { ignoreCase: true, exactMatch: false,revealResults: true} ]);
//};
//var checkableNodes = findCheckableNodess();
//
//$('.search').on('keyup', function (e) {
//  checkableNodes = findCheckableNodess();
//});


//添加会议室
$('.add_usr_child').on('click',function  () {
    $('.sidebar').hide();
    slideShow ($('.add_usr_silde'));
});
//添加会议室保存
$(".user_create").on("click",function  () {
    if (($('.name').val()=='') || ($('.sex').val()=='')) {
        $(".tips_text").html('请将必填项信息填写完整');
        $("#no_groups").modal("show");
        delayDisapper(1200);
    }else if($('.sex').val()<=0){
    	$(".tips_text").html('请写入正确的会议室可容纳人数');
        $("#no_groups").modal("show");
        delayDisapper(1200);
        $('.sex').val('');
    }else{
        var param = {
            "name":$('.name').val(),
            "seats":$(".sex").val(),
            "comment":$(".job").val(),
            "location_id":groupObj.dataId
        }
        api.userPost("meeting_room/create",param,function  (data) {
            $('.sidebar').hide();
            $('input').val('');
//          console.log(data);
            //本地重新获取tree列表
            if (data.code==0) {
               $(".tips_text").html('添加会议室成功!');
               $("#no_groups").modal("show");
               delayDisapper(800);
               clickNode(event,zTree,groupObj);
            } else{
               $(".tips_text").html('添加会议室失败!'+'</br>'+'原因:'+data.message);
               $("#no_groups").modal("show");
               delayDisapper(1200);
            } 
            
        });
    }
});

//取消会议室保存
$(".user_delete").on("click",function  () {
    $('.name').val("");
    $(".serial_no").val("");
    $(".phone").val("");
    $(".job").val("");
    slideHide();
});

//添加子部门
$('.add_depart_child').on("click",function  () {
    if (bolsGlobal == 0) {
        showYuanqu();
    }else if(bolsGlobal == 1){
        showDalou();
    }else if(bolsGlobal == 2){
        showLouceng();
    }
});
//上传子部门并在本地刷新
$(".add_departs_save").on("click",function  () {
    var param;
    var bool=false;//判断是否要添加数据
    if (bolsGlobal == 1) {
        if ($('.depart_name1').val()=='') {
        	$(".tips_text").html('请将必填项信息填写完整');
            $("#no_groups").modal("show");
            delayDisapper(1000);
            bool=false;
        }else{
        	param = {
            "campus":$('.depart_name1').val(),
            "building":$(".description1").val(),
            "floor":'',
            "parent_id":groupObj.dataId
            };
            bool=true;
        }
    }else if (bolsGlobal == 2) {
        if ($('.depart_name2').val()=='') {
        	$(".tips_text").html('请将必填项信息填写完整');
            $("#no_groups").modal("show");
            delayDisapper(1000);
            bool=false;
        }else{
        	param = {
            "campus":$('.depart_name2').val(),
            "building":'',
            "floor":'',
            "parent_id":groupObj.dataId
            };
            bool=true;
        }
    }else if (bolsGlobal == 0){
        if ($('.depart_name0').val()=='') {
        	$(".tips_text").html('请将必填项信息填写完整');
            $("#no_groups").modal("show");
            delayDisapper(1000);
            bool=false;
        }else if(($(".description0").val()=='')&&($(".power0").val()!='')){
        	$(".tips_text").html('未填写楼号,无法获取所填楼层');
            $("#no_groups").modal("show");
            delayDisapper(1200);
            bool=false;
        } else{
        	param = {
            "campus":$('.depart_name0').val(),
            "building":$(".description0").val(),
            "floor":$(".power0").val(),
            "parent_id":groupObj.dataId
            };
            bool=true;
        }
    }
    if (bool) {
    api.userPost("location/create",param,function (data) {
        slideHide();
        //本地重新获取tree列表
        api.get("location/tree",{},groupAll);
        $('.depart_name').val("");
        $(".description").val("");
        $(".power").val("");
//      selectItems('','0');
        $(".tips_text").html('添加子地点成功!');
        $("#no_groups").modal("show");
        delayDisapper(800);
        clickNode(event,zTree,groupObj);
    });
    }
});

//取消添加子部门 change_departs_delete
$(".add_departs_delete").on("click",function  () {
    slideHide();
    $('.depart_name').val("");
    $(".description").val("");
    $(".power").val("");
})

//修改部门
$('.edit_depart_name').on("click",function  () {
    var checked = $(".depart_lists_add input[type=checkbox]:checked");
    //判断选中哪个会议室
    if (checked.length == 0) {
        $(".tips_text").html("您未选择任何地点");
        $("#no_groups").modal('show');
        delayDisapper(1000);
        return;
    }else if (checked.length > 1) {
        $(".tips_text").html("请选择单个地点进行修改");
        $("#no_groups").modal('show');
        delayDisapper(1000);
        return;
    }else{
        if (bolsGlobal == 0) {
            changeYuanqu();
            $(".depart_change_name3").val(checked.eq(0).parent().next().text());
        }else if(bolsGlobal == 1){
            changeDalou();                            
            $(".depart_change_name4").val(checked.eq(0).parent().next().text());
        }else if(bolsGlobal == 2){
            changeLouceng();
            $(".depart_change_name5").val(checked.eq(0).parent().next().text());
        }
    }
});
//修改部门名称保存
$(".change_departs_save").on("click",function  () {
    var param;
    var checked = $(".depart_lists_add input[type=checkbox]:checked");
    for (var i = 0;i < checked.length;i++) {
        if (bolsGlobal == 1) {//大楼
            param = {
                "name":$(".depart_change_name4").val(),
                "id":checked.eq(i).parent().parent().attr("data-group-id")
            };
        } else if (bolsGlobal == 2) {//楼层
            param = {
                "name":$(".depart_change_name5").val(),
                "id":checked.eq(i).parent().parent().attr("data-group-id")
            };
        }else if (bolsGlobal == 0){//园区
            param = {
                "name":$(".depart_change_name3").val(),
                "id":checked.eq(i).parent().parent().attr("data-group-id")
            };
        }
    }
    api.userPost("location/updateLocationName",param,function  (data) {
        slideHide();
        $(".depart_change_name").val("");
        $(".description_change").val("");
        $(".powers").val("");
        //本地重新获取tree列表
        api.get("location/tree",{},groupAll);
//      selectItems('','0');
        $(".tips_text").html('修改名称成功!');
        $("#no_groups").modal("show");
        delayDisapper(800);
        clickNode(event,zTree,groupObj);
    })
});
//取消修改部门
$(".change_departs_delete").on("click",function  () {
    slideHide();
    $(".depart_change_name").val("");
    $(".description_change").val("");
    $(".powers").val("");
});


//修改会议室
$('.edit_depart_add').on("click",function  () {
    var checked = $(".check:checked");
    //判断选中哪个会议室
    if (checked.length == 0) {
        $(".tips_text").html("您未选择任何会议室");
        $("#no_groups").modal('show');
        delayDisapper(1000);
        return;
    }else if (checked.length > 1) {
        $(".tips_text").html("请选择单个会议室进行修改");
        $("#no_groups").modal('show');
        delayDisapper(1000);
        return;
    }else{
        $(".sidebar").hide();
        slideShow ($('.change_meeting_silde'));
        $('.name0').val(checked.eq(0).parent().next().text());
        $(".sex0").val(checked.eq(0).parent().next().next().text());
        $(".job0").val(checked.eq(0).parent().next().next().next().next().text());
    }

});
//修改会议室名称保存
$(".change_departs_save0").on("click",function  () {
    	if ($(".sex0").val()<=0) {
    		$(".tips_text").html('请写入正确的会议室可容纳人数');
            $("#no_groups").modal("show");
            delayDisapper(1200);
            $('.sex0').val('');
    	} else{
    	var checked = $(".check:checked");
    	for (var i = 0;i < checked.length;i++) {
           var param={
            "name":$('.name0').val(),
            "seats":$(".sex0").val(),
            "comment":$(".job0").val(),
            "id":checked.eq(i).parent().parent().attr("member-id")
           }
           api.userPost("meeting_room/updateMeetingRoom",param,function  (data) {
            slideHide();
            $(".name0").val("");
            $(".sex0").val("");
            $(".job0").val("");
            //本地重新获取tree列表
//          api.get("location/tree",{},groupAll);
//          selectItems('','0');
            $(".tips_text").html('修改会议室成功!');
            $("#no_groups").modal("show");
            delayDisapper(800);
            clickNode(event,zTree,groupObj);
            $('.checkAll:checkbox').attr('checked',false);
           });
       }
    }
});
//取消修改会议室
$(".change_departs_delete").on("click",function  () {
    slideHide();
    $(".name0").val("");
    $(".sex0").val("");
    $(".job0").val("");
});




//批量导入
$(".uoload_user_btn").on("click",function  () {
    $('.sidebar').hide();
    slideShow ($('.upload_users'));
});
//批量导入实现
function upLoad() {
    $("#hiddenIn").val(groupObj.dataId);
    var options = {
        headers:{
            Authorization: api.checkCookieOrSession()
        },
        url:api.host +"location/import",
        dataType:"json",
        success:function (data) {
            if(data.code == '0'){
                //重新绘制树状图
                api.get("location/tree",{},groupAll);
                //隐藏弹出框
                $('.sidebar').hide();
                //绘制表格
                api.get("location/children?parent_id=0",{},function  (data) {
                    slideHide();
                    var arr = data.data;
                    $(".depart_lists_add").children().remove();
                    if ((arr.length == 0) || (bolsGlobal== 3)) {
                        var $trs = $('<tr><td colspan="2" style="text-align: center;">无子地点</td></tr>')
                        departTbody.append($trs);
                    }else{
                        for (var i = 0;i < arr.length;i++) {
                            var $trs = $('<tr data-group-id="'+ arr[i].id +'"><td><input type="checkbox"/></td><td>'+ arr[i].name +'</td></tr>')
                            departTbody.append($trs);
                        }
                    }
                    //将生成的成员列表添加正反选
                    checkOrCancel(".checkAll",".check");
                });
                //清空输入框
                $('#fileToUpload').val('');
                //弹出导入成功提示框
                $(".tips_text").html("批量导入成功！");
                $("#no_groups").modal("show");
                delayDisapper(800);
                clickNode(event,zTree,groupObj);

            }else{
                //清空输入框
                $('#fileToUpload').val('');
                //弹出导入失败原因
                $(".tips_text").html(data.message);
                $("#no_groups").modal("show");
                delayDisapper(800);
                clickNode(event,zTree,groupObj);
            }
        }
    }
    $("#myForm").ajaxSubmit(options);
}



//批量删除成员
$(".delete_more_users").on("click",function  () {
    var checked = $(".check:checked");
    if (checked.length == 0) {
        $(".tips_text").html("您未选择任何会议室");
        $("#no_groups").modal('show');
        delayDisapper(1000);
        checked.parent().parent().remove();
        return;
    };
    $(".delete_users_checked").modal("show");
});
$(".delete_these_users").on("click",function  () {
    var checked = $(".check:checked");
    for (var i = 0;i < checked.length;i++) {
        var param = {
            "id":checked.eq(i).parent().parent().attr("member-id")
        };
        api.userPost("meeting_room/delete",param,function (data) {});
    }
    checked.parent().parent().remove();
    $(".delete_users_checked").modal("hide");
    $('.checkAll:checkbox').attr('checked',false);
});
//批量删除部门
$(".delete_more_depart").on("click",function  () {
    var checked = $(".depart_lists_add input[type=checkbox]:checked");
    if (checked.length == 0) {
        $(".tips_text").html("您未选择任何地点");
        $("#no_groups").modal('show');
        delayDisapper(1000);
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
            "floor_id":checked.eq(i).parent().parent().attr("data-group-id")
        };
        api.deleteIt("location/delete",param,function (data) {
            api.get("location/tree",{},groupAll);
        });
    };
    checked.parent().parent().remove();
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
    $('.companys').slideUp(tipsSlideSpeed);
});
//解决点击到右侧未显示div无法隐藏面板的bug
$(".sidebar").on("click",function  () {
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
        api.get("location/tree",{},groupAll);
        changeG=0;//搜索框改变层级 标识
    }
});
$clear_val.on('click',function  () {
    $search.val("");
    $clear_val.slideUp(slide_speed);
    api.get("location/tree",{},groupAll);
    changeG=0;//搜索框改变层级 标识
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

//提示信息延迟几秒消失
function delayDisapper(delayTime) {
    setTimeout(function () {
        $("#no_groups").modal('hide');
    },delayTime);
}

//简单封装全选反选功能
function checkOrCancel (checkA,check) {
    var $checkAll = $(checkA);
    var $check = $(check);
    $checkAll.on('click',function  () {
        $check.prop("checked",$(this).prop("checked"));
    });
    $check.on("click",function  () {
        $(check + ":checked").length == $check.length ? $checkAll.prop("checked", true) : $checkAll.prop("checked", false);
    });
}



//兼容IE
if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
    //ie浏览器
	//清空查找框内容
	$(".search").attr("placeholder","");
	//右侧滑出部分文字样式
	$(".slide_left_ul li").css({
		'float':'right',
        'textAlign':'right',
		'width':'100px'
	});
	//小白盒盖住默认的×
	$('.whiteBox').css({
		'width':'20px',
		'height':'30px',
		'backgroundColor':'white',
		'position':'absolute',
		'left':'248px',
		'top':'24px',
		'zIndex':'1'
	})
}

