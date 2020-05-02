<template>
  <div class="pdf-zoom">
      <a @click.prevent.stop="zoomIn" :disabled="isDisabled">zoom in</a>
      <a @click.prevent.stop="zoomOut" :disabled="isDisabled">zoom out</a>
      <a @click.prevent.stop="fitWidth" :disabled="isDisabled">fit width</a>
      <a @click.prevent.stop="fitAuto" :disabled="isDisabled">fit auto</a>
  </div>
</template>

<script>
export default {
    name: 'PDFZoom',

    props:{
        scale: {
            type: Number,
        },
        increment:{
            type: Number,
            default: 0.25,
        }
    },

    computed:{
        isDisabled(){ //disabled if no scale value
            return !this.scale;
        },
    },

    methods:{
        updateScale(scale){
            this.$emit('change', {scale});
        },
        zoomIn(){
            this.updateScale(this.scale + this.increment);
        },
        zoomOut(){
            if (this.scale <= this.increment) return;
            this.updateScale(this.scale - this.increment);
        },
        fitWidth(){
            this.$emit('fit', 'width');
        },
        fitAuto(){
            this.$emit('fit', 'auto');
        },
    },
}
</script>

<style>

</style>