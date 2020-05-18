<template>
  <div class="">
      <input type="text" v-model="mytext"/>
      <p>{{mytext}}</p>
  </div>
</template>

<script>
export default {
    data(){
        return{
            mytext: ''
        }
    },

    methods:{

    }
};
</script>

<style scoped>
</style>