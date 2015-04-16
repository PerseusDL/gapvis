define(function() {
    /**
     * Retrieve page text using the cts identifier of a passage
     * @param  {Object.<string, any>}   options         List of options for ajax call / retrieval
     * @param  {function}               options.success Callback
     * @return {Object}  Return an updated/synced object passed as "this"
     */
    return function(options) {
        var self = this,
            endpoint = self.url(true),
            text = new CTS.text.Text(self.id, endpoint);
        return text.getLabel({
            success : function(data) {
                self.set({
                    title  : data.getTitle("eng"),
                    author : data.getTextgroup("eng")
                });
                if (options.success) options.success(self);
                if (!options.silent) self.trigger('reset', self, options);
                self.trigger("ready", self);
            },
            error : function() { var error = options.error || function() {}; error(); }
        });
    }
});