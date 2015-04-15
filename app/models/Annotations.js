define([
        "models/Model",
        "models/Collection",
        "models/Annotator"
    ],
    function(
        Model,
        Collection,
        Annotator
    ) {
        var Annotation = Model.extend({
            type : "annotation"
        });
        return Collection.extend({

        });
    }
);