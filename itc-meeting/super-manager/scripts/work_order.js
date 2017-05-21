$(function () {
    // Initialize Example 1
    $('#example1').footable();
});
//分页按钮
var num;//总页数
var nums = 1;//当前页
$('.btnNum').on('click','.btns',function(){
     $('.btnNum .btn').removeClass('active');
     $(this).addClass('active');
     nums = $(this).text();
});
//上一页
$('.btnleft').on('click',function(){
	if (nums > 1) {
		$('.btnNum .btns').removeClass('active');
		$('.btnNum .btns').eq(nums-2).addClass('active');
		nums = nums - 1;
	}else{
		return;
	}
});
//下一页
$('.btnright').on('click',function(){
	if (nums < num) {
		$('.btnNum .btns').removeClass('active');
		$('.btnNum .btns').eq(nums).addClass('active');
		nums = nums - 0 + 1;
	}else{
		return;
	}
});



//判断状态生成按钮方法
function showTrs(all){
	var $trs;
	for (var i=0;i<all.length;i++) {
	   //判断工单的状态
	   if (all[i].work_status == 1) {//待受理
	   	  $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].company_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">受理</button"></td><td>'+all[i].content+'</td></tr>');
	   } else if (all[i].work_status == 2){//已受理
	   	  if (all[i].is_reply == 0) {//待回复
	   	  	$trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].company_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttone" data-toggle="modal">完成</button"><button type="button" class="btn btn-xs btn-warning2 buttons" data-target="#myModals" data-toggle="modal">答复<i class="fa fa-envelope"></i></button></td><td>'+all[i].content+'</td></tr>');
	   	  } else{
	   	  	$trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].company_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttone" data-toggle="modal">完成</button"><button type="button" class="btn btn-xs btn-warning buttons" data-target="#myModals" data-toggle="modal">答复</button></td><td>'+all[i].content+'</td></tr>');
	   	  }
	   } else if(all[i].work_status == 3){//待确认状态
	   	  if (all[i].is_reply == 0) {//待回复
	   	  	$trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].company_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-warning buttons" data-target="#myModals" data-toggle="modal">答复<i class="fa fa-envelope"></i></button></td><td>'+all[i].content+'</td></tr>');
	   	  } else{
	   	  	$trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].company_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-warning buttons" data-target="#myModals" data-toggle="modal">答复</button></td><td>'+all[i].content+'</td></tr>');
	   	  }
	   	  
	   }else if(all[i].work_status == 4){//已结束状态
	   	  $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].company_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td></td><td>'+all[i].content+'</td></tr>');
	   }
	   
	   $('#example1 tbody').append($trs);
	}
	if (all.length == 0) {
		$trs = $('<tr><td colspan="8" style="text-align: center;">暂无数据</td></tr>');
		$('#example1 tbody').append($trs);
	}
	$("#example1").trigger("footable_initialize");
}


//请求当前页表 方法
function showTable(){
	//生成分页
	showPages();
	//清空表格数据
	$('#example1 tbody').children().remove();
	//请求当前页的表格数据
    api.get('admin/work/listPage',{'page':nums},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
}
//初始化第一页
api.get('admin/work/listPage',{'page':1},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
var arr1=['','待受理','已经受理','待确认','已结束'];
var arr2=['','软件问题','订单问题'];
//点击分页按钮 传送当前页数
$('.btnNum').on('click',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//请求当前页的表格数据
    api.get('admin/work/listPage',{'page':nums,work_status:work_status},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
});
//请求后台页面数量数据 
function showPages(){
api.get('admin/work/listPage',{},function(data){
	num = data.data.pages;
	//清空分页按钮
	$('.btns').remove();
	//生成分页框数量
    for (var i=1;i<num+1;i++) {
    	if (i==1) {
    		$btn='<button class="btn btns btn-default active">'+i+'</button>';
    	} else{
    		$btn='<button class="btn btns btn-default">'+i+'</button>';
    	}
	   $('.btnNum').append($btn);
    }
});
}
showPages();

//添加工单
//点击确认
//$('.add_prom_btn').on('click',function(){
//	var param;
//	param = {
//		'qc_id':$('.promType').val(),
//      'content':$('.promText').val()
//	}
//	if ($('.promType').val()==0) {
//		var text = '请选择问题类型';
//      toastrFail(text);
//	}else{
//	api.userPost('work/add',param,function(data){
////		console.log(data);
//		if (data.code == 0) {
//			var text = "添加工单成功";
//          toastrSucceed(text);
//          $('.promType').val(0);
//          $('.promText').val('');
//          showTable();
//		} else{
//			var text = data.message;
//          toastrFail(text);
//		}
//	});
//	}
//})
////点击取消
//$('.cancel_prom_btn').on('click',function(){
//	$('.promType').val(0);
//  $('.promText').val('');
//})



//查询
var work_status = 0;//记录状态
$('.btnsu0').on('click',function(){
	work_status = 0;
});
$('.btnsu1').on('click',function(){
	work_status = 1;
});
$('.btnsu2').on('click',function(){
	work_status = 2;
});
$('.btnsu3').on('click',function(){
	work_status = 3;
});
$('.btnsu4').on('click',function(){
	work_status = 4;
});
$('.btn-success').on('click',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//搜索内容显示
	api.get('admin/work/listPage',{'work_status':work_status},function(data){
	   //生成分页按钮
	   num = data.data.pages;
	   //清空分页按钮
	   $('.btns').remove();
	   //生成分页框数量
       for (var i=1;i<num+1;i++) {
       	  if (i==1) {
       		  $btn='<button class="btn btns btn-default active">'+i+'</button>';
       	  } else{
       		  $btn='<button class="btn btns btn-default">'+i+'</button>';
       	  }
	      $('.btnNum').append($btn);
       }
	   var all = data.data.list;
	   showTrs(all);
	})
});

//公司查询
$('.searchIt').on('input',function(){
	if ($('.searchIt').val()=='') {
		 //清空ul
		 $('#companyShow').children().remove();
		 //将高度变为0
		  $('#companyShow').css({'height':'0px'});
	} else{
	     //显示公司名称
	     api.get('admin/company/listPage',{'company_name':$('.searchIt').val()},function(data){
		     var all = data.data;
		     var $str;
		     //清空ul
		     $('#companyShow').children().remove();
		     //将高度变为0
		     $('#companyShow').css({'height':'0px'});
		    for (var i=0;i<all.length;i++) {
			    $str='<li compId = '+all[i].id+'>'+all[i].name+'</li>';
			    $('#companyShow').append($str);
		     }
		     //显示公司ul
	         $('#companyShow').animate({'height':30*all.length+'px'},200);
	     });
	}
});
//鼠标移入/移出公司 变色
$('#companyShow').on('mouseenter','li',function(){
	$(this).css({'background-color':'#6799FF','color':'white'});
});
$('#companyShow').on('mouseleave','li',function(){
	$(this).css({'background-color':'white','color':'#BBBBBB'});
});
//点击公司 获取Id
$('#companyShow').on('click','li',function(){
	var id = $(this).attr('compId'); //公司ID
    //将选中企业名写入搜索框
    $('.searchIt').val($(this).text());
    //清空ul
    $('#companyShow').children().remove();
    //将高度变为0
    $('#companyShow').css({'height':'0px'});
    //通过ID搜索内容
    api.get('admin/work/listPage',{company_id:id},function(data){
        //清空表格数据
	    $('#example1 tbody').children().remove();
    	//生成分页按钮
	   num = data.data.pages;
	   //清空分页按钮
	   $('.btns').remove();
	   //生成分页框数量
       for (var i=1;i<num+1;i++) {
       	  if (i==1) {
       		  $btn='<button class="btn btns btn-default active">'+i+'</button>';
       	  } else{
       		  $btn='<button class="btn btns btn-default">'+i+'</button>';
       	  }
	      $('.btnNum').append($btn);
       }
       //生成表
	   var all = data.data.list;
	   showTrs(all);
    })
    
})





//回复弹出框
var orderNum;//订单编号
var id;//订单ID
$('#example1').on('click','.buttons',function(){
	//订单编号
	orderNum = $(this).parent().parent().children().first().text();
	$('.orderNum').text('');
	$('.orderNum').text(orderNum);
	id = $(this).parent().parent().attr('codeId');
	//问题描述
	orderTexts = $(this).parent().parent().children().last().text();
	$('.orderTexts').text('');
	$('.orderTexts').text(orderTexts);
	//回复内容显示
	api.userPost('admin/work/askList',{work_id:id},function(data){
		var all = data.data.list;
		$('.showAsk').html('');
		var ids;
		if (data.data.list.length == 0) {
			return;
		} else{
			var texts;
			for (var i=0;i<all.length;i++) {
				ids = all[i].id;
				if (all[i].manager == 0) {
					texts='<div textid="'+ids+'" class="chat-message left"><img class="message-avatar" src="images/a2.jpg"><div class="message"><span class="message-author">'+all[i].creator.nickname+'</span><span class="message-date">'+all[i].created_at+'</span><span class="message-content">'+all[i].content+'</span></div></div>';
				} else	{
					texts='<div textid="'+ids+'" class="chat-message right"><img class="message-avatar" src="images/a2.jpg"><div class="message"><span class="message-author">'+all[i].manager.nickname+'</span><span class="message-date">'+all[i].created_at+'</span><span class="message-content">'+all[i].content+'</span></div></div>';
				}
				$('.showAsk').append(texts);
			}
		}
	});
});
//点击提交回复按钮
$('.add_ask_btn').on('click',function(){
	$(".showAsk").load();
	//提交回复
	var param;
	param = {
		work_id:id,
		content:$('.askText').val()
	}
	api.userPost('admin/work/reply',param,function(data){
		if (data.code == 0) {
			var text = "提交回复成功";
            toastrSucceed(text);
            $('.askText').val('');
            //刷新表 初始化第一页
            api.get('admin/work/listPage',{'page':1},function(data){
               //清空表格数据
	           $('#example1 tbody').children().remove();
	           num = data.data.pages;
	           var all = data.data.list;
	           showTrs(all);
            });
		} else{
			var text = data.message;
            toastrFail(text);
		}
	});
});
//点击取消  清空内容
$('.cancel_ask_btn').on('click',function(){
	$('.askText').val('');
});

//受理工单
$('#example1').on('click','.buttond',function(){
	acceeptOrder();
	id = $(this).parent().parent().attr('codeId');
})
//确认受理工单弹窗
function acceeptOrder() {
    swal({
            title: "确定受理工单?",
            text: "受理后,请尽快解决该工单问题",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，确定受理",
            cancelButtonText: "否,暂不受理",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                //确认受理
	            api.userPost('admin/work/setStatus',{id:id,status:2},function(data){
		            if (data.code == 0) {
		            	var text = "受理成功";
                        toastrSucceed(text);
                        //刷新表 初始化第一页
                        api.get('admin/work/listPage',{'page':1},function(data){
                        	//清空表格数据
	                        $('#example1 tbody').children().remove();
	                        num = data.data.pages;
	                        var all = data.data.list;
	                        showTrs(all);
                        });
		            }else{
		            	var text = data.message;
                        toastrFail(text);
		            }
	            });
            }
        });
}
//完成工单
$('#example1').on('click','.buttone',function(){
	endOrder();
	id = $(this).parent().parent().attr('codeId');
})
//确认完成工单弹窗
function endOrder() {
    swal({
            title: "确定完成工单?",
            text: "请确认是否已解决该工单的问题",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，已完成",
            cancelButtonText: "否,尚未完成",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                //确认完成
	            api.userPost('admin/work/setStatus',{id:id,status:3},function(data){
		            if (data.code == 0) {
		            	var text = "工单问题完成";
                        toastrSucceed(text);
                        //刷新表 初始化第一页
                        api.get('admin/work/listPage',{'page':1},function(data){
                        	//清空表格数据
	                        $('#example1 tbody').children().remove();
	                        num = data.data.pages;
	                        var all = data.data.list;
	                        showTrs(all);
                        });
		            }else{
		            	var text = data.message;
                        toastrFail(text);
		            }
	            });
            }
        });
}




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