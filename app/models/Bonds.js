define([
    "models/Model",
    "models/Collection"
    ],
    function (Model, Collection, Annotations) {

        /**
         * Bond Model
         * @type {[type]}
         */
        var Bond = Model.extend({
            type: "bond",
            defaults : {
                source : null,
                target : null,
                type : "bond"
            }
        });

        /**
         * Bonds Collection
         * @type {Backbone.Collection}
         */
        var Bonds = Collection.extend({
            type : "bonds",
            model : Bond
        })
        return Bonds;
    }
)