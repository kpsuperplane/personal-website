import { u } from 'umbrellajs';
export default class resizeService{
    resizeHook(e){
        const {listeners} = this;
        for(var listener in listeners){
            listeners[listener](e);
        }
    }
    init(){
        this.listeners = { //default window resize listeners
            pageHeightSections: function(e){
                u('section.page-height').attr({style: 'min-height:'+window.innerHeight+'px'});
            }
        };

        window.onresize = this.resizeHook.bind(this); //bind resize hook
        
        var evt = window.document.createEvent('UIEvents'); //trigger resize hook on initial load
        evt.initUIEvent('resize', true, false, window, 0); 
        window.dispatchEvent(evt);
    }
}