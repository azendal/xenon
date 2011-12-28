Class(Xenon, 'Range').includes(CustomEventSupport)({
    prototype : {
        range : null,
        init : function (range) {
            this.range = range;
        },
        getModifiableNodes : function () {
            var nodes = [];
            var range = this.range;
            
            if (this.range.isCollapsed === true) {
                this.range.selectNodeContents(this.range.startContainer);
            }
            
            if (range.startContainer.length == range.startOffset) {
                if (range.startContainer.nextSibling) {
                    range.setStart(range.startContainer.nextSibling, 0);
                }
            }
            
            if (range.endContainer.length == range.endOffset) {
                if (range.endContainer.parentNode) {
                    range.setEnd(range.endContainer.parentNode, 1);
                }
            }
            
            if (range.startContainer == range.endContainer) {
                nodes.push(range.startContainer);
            }
            else if (range.startContainer == range.endContainer && range.startContainer.nodeType == HTMLElement.prototype.TEXT_NODE) {
                var node = document.createElement('div');
                range.surroundContents(node);
                nodes.push(node);
            }
            else {
                
            }
            
            return nodes;
        },
        narrow : function (element) {
            var newRange = this.range.cloneRange();
            newRange.selecNodeContents(element);
            return new this.constructor(newRange);
        },
        expand : function () {
            var newRange = this.range.cloneRange()
            var start = $(newRange.startContainer).closest('*')[0];
            var end = $(newRange.endContainer).closest('*')[0];

            if (start == end){
                newRange.selectNodeContents(start);
                return new this.constructor(newRange);
            }
        },
        normalize : function () {
            var newRange = this.range.cloneRange();
            newRange.commonAncestorContainer.normalize();
            return new this.constructor(newRange);
        },
        setStart : function (element, offset) {
            this.range.setStart(element, offset);
        },
        setEnd : function (element, offset) {
            this.range.setEnd(element, offset);
        }
    }
});