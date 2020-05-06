<template>
  <div class="note-menu" v-click-outside="hidemenu">
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
                    <li v-for="(page, index) in npage" :key="index" @click="removeNote('that', page)">Page - {{page}}<span class="del">x</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <div class="button" @click="removeNote('this', cpage)">Remove</div>
            <div class="delete" @click="deleteNote">Delete Note</div>
        </div>
      </div>

  </div>
</template>

<script>
import ClickOutside from 'v-click-outside';
import Api from '@/services/NoteService';
import range from 'lodash/range'

export default {

    directives:{
        clickOutside: ClickOutside.directive
    },

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
        nid: String,
        npage: Array,
        cpage: Number,
    },

    methods:{
        addPage(){
            if(this.inputType === 'single'){
                if(this.singlepage === ''){
                    window.alert(`Input page needs to be filled!`);
                } else{
                    let page = this.singlepage;
                    Api.addPage({
                        nid: this.nid,
                        page: page
                    }).then(res =>{
                        window.alert('done :)');
                        this.singlepage = '';
                        this.$parent.initNote();
                    }).catch(err =>{
                        window.alert(err.response.data ? err.response.data : err);
                    })
                }
            } else{
                let {val1, val2} = this.multipage;
                if(val1 === '' || val2 === ''){
                    window.alert('Both of inputs must be filled!')
                } else if (val1 >= val2){
                    window.alert(`the 'to' input page must be bigger than 'from' input page.`);
                } else{
                    let pages = [];
                    range(parseInt(val1), parseInt(val2) + 1).map(page => pages.push(page));
                    
                    Api.addPage({
                        nid: this.nid,
                        page: pages
                    }).then(res =>{
                        window.alert('done :)');
                        // console.log(res.data);
                        this.multipage = {
                            val1: '', val2: ''
                        }
                        this.$parent.initNote();
                    }).catch(err =>{
                        window.alert(err.response.data ? err.response.data : err);
                    })
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
        deleteNote(){
            if(window.confirm('delete note?')){
                Api.deleteNote(this.nid).then(res=>{
                    window.alert('Note deleted.')
                    this.$parent.initNote();
                    this.hidemenu();
                }).catch(err => {
                    window.alert(err.response.data ? err.response.data : err);
                })
            }
        },
        hidemenu(){
            this.$parent.hidemenu();
        },
        removeNote(cond, page){
            if(window.confirm('remove note from this page?')){
                Api.removePage({
                    nid: this.nid,
                    page: page
                }).then(res =>{
                    window.alert(cond === 'this' ? 'note removed from this page' : `note removed from page - ${page}`);
                    this.$parent.initNote();
                    this.$parent.hidemenu();
                }).catch(err =>{
                    window.alert(err.response.data ? err.response.data : err);
                })
            }
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
    margin-left:10px;
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