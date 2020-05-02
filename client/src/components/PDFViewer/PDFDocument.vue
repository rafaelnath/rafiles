<template>
    <div class="pdf-document">
        <ScrollingDocument
            v-bind="{pages, pageCount, currentPage}"
            v-slot="{page, isPageFocused, isElementFocused}"
            :enable-page-jump="true"
            @page-jump="onPageJump"
            @pages-fetch="onPagesFetch"
            @pages-reset="fitWidth"
        >
            <PDFPage
                v-bind="{page, isPageFocused, isElementFocused, scale, optimalScale}"
                @page-focus="onPageFocused"
            />
        </ScrollingDocument>
    </div>
</template>

<script>
import {PIXEL_RATIO, VIEWPORT_RATIO} from '../../utils/constants';
import ScrollingDocument from './ScrollingDocument';
import PDFPage from './PDFPage';

export default {

    name: 'PDFDocument',

    components:{
        ScrollingDocument,
        PDFPage,
    },

    props:{
        pages:{
            required: true,
        },
        pageCount:{
            type:Number,
            default: 0,
        },
        scale:{
            type: Number,
            default: 1.0,
        },
        optimalScale:{
            type: Number,
        },
        fit:{
            type: String,
        },
        currentPage:{
            type: Number,
            default: 1,
        },
    },

    computed:{
        defaultViewport(){
            if(!this.pages.length) return {width: 0, height: 0};
            const [page] = this.pages;
            //it will took the first index of this.pages using destructuring array

            return page.getViewport(1.0);
        },

        isPortrait(){
            const {width, height} = this.defaultViewport;
            return width <= height;
        },
    },

    methods:{
        pageWidthScale(){
            const {defaultViewport, $el} = this;
            if (!defaultViewport.width) return 0;

            return ($el.clientWidth * PIXEL_RATIO) * VIEWPORT_RATIO / defaultViewport.width;
        },
        
        pageHeightScale(){
            const {defaultViewport, $el} = this;
            if (!defaultViewport.height) return 0;

            return ($el.clientHeight * PIXEL_RATIO) * VIEWPORT_RATIO / defaultViewport.height;
        },
        //above methods is to determine an ideal scale
        //using the viewport of the pdf's first page, pixel ratio, viewport ratio

        fitWidth(){
            const scale = this.pageWidthScale();
            this.updateScale(scale, {isOptimal: !this.optimalScale});
        },

        fitHeight(){
            const scale = this.isPortrait ? this.pageHeightScale() : this.pageWidthScale();
            this.updateScale(scale);
        },

        fitAuto(){
            const scale = Math.min(this.pageWidthScale(), this.pageHeightScale());
            this.updateScale(scale);
        },

        updateScale(scale, {isOptimal = false} = {}){
            if (!scale) return;
            this.$emit('scale-change', {scale, isOptimal});
        },

        onPageJump(scrollTop){
            console.log(scrollTop);
            this.$el.scrollTop = scrollTop;
            console.log('onPageJump called!' + this.$el.scrollTop);
        },

        onPagesFetch(currentPage){
            this.$parent.$emit('pages-fetch', currentPage);
        },

        onPageFocused(pageNumber){
            this.$parent.$emit('page-focus', pageNumber); //retrieve value from PDFPage to update pdf current page while scrolling
        },
    },

    watch:{
        fit(fit){
            switch(fit) {
                case 'width':
                    this.fitWidth();
                    break;
                case 'auto':
                    this.fitAuto();
                    break;

                default:
                    break;
            }
        },

        pageCount: 'fitWidth',
    },
}
</script>

<style>
    .pdf-document{
        overflow:auto;
        width: 95%;
        margin:0 auto;
        /* background: salmon; */
        /* height: calc(100vh - 70px);
        overflow: auto;
        padding-right:10px; */
    }
    .scrolling-page{
        margin-bottom: 1em;
    }
</style>