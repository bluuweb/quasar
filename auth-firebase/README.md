# Auth con Firebase

::: tip Curso completo de VUE de cero a Experto!
Aprende Vue.js + Firebase + Node.js + MongoDB en un curso completo!
[Accede aquí](http://curso-vue-js-udemy.bluuweb.cl)
:::


## Instalar Firebase
```
npm i firebase
```

## Configurar boot
Crear dentro de carpeta boot un archivo llamado firebase.js
```js
import * as firebase from "firebase/app"

import "firebase/firestore"
import "firebase/auth"

// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
}

let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let db = firebase.firestore();

export { firebaseAuth, db }
```

Abrir quasar.conf.js y agregar:
```js
boot: [
  'axios',
  'firebase'
],
```

## Ruta Login
Abrir router->routes.js y agregar una nueva página:
```js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', 
      component: () => import('pages/Index.vue') 
      },
      { 
        path: '/auth', 
        component: () => import('pages/PageAuth.vue') 
      }
    ]
  }
]
```

## Página Login
```html
<template>
  <div class="q-pa-md">
    <q-btn v-if="!loggedIn">LogIn</q-btn>
     <q-btn v-else @click="logoutUser">Logout</q-btn>
    <q-btn v-if="!loggedIn">LogUp</q-btn>
    {{loggedIn}}
    <form @submit.prevent="submitForm">
      <q-input v-model="formData.email" label="Ingrese correo"></q-input>
      <q-input v-model="formData.password" label="Ingrese password"></q-input>
      <q-btn type="submit">Ingresar</q-btn>
    </form>
  </div>
</template>
```

```js
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      formData: {email: 'test@bluuweb.cl', password: '123123'}
    }
  },
  methods:{
    ...mapActions('auth', ['loginUser','logoutUser']),
    submitForm(){
      console.log('funciona form');
      this.loginUser(this.formData)
    }
  },
  computed: {
    ...mapState('auth', ['loggedIn'])
  }
}
```

## Vuex
Crear archivo store-auth.js en la carpeta store
```js
import {firebaseAuth} from 'boot/firebase'

const state = {
  loggedIn: false
}
const mutations = {
  setLoggedIn(state, value){
    state.loggedIn = value
  }
}
const actions = {
  loginUser({commit}, payload){
    firebaseAuth.signInWithEmailAndPassword(
      payload.email, payload.password
    )
    .then(response => {
      console.log('response', response);
    })
    .catch(e => {
      console.log(e);
    })
  },
  logoutUser(){
    firebaseAuth.signOut()
  },
  handleAuthStateChange({commit, dispatch}){
    firebaseAuth.onAuthStateChanged(user => {
      if(user){
        commit('setLoggedIn', true)
        localStorage.setItem('loggedIn', true)
      }else{
        commit('setLoggedIn', false);
        localStorage.getItem('loggedIn', false)
      }
    })
  }
}
const getters = {

}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
```

Configurar modulo index.js en carpeta store
```js
import Vue from 'vue'
import Vuex from 'vuex'

import auth from './store-auth'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth
    },
    strict: process.env.DEV
  })

  return Store
}

```

## Configurar App.vue
```js
<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods:{
    ...mapActions('auth', ['handleAuthStateChange'])
  },
  mounted(){
    this.handleAuthStateChange()
  }
}
</script>
```

## Rutas protegidas
Crear archivo router-auth dentro de la carpeta boot
```js
import {firebaseAuth} from 'boot/firebase'

export default ({router}) => {
  router.beforeEach((to, from, next) => {
    firebaseAuth.onAuthStateChanged(user => {
      if( !user && to.path !== '/auth'){
        next('/auth')
      }else{
        // console.log(loggedIn);
        next()
      }    
    })
  })
}
```

Modificar quasar.conf.js
```js
boot: [
  'axios',
  'firebase',
  'router-auth'
],
```