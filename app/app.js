'use strict';

var app = angular.module('cryptonomica', [

    'ngCookies', // (1.4.9) https://code.angularjs.org/1.4.9/docs/api/ngCookies
    'ui.router', // (0.2.18 ) https://github.com/angular-ui/ui-router/tree/legacy
    'yaru22.md', // https://github.com/yaru22/angular-md
    'ngProgress', // https://github.com/VictorBjelkholm/ngProgress
    // ---- my:
    'cryptonomica.ui.router',
    'cryptonomica.controller',
    'cryptonomica.directives'

    // see:
    // http://www.w3schools.com/angular/angular_directives.asp
    // https://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-i-the-fundamentals
]);


app.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self', // Allow same origin resource loads
    ]);
});

// see:
// https://stackoverflow.com/questions/24039226/angularjs-format-text-return-from-json-to-title-case
app.filter('titleCase', function () {
    return function (input) {
        input = input || '';
        return input.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
});

app.run([
        '$state',
        '$rootScope',
        '$window',
        '$document',
        '$sce',
        'ngProgressFactory',
        '$timeout',
        // '$cookies',
        // '$http',
        '$anchorScroll',
        '$location',
        '$log',
        function ($state,
                  $rootScope,
                  $window,
                  $document,
                  $sce,
                  ngProgressFactory,
                  $timeout,
                  // $cookies,
                  // $http,
                  $anchorScroll,
                  $location,
                  $log) {

            $rootScope.appVersion = '0.1.2';

            /* --- UI */
            $rootScope.sidebarVisible = true;


            var SED_START;
            $rootScope.PRODUCTION = false;
            var SED_END;

            $log.info('webapp started,  version: ', $rootScope.appVersion);
            $log.info('production: ', $rootScope.PRODUCTION);

            // $rootScope.myBookmarks = {}; //

            $rootScope.stringIsNullUndefinedOrEmpty = function (str) {
                return typeof str === 'undefined' || str === null || str.length === 0;
            };

            $rootScope.goTo = function (id) {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                // $location.hash('about');
                $location.hash(id);
                // call $anchorScroll()
                $anchorScroll();
            };

            $rootScope.stateGo = function (state, parameter, parameterValue) {
                if (parameter && parameterValue) {
                    $state.go(state, {parameter: parameterValue});
                } else {
                    $state.go(state);
                }
            };

            $rootScope.unixTimeFromDate = function (date) {
                return Math.round(date.getTime() / 1000);
            };

            $rootScope.dateFromUnixTime = function (unixTime) {
                return new Date(unixTime * 1000);
            };

            /* https://codepen.io/shaikmaqsood/pen/XmydxJ/ */
            $rootScope.copyToClipboard = function (element) {
                // var $temp = $("<input>");
                var $temp = $("<textarea></textarea>");
                $("body").append($temp);
                console.log('copy to clipboard: $(' + element + ').val() :');
                console.log($(element).text());
                $temp.val(
                    $(element).text()
                    // $(element).val()
                ).select();
                document.execCommand("copy");
                $temp.remove();
            };

            // =============== Function calls:
            $rootScope.progressbar = ngProgressFactory.createInstance();
            $rootScope.progressbar.setHeight('6px'); // any valid CSS value Eg '10px', '1em' or '1%'
            // $rootScope.progressbar.setColor('orangered');
            // $rootScope.progressbar.setColor('purple');
            // $rootScope.progressbar.setColor('#C800C8');
            $rootScope.progressbar.setColor('#60c8fa');

        } // end main function
    ]
);
