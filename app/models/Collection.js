/*
 * Core setup for collections
 */
define(["gv", "retrievers/retriever", 'util/endpoints'], function(gv, R, endpoints) {

    return Backbone.Collection.extend({
        url : function() {
            return endpoints.call(this, gv.settings.endpoints[this.type])
        },
        /**
         * [fetchNew description]
         * @param  {[type]}
         * @return {[type]}
         */
        fetchNew: function(options) {
            return R(gv.settings.retrievers[this.type]).call(this, options, this.endpoint);
        },
        /**
         * [getOrCreate description]
         * @param  {[type]}
         * @return {[type]}
         */
        getOrCreate: function(modelId) {
            console.log(modelId)
            var model = this.get(modelId);
            if (!model) {
                model = new this.model({ id: modelId});
                this.add(model);
            }
            console.log(model)
            return model;
        }
        
    });
    
});