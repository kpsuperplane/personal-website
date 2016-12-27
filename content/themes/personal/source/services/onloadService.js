export default class onloadService{
    onLoad(){
        const {listeners} = this;
        for(var i = 0; i < listeners.length; i++){
            listeners[i]();
        }
    }
    addListener(fn){
        this.listeners.push(fn);
    }
    init(){
        window.onload = this.onLoad.bind(this);
        this.listeners = [];
    }
}