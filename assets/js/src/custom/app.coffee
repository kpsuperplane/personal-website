lastScrollTop = 0;
scrollHidden = false
window.stopLoad = false;

$('#hamburger').click ->
    $(this).toggleClass('active')	
    if $(this).hasClass('active') 
        $('#mobile-menu').show();
        setTimeout( ->
            $('#mobile-menu').addClass('active')
        , 20)
    else
        $('#mobile-menu').removeClass('active').delay(200).hide(1)
        
$('#mobile-menu a').click ->
    $('#hamburger').removeClass('active')
    $('#mobile-menu').removeClass('active').delay(200).hide(1)

scroll = ->
    st = $(this).scrollTop()

    if st > lastScrollTop
        if !scrollHidden
            $('#nav').addClass('scroll-hidden')
            scrollHidden = true
    else
        if scrollHidden
            $('#nav').removeClass('scroll-hidden')
            scrollHidden = false
            
    lastScrollTop = st
    
$(->
    if !window.stopLoad 
        $('#nav').addClass('loaded')
        
    $('iframe').wrap('<div class="video-wrapper"></div>')
)

$(window).scroll(scroll).resize(->
    $('#spacer').css(height: $('#nav').outerHeight())
).load(->
    $(window).trigger('scroll')
    $(window).trigger('resize')
    
    $('.emoji').each( ->
        $(this).html(emojione.toImage($(this).html()))
    )

)
