angular.module('starter.controllers', ['ngResource'])//se anade la dependencia ngResource para el consumo rest

.service('ServUsuario', ['$http',function($http) {
    this.servicioUs = function(username,password) {
      var user=username;
      var password=password;
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/entidades.qrusuarios/userlogin?usuario=fmsoto');
    };
}])//Este ServUsuario se crea para hacer el logeo de usuarios, para ello en LoginCtrl se lo llama

.service('ServCompEdu', ['$http',function($http) {
    this.servicioCompEdu = function(cedula) {
      var ced=cedula;
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/entidades.qrcomponenteedu/componentes_docente?cedula='+ced+'&guid_pdo=12b33259-97c8-00be-e053-ac10360d00be');
    };
}])//Este ServCompEdu se crea para mostrar los componentes educativos, para ello en CrtlLista se lo llama enviando la cedula del user

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

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, ServUsuario, $rootScope, $ionicHistory) {
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
    $scope.show($ionicLoading);
    ServUsuario.servicioUs($scope.data.username,$scope.data.password).success(function(data){
      $scope.datos=data.rol;
      alert($scope.datos); //ingreso al json al token
      if($scope.datos=='true') {//si el token es true ingresa si no popUp de error
        $rootScope.cedula=data.persona.identificacion;
        $rootScope.pNombre=data.persona.primerNombre;
        $rootScope.sNombre=data.persona.segundoNombre;
        $rootScope.pApellido=data.persona.primerApellido;
        $rootScope.sApellido=data.persona.segundoApellido;  
        $state.go('tabs.perfil');
      } 
      else {
        var alertPopup = $ionicPopup.alert({
          title: 'Usuario o password incorrectos',
          template: 'Por favor intenta de nuevo!'
        });
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
.controller('SalirCtrl', function($scope, $state, $ionicPopup, ServUsuario,$rootScope,$ionicHistory) {
//para bloquear el boton atras
  $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
  });
  //FIN para bloquear el boton atras
  $scope.pNombre = $rootScope.pNombre;
  $scope.sNombre = $rootScope.sNombre;
  $scope.pApellido = $rootScope.pApellido;
  $scope.sApellido = $rootScope.sApellido;
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
        /*en caso de error
        $scope.pNombre=" ";
        $scope.sNombre=" ";
        $scope.pApellido=" ";
        $scope.sApellido=" ";*/
      } else {
        console.log('You are not sure');
      }
    });
  };  
  //FIN METODO SALIR
})

.controller('ControladorLista', ['$scope','$state','$rootScope','ServCompEdu','$ionicPopup','$ionicLoading','PostTuto','MostrarTuto'
  ,function($scope,$state, $rootScope, ServCompEdu, $ionicPopup,$ionicLoading,PostTuto,MostrarTuto){
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
  //TRAER COMPONENTES EDUCATIVOS
  $scope.cedula = $rootScope.cedula;
  $scope.show($ionicLoading);
  ServCompEdu.servicioCompEdu($scope.cedula).success(function(data){
    $scope.datos=data;
    $rootScope.nom_coe=$state.params.nom_coe;//esto es para ver la lista de tutorias
    $scope.cod_coe=$state.params.cod_coe;//esto es para ver la creacion de una tutoria
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
  //FIN TRAER COMPONENTES EDUCATIVOS
  //POSTEAR DATOS A SERVIDOR
  $scope.data = {}; //hace referencia al data de ResumenTutoria.html
  $scope.crearTutoria=function(){
    $scope.show($ionicLoading);
    PostTuto.servicioPostTuto($scope.data.tema,$scope.data.ubicacion,$scope.data.horario,$scope.nom_coe)
    .success(function(data){
      var alertPopup = $ionicPopup.alert({
        title: 'La tutoría ha sido creada'
      });
      $state.go('tabs.componentes');
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
        $scope.NombTuto=$scope.datosTuto[i].Nombre;
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