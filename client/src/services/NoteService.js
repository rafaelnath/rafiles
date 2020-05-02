import Api from './Api';

export default{
    create(params){
        return Api().post('note', params)
    },
    getAll(){
        return Api().get('note')
    },
    get(params){
        return Api().get(`note/find?uid=${params.uid}&bid=${params.bid}&page=${params.page}`)
    },
    update(params){
        return Api().put(`note`, params);
    },
    addPage(params){
        return Api().put(`note/addPage`, params);
    },
    removePage(params){
        return Api().put(`note/removePage`, params);
    },
    deleteNote(params){
        return Api().delete(`note?id=${params}`);
    }
}