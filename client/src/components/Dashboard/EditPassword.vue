<template>
  <div class="edit-password">
    <h1>Edit Password</h1>
    <p :class="{error: error && !oldpwd}">Current Password</p>
    <input type="password" v-model="oldpwd" />
    <p :class="{error: error && !pwd}">New Password</p>
    <input type="password" v-model="pwd" />
    <p :class="{error: error && (!cpwd || pwd !== cpwd)}">Confirm New Password</p>
    <input type="password" v-model="cpwd" />
    <div style="clear:both" />
    <div class="buttons">
      <p class="button" @click="update">Update</p>
      <p class="button" @click="cancel">Cancel</p>
    </div>
  </div>
</template>

<script>
import Api from "@/services/UserService";
export default {
  data() {
    return {
      oldpwd: "",
      pwd: "",
      cpwd: "",
      error: false,
    };
  },

  props:{
      uId: String
  },

  methods: {
    cancel() {
      this.$emit("close");
    },
    update() {
      if(!this.pwd || !this.cpwd || !this.oldpwd){
        window.alert(`please fill all the empty field!`);
        this.error = true;
      } else if(this.pwd !== this.cpwd){
        window.alert(`Confirm password doesn't match with your password`);
        this.error = true;
      } else {
        Api.changePassword({
            userId: this.uId,
            oldPassword: this.oldpwd,
            newPassword: this.pwd
        }).then(res =>{
            // const today = new Date();
            // let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
            // let time = today.getHours() + ':' + today.getMinutes();
            window.alert(`password changed!`);
            this.$parent.cancel();
        }).catch(err => {
                err.response.data
                ? window.alert(err.response.data.msg)
                : window.alert(err);
            });
      }
    }
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 40px;
}

input[type="password"]{
  width: calc(100% - 20px);
  font-size: 20px;
  line-height: 30px;
  background: none;
  border: 0;
  border-bottom: 2px solid #ccc;
  font-size: 25px;
  margin-bottom: 20px;
}

p{
    font-size: 16px;
    margin-bottom: 15px;
}

.buttons {
  float: right;
  margin-top: 20px;
}
.button {
  display: inline-block;
  background: #666;
  line-height: 50px;
  width: 100px;
  text-align: center;
  color: white;
  margin-left: 20px;
}
.button:hover {
  cursor: pointer;
  opacity: 0.8;
}
.error{
    color: red;
}
</style>