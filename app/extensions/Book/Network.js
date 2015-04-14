define(function() {

    /**
     * Return a network generating function for the Book Model
     * @param  {Object.<string, Any>}       parameters             A dictionary of parameters
     * @param  {Object}                     parameters.collection  The name of the collection where model have themselves Bonds and a bonds property
     * @return {Object.<string, function>}                         [description]
     */
    return function(parameters) {
        var fnName = "network" + parameters.collection,
            dict = {};
        dict[fnName] = function() {
                var model = this,
                    collection = model[parameters.collection],
                    nodes = [],
                    links = [],
                    index = {},
                    already_in = []; // Holds index information for each collection.model.id
                collection.forEach(function(model) {
                    index[model.id] = nodes.length
                    nodes.push({"name" : model.get("name")})
                    model.get("bonds").forEach(function(bond) {
                        var id = bond.get("id");
                        if(already_in.indexOf(id) === -1) {
                            links.push({
                                source : bond.get("source"),
                                target : bond.get("target"),
                                type   : bond.get("type"),
                                value  : 1
                            });
                            already_in.push(id)
                        }
                    });
                });
                links = _.map(links, function(link) {
                    link.source = index[link.source];
                    link.target = index[link.target];
                    return link;
                })
                return {
                    nodes : nodes,
                    links : links
                }
            }
        return dict;
    }
});