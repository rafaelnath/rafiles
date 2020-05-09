import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

function getToken(type){
    if (type === 'admin'){
        return localStorage.getItem('adminToken');
    } else {
        return localStorage.getItem('token');
    }
}

function setToken(type, token){
    if (type === 'admin'){
        localStorage.setItem('adminToken', token)
    }
}

function delToken(type){
    if (type === 'admin'){
        localStorage.removeItem('adminToken')
    }
}

const store = new Vuex.Store({
    state:{
        admintoken: getToken('admin')
    },
    mutations:{
        adminLogin(state, token){
            state.admintoken = token;
            setToken('admin', token);
            window.alert(`welcome ~`);
        },
        adminLogout(state){
            state.admintoken = null;
            delToken('admin');
            window.alert(`until next time :)`);
        }
    },
    getters:{
        getAdminToken: state => state.admintoken
    }
})

export default store