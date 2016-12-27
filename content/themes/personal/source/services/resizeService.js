import { u } from 'umbrellajs';
export default class resizeService{
    resizeHook(e){
        const {listeners} = this;
        for(var listener in listeners){
            listeners[listener](e);
        }
    }
    addListener(name, fn){
        this.listeners[name] = fn;
    }
    init(){
        this.listeners = { //default window resize listeners
            pageHeightSections: function(e){
                u('.page-height').attr({style: 'min-height:'+document.documentElement.clientHeight+'px'});
            }
        };

        window.onresize = this.resizeHook.bind(this); //bind resize hook
        
        var evt = window.document.createEvent('UIEvents'); //trigger resize hook on initial load
        evt.initUIEvent('resize', true, false, window, 0); 
        window.dispatchEvent(evt);
    }
}