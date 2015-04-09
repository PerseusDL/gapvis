define(["retrievers/sync", "retrievers/cts.pages"], function(sync, ctsReff) {
    /*
       
     */
    var retrievers = {
        "sync" : sync,
        "cts.pages" : ctsReff
    }
    /**
     * Load a retriever based on a string.
     * @param  {string}   Identifier for the retriever to be used
     * @return {function}
     */
    return function(retriever) {
        if (DEBUG) console.log("Retriever called : " + retriever)
        if(typeof retrievers[retriever] !== "undefined") {
            return retrievers[retriever];
        } else {
            if (DEBUG) console.log("Retriever not set or not existing :" + retriever)
            return sync;
        }
    }
})