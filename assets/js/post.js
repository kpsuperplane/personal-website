var win = $(window);
win.scroll(function(){
	if(win.scrollTop() > 2){
		$('#nav').addClass('postDown');
	}else{
		$('#nav').removeClass('postDown');
	}
});
$(window).load(function(){
	$(window).trigger('scroll');
});
$(function(){
	$('body').removeClass('no-animate');
	$(window).trigger('scroll');
	$('#nav').addClass('no-shadow');
	$('iframe').wrap('<div class="video-wrapper"></div>');
});