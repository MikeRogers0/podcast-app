/**
 * Taken from http://stackoverflow.com/questions/899102/how-do-i-store-javascript-functions-in-a-queue-for-them-to-be-executed-eventuall
 */
var QueueTaskUtil = (function(){

    function QueueTaskUtil() {};

    QueueTaskUtil.prototype.running = false;

    QueueTaskUtil.prototype.queue = [];

    QueueTaskUtil.prototype.add = function(callback) { 
        var _this = this;
        //add callback to the queue
        this.queue.push(function(){
            var finished = callback(function(){
                _this.next();
            });
            if(typeof finished === "undefined" || finished) {
               //  if callback returns `false`, then you have to 
               //  call `next` somewhere in the callback
               _this.next();
            }
        });

        if(!this.running) {
            // if nothing is running, then start the engines!
            this.next();
        }

        return this; // for chaining fun!
    }

    QueueTaskUtil.prototype.next = function(){
        this.running = false;
        //get the first element off the queue
        var shift = this.queue.shift(); 
        if(shift) { 
            this.running = true;
            shift(); 
        }
    }

    return QueueTaskUtil;

})();

QueueTask = new QueueTaskUtil();