define([
    "models/Collection",
    "models/Model"
    ],
    function (
        Collection,
        Model
    ) {
        var Citation = Model.extend({
            type : "citation"
        });
        
        return Collection.extend({
            type: "citations",
            model : Citation
        })
    }
);