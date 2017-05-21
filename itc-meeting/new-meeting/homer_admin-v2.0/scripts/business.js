/**
 * Created by root on 2017/3/28.
 */




var tipsSlideSpeed = 200;
var num_speed = 1.5;//控制数字跳动速度
//点击选择月份Ul
var monthBool=true;
$('#hour_time').on('click',function(){
    monthBool=!monthBool;
    if (monthBool) {
        $('#leftSpan1ul').slideUp(tipsSlideSpeed);
    } else{
        $("#leftSpan1ul").slideToggle(tipsSlideSpeed);
    }
});

//获取当前月份
var month = nowTimer();//当前月份
function nowTimer (){
    var time = new Date();
    var year = time.getFullYear();
    var mon = time.getMonth() + 1;
    if (mon >= 1 && mon <= 9) {
        mon = "0" + mon;
    }
    var month = year + '-' +mon;
    return month;
}
//将当前月份写入页面
$('#hour_time').html(month);

//选择月份
$('#leftSpan1ul li').on('click',function(){
    $('#hour_time').html($(this).html());
    month = $(this).html();
    //请求选中月份
    api.get("stat/dailyMeetingRoomUsage?date="+month,{},meetRoom);
    //隐藏Ul
    $('#leftSpan1ul').slideUp(tipsSlideSpeed);
    //重置bool值
    monthBool=true;
});


//请求后台数据
api.get("stat/monthly",{},showStat);
function showStat (data){
    //获取后台各项数据
    var registrationS = data.data.meetingDuration;
    var appliesS = data.data.attendedNum;
    var invitesS = data.data.appointedMeetingNum;
    var hoursS = data.data.canceledMeetingNum;
    //数据写入页面
    $('.leftSpan2').html(registrationS);
    $('.leftSpan3').html(appliesS);
    $('.leftSpan4').html(invitesS);
    $('.leftSpan5').html(hoursS);
//  new CountUp("meetHours", 0, registrationS, 1, num_speed).start();
//  new CountUp("meetAttends", 0, appliesS, 0, num_speed).start();
//  new CountUp("meetApp", 0, invitesS, 0, num_speed).start();
//  new CountUp("meetCancel", 0, hoursS, 0, num_speed).start();
}


//柱形图
api.get("stat/dailyMeetingRoomUsage?date="+month,{},meetRoom);
function meetRoom (data){
    //获取后台数据
    var data1 = data.data.horizontalRooms;
    var data2 = data.data.verticalPercentage;
    barTable(data1,data2);
}

//平滑曲线图
api.get("stat/monthlyMeetingAppointment",{},meetRooms);
function meetRooms (data){
    //获取后台数据
    var data1 = data.data.horizontalDays;
    var data2 = data.data.allAppointmentMeetingStat;
    var data3 = data.data.auditedMeetingStat;
    var data4 = data.data.canceledMeetingStat;
    roundTable(data1,data2,data3,data4);
}

//表格（柱状图）
function barTable (dataX,dataY) {
    var bar_table = echarts.init(document.getElementById('bar_table'));
    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            formatter: "{b}: {c}%",
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data:dataX,
            axisTick: {
                alignWithLabel:true
            }
        }],
        yAxis: [{
            type: 'value',
            min: 0,
            max: 300,
            axisLabel: {
                formatter: '{value}% '
            }
        }],
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 50
            },
            {
                type:"slider",
                show:true,
                start: 0,
                end: 50,
                bottom:"0px"
            }],
        series: [{
            name: '预定频率',
            type: 'bar',
            barWidth: '60%',
            data: dataY
        }]
    };
    bar_table.setOption(option);
}
//平滑曲线图
function roundTable(data1,data2,data3,data4) {
    var roundTable = echarts.init(document.getElementById('roundTable'));
    var option = {
        title: {
            text: '',
            left: '50%',
            textAlign: 'center'
        },
        tooltip: {
            trigger: 'asix',
            axisPointer: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            backgroundColor: 'rgba(255,255,255,1)',
            padding: [5, 10],
            textStyle: {
                color: '#7588E4',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        //		legend: {
        //			right: 20,
        //			orient: 'vertical',
        //			data: ['今日', '昨日']
        //		},
        xAxis: {
            type: 'category',
            data: data1,
            boundaryGap: false,
            splitLine: {
                show: true,
                interval: 'auto',
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#609ee9'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: ['#D4DFF5']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#609ee9'
                }
            },
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [{
            name: '会议预约',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: data2,
            itemStyle: {
                normal: {
                    color: '#f7b851'
                }
            },
            lineStyle: {
                normal: {
                    width: 1.5
                }
            }
        }, {
            name: '会议审核',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: data3,
            itemStyle: {
                normal: {
                    color: '#58c8da'
                }
            },
            lineStyle: {
                normal: {
                    width: 1.5
                }
            }
        },{
            name: '会议取消',
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 6,
            data: data4,
            itemStyle: {
                normal: {
                    color: 'rgb(225,0,0)'
                }
            },
            lineStyle: {
                normal: {
                    width: 1.5
                }
            }
        }]
    };
    roundTable.setOption(option);
}