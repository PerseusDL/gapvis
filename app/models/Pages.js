/*
 * Page model
 */
define(['models/Model', 'models/Collection'], function(Model, Collection, OpenAnnotation) {
    var Page;

    // Model: Page
    Page = Model.extend({
        type: 'page',
        
        defaults: {
            places: []
        }, 
        
        init: function() {

            this.set({
                title:'Page ' + this.id
            });
        },
        
        isFullyLoaded: function() {
            return !!this.get('text'); // FIXME this may not exists if multilang book
        }
    });
    
    // Collection: PageList
    /**
     * Collection of Page
     *     Instantiate and retrieve things through @this.book.id
     * @type Collection.Pages
     */
    return Collection.extend({
        type: "pages",
        model: Page
    });
    
});