import './style/style.scss';
import {u} from 'umbrellajs';
import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import home from './pages/home';


if(u('body').hasClass('home-template')) home.init(); //initialize home js on homepage
else{ //auto "shadowify" nav on non-homepages
    var controller = new ScrollMagic.Controller();

    var pageTimeline = new TimelineMax();
    pageTimeline.add([
        TweenMax.fromTo("#nav", 1, {backgroundColor: "rgba(255,255,255,0)", boxShadow: "0px 0px 20px rgba(0,0,0,0)"}, {backgroundColor: "rgba(255,255,255,1)", boxShadow: "0px 0px 20px rgba(0,0,0,0.05)" , ease: Power0.easeNone})
    ]) 
    var pageScene = new ScrollMagic.Scene({duration: window.innerHeight+'px', offset:0, triggerHook: 0, triggerElement: u('body').first(), reverse: true})
    pageScene.setTween(pageTimeline);
    controller.addScene(pageScene);
}

window.onload = function(){
    u('#nav').attr({class: 'loaded'});
}