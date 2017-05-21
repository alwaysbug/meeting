/**
 * Created by Administrator on 2017/1/17.
 */
var api = {
	host:"http://www.unitsyscloud.org/api/",
    post:function (url,param,backobj) {
        $.ajax({
            type:"post",//提交方式
            url:api.host + url,//路径
            data:param,
            dataType:"json",//返回的数据类型,
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    asyncPost:function (url,param,backobj) {
    	api.checkCookieOrSession();
        $.ajax({
            type:"post",//提交方式
            url:api.host + url,//路径
            data:param,
            async:false,
            dataType:"json",//返回的数据类型,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization",api.checkCookieOrSession());
            },
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    userPost:function (url,param,backobj) {
    	api.checkCookieOrSession();
        $.ajax({
            type:"post",//提交方式
            url:api.host + url,//路径
            data:param,
            dataType:"json",//返回的数据类型,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization",api.checkCookieOrSession());
            },
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    get:function(url,data,backobj){
    	api.checkCookieOrSession();
        $.ajax({
            type:"get",//提交方式
            url:api.host + url,//路径
            dataType:"json",//返回的数据类型
            data:data,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization",api.checkCookieOrSession());
            },
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    asyncGet:function(url,data,backobj){
    	api.checkCookieOrSession();
        $.ajax({
            type:"get",//提交方式
            url:api.host + url,//路径
            dataType:"json",//返回的数据类型
            data:data,
            async:false,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization",api.checkCookieOrSession());
            },
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    deleteIt:function(url,data,backobj){
    	api.checkCookieOrSession();
        $.ajax({
            type:"delete",//提交方式
            url:api.host + url,//路径
            data:data,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization",api.checkCookieOrSession());
            },
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    uploadFile:function(url,data,backobj){
    	api.checkCookieOrSession();
        $.ajax({
            type:"post",//提交方式
            url:api.host + url,//路径
            data:data,
            contentType: "application/form-data",
            processData: false,
            beforeSend: function(request) {
                request.setRequestHeader("Authorization",api.checkCookieOrSession());
            },
            success:function  (data) {
                //成功的回调函数
                backobj(data);
            }
        });
    },
    checkCookieOrSession:function ()
    {
        var token = sessionStorage.token;
        if (!token) {
        	window.location.href = "register.html?login";
        }else{
        	return token;
        }
    },
    getCookie:function (c_name) {
            if (document.cookie.length>0)
            {
                c_start=document.cookie.indexOf(c_name + "=")
                if (c_start!=-1)
                {
                    c_start=c_start + c_name.length+1
                    c_end=document.cookie.indexOf(";",c_start)
                    if (c_end==-1) c_end=document.cookie.length
                    return unescape(document.cookie.substring(c_start,c_end))
                }
            }
    },
    setCookie:function (c_name,value,expiredays) {
            var exdate=new Date()
            exdate.setDate(exdate.getDate()+expiredays)
            document.cookie=c_name+ "=" +escape(value)+
                ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    }
}