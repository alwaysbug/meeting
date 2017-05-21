function barTable (dataX,dataY) {
        var bar_table = echarts.init(document.getElementById('bar_table'));
        var option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{b}: {c}%",
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : dataX,
                        axisTick: {
                            alignWithLabel: true,
                            inside:true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        min: 0,
                        max: 100,
                        axisLabel: {
                            formatter: '{value}% '
                        }
                    }
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 60
                    },
                    {
                        type:"slider",
                        show:true,
                        start: 0,
                        end: 60,
                        bottom:"0px"
                    }
                ],
                series : [
                    {
                        name:'使用频率',
                        type:'bar',
                        // barWidth: '60%',
                        barCategoryGap:'60%',
                        data:dataY
                    }
                ]
            };
        bar_table.setOption(option);
    }


 
var types = 'month';//记录状态 初始化  月
$('#datapicker1').datepicker({ //初始化年 
    format: 'yyyy',  
    weekStart: 1,  
    autoclose: true,  
    
    endDate:new Date(),
    startView: 2,  
    maxViewMode: 2,
    minViewMode:2,
    forceParse: false,  
    language: 'zh-CN'  
});
$('#datapicker2').datepicker({ //月 
    format: 'yyyy-mm',  
    weekStart: 1,  
    autoclose: true,  
    
    endDate:new Date(),
    startView: 2,  
    maxViewMode: 2,
    minViewMode:1,
    forceParse: false,  
    language: 'zh-CN'  
});
$('#datapicker3').datepicker({ //年 
    format: 'yyyy-mm-dd',  
    weekStart: 1,  
    autoclose: true,  
    
    endDate:new Date(),
    startView: 2,
    maxViewMode: 2,
    minViewMode:0,
    forceParse: false,  
    language: 'zh-CN'  
});

$('.monthType').on('click',function(){
	types = 'month';//月
	//显示隐藏输入框
	$('#datapicker1').css('display','block');
	$('#datapicker2').css('display','none');
	$('#datapicker3').css('display','none');
	//样式
	$('.monthType').css('border-bottom','2px solid #5b8eff');
	$('.weekType').css('border-bottom','none');
	$('.dayType').css('border-bottom','none');
});
$('.weekType').on('click',function(){
	types = 'week';//周
	//显示隐藏输入框
	$('#datapicker2').css('display','block');
	$('#datapicker1').css('display','none');
	$('#datapicker3').css('display','none');
    //样式
	$('.monthType').css('border-bottom','none');
	$('.weekType').css('border-bottom','2px solid #5b8eff');
	$('.dayType').css('border-bottom','none');
});
$('.dayType').on('click',function(){
	types = 'day';//日
	//显示隐藏输入框
	$('#datapicker3').css('display','block');
	$('#datapicker2').css('display','none');
	$('#datapicker1').css('display','none');
    //样式
	$('.monthType').css('border-bottom','none');
	$('.weekType').css('border-bottom','none');
	$('.dayType').css('border-bottom','2px solid #5b8eff');
});

//初始化 2017年
function showFirst(comId){
api.userPost("admin/statistics/activeSearch",{company_id:comId,year:'2017',type:'month'},function (data) {
	var arr = [];
    var str = JSON.stringify(data.data);
    var node1 = str.replace(/2017/g,'');
    var obj =  JSON.parse(node1);
    var a = 1;
    for (var i=1;i<=12;i++){
         a = 1;
         for(var key in obj){
            if (i == key) {
                a = a * 0;
            } else{
                a = a * 1;
            }
        }
        if (a==0) {
            if (i<10) {
            	arr.push(obj['0'+i]);
            } else{
            	arr.push(obj[i]);
            }
        } else{
             arr.push(0);
        }
    }
    barTable(['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],arr);
})
}
showFirst(1);


var y,m,d;
$('.input-group input').on('change',function(){
	if (types == 'month') {
		param = {
	       company_id:comId,
	       year:$(this).val(),
	       type:'month'
        }
		y = $(this).val();
		api.userPost("admin/statistics/activeSearch",param,function (data) {
			var arr = [];
            var str = JSON.stringify(data.data);
            var re =new RegExp(y,"g");
            var node1 = str.replace(re,'');
            var obj =  JSON.parse(node1);
            var a = 1;
            for (var i=1;i<=12;i++){
            	a = 1;
            	for(var key in obj){
                    if (i == key) {
                    	a = a * 0;
                    } else{
                    	a = a * 1;
                    }
                }
            	if (a==0) {
            	   if (i<10) {
            	   	  arr.push(obj['0'+i]);
            	   } else{
            	   	  arr.push(obj[i]);
            	   }
                } else{
                   arr.push(0);
                }
            }
            barTable(['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],arr);
        });
	} else if (types == 'week') {
		var b=$(this).val().split('-');
		param = {
	       company_id:comId,
	       year:b[0],
	       month:b[1],
	       type:'week'
        }
		api.userPost("admin/statistics/activeSearch",param,function (data) {
            var arr = [];//存数据
            var arr1 = [];//存周数
            var daysNum = getCountDays(new Date(b[0], b[1]));
            var beginNum = getYearWeek(new Date(b[0], b[1], 1));//当前月份第一天
            var endNum = getYearWeek(new Date(b[0], b[1], daysNum));//当期月份最后一天
            var str = JSON.stringify(data.data);
            var re =new RegExp(b[0],"g");
            var node1 = str.replace(re,'');
            var obj =  JSON.parse(node1); 
            console.log(obj);
            var a = 1;
            for (var i=beginNum;i<=endNum;i++){
            	arr1.push('第'+i+'周');
            	a = 1;
            	for(var key in obj){
                    if (i == key) {
                    	a = a * 0;
                    } else{
                    	a = a * 1;
                    }
                }
            	if (a==0) {
            	   if (i<10) {
            	   	  arr.push(obj['0'+i]);
            	   } else{
            	   	  arr.push(obj[i]);
            	   }
                } else{
                   arr.push(0);
                }
            }
            barTable(arr1,arr);
        })
	} else{
		var b=$(this).val().split('-');
		param = {
	       company_id:comId,
	       year:b[0],
	       month:b[1],
	       day:b[2],
	       type:'day'
        }
		api.userPost("admin/statistics/activeSearch",param,function (data) {
            var arr = [];
            var str = JSON.stringify(data.data);
            var re =new RegExp(b[0]+b[1]+b[2]+' ',"g");
            var node1 = str.replace(re,'');
            var obj =  JSON.parse(node1); 
            var a = 1;
            for (var i=0;i<24;i++){
            	a = 1;
            	for(var key in obj){
                    if (i == key) {
                    	a = a * 0;
                    } else{
                    	a = a * 1;
                    }
                }
            	if (a==0) {
                   if (i<10) {
            	   	  arr.push(obj['0'+i]);
            	   } else{
            	   	  arr.push(obj[i]);
            	   }
                } else{
                   arr.push(0);
                }
            }
            barTable(['0:00-1:00','1:00-2:00','2:00-3:00','3:00-4:00','4:00-5:00','5:00-6:00','6:00-7:00','7:00-8:00','8:00-9:00','9:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00','21:00-22:00','22:00-23:00','23:00-24:00'],arr);
        })
	}
})
var param;


//求每月周数
function getYearWeek(date){  
    var date2=new Date(date.getFullYear(), 1, 1);  
    var day1=date.getDay();  
    if(day1==0) day1=7;  
    var day2=date2.getDay();  
    if(day2==0) day2=7;  
    d = Math.round((date.getTime() - date2.getTime()+(day2-day1)*(24*60*60*1000)) / 86400000);    
    return Math.ceil(d /7)+1;   
} 

var date = new Date(2000, 2);

//求每月多少天
function getCountDays(date) {
    //将日期设置为0
    date.setDate(0);
    //返回当月的天数 
    return date.getDate();
}



//饼状图
function todayMeeting (arr,str) {

			var str = echarts.init(document.getElementById(str));
			option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: "{b}: {c}",
                    axisPointer:{
			        	z:"100"
					}
			    },
			    series: [
			        {
			            name:'今日会议',
			            type:'pie',
			            radius: ['60%', '80%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: false,
			                    textStyle: {
			                        fontSize: '30',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:[
			                {
			                	value:arr[1], 
			                	name:'剩余',
			                	itemStyle:{
			                                 normal:{
			                                     color: '#cee7f6'
			                                 }
			                            },
			                },
			                {
			                	value:arr[0], 
			                	name:'已使用',
			                	itemStyle:{
			                                 normal:{
			                                     color: '#0b89d0'
			                                 }
			                            },
			                },
			            ],
			        }
			    ]
			};
			str.setOption(option);
		}



function showSec(comId){
api.userPost("admin/count/countAll",{company_id:comId},function (data) {
	var total_N = data.data.source.total_N || 0;//短信总条数
	var total_T = data.data.source.total_T || 0;//拥有的空间
	var total_M = data.data.source.total_M || 0;//拥有的流量
	var totals_N = data.data.use_source[0].use_total_N || 0;//短信总条数
	var totals_T = data.data.use_source[0].use_total_T || 0;//拥有的空间
	var totals_M = data.data.use_source[0].use_total_M || 0;//拥有的流量
	
	$('.total_N').text(total_N);
	$('.total_N1').text(totals_N);
	$('.total_N2').text(total_N - totals_N);
	$('.total_M').text(total_M);
	$('.total_M1').text(totals_M);
	$('.total_M2').text(total_M - totals_M);
	$('.total_T').text(total_T);
	$('.total_T1').text(totals_T);
	$('.total_T2').text(total_T - totals_T);
	
	todayMeeting([totals_T,total_T - totals_T],'storage');
    todayMeeting([totals_M,total_M - totals_M],'bandwidth');
    todayMeeting([totals_N,total_N - totals_N],'message');
});
}
showSec(1);
