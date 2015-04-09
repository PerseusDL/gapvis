define(["gv"], function(gb)  {
    /**
     * Set up the url and endpoint attribute given the type of url.
     *  The url is a required attribute for collection and need to be read as a string ultimately. 
     *  So for this purpose, we have two attributes, one for Backbone.sync, the second for other retrievers.
     *  
     * @param  {any}     url  The endpoint
     * @return {string}       The url for Backbone.Sync
     */
    return function(url) {
        if(typeof url === "string") {
            this.endpoint = url;
        } else if (typeof url === "function" && typeof url() === "string") {
            url = this.endpoint = url();
        } else {
            this.endpoint = (typeof url === "function") ? url() : url;
            url = "fake";
        }
        return url;
    }
});