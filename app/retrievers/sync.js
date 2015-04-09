/*
 * Simple basic retriever, formerly used in Collection.js
 * Default retriever
 */
define(["gv"], function(gv) {
    /*
     A basic retriever should always be called on an item through retriever.call(this, options);
     */
    return function(options, url) {
        options = options || {};
        var collection = this,
            success = options.success;

        options.dataType = options.dataType || "json";
        var options = _.extend({
                dataType: gv.settings.API_DATA_TYPE,
                cache: true
            }, options);

        options.error = function(dat) {
            if (DEBUG) console.log(dat)
        }
        options.success = function(resp, status, xhr) {
            if(typeof collection.add !== "undefined") {
                _(collection.parse(resp, xhr)).each(function(item) {
                    if (!collection.get(item.id)) {
                        collection.add(item, {silent:true});
                    }
                });
                if (!options.silent) collection.trigger('reset', collection, options);
            }
            if (success) success(collection, resp);
        };
        return (this.sync || Backbone.sync).call(this, 'read', this, options);
    }
});