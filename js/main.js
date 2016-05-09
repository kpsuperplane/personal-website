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
$(window).resize(function () {
    var top = $(window).height() / 2 - $('#banner-inner').outerHeight() / 2;
    $('#banner-inner').css('top', top < 20 ? 20 : top);
    $('#carousel-container, #carousel-controls').css('height', $('.image-container img:first').height());
    $('#carousel-controls').css('top', -$('.image-container img:first').outerHeight());
    $('#carousel').css('height', $('.image-container img:first').height() + 50);
    $('.image-container').removeClass('animate');
    $('.image-container').each(function () {
        if ($(this).prev().length > 0) {
            $(this).css('left', $(this).prev().position().left + $(this).prev().outerWidth());
        }
    });
    $('.image-container').addClass('animate');
}).scroll(function () {
    if ($(window).scrollTop() == 0) {
        $('#nav').addClass('top');
    } else {
        $('#nav').removeClass('top');
    }
}).load(function () {
    $(this).trigger('resize').trigger('scroll');
    $('body').addClass('in');
    $('.loader').addClass('hide').delay(1000).hide(1);
    setTimeout(function(){
        $('#loader-overlay').addClass('hide').delay(300).hide(1);
    }, 100);
    $('.emoji').each(function () {
        $(this).removeClass('emoji').html(emojione.shortnameToImage($(this).text()));
    });
    writeNew(); 
});  
function logoAnimate(id){
    var colors = ['#F2990A', '#32D24F','#D23232', '#000', '#5A32D2', '#329CD1', '#D232C7'];
    if(!$('body').hasClass('in')){
        id++;
        if(id == colors.length){
            id = 0;
        }
        $('.loader').css('background', colors[id]);
        setTimeout(function(){
           logoAnimate(id); 
        }, 1000);
    }
}
logoAnimate(0);
setTimeout(function(){
    if(!$('body').hasClass('in')){
        $(window).trigger('resize').trigger('scroll');
        $('body').addClass('in');
        $('.loader').addClass('hide').delay(1000).hide(1);
        $('.emoji').each(function () {
            $(this).removeClass('emoji').html(emojione.shortnameToImage($(this).text()));
        });
        writeNew(); 
    }
}, 3000);
var mySite = angular.module('mySite', []);
new WOW().init();
mySite.controller('FormController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.form = {
        code: window.code
    };
    $scope.verified = false;
    $scope.error = "";
    $scope.submitting = false;
    $scope.complete = false;
    $scope.sendForm = function () {
        if (!$scope.submitting && $scope.verified) {
            $scope.submitting = true;
            $.post('mail.php', $scope.form, function (data) {
                if (data == 'success') {
                    $scope.complete = true;
                } else {
                    $scope.submitting = false;
                    $scope.error = data;
                }
                $scope.$apply();
            });
        }
    };
}]);
mySite.controller('CarouselController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.index = 0;
    var moveCarousel = function () {
        var newImage = $('.image-container').eq($scope.index);
        if (newImage.length > 0) {
            $('#carousel-container').css('left', $(window).width() / 2 - newImage.position().left - newImage.outerWidth() / 2);
        }
    };
    $(window).resize(function () {
        moveCarousel();
    });
    $scope.$watch('index', function (newValue, oldValue) {
        moveCarousel();
    });
    $scope.images = [
        ['img/viamusica.jpg', 'http://viamusica.com'],
        ['img/project5k.jpg', 'http://project5k.ca'],
        ['img/yieldfunding.jpg', 'https://yieldfunding.com'],
        ['img/markvillehistory.jpg', 'http://markvillehistory.com'],
        ['img/termsjs.jpg', 'http://kpsuperplane.github.io/Terms.JS']
    ];
    $timeout(moveCarousel, 0);
}]);

function writeNew() {
    var curText = 0;
    var text = [
        'Handcrafted to perfection :thumbsup:',
        'Made with :heart:',
        'Simple yet effective :wink:',
        'Built with awesomesauce :smirk:'
    ];
    for (var i = 0; i < text.length; i++) {
        text[i] = emojione.shortnameToImage(text[i]);
    }
    var writeText = function (idx) {
        if (text[curText].charAt(idx) == '<') {
            idx = text[curText].length;
        }
        $('#title').html(text[curText].substring(0, idx));
        if (idx >= text[curText].length) {
            if ($('#title-inner').height() > $('#title-outer').height()) {
                $('#title-outer').height($('#title-inner').height());
                $(window).trigger('resize');
            }
            setTimeout(function () {
                deleteText();
            }, 3000);
        } else {
            setTimeout(function () {
                writeText(idx + 1);
            }, Math.floor((Math.random() * 30) + 20));
        }
    }
    var deleteText = function () {
        if ($('#title').text() != '') {
            $('#title').text($('#title').text().slice(0, -1));
            setTimeout(deleteText, Math.floor((Math.random() * 30) + 20));
        } else {
            curText++;
            if (curText >= text.length) {
                curText = 0;
            }
            writeText(0);
        }
    }
    setTimeout(function () {
        deleteText();
    }, 3000);
}
$(function(){
    $('.nav-links a').click(function(e){
        e.preventDefault();
        var group = $(this).attr('data-group');
        var id = $(this).attr('href');
        $(this).parent().children('a').removeClass('active');
        $(this).addClass('active');
        $('.'+group).hide().removeClass('active');
        $(id).show();
        setTimeout(function(){
            $(id).addClass('active');
        },1);
    });
});
$('.internal').click(function (e) {
    e.preventDefault();
    var scope = angular.element($('#nav').get(0)).scope();
    scope.visible = false;
    scope.$apply();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - $('#nav').outerHeight() - 40
    }, 500);
});