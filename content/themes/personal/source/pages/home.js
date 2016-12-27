import ScrollMagic from 'scrollmagic';
import 'animation.gsap';
import 'ScrollToPlugin'; 
import serviceManager from '../services/serviceManager';
import resizeService from '../services/resizeService';
import { u } from 'umbrellajs';

const resizeServiceInstance = serviceManager.use(resizeService); 

function isMobile() { //credit to http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

export default {
    init: function(){
        var controller = new ScrollMagic.Controller();

        /* --- BANNER --- */
        var bannerTimeline = new TimelineMax();
        var bannerScene = new ScrollMagic.Scene({duration: '100%', offset:0, triggerHook: 0, triggerElement: '#banner-background', reverse: true});
        bannerScene.setTween(bannerTimeline);
        controller.addScene(bannerScene);

        resizeServiceInstance.addListener("banner", function(){
            var bannerVerticalOffset = window.innerHeight - (window.innerWidth*1068)/(1600) + window.innerHeight/8;
            bannerVerticalOffset = bannerVerticalOffset < 0 ? bannerVerticalOffset : 0;
            bannerTimeline.clear();
            if(isMobile()) return; //ignore mobile browsers
            bannerTimeline.add([
                TweenMax.fromTo("#banner-background-foreground", 1, {backgroundPosition: "center "+bannerVerticalOffset+"px"}, {backgroundPosition: "center "+(bannerVerticalOffset - 80)+"px", ease: Power0.easeNone}),
                TweenMax.fromTo("#banner-background-background", 1, {backgroundPosition: "center "+bannerVerticalOffset+"px"}, {backgroundPosition: "center "+(bannerVerticalOffset + 160)+"px", ease: Power0.easeNone}),
                TweenMax.fromTo("#nav", 1, {backgroundColor: "rgba(255,255,255,0)", boxShadow: "0px 0px 20px rgba(0,0,0,0)"}, {backgroundColor: "rgba(255,255,255,1)", boxShadow: "0px 0px 20px rgba(0,0,0,0.05)" , ease: Power0.easeNone})
            ]);
        });

        /* --- ABOUT-- */
        var aboutTimeline = new TimelineMax();
        var aboutScene = new ScrollMagic.Scene({duration: '90%', offset:0, triggerHook: 1, triggerElement: '#about', reverse: true})
        aboutScene.setTween(aboutTimeline);
        controller.addScene(aboutScene); 
        resizeServiceInstance.addListener("about", function(){
            aboutTimeline.clear();
            if(isMobile()) return; //ignore mobile browsers
            aboutTimeline.add([
                TweenMax.fromTo("#about-iphone-container", 1, {x: "0%"}, {x: "-30%", ease: Power1.easeOut}),
                TweenMax.fromTo("#about-iphone-img-1", 1, {x: "0%"}, {x: "30%", ease: Power1.easeOut}),
                TweenMax.fromTo("#about-iphone-img-2", 1, {x: "0%"}, {x: "60%", ease: Power1.easeOut}),
                TweenMax.fromTo("#about-title", 1, {y: "50px", opacity: 0}, {y: "0%", opacity: 1,  ease: Power1.easeOut}),
                TweenMax.fromTo("#about-content", 1, {y: "150px", opacity: 0}, {y: "0%", opacity: 1, ease: Power1.easeOut})
            ]);
        });

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