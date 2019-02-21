(function () {

    'use strict';

    var d = angular.module('cryptonomica.directives', []);

    // -----------------------------------------------------------------------------------------
    /* see:
    // https://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs */
    d.directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });
                    // see: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
                    event.preventDefault();
                }
            });
        };
    });

    // -----------------------------------------------------------------------------------------
    d.directive('leftSidebar', function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            // <left-sidebar></left-sidebar>
            templateUrl: 'app/directives/leftSidebar.html'
        };
    });
    // -----------------------------------------------------------------------------------------
    d.directive('rightSidebar', function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            // <right-sidebar></right-sidebar>
            templateUrl: 'app/directives/rightSidebar.html'
        };
    });
    // ----------------------------------------------------------------------------------------
    d.directive('topHeaderMenu', function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            // <top-header-menu></top-header-menu>
            templateUrl: 'app/directives/topHeaderMenu.html'
        };
    });

    // ------------------------------------------------------------------------------
    d.directive('alerts', function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            // <alerts></alerts>
            templateUrl: 'app/directives/alerts.html'
        };
    });
    // ------------------------------------------------------------------------------
    d.directive('footerMain', function () {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment
            // <footer-main></footer-main>
            // replace: 'true', // >> error
            templateUrl: 'app/directives/footerMain.html'
        };
    });

    // ------------------------------------------------------------------------------

})();
