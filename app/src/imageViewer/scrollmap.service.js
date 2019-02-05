angular.module('evtviewer.openseadragonService')

   .service('imageScrollMap', function (evtInterface) {
      console.log('in service imageScrollMap');
      var key = 'yPage';

      var imageScrollMap = this;
      // DATI PER SCROLL MAPPA SAN MATTEO
      var map = {
         yPage1: {
            from: 0.00,
            to: 1.15
         },
         yPage2: {
            from: 1.15,
            to: 2.30
         },
         size: 18
      };

      imageScrollMap.mapDown = function (bounds) {
         return mapFun(bounds, 'down');
      };
      imageScrollMap.mapUP = function (bounds) {
         return mapFun(bounds, 'up');
      };

      var mapFun = function (bounds, type) {
         var box = bounds.getBoundingBox();
         console.log('mapping boungs-pages', box);
         console.log(map);
         console.log(key);

         switch (type) {

            case 'down':
               console.log('mapping moving down');
               if (box.y < map[key + '1'].to) {
                  return (key + '1').substr(1).toLowerCase();
               } else {
                  for (var i = 2; i <= map.size; i++) {
                     if (box.y < map[key + i].to && box.y > map[key + i].from) {
                        console.log(key + i);
                        return (key + i).substr(1).toLowerCase();
                     }
                  }
               }
               break;


            case 'up':
               console.log('mapping moving up');
               for (var i = 1; i <= map.size; i++) {
                  console.log('nel for di scrolling up', (map[key + i].from + map[key + i].to) / 2);
                  console.log('box y:', box.y);
                  console.log('from:', map[key + i].from);
                  if (box.y < ((map[key + i].from + map[key + i].to) / 2) && box.y > map[key + i].from) {
                     console.log('nel if di scrolling up', i);
                     console.log(key + i);
                     return (key + i).substr(1).toLowerCase();
                  }
               }
               return '';


            default:
               return '';

         }


      };

      imageScrollMap.isInBounds = function (y, page) {
         console.log('isInBounds', y, page);
         //var ypage = "y"+ page.charAt(0).toUpperCase() + page.slice(1);
         // FIXME
         var ypage = undefined;
         if (page.length == 5)
            ypage = key + page.substr(page.length - 1);
         else
            ypage = key + page.substr(page.length - 2);


         console.log('isInBounds', ypage);
         if (y >= map[ypage].from && y < map[ypage].to) {
            console.log('true');
            return true;
         } else {
            console.log('false');
            return false;
         }
      };

      imageScrollMap.updateBounds = function (viewer, page) {
         console.log('updateBounds');
         var oldBounds = viewer.viewport.getBounds();
         var ypage = undefined;
         if (page.length == 5)
            ypage = key + page.substr(page.length - 1);
         else
            ypage = key + page.substr(page.length - 2);
         console.log('updateBounds', ypage);
         var h = oldBounds.height / oldBounds.width;
         var newBounds = new OpenSeadragon.Rect(0, map[ypage].from, 1, h);
         console.log('updateBounds', newBounds);
         viewer.viewport.fitBounds(newBounds, false);

      };



   });
