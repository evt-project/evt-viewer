angular.module('evtviewer.mobile')

.controller('MobileViewCtrl', function($scope, Mobile) {

    $scope.view = Mobile.getState();

    // Template: DVB.html
    $scope.dvb_links = [
        {url: "http://vbd.humnet.unipi.it/",
        title: "Digital Vercelli Book project",
        description: "Digital Vercelli Book project",
        }, 
        {url: "http://sourceforge.net/projects/evt-project/",
        title: "Edition Visualization Technology on SourceForge",
        description: "Edition Visualization Technology",
        }, 
        {url: "https://visualizationtechnology.wordpress.com/",
        title: "EVT Blog",
        description: "EVT Blog",
        },
        {url: "mailto: editionvisualizationtechnology@gmail.com",
        title: "Contact",
        description: "Contact",
        },
    ];
   
});