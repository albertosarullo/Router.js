/*

  Router.js - by Alberto Sarullo
                forked by Marco Colombo
                    forked by Daniele Messa

  https://github.com/albertosarullo/Router.js

*/

/* global window, document */
/* exported Router */

;(function (window, document, undefined) {

    'use strict';

    window.Router = (function(){
        var app,
            interval,
            callback,
            oldHash = '/Router.js',
            routes = [ {controller: 'home', route: ''} ];

        app = {

            init: function init(routesArray) {
                routes = routesArray || [];
                interval = setInterval(function checkAddressChanged() {
                    // console.log(location.hash, oldHash);
                    if (document.location.hash !== oldHash) {
                        onChangeLocation(document.location.hash);
                        oldHash = document.location.hash;
                    }
                }, 250);
                return app;
            },

            deinit: function deinit() {
                clearInterval(interval);
                return app;
            },

            onChange: function onChange(callbackFunction) {
                callback = callbackFunction;
                // onChangeLocation(location.hash, oldHash);
                return app;
            },

            go: function go(controller, params) {
                var i,
                    route,
                    paramsNumber,
                    findedParams,
                    paramsMatches,
                    param;

                for (i = 0; i < routes.length; i = i + 1) {
                    if (routes[i].controller === controller) {
                        route = routes[i].route;
                        paramsNumber = 0;
                        findedParams = 0;

                        paramsMatches = route.match(/:[^\s\/]+/ig);
                        if (paramsMatches) {
                            paramsNumber = paramsMatches.length;
                        }

                        for (param in params) {
                            if (params.hasOwnProperty(param)) {
                                if (route.indexOf(':' + param) !== -1) {
                                    findedParams = findedParams + 1;
                                    route = route.replace(":" + param, params[param]);
                                }
                            }
                        }

                        if (findedParams === paramsNumber) {
                            break;
                        } else {
                            route = undefined;
                        }
                    }
                }
                if ( route ) {
                    setTimeout(function() {
                        document.location.hash = route;
                    }, 0);
                }
            }
        };

        function onChangeLocation(hash) {
            var i,
                route,
                matcher,
                matchResult,
                routeEvent,
                j,
                names;

            for (i = 0; i < routes.length; i = i + 1) {
                route = routes[i].route;
                matcher = new RegExp(route.replace(/:[^\s\/]+/ig, '([^\\s\\/]+)'));
                if (matcher.test(hash)) {
                    matchResult = hash.match(matcher);
                    //routeEvent = document.createEvent("Event");
                    //routeEvent.initEvent("RouteChanged", true, true);
                    routeEvent = {
                        params: {},
                        controller: routes[i].controller
                    };

                    if (matchResult) {
                        matchResult.shift();
                        names = route.match(/:[^\s\/]+/ig);
                        for (j = 0; j < matchResult.length; j = j + 1) {
                            routeEvent.params[names[j].substr(1)] = matchResult[j];
                        }
                    }
                    // document.dispatchEvent(routeEvent);
                    if (callback) {
                        callback(routeEvent.controller, routeEvent.params);
                    }

                    break;
                }
            }
        }

        return app;
    })();
})(window, document);
