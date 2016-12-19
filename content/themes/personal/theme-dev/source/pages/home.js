import ScrollMagic from 'scrollmagic';
import 'animation.gsap'; 
var controller = new ScrollMagic.Controller();

/* --- BANNER --- */
var bannerVerticalOffset = window.innerHeight - (window.innerWidth*1068)/(1600) + window.innerHeight/8;
bannerVerticalOffset = bannerVerticalOffset < 0 ? bannerVerticalOffset : 0;
var bannerTimeline = new TimelineMax();
bannerTimeline.add([
    TweenMax.fromTo("#banner-background-foreground", 1, {backgroundPosition: "center "+bannerVerticalOffset+"px"}, {backgroundPosition: "center "+(bannerVerticalOffset - 80)+"px", ease: Power0.easeNone}),
    TweenMax.fromTo("#banner-background-background", 1, {backgroundPosition: "center "+bannerVerticalOffset+"px"}, {backgroundPosition: "center "+(bannerVerticalOffset + 160)+"px", ease: Power0.easeNone})
]) 
var bannerScene = new ScrollMagic.Scene({duration: '100%', offset:0, triggerHook: 0, triggerElement: '#banner-background', reverse: true})
bannerScene.setTween(bannerTimeline);
controller.addScene(bannerScene);

/* --- ABOUT-- */
var aboutTimeline = new TimelineMax();
aboutTimeline.add([
    TweenMax.fromTo("#about-iphone-container", 1, {x: "0%"}, {x: "-30%", ease: Power1.easeOut}),
    TweenMax.fromTo("#about-iphone-img-1", 1, {x: "0%"}, {x: "30%", ease: Power1.easeOut}),
    TweenMax.fromTo("#about-iphone-img-2", 1, {x: "0%"}, {x: "60%", ease: Power1.easeOut}),
    TweenMax.fromTo("#about-title", 1, {y: "50px", opacity: 0}, {y: "0%", opacity: 1,  ease: Power1.easeOut}),
    TweenMax.fromTo("#about-content", 1, {y: "150px", opacity: 0}, {y: "0%", opacity: 1, ease: Power1.easeOut})
]) 
var aboutScene = new ScrollMagic.Scene({duration: '90%', offset:0, triggerHook: 1, triggerElement: '#about', reverse: true})
aboutScene.setTween(aboutTimeline);
controller.addScene(aboutScene); 

SyntaxHighlighter.defaults['quick-code'] = false;
SyntaxHighlighter.all();