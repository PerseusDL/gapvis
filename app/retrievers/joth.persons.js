define([
        "util/addAnnotator"
    ],
    function(addAnnotator) {
    /**
     * Retrieve persons reference and link using the cts identifier of a book
     *     Parse them as it need to
     *     This retriever does not need OpenAnnotation. Through, if you want to see links in your text
     *     you will need to call it. The attributes created in Page
     * @param  {Object.<string, any>}   options         List of options for ajax call / retrieval
     * @param  {function}               options.success Callback
     * @return {Object}  Return an updated/synced object passed as "this"
     */
    var capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var PerseusNameMatcher = new RegExp("^http://data\.perseus\.org/people/smith:([a-zA-Z]+)")
    return function(options) {
        options = options || {};
        var collection = this,
            book = collection.book,
            success = options.success;

        var options = _.extend({
                dataType: "json",
                cache: true
            }, options);

        options.error = function(dat) {
            if (DEBUG) console.log(dat)
        }
        options.success = function(resp, status, xhr) {
            if(typeof collection.add !== "undefined") {
                /**
                 * No we parse what we can from the items :)
                 */
                var pages = {}
                var personsId = [];
                //For each annotation
                _.each(resp.persons, function(annotation) {
                    //For each annotation, we have a source !
                    var targetPage = annotation["hasTarget"]["hasSource"]["@id"],
                        bonds = {},
                        annotators = _.map(annotation.annotatedBy["foaf:member"], function(annotator) { return annotator["foaf:name"]; })

                    if(!pages[targetPage]) { pages[targetPage] = []; }

                    // We have a body
                    //The body has two elements normally, one being the source of the bond, the other
                    if (targetPage.match(/selene/)) {
                        //debugger;
                    }
                     
                    
                    _.each(annotation.hasBody["@graph"], function(body){
                        //If we have the source of the bond
                        if("snap:has-bond" in body) {
                            var id = body["@id"].toLowerCase();
                            if  (["snap:has-bond"]["@id"]) {
                              bondId = body["snap:has-bond"]["@id"];
                            } else {
                              bondId = body["snap:has-bond"][0];
                            }
                            
                            direction = "source";
                            type = false;
                        //If we have the direction of the bond
                        } else if ("snap:bond-with" in body) {
                            var id = body["snap:bond-with"]["@id"].toLowerCase(),
                                bondId = body["@id"],
                                direction = "target",
                                type = body["@type"];
                        } else {
                            return;
                        }
                        if(!(bondId in bonds)) {
                            bonds[bondId] = {
                                source : null,
                                target : null
                            }
                        }
                        bonds[bondId][direction] = {
                            id : id,
                            name : id.match(PerseusNameMatcher) ? capitalize(id.match(PerseusNameMatcher)[1]) : ''
                        };
                        if (! id.match(PerseusNameMatcher)) {
                            //console.log("No match on " + id);
                        } else {
                            //console.log("match on " + id);
                        }
                        if(type !== false) {
                            bonds[bondId].type = type;
                            bonds[bondId].id = bondId;
                        }
                    });
                    
                    //  Normaly, there should be only one bond, but just in case...
                    _.each(bonds, function(bond) {
                        // !!!! Temp fix 
                        // Right now, the target is always what is recognized as the person
                        // Through, this should not be the case, we should have a way to tell what represents 
                        //  really the selected text
                        // MYTH
                        if (bond.target && bond.source) {
                        var realTarget = bond.target.id,
                            otherTarget = bond.source.id;
                        // Now we register found bounds !
                        var target = collection.get(bond.target.id);
                        if (!target) {
                            collection.add(bond.target, {silent:true});
                            personsId.push(bond.target.id);
                            var target = collection.get(bond.target.id);
                        }
                        var source = collection.get(bond.source.id);
                        if (!source) {
                            collection.add(bond.source, {silent:true});
                            personsId.push(bond.source.id);
                            var source = collection.get(bond.source.id);
                        }
                        var smallBond = {
                            type : bond.type,
                            id : bond.id,
                            target : bond.target.id,
                            source : bond.source.id
                        };
                        target.bondsWith(smallBond);
                        source.bondsWith(smallBond);
                        //We put the person into the list of annotation for one page.
                        pages[targetPage].push({
                            id : realTarget,
                            selector : annotation["hasTarget"]["hasSelector"],
                            annotators : annotators
                        });
                        pages[targetPage].push({
                            id : otherTarget
                        });
                      } else {
                          //console.log("bond failed test ");
                          //console.log(bond);
                      }
                    });
                });

                // So now we have registered the persons. 
                // We need now to load annotations links for each page now.
                // For that we need the collection pages to be ready !
                
                // Now we use another retrieving method : We retrieve the persons data. 
                // Note that we should be make this function much more externaly "available"
                
                // First we setup a callback to avoid code repetition
                var cb = function() {
                    _.each(Object.keys(pages), function(pageId) {
                        book.pages.getOrCreate(pageId).set({
                            "persons" : _.uniq(_.map(pages[pageId], function(val) { return val.id; })),
                            "personsAnnotations" : pages[pageId]
                        });
                        addAnnotator(book.pages.get(pageId), pages[pageId])

                    });
                    if (success) success(collection, resp);
                }
                cb();
                /*
                var personsId = personsId.join(",")
                $.ajax(
                    collection.url(personsId),
                    {
                        "success" : function(data) {
                            _.each(data.persons, function(person, personId) {
                                collection.get(personId).set({
                                    title : person.title,
                                    description : person.description || "",
                                    ll : person.reprPoint
                                })
                            })
                            if(book._fetched["pages"] !== true) {
                                book.on("ready.pages", function() {
                                    cb();
                                    if (!options.silent) collection.trigger('reset', collection, options);
                                });
                            } else {
                                cb();
                                if (!options.silent) collection.trigger('reset', collection, options);
                            }
                        },
                        error : options.error || function() { return; }
                    }
                );
*/
                
            }
        };

        return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
});
