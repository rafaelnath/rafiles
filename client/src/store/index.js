import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

function getToken(){
    return localStorage.getItem('adminToken');
}

function getUData(type){
    if (type === `id`){
        return localStorage.getItem(`userId`);
    } else if (type === `token`){
        return localStorage.getItem(`token`);
    } else if (type === `role`){
        return localStorage.getItem(`role`);
    }
}

function setData(type, data){
    if (type === 'admin'){
        localStorage.setItem('adminToken', data)
    } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('role', data.role)
    }
}

function delData(type){
    if (type === 'admin'){
        localStorage.removeItem('adminToken')
    } else{
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('role')
    }
}

const store = new Vuex.Store({
    state:{
        admintoken: getToken(),
        utoken: getUData('token'),
        uid: getUData('id'),
        urole: getUData('role'),
    },
    mutations:{
        adminLogin(state, token){
            state.admintoken = token;
            setData('admin', token);
            window.alert(`welcome ~`);
        },
        adminLogout(state){
            state.admintoken = null;
            delData('admin');
            window.alert(`until next time :)`);
        },
        login(state, data){
            state.utoken = data.token;
            state.uid = data.userId;
            state.urole = data.role;
            setData('user', data);
            window.alert(`ciao ~`);
        },
        logout(state){
            state.utoken = null;
            state.uid = null;
            state.urole = null;
            delData('user');
            window.alert(`see ya...`)
        }
    },
    getters:{
        getAdminToken: state => state.admintoken,
        getUserToken: state =>  state.utoken,
        getUserId: state => state.uid,
        getUserRole: state => state.urole
    }
})

export default store