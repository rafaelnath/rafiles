import Api from '@/services/Api'

export default{
    getAll(){
        return Api().get('book');
    },
    searchBook(params){
        return Api().get(`book/find?search=${params}`);
    },
    get(params){
        return Api().get(`book/findOne?id=${params}`);
    },

    update(params){
        console.log(params);
        return Api().put('book', params)
    },

    uploadFile(params){
        console.log(params);
        return Api().post('book/upload', params);
    },
    addbook(params){
        return Api().post('book/create', params);
    },

    uploadMultiFiles(params){
        return Api().post('files/multiupload', params, {onUploadProgress: e => console.log(e.loaded)});
    },
    
    download(params){
        return Api().get(`book/download?id=?${params}`);
    },
    deleteBook(params){
        return Api().delete(`book?id=${params}`);
    },
    deleteFile(params){
        console.log(params);
        return Api().delete(`book/file?name=${params}`);
    }
}