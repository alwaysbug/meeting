if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
	//ie浏览器
	//清空查找框内容
	$(".search").attr("placeholder","");
	//右侧滑出部分文字样式
	$(".slide_left_ul li").css({
		'float':'right',
        'textAlign':'right',
		'width':'100px'
	});
	//小白盒盖住默认的×
	$('.whiteBox').css({
		'width':'20px',
		'height':'30px',
		'backgroundColor':'white',
		'position':'absolute',
		'left':'248px',
		'top':'24px',
		'zIndex':'1'
	})
}


