import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import 'ScrollToPlugin'; 
import serviceManager from '../services/serviceManager';
import resizeService from '../services/resizeService';
import { u } from 'umbrellajs';

serviceManager.use(resizeService); 

export default {
    init: function(){
        var controller = new ScrollMagic.Controller();

        /* --- BANNER --- */
        var bannerVerticalOffset = window.innerHeight - (window.innerWidth*1068)/(1600) + window.innerHeight/8;
        bannerVerticalOffset = bannerVerticalOffset < 0 ? bannerVerticalOffset : 0;
        var bannerTimeline = new TimelineMax();
        bannerTimeline.add([
            TweenMax.fromTo("#banner-background-foreground", 1, {backgroundPosition: "center "+bannerVerticalOffset+"px"}, {backgroundPosition: "center "+(bannerVerticalOffset - 80)+"px", ease: Power0.easeNone}),
            TweenMax.fromTo("#banner-background-background", 1, {backgroundPosition: "center "+bannerVerticalOffset+"px"}, {backgroundPosition: "center "+(bannerVerticalOffset + 160)+"px", ease: Power0.easeNone}),
            TweenMax.fromTo("#nav", 1, {backgroundColor: "rgba(255,255,255,0)", boxShadow: "0px 0px 20px rgba(0,0,0,0)"}, {backgroundColor: "rgba(255,255,255,1)", boxShadow: "0px 0px 20px rgba(0,0,0,0.05)" , ease: Power0.easeNone})
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

        /* --- BLOG-- */
        var blogTimeline = new TimelineMax({paused: true});
        blogTimeline.add([
            TweenMax.fromTo("#blog", 0.25, {opacity: 0}, {opacity: 1, ease: Power1.easeOut}),
            TweenMax.fromTo("#blog .container", 0.5, {y: "100%"}, {y: "0%", ease: Expo.easeOut})
        ]);
        var blogReverseTimeline = new TimelineMax({paused: true, onComplete: function(){
            var blog = u('#blog').first(); 
            blog.style.display = "none";
            blog.style.position = null;
            blog.style.height = null;
            blog.style.overflow = null;
        }});
        blogReverseTimeline.add([
            TweenMax.fromTo("#blog", 0.25, {opacity: 1}, {opacity: 0, ease: Power1.easeOut}),
            TweenMax.fromTo("#blog .container", 0.5, {y: "0%"}, {y: "100%", ease: Power0.easeNone})
        ]);
        function scrollToHash(hash){
            TweenMax.to(window, 0.5, {scrollTo:Math.max(0, document.getElementById(hash.substring(3)+"-target").getBoundingClientRect().top - document.body.getBoundingClientRect().top - 150), ease: Power3.easeOut});
        }
        function openBlog(){
            var blog = u('#blog').first();
            if(blog.style.display != "block"){
                blogTimeline.play(0);
                blog.style.display = "block";
                u('#nav').addClass('blog');
                document.getElementById('home').style.overflow="hidden";
                document.getElementById('home').style.position="absolute";
                document.getElementById('home').style.height=window.innerHeight+"px";
                TweenMax.to(window, 0.25, {scrollTo:0, ease: Power3.easeOut});
            }
        }
        if(location.hash == "#!/blog") openBlog();
        u('.blog-toggle').on('click', openBlog);
        u('#nav a, .quickNav').on('click', function(e){
            if(e.target.hash != '#!/blog'){
                var blog = u('#blog').first();
                if(blog.style.display == "block"){
                    blog.style.position = "absolute";
                    blog.style.height = window.innerHeight+"px";
                    blog.style.overflow = "hidden";
                    blogReverseTimeline.play(0);
                    u('#nav').removeClass('blog');
                    document.getElementById('home').style.position="static";
                    document.getElementById('home').style.overflow="auto";
                    document.getElementById('home').style.height=null;
                }
                scrollToHash(this.hash);
            }
        });
        if(location.hash) scrollToHash(location.hash);
    }    
}