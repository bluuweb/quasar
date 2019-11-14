module.exports = {
  title: 'Quasar Framework',
  description: 'Aprende a utilizar Quasar Framework en tus proyectos web',
  base: '/quasar/',
  locales:{
    '/':{
      lang: 'es-ES'
    }
  },
  themeConfig:{
    nav: [
      { text: 'Guía', link: '/' },
      { text: 'Youtube', link: 'https://youtube.com/bluuweb' },
    ],
    sidebar:
      [
        '/',
        '/todo-windows/',
        '/auth-firebase/',
        '/crud-firestore/',
      ]
  }
 
}