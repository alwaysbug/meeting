$(".registerform").Validform({
			dragonfly:true,
			tipSweep:true,
			datatype:{
			"email":function(gets,obj,curform,regxp){
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				var reg1=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if(reg1.test(gets)){
					obj.css("border","1px solid #999999");
				}else{
					obj.css("border","1px solid #E6501E");
				}
			},
			"password":function(gets,obj,curform,regxp){
				var reg1=/^[a-zA-Z\d_]{8,}$/;
				if(reg1.test(gets)){
					obj.css("border","1px solid #999999");
				}else{
					obj.css("border","1px solid #E6501E");
				}
			},
			"phone":function(gets,obj,curform,regxp){
				var reg1=/^1(3|4|5|7|8)\d{9}$/;
				if(reg1.test(gets)){
					obj.css("border","1px solid #999999");
				}else{
					obj.css("border","1px solid #E6501E");
				}
			}
		},
	});
	function removeClass ($option) {//处理标题下的选项卡class名称
		if ($option.hasClass('person')) {
			$option.removeClass('person');
		}else if ($option.hasClass('company')) {
			$option.removeClass('company');
		}else if($option.hasClass('company')){
			$option.removeClass('company');
		}else if ($option.hasClass('account')) {
			$option.removeClass('account');
		}else if ($option.hasClass('scan')) {
			$option.removeClass('scan');
		}
	}
	
	var slideSpeed = 600;
	var $support = $('.support');//支持他们模块
	var $signIn_content = $('.signIn_content');//注册登录忘记密码模块
	var locationStaus = 0;//键盘按下时此时状态，0 注册  1 登录  2 忘记密码
	function toLogin() {
		locationStaus = 1;
		var $intro = $('<div class="intro"><p>芮廷自主研发基于SaaS架构模型的</p><p>云会务管理系统，</p><p>借助信息化手段和先进的管理理</p><p>念对企业的会前、会中、会后</p><p>整个会务流程进行规范化、实时化管理，</p><p>实现参会人员高效率地沟通，</p><p>提高企业资源利用率与员工的工作效率，</p><p>为大中型企业急需</p><p>解决的问题提供高效的云解决方案。</p></div><p>没有芮廷账号？<a href="javascript:;" class="register" onclick="toResigter()">注册</a></p>');
		$support.children().fadeOut();
		$support.children().remove();
		$intro.fadeIn();
		$support.append($intro);
		$support.animate({
			'left':[0, 'easeOutExpo']
		});
		$signIn_content.animate({
			"left":[327, 'easeOutExpo'],
			"height":[589, 'easeOutExpo']
		},slideSpeed);
		var $option1 = $('.option').eq(0),
			$option2 = $('.option').eq(1);
		removeClass($option1);
		removeClass($option2);
		$option1.addClass('account');//账号
		$option2.addClass('scan');//扫码
		$option1.html("账号");
//		$option2.html("扫码");

		
		$('.register_hide_li').slideUp(slideSpeed,"easeOutExpo",function  () {
			$(this).remove();
		});
		$('.register_phone_input').next().remove();
		$('.register_phone_input').removeClass('register_phone_input').addClass('login_phone_input').attr('placeholder',"").attr("tabindex","1");
		$('.register_password_input').removeClass('register_password_input').addClass('login_password_input').attr('placeholder',"").attr("tabindex","2");
		$('.login_password_input').attr('placeholder',"");
		if(localStorage.mobile){
            $('.login_phone_input').val(localStorage.mobile);
		}
		var $login_content = $('<li class="login_btn_li"><button class="login_btn" type="button">登录</button><p class="login_control"><input type="checkbox"/>&nbsp;&nbsp;记住账号</li>');
		$('.uls').append($login_content);
		$login_content.slideDown(slideSpeed);
		$('.register_password').children('h4').html('密码：<a class="forget_pw" href="javascript:;" onclick="forgetPw()">忘记密码</a>');
		$('.h1').html("登录企业账号");
	}
	function toResigter () {
        locationStaus = 0;
        // stroge.setItem("locationStaus",0);
		var $intro = $('<h3>芮廷支持他们</h3><div class="logos"><img src="images/support_it.png"/></div><p>已有芮廷账号？<a href="javascript:;" class="login" onclick="toLogin()">登录</a></p>');
		$support.children().fadeOut();
		$support.children().remove();
		$intro.fadeIn();
		$support.append($intro);
		$support.animate({
			'left':[510, 'easeOutExpo']
		});
		var $li_phone_before = $('<li class="register_company_name register_hide_li"><h4>企业名称：</h4><input type="text" class="company_name" placeholder="请填写企业名称" /></li><li class="register_name register_hide_li"><h4>姓名：</h4><input type="text" class="nick_name" placeholder="请填写真实姓名" /></li><li class="register_email register_hide_li"><h4>邮箱：</h4><input datatype="email" class="_email"  type="text" placeholder="用于登录和密码找回，请填写真实邮箱" /></li>')
		var $li_phone_after = $('<li class="register_message register_hide_li"><h4>短信验证码：</h4><input type="text" class="message_code" placeholder="请填写6位短信验证码" /></li>')
		$('.login_btn_li').slideUp(slideSpeed,"easeOutExpo",function () {
			$(this).remove();
		})
		$('.register_phone_num').after($li_phone_before);
		$('.register_phone_num').after($li_phone_after);
		$(".login_password_input").removeClass("login_password_input").addClass("register_password_input");
		$li_phone_before.slideDown(slideSpeed);
		$li_phone_after.slideDown(slideSpeed);
		
		
		$signIn_content.animate({
			"left":"60px",
			"height":"890px"
		});
		$('.login_phone_input').removeClass('login_phone_input').addClass('register_phone_input')
		var $idfyCode = $('<button class="idfy_code" type="button">获取验证码</button>')
		$('.register_phone_input').after($idfyCode);
		$('.register_phone_input').attr("placeholder","仅用于必要时与你联系").removeAttr("tabindex");
		$('.register_password').children('h4').html('密码：');
		var $option1 = $('.option').eq(0),
			$option2 = $('.option').eq(1);
		removeClass($option1);
		$option1.addClass('company').html("企业");
		var $register_btn = $('<li class="register_btn_li register_hide_li"><button class="register_btn" type="button">注册</button><p class="agree_protocol">注册账号，代表你同意《<a href="agreement.html">Ruiting服务协议</a>》</p></li>')
		$('.register_password input').attr("placeholder","不少于6位，区分大小写").removeAttr("tabindex");
		$('.register_password').after($register_btn);
		$('.h1').html("注册企业账号");
	}
	var boolObj = {
		forget_bool:false
	}
	function forgetPw() {
        locationStaus = 2;
        // stroge.setItem("locationStaus",2);
		boolObj.forget_bool = true;
		$('.h2').removeClass('h2').addClass('h3');
		$('.options').slideUp();
		$('.register_phone_num').slideUp();
		$('.register_password').slideUp();
		$('.register_phone_num input').after('');
		var $phone = $('<li class="forget_phone_num"><h4>手机号码：</h4><input datatype="phone" class="forget_phone_input" type="text" tabindex="1"/><button class="forget_idfy_code" type="button">获取验证码</button></li><li><h4>验证码：</h4><input class="forget_idfy_code_num" type="text" tabindex="2"/></li>')
		$('.login_btn').removeClass("login_btn").addClass("forget_pw_btn").html("下一步");
		$('.forget_pw_btn').attr('type','button');
		$('.forget_pw_btn').before($phone);
		$('.login_control').slideUp();
		if (boolObj.forget_bool) {
			$('.intro').next().remove();
			$('.intro').after('<p>没有芮廷账号？<a href="javascript:;" class="register" onclick="window.location.href=\'register.html\'">注册</a></p>')
		}
		$(".h1").html("忘记密码");
	}
	
	var forget_phoneNum = null;
	var forget_phoneCode = null;
	//下一步
	$('.uls').on('click',".forget_pw_btn",function  () {
		forget_phoneNum = $('.forget_phone_input').val();
		forget_phoneCode = $('.forget_idfy_code_num').val();
		var param = {
			"mobile":forget_phoneNum,
			"code":forget_phoneCode
		}
		api.post("sms/verifyCode",param,idfyTheCode);
	});
	function idfyTheCode (data) {
		if (data.code != 0) {
			showTheWarning(0,data);
		}else{
            locationStaus = 3;
			$(".h1").html("重新设置密码");
			$('.forget_phone_num').slideUp(slideSpeed,"easeOutExpo");
			$('.forget_phone_num').next().slideUp(slideSpeed,"easeOutExpo");
			$('.forget_pw_btn').before('<li class="new_password"><h4>密码：</h4><input datatype="password" class="new_password_input" type="password" placeholder="不少于6位，区分大小写" /></li>');
			$('.forget_pw_btn').removeClass("forget_pw_btn").addClass("new_password_btn").html("确定");
		}
	}
	//忘记密码手机验证码
	$('.uls').on('click',".forget_idfy_code",function  () {
		var param = {
			"mobile":$('.forget_phone_input').val(),
			"template":"forgetPass"
		}
		api.post("sms/send",param,getIdfyCode);
	});
	function getIdfyCode (data) {
		
		var idfy = $('.forget_idfy_code');
		if (data.code == 0) {
				showTheWarning(1,data);
				//60s过后按钮恢复点击获取验证码
				var ss = 60;
				idfy.html("重新发送" + "(" + ss + "s)");
				var timer = setInterval(function  () {
					ss--;
					if (ss == 0) {
						clearInterval(timer);
					}
					idfy.html("重新发送" + "(" + ss + "s)");
				},1000);
				idfy.css('backgroundColor',"#D2D2D2");
				idfy.attr("disabled",'disabled');
				setTimeout(function  () {
					idfy.html("获取验证码");
					idfy.removeAttr('disabled');
				},60000);
		}else{
			showTheWarning(0,data);
		}
	}
	//重设密码
	$('.uls').on('click',".new_password_btn",function  () {
		var param = {
			"mobile":forget_phoneNum,
			"password":$('.new_password_input').val(),
			"code":forget_phoneCode
		}
		api.post("auth/forgetPassword",param,changePassword);
	});

	function changePassword (data) {
		
		if (data.code == 0) {
			showTheWarning(1,data);
			setTimeout(function  () {
				window.location.href = "register.html?login";
			},3000);
		}else{
			showTheWarning(0,data);
		}
	}

	//键盘事件
$(document).keyup(function (event) {
    if (event.keyCode == 13 || event.keyCode == 108){//键盘事件回车注册
		if(locationStaus == 0){
			//注册
            var param = {
                "company_name":$('.company_name').val(),
                "nickname":$('.nick_name').val(),
                "mobile":$('.register_phone_input').val(),
                "email":$('._email').val(),
                "password":$('.register_password_input').val(),
                "code":$('.message_code').val()
            };
            api.post("company/apply",param,dealTheData);
		}else if(locationStaus == 1){
			//登录
            var param = {
                "mobile":$('.login_phone_input').val(),
                "password":$('.login_password_input').val(),
                "source":"web"
            }
            api.post("auth/login",param,loginBack);
		}else if(locationStaus == 2){
			//忘记密码下一步
           	var  forget_phoneNum = $('.forget_phone_input').val();
            var  forget_phoneCode = $('.forget_idfy_code_num').val();
            var param = {
                "mobile":forget_phoneNum,
                "code":forget_phoneCode
            }
            api.post("sms/verifyCode",param,idfyTheCode);
		}else if(locationStaus == 3){
			//重置密码
            var param = {
                "mobile":forget_phoneNum,
                "password":$('.new_password_input').val(),
                "code":forget_phoneCode
            }
            api.post("auth/forgetPassword",param,changePassword);
		}
    }
})


//注册
$('.uls').on('click',".register_btn",function  () {
    var param = {
        "company_name":$('.company_name').val(),
        "nickname":$('.nick_name').val(),
        "mobile":$('.register_phone_input').val(),
        "email":$('._email').val(),
        "password":$('.register_password_input').val(),
        "code":$('.message_code').val()
    };
    api.post("company/apply",param,dealTheData);
});

//注册获取验证码

$('.uls').on('click','.idfy_code',function  () {
    var param = {
        "mobile":$('.register_phone_input').val(),
        "template":"company_apply"
    };
    api.post("sms/send",param,sendTheCode);
})

var $warn = $('.warn');
var $warn_img = $('.warn_img');
var $warn_p = $('.warn_tips');
function sendTheCode (json) {
    var $idfy = $('.uls').find('.idfy_code');
    var jsonData = json;
    if (jsonData.code == 0) {

        //60s过后按钮恢复点击获取验证码
        var ss = 60;
        $idfy.html("重新发送" + "(" + ss + "s)");
        var timer = setInterval(function  () {
            ss--;
            if (ss == 0) {
                clearInterval(timer);
            }
            $idfy.html("重新发送" + "(" + ss + "s)");
        },1000);
        $idfy.addClass('again_send');
        $idfy.attr("disabled",'disabled');
        setTimeout(function  () {
            $idfy.removeClass('again_send');
            $idfy.html("获取验证码");
            $idfy.removeAttr('disabled');
        },60000);
    }else if(jsonData.code == 10001 || jsonData.code == -1){
        showTheWarning(0,jsonData);
    }
}

function showTheWarning(code,data) {//0为错误  1为正确 2为警告
    $warn.slideDown();
    switch (code){
        case 0:
            $warn_img.attr("src","images/wrong_tips.png");
            $warn_p.html(data.message || data.msg);
            break;
        case 1:
            $warn_img.attr("src","images/right_tips.png");
            $warn_p.html(data.message);
            break;
        case 2:
            $warn_img.attr("src","images/warning.png");
            $warn_p.html(data.message);
            break;
        default:
            break;
    }
    setTimeout(function  () {
        $warn.slideUp();
    },1000);
}

function dealTheData (data) {
    if (data.code == 0) {
        showTheWarning(1,data);
        setTimeout(function  () {
            toLogin();
        },3000);
    }else{
        showTheWarning(0,data);
    }
}
//登录
$('.uls').on('click',".login_btn",function  () {
    var param = {
        "mobile":$('.login_phone_input').val(),
        "password":$('.login_password_input').val(),
        "source":"web"
    }
    api.post("auth/login",param,loginBack);
});

//是否记住账号
var loginRember = false;
$(document).on("click",".login_control input[type=checkbox]",function () {
    loginRember = $(this).prop("checked");
})

function loginBack (data) {
    if (data.code == -1) {

        showTheWarning(0,data);
    }else{

        $warn.slideDown();
        $warn_img.attr("src","images/right_tips.png");
        $warn_p.html("登录成功");

        if (loginRember) {
			localStorage.mobile = $('.login_phone_input').val();
        }
        sessionStorage.token ="Bearer " + data.data;
        setTimeout(function  () {
            $warn.slideUp();
            window.location.href = "first_page.html";
        },1000);
    }
}

