$(function () {
    // Initialize Example 1
    $('#group_table').footable();
});

//所有组选项
var departTbody = $('.depart_lists_add');
var treeData = [];//树形菜单数据数组
var groupsId = "0";//全局变量，存储树状列表的点击所在部门的id
//var companyId = '0';//全局变量，存储所在公司的id
var groupObj = {};//全局对象，存储树状列表的点击所在部门所有信息
api.get("location/tree",{},groupAll);
var bolsGlobal = 3;//控制右侧输入框数量显示
$(".btn-infor").css({'display':'none'});//隐藏添加会议室按钮

var tree = null;//存储zTree对象
var thisTree = null;//存储所选中的tree对象
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
    	beforeExpand:beforeExpand,
        onClick:clickNode,
        beforeDrag: false,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRename:rename,
        onRemove:remove
    }
};




function beforeEditName(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("zTree");
    zTree.editName(treeNode);
}
function beforeRemove(treeId, treeNode) {
	swal({
       title: "确定删除?",
       text: "若该地点下存在子地点,则该地点无法删除",
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
     		 var param = {
                 "floor_id":treeNode.dataId
             };
             api.deleteIt("location/delete",param,function (data) {
                 if (data.code != 0){
                    var title = "删除地点失败";
                    var text = data.message;
                    toastrFail(text);
                 }else{
        	        var text = "删除地点成功";
                    toastrSucceed(text);
                    var zTree = $.fn.zTree.getZTreeObj("zTree");
                    zTree.removeNode(treeNode);
                    return;
                 }
             });
     	}
     });
    return false;
}
function beforeRename(treeId, treeNode, newName, isCancel) {
    if (newName.length == 0) {
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        zTree.cancelEditName();
    }
}
function showRemoveBtn(treeId, treeNode) {
    if(treeNode.dataId == 0){
        return false;
    }
    return true;
}
function showRenameBtn(treeId, treeNode) {
    if(treeNode.dataId == 0){
        return false;
    }
    return true;
}

var newCount = 1;
var changeID = 0;//存储添加地点的dataId
function addHoverDom(treeId, treeNode) {
    if (treeNode.level == 3){
    	//编辑按钮向左移动19px
    	$("#" + treeNode.tId + "_edit").css('margin-right','19px');
        return false;
    }
    if ((treeNode.level == 0)&&(changeG == 1)) {
    	$("#" + treeNode.tId + "_edit").css('margin-right','19px');
    	return false;
    }
    
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='添加子地点' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        changeID=treeNode.dataId;
        var newNode = zTree.addNodes(treeNode, {name:"新地点" + (newCount++),dataId:'aaa'});
        zTree.editName(newNode[0]);
//      return false;
    });
};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};
//alert文本内容弹出框
function alertMessage(title,text) {
    swal({
        title: title,
        text: text
    });
}
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
    var tree = $.fn.zTree.getZTreeObj("zTree");
    var firstTree = tree.getNodeByParam("dataId",0,null);
    clickNode(event,zTree,firstTree);
    tree.selectNode(firstTree);
}

//捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
function beforeExpand(treeId,treeNode) {
	var tree = $.fn.zTree.getZTreeObj("zTree");
	tree.expandNode(treeNode, true, true, true);
	return false;
}


//点击树节点
$('#group_table').footable();
var personTbody = $("#group_table tbody");
function clickNode(event, treeId, treeNode) {
	$(".ztree .switch").css("color","#333333");
    $("#" + treeNode.tId + "_switch").css("color","#ffffff");
    //创建树状列表
    $(".btn-infor").css({'display':'none'});//先将添加会议室按钮隐藏
            if (treeNode.level == 1) {
                bolsGlobal = 1;
                $(".btn-infor").css({'display':'none'});
            }else if(treeNode.level == 2){
                bolsGlobal = 2;
                $(".btn-infor").css({'display':'none'});
            }else if(treeNode.level == 0){
                bolsGlobal = 0;
                $(".btn-infor").css({'display':'none'});
            }else{
                bolsGlobal = 3;
                $(".btn-infor").css({'display':''});
            }
             groupObj = treeNode;
             if (changeG==1) {//搜索框改变层级 改变为楼层级
             	bolsGlobal = 3;
                $(".btn-infor").css({'display':''});
             }else{
             	bolsGlobal = bolsGlobal;
             }
             
            var param = {
                "parent_id":treeNode.dataId,
                "activated":"0"
            };
        //选择部门请求部门成员列表
        api.get("meeting_room/all",param,function  (data) {
            var membersArr = data.data;
            //清除表格内容
            $("#group_table tbody tr").remove();
            if (membersArr.length == 0) {
                var $trs = $('<tr><td colspan="6" style="text-align: center;">无会议室</td></tr>')
                personTbody.append($trs);
            }else{
                for (var i = 0;i < membersArr.length;i++) {
                    if (membersArr[i].comment=='') {
                        var beizhu='无';
                    }else{
                        beizhu='<xmp>'+membersArr[i].comment+'</xmp>';
                    }
                    if (membersArr[i].location_id==param.parent_id) {
                        var $trs = $('<tr member-id="'+ membersArr[i].id +'"><td><input type="checkbox" class="check"/></td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+ membersArr[i].name +'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+membersArr[i].seats+'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+membersArr[i].location.campusName+'</td><td class="clickTr" data-target="#myModalEdit" data-toggle="modal">'+beizhu+'</td></tr>')
                        personTbody.append($trs);
                    }
                }
            }
            //将生成的成员列表添加正反选
            checkOrCancel(".checkAll",".check");
            $("#group_table").trigger("footable_initialize");
        });
}

var changeG=0;//搜索框改变层级 标识
//搜索分组
$(".searchIt").on("input",function () {
    if($(".searchIt").val() == ""){
        api.get("location/tree",{},groupAll);
        //楼层级  搜索框改变层级
        changeG=0;
        $(".btn-infor").css({'display':'none'});
    }else{
        var param = {
            "q":$(".searchIt").val()
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
        //楼层级  搜索框改变层级
        changeG=1;
    }
    
});


//修改地点
function rename(e, treeId, treeNode, isCancel) {
	if (treeNode.dataId=='aaa') {//添加地点
		var param = {
           "campus":treeNode.name,
           "building":'',
           "floor":'',
           "parent_id":changeID
         };
         api.userPost("location/create",param,function (data) {
         	   var text = "添加地点成功";
               toastrSucceed(text);
        	   //本地重新获取tree列表
               api.get("location/tree",{},groupAll);
         });
	} else{//修改地点
		var param = {
          "name":treeNode.name,
          "id":treeNode.dataId
        };
        api.userPost("location/updateLocationName",param,function (data) {
           if (data.code !== 0){
               var title = "修改名称失败";
               var text = data.message;
               alertMessage(title,text);
           }else{
        	   var text = "修改名称成功";
               toastrSucceed(text);
               return;
           }
        });
	}
}
//删除地点
function remove(e, treeId, treeNode, isCancel) {
}

//添加会议室
//添加会议室保存
$(".add_person_btn").on("click",function  () {
    if (($('.name').val()=='') || ($('.sex').val()=='')) {
        var text = '请将必填项信息填写完整';
        toastrFail(text);
    }else if($('.sex').val()<=0){
        var text = '请写入正确的会议室可容纳人数';
        toastrFail(text);
    }else{
        var param = {
            "name":$('.name').val(),
            "seats":$(".sex").val(),
            "comment":$(".serial_no").val(),
            "location_id":groupObj.dataId
        }
        api.userPost("meeting_room/create",param,function  (data) {
            if (data.code == 0) {
               var text = "添加会议室成功";
               toastrSucceed(text);
               $("#addPerson input").val("");
               clickNode(event,zTree,groupObj);
               $("#group_table").trigger("footable_initialize");
            }else{
               var text = data.message;
               toastrFail(text);
            }
        });
    }
});
function toastrSucceed(text) {
    // Toastr options
    toastr.options = {
        "debug": false,
        "newestOnTop": false,
        "positionClass": "toast-top-center",
        "closeButton": true,
        "toastClass": "animated fadeInDown",
    };
    toastr.info(text);
}
function toastrFail(text) {
    // Toastr options
    toastr.options = {
        "debug": false,
        "newestOnTop": false,
        "positionClass": "toast-top-center",
        "closeButton": true,
        "toastClass": "animated fadeInDown",
    };
    toastr.error(text);
}
//取消会议室保存
$(".cancel_person_btn").on("click",function  () {
    $("#addPerson input").val("");
});

//修改用户 点击表格tr弹出用户编辑框
var editUsrId = null;
personTbody.on("click",".clickTr",function () {
    editUsrId = $(this).parent().attr("member-id");
    $("#editMembers input").val("");
    $('.e_name').val($(this).parent().children().first().next().text());
    $(".e_sex").val($(this).parent().children().first().next().next().text());
    $(".e_phone").val($(this).parent().children().last().text());
});
//点击确定 修改会议室
$(".edit_person_btn").on('click',function(){
	    if ($(".e_sex").val()<=0) {
            var text = '请写入正确的会议室可容纳人数';
            toastrFail(text);
            $('.e_sex').val('');
    	} else{
           var param={
            "name":$('.e_name').val(),
            "seats":$(".e_sex").val(),
            "comment":$(".e_phone").val(),
            "id":editUsrId
           }
           api.userPost("meeting_room/updateMeetingRoom",param,function  (data) {
             var text = "修改会议室成功";
             toastrSucceed(text);
             $("#editMembers input").val("");
             clickNode(event,zTree,groupObj);
           });
        }
})

//批量导入
$(".export_file").on("click",function () {
    $("#hiddenIn").val(groupObj.dataId);
    var options = {
        headers:{
            Authorization: api.checkCookieOrSession()
        },
        url:api.host +"location/import",
        dataType:"json",
        success:function (data) {
            if(data.code == '0'){
                var text = "导入成功";
                toastrSucceed(text);
                clickNode(event,zTree,groupObj);
                $("#fileToUpload").val("");
                api.get("location/tree",{},groupAll);
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

//批量删除会议室
$("#deleteMembers").on("click",function  () {
    var checked = $(".check:checked");
    if (checked.length == 0) {
        var text = '您未选择任何会议室';
        toastrFail(text);
        checked.parent().parent().remove();
        return;
    };
    //显示确认删除弹窗
    deleteMeeting();
});
//确认删除会议室弹窗
function deleteMeeting() {
    swal({
            title: "确定删除会议室?",
            text: "",
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
                //删除会议室
                delMeetings();
                $("#group_table").trigger("footable_initialize");
            }
        });
}
//批量删除会议室方法
function delMeetings(){
	var bolNum=0;//记录状态
    var checked = $(".check:checked");
    for (var i = 0;i < checked.length;i++) {
        var param = {
            "id":checked.eq(i).parent().parent().attr("member-id")
        };
        api.userPost("meeting_room/delete",param,function (data) {
        	if (data.code == 0){
                bolNum = bolNum + 0;
            }else{
                bolNum = bolNum + 1;
            }
        });
    }
    if (bolNum == 0){
       var text = "批量删除成功";
       toastrSucceed(text);
       checked.parent().parent().remove();
       //取消全选状态
       $('.checkAll:checkbox').attr('checked',false);
    }else{
       var text = data.message;
       toastrFail(text);
    }
}












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

//console.log(window.screen.availWidth);
//window.screen.availWidth
//1183/1181
//滚轮滚动
if ($(window ).width() >= 1183){
	$('.moveShow').attr('id','moveShow');
}else{
	$('.moveShow').attr('id','');
}
$(window).resize(function() {
	if ($(window ).width() >= 1183){
		$('.moveShow').attr('id','moveShow');
	}else{
		$('.moveShow').attr('id','');
	}
	$(window).bind("scroll", function(){
    if ($(this).scrollTop() >= 128) {
		$('#moveShow').css('top',$(this).scrollTop() + 10 + 'px');
	} else{
		$('#moveShow').css('top','128px');
	}
    });
});
$(window).bind("scroll", function(){
    if ($(this).scrollTop() >= 128) {
		$('#moveShow').css('top',$(this).scrollTop() + 10 + 'px');
	} else{
		$('#moveShow').css('top','128px');
	}
});

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

//设置会议室开放时间
var timeChooseId = 'optionsRadios1';//初始状态为全天可用
$('.radio input').on('click',function(){
	timeChooseId = $(this).attr('id');
	if (timeChooseId == 'optionsRadios1') {//全天可用
		console.log('全天使用');
	} else if (timeChooseId == 'optionsRadios2') {//禁止使用
		console.log('禁止使用');
	} else{
		console.log('定义时间');
	}
})
$('#datapicker01').datepicker({ //初始时间 
    format: 'yyyy-mm-dd hh-ii-ss',  
    weekStart: 1,  
    autoclose: true,  
    
//  endDate:'24:00:00',
    startView: 1,
    maxViewMode: 1,
    minViewMode:1,
    forceParse: false,  
    language: 'zh-CN'  
}).on('changeDate',function(){  
    var startTime = $('#datapicker01').val();  
    $('#datapicker02').datepicker('setStartDate',startTime);  
});










