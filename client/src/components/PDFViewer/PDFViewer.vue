<template>
  <div class="pdf-viewer">
      <div class="viewer-container" :class="{splitmode: openNote}">
        <header>
            <Headbar
                :scale="scale"
                @change="updateScale"
                @fit="updateFit"
                v-model="currentPage"
                :pageCount="pageCount"
            />
        </header>

        <PDFData
            :url="url"
            @page-count="updatePageCount"
            @page-focus="updateCurrentPage"
            @page-jump="initNote"
            >
            <template v-slot:document="{pages}">
            <PDFDocument
                v-bind="{pages, scale, optimalScale, fit, currentPage, pageCount}"
                @scale-change="updateScale"
            />
            </template>
        </PDFData>
      </div>
      <div class="side-note" v-if="openNote">
          <div class="head">
              <div class="left">
                  <label>Side Note - Page {{this.currentPage}}</label>
              </div>
              <div class="right" v-if="note._id">
                  <div class="button copy" @click="copy"><img src="../../assets/copy-01.png"/></div>
                  <div class="button menu" @click="showmenu = !showmenu"><img src="../../assets/menu.png"/></div>
              </div>
              <div style="clear: both"/>
              <note-menu v-if="showmenu" :totalpage="pageCount" :nid="note._id" :npage="note.page" :cpage="currentPage"/>
          </div>
          <div class="body">
              <input type="text" v-model="note.title" @input="checkChanges" @change="isEmpty">
              <textarea cols="30" rows="10" placeholder="Type something" v-model="note.content" @input="checkChanges"></textarea>
          </div>
          <div class="foot" v-if="isChanged">
              <div class="button save" @click="saveNote">
                  <img src="../../assets/checklist-01.png"/>
              </div>
              <div class="button cancel" @click="cancel">
                  <img src="../../assets/close-01.png"/>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Headbar from './Headbar';

import PDFData from './PDFData';
import PDFDocument from './PDFDocument';

import Api from '@/services/NoteService';
import NoteMenu from './NoteMenu';
import clone from 'lodash.clone';


function floor(value, precision){
    const multiplier = Math.pow(10, precision || 0);
    return Math.floor(value * multiplier) / multiplier;
}

export default {
    name: 'PDFViewer',

    components: {
        PDFData,
        PDFDocument,
        Headbar,
        NoteMenu,
    },

    data(){
        return{
            url: '',
            scale: undefined,
            optimalScale:undefined,
            fit: undefined,
            currentPage: 1,
            pageCount: undefined, //total page
            openNote: false,

            uId: '',
            note:'',
            initialNote:'',
            isChanged: false,
            showmenu: false,
        };
    },

    methods:{
        initBook(){
            this.url = `http://localhost:8082/book/download?id=${this.$route.query.bId}`
        },
        
        updateScale({scale, isOptimal = false}){
            const roundedScale = floor(scale, 2);
            if (isOptimal) this.optimalScale = roundedScale;
            this.scale = roundedScale;
        },

        updateFit(fit){
            this.fit = fit;
        },

        updatePageCount(pageCount){
            this.pageCount = pageCount;
        },

        updateCurrentPage(pageNumber){
            this.currentPage = pageNumber;
            console.log(`curr page updated`);
            this.initNote();
        },

        toggleNote(){
            this.openNote = !this.openNote;
            this.updateFit('width');
        },

        initNote(){
            this.isChanged = false;
            let params = {
                uid: this.uId,
                bid: this.$route.query.bId,
                page: this.currentPage
            }
            Api.get(params).then(res =>{
                if(res.data){
                    this.note = res.data;
                    this.initialNote = clone(this.note);
                } else{
                    this.note = {
                        title: 'Untitled',
                        content: ''
                    };
                    this.initialNote = {
                        title: 'Untitled',
                        content: ''
                    };
                }
            }).catch(err =>{
                err.response.data ? window.alert(err.response.data) :
                window.alert(err);
            })
        },

        saveNote(){
            if(this.initialNote.content){ //Update note, if there's a content before
                Api.update({
                    nid: this.note._id,
                    title: this.note.title,
                    content: this.note.content
                }).then(res=>{
                    window.alert('note updated!');
                }).catch(err =>{
                    window.alert(err.response.data.msg);
                })
            } else{
                Api.create({ //Save note, if there's no content before
                    title: this.note.title,
                    content: this.note.content,
                    bookId: this.$route.query.bId,
                    userId: this.uId,
                    page: this.currentPage
                }).then(res =>{
                    window.alert('note created!');
                    this.initNote();
                }).catch(err =>{
                    window.alert(err.response.data.msg);
                })
            }
        },
        cancel(){
            if(window.confirm('discard changes?')){
                this.initNote();
            }
        },

        checkChanges(){
            clearTimeout(this.debounce);
            this.debounce = setTimeout(() =>{
                let oldVal = JSON.stringify(this.initialNote);
                let newVal = JSON.stringify(this.note);
                if(oldVal !== newVal){
                    this.isChanged = true;
                } else{
                    this.isChanged = false;
                }
            }, 600);
        },

        isEmpty(){
            if(this.note.title === ''){
                this.note.title = 'Untitled';
            }
        },

        copy(){
            this.$copyText(this.note.content).then((e)=>{
                window.alert('Note is copied to clipboard!');
                console.log(e);
            }, (e) =>{
                window.alert('Unable to copy note');
                console.log(e)
            })
        },
        hidemenu(){
            this.showmenu = false;
        }
    },

    created(){
        this.uId = localStorage.getItem("userId");
        if(this.$route.query.page){
            this.currentPage = this.$route.query.page;
            console.log(`yippie`)
        }
        this.initBook();
        // this.initNote();
    },

    mounted(){
        console.log(this.currentPage);
    },
        

    watch:{
        url() { //when url empty
            this.currentPage = undefined;
        },
    },

    mounted(){
        document.body.classList.add('overflow-hidden');
    }
    
}
</script>

<style scoped>
    .viewer-container{
        width: 100%;
        float:left;
    }
    .splitmode{
        width: 70%;
    }
    .side-note{
        width:calc(30% - 40px);
        height: calc(100vh - 40px);
        background:rgb(201, 201, 201);
        float:right;
        margin-top: 10px;
        margin-right: 20px;
        border-radius: 10px;
        padding:10px;
        position: relative;
        overflow: hidden;
    }
    .head{
        border-bottom: 2px solid #999;
        margin-bottom: 15px;
        padding-bottom: 3px;
        position: relative;
    }
    .head .left{
        float: left;
    }
    .head .right{
        float: right;
    }
    .head .button{
        display: inline-block;
        margin-left: 5px;
        width: 20px;
        height: 20px;
    }
    .button:hover{
        cursor: pointer;
    }
    .button img{
        width: 100%;
    }
    input{
        margin-bottom: 30px;
        font-size: 40px;
        line-height: 40px;
        width: calc(100% - 10px);
        border: 0;
        background: none;
    }
    input:focus{
        outline: 0;
        background: #999;
        padding: 0 5px;
    }
    textarea{
        border: none;
        background: none;
        width: calc(100% - 10px);
        padding: 5px;
        font-size: 15px;
        line-height: 25px;
        height: 480px;
    }
    textarea:focus{
        outline: none;
    }
    .foot{
        position: absolute;
        right:20px;
        bottom:10px;
    }
    .foot .button{
        width: 30px;
        height: 30px;
        display: inline-block;
        margin-left: 10px;
    }
</style>