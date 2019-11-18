# Tasks Firebase

Vamos adaptar nuestro proyecto anterior [Tasks en Windows](https://bluuweb.github.io/quasar/todo-windows/)
con Firebase / Firestore

## Boot

Si nos fijamos en nuestro directorio de carpetas existe una llamada `boot` aquí vamos a crear un archivo llamado `firebase.js`, recuerde antes crear un nuevo proyecto en su consola de [firebase](https://console.firebase.google.com/)

```js
import * as firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };
```

Luego en nuestro archivo `quasar.conf.js` añadimos este archivo:

```js
boot: [
  'axios', 'firebase'
],
```

## Array Tasks

Nuestro array de Tasks lo modificaremos de la siguiente manera:

```js
tasks: [
  {
    id: "idTask",
    texto: "Aquí irá el texto de la nota",
    estado: false
  }
];
```

## GET Tasks

Crearemos el siguiente método:

```js{1}
import { db } from "boot/firebase"; // no olvidar importar db

async leerDatos(){
  try {
    this.$q.loading.show()
    const query = await db.collection('metas').get();
    query.forEach(element => {
      let task = {id: element.id, texto: element.data().texto, estado: element.data().estado}
      this.tasks.push(task);
    });
  } catch (error) {
    console.log(error);
  } finally {
    this.$q.loading.hide()
  }
},
```

Además de llamarlo en `created()`:

```js
created(){
  this.leerDatos()
},
```

## POST Task

Modificaremos el siguiente método:

```js
async saveWork () {
  try {
    this.$q.loading.show()
    const query = await db.collection('metas').add({
      texto: this.editor,
      estado: false
    })
    this.tasks.push({
      texto: this.editor,
      estado: false,
      id: query.id
    })
    this.editor = ''
    this.$q.notify({
      message: 'Tarea Guardada con éxito!',
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done'
    })
  } catch (error) {
    this.$q.notify({
      message: error,
      color: 'red',
      textColor: 'white',
      icon: 'clear'
    })
  } finally {
    this.$q.loading.hide()
  }
},
```

## DELETE Task
Agregar botón:
```html
<q-btn flat color="red" @click="eliminar(index, item.id)">Eliminar</q-btn>
```
```js
eliminar(index, id){
  this.$q.dialog({
    title: 'Cuidado!',
    message: 'Desea eliminar la nota?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      this.$q.loading.show()
      const query = await db.collection('metas').doc(id).delete()
      this.tasks.splice(index, 1);
    
    } catch (error) {
      this.$q.notify({
        message: error,
        color: 'red',
        textColor: 'white',
        icon: 'clear'
      })
    } finally {
      this.$q.loading.hide()
    }
  })
}
```

## UPDATE Task
Agregar boton y nuevo editor:
```html
<q-editor
  v-else
  v-model="editor"
  min-height="5rem"
  :definitions="{
    save: {
      tip: 'Actualizar nota',
      icon: 'save',
      label: 'Actualizar',
      handler: updateWork
    }
  }"
  :toolbar="[
    ['bold', 'italic', 'strike', 'underline','unordered', 'ordered'],
    ['save']
  ]"
/>

<q-btn flat color="yellow" @click="editar(index, item.id)">Editar</q-btn>
```

Datos:
```js
data() {
  return {
    editor: '',
    tasks: [],
    index: null,
    modoEdicion: false,
    id: null
  }
},
```

Métodos:
```js
editar(index, id){
  this.editor = this.tasks[index].texto
  this.index = index;
  this.modoEdicion = true;  
  this.id = id;
},
async updateWork(){
  try {
    this.$q.loading.show()
    const query = await db.collection('metas').doc(this.id).update({
      texto: this.editor
    })

    this.tasks[this.index].texto = this.editor;
    this.index = null;
    this.modoEdicion = false;  
    this.id = null;
    this.editor = ''
    this.$q.notify({
      message: 'Tarea actualizada con éxito!',
      color: 'dark',
      textColor: 'white',
      icon: 'cloud_done'
    })
  } catch (error) {
    this.$q.notify({
      message: error,
      color: 'red',
      textColor: 'white',
      icon: 'clear'
    })
  } finally {
    this.$q.loading.hide()
  }
},
```


