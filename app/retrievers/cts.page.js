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
            passage = new CTS.text.Passage(self.id, endpoint);
        return passage.retrieve({
            success : function(data) {
                self.set({text : passage.getXml("tei:text")});
                /**
                 * Solely purpose of our situation :
                 */
                self.set({
                    text : passage.getText(["note"])
                })
                //self.set({text : passage.getText(["note", "bibl"])})
                if (options.success) options.success(self);
                self.trigger("ready", self);
            },
            error : function() { var error = options.error || function() {}; error(); }
        });
    }
});