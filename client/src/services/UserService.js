import Api from '@/services/Api'

export default{
    register(params){
        return Api().post('users/register', params);
    },
    login(params){
        return Api().post('users/login', params);
    },
    getAll(){
        return Api().get('users');
    },
    searchUser(params){
        return Api().get(`users/find?search=${params}`)
    },
    get(params){
        return Api().get(`users/findOne?id=${params}`)
    },
    update(params){
        return Api().put('users', params);
    },
    updatePic(params){
        return Api().put('users/upic', params);
    },
    changePassword(params){
        return Api().put(`users/password`, params);
    },
    deleteUser(params){
        return Api().delete(`users?id=${params}`);
    },

    keepBook(params){
        return Api().put(`users/addBook`, params);
    },
    removeBook(params){
        return Api().put(`users/removeBook`, params);
    },

    adminLogin(params){
        return Api().post(`users/adminlogin`, params);
    }
}