import {u} from 'umbrellajs';
import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
export default class navigationService{
    init(){
        var isHome = u('body').hasClass('home-template');
        //auto "shadowify" nav on non-homepages
        var controller = new ScrollMagic.Controller();

        var pageTimeline = new TimelineMax();
        pageTimeline.add([
            isHome ? TweenMax.fromTo("#nav", 1, {boxShadow: "0px 0px 20px rgba(0,0,0,0)", background: "rgba(255,255,255,0)"}, {boxShadow: "0px 0px 20px rgba(0,0,0,0.05)", background: "rgba(255,255,255,1)" , ease: Power0.easeNone}) : TweenMax.fromTo("#nav", 1, {boxShadow: "0px 0px 20px rgba(0,0,0,0)"}, {boxShadow: "0px 0px 20px rgba(0,0,0,0.05)" , ease: Power0.easeNone})
        ]);
        var pageScene = new ScrollMagic.Scene({duration: isHome ? window.innerHeight + "px" : '50px', offset:0, triggerHook: 0, triggerElement: u('body').first(), reverse: true})
        pageScene.setTween(pageTimeline);
        controller.addScene(pageScene);


        var lastScrollTop = 0, scrollHidden = false;

        u('#hamburger').on('click', function() {
            u(this).toggleClass('active');
            if (u(this).hasClass('active')) {
                u('#mobile-menu').first().style.display="block";
                setTimeout(function() {
                    u('#mobile-menu').addClass('active');
                }, 20);
            } else {
                u('#mobile-menu').removeClass('active');
                setTimeout(function(){
                    u('#mobile-menu').first().style.display="none";
                }, 200);
            }
        });

        u('#mobile-menu a').on('click', function() {
            u('#hamburger').removeClass('active');
            u('#mobile-menu').removeClass('active');
            setTimeout(function(){
                u('#mobile-menu').first().style.display="none";
            }, 200);
        });

        function scroll() {
            var st = - document.body.getBoundingClientRect().top;
            if(st < 0) return; //ignore < 0 values
            if (st > lastScrollTop) {
                if (!scrollHidden) {
                    u('#nav').addClass('scroll-hidden');
                    scrollHidden = true;
                }
            } else {
                if (scrollHidden) {
                    u('#nav').removeClass('scroll-hidden');
                    scrollHidden = false;
                }
            }
            lastScrollTop = st;
        };

        window.addEventListener('scroll', scroll);
    }
}