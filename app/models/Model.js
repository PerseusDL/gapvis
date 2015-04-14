/*
 * Core setup for models
 */
define([
    "require",
    "util/endpoints",
    "gv",
    "retrievers/retriever",
    //Extensions. Should be a better way to do that.
    "extensions/Page/OpenAnnotation", 
    'extensions/Book/Pages', 
    'extensions/Book/Places', 
    'extensions/Book/Network'
], function(
    require,
    endpoints,
    gv,
    R
) {

  var injectionsDict = {
    "pages" : "models/Pages",
    "places" : "models/Places",
    "persons" : "models/Persons"
  }
    function stringifyId(item) {
            item.id = String(item.id);
            return item;
    }
    
    var Model = Backbone.Model;

    // set up default model
        
    return Model.extend({
            type: 'model',
            
            /**
             * URL Method inherited from backbone, using endpoints helper
             * @param  {?boolean}  getEndpoint  Wether we want the url or the endpoint
             * @return {Any}
             */
	        url : function(getEndpoint) {
	            return endpoints.call(this, gv.settings.models.endpoints[this.type], getEndpoint)
	        },
	        fetch: function(options) {
	            return R(gv.settings.models.retrievers[this.type]).call(this, _.extend(options || {}, gv.settings.models.options[this.type]));
	        },
            
            isFullyLoaded: function() {
                // override in subclasses
                return true;
            },
            /**
             * Initiate models to take care of injections and so on.
             *     One model can extend the init function by adding a "init" method.
             */
            initialize : function() {
                var model = this;

                //We make a short reference of the injected data
                model.injections = gv.settings.models.injections[model.type];
                //Refers to extension functions
                model.extensions = gv.settings.models.extensions[model.type];

                model._initiated = {};
                model._on_init = [];
                model._on_ready = [];

                //We make a list of what need to be retrieved
                model.requiredData = ["self"].concat(model.injections || []);

                //We inject collections of data
                _.each(model.injections, function(injection) {
                    var key = injectionsDict[injection],
                        dependency = require(key);
                    // create collections
                    model[injection] = new dependency();
                    // set backreferences
                    model[injection][model.type] = model;
                });

                //We extend our methods
                _.each(model.extensions, function(extension) {
                    if(typeof extension === "string") {
                        var ext = require(extension)({}),
                            params = {};
                    } else {
                        var ext = require(extension.name)(extension.parameters),
                            params = extension.parameters,
                            extension = extension.name;
                    }
                    _.each(Object.keys(ext), function(fn) {
                        // We attach those functions
                        model[fn] = ext[fn];
                        //If one function starts with ready, we must run in the callback of ready 
                        if(fn === "ready/"+extension) {
                            model._on_ready.push(
                                function() { ext[fn].call(model) }
                            );
                        }
                        //If one should be done in the initialization phase, it should start with init
                        else if(fn === "init/"+extension) {
                            model._on_init.push(
                                function() { ext[fn].call(model) }
                            );
                        }
                    })
                });
                if(typeof this.init === "function") {
                    this.init();
                }
                _.each(model._on_init, function(fn) { fn(); })
            },
            /**
             * onReady runs functions if there is some to run on state = ready (data retrieved)
             * @param  {?Function} callback An optional callback
             */
            onReady : function(callback) {
                var model = this;
                _.each(model._on_ready, function(fn) {
                    fn.call(model);
                });
                if (typeof callback === "function") callback.call(this);
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
                                    if(model._on_ready.length > 0) {
                                        model.onReady();
                                    }
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