<template>
  <form @submit.prevent="sendFiles" enctype="multipart/form-data">
    <div class="multi-upload">
        <h1>Upload - Multiple Files</h1> <br>
        <input multiple type="file" ref="files" @change="selectFile"/>

        <div class="preview">
            <div class="item" v-for="(file, index) in files" :key="index">
                <div class="file-name" :class="{error: file.invalidMsg}">{{file.name}}&nbsp;<span v-if="file.invalidMsg">*{{file.invalidMsg}}</span></div>
                <div class="action">
                    <a @click.prevent="deleteFile(index)" class="delete">delete</a>
                </div>
            </div>
        </div>
        <button>Upload</button>
    </div>
  </form>
</template>

<script>
import Api from '@/services/BookService'
import _ from 'lodash'

export default {
    name:'MultiUpload',
    
    data(){
        return{
            files: [],
            uploadFiles: [],
        }
    },

    methods:{
        deleteFile(index){
            this.files.splice(index, 1);
            this.uploadFiles.splice(index, 1);
        },
        selectFile(){
            const files = this.$refs.files.files;

            this.uploadFiles = [...this.files, ...files];

            this.files = [
                ...this.files,
                ..._.map(files, file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    invalidMsg: this.validate(file)
                }))
            ]
        },
        validate(file){
            const MAX_SIZE = 200000;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const tooLarge = file.size > MAX_SIZE;
            return '';
            // if(!allowedTypes.includes(file.type) || tooLarge){
            //     return tooLarge ? `file is too large, Max: ${MAX_SIZE / 1000}Kb.` : `only images are allowed!`
            // } else{
            //     return '';
            // }
        },
        sendFiles(){
            //on loading
            const formData = new FormData();
            
            _.forEach(this.uploadFiles, file =>{
                if(this.validate(file) === ''){
                    formData.append('files', file);
                }
            });
            

            if(!this.uploadFiles){
                window.alert('uploading nothing :)')
            }
            Api.uploadMultiFiles(formData).then(res => {
            //off loading
                window.alert('files uploaded!');
                this.uploadFiles = [];
                this.files = [];
            }).catch(err =>{
                window.alert(err.response.data.error);
            })
        }
    }
}
</script>

<style>
    .error{
        color:red;
    }
</style>