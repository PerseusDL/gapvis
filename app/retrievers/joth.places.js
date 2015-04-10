define(function() {
    /**
     * Retrieve places reference and link using the cts identifier of a book
     *     Parse them as it need to
     * @param  {Object.<string, any>}   options         List of options for ajax call / retrieval
     * @param  {function}               options.success Callback
     * @return {Object}  Return an updated/synced object passed as "this"
     */
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
                //For each annotation
                _.each(resp.places, function(annotation) {
                    //For each annotation, we have a source !
                    var target = annotation["hasTarget"]["hasSource"]["@id"];
                    if(!pages[target]) { pages[target] = []; }

                    // We have a body
                    _.each(annotation.hasBody, function(body){
                        var item = {
                            id : body["@id"],
                            title : body["@id"],
                            ll : [32.5, 32.5]
                        }
                        if (!collection.get(item.id)) {
                            collection.add(item, {silent:true});
                        }
                        //We put the place into the list of annotation for one page.
                        pages[target].push(item.id);
                    });
                });
                // So now we have registered the places. 
                // We need now to load annotations links for each page now.
                // For that we need the collection pages to be ready !
                
                // First we setup a callback to avoid code repetition
                var cb = function() {
                    _.each(Object.keys(pages), function(pageId) {
                        book.pages.get(pageId).set("places", pages[pageId]);
                    });
                    if (success) success(collection, resp);
                }
                if(book._fetched["pages"] !== true) {
                    book.on("ready.pages", function() {
                        cb();
                    });
                } else {
                    cb();
                }
            }
        };
        return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
});