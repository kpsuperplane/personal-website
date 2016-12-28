import './style/style.scss';
import {u} from 'umbrellajs';
import home from './pages/home';
import serviceManager from './services/serviceManager';
import onloadService from './services/onloadService';
import navigationService from './services/navigationService';

// auto hide nav bar plus mobile support
serviceManager.use(navigationService);

//show contents on load
const onloadServiceInstance = serviceManager.use(onloadService);

onloadServiceInstance.addListener(function(){
    u('body').addClass('loaded');
    u('#nav').addClass('loaded'); 
});

if(u('body').hasClass('home-template')) home.init(); //initialize home js on homepage 


u('iframe').wrap('<div class="video-wrapper">'); //pretty videos

