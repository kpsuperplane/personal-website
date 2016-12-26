import './style/style.scss';
import {u} from 'umbrellajs';
import home from './pages/home';


if(u('body').hasClass('home-template')) home.init(); //initialize home js on homepage

window.onload = function(){
    u('#nav').attr({class: 'loaded'});
}