# CRUD Firestore
Veamos como realizar un crud utilizando Quasar y Vuex.

## Boot Firebase
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

No olividar agregar a quasar.conf.js:
```js{3}
boot: [
  'axios',
  'firebase',
  'router-auth'
],
```

## Store Module
Crear module store-crud para utilizar Vuex:
```js
import crud from './store-crud'
Vue.use(Vuex)
export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,crud
    },
```

## GET
```js
import Vue from 'vue'
import { db } from "boot/firebase";

const state = {
  task: {}
}
const mutations = {
  getTask(state, payload){
    // Comprobamos si tiene alguna tarea!
    if(payload){
      state.task = payload
    }else{
      state.task = {}
    }
  },
}
const actions = {
  async getTask({commit, rootState, state}, payload){
    try {
      const query = await db.collection("tasks")
                            .where("uid", "==", rootState.auth.user)
                            .get()
      query.forEach(doc => {
        let payload = {
          id: doc.id,
          taskDB: doc.data()
        }
        commit('addTask', payload);
      });
    } catch (error) {
      console.log(error);
    }
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

## ADD
```js
const mutations = {
  addTask(state, payload) {
    Vue.set(state.task, payload.id, payload.taskDB)
  }
}
const actions = {
  async addTask({commit, rootState}, task){
    try {
      
      task.uid = rootState.auth.user
      const docRef = await db.collection('tasks').add(task)
      // console.log(docRef);
      const payload = {
        id: docRef.id,
        taskDB: task
      }
      commit('addTask', payload);
    } catch (error) {
      console.log(error);
    }
  },
}
```

## UPDATE
```js
const mutations = {
  updateTask(state, payload){
    Object.assign(state.task[payload.id], {fecha: payload.fecha, complete: payload.complete})
  },
}
const actions = {
  async editTask({commit, rootState}, task){
    try {
      const docRef = await db.collection('tasks').doc(task.id).update({
        complete: task.complete, fecha: Date.now()
      })
      commit('updateTask', {id: task.id, complete: task.complete, fecha: Date.now()})
    } catch (error) {
      console.log(error);
    }
  },
}
```

## DELETE
```js
const mutations = {
  deleteTask(state, id){
    Vue.delete(state.task, id)
  }
}
const actions = {
  async deleteTask({commit}, id){
    try {
      const docRef = await db.collection('tasks').doc(id).delete();
      commit('deleteTask', id);
    } catch (error) {
      console.log(error);
    }
  }
}
```

## Crear Pages Crud
```html
<template>
  <div>
    <q-btn @click="Agregar">Agregar</q-btn>
    <ul>
      <li v-for="(item, index) in task" :key="index">
        {{index}} - {{item}} 
        <q-btn round color="warning" icon="shopping_cart" @click="editTask({id:index, complete: !item.complete})" />
        <q-btn round color="red" icon="shopping_cart" @click="deleteTask(index)" />
      </li>
    </ul>
  </div>
</template>
```
```js
import { mapActions, mapState } from "vuex";
import {db} from 'boot/firebase'
export default {
  computed:{
    ...mapState('crud', ['task'])
  },
  created() {
    this.getTask();
  },
  methods:{
    ...mapActions('crud', ['getTask', 'addTask','editTask','deleteTask']),
    async Agregar(){
      let nota = {
        complete: false,
        fecha: Date.now(),
        name: 'Nota Estática'
      }
      this.addTask(nota);
    }
  },
}
```