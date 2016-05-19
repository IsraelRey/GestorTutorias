angular.module('starter.controllers', ['ngResource'])//se anade la dependencia ngResource para el consumo rest

.service('ServRol', ['$http',function($http) {
    this.servicioRol = function(username) {
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/entidades.qrusuarios/userlogin?usuario='+username);
    };
}])//Este ServRol es creado para saber q rol tiene el usuario q ingresa a la app

.service('ServUsuario', ['$http',function($http) {
    this.servicioUs = function(username,password) {
      var user=username;
      var password=password;
      return $http.get('https://sica.utpl.edu.ec/auth?user='+user+'&pwd='+password);
    };
}])//Este ServUsuario se crea para hacer el logeo de usuarios, para ello en LoginCtrl se lo llama

.service('ServCompEdu', ['$http',function($http) {
    this.servicioCompEdu = function(cedula) {
      var ced=cedula;
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/entidades.qrcomponenteedu/componentes_docente?cedula='+ced+'&guid_pdo=12b33259-97c8-00be-e053-ac10360d00be');
    };
}])//Este ServCompEdu se crea para mostrar los componentes educativos, para ello en CrtlLista se lo llama enviando la cedula del user

.service('ServParalelos', ['$http',function($http) {
    this.servicioParalelos = function(guid_coe) {
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/entidades.qrhorario/horarios_componente?guid_coe='+guid_coe);
    };
}])//Este ServCompEdu se crea para mostrar los componentes del docente, para ello en CrtlLista se lo llama enviando la cedula del user

.service('ServCompEduEst', ['$http',function($http) {
    this.servicioCompEduEst = function(cedula) {
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/estudiante/componentesestudiante?pdo_guid=12b33259-97c8-00be-e053-ac10360d00be&cedula='+cedula);
    };
}])//Este ServCompEduEst se crea para mostrar los componentes del estudiante,el proceso es similar al del docente

.service('PostTuto', ['$http',function($http) {
    this.servicioPostTuto = function(tema,ubicacion,horario,nom_coe) {
      return $http({
              method: 'GET',
              url: 'http://carbono.utpl.edu.ec:8080/smartlandiotv2/webresources/entidades.datos/insert?apikey=3bff8615827f32442199fdb2ed4df4&trama={"Nombre":"'+tema+'","Apellido":"'+ubicacion+'","Sexo":"'+horario+'","Residencia":"'+nom_coe+'"}',
            });
    };
}])//Este servicioPostTuto se crea para enviar datos al servidor smartland, para ello recibo tema,ubicacion,horario e id del componente

.service('MostrarTuto', ['$http',function($http) {
    this.servicioMostrarTuto = function() {
      return $http.get('http://carbono.utpl.edu.ec:8080/smartlandiotv2/webresources/entidades.datos/get?apikey=3bff8615827f32442199fdb2ed4df4');
    };
}])//Este ServMostrarTuto se crea para mostrar las tutorias creadas. Ademas esta funcion no recibe parametros

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, ServRol, ServUsuario, $rootScope, $ionicHistory) {
  //INICIO LOADING
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  //FIN LOADING
  //METODO LOGIN
  $scope.data = {}; //hace referencia al data de login.html
  $scope.login = function() { 
    //para bloquear el boton atras
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    //FIN para bloquear el boton atras
    ServRol.servicioRol($scope.data.username).success(function(data){
      $scope.rol=data.rol;
    })
    $scope.show($ionicLoading);
    ServUsuario.servicioUs($scope.data.username,$scope.data.password).success(function(data){
      $scope.datos=data.token; //ingreso al token del json
      if($scope.datos=='true' && $scope.rol=='docente') {//si el token es true ingresa si no popUp de error
        $rootScope.cedula=data.persona.identificacion;
        $rootScope.pNombre=data.persona.primerNombre;
        $rootScope.sNombre=data.persona.segundoNombre;
        $rootScope.pApellido=data.persona.primerApellido;
        $rootScope.sApellido=data.persona.segundoApellido;  
        $state.go('tabs.perfilDocente');
      } 
      else {
        if($scope.datos=='true' && $scope.rol=='estudiante') {//si el token es true ingresa si no popUp de error
          $rootScope.cedula=data.persona.identificacion;//las variables con rootscope tb pueden ser llamadas con scope.cedula x ej.
          $rootScope.pNombre=data.persona.primerNombre;
          $rootScope.sNombre=data.persona.segundoNombre;
          $rootScope.pApellido=data.persona.primerApellido;
          $rootScope.sApellido=data.persona.segundoApellido;  
          $state.go('tabsEst.perfilEstudiante');
        }else{
          var alertPopup = $ionicPopup.alert({
            title: 'Usuario o password incorrectos',
            template: 'Por favor intenta de nuevo!'
          });
        }        
      }
    })
    .error(function(data){
      var alertPopup = $ionicPopup.alert({
        title: 'Error en la comunicación con el servidor'
      });
    })
    .finally(function($ionicLoading) { 
      // ocultar ionicloading
      $scope.hide($ionicLoading);  
    }); 
  };  
  //FIN METODO LOGIN
})
.controller('SalirCtrl', function($scope, $state, $ionicPopup,$rootScope,$ionicHistory) {
//para bloquear el boton atras
  $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
  });
  //FIN para bloquear el boton atras
  //METODO SALIR
  $scope.salir = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Cerrar sesión',
      template: '¿Cerrar sesión ahora?'
    });  
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $state.go('login');
      } else {
        console.log('You are not sure');
      }
    });
  };  
  //FIN METODO SALIR
})

.controller('ControladorLista', ['$scope','$state','$rootScope','ServCompEdu','$ionicPopup','$ionicLoading'
  ,'PostTuto','MostrarTuto','ServCompEduEst','ServParalelos'
  ,function($scope,$state, $rootScope, ServCompEdu, $ionicPopup,$ionicLoading,PostTuto,MostrarTuto,ServCompEduEst,ServParalelos){
  //LOADING
  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
        $ionicLoading.hide();
  };
  //FIN LOADING
  //TRAER COMPONENTES EDUCATIVOS DOCENTE
  $scope.cedula = $rootScope.cedula;
  $scope.show($ionicLoading);
  ServCompEdu.servicioCompEdu($scope.cedula).success(function(data){
    $scope.datosComp=data;
    $rootScope.nom_coe=$state.params.nom_coe;//esto es para ver la lista de tutorias
    $scope.cod_coe=$state.params.cod_coe;//esto es para ver la creacion de una tutoria
    var Tamanio = $scope.datosComp.length;    
    for ( i=0; i < Tamanio; i++) { 
      $scope.guid_coe =$scope.datosComp[i].guid_coe;
      ServParalelos.servicioParalelos($scope.guid_coe).success(function(data){
        $scope.datosA=data;
        var T = $scope.datosA.length;
        for ( i=0; i < T; i++) {
          //alert($scope.datosA[i].paralelo + $scope.datosA[i].dia)
        }
      })
    };
  })
  .error(function(data){
    var alertPopup = $ionicPopup.alert({
      title: 'Error al obtener los componentes educativos'
    });
  })
  .finally(function($ionicLoading) { 
    // ocultar ionicloading
    $scope.hide($ionicLoading);  
  });
  //TRAER COMPONENTES EDUCATIVOS DOCENTE
  //TRAER COMPONENTES EDUCATIVOS ESTUDIANTE
  $scope.show($ionicLoading);
  ServCompEduEst.servicioCompEduEst($scope.cedula).success(function(data){
    $scope.datosCompEst=data;
    $rootScope.nombre=$state.params.nombre;//esto es para ver la lista de tutorias
  })
  .error(function(data){
    var alertPopup = $ionicPopup.alert({
      title: 'Error al obtener los componentes educativos'
    });
  })
  .finally(function($ionicLoading) { 
    // ocultar ionicloading
    $scope.hide($ionicLoading);  
  });
  //FIN TRAER COMPONENTES EDUCATIVOS ESTUDIANTE
  //POSTEAR DATOS A SERVIDOR
  $scope.data = {}; //hace referencia al data de ResumenTutoria.html
  $scope.crearTutoria=function(){
    $scope.show($ionicLoading);
    PostTuto.servicioPostTuto($scope.data.tema,$scope.data.ubicacion,$scope.data.horario,$scope.nom_coe)
    .success(function(data){
      var alertPopup = $ionicPopup.alert({
        title: 'La tutoría ha sido creada'
      });
      $state.go('tabs.CompDocente');
    })
    .error(function(data){
      var alertPopup = $ionicPopup.alert({
        title: 'Error tutoría no creada'
      });
    })
    .finally(function($ionicLoading) { 
      // ocultar ionicloading
      $scope.hide($ionicLoading);  
    }); 
  };
  //FIN POSTEAR DATOS A SERVIDOR
  //TRAER TUTORIAS CREADAS
  MostrarTuto.servicioMostrarTuto().success(function(data){
    $scope.datosTuto=data;
    $scope.Nom_coe = $rootScope.nom_coe;
    $scope.id=$state.params.id;
    var TamanioURI = $scope.datosTuto.length;
    $scope.cont=0;
    for ( i=0; i < TamanioURI; i++) {  
      if ($scope.nom_coe == $scope.datosTuto[i].Residencia){
        $scope.cont++;//se lo crea para mostrar cuantas tutorias se van creando x componente
      };
    };
  })
  .error(function(data){
    var alertPopup = $ionicPopup.alert({
      title: 'Error al obtener las tutorias creadas'
    });
  });
  //FIN TRAER TUTORIAS CREADAS
  //EDITAR TUTORIA
  $scope.editarTutoria=function(t,u,h){
    alert(t+"\n"+u+"\n"+h);
  };
  //EDITAR TUTORIA
}]);