<template>
  <div class="note-menu">
      <div class="container">
        <p class="title">Add Page</p>
        <form @submit.prevent="addPage">
            <div class="addpage single" @click="inputPage('single')" :class="{active: inputType === 'single'}">
                <p class="subtitle">Single Page</p>
                <input type="number" placeholder="page number" min="1" :max="totalpage" v-model="singlepage"/>
            </div>
            <div class="addpage multiple" @click="inputPage('multi')" :class="{active: inputType === 'multi'}">
                <p class="subtitle">Multiple Page</p>
                <input type="number" min="1" :max="totalpage" v-model="multipage.val1" placeholder="from"/><span>-</span><input type="number" min="1" :max="totalpage" v-model="multipage.val2" placeholder="to"/>
            </div>
            <input type="submit" value="Add">
        </form>
        <div class="title">Page List</div>
        <div class="pagelist">
            <div class="pl-container">
                <ul>
                    <li @click="removeNote">Page 1 <span class="del">x</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <div class="button" @click="removeNote">Remove</div>
            <div class="delete" @click="deleteNote">Delete Note</div>
        </div>
      </div>

  </div>
</template>

<script>
export default {
    data(){
        return{
            inputType: 'single',
            singlepage: '',
            multipage: {
                    val1: '',
                    val2: ''
                },
        }
    },

    props:{
        totalpage: Number,
    },

    methods:{
        addPage(){
            if(this.inputType === 'single'){
                if(this.singlepage === ''){
                    window.alert(`Input page needs to be filled!`);
                } else{
                    window.alert(`API CALLED!`);
                }
            } else{
                let {val1, val2} = this.multipage;
                if(val1 === '' || val2 === ''){
                    window.alert('Both of inputs must be filled!')
                } else if (val1 >= val2){
                    window.alert(`the 'to' input page must be bigger than 'from' input page.`);
                } else{
                    //call API
                    window.alert('API CALLED!');
                }
            }
        },
        inputPage(type){
            if(type === 'single'){
                this.inputType = 'single'
                this.multipage = {
                    val1: '',
                    val2: ''
                }
            } else{
                this.inputType = 'multi'
                this.singlepage = ''
            }
        },
        removeNote(){
            window.alert('note removed!');
        },
        deleteNote(){
            window.alert('note deleted!');
        }
    }
};
</script>

<style scoped>
.note-menu{
    position: absolute;
    top:100%;
    right:0;
    width: 60%;
    height:100vh;
    background:#888;
    text-align: center;
}
.container{
    width:88%;
    margin:20px auto 0;
    /* background: lavender; */
}
.title{
    font-size: 22px;
    margin-bottom: 15px;
}

.subtitle{
    font-size: 16px;
    margin-bottom: 10px;
}
.addpage{
    margin-bottom: 10px;
    padding: 15px 0;
    border-radius: 10px;
}

input{
    text-align: center;
    width: 90%;
    line-height: 20px;
}

.multiple input{
    width: calc(45% - 20px);
}

.multiple span{
    margin: 0 10px;
}

.active{
    background: #666;
}

input[type="submit"]{
    line-height: 30px;
    background: #666;
    border-radius: 10px;
    border:none;
    margin-bottom: 20px;
}
.pagelist{
    background: #fff;
    height:230px;
    padding-top: 10px;
    border-radius: 10px;
}
.pl-container{
    margin: 0 auto;
    width:90%;
    height: 220px;
    overflow:auto;
}

.pl-container .del{
    display: none;
}

.pl-container li:hover > .del{
    display: initial;
    color:red;
}

li{
    line-height: 35px;
}
li:hover{
    background:#888;
    color:white;
    cursor: pointer;
}

.footer{
    position: absolute;
    bottom: 80px;
    right:50%;
    transform: translateX(50%);
    width: 88%;
}
.footer .button{
    width: 100%;
    background: #666;
    border-radius: 10px;
    line-height: 50px;
    margin-bottom: 10px;
}
.footer .delete{
    font-size: 12px;
    position: absolute;
    right: 0;
}


</style>