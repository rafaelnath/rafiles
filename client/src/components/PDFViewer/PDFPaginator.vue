<template>
  <div class="pdf-paginator">
      <template v-if="pageCount">
        <input 
            type="number"
            :value="value"
            @input="input"
            min="1"
            :max="pageCount"
            /> / <span>{{pageCount}}</span>
      </template>
      <input v-else type="number"/>
  </div>
</template>

<script>
export default {
    name: 'PDFPaginator',

    props:{
        value: Number,
        pageCount: Number,
    },

    methods:{
        input(event){
          this.$emit('input', parseInt(event.target.value, 10));
        },
    },

    watch:{
        pageCount(){ //if there's no value on pageCount
            this.$emit('input', 1);
        }
    }
}
</script>

<style>

</style>