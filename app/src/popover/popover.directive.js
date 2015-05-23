angular.module('evtviewer.popover')

.directive('evtPopover', function(evtPopover) {
    return {
        restrict: 'E',
        scope: {
            trigger: '@',
            tooltip: '@'
        },
        transclude: true,
        templateUrl: 'src/popover/popover.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'PopoverCtrl',
        link: function(scope, element) {
            scope.vm.resizeTooltip = function(e){
                var trigger, tooltip;
                trigger = element;
                tooltip = element.parent().find('.popover_tooltip').first();

                // var before;
                // before = tooltip.find('> .before');

                // Recuperare x e y del click del mouse
                var x = e.clientX;
                // var y = e.clientY;
                
                // Rimuovere gli stili inline del tooltip in quanto la posizione va ricalcolata ogni volta
                // Mettere magari nella funzione di chiusura?
                // Recupero gli elementi 
                tooltip.removeAttr('style');

                // Prendere altezza, larghezza e offset superiore e sinistro del trigger 
                // [NB: vanno gestiti trigger spezzati su piu righe]
                var triggerHeight, triggerTop, triggerLeft, triggerWidth;
                triggerHeight = trigger.height();
                triggerWidth = trigger.width();
                triggerTop = trigger.offset().top;
                triggerLeft = trigger.position().left;

                // Prendere larghezza, altezza e offset superiore e sinistro del tooltip
                // Mi servono la larghezza e l'altezza reali, quindi devo mettere il tooltip in posizione relativa
                // L'offset superiore 
                var tooltipTop, tooltipRealWidth, tooltipRealHeight;
                tooltipTop = tooltip.offset().top;
                tooltipRealWidth = tooltip.outerWidth();

                // Confrontare la larghezza reale del tooltip con un valore massimo di default (qui 200px)
                // Se maggiore, impostarla uguale a tale larghezza
                // poi rimettere il tooltip in posizione assoluta
                if ( tooltipRealWidth > 200 ) {
                    tooltip
                        .css({
                            'width' : '200px',
                            'max-width' : '200px'
                        });
                } 
                tooltip
                    .css({
                        'position' : 'absolute'
                    });

                // Quindi prendere nuovamente le dimensioni del tooltip
                tooltipRealWidth = tooltip.outerWidth();
                tooltipRealHeight = tooltip.outerHeight();

                // Spostare il tooltip, prima allineando la metà al punto in cui si è verificato il click
                // poi spostandolo a sinistra se supera il margine destro del contenitore
                // o a destra se supera il margine sinistro.
                var boxContainerWidth, boxOffsetLeft;
                boxOffsetLeft = element.parents('.box').offset().left;
                boxContainerWidth = boxOffsetLeft + element.parents('.box').width();
                
                var tooltipNewLeft;
                tooltipNewLeft = x - (tooltipRealWidth/2);
                tooltip
                    .offset({
                        left : tooltipNewLeft
                    });

                // Se il tooltip supera a destra il margine destro del contenitore
                // ricalcolo il suo offset sinistro in base a quanto "sporge" a destra

                if ( (tooltipNewLeft + tooltipRealWidth) > boxContainerWidth ) {
                    var diff = (tooltipNewLeft + tooltipRealWidth) - boxContainerWidth;
                    tooltipNewLeft = tooltipNewLeft - diff - 10; // 10px margin right

                    tooltip
                        .offset({
                            left : tooltipNewLeft
                        });
                }

                // Se supera a sinistra il margine sinistro del contenitore
                // ricalcolo il suo offset sinistro in base a quanto sporge a sinistra
                if ( tooltipNewLeft < boxOffsetLeft ) {
                    tooltip
                        .offset({
                            'left' : boxOffsetLeft+10 // 10px margin left
                        });
                }

                // // Riposiziono orizzontalmente l'elemento .before in base al click del mouse
                // // [Valutare se utilizzarlo]
                // var beforeWidth, beforeNewLeft;
                // var beforeMarginRight, tooltipMarginRight;
                // beforeNewLeft = x;
                // beforeWidth = before.width();
                // beforeMarginRight = x+beforeWidth;
                // tooltipMarginRight = tooltip.offset().left + tooltip.width();
                // if ( beforeMarginRight > tooltipMarginRight){
                //     var diff = (beforeMarginRight - tooltipMarginRight );
                //     beforeNewLeft = x - diff;
                // }
                // before.offset({ left: beforeNewLeft-5});

                // Se il tooltip supera il margine inferiore del contenitore
                // lo apro al di sopra del trigger
                // reimpostandone l'offset superiore in base a 
                // sua altezza + altezza del trigger + altezza del before + pixel di scarto
                var tooltipOffsetBottom, tooltipOffsetTop;
                var boxContainerOffsetTop, boxContainerHeight;

                tooltipOffsetTop = tooltip.offset().top;
                tooltipOffsetBottom = triggerTop + triggerHeight + 10 + tooltipRealHeight;

                boxContainerOffsetTop = element.parents('.box').offset().top;
                boxContainerHeight =  boxContainerOffsetTop + element.parents('.box').height(); // TODO: Add menu height

                if ( tooltipOffsetBottom > boxContainerHeight ){
                    var tooltipNewTop = triggerTop - 10 - tooltipRealHeight;
                    tooltip
                        .css({
                            'top': tooltipNewTop+'px'
                        });
                    
                    // TODO: Handle ::before position
                    // var beforeNewTop = tooltip.height() + 8;
                    // before
                    //     .offset({
                    //         left: beforeNewLeft-10
                    //     })
                    //     .css({
                    //         "top": beforeNewTop+"px",
                    //         "transform": "rotate(180deg)"
                    //     });
                }

                // Ultimo controllo finale per la larghezza del tooltip
                tooltipRealWidth = tooltip.width();
                if( tooltipRealWidth > 200 ){
                    tooltip.css({
                        'width': '200px',
                        'max-width': '200px'
                    });
                }
            };
            
            
            // Initialize select
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