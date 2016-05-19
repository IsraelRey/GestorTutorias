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
    // PADRE DE VISTAS TABS DOCENTE
    .state('tabs',{
      cache: false,
      url:'/Gtuto',
      abstract:true,
      templateUrl:'templates/tabs.html'
    })
    //Hijos de TABS
    .state('tabs.perfilDocente', {
      cache: false,
      url:'/perfil',
      views:{
        'perfil-tab':{
          templateUrl:'templates/perfilDocente.html',
          controller:'SalirCtrl'
        }
      }
    })
    .state('tabs.CompDocente', {
      cache: false,
      url:'/componentes',
      views:{
        'componentes-tab':{
          templateUrl:'templates/CompDocente.html',
          controller:'ControladorLista'
        }
      }
    })    
    .state('tabs.ListaTutoDocente', {
      cache: false,
      url:'/componentes/:nom_coe',
      views:{
        'componentes-tab':{
          templateUrl:'templates/ListaTutoDocente.html',
          controller:'ControladorLista'
        }
      }
    })
    .state('tabs.CrearTutoria', {
      cache: false,
      url:'/componentes/:nom_coe/:cod_coe',
      views:{
        'componentes-tab':{
          templateUrl:'templates/CrearTutoria.html',
          controller:'ControladorLista'
        }
      }
    })
    .state('tabs.ContEdicionTuto', {
      cache: false,
      url:'/componentes/:Nom_coe/EdicionTutorias/:id',
      views:{
        'componentes-tab':{
          templateUrl:'templates/ContEdicionTuto.html',
          controller:'ControladorLista'
        }
      }
    })
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
    .state('tabs.notDoc', {
      cache: false,
      url:'/notificaciones',
      views:{
        'notificaciones-tab':{
          templateUrl:'templates/NotDoc.html',
          controller:'ControladorLista'
        }
      }
    })
    // PADRE DE VISTAS TABSEST ESTUDIANTE
    .state('tabsEst',{
      cache: false,
      url:'/Gtuto',
      abstract:true,
      templateUrl:'templates/tabsEst.html'
    })
    //Hijos de TABSEST
    .state('tabsEst.perfilEstudiante', {
      cache: false,
      url:'/perfilEst',
      views:{
        'perfil-tabsEst':{
          templateUrl:'templates/perfilEstudiante.html',
          controller:'SalirCtrl'
        }
      }
    })
    .state('tabsEst.CompEstudiante', {
      cache: false,
      url:'/componentesEst',
      views:{
        'componentes-tabsEst':{
          templateUrl:'templates/CompEstudiante.html',
          controller:'ControladorLista'
        }
      }
    })    
    .state('tabsEst.ListaTutoEstudiante', {
      cache: false,
      url:'/componentesEst/:nombre',
      views:{
        'componentes-tabsEst':{
          templateUrl:'templates/ListaTutoEstudiante.html',
          controller:'ControladorLista'
        }
      }
    })
    .state('tabsEst.notificaciones', {
      cache: false,
      url:'/notificacionesEst',
      views:{
        'notificaciones-tabsEst':{
          templateUrl:'templates/NotEst.html',
          controller:'ControladorLista'
        }
      }
    })
  $urlRouterProvider.otherwise('/login');
})
//FIN VISTAS