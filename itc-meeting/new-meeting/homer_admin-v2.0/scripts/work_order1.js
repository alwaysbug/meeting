//问题类型模块
api.get("work/category",{},groupAll);

var setting = {
    view: {
        dblClickExpand:true,
        selectedMulti: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback:{
        onClick:clickNode,
        beforeDrag: false,
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
	var node2 = node1.replace('\{\"level\-1\"\:','').replace('\"level\-2\"\:','').replace('\"level\-3\"\:','');
	var node3 = node2.replace(/\]/g,'').replace(/\[/g,'').replace(/\}$/,'');
	var itNodes = JSON.parse('['+node3+']');
    zTreeNodes = itNodes;

    $.fn.zTree.init($("#zTree"), setting, zTreeNodes);
    var tree = $.fn.zTree.getZTreeObj("zTree");
}


function alertMessage(title,text) {
    swal({
        title: title,
        text: text
    });
}
//点击树节点
var clickId;//点击下的ID
function clickNode(event, treeId, treeNode) {
    $(".ztree .switch").css("color","#333333");
    $("#" + treeNode.tId + "_switch").css("color","#ffffff");
    api.get('work/question',{'qc_id':treeNode.id},function(data){
	     num1 = data.data.pages;
	     var all = data.data.list;
	     	if (all=='') {
	     		showFirst();
	     	} else{
	     		//清空表格数据
	            $('#example2 tbody').children().remove();
	            showTrs1(all);
	            showPages1(treeNode.id);
	     	}
	    
    });
    clickId = treeNode.id;
    
    
}


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
api.get('work/question',{qc_id:datas},function(data){
	num1 = data.data.pages;
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
	if (clickId==undefined) {
		var $trs = $('<tr><td style="text-align: center;">该分类下无常见问题</td></tr>');
	    $('#example2 tbody').append($trs);
	} else if (all.length==0) {
	    var $trs = $('<tr><td style="text-align: center;">该分类下无常见问题</td></tr>');
	    $('#example2 tbody').append($trs);
    } else{	  
		for (var i=0;i<all.length;i++) {
			$trs = $('<tr dataId='+all[i].id+'><td>'+all[i].title+'</td><td>'+all[i].answer+'</td></tr>');
	        $('#example2 tbody').append($trs);
		}
	 }
	checkOrCancel(".checkAll",".check");
	$("#example2").trigger("footable_initialize");
}

//初始化第一页
function showFirst(){
	//清空表格数据
	$('#example2 tbody').children().remove();
	var $trs = $('<tr><td style="text-align: center;">该分类下无常见问题</td></tr>');
	$('#example2 tbody').append($trs);
}
showFirst();

//点击分页按钮 传送当前页数
$('.btnNum1').on('click',function(){
	//清空表格数据
	$('#example2 tbody').children().remove();
	//请求当前页的表格数据
    api.get('work/question',{'page':nums1,'qc_id':clickId},function(data){
	   num1 = data.data.pages;
	   var all = data.data.list;
	   showTrs1(all);
    });
});


