
<!DOCTYPE HTML>
<html lang="en" ng-app="mySite">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kevin Pei - Web Developer</title>
    <link href="//fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">
    <meta name="description" content="Kevin Pei - Web Developer">
    <meta name="author" content="Kevin Pei">
    <link rel="shortcut icon" href="favicon.png">
    <link rel="shortcut icon" href="favicon.ico">
    <link href="css/main.css" rel="stylesheet" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js"></script>
    <script src="//cdn.jsdelivr.net/emojione/1.3.0/lib/js/emojione.min.js"></script>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/1.3.0/assets/css/emojione.min.css" />
</head>

<body>
    <div class="loader"><div class="spinner"></div><img src="img/logo.png" id="logo"/></div>
    <div id="loader-overlay"></div>
    <div id="nav" ng-init="visible=false">
        <a id="menu" href="javascript:void(0);" ng-click="visible = !visible">Kevin Pei<span class="el el-chevron-down"></span></a>
        <div class="container" id="menu-items" ng-class="{show:visible}">
            <ul>
                <li><a href="#about" class="internal">About Me</a></li><span class="dot">&middot;</span>
                <li><a href="#features" class="internal">What I Do</a></li><span class="dot">&middot;</span>
                <li><a href="#work" class="internal">My Work</a></li><span class="dot">&middot;</span>
                <li><a href="#contact" class="internal">Contact Me</a></li><span class="dot">&middot;</span>
                <li><a href="#legal" class="internal">Legal</a></li>
            </ul>
        </div>
    </div>
    <div id="banner">
        <div id="banner-inner">
            <h1 id="title-outer"><div class="inner" id="title-inner"><span id="title">Handcrafted to perfection <span class="emoji">:thumbsup:</span></span><span class="blink">|</span></div></h1>
            <span class="socials">
                <a href="https://github.com/kpsuperplane" class="el el-github" target="_blank"></a>
                <a href="http://stackoverflow.com/users/864528/kevin-pei" class="el el-stackoverflow" target="_blank"></a>
                <a href="http://ca.linkedin.com/in/kpsuperplane/en" class="el el-linkedin" target="_blank"></a>
            </span>
            <h4>Hello{{name == '' || name == null ? '' : ' ' + name}}, my name is <strong>Kevin Pei</strong>, and I make websites</h4>
            <input id="top-input" placeholder="Your Name (optional)" ng-model="name"/><a href="#about" class="btn internal">Check me out!</a>
        </div>
    </div>
    <div id="main">
        <div class="container">
            <div class="center">
                <h1 id="about">About Me</h1>
                <p><strong>Hello there{{name == '' || name == null ? '' : ' ' + name}}!</strong> My name is Kevin, and I am a 16 year old high school student + web developer from the beautiful city of Markham, Ontario. With a passion in computer science and web development, I create beautiful yet sensible sites in my spare time. You know, sites that will have your customers saying wow, sites that'll bring a smile to those who use it. <span class="emoji">:smile:</span></p>
            </div>
        </div>
        <hr/>
        <div class="container">
            <h1 class="center" id="features">What I Do</h1>
            <div class="half top">
                <h2>Responsive Design</h2>
                <p>In our evergrowing world, phones and tablets have become a staple in everyday life. As such{{name == '' || name == null ? '' : ' ' + name}}, we can no longer expect our users to always be on a computer. Yet, a dedicated mobile site is often an expensive and time-consuming hassle. With responsive design, your site will <strong>automatically adjust</strong> itself and look great on whatever device it's being viewed on.</p>
            </div><div class="half wow fadeIn">
                <img src="img/responsive.jpg" />
            </div><br/>
            <blockquote class="wow bounceIn"><span class="inner">Simplicity is the ultimate form of sophistication.<br/><small> - Leonardo Da Vinci</small></span></blockquote><br/>
            <div class="half top separated-left wow fadeIn" data-wow-delay="150ms">
                <h2>My Philosophy</h2>
                <img src="img/code.jpg" />
                <p>Often the best things come easy, simple, and clean. When your goal is to deliver a message across the board to your audience, fast and seamless design is of the essence. Subsequently, my goal is to create <strong>well-optimized</strong> websites that offer no hassle to their viewers{{name == '' || name == null ? '' : ' or you, ' + name}}. </p>
            </div><div class="half top separated-right wow fadeIn" data-wow-delay="300ms">
                <h2>The Nitty Gritty</h2>
                <h3>MVC Architecture</h3>
            <p>With MVC Architecture, sites become <strong>maintainable and flexible</strong>. Adding pages is easy and simple, and even multilingual support becomes a <strong>trivial task</strong>. In essence, MVC (Model-View-Controller) Architecture is an <strong>industry standard</strong> that allows the separation of all the components of your site, allowing you to change one thing and have it spread across <strong>the entire site</strong>.</p>
                <h3>Languages/Tools I Use</h3>
                <p>HTML5, CSS3, LESS, AJAX, JavaScript, jQuery Library, AngularJS, PHP, Bootstrap Framework, Semantic UI, Laravel Framework, MySQL</p>
            </div>
        </div>
        <hr/>
        <div id="work">
            <div class="container">
                <h1 class="center">My Work</h1>
                <div class="nav-links">
                    <a href="#carousel" data-group="work" class="active">Websites</a><a href="#projects" data-group="work">Projects</a>
                </div>
            </div>
            <div id="carousel" class="active section work" ng-controller="CarouselController">
                <div id="carousel-container">
                    <div class="image-container" ng-click="$parent.index = $index" ng-repeat="image in images" ng-class="{active:$index == $parent.index}">
                        <img ng-src="{{image[0]}}" />
                    </div>
                </div>
                <div id="carousel-controls">
                    <a class="el el-eye-open" ng-href="{{images[index][1]}}" target="_blank"></a>
                    <i class="el el-chevron-right" ng-click="index = (index == images.length-1 ? 0 : index + 1)"></i>
                    <i class="el el-chevron-left" ng-click="index = (index == 0 ? images.length-1 : index - 1)"></i>
                </div>
            </div>
            <div id="projects" class="section work">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-6 col-md-4">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div id="contact">
            <div class="container">
                <h1 class="center">Contact Me</h1>
                <p class="center">
                    <strong>Find me on these sites</strong>
                    <span class="socials">
                        <a href="https://github.com/kpsuperplane" class="el el-github" target="_blank"></a>
                        <a href="http://stackoverflow.com/users/864528/kevin-pei" class="el el-stackoverflow" target="_blank"></a>
                        <a href="http://ca.linkedin.com/in/kpsuperplane/en" class="el el-linkedin" target="_blank"></a>
                    </span>
                </p>
                <p class="center"><strong>Or use the form below</strong></p>
                <div ng-controller="FormController">
                    <form ng-hide="complete" id="contact-form" method="post" ng-submit="sendForm()">
                        <div>
                            <label for="name"><strong>Name</strong>&nbsp;<small>({{100-form.name.length}} chars remaining)</small></label>
                            <input ng-disabled="submitting" type="text" id="name" name="name" ng-model="form.name" placeholder="To which honorable human am I speaking to?" maxlength="100">
                        </div>
                        <div>
                            <label for="email"><strong>Email</strong>&nbsp;<small>({{100-form.email.length}} chars remaining)</small></label>
                            <input ng-disabled="submitting" type="text" id="email" name="email" ng-model="form.email" placeholder="Because post offices take too long" maxlength="100">
                        </div>
                        <div>
                            <label for="message"><strong>Your Message</strong>&nbsp;<small>({{100-form.message.length}} chars remaining)</small></label>
                            <textarea ng-disabled="submitting" type="text" id="message" name="message" ng-model="form.message" placeholder="Don't worry, I won't bite" maxlength="100"></textarea>
                        </div> 
                        <div class="g-recaptcha" data-callback="angularVerified" data-sitekey="6LchegMTAAAAANDL28TrDFoQaiGItMrYoRSgbbx4"></div>
                        <p id="contact-error">{{error}}</p>
                        <button class="btn" ng-disabled="submitting||!verified">Fly Pigeon! <small>(Submit)</small>
                        </button>
                    </form>
                    <h2 class="center" ng-show="complete">Thanks! Enjoy your day <span class="emoji">:grinning:</span></h2>
                </div>

            </div>
        </div>
        <hr/>
        <div class="wow fadeInUp">
            <div class="container">
                <h1 class="center" id="legal">Legal</h1>
                <p class="center">You are required to read and agree to the terms and policies listed below.<br/>I know it's boring, so I've tried to keep it brief and simple.
                    <br/>"<strong>I</strong>" refers to Kevin Pei, the site owner.
                    <br/>The "<strong>site</strong>" refers to this website.
                    <br/>The "<strong>form</strong>" refers to the contact form on this site.</p>
                <div class="half top separated-left">
                    <h2><strong>Terms</strong> of Service</h2>
                    <p>Even though this is a simple portfolio site, we still have terms and rules that you have to follow.</p>
                    <ol class="list-unstyled legal-list legal-list-top" type="1">
                        <li>Read and Agree to the Terms of Service and Privacy Policy</li>
                        <li>Do not hold Kevin Pei or the site liable for anything that might happen (as unlikely as this is) to the extent the Canadian law allows</li>
                        <li>Do not use the form provided for malicious intent</li>
                        <li>Do not act to harm either the site or I, Kevin Pei</li>
                    </ol> 
                </div><div class="half top separated-right" id="legal-right">
                    <h2>Privacy Policy</h2>
                    <p>I collect some information through this site, make sure you're ok with what I'm collecting</p>
                    <ol class="list-unstyled legal-list legal-list-top" type="1">
                        <li>I collect basic user metadata through Google Analytics to improve the site experience</li>
                        <li>I use cookies for non-personally-identifiable session tracking (separates one user from the other)</li>
                        <li><em>If</em> you decide to contact me through the form, I collect:
                            <ol class="list-unstyled legal-list" type="A">
                                <li>Your Name</li>
                                <li>Your Email Address</li>
                                <li>Whatever message you write</li>
                                <li>Your IP Address and UserAgent</li>
                            </ol>
                        </li>
                    </ol>
                </div>
            </div>
            <hr/>
            <div class="container">
                <p class="center">Made with <span class="emoji">:heart:</span><br/>&copy; 2015 Kevin Pei.</p>
            </div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <script type="text/javascript">
        window.code = '<?php echo $_SESSION['code']; ?>';  
        function angularVerified(data) {
            var scope = angular.element($('#contact-form').get(0)).scope();
            scope.verified = true;
            scope.form.gcaptcha = data;
            scope.$apply();
        }
    </script>
    <script src="js/main.min.js"></script>
    <script src="https://www.google.com/recaptcha/api.js"></script>
</body>

</html>