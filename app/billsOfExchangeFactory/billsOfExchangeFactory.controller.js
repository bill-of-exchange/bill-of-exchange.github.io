(function () { // < (!) use this pattern in all controllers

    'use strict';
    var controller_name = "cryptonomica.controller.billsOfExchangeFactory";
    var controller = angular.module(controller_name, []);

// https://docs.angularjs.org/api/ng/provider/$logProvider
    controller.config(function ($logProvider) {
            // $logProvider.debugEnabled(false);
            $logProvider.debugEnabled(true);
        }
    );

    controller.controller(controller_name, [
        '$scope',
        '$rootScope',
        // '$http',
        '$log',
        // '$sce',
        '$state',
        // '$stateParams',
        // '$cookies',
        '$timeout',
        function homeCtrl($scope,
                          $rootScope,
                          // $http,
                          $log,
                          // $sce,
                          $state,
                          // $stateParams,
                          // $cookies,
                          $timeout) {

            $log.debug(controller_name, "started");
            $timeout($rootScope.progressbar.complete(), 1000);

            //

        } // end function homeCtl

    ]);

})();

