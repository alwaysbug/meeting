/**
 * Created by root on 2017/3/28.
 */
//个人中心

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
    $('.companys').slideUp(tipsSlideSpeed);
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
        $(".tips").slideUp(200);
    })
})


//选择购买版本
$('.tTrightDiv').on('click',function(){
    //复原所有样式
    $('.tTrightDiv').css({
        'background-color':'white',
        'color':'black'
    });
    $('.imgs').css('display','none');
    //写入点击样式
    $(this).css({
        'background-color':'rgb(85,131,232)',
        'color':'white'
    });
    $(this).find('img').css('display','block');
    //选中的版本文档，并去掉“版”字
    var tex=$(this).find('span').html()
    var tex1=tex.replace(/版/g,'');
    //写入页面
    $('.tBright1').html(tex1);
    $('.bspan1').html(tex);
});

//选择年份
$('.cright1Span').on('click',function(){
    var year;//保存年数
    //还原字体颜色
    $('.cright1Span').css('color','rgb(85,131,232)');
    //选中字体颜色变白
    $(this).css('color','white');
    year=$(this).html().replace(/年/g,'');
    move();
    //移动动画方法
    function move() {
        $('.cright1Small').animate({
            "left":54*(year-1)+"px",
        },200);
    }
    //写入页面
    $('.bspan2').html(year);
});

//购买间数统计
//点击减号
$('.cright2down').on('click',function(){
    if ($('.cright2num').html()=='') {
        $('.cright2num').html('1');
    }
    if ($('.cright2num').html()%1==0) {
        if ($('.cright2num').html()>1) {
            $('.cright2num').html($('.cright2num').html()-1);
        }else{
            $('.cright2num').html('1');
        }
    }else{
        $('.cright2num').html('1');
    }
    //写入页面
    $('.bspan3').html($('.cright2num').html());
});
//点击加号
$('.cright2up').on('click',function(){
    if ($('.cright2num').html()=='') {
        $('.cright2num').html('1');
    }
    if ($('.cright2num').html()>=999) {
        $('.cright2num').html('998');
    }
    if ($('.cright2num').html()%1==0) {
        if ($('.cright2num').html()>=1) {
            $('.cright2num').html($('.cright2num').html()-0+1);
        }else{
            $('.cright2num').html('1');
        }
    }else{
        $('.cright2num').html('1');
    }
    //写入页面
    $('.bspan3').html($('.cright2num').html());
});
//手动输入改变
$('.cright2num').on('input',function(){
    if (($('.cright2num').html()=='') || ($('.cright2num').html()%1!=0)) {
        $('.cright2num').html('1');
    }
    if ($('.cright2num').html()>=999) {
        $('.cright2num').html('999');
    }
    if ($('.cright2num').html()<=0) {
        $('.cright2num').html('1');
    }
    //写入页面
    $('.bspan3').html($('.cright2num').html()-0);
});

//购买设备统计
//点击减号
$('.cright3down').on('click',function(){
    if ($('.cright3num').html()=='') {
        $('.cright3num').html('1');
    }
    if ($('.cright3num').html()%1==0) {
        if ($('.cright3num').html()>1) {
            $('.cright3num').html($('.cright3num').html()-1);
        }else{
            $('.cright3num').html('1');
        }
    }else{
        $('.cright3num').html('1');
    }
    //写入页面
    $('.bspan4').html($('.cright3num').html());
});
//点击加号
$('.cright3up').on('click',function(){
    if ($('.cright3num').html()=='') {
        $('.cright3num').html('1');
    }
    if ($('.cright3num').html()>=999) {
        $('.cright3num').html('998');
    }
    if ($('.cright3num').html()%1==0) {
        if ($('.cright3num').html()>=1) {
            $('.cright3num').html($('.cright3num').html()-0+1);
        }else{
            $('.cright3num').html('1');
        }
    }else{
        $('.cright3num').html('1');
    }
    //写入页面
    $('.bspan4').html($('.cright3num').html());
});
//手动输入改变
$('.cright3num').on('input',function(){
    if (($('.cright3num').html()=='') || ($('.cright3num').html()%1!=0)) {
        $('.cright3num').html('1');
    }
    if ($('.cright3num').html()>=999) {
        $('.cright3num').html('999');
    }
    if ($('.cright3num').html()<=0) {
        $('.cright3num').html('1');
    }
    //写入页面
    $('.bspan4').html($('.cright3num').html()-0);
});
//下一步
$('.button').on('click',function(){
    $('.wrap2').css('display','block');
    $('.wrap2').animate({'left':'0'},500);
    $('.wrap').css({'display':'none','left':'1200px'});
    
});




//第二个界面
//选择支付方式
$('.tTrightDivT').on('click',function(){
    //复原所有样式
    $('.tTrightDivT').css({
        'background-color':'white',
        'color':'black'
    });
    $('.imgs1').css('display','none');
    //写入点击样式
    $(this).css({
        'background-color':'rgb(85,131,232)',
        'color':'white'
    });
    $(this).find('img').css('display','block');
    //选中的支付方式
    var texT=$(this).find('span').html()
});
//重新选择
$('.span2T').on('click',function(){
    $('.wrap').css('display','block');
    $('.wrap').animate({'left':'0'},500);
    $('.wrap2').css({'left':'1250px','display':'none'});
});