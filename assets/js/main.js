/*
---HELLO THERE CURIOUS DEVELOPER---

I am enlightened to see that you have stumbled upon my 
unminified javascript kingdom. I have to admit that 
my file lacks the usual snakes, dungeous, and dragons
one would usually find within a kingdom, but I 
nonethless encourage you to explore and take what you
wish. Credit (although appreciated) is not necessary. 

Let us all spread the love! 

P.S. See if you can find my LESS source files!

*/
$(function(){
	$('#hamburger').click(function(){
		$(this).toggleClass('active');	
		if($(this).hasClass('active')){
			$('#menu').show();
			setTimeout(function(){
				$('#menu').addClass('active');
			},20);
		}else{
			$('#menu').removeClass('active').delay(200).hide(1);
		}
	});
});