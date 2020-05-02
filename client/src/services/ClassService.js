import Api from '@/services/Api'

export default{
    getAll(){
        return Api().get('major');
    },
    search(params){
        return Api().get(`major/find?name=${params}`);
    },
    get(params){
        return Api().get(`major/findOne?id=${params}`);
    },

    getClass(params){
        return Api().get(`class/findOne?id=${params}`);
    },
    getAllClass(){
        return Api().get(`class`);
    },

    joinClass(params){
        return Api().put(`class/join`, params)
    },

    createMajor(params){
        return Api().post(`major`, params);
    },
    createClass(params){
        return Api().post(`class`, params);
    },

    addClassToMajor(params){
        return Api().put(`major/addClass`, params);
    },

    addUserToClass(params){
        return Api().put(`class/addUser`, params);
    },
    addClassToUser(params){
        return Api().put(`users/addClass`, params);
    },

    removeUserFromClass(params){
        return Api().put(`class/removeUser`, params);
    },
    removeClassFromUser(params){
        return Api().put(`users/removeClass`, params);
    },

    rejectUser(params){
        return Api().put(`class/rejectUser`, params);
    },


    createCourse(params){
        return Api().post(`course/createCourse`, params);
    },

    allCourse(){
        return Api().get(`course`);
    },
    getAllCourse(params){
        return Api().get(`course/findByClass?cId=${params}`);
    },
    deleteCourse(params){
        return Api().delete(`course?id=${params}`);
    },
    searchCourse(params){
        return Api().get(`course/find?search=${params}`);
    },

    addCourseToClass(params){
        return Api().put(`class/addCourse`, params);
    },
    addClassToCourse(params){
        return Api().put(`course/addClass`, params);
    },
    removeCourseFromClass(params){
        return Api().put(`class/removeCourse`, params);
    },
    removeClassFromCourse(params){
        return Api().put(`course/removeClass`, params);
    }
}