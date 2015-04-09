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
            text = new CTS.text.Text(self.id, endpoint);

        text.getValidReff({
            success : function(data) {
                console.log(data)
                self.set({"pages" : data})
                options.success(data)
            },
            level : options.level || 1
        });
    }
});