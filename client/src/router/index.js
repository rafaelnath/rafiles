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

    //--------ADMIN
    {
      path: '/admin-login',
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
          component: () => import('@/components/Admin/Dashboard')
        },

        //--------------------------------------------- [USER]
        {
          path: 'users',
          name: 'Manage User',
          component: () => import('@/components/Admin/ManageUser')
        },
        {
          path: 'edit-user/:id',
          name: 'Edit User',
          component: () => import('@/components/Admin/EditUser')
        },

        //--------------------------------------------- [BOOK]
        {
          path: 'books',
          name: 'Manage Books',
          component: () => import('@/components/Admin/Book/ManageBook')
        },
        {
          path: 'books/upload',
          name: 'Upload Book',
          component: () => import('@/components/Admin/Book/UploadBook')
        },
        {
          path: 'books/edit/:id',
          name: 'Edit Book',
          component: () => import('@/components/Admin/Book/EditBook')
        },

        //--------------------------------------------- [CLASS]
        {
          path: 'classes',
          name: 'Manage Classes',
          component: () => import('@/components/Admin/Class/ManageClass')
        },
        {
          path: 'classes/class/:id',
          name: 'Class',
          component: () => import('@/components/Admin/Class/Class')
        },
        {
          path: 'classes/add-user/:cId/:cName',
          name: 'Add User',
          component: () => import('@/components/Admin/Class/AddUser')
        },
        {
          path: 'classes/add-major',
          name: 'Add Major',
          component: () => import('@/components/Admin/Class/AddMajor')
        },
        {
          path: 'classes/add/:majorId/:majorName',
          name: 'Add Class',
          component: () => import('@/components/Admin/Class/AddClass')
        },

        //--------------------------------------------- [COURSE]
        {
          path: 'courses/course/:id',
          name: 'Course',
          component: () => import('@/components/Admin/Course/Course')
        },
        {
          path: 'courses/add-user/:cId/:cName',
          name: 'Course: Add User',
          component: () => import('@/components/Admin/Course/AddUser')
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
          component: () => import('@/components/Dashboard/Dashboard')
        },
        {
          path: 'class',
          name: 'Student Class',
          component: () => import('@/components/Student/Class')
        },
        {
          path: 'course',
          name: 'Student Course',
          component: () => import('@/components/Student/Course')
        },
        {
          path: 'bookviewer',
          name: 'Student Book Viewer',
          component: () => import(`@/components/PDFViewer/PDFViewer`)
        },
        {
          path: 'browse',
          name: 'Student Browse',
          component: () => import('@/components/Teacher/Browse')
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
        },
        {
          path: 'courses',
          name: 'Student Class',
          component: () => import('@/components/Teacher/Courses')
        },
        {
          path: 'bookviewer',
          name: 'Book Viewer',
          component: () => import(`@/components/PDFViewer/PDFViewer`)
        },
        {
          path: 'course',
          name: 'Student Course',
          component: () => import('@/components/Teacher/Course')
        },
        {
          path: 'browse',
          name: 'Student Browse',
          component: () => import('@/components/Teacher/Browse')
        },
      ]
    },

    {
      path: '/pdfviewer',
      name: 'PDFViewer',
      component: () => import('@/components/PDFViewer/PDFViewer')
    }
  ]
})
