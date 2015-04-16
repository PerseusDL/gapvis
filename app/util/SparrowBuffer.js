define(function() {

    // small handler that loads the task.url into the task.item and calls the callback 
    // when its finished
    var taskHandler = function(call, callback) {
        call(callback)
    }

    return function () {
        var queue = [];

        this.run = function() {
            var self = this;
            var callback = function () {
                 // when the handler says it's finished (i.e. runs the callback)
                 // We check for more tasks in the queue and if there are any we run again
                 if (queue.length > 0) {
                      self.run();
                 }
            }
            // give the first item in the queue & the callback to the handler
            taskHandler(queue.shift(), callback);
        } 

        // push the task to the queue. If the queue was empty before the task was pushed
        // we run the task.
        this.append = function(task) {
            queue.push(task);
        }


    }
})