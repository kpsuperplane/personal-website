(function(){var e;window.stopLoad=!0,e=function(){var e,t,o,a,i,n,r,s,c,l,d,u,g,m,p,h,f,v;u=!0,v=0,a=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},c=0,o=function(){var e,t,i;for(e=["Mixing awesomesauce","Generating experiences","Synchronizing passions","Revitalizing dreams","Building the unbuildable","Inspiring innovation","Flying to the moon","Spreading smiles","Filtering memes","Feeding puppies","Picking up Bobby Tables"],i=c;i===c;)i=a(0,e.length-1);c=i,$("#loader-old-message").remove(),t=$("<div />").text(e[i]).attr({"class":"loader-message",id:"loader-next-message"}).appendTo("#loader"),$("#loader-main-message").attr({id:"loader-old-message"}),setTimeout(function(){return t.attr({id:"loader-main-message"})},10),setTimeout(function(){u&&o()},1200)},setTimeout(function(){return u?o():void 0},400),p=function(e){null==e&&(e=!1),$("#pages").css({"min-height":$(window).height()}),v=$(window).height(),$("#pages>.page, .page-height").css({minHeight:v-$("#nav").outerHeight()-$("#spacer").outerHeight()}),$(".v-center-self").each(function(){var e;return e=$(this).parent().innerHeight()/2-$(this).outerHeight()/2,0>e&&(e=0),$(this).css({top:e})}),$(".v-center").each(function(){var e;return e=v/2-$(this).outerHeight()/2-42,0>e&&(e=0),$(this).css({top:e})}),e||(setTimeout(function(){return p(!0)},500),setTimeout(function(){return p(!0)},1e3))},e=[],h=[],t={home:window.home,blog:function(){return function(){}},portfolio:function(){return $("#portfolio-bottom a:first").trigger("click"),function(){}},about:function(){var e,t,o,a,i,n,r;return e=new ScrollMagic.Controller,$(window).width()>768&&(n=new TimelineMax,n.add([TweenMax.fromTo("#about-part-2-title",1,{x:"160px",opacity:0},{x:0,opacity:1,ease:Power2.easeOut}),TweenMax.fromTo("#about-part-2-image",1,{y:"190px",opacity:0},{y:0,opacity:1,ease:Power2.easeOut}),TweenMax.fromTo("#about-part-2-paragraph",1,{x:"260px",opacity:0},{x:0,opacity:1,ease:Power2.easeOut})]),r=new TimelineMax,r.add([TweenMax.fromTo("#about-title",1,{y:0},{y:100,ease:Power0.easeNone}),TweenMax.fromTo("#about-subtitle",1,{y:0},{y:150,ease:Power0.easeNone}),TweenMax.fromTo("#about-down-arrow",1,{y:0},{y:0,ease:Power0.easeNone}),TweenMax.fromTo("#about-part-1-parent",1,{opacity:1},{opacity:0,ease:Power0.easeNone})]),t=new ScrollMagic.Scene({duration:300,offset:0,triggerElement:"#about-part-2",reverse:!0}),t.setTween(n),o=new ScrollMagic.Scene({duration:600,offset:200,triggerElement:"#about-part-1",reverse:!0}),o.setTween(r),e.addScene(t).addScene(o)),a=new ScrollMagic.Scene({offset:0,triggerElement:"#about-part-3-main",reverse:!0}),i=new ScrollMagic.Scene({offset:0,triggerElement:"#about-steps",reverse:!0}),a.setClassToggle("#about","society"),i.setClassToggle("#about-steps","active"),e.addScene(a).addScene(i),h.push(e),function(){}}},$("#about-scroll-down-1").click(function(){return $("body").animate({scrollTop:v},750)}),f=function(){},d=function(o){var a,i,n,r,s,c,l,d;for(f(),$("#mobile-menu").hasClass("active")&&($("#hamburger").removeClass("active"),$("#mobile-menu").removeClass("active").delay(200).hide(1)),l=$("#pages>.page.active").removeClass("ready"),l.removeClass("active"),$("#nav a.active").removeClass("active"),n=0,s=e.length;s>n;n++)a=e[n],a.off(".controller");for(r=0,c=h.length;c>r;r++)i=h[r],i.destroy(!0);$("#nav a[href='/#!/"+o+"']").addClass("active"),$("#"+o).css({opacity:0}).show(),d=new TimelineMax,d.add([TweenMax.fromTo(l,.3,{y:"0%",opacity:1},{y:"-50px",opacity:0,ease:Power1.easeOut,onComplete:function(){l.hide()}}),TweenMax.fromTo($("#"+o),.3,{y:"50px",opacity:0},{y:"0%",opacity:1,ease:Power1.easeOut})]),d.play(),$(window).scrollTop(0),setTimeout(function(){return $("#"+o).addClass("active"),p(),$(window).trigger("scroll")},100),f=t[o](),p()},$(window).on("hashchange",function(){var e,o;return 0===document.location.hash.indexOf("#!/")&&document.location.hash.substring(3)in t||(document.location.hash="#!/home"),o=document.location.hash.substring(3),e=document.location.hash.substring(3),d(e)}),n=0;for(r=0,l=projectData.length;l>r;r++)m=projectData[r],$("#portfolio-content").prepend('<div class="slide" data-image="'+m.image+'" style="background-image:url(\'assets/img/sites/'+m.image+'\');"><div class="color-overlay" style="background: linear-gradient('+projectColors[n]+", "+projectColors[n+1]+');"></div><img class="overlay" src="assets/img/whiteoverlay.png"/><div class="v-center-self"><h1>'+m.name+"</h1><h2>"+m.subtitle+'</h2><a href="'+m.url+'" class="btn" target="_blank">SEE PROJECT</a></div></div>'),$("#portfolio-bottom").append('<a href="javascript:void(0);" data-image="'+m.image+'"><span></span></a>'),n++;return!isMobile.any&&Modernizr.webgl?$("#home-name-alt").hide():$("#home-name").hide(),$(window).load(function(){u=!1,$("#loader").addClass("loaded"),$("#pages").addClass("loaded"),setTimeout(function(){return $("#nav").addClass("loaded"),$("#loader").hide()},500),p(),"#!/contact"===document.location.hash&&($(".contact-link:first").trigger("click"),document.location.hash="#!/home"),$(window).trigger("hashchange")}).resize(p),$(".contact-link").click(function(e){var t;return e.preventDefault(),$("body").toggleClass("contact"),$("body").hasClass("contact")?(t=$("#contact").outerHeight(),$("#pages, #nav").css({transform:"translate3d(0,"+t+"px,0)"})):$("#pages, #nav").css({transform:"translate3d(0,0,0)"})}),g=null,$("#about-down-arrow").click(function(){return $("body").animate({scrollTop:$("#about-part-2").offset().top-$("#nav").outerHeight()-15},300)}),$("#portfolio-bottom a").click(function(){var e,t;return t=$("#portfolio .slide.active"),$("#portfolio .active").removeClass("active"),$(this).addClass("active"),e=$("#portfolio .slide[data-image='"+$(this).attr("data-image")+"']"),e.addClass("active"),TweenMax.fromTo(t,.3,{css:{y:0,opacity:1}},{css:{y:-50,opacity:0,ease:Power4.easeOut}}),TweenMax.fromTo(e,.3,{css:{y:50,opacity:0}},{css:{y:0,opacity:1,ease:Power4.easeOut}})}).mouseenter(function(){return g=$("<div />").css({"background-image":"url('/assets/img/screenshots/"+$(this).attr("data-image")+"')"}).addClass("portfolio-hover"),g.appendTo("body"),g.css({bottom:$(window).height()-$(this).offset().top+20,left:$(this).offset().left-g.outerWidth()/2+$(this).outerWidth()/2+7.5}),TweenMax.fromTo(g,.3,{css:{y:-10,opacity:0}},{css:{y:0,opacity:1}})}).mouseleave(function(){var e;return e=g,TweenMax.fromTo(e,.3,{css:{y:0,opacity:1}},{css:{y:-10,opacity:0},onComplete:function(){return e.remove()}})}),s=0,$("#portfolio .slide").bind("mousewheel DOMMouseScroll",function(e){var t;if(!($(window).width()<=768||(t=(new Date).getTime(),500>t-s)))return s=t,e.originalEvent.wheelDelta>0||e.originalEvent.detail<0?$("#portfolio-bottom a.active").prev().trigger("click"):$("#portfolio-bottom a.active").next().trigger("click")}),i=!1},$(e)}).call(this);