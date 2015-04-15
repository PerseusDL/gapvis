/**
 * This module loads onto a page and find OpenAnnotation prefix/suffix citations to replaces them with link
 */
define(["util/regexpEscape"], function(RegExpEscape) {
    /**
     * [description]
     *     Should be use to extend a Page, where this is the Page object. e.g. OpenAnnotation.call(Page, args*)
     *
     * @param  {Object.<string, list>}           parameters                 Parameters for this function
     * @param  {List.<string>}                   parameters.attributeNames  Name's list of the attribute of the object containing a list of OpenAnnotations selectors + id
     * @param  {List.<string||function>}         parameters.prefixes        Prefix with which we should wrap the target. Can be a function which we give the id of the annotation.
     * @param  {List.<string||function>}         parameters.suffixes        Suffix with wich we should wrap the target. Can be a function which we give the id of the annotation.
     * @return {[type]}                          [description]
     */
    return function(parameters) {
        return {
            "ready/extensions/Page/OpenAnnotation": function() {
                var page = this,
                    text = page.get("text"),
                    attributeNames = parameters.attributeNames,
                    prefixes = parameters.prefixes,
                    suffixes = parameters.suffixes;

                text = text.replace(/\s+/g, " ")
                _.each(attributeNames, function(attributeName, index) {
                    _.each(page.get(attributeName), function(annotation) {
                        if(typeof annotation.selector === "undefined") {
                            return;
                        }
                        var suffix = suffixes[index],
                            prefix = prefixes[index],
                            query  = new RegExp(RegExpEscape(annotation.selector.prefix) + "(\\s*)(" + RegExpEscape(annotation.selector.exact) + ")(\\s*)" + RegExpEscape(annotation.selector.suffix), "gm"),
                            prefix = (typeof prefix === "function") ? prefix(annotation.id) : prefix,
                            suffix = (typeof suffix === "function") ? suffix(annotation.id) : suffix;
                        text = text.replace(query, annotation.selector.prefix + "$1" + prefix + "$2" + suffix + "$3" + annotation.selector.suffix);
                    });
                });
                page.set("text", text);
            }
        }
    }
});