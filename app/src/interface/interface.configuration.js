angular.module('evtviewer.interface')

.config(function($routeProvider) {
    $routeProvider
        .when('/:viewMode', {
            template: 'index.html',
            controller: 'InterfaceCtrl',
            reloadOnSearch: false
        });
        // .otherwise({
        //     redirectTo: '/noncihoancorapensato'
        // });
    // .when('/:pageId', {
    //     template: 'index.html',
    //     controller: 'InterfaceCtrl'
    //     // ,
    //     // resolve: {
    //     //     resolvedNav: function($route) {
    //     //         console.log($route.current.params);
    //     //         return 'Call to the service for the page';
    //     //     }
    //     // }
    // })
    // .when('/:pageId/:docId', {
    //     template: 'index.html',
    //     controller: 'InterfaceCtrl'
    // })
    // .when('/:pageId/:docId/:witIds', {
    //     template: 'index.html',
    //     controller: 'InterfaceCtrl'
    // });
})

.run(function($injector, config) {
    if (config.isValid()) {
        if (config.isModuleActive('interface')) {
            var mainInterface = $injector.get('evtInterface');
            mainInterface.boot();
        }
    }
});