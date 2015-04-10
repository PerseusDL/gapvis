define(function() {
    /**
     * Retrieve pages reference using the cts identifier of a book
     * @param  {Object.<string, any>}   options         List of options for ajax call / retrieval
     * @param  {function}               options.success Callback
     * @return {Object}  Return an updated/synced object passed as "this"
     */
    return function(options) {
        var self = this,
            endpoint = self.url(true),
            text = new CTS.text.Text(self.book.id, endpoint);
        return text.getValidReff({
            success : function(data) {

                // Page is a collection, so we need to update the collection
                var pages = self;
                var p = _.values(data).map(function(val) { return { id : val }})
                _(p).each(function(item) {
                    if (!pages.get(item.id)) {
                        pages.add(item, {silent:true});
                    }
                });
                if(options.success) options.success(self);
                if (!options.silent) self.trigger('reset', self, options);
                self.trigger("ready", self);
            },
            level : options.level || 1
        });
    }
});