(function() {
  var lastScrollTop, scroll, scrollHidden;

  lastScrollTop = 0;

  scrollHidden = false;

  $('#hamburger').click(function() {
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
      $('#mobile-menu').show();
      return setTimeout(function() {
        return $('#mobile-menu').addClass('active');
      }, 20);
    } else {
      return $('#mobile-menu').removeClass('active').delay(200).hide(1);
    }
  });

  $('#mobile-menu a').click(function() {
    $('#hamburger').removeClass('active');
    return $('#mobile-menu').removeClass('active').delay(200).hide(1);
  });

  scroll = function() {
    var st;
    st = $(this).scrollTop();
    if (st > lastScrollTop) {
      if (!scrollHidden) {
        $('#nav').addClass('scroll-hidden');
        scrollHidden = true;
      }
    } else {
      if (scrollHidden) {
        $('#nav').removeClass('scroll-hidden');
        scrollHidden = false;
      }
    }
    return lastScrollTop = st;
  };

  $(window).scroll(scroll);
  

}).call(this);

//# sourceMappingURL=app.js.map
