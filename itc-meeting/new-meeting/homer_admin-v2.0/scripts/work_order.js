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
	   if ((all[i].work_status == 1)) {//待受理
	   	  $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">关闭</button"></td><td>'+all[i].content+'</td></tr>');
	   } else if (all[i].work_status == 2){//已受理
	   	  if (all[i].is_reply == 1) {//待回复
	   	  	 $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">关闭</button"><button type="button" class="btn btn-xs btn-warning2 buttons" data-target="#myModals" data-toggle="modal">追问<i class="fa fa-envelope"></i></button></td><td>'+all[i].content+'</td></tr>');
	   	  } else if (all[i].is_reply == 2){
	   	  	 $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">关闭</button"><button type="button" class="btn btn-xs btn-warning buttons" data-target="#myModals" data-toggle="modal">追问</button></td><td>'+all[i].content+'</td></tr>');
	   	  }else{
	   	  	 $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">关闭</button"><button type="button" class="btn btn-xs btn-warning buttons" data-target="#myModals" data-toggle="modal">追问</button></td><td>'+all[i].content+'</td></tr>');
	   	  }
	   } else if(all[i].work_status == 3){//待确认状态
	   	  if (all[i].is_reply) {//待回复
	   	  	 $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">关闭</button"><button type="button" class="btn btn-xs btn-warning2 buttons" data-target="#myModals" data-toggle="modal">追问<i class="fa fa-envelope"></i></button></td><td>'+all[i].content+'</td></tr>');
	   	  } else{
	   	  	 $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td><button type="button" class="btn btn-xs btn-success buttond" data-toggle="modal">关闭</button"><button type="button" class="btn btn-xs btn-warning buttons" data-target="#myModals" data-toggle="modal">追问</button></td><td>'+all[i].content+'</td></tr>');
	   	  }
	   }else if(all[i].work_status == 4){//已结束状态
	   	  $trs=$('<tr codeId="'+all[i].id+'"><td>'+all[i].code+'</td><td>'+all[i].qc_id+'</td><td>'+all[i].created_at+'</td><td>'+all[i].creator+'</td><td>'+arr1[all[i].work_status]+'</td><td></td><td>'+all[i].content+'</td></tr>');
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
    api.get('work/workList',{'page':nums},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
}
//初始化第一页
api.get('work/workList',{'page':1},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
var arr1=['','待受理','已经受理','待确认','已结束'];
//var arr2=['1','2','3','4','5','6'];
//点击分页按钮 传送当前页数
$('.btnNum').on('click',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//请求当前页的表格数据
    api.get('work/workList',{'page':nums,work_status:work_status},function(data){
	   num = data.data.pages;
	   var all = data.data.list;
	   showTrs(all);
    });
});
//请求后台页面数量数据 
function showPages(){
api.get('work/workList',{},function(data){
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
$('.add_prom_btn').on('click',function(){
	var param;
	var a;//记录状态
	if (($('.county').val()==0) && ($('.city').val()==0)) {
		a = $('.province').val();
	} else if (($('.county').val()==0) && ($('.city').val()!=0)) {
		a=$('.city').val();
	}else{
		a=$('.county').val();
	}
	param = {
		'qc_id':a,
        'content':$('.promText').val()
	}
	if ($('.province').val()==0) {
		var text = '请选择问题类型';
        toastrFail(text);
	}else{
	api.userPost('work/add',param,function(data){
//		console.log(data);
		if (data.code == 0) {
			var text = "添加工单成功";
            toastrSucceed(text);
            $('.promType').val(0);
            $('.promText').val('');
            showTable();
		} else{
			var text = data.message;
            toastrFail(text);
		}
	});
	}
	//将后两个隐藏
	$('.city').css('display','none');
	$('.county').css('display','none');
})
//点击取消
$('.cancel_prom_btn').on('click',function(){
	$('.promType').val(0);
    $('.promText').val('');
    //将后两个隐藏
	$('.city').css('display','none');
	$('.county').css('display','none');
})



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
	api.get('work/workList',{'work_status':work_status},function(data){
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
//订单编号查询
$('.searchIt').on('input',function(){
	//清空表格数据
	$('#example1 tbody').children().remove();
	//搜索内容显示
	api.get('work/workList',{'code':$(this).val()},function(data){
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

//追问弹出框
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
	//追问内容显示
	api.userPost('work/askList',{work_id:id},function(data){
		console.log(data.data.list);
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
					texts='<div textid="'+ids+'" class="chat-message right"><img class="message-avatar" src="images/a2.jpg"><div class="message"><span class="message-author">'+all[i].creator.nickname+'</span><span class="message-date">'+all[i].created_at+'</span><span class="message-content">'+all[i].content+'</span></div></div>';
				} else{
					texts='<div textid="'+ids+'" class="chat-message left"><img class="message-avatar" src="images/a2.jpg"><div class="message"><span class="message-author">'+all[i].manager.nickname+'</span><span class="message-date">'+all[i].created_at+'</span><span class="message-content">'+all[i].content+'</span></div></div>';
				}
				$('.showAsk').append(texts);
			}
		}
	});
});
//点击提交追问按钮
$('.add_ask_btn').on('click',function(){
	$(".showAsk").load();
	//提交追问
	var param;
	param = {
		work_id:id,
		content:$('.askText').val()
	}
	api.userPost('work/ask',param,function(data){
		if (data.code == 0) {
			var text = "提交追问成功";
            toastrSucceed(text);
            $('.askText').val('');
            //刷新表 初始化第一页
            api.get('work/workList',{'page':1},function(data){
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
	id = $(this).parent().parent().attr('codeId');
});

//关闭工单
$('#example1').on('click','.buttond',function(){
	closeOrder()
	id = $(this).parent().parent().attr('codeId');
})
//确认关闭工单弹窗
function closeOrder() {
    swal({
            title: "确定关闭工单?",
            text: "关闭后,该工单问题将默认为已解决",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，确定关闭",
            cancelButtonText: "否,暂时取消",
            closeOnConfirm: true,
            closeOnCancel: true
        },
        function (isConfirm) {
            if (isConfirm) {
                //确认完成
	            api.userPost('work/closeWork',{work_id:id},function(data){
		            if (data.code == 0) {
		            	var text = "工单问题已解决";
                        toastrSucceed(text);
                        //刷新表 初始化第一页
                        api.get('work/workList',{'page':1},function(data){
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

//状态三级联动
api.get('work/category',{},function(data){
	var str = JSON.stringify(data.data);
	var node1 = str.replace(/level-1/g,"province").replace(/level-2/g,"city").replace(/level-3/g,"county");
	var node2 = node1.replace(/parent_id/g,"cid");
	var cityjson = node2;
	changeType(cityjson);
});
//三级联动优化(第一级未选中,其他级隐藏)
$('.province').on('input',function(){
	$('.city').css('display','none');
	$('.county').css('display','none');
});
//三级联动优化(第二级未选中,第三级隐藏)
$('.city').on('input',function(){
	$('.county').css('display','none');
});
//三级联动方法
function changeType(cityjson){
	(function($, window, document, undefined){
        $.fn.showCity = function(opt){
            this.defaults = {
                'cityjson'          : cityjson,     //json字符串变量名
                'defaultShow'       : false,        //市、县是否显示,默认不显示
                'showCounty'        : true,         //是否显示县
                'defaultCity'       : [0,0,0]       //默认城市，对应id
            };
            this.options = $.extend({}, this.defaults, opt);

            var oCityJson = eval('('+this.options.cityjson+')'),
                oProvince = $('.province',this),
                oCity = $('.city',this),
                oCounty = $('.county',this),
                provinces = oCityJson.province,
                citys = oCityJson.city,
                countys = oCityJson.county;

            //创建省
            this.creatProvince = function(){
                var html = '';
                for(var i=0; i<provinces.length; i++){
                    html += '<option value='+provinces[i].id+'>'+provinces[i].name+'</option>';
                }
                oProvince.append(html);
            };

            this.creat = function(){
                oProvince.html('<option value="0">选择第一级状态</option>');
                this.creatProvince();
                if(this.options.defaultShow){
                    oCity.show();
                    oCounty.show();
                    oCity.html('<option value="0">选择第二级状态</option>');
                    oCounty.html('<option value="0">选择第三级状态</option>');
                };
                this.defaultCity();
                this.checkProvince();
                if(this.options.showCounty){
                    this.checkCounty();
                }
            };
            //默认城市
            this.defaultCity = function(){
                if(this.options.defaultCity.toString() == '0,0,0'){
                    return;
                };

                var optionsCity = '';
                for(var i=0; i<provinces.length; i++){
                    if(provinces[i].id == this.options.defaultCity[0]){
                        oProvince.val(provinces[i].id);
                        for(var j=0; j<citys.length; j++){
                            if(citys[j].cid == provinces[i].id){
                                optionsCity += '<option value='+citys[j].id+'>'+citys[j].name+'</option>'
                            }
                        }
                        oCity.append(optionsCity).show();
                    }
                };

                var optionscounty = '';
                for(var i=0; i<citys.length; i++){
                    if(citys[i].id == this.options.defaultCity[1] && citys[i].cid == oProvince.val()){
                        oCity.val(citys[i].id);
                        if(this.options.showCounty){
                            for(var j=0; j<countys.length; j++){
                                if(countys[j].cid == citys[i].id){
                                    optionscounty += '<option value='+countys[j].id+'>'+countys[j].name+'</option>';
                                }
                            }
                            oCounty.append(optionscounty).show();
                        }
                    }
                };

                if(this.options.showCounty){
                    for(var i=0; i<countys.length; i++){
                        if(countys[i].id == this.options.defaultCity[2] && countys[i].cid == oCity.val()){
                            oCounty.val(countys[i].id);
                        }
                    };
                }
            }


            this.checkProvince = function(){
                oProvince.bind('change',function(){
                    var html = '<option value="0">选择第二级状态</option>';
                    var val = $(this).val();
                 if ($('.province').val() != 0) {
                    for(var i=0; i<citys.length; i++){
                        if(citys[i].cid == val){
                            html += '<option value='+citys[i].id+'>'+citys[i].name+'</option>'
                        }
                    }
                    oCity.html(html).show();
                    oCounty.html('<option value="0">选择第三级状态</option>');
                  }
                })
            };

            this.checkCounty = function(){
                oCity.bind('change',function(){
                    var html = '<option value="0">选择第三级状态</option>';
                    var val = $(this).val();
                   if ($('.city').val() != 0) {
                    for(var i=0; i<countys.length; i++){
                        if(countys[i].cid == val){
                            html += '<option value='+countys[i].id+'>'+countys[i].name+'</option>'
                        }
                    }
                    oCounty.html(html).show();
                   }
                })
            };
            
            return this.creat();
        }
    }(jQuery, window, document))

    $(function(){
        $('#selectItem').showCity({
            "defaultCity" : [0,0,0]
        });
    })
}

