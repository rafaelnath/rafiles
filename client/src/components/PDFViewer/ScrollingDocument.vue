<template>
  <div class="scrolling-document" v-scroll.immediate="updateScrollBounds">
      <ScrollingPage
        v-for="page in pages"
        :key="page.pageNumber"
        v-bind="{page, clientHeight, scrollTop, focusedPage, enablePageJump}"
        v-slot="{isPageFocused, isElementFocused}"
        @page-jump="onPageJump"
        >
        <div class="scrolling-page">
            <slot v-bind="{isPageFocused, isElementFocused, page}"/>
        </div>
      </ScrollingPage>
      <div v-visible="fetchPages" class="observer"></div>
  </div>
</template>

<script>
import visible from '../../directives/visible';
import scroll from '../../directives/scroll';

import ScrollingPage from './ScrollingPage';

export default {
    name: 'ScrollingDocument',

    components:{
        ScrollingPage,
    },

    props:{
        pages: {
            required: true,
        },
        enablePageJump:{
            type: Boolean,
            default: false,
        },
        currentPage:{
            type: Number,
            default: 1,
        },
    },

    data(){
        return{
            focusedPage: undefined,
            scrollTop: 0,
            clientHeight: 0,
        };
    },

    computed:{
        pagesLength(){
            return this.pages.length;
        },
    },
    
    directives:{
        visible,
        scroll,
    },


    methods:{
        fetchPages(currentPage){
            this.$emit('pages-fetch', currentPage);
        },

        onPageJump(scrollTop){
            this.$emit('page-jump');
            this.$el.scrollTop = scrollTop;
            console.log(this.$el.scrollTop);
        },

        updateScrollBounds(){
            const {scrollTop, clientHeight} = this.$el;
            this.scrollTop = scrollTop;
            this.clientHeight = clientHeight;
        },
    },

    watch:{
        pagesLength(count, oldCount){
            if (oldCount === 0) this.$emit('pages-reset');

            //set focusedpage after new pages are mounted
            this.$nextTick(() =>{
                this.focusedPage = this.currentPage;
            });
        },

        currentPage(currentPage){
            if (currentPage > this.pages.length){
                this.fetchPages(currentPage);
            } else {
                this.focusedPage = this.currentPage;
            }
        }
    }
}
</script>

<style scoped>
.scrolling-document{
    height: calc(100vh - 60px);
    overflow: auto;
    padding-right:10px;
}

</style>