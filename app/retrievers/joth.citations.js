define(["util/SparrowBuffer"], function(SparrowBuffer) {
    /**
     * Retrieve places reference and link using the cts identifier of a book
     *     Parse them as it need to
     *     This retriever does not need OpenAnnotation. Through, if you want to see links in your text
     *     you will need to call it. The attributes created in Page
     * @param  {Object.<string, any>}   options         List of options for ajax call / retrieval
     * @param  {function}               options.success Callback
     * @return {Object}  Return an updated/synced object passed as "this"
     */
    var PerseusNameMatcher = new RegExp("^http://data\.perseus\.org/people/smith:([a-zA-Z]+)")
    var UrnMatcher = new RegExp("^http://data\.perseus\.org/citations/(.*)")
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
                var pages = {},
                    placesId = [];
                //For each annotation
                var buffer = new SparrowBuffer();

                _.each(resp.occurrences, function(annotation) {
                    //For each annotation, we have a source !
                    var target = annotation["hasTarget"]["hasSource"]["@id"],
                        item = {
                            id : annotation["@id"]
                        };

                    if(!pages[target]) { pages[target] = []; }

                    // We have a body
                    _.each(annotation.hasBody["@graph"], function(body){
                        if(body["@type"] === "http://lawd.info/ontology/Citation") {
                            item.urn = body["@id"].match(UrnMatcher)[1];
                        } else if(typeof body["cnt:chars"] !== "undefined") {
                            item.sourceSelector = {
                                prefix : "",
                                suffix : "",
                                current : body["cnt:chars"]
                            }
                        } else if(typeof body["http://lawd.info/ontology/hasAttestation"] !== "undefined") {
                            item.person = /*body["@id"].match(PerseusNameMatcher)[1] ||*/ body["@id"]
                        }
                    });
                    if (!collection.get(item.id)) {
                        collection.add(item, {silent:true});
                        placesId.push(item.id)
                    }
                    //We put the place into the list of annotation for one page.
                    pages[target].push({
                        id : item.id,
                        selector : annotation["hasTarget"]["hasSelector"]
                    });

                    buffer.append(function(callback) {

                        var self = collection.get(item.id),
                            passage = new CTS.text.Passage(item.urn, new CTS.endpoint.XQ("/prod/cts/api", "annotsrc"));
                        passage.retrieve({
                            success : function(data) {
                                self.set({text : passage.getXml("tei:text")});
                                /**
                                 * Solely purpose of our situation :
                                 */
                                self.set({
                                    text : passage.getText(["note"])
                                })
                                callback();
                            },
                            error : function() { var error = options.error || function() {}; error(); }
                        });
                    });
                });

                // So now we have registered the places. 
                // We need now to load annotations links for each page now.
                // For that we need the collection pages to be ready !
                
                // Now we use another retrieving method : We retrieve the places data. 
                // Note that we should be make this function much more externaly "available"
                
                // First we setup a callback to avoid code repetition
                var cb = function() {
                    _.each(Object.keys(pages), function(pageId) {
                        book.pages.get(pageId).set({
                            "citations" : _.map(pages[pageId], function(val) { return val.id; }),
                            "citationsAnnotations" : pages[pageId]
                        });
                    });
                    if (success) success(collection, resp);
                }

                buffer.append(cb);
                buffer.run();
            }
        };

        return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
});