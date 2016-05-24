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
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/entidades.qrcomponenteedu/componentes_horario_docente?cedula='+ced+'&guid_pdo=12b33259-97c8-00be-e053-ac10360d00be');
    };
}])//Este ServCompEdu se crea para mostrar los componentes educativos, para ello en CrtlLista se lo llama enviando la cedula del user

.service('ServCompEduEst', ['$http',function($http) {
    this.servicioCompEduEst = function(cedula) {
      return $http.get('http://carbono.utpl.edu.ec:8080/wscodigosqr/webresources/estudiante/componentesestudiante?pdo_guid=12b33259-97c8-00be-e053-ac10360d00be&cedula='+cedula);
    };
}])//Este ServCompEduEst se crea para mostrar los componentes del estudiante,el proceso es similar al del docente

.service('PostTuto', ['$http',function($http) {
    this.servicioPostTuto = function(tema,ubicacion,horario,nom_coe,paralelo) {
      return $http({
              method: 'GET',
              url: 'http://carbono.utpl.edu.ec:8080/smartlandiotv2/webresources/entidades.datos/insert?apikey=3bff8615827f32442199fdb2ed4df4&trama={"Nombre":"'+tema+'","Apellido":"'+ubicacion+'","Sexo":"'+horario+'","Residencia":"'+nom_coe+'","Integrantes":"'+paralelo+'"}',
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
        $rootScope.NombreDoc=$rootScope.pNombre.substring(0, 1);//variable para mostrar en perfil de docente
        $rootScope.sNombre=data.persona.segundoNombre;
        $rootScope.pApellido=data.persona.primerApellido;
        $rootScope.sApellido=data.persona.segundoApellido;  
        $state.go('tabs.perfilDocente');
      } 
      else {
        if($scope.datos=='true' && $scope.rol=='estudiante') {//si el token es true ingresa si no popUp de error
          $rootScope.cedula=data.persona.identificacion;//las variables con rootscope tb pueden ser llamadas con scope.cedula x ej.
          $rootScope.pNombre=data.persona.primerNombre;
          $rootScope.NombreEst=$rootScope.pNombre.substring(0, 1);//variable para mostrar en perfil de estudiante
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

.controller('DocenteCtrl', ['$scope','$state','$rootScope','ServCompEdu','$ionicPopup','$ionicLoading'
  ,'PostTuto','MostrarTuto'
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
  //TRAER COMPONENTES EDUCATIVOS DOCENTE  para ello se llama al ServCompEdu
  $scope.cedula = $rootScope.cedula;
  $scope.show($ionicLoading);
  ServCompEdu.servicioCompEdu($scope.cedula).success(function(data){
    $scope.datosComp=data;
    $scope.nom_coe=$state.params.nom_coe;//esto es para ver la lista de tutorias
    $scope.paralelo=$state.params.paralelo;//esto es para ver la creacion de una tutoria
    $scope.Ce= $scope.datosComp.length;//variable q muestra el numero de comp educativos
    var TamDatosComp = $scope.datosComp.length;
    $rootScope.obtParalelo = [];//creo est arrego para guardar el nom_coe  y paralelo 
    for ( i=0; i < TamDatosComp; i++) {
      for( j=0; j < $scope.datosComp[i].paralelos.length; j++){
        $rootScope.obtParalelo.push({nom_coe:$scope.datosComp[i].nom_coe,
                                paralelo: $scope.datosComp[i].paralelos[j].paralelo});
      }
    }
    //actualizar lista
    $scope.doRefresh = function() {
      ServCompEdu.servicioCompEdu($scope.cedula).success(function(data){
        $scope.datosComp=data;
        $scope.$broadcast('scroll.refreshComplete');        
      })
    };
    //fin actualizar lista
    //TRAER TUTORIAS CREADAS para ello se llama al MostrarTuto
    MostrarTuto.servicioMostrarTuto().success(function(data){
      $scope.datosTuto=data;
      $scope.Nom_coe = $scope.nom_coe;
      $scope.id=$state.params.id;
      var TamDatosTuto= $scope.datosTuto.length;
      $scope.cont=0;
      for ( j=0; j < $rootScope.obtParalelo.length; j++) { //recorro el arreglo y veo si pertenece al nom_coe actual
        if ($scope.nom_coe == $rootScope.obtParalelo[j].nom_coe){
          $scope.paralelo= $rootScope.obtParalelo[j].paralelo;//paralelo es creado para filtrar las tutorias
        }                 
      }
      for ( i=0; i < TamDatosTuto; i++) {  
        if ($scope.nom_coe == $scope.datosTuto[i].Residencia && $scope.paralelo == $scope.datosTuto[i].Integrantes){
          $scope.cont++;//se lo crea para mostrar cuantas tutorias se van creando x componente y paralelo
        }
      }
    })
    //FIN TRAER TUTORIAS CREADAS
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
  //FIN TRAER COMPONENTES EDUCATIVOS DOCENTE
  //POSTEAR DATOS A SERVIDOR
  $scope.data = {}; //hace referencia al data de ResumenTutoria.html
  $scope.crearTutoria=function(){
    $scope.show($ionicLoading);
    PostTuto.servicioPostTuto($scope.data.tema,$scope.data.ubicacion,$scope.data.horario,$scope.nom_coe,$scope.paralelo)
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
  //EDITAR TUTORIA
  $scope.editarTutoria=function(t,u,h){
    alert(t+"\n"+u+"\n"+h);
  };
  //EDITAR TUTORIA
}])

.controller('AlumnoCtrl', ['$scope','$state','$rootScope','$ionicPopup','$ionicLoading'
  ,'ServCompEduEst','MostrarTuto'
  ,function($scope,$state, $rootScope,$ionicPopup,$ionicLoading,ServCompEduEst,MostrarTuto){
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
  //TRAER COMPONENTES EDUCATIVOS ESTUDIANTE
  $scope.cedula = $rootScope.cedula;
  $scope.show($ionicLoading);
  ServCompEduEst.servicioCompEduEst($scope.cedula).success(function(data){
    $scope.datosCompEst=data;
    $scope.nombre=$state.params.nombre;//esto es para ver la lista de tutorias
    $scope.ceEst= $scope.datosCompEst.length;//variable q muestra el numero de comp educativos
    var TamdatosCompEst = $scope.datosCompEst.length;
    $rootScope.obtParaleloEst = [];//creo est arrego para guardar la materia  y paralelo 
    for ( i=0; i < TamdatosCompEst; i++) {
      for( j=0; j < $scope.datosCompEst[i].paralelos.length; j++){
        $rootScope.obtParaleloEst.push({materia:$scope.datosCompEst[i].nombre,
                                paralelo: $scope.datosCompEst[i].paralelos[j].nombre});
      }
    }
    //TRAER TUTORIAS CREADAS para ello se llama al MostrarTuto
    MostrarTuto.servicioMostrarTuto().success(function(data){
      $scope.datosTuto=data;
      var TamDatosTutoEst= $scope.datosTuto.length;
      $scope.contEst=0;
      for ( i=0; i < $rootScope.obtParaleloEst.length; i++) { //recorro el arreglo y veo si pertenece al nom_coe actual
        if ($scope.nombre == $rootScope.obtParaleloEst[i].materia){
          $scope.paraleloEst= $rootScope.obtParaleloEst[i].paralelo;//paraleloEst es creado para filtrar las tutorias
        }                 
      }
      for ( i=0; i < TamDatosTutoEst; i++) {  
        if ($scope.nombre == $scope.datosTuto[i].Residencia && $scope.paraleloEst == $scope.datosTuto[i].Integrantes){
          $scope.contEst++;//se lo crea para mostrar cuantas tutorias se van creando x componente y paralelo
        }
      }
    })
    //FIN TRAER TUTORIAS CREADAS 
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
}]);