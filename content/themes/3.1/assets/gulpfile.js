var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */
elixir.config.assetsPath = '';
elixir.config.publicPath = '';
elixir.config.css.less.folder='';
elixir.config.js.coffee.folder='';
elixir(function(mix) {
    mix.less('css/main.less');
    mix.coffee('js/src/custom/main.coffee', 'js/src/custom/main.js');
    mix.coffee('js/src/custom/app.coffee', 'js/app.js');
    mix.scripts(['js/src/lib/*.js', 'js/src/plugins/*.js', 'js/src/subplugins/*.js','js/src/custom/main.js', 'js/src/custom/lib.js'], 'js/home.js');
});