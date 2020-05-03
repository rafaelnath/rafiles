<template>
  <div class="add-major">
    <p>
      <span @click="goTo('dashboard')">dashboard</span> /
      <span @click="goTo('classes')">manage class</span>
    </p>

    <h1>Add Major</h1>
    <p>Major name</p>
    <input type="text" v-model="name" placeholder="Enter major's name" />
    <a @click="addMajor">Add</a>
  </div>
</template>

<script>
import Api from "@/services/ClassService";
// import RealApi from "@/services/Api";

export default {
  data() {
    return {
      name:'',
    };
  },

  methods: {
    goTo(page) {
      window.location.href = `/admin/${page}`;
    },
    addMajor(){
        Api.createMajor({
            name: this.name
        })
        .then(() =>{
            window.alert('Major added');
            this.goTo('classes');
        })
        .catch(err =>{
            console.log(err);
            window.alert(err.response.data.msg);
        })
    }
  }
};
</script>

<style scoped>
.add-major {
  background: #f1f1f1;
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 20px;
}
input[type="text"] {
  margin-bottom: 20px;
  width: 60%;
  padding: 0px 5px;
  font-size: 20px;
  line-height: 30px;
  border: 0;
  background: none;
  border-bottom: 2px solid rgb(97, 97, 97);
  opacity: 0.5;
  transition: 0.3s ease-in-out;
}
input:focus {
  outline: none;
  opacity: 1;
  padding: 5px;
}
table {
  width: 100%;
  line-height: 30px;
}
span {
  transition: 0.1s ease-in;
}
span:hover {
  font-size: 18px;
  font-weight: bolder;
  cursor: pointer;
}
button {
  width: 100%;
  line-height: 50px;
  background: rgb(199, 199, 199);
  font-size: 18px;
  border: 0;
  color: rgb(73, 73, 73);
}
button:hover {
  background: rgb(161, 161, 161);
  cursor: pointer;
}
a{
    margin-left: 20px;
    padding:10px 20px;
    background: rgb(131, 131, 131);
    color:#fff;
    border-radius: 20px;
}
a:hover{
    opacity: 0.7;
    cursor: pointer;
}
</style>