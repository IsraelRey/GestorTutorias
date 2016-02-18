// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
//VISTAS
.config(function($stateProvider, $urlRouterProvider) {  
  $stateProvider
    //Login de la APP
    .state('login',{
      cache: false,
      url:'/login',
      templateUrl:'templates/login.html',
      controller: 'LoginCtrl'
    })
    // Se crea un padre de vista en este caso tabs
    .state('tabs',{
      cache: false,
      url:'/Gtuto',
      abstract:true,
      templateUrl:'templates/tabs.html'
    })
    //Hijos de TABS
    //PERFIL TAB
    .state('tabs.perfil', {
      cache: false,
      url:'/perfil',
      views:{
        'perfil-tab':{
          templateUrl:'templates/perfil.html',
          controller:'SalirCtrl'
        }
      }
    })
    //Componentes TAB
    .state('tabs.componentes', {
      cache: false,
      url:'/componentes',
      views:{
        'componentes-tab':{
          templateUrl:'templates/componentes.html',
          controller:'ControladorLista'
        }
      }
    })    
    .state('tabs.ListaSemanalesTutorias', {
      cache: false,
      url:'/componentes/:nom_coe',
      views:{
        'componentes-tab':{
          templateUrl:'templates/ListaSemanalesTutorias.html',
          controller:'ControladorLista'
        }
      }
    })
    .state('tabs.ResumenTutoria', {
      cache: false,
      url:'/componentes/:nom_coe/:cod_coe',
      views:{
        'componentes-tab':{
          templateUrl:'templates/ResumenTutoria.html',
          controller:'ControladorLista'
        }
      }
    })
    //contenido
    .state('tabs.contenido', {
      cache: false,
      url:'/componentes/:Nom_coe/EdicionTutorias/:id',
      views:{
        'componentes-tab':{
          templateUrl:'templates/contenido.html',
          controller:'ControladorLista'
        }
      }
    })
    //comentarios
    .state('tabs.comentarios', {
      cache: false,
      url:'/componentes/:componentesId/:c/:f/:d',
      views:{
        'componentes-tab':{
          templateUrl:'templates/comentarios.html',
          controller:'ControladorLista'
        }
      }
    })
    //participantes
    .state('tabs.participantes', {
      cache: false,
      url:'/componentes/:componentesId/:c/:f/:d/:e',
      views:{
        'componentes-tab':{
          templateUrl:'templates/participantes.html',
          controller:'ControladorLista'
        }
      }
    })
    //Notificaciones TAB
    .state('tabs.notificaciones', {
      cache: false,
      url:'/notificaciones',
      views:{
        'notificaciones-tab':{
          templateUrl:'templates/notificaciones.html',
          controller:'ControladorLista'
        }
      }
    })
  $urlRouterProvider.otherwise('/login');
})
//FIN VISTAS