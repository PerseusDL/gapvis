define(
    //Dependencies
    [
        "models/Collection",
        "models/Model",
        "models/Bonds",
        "models/Annotations"
    ],
    //Call
    function(Collection, Model, Bonds) {

        /**
         * Model for a person
         * @type {Backbone.Model}
         */
        var Person = Model.extend({
            type: "person",
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