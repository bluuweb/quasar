# Tasks en Windows

Veamos como realizar una App en Windows utilizando Vue Js con Quasar Framework.

::: tip Curso completo de VUE de cero a Experto!
Aprende Vue.js + Firebase + Node.js + MongoDB en un curso completo!
[Accede aquí](http://curso-vue-js-udemy.bluuweb.cl)
:::

## Instalación

En el video anterior revisamos qué es Quasar e instalamos nuestro primer proyecto: [Ver video aquí](https://www.youtube.com/watch?v=AFMDrML0aOQ)

En resumen:

```
quasar create nombre-proyecto
```

## Layout

Esta es la plantilla principal de nuestro proyecto, donde contamos con el menú de navegación y un navbar, además tenemos un componente muy importante que es el `<router-view />` para pintar nuestras páginas.

Vamos a limpiar el layout:

```html
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          App de notas
        </q-toolbar-title>

        <div>Ignacio Gutiérrez</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Menú de tareas</q-item-label>
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Notas</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
```

## Cambiar colores

Si elegiste utilizar scss puedes cambiar las variables de los colores en el archivo: `css/quasar.variables.scss`

```scss
$primary: rgb(11, 30, 47);
$secondary: #26a69a;
$accent: #9c27b0;

$positive: #21ba45;
$negative: #c10015;
$info: #31ccec;
$warning: #f2c037;
```

## Router

Por ahora no tocaremos las rutas de nuestra web pero es importante saber donde podemos modificarlas `router/routes.js` <b>Utilizaremos Index.vue que ya está preconfigurado</b>

```js{6}
const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
```

## Q-editor

Vamos a incorporar nuestro primer componente para poder agregar HTML a nuestras tareas [Documentación](https://quasar.dev/vue-components/editor#Examples)

```html
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-model="editor" min-height="5rem" />
    <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ editor }}</pre>
      </q-card-section>
    </q-card>
    <q-card flat bordered>
      <q-card-section v-html="editor" />
    </q-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editor: "What you see is <b>what</b> you get."
      };
    }
  };
</script>
```

Limpiando un poco

```html
<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- Editor -->
    <q-editor v-model="editor" min-height="5rem" />

    <!-- Donde se pinta -->
    <q-card flat bordered>
      <q-card-section v-html="editor" />
    </q-card>
  </div>
</template>
```

## Guardar Task

Agregaremos un boton para guardar: [Documentacion](https://quasar.dev/vue-components/editor#Example--Add-new-commands)

```html
<q-editor
  v-model="editor"
  :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          label: 'Save',
          handler: saveWork
        }
      }"
  :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
/>
```

```js
methods: {
  saveWork () {
    this.$q.notify({
      message: 'Saved your text to local storage',
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done'
    })
  },
}
```

Si ejecutamos la acción verán que nos aparece un error en consola, esto es porque nos falta agregar el plugins de notificaciones.

## Q Notify Plugins

1. Ingresa al [siguiente enlace aquí](https://quasar.dev/quasar-plugins/notify#Introduction)

2. Pega el código en `quasar.conf.js`

```js
// quasar.conf.js

return {
  framework: {
    plugins: ["Notify"]
  }
};
```

Prueba nuevamente el botón y ahora si deberías ver la notificación

## Tasks Array

Agregregaremos un array de objetos con nuestras tareas:

```js
data() {
  return {
    editor: '',
    tasks: [
      {texto: 'Tarea #1', estado: false},
      {texto: 'Tarea #2', estado: true},
      {texto: 'Tarea #3', estado: true},
    ]
  }
}
```

Y agreguemos su respectivo ciclo for:

```html
<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- Editor -->
    <q-editor v-model="editor" min-height="5rem" />

    <!-- Donde se pinta -->
    <q-card flat bordered v-for="(item, index) in tasks" :key="index">
      <q-card-section v-html="item.texto" />
    </q-card>
  </div>
</template>
```

## Q-btn y Flexbox

Utilizaremos flexbox y botones para agregar mayores funcionalidades [Documentación](https://quasar.dev/layout/grid/row#Example--Horizontal-alignment)

```html
<q-card
  flat
  bordered
  class="row justify-between"
  v-for="(item, index) in tasks"
  :key="index"
>
  <q-card-section
    v-html="item.texto"
    class="col"
    :class="item.estado ? 'tachar' : ''"
  >
  </q-card-section>
  <q-btn flat color="blue" @click="item.estado = !item.estado">Acción</q-btn>
  <q-btn flat color="red" @click="eliminar(index)">Eliminar</q-btn>
  <q-space />
</q-card>
```

Agregué una clase `tachar` para que de un efecto más bonito.

```html
<style>
  .tachar {
    text-decoration: line-through;
  }
</style>
```

## Eliminar Task

Agregaremos un método eliminar:

```js{8}
eliminar(index){
  this.$q.dialog({
    title: 'Cuidado!',
    message: 'Desea eliminar la nota?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    this.tasks.splice(index, 1);
  })
}
```

## Q Dialog plugins

Nuevamente agregar el plugins: [Documentación](https://quasar.dev/quasar-plugins/dialog#Installation)

```js
// quasar.conf.js

return {
  framework: {
    plugins: ["Dialog"]
  }
};
```

```js
confirm () {
  this.$q.dialog({
    title: 'Confirm',
    message: 'Would you like to turn on the wifi?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('>>>> OK')
  }).onOk(() => {
    // console.log('>>>> second OK catcher')
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
},
```

## Mensaje sin notas

Finalmente si no existen notas agregaremos un pequeño mensaje:

```html
<div v-if="tasks.length == 0" class="flex flex-center">
  <p class="text-h6">Sin notas</p>
</div>
```

## Compilar a windows

Abrir `quasar.conf.js` y agregar:

```js{10}
electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        platform: 'win32'
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'todo-1'
      }
    }
```

Ejecutar:
```
quasar build -m electron
```

## Problemas
En caso de fallar existen varias posibles soluciones:
1. Eliminar carpeta node_modules y volver a instalar los paquetes con `npm i`, si no funciona paso 2
2. Instalar `npm install --global windows-build-tools` en caso de que falle paso 3.
3. Instalar Chocolatey [https://quasar.dev/quasar-cli/developing-electron-apps/preparation#A-note-for-Windows-Users](https://quasar.dev/quasar-cli/developing-electron-apps/preparation#A-note-for-Windows-Users)

## Chocolatey
[https://chocolatey.org/install](https://chocolatey.org/install)
Es un gestor de paquetes para PowerShell v2+ su instalación:
1. Ejecutar PowerShell como administrador
2. Ejecutar: `Get-ExecutionPolicy` si devuelte: `Restricted` ejecutar: `Set-ExecutionPolicy AllSigned` o `Set-ExecutionPolicy Bypass -Scope Process`
3. Ahora ejecutar: `Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))`
4. Pff listo ejecuta: `choco` y deberías ver algo.

Ahora por fin instalar windows build tools
```
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString(‘https://chocolatey.org/install.ps1’))
```
Esto instalará: choco upgrade python2 visualstudio2017-workload-vctools

Probar nuevamente:
```
quasar build -m electron
```


