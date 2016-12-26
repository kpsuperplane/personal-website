import './style/style.scss';
import {u} from 'umbrellajs';
import home from './pages/home';

home.init();

window.onload = function(){
    u('#nav').attr({class: 'loaded'});
}