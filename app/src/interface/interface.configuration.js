angular.module('evtviewer.interface')

.config(function($routeProvider) {
    $routeProvider
        .when('/resolveNavigation/:pageId', {
            template: 'index.html',
            controller: 'InterfaceCtrl',
            resolve: {
                resolvedNav: function($route) {
                    console.log($route.current.params);
                    return 'Call to the service for the page';
                }
            }
        });
})

.run(function($injector, config) {
    if (config.isValid()) {
        if (config.isModuleActive('interface')) {
            var mainInterface = $injector.get('evtInterface');
            mainInterface.boot();
        }
    }
});