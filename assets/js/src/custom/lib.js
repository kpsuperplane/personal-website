var homeData = {
    init: false,
    cubes: []
};
var projectColors = ['#1577E8', '#EA16F5', '#16F516', '#A200FF', '#FFFB00', '#FF0000', '#00FFB3'];
var projectData = [
    {
        'name' : 'VIA MUSICA',
        'image' : 'viamusica.jpg',
        'subtitle' : 'Enhancing music study through digital innovation.',
        'url' : 'http://viamusica.com',
    },{
        'name' : 'PROJECT 5K',
        'image' : 'project5k.jpg',
        'subtitle' : 'Promoting greater volunteerism among youth.',
        'url' : 'http://project5k.ca'
    },{
        'name' : 'YIELD FUNDING GROUP',
        'image' : 'yieldfunding.jpg',
        'subtitle' : 'Enabling a new generation of B2B funding.',
        'url' : 'http://yieldfunding.com'
    },{
        'name' : 'MARKVILLE HISTORY',
        'image' : 'markvillehistory.jpg',
        'subtitle' : 'Improving experiences for a traditional school website.',
        'url' : 'http://markvillehistory.com'
    },{
        'name' : 'IN THE LOOP',
        'image' : 'intheloop.jpg',
        'subtitle' : 'Easing access to breaking news through machine-learning.',
        'url' : 'http://devpost.com/software/in-the-loop-real-time-news-aggregating-web-app'
    },{
        'name' : 'MARKHAM GETTING TOGETHER',
        'image' : 'mgt.jpg',
        'subtitle' : 'Faciliating greater outreach for community events.',
        'url' : 'http://markham-getting-together.com'
    }
];
window.home = function(){
    function render() {
        homeData.renderer.render(scene, camera);
    }
    function init(){
        homeData.init = true;
        var ctx = $('<canvas />')[0].getContext("2d"),
        w = ctx.canvas.width,
        h = ctx.canvas.height,
        balls = [];
        ctx.fillStyle = "rgb(0, 154, 253)";

        function generate(txt) {
            var i, radius = 6,
                maxX = 0,
                maxY = 0,
                minX = 1000,
                minY = 1000, // ball radius
                data32; // we'll use uint32 for speed

            balls = []; // clear ball array
            ctx.clearRect(0, 0, w, h); // clear canvas so we can
            ctx.font = "20px Arial";
            ctx.fillText(txt.toUpperCase(), 0, 20); // draw the text (default 10px)

            // get a Uint32 representation of the bitmap:
            data32 = new Uint32Array(ctx.getImageData(0, 0, w, h).data.buffer);

            for (i = 0; i < data32.length; i++) {
                if (data32[i] & 0xff000000) { // check alpha mask
                var x = (i % w) * radius * 2 + radius;
                var y = ((i / w) | 0) * radius * 2 + radius;
                maxX = Math.max(x, maxX);
                maxY = Math.max(y, maxY);
                minX = Math.min(x, minX);
                minY = Math.min(y, minY);
                balls.push({ // add new ball if a solid pixel
                    x: x, // use position and radius to
                    y: y, //  pre-calc final position and size
                });
                }
            }
            return {
                max: [maxX, maxY],
                min: [minX, minY],
                coords: balls
            };
        }

        var canvas = $('#home-name');

        homeData.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvas[0]
        });
        homeData.renderer.setClearColor(0x000000, 0);
        homeData.renderer.setSize(canvas.width(), canvas.height());

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, canvas.width()/canvas.height(), 1, 10000);

        camera.position.z = 200;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });
        scene.add(camera);

        plane = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        }));
        scene.add(plane);

        var light = new THREE.SpotLight(0xffffff, 1);
        light.position.z = 2000;
        light.position.y = 50;
        scene.add(light);


        function makeArray(w, h, val) {
            var arr = [];
            for (i = 0; i < h; i++) {
                arr[i] = [];
                for (j = 0; j < w; j++) {
                arr[i][j] = val;
                }
            }
            return arr;
        }
        var width = 10;
        var height = 10;
        var gen = generate("KEVIN");
        homeData.coords = gen.coords;
        homeData.offsetX = (gen.max[0] + gen.min[0]) / 2;
        homeData.offsetY = (gen.max[1] + gen.min[1]) / 2;
        var initialTweens = [];
        for (var i = 0; i < homeData.coords.length; i++) {
            var cube = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 20), new THREE.MeshLambertMaterial({
                color: "#2098e8"
            }));
            cube.position.x = homeData.coords[i].x - homeData.offsetX;
            cube.position.y = -(homeData.coords[i].y - homeData.offsetY);
            cube.position.z = -50;
            var del = (Math.abs(cube.position.x)+Math.abs(cube.position.y))/250;
            homeData.cubes.push(cube);
            initialTweens.push(TweenMax.to(homeData.cubes[i].position, 2, {
                z: 0,
                delay: del
            }));
            scene.add(cube);

        }
        var initialTimeline = new TimelineMax();
        initialTimeline.insertMultiple(initialTweens);
        initialTimeline.play();
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function colorTo(target, value, delay) {
        var initial = new THREE.Color(target.material.color.getHex());
        TweenMax.to(initial, 1, {
            r: value.r,
            g: value.g,
            b: value.b,
            delay: delay, 
            ease: Cubic.easeInOut,
            onUpdate: function() {
            target.material.color = initial;
            }
        });
    }
    if(!isMobile.any && Modernizr.webgl){ //only run on desktop-class devices to conserve battery. Also must be WebGL Compatible (duh)
        if(!homeData.init) init();
        var winWidth = $(window).width() / 2;
        var winHeight = $(window).height() / 2;
        $(document).on('click.controller', function(){
            var col = Math.floor(Math.random()*0xFFFFFF);
            for (var i = 0; i < homeData.coords.length; i++) {
                var x = homeData.coords[i].x - homeData.offsetX;
                var y = -(homeData.coords[i].y - homeData.offsetY);
                var del = (Math.abs(x)+Math.abs(y))/1000;
                colorTo(homeData.cubes[i], new THREE.Color(col), del);
            }
        });
        $(document).on('mousemove.controller', function(event) {
            camera.position.x = -Math.min(12, Math.max(-12, Math.round((event.pageX - winWidth) / 50)));
            camera.position.y = Math.round((event.pageY - winHeight) / 7);
            camera.lookAt({
                x: 0,
                y: 0,
                z: 0
            });
        });
        TweenMax.ticker.addEventListener("tick", render);
        return function(){
            TweenMax.ticker.removeEventListener("tick", render); 
            $(document).off('.controller');
        }
    }
    return function(){};
}
var content = {
    about : {
        'about-subtitle': [
            'Skiing like a madman, git commiting with passion, and coding for the betterment of society.',
            'Ski like a madman, git committing with passion, code for better lives'
        ],
        'about-part-2-paragraph':[
            'Hello there! My name is Kevin, and I am a 17 year old high school student from the beautiful city of Markham, Ontario. With a passion in computer science and web development, I work on earth-shaking (and sometimes not-so-earth-shaking) portfolio in my spare time. You know, things that get you right out of bed at the start of the day :)',
            'My name is Kevin<br/>High school student from Markham<br/>Coding is great fun<hr/>Projects are lovely<br/>Sometimes they are earth-shaking<br/>Sometimes they are not'
        ],
        'about-part-3-paragraph-content':[
            'Technology is absolutely unique in its ability to rapidly permeate itself into everyone\'s daily life. Not only is this great for getting thousands of people to fly birds through pipes together, it\'s great for making real, positive social impact and change. It is this power that I harness on a daily basis.',
            'Tech can be unique<br/>It can change the world real fast.<br/>Just like angry birds<hr/>I use this power<br/>To make positive impacts<br/>All day, every day'
        ],
        'about-part-4-paragraph':[
            'Be it 36 hours of programming, an all-nighter of studying, or plain, simple snow flying in my face, there is nothing like the adreneline of doing something <strong>cool.</strong>',
            'I can code all night<br/>I can wipeout on the snow<br/>Either way it\'s <strong>cool</strong>'
        ]
    },
    contact : {
        'contact-paragraph' : [
            'Opportunity, cordiality, or just plain curiosity? Either way, feel free to get in touch with one of the ways below!',
            'Opportunity?<br/>Or just curiosity?<br/>Either way, I\'m free!'
        ]
    }
};