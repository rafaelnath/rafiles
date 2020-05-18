import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Landing Page',
      component: () => import('@/components/Pages/Landing')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/components/Pages/Register')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Pages/Login')
    },
    {
      path: '/imgcropper',
      name: 'ImageCropper',
      component: () => import('@/components/CropPicture')
    },

    //--------ADMIN
    {
      path: '/admin/login',
      name: 'Admin Login',
      component: () => import('@/components/Admin/Login')
    },
    {
      path: '/admin',
      redirect: 'admin/dashboard',
      name: 'Admin',
      component: () => import('@/components/Admin/Layout'),
      children: [
        {
          path: 'dashboard',
          name: 'Admin Dashboard',
          component: () => import('@/components/Admin/Dashboard'),
          meta:{
            adminLoginRequired: true
          },
        },

        //--------------------------------------------- [USER]
        {
          path: 'users',
          name: 'Manage User',
          component: () => import('@/components/Admin/ManageUser'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'edit-user/:id',
          name: 'Edit User',
          component: () => import('@/components/Admin/EditUser'),
          meta:{
            adminLoginRequired: true
          },
        },

        //--------------------------------------------- [BOOK]
        {
          path: 'books',
          name: 'Manage Books',
          component: () => import('@/components/Admin/Book/ManageBook'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'books/upload',
          name: 'Upload Book',
          component: () => import('@/components/Admin/Book/UploadBook'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'books/edit/:id',
          name: 'Edit Book',
          component: () => import('@/components/Admin/Book/EditBook'),
          meta:{
            adminLoginRequired: true
          },
        },

        //--------------------------------------------- [CLASS]
        {
          path: 'classes',
          name: 'Manage Classes',
          component: () => import('@/components/Admin/Class/ManageClass'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'classes/class/:id',
          name: 'Class',
          component: () => import('@/components/Admin/Class/Class'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'classes/add-user/:cId/:cName',
          name: 'Add User',
          component: () => import('@/components/Admin/Class/AddUser'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'classes/add-major',
          name: 'Add Major',
          component: () => import('@/components/Admin/Class/AddMajor'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'classes/add/:majorId/:majorName',
          name: 'Add Class',
          component: () => import('@/components/Admin/Class/AddClass'),
          meta:{
            adminLoginRequired: true
          },
        },

        //--------------------------------------------- [COURSE]
        {
          path: 'courses/course/:id',
          name: 'Course',
          component: () => import('@/components/Admin/Course/Course'),
          meta:{
            adminLoginRequired: true
          },
        },
        {
          path: 'courses/add-user/:cId/:cName',
          name: 'Course: Add User',
          component: () => import('@/components/Admin/Course/AddUser'),
          meta:{
            adminLoginRequired: true
          },
        }
      ]
    },

    {
      path: '/student',
      name: 'Student',
      redirect: '/student/dashboard',
      component: () => import('@/components/Layout'),
      children:[
        {
          path: 'dashboard',
          name: 'Student Dashboard',
          component: () => import('@/components/Dashboard/Dashboard'),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'class',
          name: 'Student Class',
          component: () => import('@/components/Student/Class'),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'course',
          name: 'Student Course',
          component: () => import('@/components/Teacher/Course'),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'bookviewer',
          name: 'Student Book Viewer',
          component: () => import(`@/components/PDFViewer/PDFViewer`),
          // component: () => import(`@/components/PDFViewer/test`),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'browse',
          name: 'Student Browse',
          component: () => import('@/components/Teacher/Browse'),
          meta:{
            loginRequired: true
          },
        },
      ]
    },

    {
      path: '/teacher',
      name: 'Teacher',
      redirect: '/teacher/dashboard',
      component: () => import('@/components/Layout'),
      children:[
        {
          path: 'dashboard',
          name: 'Student Dashboard',
          component: () => import(`@/components/Dashboard/Dashboard`),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'class',
          name: 'Teacher Class',
          component: () => import('@/components/Student/Class'),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'courses',
          name: 'Student Class',
          component: () => import('@/components/Teacher/Courses'),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'bookviewer',
          name: 'Book Viewer',
          component: () => import(`@/components/PDFViewer/PDFViewer`),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'course',
          name: 'Student Course',
          component: () => import('@/components/Teacher/Course'),
          meta:{
            loginRequired: true
          },
        },
        {
          path: 'browse',
          name: 'Student Browse',
          component: () => import('@/components/Teacher/Browse'),
          meta:{
            loginRequired: true
          },
        },
      ]
    },

    {
      path: '/pdfviewer',
      name: 'PDFViewer',
      component: () => import('@/components/PDFViewer/PDFViewer'),
      meta:{
        loginRequired: true
      },
    },
  ]
})
