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


//初始化第一页
api.get('account/tradeList',{'page':1},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   for (var i=0;i<all.length;i++) {
	   	  var price;
	   	  if (all[i].income==0) {
	   	  	price='+¥ '+all[i].pay;
	   	  } else{
	   	  	price='-¥ '+all[i].income;
	   	  }
	   	  var $trs=$('<tr><td>'+all[i].trade_code+'</td><td>'+price+'</td><td>'+arr1[all[i].trade_type]+'</td><td>'+all[i].trade_day+'</td><td>'+all[i].trade_desc+'</td><td>'+arr2[all[i].trade_class]+'</td><td>'+all[i].trade_desc+'</td></tr>');
	      $('#example1 tbody').append($trs);
	   }
	   $("#example1").trigger("footable_initialize");
    });
var arr1=['','支付宝','网银','微信'];
var arr2=['','充值','消费'];
//点击分页按钮 传送当前页数
$('.btnNum').on('click',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//请求当前页的表格数据
    api.get('account/tradeList',{'page':nums},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   for (var i=0;i<all.length;i++) {
	   	  var price;
	   	  if (all[i].income==0) {
	   	  	price='+¥ '+all[i].pay;
	   	  } else{
	   	  	price='-¥ '+all[i].income;
	   	  }
	   	  var $trs=$('<tr><td>'+all[i].trade_code+'</td><td>'+price+'</td><td>'+arr1[all[i].trade_type]+'</td><td>'+all[i].trade_day+'</td><td>'+all[i].trade_desc+'</td><td>'+arr2[all[i].trade_class]+'</td><td>'+all[i].trade_desc+'</td></tr>');
	      $('#example1 tbody').append($trs);
	   }
	   $("#example1").trigger("footable_initialize");
    });
});
//请求后台页面数量数据 
api.get('account/tradeList',{},function(data){
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
})

//查询
//充值 交易查询
var trade_class;//记录充值、交易状态
$('.btn-success').on('click',function(){
	//查询分类
	if ($(this).text()=='充值查询'){
		trade_class = 1;
	}else{
		trade_class = 2;
	}
	//清空表格数据
	$('#example1 tbody').children().remove();
	//搜索内容显示
	api.get('account/tradeList',{'trade_class':trade_class},function(data){
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
	   for (var i=0;i<all.length;i++) {
	   	  var price;
	   	  if (all[i].income==0) {
	   	  	price='+¥ '+all[i].pay;
	   	  } else{
	   	  	price='-¥ '+all[i].income;
	   	  }
	   	  var $trs=$('<tr><td>'+all[i].trade_code+'</td><td>'+price+'</td><td>'+arr1[all[i].trade_type]+'</td><td>'+all[i].trade_day+'</td><td>'+all[i].trade_desc+'</td><td>'+arr2[all[i].trade_class]+'</td><td>'+all[i].trade_desc+'</td></tr>');
	      $('#example1 tbody').append($trs);
	   }
	   $("#example1").trigger("footable_initialize");
	})
});
//订单编号查询
$('.searchIt').on('input',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//搜索内容显示
	api.get('account/tradeList',{'code':$(this).val()},function(data){
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
	   for (var i=0;i<all.length;i++) {
	   	  var price;
	   	  if (all[i].income==0) {
	   	  	price='+¥ '+all[i].pay;
	   	  } else{
	   	  	price='-¥ '+all[i].income;
	   	  }
	   	  var $trs=$('<tr><td>'+all[i].trade_code+'</td><td>'+price+'</td><td>'+arr1[all[i].trade_type]+'</td><td>'+all[i].trade_day+'</td><td>'+all[i].trade_desc+'</td><td>'+arr2[all[i].trade_class]+'</td><td>'+all[i].trade_desc+'</td></tr>');
	      $('#example1 tbody').append($trs);
	   }
	   $("#example1").trigger("footable_initialize");
	})
})


