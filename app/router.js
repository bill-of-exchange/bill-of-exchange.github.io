'use strict';

/**
 * see:
 * https://github.com/maximepvrt/angular-google-gapi/blob/gh-pages/app/router.js
 */

var router = angular.module('cryptonomica.ui.router', []);

router
    .config(['$urlRouterProvider',
            function ($urlRouterProvider) {
                $urlRouterProvider.otherwise("/");
            }
        ]
    );

router
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider

                .state('billsOfExchangeFactory', {
                    url: '/',
                    controller: 'cryptonomica.controller.billsOfExchangeFactory',
                    templateUrl: 'app/billsOfExchangeFactory/billsOfExchangeFactory.html',
                })

            /*
            .state('viewprofile', {
                url: '/viewprofile/{userId}',
                controller: 'cryptonomica.controller.viewprofile',
                templateUrl: 'app/viewprofile/viewprofile.html'
            })
            */

        } // end of function ($stateProvider)..
    ]); // end of .config
