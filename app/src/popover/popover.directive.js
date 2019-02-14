/**
 * @ngdoc directive
 * @module evtviewer.popover
 * @name evtviewer.popover.directive:evtPopover
 * @description
 * # evtPopover
 * <p>This element is a small pop-up box that appears when the user clicks on an element (or passes over it with the mouse) and
 * can contain different content.</p>
 * <p>It uses the {@link evtviewer.popover.controller:PopoverCtrl PopoverCtrl} controller.</p>
 * <p>The initial scope is extended in {@link evtviewer.popover.evtPopover evtPopover} provider.</p>
 *
 * @scope
 * @param {string=} trigger type of event that triggers the opening of the popover ('over', 'click')
 * @param {string=} tooltip text that will be compiled in popover
 * @param {string=} parentRef reference of parent element that is used to adjust popover size and position
 *
 * @restrict E
**/
angular.module('evtviewer.popover')

.directive('evtPopover', function(evtPopover) {
    return {
        restrict: 'E',
        scope: {
            trigger: '@',
            tooltip: '@',
			parentRef : '@'
        },
        transclude: true,
        templateUrl: 'src/popover/popover.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'PopoverCtrl',
        link: function(scope, element) {
            /**
             * @ngdoc method
             * @name evtviewer.popover.controller:PopoverCtrl#toggleTooltipHover
             * @methodOf evtviewer.popover.controller:PopoverCtrl
             *
             * @description
             * Stop propagation of event and trigger
             * {@link evtviewer.popover.controller:PopoverCtrl#toggleTooltipOver toggleTooltipOver} method.
             */
            scope.vm.toggleTooltipHover = function(e, vm) {
                e.stopPropagation();
                vm.toggleTooltipOver();
            };
            /**
             * @ngdoc method
             * @name evtviewer.popover.controller:PopoverCtrl#toggleMouseHover
             * @methodOf evtviewer.popover.controller:PopoverCtrl
             *
             * @description
             * Stop propagation of event, eventually resize the tooltip
             * ({@link evtviewer.popover.controller:PopoverCtrl#resizeTooltip resizeTooltip})
             * and trigger {@link evtviewer.popover.controller:PopoverCtrl#toggleOver toggleOver} method.
             */
            scope.vm.toggleMouseHover = function(e, vm){
                e.stopPropagation();
                if ( vm.trigger === 'over' && !vm.over && !vm.expanded) {
                    scope.vm.resizeTooltip(e, vm.defaults);
                }
                var tuid = evtPopover.getIdTooltipOvered();
                if ( tuid < 0 || tuid === vm.uid) {
                    vm.toggleOver();
                }
            };
            /**
             * @ngdoc method
             * @name evtviewer.popover.controller:PopoverCtrl#triggerClick
             * @methodOf evtviewer.popover.controller:PopoverCtrl
             *
             * @description
             * Stop propagation of event, eventually resize the tooltip
             * ({@link evtviewer.popover.controller:PopoverCtrl#resizeTooltip resizeTooltip})
             * and trigger {@link evtviewer.popover.controller:PopoverCtrl#toggleExpand toggleExpand} method.
             */
            scope.vm.triggerClick = function(e, vm) {
                e.stopPropagation();
                if ( vm.trigger !== 'over' && !vm.expanded) {
                    vm.resizeTooltip(e, vm.defaults);
                }
                var tuid = evtPopover.getIdTooltipOvered();
                if ( tuid < 0 || tuid === vm.uid) {
                    vm.toggleExpand();
                }
            };
            /**
             * @ngdoc method
             * @name evtviewer.popover.controller:PopoverCtrl#resizeTooltip
             * @methodOf evtviewer.popover.controller:PopoverCtrl
             *
             * @description
             * Stop propagation of event and calculate size and position of tooltip depending
             * on mouse click coordinates and content to be shown. It avoid the pop-up to open in an hidden position.
             * @author: CDP
             * @todo: Fix problems
             */
            scope.vm.resizeTooltip = function(e, settings){
                e.stopPropagation();
                var parentRef = scope.vm.parentRef;
				if ( typeof scope.parentRef !== 'undefined' ) {
					parentRef = scope.parentRef;
				}
                var trigger = element,
                    tooltip = angular.element(element).find('span.popover_tooltip').last(),
                    before  = angular.element(tooltip).find('.popover__tooltip__before');

                // Recuperare x e y del click del mouse
                var x = e.clientX,
                    y = e.clientY;

                // Rimuovere gli stili inline del tooltip in quanto la posizione va ricalcolata ogni volta
                // Mettere magari nella funzione di chiusura?
                // Recupero gli elementi
                tooltip.removeAttr('style');

                // Prendere altezza, larghezza e offset superiore e sinistro del trigger
                // [NB: vanno gestiti trigger spezzati su piu righe]
                var triggerHeight           = trigger.height(),
                    triggerHeightSingleLine = trigger.css('font-size').substr(0,2)*1+1,
                    triggerWidth            = trigger.width(),
                    triggerTop              = trigger.position().top,
                    triggerLeft             = trigger.position().left;

                // Prendere larghezza, altezza e offset superiore e sinistro del tooltip
                // Mi servono la larghezza e l'altezza reali, quindi devo mettere il tooltip in posizione relativa
                // L'offset superiore
                var tooltipTop        = tooltip.offset().top,
                    tooltipRealWidth  = tooltip.outerWidth(),
                    tooltipRealHeight = tooltip.outerHeight();

                // Confrontare la larghezza reale del tooltip con un valore massimo di default (qui 200px)
                // Se maggiore, impostarla uguale a tale larghezza
                // poi rimettere il tooltip in posizione assoluta
                if ( tooltipRealWidth > settings.tooltipMaxWidth ) {
                    tooltip
                        .css({
                            'width'     : settings.tooltipMaxWidth+'px',
                            'max-width' : settings.tooltipMaxWidth+'px'
                        });
                }

                tooltip
                    .css({
                        'position' : 'absolute'
                    });

                // Quindi prendere nuovamente le dimensioni del tooltip
                tooltipRealWidth  = tooltip.outerWidth();
                tooltipRealHeight = tooltip.outerHeight();

                // Spostare il tooltip, prima allineando la metà al punto in cui si è verificato il click
                // poi spostandolo a sinistra se supera il margine destro del contenitore
                // o a destra se supera il margine sinistro.
				var parent = element.parents(parentRef);
				// Se element.parents(parentRef) e non viene passato come attributo della direttiva un parentRef,
                // allora prendiamo come parentRef l'elemento che contiene la direttiva popover stessa
				if ( parent.length === 0 && typeof scope.parentRef === 'undefined' ) {
					parentRef = element.parent();
				}
                var boxOffsetLeft     = element.parents(parentRef).offset().left,
                    boxContainerWidth = element.parents(parentRef).innerWidth();

                var tooltipNewLeft = (x-boxOffsetLeft) - (tooltipRealWidth/2),
                    diff;

                tooltip
                    .css({
                        'left' : tooltipNewLeft+'px'
                    });

                // Se il tooltip supera a destra il margine destro del contenitore
                // ricalcolo il suo offset sinistro in base a quanto "sporge" a destra

                if ( (tooltipNewLeft + tooltipRealWidth) > boxContainerWidth ) {
                    diff           = (tooltipNewLeft + tooltipRealWidth) - boxContainerWidth;
                    tooltipNewLeft = tooltipNewLeft - diff - 20; // 10px margin right
                    tooltip
                        .css({
                            'left' : tooltipNewLeft+'px'
                        });
                }

                // Se supera a sinistra il margine sinistro del contenitore
                // imposto a 0 l'offset sinistro
                if ( tooltipNewLeft < 0 ) {
                    tooltipNewLeft = 0;
                    tooltip
                        .css({
                            'left' : tooltipNewLeft+'px'
                        });
                }

                // Se il tooltip supera il margine inferiore del contenitore
                // lo apro al di sopra del trigger
                // impostando il margine superiore negativo sulla base di
                // sua altezza + altezza del trigger (+ altezza del before) + pixel di scarto

                var boxContainerHeight  = element.parents(parentRef).outerHeight(),
                    tooltipOffsetBottom = triggerTop + triggerHeight + tooltipRealHeight,
                    tooltipNewMarginTop,
                    diffClientYTriggerTop;

                if ( tooltipOffsetBottom > boxContainerHeight ) { // OPEN UP
                    tooltipNewMarginTop = tooltipRealHeight+triggerHeight+10;

                    // Riposiziono il tooltip se il testo del trigger si spezza su più linee
                    // In base alla posizione y del mouse
                    if ( triggerHeight > triggerHeightSingleLine ) {
                        diffClientYTriggerTop = y - trigger.offset().top;
                        tooltipNewMarginTop   = tooltipNewMarginTop - diffClientYTriggerTop + 10;
                    }
                    tooltip
                        .css({
                            'margin-top' : (-tooltipNewMarginTop)+'px'
                        })
                        .addClass('open-up');
                    before.css({
                        top: (tooltip.outerHeight()+2)+'px'
                    });
                } else {
                    // Riposiziono il tooltip se il testo del trigger si spezza su più linee
                    // In base alla posizione y del mouse
                    tooltip.removeClass('open-up');
                    if ( triggerHeight > triggerHeightSingleLine ) {
                        diffClientYTriggerTop = y - trigger.offset().top;
                        diff                  = (triggerHeight - triggerHeightSingleLine) - diffClientYTriggerTop;
                        tooltip.css({
                            'margin-top' : -diff+'px'
                        });
                    } else {
                       tooltip.css({
                            'margin-top' : '5px'
                        });
                    }

                }

                // Riposiziono orizzontalmente l'elemento .before in base al click del mouse
                // [Valutare se utilizzarlo]
                var beforeNewLeft = x - tooltipNewLeft - boxOffsetLeft - 20;
                beforeNewLeft = beforeNewLeft < 0 ? 0 : beforeNewLeft;
                // beforeWidth = 20;
                // beforeMarginRight = x+beforeWidth;
                // tooltipMarginRight = tooltip.offset().left + tooltip.width();
                // if ( beforeMarginRight > tooltipMarginRight){
                //     beforeNewLeft = (beforeMarginRight - tooltipMarginRight );
                //     console.log(tooltipMarginRight);
                // }

                before.css({
                    'left': beforeNewLeft+'px'
                });

                // Ultimo controllo finale per la larghezza del tooltip
                tooltipRealWidth = tooltip.width();
                if( tooltipRealWidth > settings.tooltipMaxWidth ){
                    tooltip.css({
                        'width'     : settings.tooltipMaxWidth+'px',
                        'max-width' : settings.tooltipMaxWidth+'px'
                    });
                }
            };            
            // Initialize popover
            var currentPopover = evtPopover.build(scope.trigger, scope.tooltip, scope.vm);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentPopover){
                    currentPopover.destroy();
                }
            });
        }
    };
});
