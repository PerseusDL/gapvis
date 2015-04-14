define(
    //Dependencies
    [
        "models/Collection",
        "models/Model"
    ],
    //Call
    function(Collection, Model) {

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

        /**
         * Model for a person
         * @type {Backbone.Model}
         */
        var Person = Model.extend({
            type: "person",
            defaults : {
                "name" : "NoName",
                "id" : false
            },
            init : function() {
                this.set("bonds", new Bonds());
            },
            /**
             * Create a bond with another element
             *     Source bonds to Target
             * @param  {Object} bond [description]
             * @return {[type]}      [description]
             */
            bondsWith : function(bond) {
                var model = this,
                    bonds = model.get("bonds"),
                    b = bonds.get(bond.id);
                if(!b) {
                    var b = {
                        source : bond.source,
                        target : bond.target,
                        id : bond.id,
                        type : bond.type
                    }
                    bonds.add(b)
                }
                return b;
            }
        });

        /**
         * People Collection
         * @type {Backbone.Collection}
         */
        return Collection.extend({
            type: "persons",
            model: Person
        });
    }
);