/**
 * Created by root on 2017/4/11.
 */
//个人中心
api.userPost("user/me",{},myCompany);
var companyN = $("#company_name");
function myCompany (data) {
    var companysArr = data.data.user.companies;
    var user = data.data.user.user;
    if (companysArr.length > 1) {//如果公司只有一个，隐藏下拉按钮
        var li = '<li><a>'+ companysArr[0].companyName +'</a></li>';

        for (var i = 1;i < companysArr.length;i++){
            li += li;
        }
        var lis = $(li);
        var ul = $('<ul class="dropdown-menu hdropdown notification animated flipInX">'+  lis+'</ul>');
        companyN.after(ul);
    }
    companyN.html("公司：" + companysArr[0].companyName);
    $('#nick_name').html(user.nickname);
    $("#user_index_nickname").html(user.nickname);
    $("#avtar").attr("src",user.avatar);
}
//退出登录
$("#login_out_btn").on("click",function  () {
    api.userPost("auth/logout",{},function  () {
        window.location.href = "register.html?login";
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