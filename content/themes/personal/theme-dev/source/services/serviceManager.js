export default {
    use(service){
        if(typeof window.services != 'object') window.services = {};
        if(!(service in window.services)){
            console.log("Initializing service " + service);
            var instance = new service();
            instance.init();
            window.services[service] = instance;
        } 
        return window.services[service];
    }
}