angular.module('evtviewer.apparatuses')

.controller('apparatusesCtrl', function(evtApparatuses, $scope) {
	var vm = this;

	this.setCurrentApparatus = function(app) {
		evtApparatuses.setCurrentApparatus(app);
	};

	this.getCurrentApparatus = function() {
		evtApparatuses.getCurrentApparatus();
	};

	this.toggleAppStructure = function(appStructure) {
		if (vm.appStructure !== appStructure) {
			vm.appStructure = appStructure;
		}
	};

	this.toggleOpenApparatus = function(apparatus) {
		if (vm.openApparatus !== apparatus) {
			vm.openApparatus = apparatus;
		}
	};

	this.getVisibleList = function(app) {
		var list = [];
		for (var i in vm.apparatuses) {
			if (vm.apparatuses[i].label === app) {
				list = vm.apparatuses[i].visibleList;
			}
		}
		return list;
	};

	this.getAppList = function(app) {
		var list;
		for (var i in vm.apparatuses) {
			if (vm.apparatuses[i].label === app) {
				list = vm.apparatuses[i];
			}
		}
		return list;
	};

	this.getAppIndex = function(app) {
		var index;
		for (var i in vm.apparatuses) {
			if (vm.apparatuses[i].label === app) {
				index = i;
			}
		}
		return index;
	};

	this.loadMoreElements = function() {
		var vm = this,
        	appIndex = vm.getAppIndex(vm.currentApparatus),
            last = vm.apparatuses[appIndex].visibleList.length,
            i = 0; 
            console.log('loadMoreElements', vm.currentApparatus);
        while (i < 10 && i < vm.apparatuses[appIndex].list.length) {
            var newElement = vm.apparatuses[appIndex].list[last+i];
            if (newElement && vm.apparatuses[appIndex].visibleList.indexOf(newElement) <= 0) {
                vm.apparatuses[appIndex].visibleList.push(newElement);                    
            }
            i++;
        }
    };

	this.destroy = function() {
		evtApparatuses.destroy(this.uid);
	};
});