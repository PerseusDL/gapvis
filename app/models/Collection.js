/*
 * Core setup for collections
 */
define(["gv", "retrievers/retriever", 'util/endpoints'], function(gv, R, endpoints) {

    return Backbone.Collection.extend({

        /**
         * URL Method inherited from backbone, using endpoints helper
         * @param  {?boolean}  getEndpoint  Wether we want the url or the endpoint
         * @return {Any}
         */
        url : function(getEndpoint) {
            return endpoints.call(this, gv.settings.models.endpoints[this.type])
        },
        /**
         * [fetchNew description]
         * @param  {[type]}
         * @return {[type]}
         */
        fetchNew: function(options) {
            return R(gv.settings.models.retrievers[this.type]).call(this, _.extend(options || {}, gv.settings.models.options[this.type]));
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