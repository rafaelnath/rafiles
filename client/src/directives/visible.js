import 'intersection-observer'

const instances = new WeakMap();

function createObserver (el, vnode, modifiers, callback){
    const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        // console.log(modifiers.once);
        if(entry.isIntersecting){
            callback();
        } 
        
        // if (modifiers.once){
        //     disconnectObserver(observer, el);
        // }
    })

    vnode.context.$nextTick(() => observer.observe(el)); // observe after element is inserted in DOM

    return observer;
}

function disconnectObserver(observer, el){ //self explanatory i guess
    // console.log('disconnecting observer, ' + el);
    if(observer) observer.disconnect();
}

function bind(el, {value, modifiers}, vnode){ //call createObserver, and assign it to the weakmap
    if(typeof window.IntersectionObserver === 'undefined') { 
        console.log('IntersectionObserver API is not available in your browser :(');
    } else {
        const observer = createObserver(el, vnode, modifiers, ()=>{
            const callback = value;
            if (typeof callback === 'function') callback();
        })

        instances.set(el, {observer});
    }
}

function update(el, {value, oldvalue}, vnode){
    if ( value === oldvalue) return;

    //disconnect the old observer
    const {observer} = instances.get(el);
    disconnectObserver(observer, el);

    //create new observer
    bind(el, {value}, vnode);
}

function unbind(el){
    if(instances.has(el)){
        const {observer} = instances.get(el);
        disconnectObserver(observer, el);
        instances.delete(el);
    }
}

export default{
    bind,
    update,
    unbind
}