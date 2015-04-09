define(function() {
    /**
     * Retrieve pages reference using the cts identifier of a book
     * @param  {Object.<string, any>}   options         List of options for ajax call / retrieval
     * @param  {function}               options.success Callback
     * @param  {function}               url             Function returning a <CTS.endpoint.Endpoint> object.
     * @return {Object}  Return an updated/synced object passed as "this"
     */
    return function(options, url) {
        var endpoint = url,
            self = this,
            text = CTS.text.Text(self.id, endpoint);

        CTS.text.getValidReff();
    }
});