define(["util/SparrowBuffer", "util/addAnnotator"], function(SparrowBuffer, addAnnotator) {
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
                    var items = [];
                    //For each annotation, we have a source !
                    var target = annotation["hasTarget"]["hasSource"]["@id"],
                        item = {
                            id : annotation["@id"]
                        },
                        annotators = _.map(annotation.annotatedBy["foaf:member"], function(annotator) { return annotator["foaf:name"]; });

                    if(!pages[target]) { pages[target] = []; }
                    // this is a hack -- ideally we should sort these into different widgets
                    if (annotation.motivatedBy == "oa:describing") {
                      item.type = "characterizes person as ";
                    } else {
                      item.type = "attests to relationship";
                    }

                    // We have a body
                    if (annotation.hasBody["@graph"]) {
                    _.each(annotation.hasBody["@graph"], function(body){
                        if(body["@type"] === "http://lawd.info/ontology/Citation") {
                            item.urn = body["@id"].match(UrnMatcher)[1];
                            item.link = body["@id"];
                            var s = item.urn.split(":");
                            item.passage = s[s.length - 1];
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
                      if (!item.sourceSelector) {
                        item.sourceSelector = {
                          prefix : annotation.hasTarget.hasSelector.prefix,
                          suffix : annotation.hasTarget.hasSelector.suffix,
                          current : annotation.hasTarget.hasSelector.exact
                        }
                      }
                      items.push(item);
                    } else {
                      var num = 1;
                      _.each(annotation.hasBody, function(body){
                        var it = jQuery.extend(true, {}, item);
                        if ( body["hasSource"].match(UrnMatcher)) {
                            it.id = it.id + "-" + num++;
                            it.urn = body["hasSource"].match(UrnMatcher)[1];
                            it.link = body["hasSource"];
                            var s = it.urn.split(":");
                            it.passage = s[s.length - 1];
                            it.sourceSelector = {
                                prefix : body["hasSelector"]["prefix"] || "",
                                suffix : body["hasSelector"]["suffix"] || "",
                                current : body["hasSelector"]["exact"]
                            }
                            // preload the default text into the object so that if the CTS call fails we can still display 
                            // the user-supplied text
                            // TODO verify that the callback is indeed called - it seemed not to be but this 
                            // was maybe do to caching
                            it.text = it.sourceSelector["prefix"] + it.sourceSelector["current"] + it.sourceSelector["suffix"],
                            items.push(it);
                          } else if(DEBUG) {
                            console.log("Failed to match " + body["hasSource"]);
                          }
                      });
                    }
                    for (var i=0; i<items.length; i++) {
                      var this_item = items[i]
                      if (!collection.get(this_item.id)) {
                          collection.add(this_item, {silent:true});
                          placesId.push(this_item.id)
                      }
                      //We put the place into the list of annotation for one page.
                      pages[target].push({
                        id : this_item.id,
                        selector : annotation["hasTarget"]["hasSelector"],
                        annotators : annotators
                      });
                      if (this_item.urn) {
                      var this_cb = function(callback) {

                        var self = collection.get(this_item.id);
                        self.set({urn: this_item.urn.split(":")[0],
                                  text: this_item.sourceSelector["prefix"] + this_item.sourceSelector["current"] + this_item.sourceSelector["suffix"],
                                  title: this_item.urn.replace(":" + this_item.passage,"")});
                        var passage = new CTS.text.Passage(this_item.urn, collection.url(1));
                        passage.retrieve({
                            success : function(data) {
                                try {
                                    // Nemo/Nautilus endpoint is returning
                                    // different error codes so check
                                    // to be sure we don't have error text
                                    // before setting it
                                    var text = passage.getText(null, true);
                                    if (! text.match("error")) {
                                self.set({
                                    text : passage.getText(null, true)
                                    // title and author aren't present
                                    // in the Nemo/Nautilus response?
                                    //title : passage.Text.getTitle("eng"),
                                    //author : passage.Text.getTextgroup("eng")
                                })
                                }
                                } catch(e) {
                                  console.log(e);
                                }
                                callback();
                            },
                            error : function() { var error = options.error || function() {}; error(); callback();},
                            metadata : true
                        });
                      };
                      buffer.append(this_cb);
                   }

                  }

                });

                // So now we have registered the places. 
                // We need now to load annotations links for each page now.
                // For that we need the collection pages to be ready !
                
                // Now we use another retrieving method : We retrieve the places data. 
                // Note that we should be make this function much more externaly "available"
                
                // First we setup a callback to avoid code repetition
                var cb = function() {
                    _.each(Object.keys(pages), function(pageId) {
                        book.pages.getOrCreate(pageId).set({
                            "citations" : _.map(pages[pageId], function(val) { return val.id; }),
                            "citationsAnnotations" : pages[pageId]
                        });
                        addAnnotator(book.pages.get(pageId), pages[pageId])
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
