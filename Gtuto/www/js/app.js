// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db = null;//paso 1 BD
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform, $cordovaSQLite,$state) {//paso 2 agrego cordovaSqlite
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
      //creo la tabla tutoria
      db = $cordovaSQLite.openDB({ name: 'tuto.db' });//paso 3 creo  la BD
      $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS tutoria (id integer primary key, estado text, rolUs text, pNombre text, Inicial text, sNombre text, pApellido text, sApellido text, cedula text)");
      //fin creo la tabla tutoria
      //comprobar sesion
      var query = "SELECT * FROM tutoria";
      $cordovaSQLite.execute(db,query).then(function(result) {
        for ( j=0; j < result.rows.length; j++) { 
          if(result.rows.item(j).estado=="Sesion_Activa" && result.rows.item(j).rolUs=="docente"){
            $state.go('tabs.perfilDocente');
          }else{
            if(result.rows.item(j).estado=="Sesion_Activa" && result.rows.item(j).rolUs=="estudiante"){
              $state.go('tabsEst.perfilEstudiante');
            }
          }               
        }
        if (result.rows.length==0){
          $state.go('login');
        };
      });
      //fin comprobar sesion
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
//VISTAS
.config(function($stateProvider, $urlRouterProvider) {  
  $stateProvider
    .state('inicio',{
      url:'/inicio',
      templateUrl:'templates/inicio.html',
      controller: 'InicioCtrl'
    })
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
          controller:'DocenteCtrl'
        }
      }
    })    
    .state('tabs.ListaTutoDocente', {
      cache: false,
      url:'/componentes/:nom_coe',
      views:{
        'componentes-tab':{
          templateUrl:'templates/ListaTutoDocente.html',
          controller:'DocenteCtrl'
        }
      }
    })
    .state('tabs.CrearTutoria', {
      cache: false,
      url:'/componentes/:nom_coe/:paralelo',
      views:{
        'componentes-tab':{
          templateUrl:'templates/CrearTutoria.html',
          controller:'DocenteCtrl'
        }
      }
    })
    .state('tabs.ContEdicionTuto', {
      cache: false,
      url:'/componentes/:Nom_coe/EdicionTutorias/:id',
      views:{
        'componentes-tab':{
          templateUrl:'templates/ContEdicionTuto.html',
          controller:'DocenteCtrl'
        }
      }
    })
    .state('tabs.comentarios', {
      cache: false,
      url:'/componentes/:componentesId/:c/:f/:d',
      views:{
        'componentes-tab':{
          templateUrl:'templates/comentarios.html',
          controller:'DocenteCtrl'
        }
      }
    })
    .state('tabs.participantes', {
      cache: false,
      url:'/componentes/:componentesId/:c/:f/:d/:e',
      views:{
        'componentes-tab':{
          templateUrl:'templates/participantes.html',
          controller:'DocenteCtrl'
        }
      }
    })
    .state('tabs.notDoc', {
      cache: false,
      url:'/notificaciones',
      views:{
        'notificaciones-tab':{
          templateUrl:'templates/NotDoc.html'
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
          controller:'AlumnoCtrl'
        }
      }
    })    
    .state('tabsEst.ListaTutoEstudiante', {
      cache: false,
      url:'/componentesEst/:nombre',
      views:{
        'componentes-tabsEst':{
          templateUrl:'templates/ListaTutoEstudiante.html',
          controller:'AlumnoCtrl'
        }
      }
    })
    .state('tabsEst.notificaciones', {
      cache: false,
      url:'/notificacionesEst',
      views:{
        'notificaciones-tabsEst':{
          templateUrl:'templates/NotEst.html'
        }
      }
    })
  $urlRouterProvider.otherwise('/inicio');
})
//FIN VISTAS