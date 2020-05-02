<template>
    <canvas v-visible.once="drawPage" v-bind="canvasAttrs"></canvas>
</template>

<script>
import visible from '../../directives/visible'
import {PIXEL_RATIO} from '../../utils/constants'

export default {
    name: 'PDFPage',

    props:{
        page:{
            type: Object,
            required: true,
        },
        scale:{
            type: Number,
            required: true,
        },
        optimalScale:{
            type: Number,
            required: true,
        },
        isPageFocused:{
            type: Boolean,
            default: false,
        },
        isElementFocused:{
            type: Boolean,
            default: false,
        }
    },

    directives:{
        visible,
    },

    computed:{
        actualSizeViewport(){
            return this.viewport.clone({scale: this.scale});
        },

        canvasStyle(){
            const {width: actualSizeWidth, height: actualSizeHeight} = this.actualSizeViewport;
            const [pixelWidth, pixelHeight] = [actualSizeWidth, actualSizeHeight].map(dim => Math.ceil(dim / PIXEL_RATIO));
            return `width: ${pixelWidth}px; height:${pixelHeight}px;`
        },

        canvasAttrs(){
            let {width, height} = this.viewport;
            [width, height] = [width, height].map(dim => Math.ceil(dim));

            const style = this.canvasStyle;

            return {
                width,
                height,
                style,
                class: 'pdf-page'
            };
        },

        pageNumber(){
            return this.page.pageNumber;
        },
    },

    methods:{
        focusPage(){
            if (this.isPageFocused) return;

            this.$emit('page-focus', this.pageNumber);
        },

        drawPage(){
            if(this.renderTask) return;

            const {viewport} = this;
            const canvasContext = this.$el.getContext('2d');
            const renderContext = {canvasContext, viewport};

            this.renderTask = this.page.render(renderContext);
        },

        updateVisibility(){
            this.$parent.$emit('update-visibility');
        },

        destroyPage(page){
            if (page) page._destroy();
            this.destroyRenderTask();
        },

        destroyRenderTask(){
            if(!this.renderTask) return;
            this.renderTask.cancel();
            delete this.renderTask;
        },
    },

    watch:{
        scale: 'updateVisibility',

        page(newPage, oldPage){
            this.destroyPage(oldPage);
        },

        isElementFocused(isElementFocused){
            if(isElementFocused) this.focusPage();
        }
    },

    created(){
        this.viewport = this.page.getViewport(this.optimalScale);
    },

    beforeDestroy(){
        this.destroyPage(this.page);
    },

};
</script>

<style scoped>
    .pdf-page{
        margin: 0 auto;
        display: block;
    }
</style>