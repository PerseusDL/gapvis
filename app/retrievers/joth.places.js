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
                console.log(resp);
                /**
                 * No we parse what we can from the items :)
                 */
                
                //if (success) success(collection, resp);
            }
        };
        return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
});