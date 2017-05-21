//部分引用statistics.js中方法,改动时注意

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
	   $trs = $('<tr comId = "'+all[i].id+'"><td>'+all[i].name+'</td><td>'+all[i].creator+'</td><td>'+all[i].created_at+'</td><td>'+all[i].userNum+'人</td><td>'+all[i].roomNum+'间</td><td>'+all[i].meetNum+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">统计详情</button"></td></tr>');
	   $('#example1 tbody').append($trs);
	}
	if (all.length == 0) {
		$trs = $('<tr><td colspan="7" style="text-align: center;">暂无数据</td></tr>');
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
    api.get('admin/statistics/listPage',{'page':nums},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
}
//初始化第一页
api.get('admin/statistics/listPage',{'page':1},function(data){
	   //清空表格数据
	   $('#example1 tbody').children().remove();
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
//点击分页按钮 传送当前页数
$('.btnNum').on('click',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//请求当前页的表格数据
    api.get('admin/statistics/listPage',{'page':nums},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
});
//请求后台页面数量数据 
function showPages(){
api.get('admin/statistics/listPage',{},function(data){
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


//点击查询
$('.searchBtn').on('click',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	var start_time = chosseData($('#datapicker01').val());
	var end_time = chosseData($('#datapicker02').val());
	//搜索内容显示
	api.get('admin/statistics/listPage',{'start_time':start_time,'end_time':end_time},function(data){
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
})
//点击取消
$('.closeBtn').on('click',function(){
	$('#datapicker01').val('');
	$('#datapicker02').val('');
	//刷新表 初始化第一页
    api.get('admin/statistics/listPage',{'page':1},function(data){
        //清空表格数据
	    $('#example1 tbody').children().remove();
	    num = data.data.pages;
	    var all = data.data.list;
	    showTrs(all);
    });
    showPages();
})


//点击统计详情
var comId = 3;
$('#example1').on('click','.buttond',function(){
    comId = $(this).parent().parent().attr('comId');//公司ID
    $('#showNames').text($(this).parent().parent().children().first().text());
    $('#wraps').css('display','block');
    //初始化弹窗数据
    showFirst(comId);
    showSec(comId);
});
//点击关闭
$('#closeShowBtn').on('click',function(){
    $('#wraps').css('display','none');
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

//将日期转化为后台标准格式
function chosseData (data){
	var b=data.split('/');
    var d;
    d=b[0];
    b[0]=b[2];
    b[2]=b[1];
    b[1]=d;
   var c=b.join('-');
   return c;
}

