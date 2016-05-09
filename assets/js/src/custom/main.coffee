window.stopLoad = true;
home = -> 
    loading = true
    winHeight = 0

    #random number generator
    getRandomInt = (min, max) ->
        Math.floor(Math.random() * (max - min + 1)) + min;

    # -- Loading Animation -- #
    lastLoad = 0

    doLoad = -> 
        messages = ['Mixing awesomesauce', 'Generating experiences', 'Synchronizing passions', 'Revitalizing dreams', 'Building the unbuildable', 'Inspiring innovation', 'Flying to the moon', 'Spreading smiles', 'Filtering memes', 'Feeding puppies', 'Picking up Bobby Tables']
        
        #generate a unique random number
        rand = lastLoad
        while rand == lastLoad
            rand = getRandomInt(0, messages.length-1)
        lastLoad = rand
        
        $('#loader-old-message').remove()
        nextMessage = $('<div />').text(messages[rand]).attr(class: 'loader-message', id: 'loader-next-message').appendTo('#loader')
        $('#loader-main-message').attr(id: 'loader-old-message')
        
        #allow dom to update so animation can proceed
        setTimeout( ->
            nextMessage.attr(id: 'loader-main-message')
        , 10)
        
        #Rerun every 1.2s
        setTimeout( -> 
            if loading then doLoad()
            return
        , 1200)
        return

    setTimeout( ->
        if loading then doLoad() 
    , 400)

    resize = (resized = false) ->
        $('#pages').css('min-height': $(window).height())
        winHeight = $(window).height()
        $('#pages>.page, .page-height').css(minHeight: winHeight-$('#nav').outerHeight()-$('#spacer').outerHeight())
        $('.v-center-self').each ->
            top = ($(this).parent().innerHeight() / 2 - $(this).outerHeight() / 2)
            if top < 0 then top = 0
            $(this).css(top: top)
        $('.v-center').each ->
            top = (winHeight / 2 - $(this).outerHeight() / 2 - 42)
            if top < 0 then top = 0
            $(this).css(top: top)
        if(!resized)
            setTimeout(->
                resize(true)
            , 500)
            setTimeout(->
                resize(true)
            , 1000)
        return
        
    binds = []
    scrollControllers = []

    controllers = 
        home: window.home
        blog: ->
            return ->
        portfolio: ->
            $('#portfolio-bottom a:first').trigger('click')
            return ->
        about: -> 
            controller = new ScrollMagic.Controller()
            if $(window).width() > 768 
                timeline1 = new TimelineMax();
                timeline1.add([
                    TweenMax.fromTo("#about-part-2-title", 1, {x: "160px", opacity: 0}, {x: 0, opacity: 1, ease: Power2.easeOut}),
                    TweenMax.fromTo("#about-part-2-image", 1, {y: "190px", opacity: 0}, {y: 0, opacity: 1, ease: Power2.easeOut}), 
                    TweenMax.fromTo("#about-part-2-paragraph", 1, {x: "260px", opacity: 0}, {x: 0, opacity: 1, ease: Power2.easeOut})
                ])
                timeline2 = new TimelineMax();
                timeline2.add([
                    TweenMax.fromTo("#about-title", 1, {y: 0}, {y: 100, ease: Power0.easeNone}),
                    TweenMax.fromTo("#about-subtitle", 1, {y: 0}, {y: 150, ease: Power0.easeNone}),
                    TweenMax.fromTo("#about-down-arrow", 1, {y: 0}, {y: 0, ease: Power0.easeNone}),
                    TweenMax.fromTo("#about-part-1-parent", 1, {opacity: 1}, {opacity: 0, ease: Power0.easeNone}) 
                ])
                scene1 = new ScrollMagic.Scene(duration: 300, offset:0, triggerElement: '#about-part-2', reverse: true)
                scene1.setTween(timeline1)
                scene2 = new ScrollMagic.Scene(duration: 600, offset:200, triggerElement: '#about-part-1', reverse: true)
                scene2.setTween(timeline2)
                controller.addScene(scene1).addScene(scene2)
            scene3 = new ScrollMagic.Scene(offset:0, triggerElement: '#about-part-3-main', reverse: true)
            scene4 = new ScrollMagic.Scene(offset:0, triggerElement: '#about-steps', reverse: true)
            scene3.setClassToggle("#about", "society")
            scene4.setClassToggle("#about-steps", "active")
            controller.addScene(scene3).addScene(scene4)
            scrollControllers.push(controller)
            return ->
            
    $('#about-scroll-down-1').click ->
        $('body').animate({scrollTop: winHeight}, 750) 
        
    term = ->
    loadPage = (page) ->
        term()
        if $('#mobile-menu').hasClass('active')
            $('#hamburger').removeClass('active')
            $('#mobile-menu').removeClass('active').delay(200).hide(1);
        oldPage = $('#pages>.page.active').removeClass('ready')
        oldPage.removeClass('active')#.css(maxHeight: $(window).height()-$('#pages').offset().top-$('#spacer').outerHeight(), overflow: 'hidden')
        $('#nav a.active').removeClass('active')
        bind.off('.controller') for bind in binds
        controller.destroy(true) for controller in scrollControllers
        $("#nav a[href=\'/#!/"+page+"\']").addClass('active')
        $('#'+page).css(opacity: 0).show()
        tl = new TimelineMax();
        tl.add([
            TweenMax.fromTo(oldPage, 0.3, {y: '0%', opacity: 1}, {y: '-50px', opacity: 0, ease: Power1.easeOut, onComplete: -> 
                oldPage.hide()
                return
            }),
            TweenMax.fromTo($('#'+page), 0.3, {y: '50px', opacity: 0}, {y: '0%', opacity: 1, ease: Power1.easeOut})
        ])
        tl.play()
        $(window).scrollTop(0)
        setTimeout( ->
            $('#'+page).addClass('active')#.css(maxHeight: 'none', overflow: 'auto')
            resize()
            $(window).trigger('scroll')
        , 100)
        term = controllers[page]()
        resize()
        return

    $(window).on( "hashchange", ->
        if document.location.hash.indexOf("#!/") != 0 or document.location.hash.substring(3) not of controllers then document.location.hash="#!/home"
        tmpHash = document.location.hash.substring(3)
        hash = document.location.hash.substring(3)
        loadPage(hash)
    )

    i = 0
    for project in projectData
        $('#portfolio-content').prepend('<div class="slide" data-image="'+project.image+'" style="background-image:url(\'assets/img/sites/'+project.image+'\');"><div class="color-overlay" style="background: linear-gradient('+projectColors[i]+', '+projectColors[i+1]+');"></div><img class="overlay" src="assets/img/whiteoverlay.png"/><div class="v-center-self"><h1>'+project.name+'</h1><h2>'+project.subtitle+'</h2><a href="'+project.url+'" class="btn" target="_blank">SEE PROJECT</a></div></div>')
        $('#portfolio-bottom').append('<a href="javascript:void(0);" data-image="'+project.image+'"><span></span></a>');
        i++
        
    if !isMobile.any && Modernizr.webgl 
        $('#home-name-alt').hide()
    else
        $('#home-name').hide()
        
    $(window).load ->
        loading = false;
        $('#loader').addClass('loaded')
        $('#pages').addClass('loaded')
        setTimeout( ->
            $('#nav').addClass('loaded')
            $('#loader').hide()
        , 500)
        resize()
        if document.location.hash == "#!/contact" 
            $('.contact-link:first').trigger('click')
            document.location.hash = "#!/home"
        $(window).trigger("hashchange")
        return
    .resize(resize)

    $('.contact-link').click (e)->
        e.preventDefault()
        $('body').toggleClass('contact') 
        if $('body').hasClass('contact')
            top = $('#contact').outerHeight()
            $('#pages, #nav').css(transform:'translate3d(0,'+top+'px,0)')
        else
            $('#pages, #nav').css(transform:'translate3d(0,0,0)')

    portfolioHover = null

    $('#about-down-arrow').click ->
        $('body').animate({scrollTop: $('#about-part-2').offset().top - $('#nav').outerHeight() - 15}, 300)

    $('#portfolio-bottom a').click ->
        old = $('#portfolio .slide.active')
        $('#portfolio .active').removeClass('active')
        $(this).addClass('active')
        active = $('#portfolio .slide[data-image=\''+$(this).attr('data-image')+'\']')
        active.addClass('active')
        TweenMax.fromTo(old, 0.3, {css: {y:0, opacity: 1}}, {css:{y:-50, opacity:0, ease: Power4.easeOut}}) 
        TweenMax.fromTo(active, 0.3, {css: {y:50, opacity:0}}, {css:{y:0, opacity:1, ease: Power4.easeOut}}) 
    .mouseenter ->
        portfolioHover = $('<div />').css('background-image':'url(\'/assets/img/screenshots/'+$(this).attr('data-image')+'\')').addClass('portfolio-hover')
        portfolioHover.appendTo('body')
        portfolioHover.css(bottom: ($(window).height()-$(this).offset().top) + 20, left: $(this).offset().left - portfolioHover.outerWidth() / 2 + $(this).outerWidth() / 2 + 7.5)
        TweenMax.fromTo(portfolioHover, 0.3, {css: {y:-10, opacity:0}}, {css:{y:0, opacity:1}}) 
    .mouseleave -> 
        tmpHover = portfolioHover
        TweenMax.fromTo(tmpHover, 0.3, {css: {y:0, opacity:1}}, {css:{y:-10, opacity:0}, onComplete: ->
            tmpHover.remove()
        })
        
        
    lastAnim = 0; 

    $('#portfolio .slide').bind('mousewheel DOMMouseScroll', (event) -> 
        if $(window).width() <= 768
             return #ignore mobile
        now = (new Date()).getTime()
        
        if (now - lastAnim) < 500 
            return
        
        lastAnim = now

        if event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0 
            $('#portfolio-bottom a.active').prev().trigger('click')
        else
            $('#portfolio-bottom a.active').next().trigger('click')
            
    )

    haikuMode = false

    ###
    $('#footer a').click( -> 
        haikuMode = !haikuMode
        $.each(content, (key, section) ->
            $.each(section, (elem, value) -> 
                $('#'+elem).html(value[if haikuMode then 1 else 0])
                return
            )
            return
        )
        $(window).trigger('scroll').trigger('resize')
        return 
    )
    ###
$(home)