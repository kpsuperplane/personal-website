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


var cur = $('#home');
var neverScroll = true;
var scrollCnt = 0;
var hashes = ['#home', '#about', '#design', '#work', '#projects', '#contact', '#blog'];
if(hashes.indexOf(location.hash) > -1){
	cur = $(location.hash);
}
var curIndex = 0;
function renderPage(){
	$('section').removeClass('active').removeClass('beforeActive').removeClass('afterActive');
	cur.addClass('active');
	cur.prev('section').addClass('beforeActive');
	cur.next('section').addClass('afterActive');
	if($('#menu').hasClass('active')){
		$('#hamburger').trigger('click');
	}
	if(Modernizr.video && $(window).width() > 768){
		if(cur.is('#home')) $('#home-bg')[0].play();
		else $('#home-bg')[0].pause();
		if(cur.is('#design')) $('#phone-video')[0].play();
		else $('#phone-video')[0].pause();
	}
	curIndex = $('section').index(cur);
	$('#menu a.active').removeClass('active');
	$('#menu a[href="/#'+cur.attr('id')+'"]').addClass('active');
	if(cur.hasClass('white')){ $('#nav').addClass('white'); }
	else{ $('#nav').removeClass('white' ); }
	onResize();
}
var positions = [];
function onResize(){
	positions = [];
	$('section').each(function(){
		positions.push($(this).offset().top);
	});
	$('#responsive .vcenter').css('min-height', $('#phone').height());
	$('.vcenter').each(function(){
		var top = $(window).height()/2 - $(this).outerHeight()/2;
		top = top < 0 ? 0 : top;
		$(this).css('top', top);
	});
	if(Modernizr.video){
		var winHeight = $(window).height();
		var winWidth = $(window).width();
		if(winHeight/9*16 < winWidth){
			$('#home-bg').addClass('fullWidth');
		}else{
			$('#home-bg').removeClass('fullWidth');
		}
	}
	$('.full-height').each(function(){
		$(this).css('height', $(this).parent()[0].scrollHeight);
	});
	$('.contcenter').each(function(){
		var parent = $(this).is('[data-target]') ? $('#'+$(this).attr('data-target')) : $(this).parent();
		var top = parent.height()/2 - $(this).outerHeight()/2 + parseInt(parent.css('padding-top'),10);
		if($(this).is('[data-target]')) top += parent.position().top;
		top = top < 0 ? 0 : top;
		$(this).css('top', top);
	});
	if($(window).width() < 768){
		$('video').attr('preload', 'none');
	}else{
		$('video').attr('preload', 'auto');
	}
	var bottom = $(window).height() - $('#down-icon').position().top - $('#down-icon').outerHeight() - $('#home-image').height() - 70;
	bottom = bottom > 0 ? 0 : bottom;
	$('#home-image').css('bottom', bottom);
	onScroll();
}
function onScroll(){
	var top = $(window).scrollTop();
	var i = 0;
	for(; i < positions.length; i++){
		if(top < positions[i] - 50){
			break;
		}
	}
	i -= 1;
	if(curIndex != i || neverScroll){
		neverScroll = false;
		cur = $('section').eq(i);
		renderPage();
	}
	if (i == 0){
		$('#home-image').css('transform', 'translate3d(0,'+top/3+'px,0)')
	}
	if(scrollCnt > 10000){
		scrollCnt = 0;
	}
	scrollCnt++;
}
function checkResize(){
	onResize();
	setTimeout(checkResize, 2000);
}
$(window).resize(onResize).load(function(){
	checkResize();
    $('.loader').addClass('hide').hide();
    $('#loader-overlay').addClass('hide').delay(300).hide(1);
	$('body').removeClass('no-animate');
}).scroll(onScroll);
$(function(){
	new WOW().init();
	$('.quickNav').click(function(e){
		e.preventDefault();
		$('html,body').animate({scrollTop: $($(this).attr('href').substring(1)).offset().top}, 750, function(){
			onScroll();
		});
	});
	if(!Modernizr.video){
		$('video').remove();
	}
	onResize();
});

var mySite = angular.module('site', [], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

mySite.controller('workController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.images = [
        ['img/viamusica.jpg', 'http://viamusica.com', 'VIA MUSICA'],
        ['img/project5k.jpg', 'http://project5k.ca', 'PROJECT 5K'],
        ['img/yieldfunding.jpg', 'https://yieldfunding.com', 'YIELD FUNDING GROUP'],
        ['img/markvillehistory.jpg', 'http://markvillehistory.com', 'MARKVILLE HISTORY'],
        ['img/mgt.jpg', 'http://markham-getting-together.com/', 'MARKHAM GETTING TOGETHER']
    ];
}]);

mySite.controller('projectController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.images = [
        ['img/beintheloop.jpg', 'http://devpost.com/software/in-the-loop-real-time-news-aggregating-web-app', 'IN THE LOOP (HACK WESTERN)'],
        ['img/skyplay.jpg', 'http://skyplay.tech/', 'CLOUDTABLE (SHAD PROJECT)'],
        ['img/termsjs.jpg', 'http://kpsuperplane.github.io/Terms.JS/', 'TERMS.JS (KODING HACKATHON)'],
        ['img/smartmeds.jpg', 'http://devpost.com/software/smartmeds-djcg40', 'SMART MEDS (HACK THE NORTH)'],
        ['img/travllr.jpg', 'https://github.com/rwu1997/travllr.me', 'TRAVLLR (PENNAPPS)']
    ];
}]);
