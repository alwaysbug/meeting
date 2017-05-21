/**
 * Created by root on 2017/4/11.
 */
//个人中心

api.get("user/me",{},myCompany);
var companyN = $("#company_name");
function myCompany (json) {
    var companysArr = json.data.companies;
    var user = json.data.user;
    if (companysArr.length > 1) {
        var li = '<li is-admin="'+ companysArr[0].roleId +'" company-id="'+ companysArr[0].companyId +'"><a>'+ companysArr[0].companyName +'</a></li>';

        for (var i = 1;i < companysArr.length;i++){
            var a = '<li is-admin="'+ companysArr[i].roleId +'" company-id="'+ companysArr[i].companyId +'"><a>'+ companysArr[i].companyName +'</a></li>';
            li += a;
        }
        var ul = $('<ul class="dropdown-menu hdropdown notification animated flipInX" id="companyUl">'+  li +'</ul>');
        companyN.after(ul);
        ul.children("li").bind("click",switchCompany);
    }
    companyN.html("公司：" + companysArr[0].companyName);
    if(companysArr[0].roleId != 1){
        toastrFail("您不是此企业管理员，无法管理该企业");
    }
    $('#nick_name').html(user.nickname);
    $("#user_index_nickname").html(user.nickname);
    $("#avtar").attr("src",user.avatar);
}

function switchCompany() {
    if($(this).attr("is-admin") != 1){
        toastrFail("您不是该企业的管理员，无法切换至该企业");
        return;
    }
    var companyId = $(this).attr("company-id");
    api.userPost("self/switchCompany",{"company_id":companyId},function (data) {
        if (data.code === 0){
            setTimeout(function () {
               window.location.reload();
            },100);
        }else{
            var text = data.message;
            toastrFail(text);
        }
    });
}

//退出登录
$("#login_out_btn").on("click",function  () {
    api.userPost("auth/logout",{},function  () {
        window.location.href = "register.html?login";
        sessionStorage.removeItem("token");
    })
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

//判断是否为IE8
function isIE8() {
    if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0"){
        return true;
    }else{
        return false;
    }
}