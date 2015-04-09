/*
 * Book collection
 */
define(['gv', 'models/Collection', 'models/Book'], function(gv, Collection, Book) {
    
    // Collection: BookList
    return Collection.extend({
        type: 'bookslist',
        model: Book,
        comparator: function(book) {
            // try for author last name
            var author = (book.get('author') || '')
                .toLowerCase()
                .split(/[,(]/)[0]
                .split(/\s+/)
                .pop();
            return author + book.get('title').toLowerCase(); 
        }
    });
    
});