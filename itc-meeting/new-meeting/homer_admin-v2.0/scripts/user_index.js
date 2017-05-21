/**
 * Created by root on 2017/4/11.
 */
//修改密码
$(".edit_password").on("click",function () {
    var param = {
        "old_password":$(".oldpassword").val(),
        "new_password":$(".newpassword").val()
    }
    api.userPost("user/password",param,function  (data) {
        var text = data.message;
        if (data.code == 0){
            toastrSucceed(text);
        }else{
            toastrFail(text);
        }

    })
});