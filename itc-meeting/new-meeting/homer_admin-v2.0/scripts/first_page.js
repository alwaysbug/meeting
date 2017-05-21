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
            time_bool = false;
        }

        $hourTime.html(hh);
        $minuteTime.html(mm);
    }
    setInterval(systemTime,100);

    function barTable (dataX,dataY) {
        var bar_table = echarts.init(document.getElementById('bar_table'));
        var option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{b}: {c}%",
                    axisPointer : {// 坐标轴指示器，坐标轴触发有效
                        type:"shadow",
                        shadowStyle:{
                            color:'rgba(0,0,0,0)'
                        }
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
                        max: 150,
                        axisLabel: {
                            formatter: '{value}% '
                        },
                        splitLine: {show: false}
                    }
                ],
                series : [
                    {
                        name:'使用频率',
                        type:'bar',
                        // barWidth: '60%',
                        barCategoryGap:'60%',
                        data:dataY,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 7,
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: "rgba(0,0,0,1)"
                                    },
                                    position: "top",
                                    formatter : function(p) {
                                        return p.value > 0 ? (p.value + '%'): '';
                                    }
                                }
                            }
                        },
                    }
                ]
            };
        bar_table.setOption(option);
    }

    api.get("stat/daily",{},function (data) {
        if(data.code == 0){
            var staus = data.data;
            $("#ing_num").html(staus.appointedMeetingNum);
            $("#free_num").html(staus.canceledMeetingNum);
            $("#today_num").html(staus.attendedNum);
            $("#total_num").html(staus.spareRoomNum);
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
            $("#bar_table").children().remove();
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
            api.get("meeting/companyMeetings",param,getTodayMeet.backObj);
        },
        backObj:function (data) {
            var tbody = $('#todayMeetTable tbody');
            var arr = data.data;
            if (arr.length == 0) {
                var tr = $('<tr><td colspan="5" style="text-align: center">今日没有会议，快去添加吧</td></tr>')
                tbody.append(tr);
            }else{
                for (var i = 0;i < arr.length;i++) {
                    var tr = $('<tr><td>'+ arr[i].subject +'</td><td>'+ arr[i].attendedNum +'</td><td>'+ arr[i].roomAddress +'</td><td>'+ arr[i].startedAt.split(" ")[1] +'-'+ arr[i].endedAt.split(" ")[1] +'</td><td>'+ arr[i].summary +'</td></tr>')
                    tbody.append(tr);
                }
            }
            if (arr.length > 6){
                $("#paginationFooter").show();
                $("#todayMeetTable").trigger("footable_initialize");
            }else{
                $("#paginationFooter").hide();
            }
        }
    }
    getTodayMeet.init();
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
            width: 300,
            height: 300,
            data: s,
            label: false,
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
                api.get("meeting/companyMeetings",param,selectedDay);
                //会议室使用率更新
                api.get("stat/dailyMeetingRoomUsage",{"day":getDate},function (data) {
                    var sta = data.data;
                    $("#bar_table").children().remove();
                    barTable(sta.horizontalRooms,sta.verticalPercentage);
                })
            }
        });
    }
    //处理选择日期后的当日会议数量
    function selectedDay (data) {
        var tbody = $('#tableTody');
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
        if (arr.length > 6){
            $("#paginationFooter").show();
            $("#todayMeetTable").trigger("footable_initialize");
        }else{
            $("#paginationFooter").hide();
        }
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

