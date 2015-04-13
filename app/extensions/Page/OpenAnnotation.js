/**
 * This module loads onto a page and find OpenAnnotation prefix/suffix citations to replaces them with link
 */
define(["util/regexpEscape"], function(RegExpEscape) {
    /**
     * [description]
     *     Should be use to extend a Page, where this is the Page object. e.g. OpenAnnotation.call(Page, args*)
     *
     * @param  {Object.<string, list>} parameters                 Parameters for this function
     * @param  {List.<string>}         parameters.attributeNames  Name's list of the attribute of the object containing a list of OpenAnnotations selectors + id
     * @param  {List.<string>}         parameters.prefixes        Prefix with which we should wrap the target
     * @param  {List.<string>}         parameters.suffixes        Suffix with wich we should wrap the target
     * @return {[type]}                [description]
     */
    return function(parameters) {
        return {
            "ready/extensions/Page/OpenAnnotation": function() {
                var page = this,
                    text = page.get("text"),
                    attributeNames = parameters.attributeNames,
                    prefixes = parameters.prefixes,
                    suffixes = parameters.suffixes;
                
                _.each(attributeNames, function(attributeName, index) {
                    var suffix = suffixes[index],
                        prefix = prefix[index];
                    _.each(page.get(attributeName), function(annotation) {
                        var query = RegExpEscape(annotation.selector.prefix) + "([\s+]" + RegExpEscape(annotation.selector.exact) + "[\s+])" + RegExpEscape(annotation.selector.suffix);
                        text.replace(query, prefix + "$1" + suffix);
                    });
                });
                page.set("text", text);
            }
        }
    }
});