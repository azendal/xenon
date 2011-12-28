<script type="text/javascript" charset="utf-8">
    //     keymaster.js
    //     (c) 2011 Thomas Fuchs
    //     keymaster.js may be freely distributed under the MIT license.

    ;(function(global){
      var k,
        _handlers = {},
        _mods = { 16: false, 18: false, 17: false, 91: false },
        _scope = 'all',
        // modifier keys
        _MODIFIERS = {
          '⇧': 16, shift: 16,
          '⌥': 18, alt: 18, option: 18,
          '⌃': 17, ctrl: 17, control: 17,
          '⌘': 91, command: 91
        },
        // special keys
        _MAP = {
          backspace: 8, tab: 9, clear: 12,
          enter: 13, 'return': 13,
          esc: 27, escape: 27, space: 32,
          left: 37, up: 38,
          right: 39, down: 40,
          del: 46, 'delete': 46,
          home: 36, end: 35,
          pageup: 33, pagedown: 34,
          ',': 188, '.': 190, '/': 191,
          '`': 192, '-': 189, '=': 187,
          ';': 186, '\'': 222,
          '[': 219, ']': 221, '\\': 220
        };

      for(k=1;k<20;k++) _MODIFIERS['f'+k] = 111+k;

      // IE doesn't support Array#indexOf, so have a simple replacement
      function index(array, item){
        var i = array.length;
        while(i--) if(array[i]===item) return i;
        return -1;
      }

      // handle keydown event
      function dispatch(event){
        var key, tagName, handler, k, i, modifiersMatch;
        tagName = (event.target || event.srcElement).tagName;
        key = event.keyCode;

        // if a modifier key, set the key.<modifierkeyname> property to true and return
        if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
        if(key in _mods) {
          _mods[key] = true;
          // 'assignKey' from inside this closure is exported to window.key
          for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
          return;
        }

        // ignore keypressed in any elements that support keyboard data input
        if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') return;

        // abort if no potentially matching shortcuts found
        if (!(key in _handlers)) return;

        // for each potential shortcut
        for (i = 0; i < _handlers[key].length; i++) {
          handler = _handlers[key][i];

          // see if it's in the current scope
          if(handler.scope == _scope || handler.scope == 'all'){
            // check if modifiers match if any
            modifiersMatch = handler.mods.length > 0;
            for(k in _mods)
              if((!_mods[k] && index(handler.mods, +k) > -1) ||
                (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
            // call the handler and stop the event if neccessary
            if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
              if(handler.method(event, handler)===false){
                if(event.preventDefault) event.preventDefault();
                  else event.returnValue = false;
                if(event.stopPropagation) event.stopPropagation();
                if(event.cancelBubble) event.cancelBubble = true;
              }
            }
          }
    	}
      };

      // unset modifier keys on keyup
      function clearModifier(event){
        var key = event.keyCode, k;
        if(key == 93 || key == 224) key = 91;
        if(key in _mods) {
          _mods[key] = false;
          for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
        }
      };

      // parse and assign shortcut
      function assignKey(key, scope, method){
        var keys, mods, i, mi;
        if (method === undefined) {
          method = scope;
          scope = 'all';
        }
        key = key.replace(/\s/g,'');
        keys = key.split(',');

        if((keys[keys.length-1])=='')
          keys[keys.length-2] += ',';
        // for each shortcut
        for (i = 0; i < keys.length; i++) {
          // set modifier keys if any
          mods = [];
          key = keys[i].split('+');
          if(key.length > 1){
            mods = key.slice(0,key.length-1);
            for (mi = 0; mi < mods.length; mi++)
              mods[mi] = _MODIFIERS[mods[mi]];
            key = [key[key.length-1]];
          }
<script type="text/javascript" charset="utf-8">
    Class(Breeze, 'InlineEditor').inherits(Breeze.Widget)({
        eventTrap : null,
        prototype : {
            STATUS_ACTIVE : 'STATUS_ACTIVE',
            STATUS_INACTIVE : 'STATUS_INACTIVE',
            status : 'STATUS_INACTIVE',
            init : function (config) {
                config.element = config.targetElement;
                delete config.targetElement;
                
                Breeze.Widget.prototype.init.call(this, config);
                
                this.initTrap();
                this.initShortcuts();
                this.initListeners();
            },
            initTrap : function () {
                var inlineEditor = this;
                
                this.eventTrap = new Breeze.EventTrap({
                    targetElement : this.element,
                    trappedEvents : ['click', 'paste']
                });
                
                this.eventTrap.bind('click', function (event) {
                    if (inlineEditor.status == inlineEditor.STATUS_INACTIVE) {
                        inlineEditor.activate();
                    }
                    event.preventDefault();
                });
                
                this.eventTrap.bind('blur', function (event) {
                    if (inlineEditor.status == inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.deactivate();
                    }
                });
                
                this.eventTrap.bind('paste', function (event) {
                    setTimeout(function(){
                        console.log(inlineEditor.element.html());
                        inlineEditor.dispatch('paste');
                    });
                });
                
                return this;
            },
            initListeners : function () {
                var inlineEditor, handler, element;
                
                inlineEditor = this;
                handler = function (event) {
                    
                    if (inlineEditor.status == inlineEditor.STATUS_INACTIVE) {
                        return;
                    }
                    
                    element = Breeze.Selection.getRangeAt(0).commonAncestorContainer;
                    
                    if (element.nodeType == HTMLElement.prototype.TEXT_NODE) {
                        element = element.parentNode;
                    }
                    
                    inlineEditor.dispatch('selectionChange', {originalEvent: event, element : element});
                };
                
                this.element.bind({
                    'mousedown' : handler,
                    'mouseup'   : handler,
                    'keypress'  : handler
                });
                
                this.eventTrap.bind('paste', handler);
                
                return this;
            },
            initShortcuts : function () {
                var inlineEditor = this;
                
                key('esc', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.deactivate();
                    }
                    return false;
                });
                
                key('ctrl+e', function (e) {
                    key.setScope('editor');
                    return false;
                });
                
                key('esc', 'editor', function (e) {
                    key.setScope('all');
                    return false;
                });
                
                key('b', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        //inlineEditor.setBold();
                        document.execCommand('bold', false, null);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('shift+b', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.setStyle('font-weight', '');
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('i', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.setStyle('font-style', 'italic');
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('shift+i', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.setStyle('font-style', '');
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('u', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.setStyle('text-decoration', 'underline');
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('shift+u', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.setStyle('text-decoration', '');
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('s', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var size = prompt('size');
                            if (size) {
                                inlineEditor.setStyle('font-size', size);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('f', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var family = prompt('font family');
                            if (family) {
                                inlineEditor.setStyle('font-family', family);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('c', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var color = prompt('color');
                            if (color) {
                                inlineEditor.setStyle('color', color);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('a', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var align = prompt('align');
                            if (align) {
                                inlineEditor.setStyle('text-align', align);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('d', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var shadow = prompt('shadow');
                            if (shadow) {
                                inlineEditor.setStyle('text-shadow', shadow);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('l', 'editor', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var lineHeight = prompt('line height');
                            if (lineHeight) {
                                inlineEditor.setStyle('line-height', lineHeight);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('h', 'editor', function (e) {
                    key.setScope('html');
                    return false;
                });
                
                key('esc', 'html', function (e) {
                    key.setScope('all');
                    return false;
                });
                
                key('o', 'html', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.createOrderedList();
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('u', 'html', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.createUnorderedList();
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('m', 'editor', function (e) {
                    key.setScope('media');
                    return false;
                });
                
                key('esc', 'media', function (e) {
                    key.setScope('all');
                    return false;
                });
                
                key('l', 'media', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var url = prompt('link url');
                            if (url) {
                                inlineEditor.insertLink(url);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('shift+l', 'media', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        inlineEditor.removeLink();
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('i', 'media', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var url = prompt('image url');
                            if (url) {
                                inlineEditor.insertImage(url);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
                
                key('v', 'media', function (e) {
                    if (inlineEditor.status === inlineEditor.STATUS_ACTIVE) {
                        setTimeout(function () {
                            var url = prompt('video url');
                            if (url) {
                                inlineEditor.insertVideo(url);
                            }
                        }, 0);
                    }
                    
                    key.setScope('all');
                    return false;
                });
            },
            activate : function () {
                var inlineEditor = this;
                
                this.dispatch('activate');
                this.element[0].setAttribute('contenteditable', true);
                this.element[0].focus();
                this.status = this.STATUS_ACTIVE;
                
                return this;
            },
            deactivate : function () {
                this.dispatch('deactivate');
                this.element[0].removeAttribute('contenteditable');
                this.element[0].blur();
                this.status = this.STATUS_INACTIVE;
                
                return this;
            },
            setStyle : function (property, value) {
                var span = document.createElement('span');
                $(span).css(property, value);
                Breeze.Selection.getRangeAt(0).surroundContents(span);
                
                return this;
            },
            setBold : function () {
                this.setStyle('font-weight', 'bold');
                this.dispatch('unsetBold');
                
                return this;
            },
            unsetBold : function () {
                this.setStyle('font-weight', '');
                this.dispatch('unsetBold');
                
                return this;
            },
            setItalic : function () {},
            unsetItalic : function () {},
            setUnderline : function () {},
            unsetUnderline : function () {},
            setColor : function () {},
            unsetColor : function () {},
            setFontSize : function () {},
            unsetFontSize : function () {},
            setFontFamily : function () {},
            unsetFontFamily : function () {},
            setTextShadow : function () {},
            unsetTextShadow : function () {},
            setLineHeight : function () {},
            unsetLineHeight : function () {},
            setLinkHoverColor : function () {},
            unsetLinkHoverColor : function () {},
            setAlign : function () {},
            unsetAlign : function () {},
            createOrderedList : function () {
                document.execCommand('insertOrderedList', false, null);
            },
            removeOrderedList : function () {
                document.execCommand('outdent', false, null);
            },
            createUnorderedList : function () {
                document.execCommand('insertUnorderedList', false, null);
            },
            removeUnorderedList : function () {
                document.execCommand('outdent', false, null);
            },
            insertLink  : function (url) {
                document.execCommand('createLink', false, url);
            },
            removeLink : function () {
                document.execCommand('unlink', false, null);
            },
            insertImage : function (url) {
                document.execCommand('insertImage', false, url);
            },
            insertVideo : function (url) {
                var embed = '\
                    <object class="video-embed clearfix" width="203" height="117">\
                        <param name="movie" value="' + url + '">\
                        <param name="allowFullScreen" value="true">\
                        <param name="wmode" value="opaque">\
                        <param name="allowscriptaccess" value="always">\
                        <embed type="application/x-shockwave-flash" \
                            allowscriptaccess="always" \
                            allowfullscreen="true" \
                            wmode="opaque" \
                            src="' + url + '" \
                            width="203" \
                            height="117">\
                    </object>\
                ';
                document.execCommand('insertHTML', false, embed);
            }
        }
    });
    
    Class(Breeze, 'Selection').includes(CustomEventSupport)({
        getRangeAt : function (position) {
            return getSelection().getRangeAt(position);
        },
        removeAllRanges : function (range) {
            return getSelection().removeAllRanges();
        },
        addRange : function (range) {
            return getSelection().addRange(range);
        }
    });
    
    Class(Breeze, 'Range').includes(CustomEventSupport)({
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
                    var node = document.createElement('span');
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
    
    Module(Breeze, 'DOM')({});
    
    Class(Breeze.DOM, 'NodeUtils')({
        split : function (element) {
            
        }
    });
</script>
