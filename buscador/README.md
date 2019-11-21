# Buscador
Veamos como realizar un simple buscador de nuestras tareas.

::: tip Curso completo de VUE de cero a Experto!
Aprende Vue.js + Firebase + Node.js + MongoDB en un curso completo!
[Accede aquí](http://curso-vue-js-udemy.bluuweb.cl)
:::

Basados en nuestro proyecto anterior, agregaremos:

## Input Quasar
```html
<q-input filled  label="Buscar..." v-model="filtro" />
```

## Data
```js
notasFiltradas: [],
texto: ''
```

## Created
```js
created(){
  this.listarTareas();
  this.notasFiltradas = this.tasks
},
```

## Computed
```js
computed:{
  filtro:{
    get(){
      return this.texto
    },
    set(value){
      console.log('filtro ejecutado!');
      value = value.toLowerCase();
      this.notasFiltradas = this.tasks.filter(nota => nota.texto.toLowerCase().indexOf(value) !== -1)
      this.texto = value
    }
  }
},
```

## Reemplazar v-for
```html
<q-card 
  class="row"
  flat bordered 
  v-for="(item, index) in notasFiltradas" :key="index">
```