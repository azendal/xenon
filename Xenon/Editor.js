Class(Xenon, 'Editor').includes(CustomEventSupport, NodeSupport)({
    eventTrap : null,
    prototype : {
        STATUS_ACTIVE : 'STATUS_ACTIVE',
        STATUS_INACTIVE : 'STATUS_INACTIVE',
        status : 'STATUS_INACTIVE',
        init : function (config) {
            this.element = config.targetElement;
            
            this.initTrap();
            this.initShortcuts();
            this.initListeners();
        },
        initTrap : function () {
            var inlineEditor = this;
            
            this.element.bind('click', function (event) {
                if (inlineEditor.status == inlineEditor.STATUS_INACTIVE) {
                    inlineEditor.activate();
                }
                event.preventDefault();
            });
            
            this.element.bind('focus', function (event) {
                if (inlineEditor.status == inlineEditor.STATUS_INACTIVE) {
                    inlineEditor.activate();
                }
                event.preventDefault();
            });
            
            this.element.bind('blur', function (event) {
                if (inlineEditor.status == inlineEditor.STATUS_ACTIVE) {
                    inlineEditor.deactivate();
                }
            });
            
            this.element.bind('paste', function (event) {
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
                
                element = document.getSelection().getRangeAt(0).commonAncestorContainer;
                
                if (element.nodeType == HTMLElement.prototype.TEXT_NODE) {
                    element = element.parentNode;
                }
                
                inlineEditor.dispatch('selectionChange', {originalEvent: event, element : element});
            };
            
            this.element.bind({
                'mousedown' : handler,
                'mouseup'   : handler,
                'keypress'  : handler,
                'paste'     : handler
            });
            
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
                    inlineEditor.setBold();
                    //document.execCommand('bold', false, null);
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
            document.getSelection().getRangeAt(0).surroundContents(span);
            
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