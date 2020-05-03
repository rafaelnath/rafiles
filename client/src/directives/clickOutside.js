
function bind(el, { value, modifiers }, vnode) { //call createObserver, and assign it to the weakmap
    let self = this
    this.event = function (event) {
        console.log('emitting event')
        self.vm.$emit(self.expression, event)
    }
    this.el.addEventListener('click', this.stopProp)
    document.body.addEventListener('click', this.event)
}

function unbind(el) {
    console.log('unbind')
    this.el.removeEventListener('click', this.stopProp)
    document.body.removeEventListener('click', this.event)
}

export default {
    bind,
    unbind
}