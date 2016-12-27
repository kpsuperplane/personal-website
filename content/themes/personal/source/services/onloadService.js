export default class onloadService{
    onLoad(){
        const {listeners} = this;
        for(var i = 0; i < listeners.length; i++){
            listeners[i]();
        }
    }
    addListener(fn){
        this.listeners.append(fn);
    }
    init(){
        window.onload = onLoad.bind(this);
        this.listeners = {};
    }
}