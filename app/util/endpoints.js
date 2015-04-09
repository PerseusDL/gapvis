define(["gv"], function(gv)  {
    /**
     * Set up the url and endpoint attribute given the type of url.
     *  The url is a required attribute for collection and need to be read as a string ultimately. 
     *  So for this purpose, we have two attributes, one for Backbone.sync, the second for other retrievers.
     *  
     * @param  {any}      url  The endpoint
     * @param  {?boolean} e    If we want to get the endpoint instead of the url.
     * @return {string}        The url for Backbone.Sync
     */
    return function(url, e) {
        if(typeof url === "string") {
            endpoint = url;
        } else if (typeof url === "function" && typeof url() === "string") {
            url = url();
            endpoint = url;
        } else {
            endpoint = (typeof url === "function") ? url() : url;
            url = "fake";
        }
        return (e) ? endpoint : url;
    }
});