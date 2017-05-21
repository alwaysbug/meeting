		function todayMeeting (arr) {

			var chartPrecent = echarts.init(document.getElementById('precent'));
			option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: "{b}: {c}",
                    axisPointer:{
			        	z:"100"
					}
			    },
			    legend: {
			        orient: 'horizontal',
			       left:'center',
			       top:'bottom',
			        data:['已完成','预约会议数']
			    },
			    series: [
			        {
			            name:'今日会议',
			            type:'pie',
			            radius: ['70%', '80%'],
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
			                	name:'预约会议数',
			                	itemStyle:{
			                                 normal:{
			                                     color: '#cee7f6'
			                                 }
			                            },
			                },
			                {
			                	value:arr[0], 
			                	name:'已完成',
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
			chartPrecent.setOption(option);
		}
		var $nowTime = $('.now_time_content');
		var time_bool = true;
		var $hourTime = $('#hour_time');
		var $minuteTime = $('#minute_time');
		function systemTime () {
			var dateTime = new Date();
			var hh=dateTime.getHours();
        	var mm=dateTime.getMinutes();
        	var ss=dateTime.getSeconds();  
        	var options1 = {};
        	var options2 = {};
        	function extra1(x){
		        //如果传入数字小于10，数字前补一位0。  
		        if(x < 10){ 
		        	options1 = {prefix : '0'};
		            return "0" + x;
		        }else{  
		            return x;  
		        }  
		    }
        	function extra2(x){
		        //如果传入数字小于10，数字前补一位0。  
		        if(x < 10){ 
		        	options2 = {prefix : '0'};
		            return "0" + x;
		        }else{  
		            return x;  
		        }  
		    }
        	
        	hh = extra1(hh);
        	mm = extra2(mm);
        	if (time_bool) {
        		new CountUp("hour_time", 0, hh, 0, 1.5,options1).start();
        		new CountUp("minute_time", 0, mm, 0, 1.5,options2).start();
        		time_bool = false;
        	}
        	
        	$hourTime.html(hh);
        	$minuteTime.html(mm);
		}
		setInterval(systemTime,100);

		
// 		$('._table_title').on('click',"li",function  () {
// 			$("._table_title").children().css({
// 				"height":"40px",
// 				"border-top": "none",
// 				"border-right": "1px solid #e5e5e5",
// 				"border-bottom": "1px solid #e5e5e5"
// 			})
// 			$(this).css({
// 				"height":"42px",
// 				"border-top": "2px solid #0b89d0",
// //				"border-right": "1px solid #e5e5e5",
// 				"border-bottom": "none"
// 			})
// 		});

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
checkOrCancel(".checkAll",".check");

        api.get("stat/daily",{},function (data) {
            if(data.code == 0){
                var staus = data.data;
                $("#ing_num").html(staus.appointedMeetingNum);
                $("#free_num").html(staus.canceledMeetingNum);
                $("#today_num").html(staus.attendedNum);
                $("#total_num").html(staus.spareRoomNum);
                var num_speed = 1.5;//秒
                new CountUp("ing_num", 0, staus.appointedMeetingNum, 0, num_speed).start();
                new CountUp("free_num", 0, staus.canceledMeetingNum, 0, num_speed).start();
                new CountUp("today_num", 0, staus.attendedNum, 0, num_speed).start();
                new CountUp("total_num", 0, staus.spareRoomNum, 0, num_speed).start();
                todayMeeting([staus.alreadyEndedMeetingNum,staus.appointedMeetingNum]);

            }
        })
        //处理当日会议室使用率
        function firstTimeBarTable() {
            var getDate = new Date();
            var getYear = getDate.getFullYear();
            var getMonth = getDate.getMonth() + 1;
            var getDay = getDate.getDate();
            var param = {
                "day":getYear + "-" + getMonth + "-" + getDay
            }
            api.get("stat/dailyMeetingRoomUsage",param,function (data) {
                var sta = data.data;
                barTable(sta.horizontalRooms,sta.verticalPercentage);
            })
        }
        firstTimeBarTable();
        //今日会议  获取会议列表
        var getTodayMeet = {
            init:function  () {
                var nowTime = new Date();
                var param = {
                    "year":nowTime.getFullYear(),
                    "month":nowTime.getMonth() + 1,
                    "day":nowTime.getDate()
                };
                api.get("meeting",param,getTodayMeet.backObj);
            },
            backObj:function (data) {
                var tbody = $('.tbody');
                var arr = data.data;
                $('#today_num').html(arr.length);//今日会议数量
                if (arr.length == 0) {
                    var tr = $('<tr><td>今日没有会议，快去添加吧</td></tr>')
                    tbody.append(tr);
                }else{
                    for (var i = 0;i < arr.length;i++) {
                        var tr = $('<tr><td>'+ arr[i].subject +'</td><td>'+ arr[i].attendedNum +'</td><td>'+ arr[i].roomAddress +'</td><td>'+ arr[i].startedAt.split(" ")[1] +'-'+ arr[i].endedAt.split(" ")[1] +'</td><td>'+ arr[i	].summary +'</td></tr>')
                        tbody.append(tr);
                    }
                }

            }
        }
        getTodayMeet.init();
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
        $(".wrapper").on("click",function  () {
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
                delayDisapper(1000);
                $(".tips").slideUp(200);
            })
        })

        //提示信息延迟几秒消失
        function delayDisapper(delayTime) {
            setTimeout(function () {
                $("#no_groups").modal('hide');
            },delayTime);
        }
        //当前有会议的日子
        var nowTime = new Date();
        var year = nowTime.getFullYear();
        var month = nowTime.getMonth();
        var meetParam = {
            "year":year,
            "month":month + 1,
        };

        api.get("meeting/meetingDays",meetParam,monthMeet);

        function monthMeet(data) {
            var nowTime = new Date();
            var year = nowTime.getFullYear();
            var month = nowTime.getMonth() + 1;
            var d = data.data;
            var s =  [];
            for (var i = 0;i < d.length;i++) {
                var obj = {
                    date:year + '/' + month + '/' + d[i],
                    value: ' '
                }
                s.push(obj);
            };
            //日历组件日期选择
            $('#ca').calendar({
                width: 450,
                height: 220,
                data: s,
                onSelected: function (view, date, data) {
                    var getDate = new Date(date).Format('yyyy-MM-dd');
                    var year = getDate.split("-")[0];
                    var month = getDate.split("-")[1];
                    var day = getDate.split("-")[2];
                    var param = {
                        "year":year,
                        "month":month,
                        "day":day
                    }
                    api.get("meeting",param,selectedDay);
                    //会议室使用率更新
                    api.get("stat/dailyMeetingRoomUsage",{"day":getDate},function (data) {
                        var sta = data.data;
                        barTable(sta.horizontalRooms,sta.verticalPercentage);
                    })
                }
            });
        }
        //处理选择日期后的回调操作
        function selectedDay (data) {
            var tbody = $('.tbody');
            tbody.slideUp();
            tbody.html("");
            var arr = data.data;
            $('#today_num').html(arr.length);//今日会议数量
            if (arr.length == 0) {
                var tr = $('<tr><td colspan="5" style="text-align: center;">今日没有会议，快去添加吧</td></tr>')
                tbody.append(tr);
            }else{
                for (var i = 0;i < arr.length;i++) {
                    var tr = $('<tr><td>'+ arr[i].subject +'</td><td>'+ arr[i].attendedNum +'</td><td>'+ arr[i].roomAddress +'</td><td>'+ arr[i].startedAt.split(" ")[1] +'-'+ arr[i].endedAt.split(" ")[1] +'</td><td>'+ arr[i].summary +'</td></tr>')
                    tbody.append(tr);
                }
            }
            tbody.slideDown();
        }
        //日期转换工具
        Date.prototype.Format = function(fmt){
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        }
		
