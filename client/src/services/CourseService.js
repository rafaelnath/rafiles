import Api from '@/services/Api'

export default{
    getCourse(params){
        return Api().get(`course/findOne?id=${params}`);
    },

    addBookToCourse(params){
        return Api().put(`course/addBook`, params);
    },
    addCourseToBook(params){
        return Api().put(`book/addCourse`, params);
    },

    removeBookFromCourse(params){
        return Api().put(`course/removeBook`, params);
    },
    removeCourseFromBook(params){
        return Api().put(`book/removeCourse`, params);
    },

    removeBookFromManyCourses(params){
        return Api().put(`course/removeManyBook`, params);
    },

    addUserToCourse(params){
        return Api().put(`course/addUser`, params)
    },
    addCourseToUser(params){
        return Api().put(`users/addCourse`, params)
    },

    removeUserFromCourse(params){
        return Api().put(`course/removeUser`, params)
    },
    removeCourseFromUser(params){
        return Api().put(`users/removeCourse`, params)
    },

    rejectUser(params){
        return Api().put(`course/rejectUser`, params)
    },

    getMajorName(params){
        return Api().get(`major/findOne?id=${params}`);
    },

    joinCourse(params){
        return Api().put(`course/join`, params);
    },

    deleteCourse(params){
        return Api().delete(`course?id=${params}`)
    }
}