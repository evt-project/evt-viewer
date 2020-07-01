angular.module('evtviewer.openseadragonService')

   .service('imageScrollMap', function (evtInterface) {
      var key = 'yPage';
      var imageScrollMap = this;
     
      /*
      var map = {
         yPage1: {
            from: 0.1,
            to: 0.7
         },
         yPage2: {
            from: 0.7,
            to: 0.14
         },
         size: 14
      };*/

      imageScrollMap.mapDown = function (bounds) {
         return mapFun(bounds, 'down');
      };

      imageScrollMap.mapUP = function (bounds) {
         return mapFun(bounds, 'up');
      };

      var mapFun = function (bounds, type) {
         var box = bounds.getBoundingBox();
         var map;
         var key;

         switch (type) {
            case 'down':
               if (box.y < map[key + '1'].to) {
                  return (key + '1').substr(1).toLowerCase();
               } else {
                  for (var i = 1; i <= map.size; i++) {
                     if (box.y < map[key + i].to && box.y > map[key + i].from) {
                        return (key + i).substr(1).toLowerCase();
                     }
                  }
               }
               break;
            case 'up':
               for (var i = 1; i <= map.size; i++) {
                  if (box.y < ((map[key + i].from + map[key + i].to) / 2) && box.y > map[key + i].from) {
                     return (key + i).substr(1).toLowerCase();
                  }
               }
               return '';


            default:
               return '';

         }


      };

      imageScrollMap.isInBounds = function (y, page) {
         //var ypage = "y"+ page.charAt(0).toUpperCase() + page.slice(1);
         // FIXME
         var ypage = undefined;
         if (page.length == 10)
            ypage = key + page.substr(page.length - 1);
         else
            ypage = key + page.substr(page.length - 2);

         var map;
         if (y >= map[ypage].from && y < map[ypage].to) {
            return true;
         } else {
            return false;
         }
      };

      imageScrollMap.updateBounds = function (viewer, page) {
         var oldBounds = viewer.viewport.getBounds();
         var ypage = undefined;
         var map;
         if (page.length == 10)
            ypage = key + page.substr(page.length - 1);
         else
            ypage = key + page.substr(page.length - 2);
         var h = oldBounds.height / oldBounds.width;
         var newBounds = new OpenSeadragon.Rect(0, map[ypage].from, 1, h);
         viewer.viewport.fitBounds(newBounds, false);

      };
   });
