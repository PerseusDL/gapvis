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
            return endpoints.call(this, gv.settings.models.endpoints[this.type], getEndpoint)
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
            var model = this.get(modelId);
            if (!model) {
                model = new this.model({ id: modelId});
                this.add(model);
            }
            return model;
        },
        /**
         * Load data and execute a function as callback
         * @param    {function} callback  Callback to execute when data are available
         * @executes {function} callback
         */
        ready : function(callback) {
            var self = this;
            if (typeof self._loading === "undefined") {
                self._loading = false
            }
            if (typeof self._loaded === "undefined") {
                self._loaded = false
            }

            if(self._loading === false && self._loaded === false) {
                self._loading = true;

                self.fetchNew({
                    success : function(data) {
                        self.trigger("ready", self);
                        self._loading = false;
                        self._loaded = true;
                        callback();
                    }
                });
            } else if (self._loaded === false) {
                return;
            } else {
                callback();
            }
        }
        
    });
    
});