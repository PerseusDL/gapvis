/*
 * Core setup for models
 */
define(["util/endpoints", "gv", "retrievers/retriever"], function(endpoints, gv, R) {

    function stringifyId(item) {
            item.id = String(item.id);
            return item;
    }
    
    var Model = Backbone.Model;

    // set up default model
        
    return Model.extend({
            type: 'model',
            
	        url : function() {
	            return endpoints.call(this, gv.settings.endpoints[this.type])
	        },
	        fetch: function(options) {
	            return R(gv.settings.retrievers[this.type]).call(this, options, this.endpoint);
	        },
            
            isFullyLoaded: function() {
                
                // override in subclasses
                
                return true;
            },
            
            // support for common pattern
            
            ready: function( loadCallback, immediateCallback ){
                var model = this,
                    immediateCallback = immediateCallback || loadCallback;
                            
                if ( !model.isFullyLoaded() ){
                        model.on( 'ready', loadCallback );
                        
                        // fetch model, avoiding multiple simultaneous calls
                        
                        if ( !model._fetching ){
                            model._fetching = true;
                            model.fetch({ 
                                success: function() {
                                    model.trigger('ready');
                                    model._fetching = false;
                                },
                                error: function() {
                                    gv.state.set({ 
                                        message: {
                                            text: 'Error: Could not get data for the ' + model.type +
                                                ' with ID ' + model.id,
                                            type: 'error'
                                        }
                                    });
                                }
                            });
                        }    
                } 
                    else {
                    immediateCallback();
                }
            } 
    });
});