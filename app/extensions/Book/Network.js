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
        dict[fnName] = function(page) {
                var model = this;
                var collection = model[parameters.collection];
                var completeCollection = model[parameters.collection];

                if(typeof page !== "undefined" && page !== undefined) {
                    console.log("filtering collection on", page)
                    var persons = model.pages.get(page).get(parameters.collection);
                    collection = _.map(persons, function(person) { return collection.get(person); })
                }

                var nodes = [],
                    links = [],
                    index = {},
                    already_in = []; // Holds index information for each collection.model.id
                collection.forEach(function(model) {
                    index[model.id] = nodes.length
                    nodes.push({"name" : model.get("name"), "@id" : model.get("id")})
                    model.get("bonds").forEach(function(bond) {
                        var id = bond.get("id");
                        if(already_in.indexOf(id) === -1) {
                            links.push({
                                source : bond.get("source"),
                                target : bond.get("target"),
                                type   : bond.get("type"),
                                id   : bond.get("id"),
                                value  : 1
                            });
                            already_in.push(id)
                        }
                    });
                });

                _.map(nodes, function(node) {
                    var s = node["@id"].split("/");
                    var n =s[s.length -1].split(":");
                    if (n.length > 1) {
                      n = n[1].replace("#this", "").replace("-", "_");
                      n1 = "urn:cts:pdlrefwk:viaf88890045.003.perseus-eng1:" + n[0].toUpperCase() + "." + n.toLowerCase();
                      console.log("good node " + n)
                    } else {
                      n = n[0].trim() + "_1";
                      n1 = "urn:cts:pdlrefwk:viaf88890045.003.perseus-eng1:" + n[0].toUpperCase() + "." + n.toLowerCase();
                      console.log("Bod Node " + n);
                    }   
                    if(model.pages.get(n1)) {
                      node.link = n1;
                    }
                });


                links = _.map(links, function(link) {
                    link.source = index[link.source];
                    link.target = index[link.target];
                    return link
                })
                if(typeof page !== "undefined" && page !== undefined) {
                    links = links.filter(function(link){ return (typeof link.target !== "undefined" && typeof link.source !== "undefined") }); ;
                }
                return {
                    nodes : nodes,
                    links : links
                }
            }
        return dict;
    }
});
