//问题类型模块
api.get("admin/work/category",{},groupAll);

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
    var str = JSON.stringify(data.data);
	var node1 = str.replace(/\"parent_id\"/g,'\"pId\"');
    var itNodes = JSON.parse(node1);
    zTreeNodes = itNodes;

    $.fn.zTree.init($("#zTree"), setting, zTreeNodes);
    var tree = $.fn.zTree.getZTreeObj("zTree");
}


function beforeEditName() {
    return true;
}
function beforeRemove(treeId,treeNode) {
    swal({
            title: "确定删除?",
            text: "如该分类下有子分类,则该分类无法删除",
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
                var id = treeNode.id;
                api.userPost("admin/work/deleteCategory",{id:id},function (data) {
                	if (data.code == 0) {
                       zTree = $.fn.zTree.getZTreeObj("zTree");
                       zTree.removeNode(treeNode);
                       var text = "删除成功";
                       toastrSucceed(text);
                	}else {
                		var title = "名称删除失败";
                        var text = data.message;
                        toastrFail(text);
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

function reName(e, treeId, treeNode, isCancel) {
	if (treeNode.dataid=='aaa') {//添加地点
		var param = {
           "name":treeNode.name,
           "parent_id":changeID
         };
         api.userPost("admin/work/addCategory",param,function (data) {
         	   var text = "添加成功";
               toastrSucceed(text);
        	   //本地重新获取tree列表
               api.get("admin/work/category",{},groupAll);
         });
	}else {
    var param = {
        "name":treeNode.name,
        "id":treeNode.id
    }
    api.userPost("admin/work/updateCategory",param,function (data) {
        if (data.code !== 0){
            var title = "名称编辑失败";
            var text = data.message;
            alertMessage(title,text);
        }else{
        	var text = "编辑成功";
            toastrSucceed(text);
            return;
        }
    });
    }
}

function removeGroup(e,treeId,treeNode) {
}

function showRemoveBtn(treeId, treeNode) {
    return true;
}
function showRenameBtn(treeId, treeNode) {
    return true;
}

var newCount = 1;
var changeID;
function addHoverDom(treeId, treeNode) {
	if (treeNode.level == 2){
    	//编辑按钮向左移动19px
    	$("#" + treeNode.tId + "_edit").css('margin-right','19px');
        return false;
    }
    if (treeNode.id == -1){
        return false;
    }
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='添加子分类' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("zTree");
        changeID=treeNode.id;
        var newNode = zTree.addNodes(treeNode, {name:"新类型" + (newCount++),dataid:'aaa'});
        zTree.editName(newNode[0]);
//      return false;
    });
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

function alertMessage(title,text) {
    swal({
        title: title,
        text: text
    });
}



//点击树节点
var personTbody = $("#group_table tbody");
var clickId;//点击下的ID
function clickNode(event, treeId, treeNode) {
    $(".ztree .switch").css("color","#333333");
    $("#" + treeNode.tId + "_switch").css("color","#ffffff");
    api.get('admin/work/question',{'qc_id':treeNode.id},function(data){
	     num1 = data.data.pages;
	     var all = data.data.list;
	     	if (all=='') {
	     		showFirst();
	     	} else{
	     		//清空表格数据
	            $('#example2 tbody').children().remove();
	            showTrs1(all);
	     	}
	    
    });
    clickId = treeNode.id;
    
    
}

//点击确定，添加工单问题类型
$('.add_type_btn').on('click',function(){
	api.userPost("admin/work/addCategory",{name:$('.typeName').val()},function (data) {
		if (data.code == 0) {
		    var text = "添加成功";
            toastrSucceed(text);
            //清空操作
            $('.typeName').val('');
            //刷新树状图
            api.get("admin/work/category",{},groupAll);
		}else{
		    var text = data.message;
            toastrFail(text);
		}
	})
});
//点击取消，清空input框
$('.cancel_type_btn').on('click',function(){
	$('.typeName').val('');
})









//常见问题模块
$(function () {
    // Initialize Example 1
    $('#example2').footable();
});
//分页按钮
var num1 = 10;//总页数
var nums1 = 1;//当前页
$('.btnNum1').on('click','.btns1',function(){
     $('.btnNum1 .btn').removeClass('active');
     $(this).addClass('active');
     nums1 = $(this).text();
});
//上一页
$('.btnleft1').on('click',function(){
	if (nums1 > 1) {
		$('.btnNum1 .btns1').removeClass('active');
		$('.btnNum1 .btns1').eq(nums1-2).addClass('active');
		nums1 = nums1 - 1;
	}else{
		return;
	}
});
//下一页
$('.btnright1').on('click',function(){
	if (nums1 < num1) {
		$('.btnNum1 .btns1').removeClass('active');
		$('.btnNum1 .btns1').eq(nums1).addClass('active');
		nums1 = nums1 - 0 + 1;
	}else{
		return;
	}
});


//请求后台页面数量数据 
function showPages1(datas){
api.get('admin/work/question',{qc_id:datas},function(data){
	num1 = data.data.pages;
	console.log(num1);
	//清空分页按钮
	$('.btns1').remove();
	//生成分页框数量
    for (var i=1;i<num1+1;i++) {
    	if (i==1) {
    		$btn='<button class="btn btns1 btn-default active">'+i+'</button>';
    	} else{
    		$btn='<button class="btn btns1 btn-default">'+i+'</button>';
    	}
	   $('.btnNum1').append($btn);
    }
});
}

//生成表格内容方法
function showTrs1(all){
	var $trs;
	for (var i=0;i<all.length;i++) {
	   $trs = $('<tr dataId='+all[i].id+'><td><input type="checkbox" class="check"/></td><td>'+all[i].title+'</td><td>'+all[i].manager+'</td><td>'+all[i].created_at+'</td><td>'+all[i].updated_at+'</td><td>'+all[i].answer+'</td></tr>');
	   $('#example2 tbody').append($trs);
	}
	checkOrCancel(".checkAll",".check");
	$("#example2").trigger("footable_initialize");
}

//初始化第一页
function showFirst(){
	//清空表格数据
	$('#example2 tbody').children().remove();
	var $trs = $('<tr><td colspan="5" style="text-align: center;">该分类下无常见问题</td></tr>');
	$('#example2 tbody').append($trs);
}
showFirst();

//点击分页按钮 传送当前页数
$('.btnNum1').on('click',function(){
	//清空表格数据
	$('#example2 tbody').children().remove();
	//请求当前页的表格数据
    api.get('admin/work/question',{'page':nums1,'qc_id':clickId},function(data){
	   num1 = data.data.pages;
	   var all = data.data.list;
	   showTrs1(all);
    });
});


//点击添加常见问题按钮
$('.add_btn').on('click',function(){
	if (clickId == undefined) {
		$('.add_btn').attr('data-target','');
		toastrFail('请先选择工单分类');
	} else{
		$('.add_btn').attr('data-target','#myModal1');
	}
})
//点击确定，添加常见问题
$('.add_answer_btn').on('click',function(){
	var param;
	param = {
		title:$('.form_title').val(),
		answer:$('.form_answer').val(),
		qc_id:clickId
	}
	api.userPost("admin/work/addQuestion",param,function (data) {
		if (data.code == 0) {
			//清空表格数据
	        $('#example2 tbody').children().remove();
		    var text = "添加成功";
            toastrSucceed(text);
            //清空操作
            $('.form_title').val('');
            $('.form_answer').val('');
            //刷新分页按钮
            showPages1(clickId);
            //刷新列表
            api.get('admin/work/question',{'qc_id':clickId},function(data){
	              num1 = data.data.pages;
	              var all = data.data.list;
	              showTrs1(all);
            });
		}else{
		    var text = data.message;
            toastrFail(text);
		}
	});
});
//编辑
$('.change_btn').on('click',function(){
	var checked = $("#example2 tr td input[type=checkbox]:checked");
	if (checked.length==0) {
		var text = '您未选中任何常见问题';
        toastrFail(text);
	}else if(checked.length > 1) {
		var text = '请选中单个问题进行编辑';
        toastrFail(text);
	}else{
		//更新编辑按钮的属性
		$('.change_btn').attr('data-target','#myModal2');
		//将内容写入编辑框
		$('.form_titles').val(checked.eq(0).parent().next().text());
		$('.form_answers').val(checked.eq(0).parent().next().next().next().next().next().text());
	}
});
//编辑 确定
$('.add_answer_btns').on('click',function(){
	var checked = $("#example2 tr td input[type=checkbox]:checked");
	//进行编辑
	var param;
	param = {
		title:$('.form_titles').val(),
		answer:$('.form_answers').val(),
		qc_id:clickId,
		id:checked.eq(0).parent().parent().attr('dataId')
	}
	api.userPost("admin/work/updateQuestion",param,function (data) {
		if (data.code==0) {
			//清空表格数据
	        $('#example2 tbody').children().remove();
		    var text = "编辑成功";
            toastrSucceed(text);
            //清空操作
            $('.form_title').val('');
            $('.form_answer').val('');
            //刷新列表
            api.get('admin/work/question',{'qc_id':clickId},function(data){
	              num1 = data.data.pages;
	              var all = data.data.list;
	              showTrs1(all);
            });
		} else{
			var text = data.message;
            toastrFail(text);
		}
	})
	//清空编辑按钮属性
	$('.change_btn').attr('data-target','');
});
//编辑 取消
$('.cancel_answer_btns').on('click',function(){
	//清空操作
    $('.form_title').val('');
    $('.form_answer').val('');
    //清空编辑按钮属性
	$('.change_btn').attr('data-target','');
});


//点击批量删除
$('.dange_btn').on('click',function(){
	var checked = $(".check:checked");
	var codes = 0;//记录成败状态
	var message = '';//记录失败原因
	if (checked.length == 0) {
		var text = '您未选中任何常见问题';
        toastrFail(text);
	}else{
		swal({
            title: "确定删除?",
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
            	for (var i = 0;i < checked.length;i++) {
                    var param = {
                       "id":checked.eq(i).parent().parent().attr("dataId")
                    };
                api.userPost("admin/work/deleteQuestion",param,function (data) {
                	if (data.code==0) {
                		codes = 0;
                	}else {
                	    codes = -1;
                	    message = data.message;
                	}
                });
                }
            	if (codes == 0) {
            		var text = "删除成功";
                    toastrSucceed(text);
                    $('.checkAll:checkbox').attr('checked',false);
                    //清空表格数据
	                $('#example2 tbody').children().remove();
	                //刷新列表
                    api.get('admin/work/question',{'qc_id':clickId},function(data){
	                    num1 = data.data.pages;
	                    var all = data.data.list;
	                    showTrs1(all);
                    });
            	} else{
            		var title = "删除失败";
                    var text = message;
                    alertMessage(title,text);
            	}
            }
            //刷新分页按钮
            showPages1(clickId);
        });
	}
});










