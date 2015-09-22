(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CustomElement = require('generate-js-custom-element'),
    config = {
        templates: {
            index: require('./templates/index.hbs')
        },
        interactions: {
            visit: {
                event: 'click',
                target: '.menu a',
                listener: function visitListener(e, $el) {
                    var _ = this;
                    _.$element.find('.active').removeClass('active');
                    $el.addClass('active');
                }
            }
        }
    };

var App = CustomElement.generate(function App($element, options) {
    var _ = this;

    _.supercreate($element, config);
    _.defineProperties(options);
});

App.definePrototype({
});

module.exports = window.FWP = App;

},{"./templates/index.hbs":2,"generate-js-custom-element":3}],2:[function(require,module,exports){
module.exports = "<div class=\"header\">\n    <h2>\n        <!--<i class=\"glyphicons glyphicons-show-big-thumbnails\"></i>-->\n        <a href=\"#!/status\">BrilliantLabs.ca</a>\n    </h2>\n\n    <ul class=\"installation-menu menu\">\n        <li><a href=\"#!/status\">Status</a></li>\n        <li><a href=\"#!/backups\">Backups</a></li>\n        <li><a href=\"#!/history\">History</a></li>\n        <li><a href=\"#!/clone\">Clone</a></li>\n        <li><a href=\"#!/ssl\" class=\"active\">SSL</a></li>\n        <li><a href=\"#!/destroy\">Destroy</a></li>\n    </ul>\n\n    <ul class=\"account-menu menu\">\n        <li><a href=\"#!/sites\">My Sites</a></li>\n        <li><a href=\"#!/account\">My Account</a></li>\n    </ul>\n</div>\n\n<div class=\"main\">\n    THIS IS THE BODY.\n</div>\n";

},{}],3:[function(require,module,exports){
module.exports = require('./lib/custom-element');

},{"./lib/custom-element":4}],4:[function(require,module,exports){
var Bindable = require('generate-js-bindings'),
    Bars = require('bars');

if (typeof $ !== 'function' && typeof jQuery !== 'function') {
    throw new Error('jQuery is required.');
}

var CustomElement = Bindable.generate(function CustomElement(element, options) {
    var _ = this;

    _.supercreate();

    _.defineProperties({
        Bars: Bars.create(),
        components: [],
        $element: $(element),
        templates: {}
    });

    for (var option in options) {
        switch (option) {
        case 'templates':
            _.parseTemplates(options[option]);
            break;
        case 'partials':
            _.parsePartials(options[option]);
            break;
        case 'helpers':
            _.parseHelpers(options[option]);
            break;
        case 'interactions':
            _.parseInteractions(options[option]);
            break;
        }
    }

    _.on('changed', function() {
        _.update();
    });

    _.render();

    // _.Bars.registerHelper('component', function(componentName, options) {
    //     var component = _.config.subComponents[componentName];
    //     var BarsData = this;

    //     if (component) {
    //         var id = componentName.toLowerCase() + '-' + Math.random().toString(36).substring(7);

    //         setTimeout(function dumbTimeout() {
    //             var obj = component.create('[data-id="' + id + '"]', BarsData);
    //             obj.parent = _;
    //             _.components[componentName].push(obj);
    //         }, 0);

    //         return new _.Bars.SafeString('<div data-id="' + id + '">' + BarsData + '</div>');
    //     } else {
    //         throw new Error('No component found (' + componentName + ').');
    //     }
    // });
});

CustomElement.createElement = function createElement(config) {
    return this.generate(function Element(el, data) {
        this.supercreate(el, config, data);
    });
};

CustomElement.definePrototype({
    __eventListener: function eventListener(interaction) {
        var _ = this;

        return function (event) {
            return interaction.listener.call(_, event, $(this));
        };
    },
    parseInteractions: function parseInteractions(interactions) {
        var _ = this;

        for (var key in interactions) {
            var interaction = interactions[key];

            if (interaction.target) {
                _.$element.on(interaction.event, interaction.target, _.__eventListener(interaction));
            } else {
                _.$element.on(interaction.event, _.__eventListener(interaction));
            }
        }
    },
    parseTemplates: function parseTemplates(templates) {
        var _ = this;

        for (var key in templates) {
            _.templates[key] = _.Bars.compile(templates[key]);
        }
    },
    parsePartials: function parsePartials(partials) {
        var _ = this;

        for (var key in partials) {
            _.Bars.registerPartial(key, partials[key]);
        }
    },
    parseHelpers: function parseHelpers(helpers) {
        var _ = this;

        for (var key in helpers) {
            _.Bars.registerHelper(key, helpers[key]);
        }
    },
    update: function(newData) {
        var _ = this;

        // for (var key in newData) {
        //     _._data[key] = newData[key];
        // }

        _.dom.update(newData);
    },
    dispose: function dispose() {
        var _ = this;
        _.$element.off();
        _.$element.empty();
    },
    render: function render(template) {
        var _ = this;

        template = typeof template === 'string' ? _.templates[template] : _.templates.index;

        if (template && typeof template.render === 'function') {
            _.$element.empty();
            _.dom = template.render(_._data);
            _.dom.appendTo(_.$element[0]);
        } else {
            _.emit('error', new Error('Failed to render: Invalid template.'));
        }
    }
});

window.CustomElement = module.exports = CustomElement;

},{"bars":5,"generate-js-bindings":14}],5:[function(require,module,exports){
module.exports = require('./lib');

},{"./lib":10}],6:[function(require,module,exports){
var Generator = require('generate-js'),
    Parser = require('./parser'),
    Renderer = require('./renderer'),
    Blocks = require('./blocks'),
    Helpers = require('./helpers');

var Bars = Generator.generate(function Bars() {
    var _ = this;

    _.defineProperties({
        blocks: Blocks.create(),
        partials: {},
        helpers: Helpers.create()
    });
});

Bars.definePrototype({
    compile: function compile(template) {
        var _ = this,
            parsed = Parser(template);

        console.log(parsed);

        return Renderer.create(_, parsed );
    },

    registerBlock: function registerBlock(name, block) {
        var _ = this;

        _.blocks[name] = block;
    },

    registerPartial: function registerPartial(name, template) {
        var _ = this;

        _.partials[name] = _.compile(template);
    },

    registerHelper: function registerHelper(name, func) {
        var _ = this;

        _.helpers[name] = func;
    },
});

module.exports = window.Bars = Bars;

},{"./blocks":7,"./helpers":9,"./parser":11,"./renderer":12,"generate-js":13}],7:[function(require,module,exports){
var Generator = require('generate-js');

var Blocks = Generator.generate(function Blocks() {});

Blocks.definePrototype({
    if: function ifBlock(con) {
        return con;
    },

    unless: function unlessBlock(con) {
        return !con;
    },

    with: function withBlock(data) {
        var _ = this;

        if (data && typeof data === 'object') {
            _.context = _.context.getContext(_.args);

            return true;
        }

        return false;
    },

    each: function eachBlock(data) {
        var _ = this,
            i;

        if (data && typeof data === 'object') {
            var keys = Object.keys(data);

            _.context = _.context.getContext(_.args);

            if (keys.length) {
                for (i = _.nodes.length; i < keys.length; i++) {
                    _.createFragment(keys[i]);
                }

                for (i = keys.length; i < _.nodes.length; i++) {
                    _.nodes[i].remove();
                }

                return true;
            }
        }

        return false;
    },

    reverse: function reverseBlock(data) {
        var _ = this,
            i;

        if (data && typeof data === 'object') {
            var keys = Object.keys(data).reverse();

            _.context = _.context.getContext(_.args);

            if (keys.length) {
                for (i = _.nodes.length; i < keys.length; i++) {
                    _.createFragment(keys[i]);
                }

                for (i = keys.length; i < _.nodes.length; i++) {
                    _.nodes[i].remove();
                }

                return true;
            }
        }

        return false;
    }
});

module.exports = Blocks;

},{"generate-js":13}],8:[function(require,module,exports){
var Generator = require('generate-js'),
    Nodes = {};

/**
 * [BarsNode description]
 * @param {[type]} bars     [description]
 * @param {[type]} struct   [description]
 */
var BarsNode = Generator.generate(function BarsNode(bars, struct) {
    var _ = this;

    _.defineProperties({
        bars: bars,
        nodes: [],
        parentTag: {
            get: _.getParentTag
        },
        prevDom: {
            get: _.getPrevDom
        },
        type: struct.type,
        name: struct.name,
        text: struct.text,
        args: struct.args,
        conFrag: struct.conFrag,
        altFrag: struct.altFrag,
    });
});

BarsNode.definePrototype({
    update: function update(context) {
        var _ = this;

        _.previousDom = null;

        _._update(context);

        if (_.isDOM) {
            _._elementAppendTo();
            _.parentTag.previousDom = _;
        }

        _.previousDom = null;
    },

    _update: function _update() {
        console.warn('_update method not implemented.');
    },

    appendChild: function appendChild(child) {
        var _ = this;

        _.nodes.push(child);
        child.parent = _;
    },

    remove: function remove() {
        var _ = this,
            index = _.parent.nodes.indexOf(_);

        if (index >= 0) {
            _.parent.nodes.splice(index, 1);
        }

        _._elementRemove();
    },

    getParentTag: function getParentTag() {
        var _ = this,
            parent = _.parent,
            oldParent = parent;

        while (parent && !parent.isDOM) {
            oldParent = parent;
            parent = parent.parent;
        }

        return parent || oldParent || null;
    },

    getPrevDom: function getPrevDom() {
        var _ = this;

        return (_.parentTag && _.parentTag.previousDom) || null;
    },

    _elementAppendTo: function _elementAppendTo(parent) {
        var _ = this;

        if (parent instanceof Element && _.isDOM) {
            parent.appendChild(_.$el);
        } else if (_.isDOM) {
            if (!_.parentTag) return;

            parent = _.parentTag.$el || _.parentTag.$parent;

            if (!parent) return;

            var prev = _.prevDom;

            if (prev) {
                parent.insertBefore(_.$el, prev.$el.nextSibling);
            } else {
                parent.appendChild(_.$el);
            }
        }
    },

    _elementRemove: function _elementRemove() {
        var _ = this;

        if (_.isDOM && _.$el.parentNode instanceof Element) {
            _.$el.parentNode.removeChild(_.$el);
        }
    },
});


/**
 * [TextNode description]
 * @param {[type]} bars    [description]
 * @param {[type]} struct  [description]
 */
Nodes.TEXT = BarsNode.generate(function TextNode(bars, struct) {
    var _ = this;

    _.supercreate(bars, struct);

    _.defineProperties({
        $el: document.createTextNode(struct.text)
    });
});

Nodes.TEXT.definePrototype({
    isDOM: true,

    appendChild: function appendChild(child) {
        console.warn('appendChild CANNOT be called on TextNodes.');
    },

    _update: function _update(context) {
        var _ = this,
            helper,
            args;

        if (_.name) {
            helper = _.bars.helpers[_.name];

            if (typeof helper === 'function') {
                args = _.args.split(/\s+/).map(function(item) {
                    return context(item);
                });

                _.$el.textContent = helper.apply(_, args);
            } else {
                throw new Error('Helper not found: ' + _.name);
            }
        } else if (typeof _.args === 'string') {
            _.$el.textContent = context(_.args);
        }
    },
});


/**
 * [TagNode description]
 * @param {[type]} bars    [description]
 * @param {[type]} struct  [description]
 */
Nodes.TAG = BarsNode.generate(function TagNode(bars, struct) {
    var _ = this,
        nodes = struct.nodes,
        attrs = struct.attrs;

    _.supercreate(bars, struct);

    _.defineProperties({
        $el: document.createElement(struct.name),
        attrs: []
    });

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        _.appendChild(Nodes[node.type].create(bars, node));
    }

    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        _.addAttr(Nodes[attr.type].create(bars, attr));
    }

});

Nodes.TAG.definePrototype({
    isDOM: true,

    _update: function _update(context) {
        var _ = this;

        for (var i = 0; i < _.attrs.length; i++) {
            _.attrs[i].update(context);
        }

        for (var i = 0; i < _.nodes.length; i++) {
            _.nodes[i].update(context);
        }
    },

    addAttr: function addAttr(child) {
        var _ = this;

        _.attrs.push(child);
        child.parent = _;
    },
});


/**
 * [AttrNode description]
 * @param {[type]} bars    [description]
 * @param {[type]} struct  [description]
 */
Nodes.ATTR = BarsNode.generate(function AttrNode(bars, struct) {
    var _ = this,
        nodes = struct.nodes,
        attrs = struct.attrs;

    _.supercreate(bars, struct);

    _.defineProperties({
        $el: document.createElement('div'),
    });

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        _.appendChild(Nodes[node.type].create(bars, node));
    }
});

Nodes.ATTR.definePrototype({
    isDOM: true,
    type: 'ATTR',
    _update: function _update(context) {
        var _ = this,
            i;

        for (i = 0; i < _.nodes.length; i++) {
            _.nodes[i].update(context);
        }
    },
    _elementAppendTo: function _elementAppendTo() {
        var _ = this,
            parent = _.parentTag.$el;

        if (parent instanceof Element) {
            parent.setAttribute(_.name, _.$el.innerText);

        }
    },
    _elementRemove: function _elementRemove() {
        var _ = this,
            parent = _.parentTag.$el;

        if (parent instanceof Element) {
            parent.removeAttribute(_.name);
        }
    }
});


/**
 * [BlockNode description]
 * @param {[type]} bars    [description]
 * @param {[type]} struct  [description]
 */
Nodes.BLOCK = BarsNode.generate(function BlockNode(bars, struct) {
    var _ = this;

    _.supercreate(bars, struct);
});

Nodes.BLOCK.definePrototype({
    type: 'BLOCK',

    createFragment: function createFragment(path) {
        var _ = this,
            frag = Nodes.FRAG.create(_.bars, _.conFrag);

        frag.setPath(path);

        _.appendChild(frag);
    },

    _update: function _update(context) {
        var _ = this,
            con;

        if (typeof _.bars.blocks[_.name] === 'function') {
            _.context = context;
            con = _.bars.blocks[_.name].call(_, _.context(_.args));
        } else {
            throw new Error('Block helper not found: ' + _.name);
        }

        if (con) {
            if (!_.nodes.length) {
                _.createFragment();
            }

            for (var i = 0; i < _.nodes.length; i++) {
                _.nodes[i].update(_.context);
            }

            if (_.alternate) {
                _.alternate._elementRemove();
            }
        } else {
            for (var i = 0; i < _.nodes.length; i++) {
                _.nodes[i]._elementRemove();
            }
            if (!_.alternate) {
                _.alternate = Nodes.FRAG.create(_.bars, _.altFrag);
                _.alternate.parent = _;
            }

            _.alternate.update(_.context);
        }
    },
    _elementAppendTo: function _elementAppendTo() {},
    _elementRemove: function _elementRemove() {
        var _ = this,
            i;

        for (i = 0; i < _.nodes.length; i++) {
            _.nodes[i]._elementRemove();
        }

        if (_.alternate) {
            _.alternate._elementRemove();
        }
    }
});


/**
 * [PartialNode description]
 * @param {[type]} bars    [description]
 * @param {[type]} struct  [description]
 */
Nodes.PARTIAL = BarsNode.generate(function PartialNode(bars, struct) {
    var _ = this;

    _.supercreate(bars, struct);
});

Nodes.PARTIAL.definePrototype({
    _update: function _update(context) {
        var _ = this;

        if (!_.partial) {
            var partial = _.bars.partials[_.name];

            if (partial && typeof partial === 'object') {
                _.partial = Nodes.FRAG.create(_.bars, partial);
                _.partial.parent = _;
                _.partial.setPath(_.args);
            } else {
                throw new Error('Partial not found: ' + _.name);
            }
        }

        _.partial.update(context);
    },
});


/**
 * [FragNode description]
 * @param {[type]} bars    [description]
 * @param {[type]} struct  [description]
 */
Nodes.FRAG = BarsNode.generate(function FragNode(bars, struct) {
    var _ = this,
        nodes = struct.nodes;

    _.supercreate(bars, struct);

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        _.appendChild(Nodes[node.type].create(bars, node));
    }
});

Nodes.FRAG.definePrototype({
    _update: function _update(context) {
        var _ = this;

        if (typeof context !== 'function') {
            _.data = context;
            context = _.getContext('');
        }

        if (_.path) {
            context = context.getContext(_.path);
        }

        for (var i = 0; i < _.nodes.length; i++) {
            _.nodes[i].update(context);
        }
    },

    _elementAppendTo: function _elementAppendTo(parent) {
        var _ = this;

        _.$parent = parent;
    },
    _elementRemove: function _elementRemove() {
        var _ = this;

        for (var i = 0; i < _.nodes.length; i++) {
            _.nodes[i]._elementRemove();
        }

        _.$parent = null;
    },

    appendTo: function appendTo(parent) {
        var _ = this;

        if (parent instanceof Element) {
            _._elementAppendTo(parent);
            _.update(_.data);
        }
    },

    getValue: function getValue(splitPath) {
        var _ = this;

        var value = _.data;

        for (var i = 0; i < splitPath.length; i++) {
            if (splitPath[i] === '@key' || splitPath[i] === '@index') {
                value = splitPath[i - 1];
            } else if (value !== null && value !== void(0)) {
                value = value[splitPath[i]];
            } else {
                return;
            }
        }

        return value;
    },
    getContext: function getContext(basepath) {
        var _ = this;

        function context(path) {
            return _.getValue(_.resolve(basepath, path));
        }

        context.getContext = function getContext(path) {
            return _.getContext(_.resolve(basepath, path).join('/'));
        };

        return context;
    },

    setPath: function setPath(path) {
        var _ = this;

        if (path) {
            _.defineProperties({
                path: path.toString()
            });
        }
    },

    resolve: function resolve(basepath, path) {
        var newSplitpath;

        if (path[0] === '/') {
            newSplitpath = path.split('/');
        } else {
            newSplitpath = basepath.split('/').concat(path.split('/'));
        }


        for (var i = 0; i < newSplitpath.length; i++) {
            if (newSplitpath[i] === '.' || newSplitpath[i] === '') {
                newSplitpath.splice(i, 1);
                i--;
            } else if (newSplitpath[i] === '..') {
                newSplitpath.splice(i - 1, 2);
                i -= 2;
            }
        }

        return newSplitpath;
    }
});

module.exports = Nodes.FRAG;

},{"generate-js":13}],9:[function(require,module,exports){
var Generator = require('generate-js');

var Helpers = Generator.generate(function Helpers() {});

Helpers.definePrototype({
    log: function log() {
        console.log.apply(console, arguments);
    }
});

module.exports = Helpers;

},{"generate-js":13}],10:[function(require,module,exports){
module.exports = require('./bars');

},{"./bars":6}],11:[function(require,module,exports){
if (!String.prototype.codePointAt) {
    String.prototype.codePointAt = function (pos) {
        pos = isNaN(pos) ? 0 : pos;
        var str = String(this),
            code = str.charCodeAt(pos),
            next = str.charCodeAt(pos + 1);
        // If a surrogate pair
        if (0xD800 <= code && code <= 0xDBFF && 0xDC00 <= next && next <= 0xDFFF) {
            return ((code - 0xD800) * 0x400) + (next - 0xDC00) + 0x10000;
        }
        return code;
    };
}

if (!Number.isNaN) {
    Number.isNaN = function isNaN(value) {
        return value !== value;
    };
}

var LOGGING = false;

var SELF_CLOSEING_TAGS = [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];

var MODES = {
    'DOM-MODE': [
        60 /*'<'*/,  parseHTMLComment,
        60 /*'<'*/,  parseTagClose,
        60 /*'<'*/,  parseTag,
        123 /*'{'*/, parseBarsHelperHTML,
        123 /*'{'*/, parseBarsInsertHTML,
        123 /*'{'*/, parseBarsComment,
        123 /*'{'*/, parseBarsHelper,
        123 /*'{'*/, parseBarsPartial,
        123 /*'{'*/, parseBarsBlockElse,
        123 /*'{'*/, parseBarsBlockClose,
        123 /*'{'*/, parseBarsBlock,
        123 /*'{'*/, parseBarsInsert,
        null,        parseText
    ],
    'ATTR-MODE': [
        47 /*'/'*/, parseTagEnd,
        62 /*'>'*/, parseTagEnd,
        123 /*'{'*/, parseBarsComment,
        123 /*'{'*/, parseBarsBlockElse,
        123 /*'{'*/, parseBarsBlockClose,
        123 /*'{'*/, parseBarsBlock,
        null,        parseWhiteSpace,
        null,        parseAttr,
        null,        parseError
    ],
    'VALUE-MODE': [
        34 /*'"'*/,   parseStringClose,
        39 /*'\''*/,  parseStringClose,
        123 /*'{'*/,  parseBarsComment,
        123 /*'{'*/,  parseBarsHelper,
        123 /*'{'*/,  parseBarsBlockElse,
        123 /*'{'*/,  parseBarsBlockClose,
        123 /*'{'*/,  parseBarsBlock,
        123 /*'{'*/,  parseBarsInsert,
        null,         parseTextValue
    ],
};

var HASH = {
    '&quot;':      34,
    '&amp;':       38,
    '&lt;':        60,
    '&gt;':        62,
    '&nbsp;':      160,
    '&iexcl;':     161,
    '&cent;':      162,
    '&pound;':     163,
    '&curren;':    164,
    '&yen;':       165,
    '&brvbar;':    166,
    '&sect;':      167,
    '&uml;':       168,
    '&copy;':      169,
    '&ordf;':      170,
    '&not;':       172,
    '&shy;':       173,
    '&reg;':       174,
    '&macr;':      175,
    '&deg;':       176,
    '&plusmn;':    177,
    '&sup2;':      178,
    '&sup3;':      179,
    '&acute;':     180,
    '&micro;':     181,
    '&para;':      182,
    '&middot;':    183,
    '&cedil;':     184,
    '&sup1;':      185,
    '&ordm;':      186,
    '&raquo;':     187,
    '&frac14;':    188,
    '&frac12;':    189,
    '&frac34;':    190,
    '&iquest;':    191,
    '&Agrave;':    192,
    '&Aacute;':    193,
    '&Acirc;':     194,
    '&Atilde;':    195,
    '&Auml;':      196,
    '&Aring;':     197,
    '&AElig;':     198,
    '&Ccedil;':    199,
    '&Egrave;':    200,
    '&Eacute;':    201,
    '&Ecirc;':     202,
    '&Euml;':      203,
    '&Igrave;':    204,
    '&Iacute;':    205,
    '&Icirc;':     206,
    '&Iuml;':      207,
    '&ETH;':       208,
    '&Ntilde;':    209,
    '&Ograve;':    210,
    '&Oacute;':    211,
    '&Ocirc;':     212,
    '&Otilde;':    213,
    '&Ouml;':      214,
    '&times;':     215,
    '&Oslash;':    216,
    '&Ugrave;':    217,
    '&Uacute;':    218,
    '&Ucirc;':     219,
    '&Uuml;':      220,
    '&Yacute;':    221,
    '&THORN;':     222,
    '&szlig;':     223,
    '&agrave;':    224,
    '&aacute;':    225,
    '&acirc;':     226,
    '&atilde;':    227,
    '&auml;':      228,
    '&aring;':     229,
    '&aelig;':     230,
    '&ccedil;':    231,
    '&egrave;':    232,
    '&eacute;':    233,
    '&ecirc;':     234,
    '&euml;':      235,
    '&igrave;':    236,
    '&iacute;':    237,
    '&icirc;':     238,
    '&iuml;':      239,
    '&eth;':       240,
    '&ntilde;':    241,
    '&ograve;':    242,
    '&oacute;':    243,
    '&ocirc;':     244,
    '&otilde;':    245,
    '&ouml;':      246,
    '&divide;':    247,
    '&oslash;':    248,
    '&ugrave;':    249,
    '&uacute;':    250,
    '&ucirc;':     251,
    '&uuml;':      252,
    '&yacute;':    253,
    '&thorn;':     254,
    '&euro;':      8364,
};

function HTML_IDENTIFIER(ch) {
    /* ^[_A-Za-z0-9-]$ */
    return (ch === 45) ||
           (48 <= ch && ch <= 57) ||
           (65 <= ch && ch <= 90) ||
           (ch === 95) ||
           (97 <= ch && ch <= 122);
}

function WHITESPACE(ch) {
    /* ^\s$ */
    return (9 <= ch && ch <= 13) ||
            ch === 32 ||
            ch === 160 ||
            ch === 5760 ||
            ch === 6158 ||
            ch === 8192 ||
            ch === 8193 ||
            ch === 8194 ||
            ch === 8195 ||
            ch === 8196 ||
            ch === 8197 ||
            ch === 8198 ||
            ch === 8199 ||
            ch === 8200 ||
            ch === 8201 ||
            ch === 8202 ||
            ch === 8232 ||
            ch === 8233 ||
            ch === 8239 ||
            ch === 8287 ||
            ch === 12288 ||
            ch === 65279;
}

function HTML_ENTITY(ch) {
    /* ^[A-Za-z0-9]$ */
    return (48 <= ch && ch <= 57) ||
           (65 <= ch && ch <= 90) ||
           (97 <= ch && ch <= 122);
}

function getHTMLUnEscape(str) {
    var code;

    code = HASH[str];

    if (typeof code !== 'number') {
        code = parseInt( str.slice(2, -1), 10);
    }

    if (typeof code === 'number' && !Number.isNaN(code)){
        return String.fromCharCode(code);
    }

    return str;
}

function throwError(buffer, index, message) {
    var lines = 1,
        columns = 0;

    for (var i = 0; i < index; i++) {
        if (buffer.codePointAt(i) === 10 /*'\n'*/) {
            lines++;
            columns = 1;
        } else {
            columns++;
        }
    }

    throw new SyntaxError(message + ' at ' + lines + ':' + columns);
}

function parseError(mode, tree, index, length, buffer, indent) {
    throwError(buffer, index, 'Unexpected token: ' + JSON.stringify(buffer[index])+'.');
}

function parseTagEnd(mode, tree, index, length, buffer, indent, close) {
    var ch = buffer.codePointAt(index);

    if (ch === 62 /*'>'*/) {
        LOGGING && console.log(indent + 'parseTagEnd');
        close.closed = true;
        return index;
    }

    if (ch === 47 /*'/'*/ && buffer.codePointAt(index + 1) === 62 /*'>'*/) {
        LOGGING && console.log(indent + 'parseTagEnd');
        index++;
        close.selfClosed = true;
        return index;
    }

    return null;
}

function parseAttr(mode, tree, index, length, buffer, indent) {
    var ch,
        token = {
            type: 'ATTR',
            name: '',
            nodes: []
        };

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (!HTML_IDENTIFIER(ch)) {
            break;
        }

        token.name += buffer[index];
    }

    if (token.name) {
        LOGGING && console.log(indent + 'parseAttr');

        tree.push(token);
        /* ch === '=' */
        if (ch === 61) {
            // move past =
            index++;

            ch = buffer.codePointAt(index);

            /* ch === '"' || ch === '\'' */
            if (ch === 34 || ch === 39) {
                var stringToken = {
                    type: 'STRING',
                    name: ch
                };

                index++;
                index = parse('VALUE-MODE', token.nodes, index, length, buffer, indent, stringToken);

                if (!stringToken.closed) {
                    throwError(buffer, index, 'Missing closing tag: expected \'' + stringToken + '\'.');
                }
            } else {
                var textValueToken = {
                    type: 'TEXT',
                    text: ''
                };
                for (; index < length; index++) {
                    ch = buffer.codePointAt(index);

                    if (!HTML_IDENTIFIER(ch)) {
                        break;
                    }

                    textValueToken.text += buffer[index];
                }

                if (textValueToken.text) {
                    token.nodes.push(textValueToken);
                    index--;
                } else {
                    throwError(buffer, index, 'Unexpected end of input.');
                }
            }
        } else {
            index--;
        }

        return index;
    }

    return null;
}

function parseWhiteSpace(mode, tree, index, length, buffer, indent) {
    var ch,
        whitespace = 0;


    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (!WHITESPACE(ch)) {

            break;
        }
        whitespace++;
    }

    if (whitespace) {
        LOGGING && console.log(indent + 'parseWhiteSpace');
        index--;
        return index;
    }

    return null;
}

function parseStringClose(mode, tree, index, length, buffer, indent, close, noErrorOnMismatch) {
    var token = {
        type: 'STRING',
        name: buffer.codePointAt(index)
    };

    if (token.type === close.type) {
        if (token.name === close.name) {
            close.closed = true;
            return index;
        }
        return null;
    }

    throwError(buffer, index, 'Mismatched closing tag: expected \'' +close.name+ '\' but found \'' +token.name+ '\'.');
}

function parse(mode, tree, index, length, buffer, indent, close) {
    LOGGING && console.log(indent + 'parse - ', mode);

    // LOGGING && console.log({mode: mode, tree: tree, index: index, length: length, buffer: buffer, close: close, indent: indent});

    var ch,
        testCh,
        oldIndex,
        oldIndent = indent,
        oldElsed,
        newIndex,
        parseFuncs = MODES[mode],
        parseFuncsLength = parseFuncs.length,
        parseFunc,
        i;

    indent += '  ';

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        for (i = 0; i < parseFuncsLength; i++) {
            testCh = parseFuncs[i];
            parseFunc = parseFuncs[++i];

            if (ch === testCh || testCh === null) {
                oldIndex = index;
                oldElsed = close && close.elsed;

                newIndex = parseFunc(mode, tree, index, length, buffer, indent, close);

                if (typeof newIndex === 'number') {
                    index = newIndex;
                }

                if (
                    close &&
                    (
                        (close.closed) ||
                        (close.elsed && !oldElsed)
                    )
                ) {
                    break loop;
                }

                if (typeof newIndex === 'number') {
                    break;
                }
            }
        }
    }

    LOGGING && console.log(oldIndent + '<<<');

    return index;
}

function parseTag(mode, tree, index, length, buffer, indent) {
    LOGGING && console.log(indent+'parseTag');

    var ch,
        token = {
            type: 'TAG',
            name: '',
            nodes: [],
            attrs: []
        };

    index++; // move past <
    /* Get Name */
    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (!HTML_IDENTIFIER(ch)) {
            break;
        }

        token.name += buffer[index];
    }

    if (!token.name) {
        throwError(buffer, index, 'Missing tag name.');
    }

    index = parse('ATTR-MODE', token.attrs, index, length, buffer, indent, token);

    if (!token.closed && !token.selfClosed) {
        throwError(buffer, index, 'Unexpected end of input.');
    }

    delete token.closed;

    if (token.selfClosed) {
        delete token.selfClosed;
        return index;
    }

    if (token.name === 'script' || token.name === 'style') {
        var textToken = {
            type: 'TEXT',
            text: ''
        };

        for (; index < length; index++) {
            ch = buffer.codePointAt(index);

            if (ch === 60 /*'<'*/) {
                index = parseTagClose(mode, tree, index, length, buffer, indent, token, true);

                if (token.closed) {
                    delete token.closed;
                    break;
                }
            }

            textToken.text += buffer[index];
        }

        if (textToken.text) {
            token.nodes.push(textToken);
        }
    } else if (SELF_CLOSEING_TAGS.indexOf(token.name) === -1) {
        index++;
        index = parse(mode, token.nodes, index, length, buffer, indent, token);
    } else {
        token.closed = true;
    }

    if (token.closed) {
        delete token.closed;
        tree.push(token);
    } else {
        throwError(buffer, index, 'Missing closing tag: expected \'' + token.name + '\'.');
    }

    return index;
}

function parseTagClose(mode, tree, index, length, buffer, indent, close, noErrorOnMismatch) {

    if (buffer.codePointAt(index + 1) !== 47 /*'/'*/) return null;

    LOGGING && console.log(indent+'parseTagClose');

    var ch,
        token = {
            type: 'TAG',
            name: ''
        },
        nameDone = false,
        end = false;

    index+=2; // move past </
    /* Get Name */
    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (!nameDone && HTML_IDENTIFIER(ch)) {
            token.name += buffer[index];
        } else {
            nameDone = true;
        }

        if (ch === 62 /*'>'*/) {
            end = true;
            break;
        }
    }

    if (!end) {
        throwError(buffer, index, 'Unexpected end of input.');
    }

    if (!close) {
        throwError(buffer, index, 'Unexpected closing tag: \'' +token.name+ '\'.');
    }

    if (token.type === close.type && token.name === close.name) {
        close.closed = true;
    } else if (noErrorOnMismatch) {
        /* Canceling Parse */
        return null;
    } else {
        throwError(buffer, index, 'Mismatched closing tag: expected \'' +close.name+ '\' but found \'' +token.name+ '\'.');
    }

    return index;
}

function parseText(mode, tree, index, length, buffer, indent) {
    var ch,
        isEntity = false,
        entityStr = '',
        token = {
            type: 'TEXT',
            text: ''
        };

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 60 /*'<'*/ || ch === 123 /*'{'*/ && buffer.codePointAt(index + 1) === 123 /*'{'*/) {
            token.text += entityStr;
            index--;
            break;
        }

        if (ch === 38 /*'&'*/) {
            isEntity = true;
            entityStr = buffer[index];

            continue;
        } else if (isEntity && ch === 59 /*';'*/) {
            entityStr += buffer[index];

            token.text += getHTMLUnEscape(entityStr);

            isEntity = false;
            entityStr = '';

            continue;
        }

        if (isEntity && HTML_ENTITY(ch)) {
            entityStr += buffer[index];
        } else {
            token.text += entityStr;
            isEntity = false;
            entityStr = '';

            token.text += buffer[index];
        }
    }

    if (token.text) {
        LOGGING && console.log(indent+'parseText');
        tree.push(token);
        return index;
    }

    return null;
}

function parseTextValue(mode, tree, index, length, buffer, indent, close) {
    var ch,
        token = {
            type: 'TEXT',
            text: ''
        };

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 123 /*'{'*/ || (close && ch === close.name && buffer[index - 1] !== '\\')) {
            index--;
            break;
        }

        token.text += buffer[index];
    }

    if (token.text) {
        LOGGING && console.log(indent+'parseText');
        tree.push(token);
        return index;
    }

    return null;
}

function parseBarsInsert(mode, tree, index, length, buffer, indent) {
    LOGGING && console.log(indent+'parseBarsInsert');

    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        return null;
    }

    var ch,
        token = {
            type: 'TEXT',
            args: ''
        }, endChars = 0;

    // move past {{
    index+=2;
    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }
        token.args += buffer[index];
    }

    tree.push(token);

    return index;
}

function parseBarsInsertHTML(mode, tree, index, length, buffer, indent) {
    LOGGING && console.log(indent+'parseBarsInsert');

    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 2) !== 123 /*'{'*/) {
        return null;
    }

    var ch,
        token = {
            type: 'FRAG',
            args: ''
        }, endChars = 0;

    // move past {{{
    index += 3;
    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 3) {
                    break loop;
                }
            }
        }

        token.args += buffer[index];
    }

    tree.push(token);

    return index;
}

function parseBarsPartial(mode, tree, index, length, buffer, indent) {
    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 2) !== 62 /*'>'*/) {
        /* Canceling Parse */
        return null;
    }
    LOGGING && console.log(indent+'parseBarsPartial');

    var ch,
        token = {
            type: 'PARTIAL',
            name: '',
            args: ''
        }, endChars = 0;

    // move past {{>
    index += 3;

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (HTML_IDENTIFIER(ch)) {
            token.name += buffer[index];
        } else {
            break;
        }
    }

    if (!token.name) {
        throwError(buffer, index, 'Missing partial name.');
    }

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }

        token.args += buffer[index];
    }

    token.args = token.args.trim();

    tree.push(token);

    return index;
}

function parseBarsHelper(mode, tree, index, length, buffer, indent) {
    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 2) !== 63 /*'?'*/) {
        /* Canceling Parse */
        return null;
    }
    LOGGING && console.log(indent+'parseBarsHelper');

    var ch,
        token = {
            type: 'TEXT',
            name: '',
            args: ''
        }, endChars = 0;

    // move past {{?
    index += 3;

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (HTML_IDENTIFIER(ch)) {
            token.name += buffer[index];
        } else {
            break;
        }
    }

    if (!token.name) {
        throwError(buffer, index, 'Missing helper name.');
    }

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }

        token.args += buffer[index];
    }

    token.args = token.args.trim();

    tree.push(token);

    return index;
}

function parseBarsHelperHTML(mode, tree, index, length, buffer, indent) {
    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 2) !== 123 /*'{'*/) {
        /* Canceling Parse */
        return null;
    }

    if (buffer.codePointAt(index + 3) !== 63 /*'?'*/) {
        /* Canceling Parse */
        return null;
    }
    LOGGING && console.log(indent+'parseBarsHelperHTML');

    var ch,
        token = {
            type: 'FRAG',
            name: '',
            args: ''
        }, endChars = 0;

    // move past {{{?
    index += 4;

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (HTML_IDENTIFIER(ch)) {
            token.name += buffer[index];
        } else {
            break;
        }
    }

    if (!token.name) {
        throwError(buffer, index, 'Missing helper name.');
    }

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 3) {
                    break loop;
                }
            }
        }

        token.args += buffer[index];
    }

    token.args = token.args.trim();

    tree.push(token);

    return index;
}

function parseBarsComment(mode, tree, index, length, buffer, indent) {
    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 2) !== 33 /*'!'*/) {
        return null;
    }

    var ch,
        token = {
            type: 'COMMENT',
            comment: ''
        }, endChars = 0;

    // move past {{!
    index+=3;
    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }
        token.comment += buffer[index];
    }

    // TODO: Maybe create comment node?
    // if (token.comment) {
        // LOGGING && console.log(indent+'parseBarsComment');

    //     tree.push(token);

    //     return index;
    // }

    return index;
}

function parseHTMLComment(mode, tree, index, length, buffer, indent) {
    if (buffer.codePointAt(index + 1) !== 33 /*'!'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 2) !== 45 /*'-'*/) {
        return null;
    }

    if (buffer.codePointAt(index + 3) !== 45 /*'-'*/) {
        return null;
    }

    var ch,
        token = {
            type: 'COMMENT',
            comment: ''
        },
        endChars = 0;

    // move past <!--
    index+=4;
    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 45 /*'-'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 45 /*'-'*/) {
                    endChars++;
                } else {
                    endChars = 0;
                    break;
                }

                if (endChars >= 2) {
                    if (buffer.codePointAt(index + 1) === 62 /*'>'*/) {
                        index++;
                        break loop;
                    }
                }
            }
        }
        token.comment += buffer[index];
    }

    // TODO: Maybe create comment node?
    // if (token.comment) {
        // LOGGING && console.log(indent+'parseBarsComment');

    //     tree.push(token);

    //     return index;
    // }

    return index;
}

function parseBarsBlock(mode, tree, index, length, buffer, indent) {

    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        throwError(buffer, index, 'Unexpected end of input.');
    }

    if (buffer.codePointAt(index + 2) !== 35 /*'#'*/) {
        /* Canceling Parse */
        return null;
    }
    LOGGING && console.log(indent+'parseBarsBlock');

    var ch,
        token = {
            type: 'BLOCK',
            name: '',
            args: '',
            conFrag: {
                type: 'FRAG',
                nodes: [],
            },
            altFrag: {
                type: 'FRAG',
                nodes: []
            }
        }, endChars = 0;

    // move past {{#
    index += 3;

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (HTML_IDENTIFIER(ch)) {
            token.name += buffer[index];
        } else {
            break;
        }
    }

    if (!token.name) {
        throwError(buffer, index, 'Missing block name.');
    }

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }

        token.args += buffer[index];
    }

    token.args = token.args.trim();

    index++;
    index = parse(mode, token.conFrag.nodes, index, length, buffer, indent, token);

    if (token.elsed && !token.closed) {
        index++;
        index = parse(mode, token.altFrag.nodes, index, length, buffer, indent, token);
    }

    if (token.closed) {
        delete token.closed;
        delete token.elsed;
        tree.push(token);
    } else {
        throwError(buffer, index, 'Missing closing tag: expected \'' + token.name + '\'.');
    }

    return index;
}

function parseBarsBlockClose(mode, tree, index, length, buffer, indent, close, noErrorOnMismatch) {

    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        throwError(buffer, index, 'Unexpected end of input.');
    }

    if (buffer.codePointAt(index + 2) !== 47 /*'/'*/) {
        return null;
    }

    LOGGING && console.log(indent+'parseBarsBlockClose');


    var ch,
        token = {
            type: 'BLOCK',
            name: ''
        },
        endChars = 0;

    // move past {{#
    index += 3;

    for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (HTML_IDENTIFIER(ch)) {
            token.name += buffer[index];
        } else {
            break;
        }
    }

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }
    }

    if (!close) {
        throwError(buffer, index, 'Unexpected closing tag: \'' +token.name+ '\'.');
    }

    if (token.type === close.type && token.name === close.name) {
        close.closed = true;
    } else if (noErrorOnMismatch) {
        /* Canceling Parse */
        return null;
    } else {
        throwError(buffer, index, 'Mismatched closing tag: expected \'' +close.name+ '\' but found \'' +token.name+ '\'.');
    }

    return index;
}

function parseBarsBlockElse(mode, tree, index, length, buffer, indent, close) {

    if (buffer.codePointAt(index + 1) !== 123 /*'{'*/) {
        throwError(buffer, index, 'Unexpected end of input.');
    }

    var ch,
        name = '',
        endChars = 0;

    // move past {{
    index += 2;

    loop: for (; index < length; index++) {
        ch = buffer.codePointAt(index);

        if (ch === 125 /*'}'*/) {
            endChars++;
            index++;

            for (; index < length; index++) {
                ch = buffer.codePointAt(index);

                if (ch === 125 /*'}'*/) {
                    endChars++;
                } else {
                    throwError(buffer, index, 'Unexpected character: expected \'}\' but found \'' +buffer[index]+ '\'.');
                }

                if (endChars === 2) {
                    break loop;
                }
            }
        }
        name += buffer[index];
    }

    if (close && close.type === 'BLOCK' && name === 'else') {
        if (close.elsed) {
            throwError(buffer, index, 'Unexpected else token.');
        }

        close.elsed = true;

        LOGGING && console.log(indent+'parseBarsBlockElse');
        return index;
    } else if (!close && name === 'else') {
        throwError(buffer, index, 'Unexpected else tag.');
    } else {
        /* Canceling Parse */
        return null;
    }
}

function compile(buffer) {
    var n = Date.now();
    var tree = {
        type: 'FRAG',
        nodes: []
    };

    LOGGING && console.log('compile');

    parse('DOM-MODE', tree.nodes, 0, buffer.length, buffer, '  ', null);

    LOGGING && console.log('compiled');
    //
    LOGGING && console.log(Date.now()-n);

    return tree;
    // return JSON.stringify(tree, null, 2);
}

module.exports = compile;

},{}],12:[function(require,module,exports){
var Generator = require('generate-js'),
    Frag = require('./frag');

var Renderer = Generator.generate(function Renderer(bars, struct) {
    var _ = this;

    _.defineProperties({
        bars: bars,
        struct: struct
    });
});

Renderer.definePrototype({
    render: function render(data) {
        var _ = this,
            frag = Frag.create(_.bars, _.struct);

        frag.update(data);

        return frag;
    },
});

module.exports = Renderer;

},{"./frag":8,"generate-js":13}],13:[function(require,module,exports){
/**
 * @name generate.js
 * @author Michaelangelo Jong
 */

(function GeneratorScope() {

// Variables
var Creation = {},
    Generation = {},
    Generator = {};

// Helper Methods

/**
 * Assert Error function.
 * @param  {Boolean} condition Whether or not to throw error.
 * @param  {String} message    Error message.
 */
function assertError(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

/**
 * Assert TypeError function.
 * @param  {Boolean} condition Whether or not to throw error.
 * @param  {String} message    Error message.
 */
function assertTypeError(test, type) {
    if (typeof test !== type) {
        throw new TypeError('Expected \'' + type + '\' but instead found \'' + typeof test +'\'');
    }
}

/**
 * Returns the name of function 'func'.
 * @param  {Function} func Any function.
 * @return {String}        Name of 'func'.
 */
function getFunctionName(func) {
    if (func.name !== void(0)) {
        return func.name;
    }
    // Else use IE Shim
    var funcNameMatch = func.toString().match(/function\s*([^\s]*)\s*\(/);
    func.name = (funcNameMatch && funcNameMatch[1]) || '';
    return func.name;
}

/**
 * Returns true if 'obj' is an object containing only get and set functions, false otherwise.
 * @param  {Any} obj Value to be tested.
 * @return {Boolean} true or false.
 */
function isGetSet(obj) {
    var keys, length;
    if (obj && typeof obj === 'object') {
        keys = Object.getOwnPropertyNames(obj).sort();
        length = keys.length;

        if ((length === 1 && (keys[0] === 'get' && typeof obj.get === 'function' ||
                              keys[0] === 'set' && typeof obj.set === 'function')) ||
            (length === 2 && (keys[0] === 'get' && typeof obj.get === 'function' &&
                              keys[1] === 'set' && typeof obj.set === 'function'))) {
            return true;
        }
    }
    return false;
}

/**
 * Defines properties on 'obj'.
 * @param  {Object} obj        An object that 'properties' will be attached to.
 * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties on 'properties'.
 * @param  {Object} properties An object who's properties will be attached to 'obj'.
 * @return {Generator}         'obj'.
 */
function defineObjectProperties(obj, descriptor, properties) {
    var setProperties = {},
        i,
        keys,
        length;

    if (!descriptor || typeof descriptor !== 'object') {
        descriptor = {};
    }

    if (!properties || typeof properties !== 'object') {
        properties = descriptor;
        descriptor = {};
    }

    keys = Object.getOwnPropertyNames(properties);
    length = keys.length;

    for (i = 0; i < length; i++) {
        if (isGetSet(properties[keys[i]])) {
            setProperties[keys[i]] = {
                configurable: !!descriptor.configurable,
                enumerable: !!descriptor.enumerable,
                get: properties[keys[i]].get,
                set: properties[keys[i]].set
            };
        } else {
            setProperties[keys[i]] = {
                configurable: !!descriptor.configurable,
                enumerable: !!descriptor.enumerable,
                writable: !!descriptor.writable,
                value: properties[keys[i]]
            };
        }
    }
    Object.defineProperties(obj, setProperties);
    return obj;
}

// Creation Class
defineObjectProperties(
    Creation,
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        /**
         * Defines properties on this object.
         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
         * @param  {Object} properties An object who's properties will be attached to this object.
         * @return {Object}            This object.
         */
        defineProperties: function defineProperties(descriptor, properties) {
            defineObjectProperties(this, descriptor, properties);
            return this;
        },

        /**
         * returns the prototype of `this` Creation.
         * @return {Object} Prototype of `this` Creation.
         */
        getProto: function getProto() {
            return Object.getPrototypeOf(this);
        },

        /**
         * returns the prototype of `this` super Creation.
         * @return {Object} Prototype of `this` super Creation.
         */
        getSuper: function getSuper() {
            return Object.getPrototypeOf(this.generator).proto;
            // return Object.getPrototypeOf(Object.getPrototypeOf(this));
        }
    }
);

// Generation Class
defineObjectProperties(
    Generation,
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        name: 'Generation',

        proto: Creation,

        /**
         * Creates a new instance of this Generator.
         * @return {Generator} Instance of this Generator.
         */
        create: function create() {
            var _ = this,
                newObj = Object.create(_.proto);

            _.__supercreate(newObj, arguments);

            return newObj;
        },

        __supercreate: function __supercreate(newObj, args) {
            var _ = this,
                superGenerator = Object.getPrototypeOf(_),
                supercreateCalled = false;

            newObj.supercreate = function supercreate() {

                supercreateCalled = true;

                if (Generation.isGeneration(superGenerator)){
                    superGenerator.__supercreate(newObj, arguments);
                }
            };

            _.__create.apply(newObj, args);

            if (!supercreateCalled) {
                newObj.supercreate();
            }

            delete newObj.supercreate;
        },

        __create: function () {},

        /**
         * Generates a new generator that inherits from `this` generator.
         * @param {Generator} ParentGenerator Generator to inherit from.
         * @param {Function} create           Create method that gets called when creating a new instance of new generator.
         * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
         */
        generate: function generate(create) {
            var _ = this;

            assertError(Generation.isGeneration(_) || _ === Generation, 'Cannot call method \'generate\' on non-Generations.');
            assertTypeError(create, 'function');

            var newGenerator = Object.create(_),
                newProto     = Object.create(_.proto);

            defineObjectProperties(
                newProto,
                {
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                {
                    generator: newGenerator
                }
            );

            defineObjectProperties(
                newGenerator,
                {
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                {
                    name: getFunctionName(create),
                    proto: newProto,
                    __create: create
                }
            );

            return newGenerator;
        },

        /**
         * Returns true if 'generator' was generated by this Generator.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        isGeneration: function isGeneration(generator) {
            var _ = this;
            return _.isPrototypeOf(generator);
        },

        /**
         * Returns true if 'object' was created by this Generator.
         * @param  {Object} object An Object.
         * @return {Boolean}       true or false.
         */
        isCreation: function isCreation(object) {
            var _ = this;
            return _.proto.isPrototypeOf(object);
        },

        /**
         * Defines shared properties for all objects created by this generator.
         * @param  {Object} descriptor Optional object descriptor that will be applied to all attaching properties.
         * @param  {Object} properties An object who's properties will be attached to this generator's prototype.
         * @return {Generator}         This generator.
         */
        definePrototype: function definePrototype(descriptor, properties) {
            defineObjectProperties(this.proto, descriptor, properties);
            return this;
        },

        /**
         * Generator.toString method.
         * @return {String} A string representation of this generator.
         */
        toString: function toString() {
            return '[' + (this.name || 'generation') + ' Generator]';
        }
    }
);

// Generator Class Methods
defineObjectProperties(
    Generator,
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        /**
         * Generates a new generator that inherits from `this` generator.
         * @param {Generator} ParentGenerator Generator to inherit from.
         * @param {Function} create           Create method that gets called when creating a new instance of new generator.
         * @return {Generator}                New Generator that inherits from 'ParentGenerator'.
         */
        generate: function generate (create) {
            return Generation.generate(create);
        },

        /**
         * Returns true if 'generator' was generated by this Generator.
         * @param  {Generator} generator A Generator.
         * @return {Boolean}             true or false.
         */
        isGenerator: function isGenerator (generator) {
            return Generation.isGeneration(generator);
        },

        /**
         * [toGenerator description]
         * @param  {Function} constructor A constructor function.
         * @return {Generator}            A new generator who's create method is `constructor` and inherits from `constructor.prototype`.
         */
        toGenerator: function toGenerator(constructor) {

            assertTypeError(constructor, 'function');

            var newGenerator = Object.create(Generation),
                newProto     = Object.create(constructor.prototype);

            defineObjectProperties(
                newProto,
                {
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                {
                    generator: newGenerator
                }
            );

            defineObjectProperties(
                newProto,
                {
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                Creation
            );

            defineObjectProperties(
                newGenerator,
                {
                    configurable: false,
                    enumerable: false,
                    writable: false
                },
                {
                    name: getFunctionName(constructor),
                    proto: newProto,
                    __create: constructor
                }
            );

            return newGenerator;
        }
    }
);

Object.freeze(Creation);
Object.freeze(Generation);
Object.freeze(Generator);

// Exports
if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
        return Generator;
    });
} else if (typeof module === 'object' && typeof exports === 'object') {
    // Node/CommonJS
    module.exports = Generator;
} else {
    // Browser global
    window.Generator = Generator;
}

}());

},{}],14:[function(require,module,exports){
var EventEmitter = require('generate-js-events');

/**
 * A type assert method.
 * @param  {Any} variable
 * @param  {String} type
 * @return {void}
 */
function assertType(variable, type) {
    if (typeof variable !== type) {
        throw new Error('Expected ' + type + ' but found ' + typeof variable);
    }
}

var Bindable = EventEmitter.generate(
    /**
     * [Bindable description]
     * @param {Object} data
     */
    function Bindable(data) {
        var _ = this;

        _.defineProperties({
            _data: {}
        });

        for (var key in data) {
            _._data[key] = data[key];
        }
    }
);

Bindable.definePrototype({
    /**
     * [get description]
     * @param  {String} property
     * @return {Any}
     */
    get: function get(property) {
        var _ = this;

        var overWrittenGetter = _['get'+property.slice(0, 1).toUpperCase()+property.slice(1)];
        if (typeof overWrittenGetter === 'function') {
            return overWrittenGetter.call(_);
        }

        return _._data[property];
    },

    /**
     * [set description]
     * @param {String} property
     * @param {Any} newValue
     * @param {Object} changer
     */
    set: function set(property, newValue, changer) {
        changer = typeof changer === 'object' ? changer : null;

        var _ = this;

        var overWrittenSetter = _['set'+property.slice(0, 1).toUpperCase()+property.slice(1)];
        if (typeof overWrittenSetter === 'function') {
            return overWrittenSetter.call(_, newValue, changer);
        }

        var oldValue = _.get(property);
        _._data[property] = newValue;

        _.change(property, oldValue, newValue, changer);
    },

    /**
     * [bind description]
     * @param  {String} property
     * @param  {Function} listener
     * @param  {Object} observer
     * @return {self}
     */
    bind: function bind(property, listener, observer) {
        assertType(property, 'string');
        assertType(listener, 'function');
        assertType(observer, 'object');

        var _ = this;

        _.on(property, listener, observer);

        var value = _.get(property);

        _.__initial__ = true;

        listener.call(_, value, value, false);

        _.__initial__ = false;

        return _;
    },

    /**
     * [bindOnce description]
     * @param  {String} property
     * @param  {Function} listener
     * @param  {Object} observer
     * @return {self}
     */
    bindOnce: function bindOnce(property, listener, observer) {
        assertType(property, 'string');
        assertType(listener, 'function');
        assertType(observer, 'object');

        var _ = this;

        _.once(property, listener, observer);

        var value = _.get(property);

        listener.call(_, value, value, false);

        return _;
    },

    /**
     * [unbind description]
     * @param  {String} [property]
     * @param  {Function} [listener]
     * @param  {Object} [observer]
     * @return {self}
     */
    unbind: function unbind(property, listener, observer) {
        return this.off(property, listener, observer);
    },

    /**
     * [change description]
     * @param {String} property
     * @param {Any} oldValue
     * @param {Any} newValue
     * @param {Object} changer
     * @return {Boolean}
     */
    change: function change(property, oldValue, newValue, changer, object, nochaneevent) {
        assertType(property, 'string');
        assertType(changer, 'object');

        var _ = this;

        /**
         * Creates a closure around the listener 'func' and 'args'.
         * @param  {Function} func A listener.
         * @return {Function}      Closure function.
         */
        function emitOnFunc(func) {
            return function () {
                func.call(_, oldValue, newValue, changer, object);
            };
        }

        if (oldValue === newValue) return;

        object = object && typeof object === 'object' ? object : _;

        if (!nochaneevent) {
            _.emit('changed', property, oldValue, newValue, changer, object);
        }

        var bindings = _.__events[property];

        if (!bindings || !bindings.length) {
            return false;
        }

        var length = bindings.length;

        for (var i = 0; i < length; i++) {
            if (!changer || bindings[i].observer !== changer) {
                setTimeout(emitOnFunc(bindings[i].listener), 0);
            }
        }

        return true;
    }
});

module.exports = Bindable;

},{"generate-js-events":15}],15:[function(require,module,exports){
/**
 * @name events.js
 * @author Michaelangelo Jong
 */

// Dependences:
var Generator = require('generate-js');

// Generator
var EventEmitter = Generator.generate(
    /**
     * Create method.
     */
    function EventEmitter() {

        this.defineProperties(
            {
                configurable: false,
                enumerable: false,
                writable: false
            },
            {
                __events: Object.create(null)
            }
        );
    }
);

// Prototype
EventEmitter.definePrototype(
    {
        configurable: false,
        enumerable: false,
        writable: false
    },
    {
        /**
         * Adds a 'listener' on 'event' to this EventEmitter instance.
         * @param  {String} event      Name of event.
         * @param  {Function} listener Event handler function.
         * @param  {Object} observer Object reference for binding.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        on: function on(event, listener, observer) {
            var _ = this,
                listeners = _.__events[event];

            observer = typeof observer === 'object' ? observer : null;

            if (typeof event === 'string' && typeof listener === 'function') {
                if (!(listeners instanceof Array)) {
                    listeners = _.__events[event] = [];
                }

                listeners.push({
                    listener: listener,
                    observer: observer
                });
            }

            return _;
        },

        /**
         * Adds a 'listener' on 'event' to this EventEmitter instance which is removed after one 'event'.
         * @param  {String} event      Name of event.
         * @param  {Function} listener Event handler function.
         * @param  {Object} observer Object reference for binding.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        once: function once(event, listener, observer) {
            var _ = this;
            var onceListener = function onceListener() {
                _.off(event, onceListener);
                listener.apply(_, arguments);
            };

            _.on(event, onceListener, observer);

            return _;
        },

        /**
         * Removes a 'listener' on 'event', or all listeners on 'event', or all listeners from this EventEmitter instance.
         * @param  {String} event      Name of event.
         * @param  {Function} listener Event handler function.
         * @param  {Object} observer Object reference for binding.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        off: function off() {
            var _ = this,
                listeners,
                i,
                key,

                event = (typeof arguments[0] === 'string') ?
                    arguments[0] :
                    false,

                listener = (typeof arguments[0] === 'function') ?
                    arguments[0] :
                    (typeof arguments[1] === 'function') ?
                        arguments[1] :
                        false,

                observer = (typeof arguments[0] === 'object') ?
                    arguments[0] :
                    (typeof arguments[1] === 'object') ?
                        arguments[1] :
                        (typeof arguments[2] === 'object') ?
                            arguments[2] :
                            false;

            if (typeof event === 'string') {
                listeners = _.__events[event];

                if (!(listeners instanceof Array)) {
                    return _;
                }

                if (typeof listener === 'function' && typeof observer === 'object') {
                    for (i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i].listener === listener && listeners[i].observer === observer) {
                            listeners.splice(i, 1);
                        }
                    }
                } else if (typeof listener === 'function' || typeof observer === 'object') {
                    for (i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i].listener === listener || listeners[i].observer === observer) {
                            listeners.splice(i, 1);
                        }
                    }
                } else {
                    delete _.__events[event];
                }
            } else if (typeof listener === 'function' || typeof observer === 'object') {
                for (key in _.__events) {
                    listeners = _.__events[key];
                    for (i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i].listener === listener || listeners[i].observer === observer) {
                            listeners.splice(i, 1);
                        }
                    }
                }
            } else {
                for (key in _.__events) {
                    delete _.__events[key];
                }
            }

            return _;
        },

        /**
         * Emits an 'event' with 'args' on this EventEmitter instance.
         * @param  {String} event      Name of event.
         * @param  {Arguments} args    Event handler function.
         * @return {EventEmitter}      This EventEmitter instance.
         */
        emit: function emit(event) {
            var _ = this,
                args = Array.prototype.slice.call(arguments, 1),
                i,
                length,
                listener,
                listeners;

            /**
             * Creates a closure around the listener 'func' and 'args'.
             * @param  {Function} func A listener.
             * @return {Function}      Closure function.
             */
            function emitOnFunc(func) {
                return function () {
                    func.apply(_, args);
                };
            }

            listeners = _.__events[event];
            window.listeners = listeners;

            if (event === 'error' && !listeners && typeof _.onerror !== 'function') {
                if (args[0] instanceof Error){
                    throw args[0];
                } else {
                    throw args;
                }
            }

            if (typeof _['on' + event] === 'function') {
                setTimeout(emitOnFunc(_['on' + event]), 0);
            }

            if (listeners instanceof Array) {
                length = listeners.length;

                for (i = 0; i < length; i++) {
                    listener = listeners[i].listener;
                    setTimeout(emitOnFunc(listener), 0);
                }
            }
            return _;
        },

        /**
         * Emits an event object containing 'eventObject' on this EventEmitter instance.
         * @param  {String} event Name of event.
         * @param  {Object} eventObject  Event object sent to all on handlers.
         * @return {EventEmitter} This EventEmitter instance.
         */
        emitEvent: function emitEvent(event, eventObject) {
            var _ = this,
                timestamp = Date.now();

            eventObject = typeof eventObject === 'object' ? eventObject : { data: eventObject };

            eventObject.type = event;
            eventObject.timestamp = eventObject.timeStamp || eventObject.timestamp || timestamp;

            _.emit(event, eventObject);
            return _;
        }
    }
);

// Exports
module.exports = EventEmitter;

},{"generate-js":16}],16:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}]},{},[1]);
