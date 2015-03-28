angular.module('evtviewer.selector')

.factory('SelectFactory', function() {
    // var itemComponent = new BaseComponent("Item", ITEMDEFAULTS);

    var SelectFactory = function(title) {
        // To create a new Item at least a URI is needed
        // if (typeof(title) === "undefined") {
        //     // itemComponent.err("Can't create an item without an URI");
        //     return;
        // }
        // this.uri = uri;
        // this.type = [];
        this.label = 'default item label';

        // if (angular.isObject(values)) {
        //     itemComponent.log('Extending new Item with values ' + this.uri, values);
        //     Utils.deepExtend(this, values);
        // }

        // // Add it to the exchange, ready to be .. whatever will be.
        // ItemsExchange.addItem(this);
    };

    // ItemFactory.prototype.isProperty = function() {
    //     return this.type.indexOf(NameSpace.rdf.property) !== -1;
    // };

    
    // itemComponent.log('Component up and running');

    return SelectFactory;
});