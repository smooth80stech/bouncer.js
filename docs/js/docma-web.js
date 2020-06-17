/*! dustjs-linkedin - v2.7.5
 * http://dustjs.com/
 * Copyright (c) 2016 Aleksander Williams; Released under the MIT License */
!(function (a, b) {
  "function" == typeof define && define.amd && define.amd.dust === !0
    ? define("dust.core", [], b)
    : "object" == typeof exports
    ? (module.exports = b())
    : (a.dust = b());
})(this, function () {
  function getTemplate(a, b) {
    return a
      ? "function" == typeof a && a.template
        ? a.template
        : dust.isTemplateFn(a)
        ? a
        : b !== !1
        ? dust.cache[a]
        : void 0
      : void 0;
  }
  function load(a, b, c) {
    if (!a)
      return b.setError(
        new Error("No template or template name provided to render"),
      );
    var d = getTemplate(a, dust.config.cache);
    return d
      ? d(b, Context.wrap(c, d.templateName))
      : dust.onLoad
      ? b.map(function (b) {
          function d(a, d) {
            var f;
            if (a) return b.setError(a);
            if (
              ((f = getTemplate(d, !1) || getTemplate(e, dust.config.cache)),
              !f)
            ) {
              if (!dust.compile)
                return b.setError(new Error("Dust compiler not available"));
              f = dust.loadSource(dust.compile(d, e));
            }
            f(b, Context.wrap(c, f.templateName)).end();
          }
          var e = a;
          3 === dust.onLoad.length
            ? dust.onLoad(e, c.options, d)
            : dust.onLoad(e, d);
        })
      : b.setError(new Error("Template Not Found: " + a));
  }
  function Context(a, b, c, d, e) {
    void 0 === a || a instanceof Stack || (a = new Stack(a)),
      (this.stack = a),
      (this.global = b),
      (this.options = c),
      (this.blocks = d),
      (this.templateName = e),
      (this._isContext = !0);
  }
  function getWithResolvedData(a, b, c) {
    return function (d) {
      return a.push(d)._get(b, c);
    };
  }
  function Stack(a, b, c, d) {
    (this.tail = b),
      (this.isObject = a && "object" == typeof a),
      (this.head = a),
      (this.index = c),
      (this.of = d);
  }
  function Stub(a) {
    (this.head = new Chunk(this)), (this.callback = a), (this.out = "");
  }
  function Stream() {
    this.head = new Chunk(this);
  }
  function Chunk(a, b, c) {
    (this.root = a),
      (this.next = b),
      (this.data = []),
      (this.flushable = !1),
      (this.taps = c);
  }
  function Tap(a, b) {
    (this.head = a), (this.tail = b);
  }
  var dust = { version: "2.7.5" },
    NONE = "NONE",
    ERROR = "ERROR",
    WARN = "WARN",
    INFO = "INFO",
    DEBUG = "DEBUG",
    EMPTY_FUNC = function () {};
  (dust.config = { whitespace: !1, amd: !1, cjs: !1, cache: !0 }),
    (dust._aliases = {
      write: "w",
      end: "e",
      map: "m",
      render: "r",
      reference: "f",
      section: "s",
      exists: "x",
      notexists: "nx",
      block: "b",
      partial: "p",
      helper: "h",
    }),
    (function () {
      var a,
        b,
        c = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 };
      "undefined" != typeof console && console.log
        ? ((a = console.log),
          (b =
            "function" == typeof a
              ? function () {
                  a.apply(console, arguments);
                }
              : function () {
                  a(Array.prototype.slice.apply(arguments).join(" "));
                }))
        : (b = EMPTY_FUNC),
        (dust.log = function (a, d) {
          (d = d || INFO),
            c[d] >= c[dust.debugLevel] && b("[DUST:" + d + "]", a);
        }),
        (dust.debugLevel = NONE),
        "undefined" != typeof process &&
          process.env &&
          /\bdust\b/.test(process.env.DEBUG) &&
          (dust.debugLevel = DEBUG);
    })(),
    (dust.helpers = {}),
    (dust.cache = {}),
    (dust.register = function (a, b) {
      a &&
        ((b.templateName = a), dust.config.cache !== !1 && (dust.cache[a] = b));
    }),
    (dust.render = function (a, b, c) {
      var d = new Stub(c).head;
      try {
        load(a, d, b).end();
      } catch (e) {
        d.setError(e);
      }
    }),
    (dust.stream = function (a, b) {
      var c = new Stream(),
        d = c.head;
      return (
        dust.nextTick(function () {
          try {
            load(a, d, b).end();
          } catch (c) {
            d.setError(c);
          }
        }),
        c
      );
    }),
    (dust.loadSource = function (source) {
      return eval(source);
    }),
    (dust.isArray = Array.isArray
      ? Array.isArray
      : function (a) {
          return "[object Array]" === Object.prototype.toString.call(a);
        }),
    (dust.nextTick = (function () {
      return function (a) {
        setTimeout(a, 0);
      };
    })()),
    (dust.isEmpty = function (a) {
      return 0 === a ? !1 : dust.isArray(a) && !a.length ? !0 : !a;
    }),
    (dust.isEmptyObject = function (a) {
      var b;
      if (null === a) return !1;
      if (void 0 === a) return !1;
      if (a.length > 0) return !1;
      for (b in a) if (Object.prototype.hasOwnProperty.call(a, b)) return !1;
      return !0;
    }),
    (dust.isTemplateFn = function (a) {
      return "function" == typeof a && a.__dustBody;
    }),
    (dust.isThenable = function (a) {
      return a && "object" == typeof a && "function" == typeof a.then;
    }),
    (dust.isStreamable = function (a) {
      return a && "function" == typeof a.on && "function" == typeof a.pipe;
    }),
    (dust.filter = function (a, b, c, d) {
      var e, f, g, h;
      if (c)
        for (e = 0, f = c.length; f > e; e++)
          (g = c[e]),
            g.length &&
              ((h = dust.filters[g]),
              "s" === g
                ? (b = null)
                : "function" == typeof h
                ? (a = h(a, d))
                : dust.log("Invalid filter `" + g + "`", WARN));
      return b && (a = dust.filters[b](a, d)), a;
    }),
    (dust.filters = {
      h: function (a) {
        return dust.escapeHtml(a);
      },
      j: function (a) {
        return dust.escapeJs(a);
      },
      u: encodeURI,
      uc: encodeURIComponent,
      js: function (a) {
        return dust.escapeJSON(a);
      },
      jp: function (a) {
        return JSON
          ? JSON.parse(a)
          : (dust.log("JSON is undefined; could not parse `" + a + "`", WARN),
            a);
      },
    }),
    (dust.makeBase = dust.context = function (a, b) {
      return new Context(void 0, a, b);
    }),
    (dust.isContext = function (a) {
      return "object" == typeof a && a._isContext === !0;
    }),
    (Context.wrap = function (a, b) {
      return dust.isContext(a) ? a : new Context(a, {}, {}, null, b);
    }),
    (Context.prototype.get = function (a, b) {
      return (
        "string" == typeof a &&
          ("." === a[0] && ((b = !0), (a = a.substr(1))), (a = a.split("."))),
        this._get(b, a)
      );
    }),
    (Context.prototype._get = function (a, b) {
      var c,
        d,
        e,
        f,
        g,
        h = this.stack || {},
        i = 1;
      if (((d = b[0]), (e = b.length), a && 0 === e)) (f = h), (h = h.head);
      else {
        if (a) h && (h = h.head ? h.head[d] : void 0);
        else {
          for (
            ;
            h && (!h.isObject || ((f = h.head), (c = h.head[d]), void 0 === c));

          )
            h = h.tail;
          h = void 0 !== c ? c : this.global && this.global[d];
        }
        for (; h && e > i; ) {
          if (dust.isThenable(h))
            return h.then(getWithResolvedData(this, a, b.slice(i)));
          (f = h), (h = h[b[i]]), i++;
        }
      }
      return "function" == typeof h
        ? ((g = function () {
            try {
              return h.apply(f, arguments);
            } catch (a) {
              throw (dust.log(a, ERROR), a);
            }
          }),
          (g.__dustBody = !!h.__dustBody),
          g)
        : (void 0 === h &&
            dust.log(
              "Cannot find reference `{" +
                b.join(".") +
                "}` in template `" +
                this.getTemplateName() +
                "`",
              INFO,
            ),
          h);
    }),
    (Context.prototype.getPath = function (a, b) {
      return this._get(a, b);
    }),
    (Context.prototype.push = function (a, b, c) {
      return void 0 === a
        ? (dust.log("Not pushing an undefined variable onto the context", INFO),
          this)
        : this.rebase(new Stack(a, this.stack, b, c));
    }),
    (Context.prototype.pop = function () {
      var a = this.current();
      return (this.stack = this.stack && this.stack.tail), a;
    }),
    (Context.prototype.rebase = function (a) {
      return new Context(
        a,
        this.global,
        this.options,
        this.blocks,
        this.getTemplateName(),
      );
    }),
    (Context.prototype.clone = function () {
      var a = this.rebase();
      return (a.stack = this.stack), a;
    }),
    (Context.prototype.current = function () {
      return this.stack && this.stack.head;
    }),
    (Context.prototype.getBlock = function (a) {
      var b, c, d;
      if (
        ("function" == typeof a && (a = a(new Chunk(), this).data.join("")),
        (b = this.blocks),
        !b)
      )
        return (
          dust.log(
            "No blocks for context `" +
              a +
              "` in template `" +
              this.getTemplateName() +
              "`",
            DEBUG,
          ),
          !1
        );
      for (c = b.length; c--; ) if ((d = b[c][a])) return d;
      return (
        dust.log(
          "Malformed template `" +
            this.getTemplateName() +
            "` was missing one or more blocks.",
        ),
        !1
      );
    }),
    (Context.prototype.shiftBlocks = function (a) {
      var b,
        c = this.blocks;
      return a
        ? ((b = c ? c.concat([a]) : [a]),
          new Context(
            this.stack,
            this.global,
            this.options,
            b,
            this.getTemplateName(),
          ))
        : this;
    }),
    (Context.prototype.resolve = function (a) {
      var b;
      return "function" != typeof a
        ? a
        : ((b = new Chunk().render(a, this)),
          b instanceof Chunk ? b.data.join("") : b);
    }),
    (Context.prototype.getTemplateName = function () {
      return this.templateName;
    }),
    (Stub.prototype.flush = function () {
      for (var a = this.head; a; ) {
        if (!a.flushable)
          return a.error
            ? (this.callback(a.error),
              dust.log("Rendering failed with error `" + a.error + "`", ERROR),
              void (this.flush = EMPTY_FUNC))
            : void 0;
        (this.out += a.data.join("")), (a = a.next), (this.head = a);
      }
      this.callback(null, this.out);
    }),
    (Stream.prototype.flush = function () {
      for (var a = this.head; a; ) {
        if (!a.flushable)
          return a.error
            ? (this.emit("error", a.error),
              this.emit("end"),
              dust.log("Streaming failed with error `" + a.error + "`", ERROR),
              void (this.flush = EMPTY_FUNC))
            : void 0;
        this.emit("data", a.data.join("")), (a = a.next), (this.head = a);
      }
      this.emit("end");
    }),
    (Stream.prototype.emit = function (a, b) {
      var c,
        d,
        e = this.events || {},
        f = e[a] || [];
      if (!f.length)
        return (
          dust.log(
            "Stream broadcasting, but no listeners for `" + a + "`",
            DEBUG,
          ),
          !1
        );
      for (f = f.slice(0), c = 0, d = f.length; d > c; c++) f[c](b);
      return !0;
    }),
    (Stream.prototype.on = function (a, b) {
      var c = (this.events = this.events || {}),
        d = (c[a] = c[a] || []);
      return (
        "function" != typeof b
          ? dust.log(
              "No callback function provided for `" + a + "` event listener",
              WARN,
            )
          : d.push(b),
        this
      );
    }),
    (Stream.prototype.pipe = function (a) {
      if ("function" != typeof a.write || "function" != typeof a.end)
        return dust.log("Incompatible stream passed to `pipe`", WARN), this;
      var b = !1;
      return (
        "function" == typeof a.emit && a.emit("pipe", this),
        "function" == typeof a.on &&
          a.on("error", function () {
            b = !0;
          }),
        this.on("data", function (c) {
          if (!b)
            try {
              a.write(c, "utf8");
            } catch (d) {
              dust.log(d, ERROR);
            }
        }).on("end", function () {
          if (!b)
            try {
              a.end(), (b = !0);
            } catch (c) {
              dust.log(c, ERROR);
            }
        })
      );
    }),
    (Chunk.prototype.write = function (a) {
      var b = this.taps;
      return b && (a = b.go(a)), this.data.push(a), this;
    }),
    (Chunk.prototype.end = function (a) {
      return a && this.write(a), (this.flushable = !0), this.root.flush(), this;
    }),
    (Chunk.prototype.map = function (a) {
      var b = new Chunk(this.root, this.next, this.taps),
        c = new Chunk(this.root, b, this.taps);
      (this.next = c), (this.flushable = !0);
      try {
        a(c);
      } catch (d) {
        dust.log(d, ERROR), c.setError(d);
      }
      return b;
    }),
    (Chunk.prototype.tap = function (a) {
      var b = this.taps;
      return (this.taps = b ? b.push(a) : new Tap(a)), this;
    }),
    (Chunk.prototype.untap = function () {
      return (this.taps = this.taps.tail), this;
    }),
    (Chunk.prototype.render = function (a, b) {
      return a(this, b);
    }),
    (Chunk.prototype.reference = function (a, b, c, d) {
      return "function" == typeof a
        ? ((a = a.apply(b.current(), [this, b, null, { auto: c, filters: d }])),
          a instanceof Chunk ? a : this.reference(a, b, c, d))
        : dust.isThenable(a)
        ? this.await(a, b, null, c, d)
        : dust.isStreamable(a)
        ? this.stream(a, b, null, c, d)
        : dust.isEmpty(a)
        ? this
        : this.write(dust.filter(a, c, d, b));
    }),
    (Chunk.prototype.section = function (a, b, c, d) {
      var e,
        f,
        g,
        h = c.block,
        i = c["else"],
        j = this;
      if ("function" == typeof a && !dust.isTemplateFn(a)) {
        try {
          a = a.apply(b.current(), [this, b, c, d]);
        } catch (k) {
          return dust.log(k, ERROR), this.setError(k);
        }
        if (a instanceof Chunk) return a;
      }
      if (dust.isEmptyObject(c)) return j;
      if ((dust.isEmptyObject(d) || (b = b.push(d)), dust.isArray(a))) {
        if (h) {
          if (((f = a.length), f > 0)) {
            for (
              g = (b.stack && b.stack.head) || {}, g.$len = f, e = 0;
              f > e;
              e++
            )
              (g.$idx = e), (j = h(j, b.push(a[e], e, f)));
            return (g.$idx = void 0), (g.$len = void 0), j;
          }
          if (i) return i(this, b);
        }
      } else {
        if (dust.isThenable(a)) return this.await(a, b, c);
        if (dust.isStreamable(a)) return this.stream(a, b, c);
        if (a === !0) {
          if (h) return h(this, b);
        } else if (a || 0 === a) {
          if (h) return h(this, b.push(a));
        } else if (i) return i(this, b);
      }
      return (
        dust.log(
          "Section without corresponding key in template `" +
            b.getTemplateName() +
            "`",
          DEBUG,
        ),
        this
      );
    }),
    (Chunk.prototype.exists = function (a, b, c) {
      var d = c.block,
        e = c["else"];
      if (dust.isEmpty(a)) {
        if (e) return e(this, b);
      } else {
        if (d) return d(this, b);
        dust.log(
          "No block for exists check in template `" + b.getTemplateName() + "`",
          DEBUG,
        );
      }
      return this;
    }),
    (Chunk.prototype.notexists = function (a, b, c) {
      var d = c.block,
        e = c["else"];
      if (dust.isEmpty(a)) {
        if (d) return d(this, b);
        dust.log(
          "No block for not-exists check in template `" +
            b.getTemplateName() +
            "`",
          DEBUG,
        );
      } else if (e) return e(this, b);
      return this;
    }),
    (Chunk.prototype.block = function (a, b, c) {
      var d = a || c.block;
      return d ? d(this, b) : this;
    }),
    (Chunk.prototype.partial = function (a, b, c, d) {
      var e;
      return (
        void 0 === d && ((d = c), (c = b)),
        dust.isEmptyObject(d) ||
          ((c = c.clone()), (e = c.pop()), (c = c.push(d).push(e))),
        dust.isTemplateFn(a)
          ? this.capture(a, b, function (a, b) {
              (c.templateName = a), load(a, b, c).end();
            })
          : ((c.templateName = a), load(a, this, c))
      );
    }),
    (Chunk.prototype.helper = function (a, b, c, d, e) {
      var f,
        g = this,
        h = d.filters;
      if ((void 0 === e && (e = "h"), !dust.helpers[a]))
        return dust.log("Helper `" + a + "` does not exist", WARN), g;
      try {
        return (
          (f = dust.helpers[a](g, b, c, d)),
          f instanceof Chunk
            ? f
            : ("string" == typeof h && (h = h.split("|")),
              dust.isEmptyObject(c)
                ? g.reference(f, b, e, h)
                : g.section(f, b, c, d))
        );
      } catch (i) {
        return (
          dust.log("Error in helper `" + a + "`: " + i.message, ERROR),
          g.setError(i)
        );
      }
    }),
    (Chunk.prototype.await = function (a, b, c, d, e) {
      return this.map(function (f) {
        a.then(
          function (a) {
            (f = c ? f.section(a, b, c) : f.reference(a, b, d, e)), f.end();
          },
          function (a) {
            var d = c && c.error;
            d
              ? f.render(d, b.push(a)).end()
              : (dust.log(
                  "Unhandled promise rejection in `" +
                    b.getTemplateName() +
                    "`",
                  INFO,
                ),
                f.end());
          },
        );
      });
    }),
    (Chunk.prototype.stream = function (a, b, c, d, e) {
      var f = c && c.block,
        g = c && c.error;
      return this.map(function (h) {
        var i = !1;
        a.on("data", function (a) {
          i ||
            (f
              ? (h = h.map(function (c) {
                  c.render(f, b.push(a)).end();
                }))
              : c || (h = h.reference(a, b, d, e)));
        })
          .on("error", function (a) {
            i ||
              (g
                ? h.render(g, b.push(a))
                : dust.log(
                    "Unhandled stream error in `" + b.getTemplateName() + "`",
                    INFO,
                  ),
              i || ((i = !0), h.end()));
          })
          .on("end", function () {
            i || ((i = !0), h.end());
          });
      });
    }),
    (Chunk.prototype.capture = function (a, b, c) {
      return this.map(function (d) {
        var e = new Stub(function (a, b) {
          a ? d.setError(a) : c(b, d);
        });
        a(e.head, b).end();
      });
    }),
    (Chunk.prototype.setError = function (a) {
      return (this.error = a), this.root.flush(), this;
    });
  for (var f in Chunk.prototype)
    dust._aliases[f] &&
      (Chunk.prototype[dust._aliases[f]] = Chunk.prototype[f]);
  (Tap.prototype.push = function (a) {
    return new Tap(a, this);
  }),
    (Tap.prototype.go = function (a) {
      for (var b = this; b; ) (a = b.head(a)), (b = b.tail);
      return a;
    });
  var HCHARS = /[&<>"']/,
    AMP = /&/g,
    LT = /</g,
    GT = />/g,
    QUOT = /\"/g,
    SQUOT = /\'/g;
  dust.escapeHtml = function (a) {
    return "string" == typeof a || (a && "function" == typeof a.toString)
      ? ("string" != typeof a && (a = a.toString()),
        HCHARS.test(a)
          ? a
              .replace(AMP, "&amp;")
              .replace(LT, "&lt;")
              .replace(GT, "&gt;")
              .replace(QUOT, "&quot;")
              .replace(SQUOT, "&#39;")
          : a)
      : a;
  };
  var BS = /\\/g,
    FS = /\//g,
    CR = /\r/g,
    LS = /\u2028/g,
    PS = /\u2029/g,
    NL = /\n/g,
    LF = /\f/g,
    SQ = /'/g,
    DQ = /"/g,
    TB = /\t/g;
  return (
    (dust.escapeJs = function (a) {
      return "string" == typeof a
        ? a
            .replace(BS, "\\\\")
            .replace(FS, "\\/")
            .replace(DQ, '\\"')
            .replace(SQ, "\\'")
            .replace(CR, "\\r")
            .replace(LS, "\\u2028")
            .replace(PS, "\\u2029")
            .replace(NL, "\\n")
            .replace(LF, "\\f")
            .replace(TB, "\\t")
        : a;
    }),
    (dust.escapeJSON = function (a) {
      return JSON
        ? JSON.stringify(a)
            .replace(LS, "\\u2028")
            .replace(PS, "\\u2029")
            .replace(LT, "\\u003c")
        : (dust.log("JSON is undefined; could not escape `" + a + "`", WARN),
          a);
    }),
    dust
  );
}),
  "function" == typeof define &&
    define.amd &&
    define.amd.dust === !0 &&
    define(["require", "dust.core"], function (require, dust) {
      return (
        (dust.onLoad = function (a, b) {
          require([a], function () {
            b();
          });
        }),
        dust
      );
    });
/*! dustjs-helpers - v1.7.4
 * http://dustjs.com/
 * Copyright (c) 2017 Aleksander Williams; Released under the MIT License */
!(function (a, b) {
  "function" == typeof define && define.amd && define.amd.dust === !0
    ? define(["dust.core"], b)
    : "object" == typeof exports
    ? ((module.exports = b(require("dustjs-linkedin"))),
      (module.exports.registerWith = b))
    : b(a.dust);
})(this, function (dust) {
  function a(a, b, c) {
    (c = c || "INFO"), (a = a ? "{@" + a + "}: " : ""), dust.log(a + b, c);
  }
  function b(b) {
    k[b] ||
      (a(
        b,
        "Deprecation warning: " +
          b +
          " is deprecated and will be removed in a future version of dustjs-helpers",
        "WARN",
      ),
      a(
        null,
        "For help and a deprecation timeline, see https://github.com/linkedin/dustjs-helpers/wiki/Deprecated-Features#" +
          b.replace(/\W+/g, ""),
        "WARN",
      ),
      (k[b] = !0));
  }
  function c(a) {
    return (
      a.stack.tail &&
      a.stack.tail.head &&
      "undefined" != typeof a.stack.tail.head.__select__
    );
  }
  function d(a) {
    return c(a) && a.get("__select__");
  }
  function e(a, b) {
    var c,
      d = a.stack.head,
      e = a.rebase();
    a.stack && a.stack.tail && (e.stack = a.stack.tail);
    var f = {
      isPending: !1,
      isResolved: !1,
      isDeferredComplete: !1,
      deferreds: [],
    };
    for (c in b) f[c] = b[c];
    return e.push({ __select__: f }).push(d, a.stack.index, a.stack.of);
  }
  function f(a) {
    var b, c;
    if (((a.isDeferredPending = !0), a.deferreds.length))
      for (a.isDeferredComplete = !0, b = 0, c = a.deferreds.length; c > b; b++)
        a.deferreds[b]();
    a.isDeferredPending = !1;
  }
  function g(a, b) {
    return "function" == typeof b
      ? b
          .toString()
          .replace(/(^\s+|\s+$)/gm, "")
          .replace(/\n/gm, "")
          .replace(/,\s*/gm, ", ")
          .replace(/\)\{/gm, ") {")
      : b;
  }
  function h(a, b) {
    return function (c, d, e, f) {
      return i(c, d, e, f, a, b);
    };
  }
  function i(b, c, e, f, g, h) {
    var i,
      k,
      l,
      m,
      n = e.block,
      o = e["else"],
      p = d(c) || {};
    if (p.isResolved && !p.isDeferredPending) return b;
    if (f.hasOwnProperty("key")) k = f.key;
    else {
      if (!p.hasOwnProperty("key")) return a(g, "No key specified", "WARN"), b;
      k = p.key;
    }
    return (
      (m = f.type || p.type),
      (k = j(c.resolve(k), m)),
      (l = j(c.resolve(f.value), m)),
      h(k, l)
        ? (p.isPending || ((i = !0), (p.isPending = !0)),
          n && (b = b.render(n, c)),
          i && (p.isResolved = !0))
        : o && (b = b.render(o, c)),
      b
    );
  }
  function j(a, b) {
    switch ((b && (b = b.toLowerCase()), b)) {
      case "number":
        return +a;
      case "string":
        return String(a);
      case "boolean":
        return (a = "false" === a ? !1 : a), Boolean(a);
      case "date":
        return new Date(a);
    }
    return a;
  }
  var k = {},
    l = {
      tap: function (a, c, d) {
        return b("tap"), d.resolve(a);
      },
      sep: function (a, b, c) {
        var d = c.block;
        return b.stack.index === b.stack.of - 1 ? a : d ? d(a, b) : a;
      },
      first: function (a, b, c) {
        return 0 === b.stack.index ? c.block(a, b) : a;
      },
      last: function (a, b, c) {
        return b.stack.index === b.stack.of - 1 ? c.block(a, b) : a;
      },
      contextDump: function (b, c, d, e) {
        var f,
          h,
          i = c.resolve(e.to),
          j = c.resolve(e.key);
        switch (j) {
          case "full":
            f = c.stack;
            break;
          default:
            f = c.stack.head;
        }
        switch (((h = JSON.stringify(f, g, 2)), i)) {
          case "console":
            a("contextDump", h);
            break;
          default:
            (h = h.replace(/</g, "\\u003c")), (b = b.write(h));
        }
        return b;
      },
      math: function (b, c, g, h) {
        var i,
          j = h.key,
          k = h.method,
          l = h.operand,
          m = h.round;
        if (!h.hasOwnProperty("key") || !h.method)
          return a("math", "`key` or `method` was not provided", "ERROR"), b;
        switch (
          ((j = parseFloat(c.resolve(j))), (l = parseFloat(c.resolve(l))), k)
        ) {
          case "mod":
            0 === l && a("math", "Division by 0", "ERROR"), (i = j % l);
            break;
          case "add":
            i = j + l;
            break;
          case "subtract":
            i = j - l;
            break;
          case "multiply":
            i = j * l;
            break;
          case "divide":
            0 === l && a("math", "Division by 0", "ERROR"), (i = j / l);
            break;
          case "ceil":
          case "floor":
          case "round":
          case "abs":
            i = Math[k](j);
            break;
          case "toint":
            i = parseInt(j, 10);
            break;
          default:
            a("math", "Method `" + k + "` is not supported", "ERROR");
        }
        return (
          "undefined" != typeof i &&
            (m && (i = Math.round(i)),
            g && g.block
              ? ((c = e(c, { key: i })), (b = b.render(g.block, c)), f(d(c)))
              : (b = b.write(i))),
          b
        );
      },
      select: function (b, c, g, h) {
        var i = g.block,
          j = {};
        return (
          h.hasOwnProperty("key") && (j.key = c.resolve(h.key)),
          h.hasOwnProperty("type") && (j.type = h.type),
          i
            ? ((c = e(c, j)), (b = b.render(i, c)), f(d(c)))
            : a("select", "Missing body block", "WARN"),
          b
        );
      },
      eq: h("eq", function (a, b) {
        return a === b;
      }),
      ne: h("ne", function (a, b) {
        return a !== b;
      }),
      lt: h("lt", function (a, b) {
        return b > a;
      }),
      lte: h("lte", function (a, b) {
        return b >= a;
      }),
      gt: h("gt", function (a, b) {
        return a > b;
      }),
      gte: h("gte", function (a, b) {
        return a >= b;
      }),
      any: function (b, c, e) {
        var f = d(c);
        return (
          f
            ? f.isDeferredComplete
              ? a(
                  "any",
                  "Must not be nested inside {@any} or {@none} block",
                  "ERROR",
                )
              : (b = b.map(function (a) {
                  f.deferreds.push(function () {
                    f.isResolved && (a = a.render(e.block, c)), a.end();
                  });
                }))
            : a("any", "Must be used inside a {@select} block", "ERROR"),
          b
        );
      },
      none: function (b, c, e) {
        var f = d(c);
        return (
          f
            ? f.isDeferredComplete
              ? a(
                  "none",
                  "Must not be nested inside {@any} or {@none} block",
                  "ERROR",
                )
              : (b = b.map(function (a) {
                  f.deferreds.push(function () {
                    f.isResolved || (a = a.render(e.block, c)), a.end();
                  });
                }))
            : a("none", "Must be used inside a {@select} block", "ERROR"),
          b
        );
      },
      size: function (a, b, c, d) {
        var e,
          f,
          g = d.key;
        if (((g = b.resolve(d.key)), g && g !== !0))
          if (dust.isArray(g)) e = g.length;
          else if (!isNaN(parseFloat(g)) && isFinite(g)) e = g;
          else if ("object" == typeof g) {
            e = 0;
            for (f in g) g.hasOwnProperty(f) && e++;
          } else e = (g + "").length;
        else e = 0;
        return a.write(e);
      },
    };
  for (var m in l) dust.helpers[m] = l[m];
  return dust;
});
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : (t.page = e());
})(this, function () {
  "use strict";
  function t(t) {
    return r(a(t));
  }
  var p =
      Array.isArray ||
      function (t) {
        return "[object Array]" == Object.prototype.toString.call(t);
      },
    o = c,
    e = a,
    n = r,
    i = h,
    y = new RegExp(
      [
        "(\\\\.)",
        "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))",
      ].join("|"),
      "g",
    );
  function a(t) {
    for (var e, n = [], i = 0, o = 0, r = ""; null != (e = y.exec(t)); ) {
      var a,
        s,
        h,
        c,
        p,
        u,
        d,
        l,
        f,
        g,
        m = e[0],
        w = e[1],
        v = e.index;
      (r += t.slice(o, v)),
        (o = v + m.length),
        w
          ? (r += w[1])
          : (r && (n.push(r), (r = "")),
            (a = e[2]),
            (s = e[3]),
            (h = e[4]),
            (c = e[5]),
            (p = e[6]),
            (u = e[7]),
            (d = "+" === p || "*" === p),
            (l = "?" === p || "*" === p),
            (f = a || "/"),
            (g = h || c || (u ? ".*" : "[^" + f + "]+?")),
            n.push({
              name: s || i++,
              prefix: a || "",
              delimiter: f,
              optional: l,
              repeat: d,
              pattern: g.replace(/([=!:$\/()])/g, "\\$1"),
            }));
    }
    return o < t.length && (r += t.substr(o)), r && n.push(r), n;
  }
  function r(h) {
    for (var c = new Array(h.length), t = 0; t < h.length; t++)
      "object" == typeof h[t] && (c[t] = new RegExp("^" + h[t].pattern + "$"));
    return function (t) {
      for (var e = "", n = t || {}, i = 0; i < h.length; i++) {
        var o = h[i];
        if ("string" != typeof o) {
          var r,
            a = n[o.name];
          if (null == a) {
            if (o.optional) continue;
            throw new TypeError('Expected "' + o.name + '" to be defined');
          }
          if (p(a)) {
            if (!o.repeat)
              throw new TypeError(
                'Expected "' +
                  o.name +
                  '" to not repeat, but received "' +
                  a +
                  '"',
              );
            if (0 === a.length) {
              if (o.optional) continue;
              throw new TypeError('Expected "' + o.name + '" to not be empty');
            }
            for (var s = 0; s < a.length; s++) {
              if (((r = encodeURIComponent(a[s])), !c[i].test(r)))
                throw new TypeError(
                  'Expected all "' +
                    o.name +
                    '" to match "' +
                    o.pattern +
                    '", but received "' +
                    r +
                    '"',
                );
              e += (0 === s ? o.prefix : o.delimiter) + r;
            }
          } else {
            if (((r = encodeURIComponent(a)), !c[i].test(r)))
              throw new TypeError(
                'Expected "' +
                  o.name +
                  '" to match "' +
                  o.pattern +
                  '", but received "' +
                  r +
                  '"',
              );
            e += o.prefix + r;
          }
        } else e += o;
      }
      return e;
    };
  }
  function u(t) {
    return t.replace(/([.+*?=^!:${}()[\]|\/])/g, "\\$1");
  }
  function s(t, e) {
    return (t.keys = e), t;
  }
  function d(t) {
    return t.sensitive ? "" : "i";
  }
  function h(t, e) {
    for (
      var n = (e = e || {}).strict,
        i = !1 !== e.end,
        o = "",
        r = t[t.length - 1],
        a = "string" == typeof r && /\/$/.test(r),
        s = 0;
      s < t.length;
      s++
    ) {
      var h,
        c,
        p = t[s];
      "string" == typeof p
        ? (o += u(p))
        : ((h = u(p.prefix)),
          (c = p.pattern),
          p.repeat && (c += "(?:" + h + c + ")*"),
          (o += c = p.optional
            ? h
              ? "(?:" + h + "(" + c + "))?"
              : "(" + c + ")?"
            : h + "(" + c + ")"));
    }
    return (
      n || (o = (a ? o.slice(0, -2) : o) + "(?:\\/(?=$))?"),
      (o += i ? "$" : n && a ? "" : "(?=\\/|$)"),
      new RegExp("^" + o, d(e))
    );
  }
  function c(t, e, n) {
    return (
      p((e = e || [])) ? (n = n || {}) : ((n = e), (e = [])),
      t instanceof RegExp
        ? (function (t, e) {
            var n = t.source.match(/\((?!\?)/g);
            if (n)
              for (var i = 0; i < n.length; i++)
                e.push({
                  name: i,
                  prefix: null,
                  delimiter: null,
                  optional: !1,
                  repeat: !1,
                  pattern: null,
                });
            return s(t, e);
          })(t, e)
        : (p(t)
            ? function (t, e, n) {
                for (var i = [], o = 0; o < t.length; o++)
                  i.push(c(t[o], e, n).source);
                return s(new RegExp("(?:" + i.join("|") + ")", d(n)), e);
              }
            : function (t, e, n) {
                for (var i = a(t), o = h(i, n), r = 0; r < i.length; r++)
                  "string" != typeof i[r] && e.push(i[r]);
                return s(o, e);
              })(t, e, n)
    );
  }
  (o.parse = e),
    (o.compile = t),
    (o.tokensToFunction = n),
    (o.tokensToRegExp = i);
  var l,
    f = "undefined" != typeof document,
    g = "undefined" != typeof window,
    m = "undefined" != typeof history,
    w = "undefined" != typeof process,
    v = f && document.ontouchstart ? "touchstart" : "click",
    _ = g && !(!window.history.location && !window.location);
  function b() {
    (this.callbacks = []),
      (this.exits = []),
      (this.current = ""),
      (this.len = 0),
      (this._decodeURLComponents = !0),
      (this._base = ""),
      (this._strict = !1),
      (this._running = !1),
      (this._hashbang = !1),
      (this.clickHandler = this.clickHandler.bind(this)),
      (this._onpopstate = this._onpopstate.bind(this));
  }
  function x(t, e) {
    if ("function" == typeof t) return x.call(this, "*", t);
    if ("function" == typeof e)
      for (var n = new R(t, null, this), i = 1; i < arguments.length; ++i)
        this.callbacks.push(n.middleware(arguments[i]));
    else
      "string" == typeof t
        ? this["string" == typeof e ? "redirect" : "show"](t, e)
        : this.start(t);
  }
  function E(t2, e, n) {
    var i = (this.page = n || x),
      t = t2.replace(
        document.baseURI
          .split("/")
          .filter((o) => o.length)
          .pop() + "/",
        "",
      ),
      o = i._window,
      r = i._hashbang,
      a = i._getBase();
    "/" === t[0] && 0 !== t.indexOf(a) && (t = a + (r ? "#!" : "") + t);
    var s = t.indexOf("?");
    this.canonicalPath = t2;
    var h = new RegExp("^" + a.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"));
    if (
      ((this.path = t.replace(h, "") || "/"),
      r && (this.path = this.path.replace("#!", "") || "/"),
      (this.title = f && o.document.title),
      (this.state = e || {}),
      (this.state.path = t),
      (this.querystring = ~s
        ? i._decodeURLEncodedURIComponent(t.slice(s + 1))
        : ""),
      (this.pathname = i._decodeURLEncodedURIComponent(~s ? t.slice(0, s) : t)),
      (this.params = {}),
      (this.hash = ""),
      !r)
    ) {
      if (!~this.path.indexOf("#")) return;
      var c = this.path.split("#");
      (this.path = this.pathname = c[0]),
        (this.hash = i._decodeURLEncodedURIComponent(c[1]) || ""),
        (this.querystring = this.querystring.split("#")[0]);
    }
  }
  function R(t, e, n) {
    this.page = n || k;
    var i = e || {};
    (i.strict = i.strict || n._strict),
      (this.path = "*" === t ? "(.*)" : t),
      (this.method = "GET"),
      (this.regexp = o(this.path, (this.keys = []), i));
  }
  (b.prototype.configure = function (t) {
    var e = t || {};
    (this._window = e.window || (g && window)),
      (this._decodeURLComponents = !1 !== e.decodeURLComponents),
      (this._popstate = !1 !== e.popstate && g),
      (this._click = !1 !== e.click && f),
      (this._hashbang = !!e.hashbang);
    var n = this._window;
    this._popstate
      ? n.addEventListener("popstate", this._onpopstate, !1)
      : g && n.removeEventListener("popstate", this._onpopstate, !1),
      this._click
        ? n.document.addEventListener(v, this.clickHandler, !1)
        : f && n.document.removeEventListener(v, this.clickHandler, !1),
      this._hashbang && g && !m
        ? n.addEventListener("hashchange", this._onpopstate, !1)
        : g && n.removeEventListener("hashchange", this._onpopstate, !1);
  }),
    (b.prototype.base = function (t) {
      if (0 === arguments.length) return this._base;
      this._base = t;
    }),
    (b.prototype._getBase = function () {
      var t = this._base;
      if (t) return t;
      var e = g && this._window && this._window.location;
      return (
        g && this._hashbang && e && "file:" === e.protocol && (t = e.pathname),
        t
      );
    }),
    (b.prototype.strict = function (t) {
      if (0 === arguments.length) return this._strict;
      this._strict = t;
    }),
    (b.prototype.start = function (t) {
      var e,
        n,
        i = t || {};
      this.configure(i),
        !1 !== i.dispatch &&
          ((this._running = !0),
          _ &&
            ((e = this._window.location),
            (n =
              this._hashbang && ~e.hash.indexOf("#!")
                ? e.hash.substr(2) + e.search
                : this._hashbang
                ? e.search + e.hash
                : e.pathname + e.search + e.hash)),
          this.replace(n, null, !0, i.dispatch));
    }),
    (b.prototype.stop = function () {
      var t;
      this._running &&
        ((this.current = ""),
        (this.len = 0),
        (this._running = !1),
        (t = this._window),
        this._click && t.document.removeEventListener(v, this.clickHandler, !1),
        g && t.removeEventListener("popstate", this._onpopstate, !1),
        g && t.removeEventListener("hashchange", this._onpopstate, !1));
    }),
    (b.prototype.show = function (t, e, n, i) {
      var o = new E(t, e, this),
        r = this.prevContext;
      return (
        (this.prevContext = o),
        (this.current = o.path),
        !1 !== n && this.dispatch(o, r),
        !1 !== o.handled && !1 !== i && o.pushState(),
        o
      );
    }),
    (b.prototype.back = function (t, e) {
      var n,
        i = this;
      0 < this.len
        ? ((n = this._window), m && n.history.back(), this.len--)
        : t
        ? setTimeout(function () {
            i.show(t, e);
          })
        : setTimeout(function () {
            i.show(i._getBase(), e);
          });
    }),
    (b.prototype.redirect = function (t, e) {
      var n = this;
      "string" == typeof t &&
        "string" == typeof e &&
        x.call(this, t, function (t) {
          setTimeout(function () {
            n.replace(e);
          }, 0);
        }),
        "string" == typeof t &&
          void 0 === e &&
          setTimeout(function () {
            n.replace(t);
          }, 0);
    }),
    (b.prototype.replace = function (t, e, n, i) {
      var o = new E(t, e, this),
        r = this.prevContext;
      return (
        (this.prevContext = o),
        (this.current = o.path),
        (o.init = n),
        o.save(),
        !1 !== i && this.dispatch(o, r),
        o
      );
    }),
    (b.prototype.dispatch = function (e, n) {
      var i = 0,
        o = 0,
        r = this;
      function a() {
        var t = r.callbacks[i++];
        if (e.path === r.current)
          return t
            ? void t(e, a)
            : function (t) {
                if (t.handled) return;
                var e,
                  n = this._window;
                e = this._hashbang
                  ? _ && this._getBase() + n.location.hash.replace("#!", "")
                  : _ && n.location.pathname + n.location.search;
                if (e === t.canonicalPath) return;
                this.stop(),
                  (t.handled = !1),
                  _ && (n.location.href = t.canonicalPath);
              }.call(r, e);
        e.handled = !1;
      }
      (n
        ? function t() {
            var e = r.exits[o++];
            if (!e) return a();
            e(n, t);
          }
        : a)();
    }),
    (b.prototype.exit = function (t, e) {
      if ("function" == typeof t) return this.exit("*", t);
      for (var n = new R(t, null, this), i = 1; i < arguments.length; ++i)
        this.exits.push(n.middleware(arguments[i]));
    }),
    (b.prototype.clickHandler = function (t) {
      if (
        1 === this._which(t) &&
        !(t.metaKey || t.ctrlKey || t.shiftKey || t.defaultPrevented)
      ) {
        var e,
          n,
          i,
          o,
          r,
          a = t.target,
          s = t.path || (t.composedPath ? t.composedPath() : null);
        if (s)
          for (var h = 0; h < s.length; h++)
            if (
              s[h].nodeName &&
              "A" === s[h].nodeName.toUpperCase() &&
              s[h].href
            ) {
              a = s[h];
              break;
            }
        for (; a && "A" !== a.nodeName.toUpperCase(); ) a = a.parentNode;
        a &&
          "A" === a.nodeName.toUpperCase() &&
          ((e =
            "object" == typeof a.href &&
            "SVGAnimatedString" === a.href.constructor.name),
          a.hasAttribute("download") ||
            "external" === a.getAttribute("rel") ||
            ((n = a.getAttribute("href")),
            (!this._hashbang && this._samePath(a) && (a.hash || "#" === n)) ||
              (n && -1 < n.indexOf("mailto:")) ||
              (e ? a.target.baseVal : a.target) ||
              ((e || this.sameOrigin(a.href)) &&
                ((i =
                  "/" !==
                  (i = e
                    ? a.href.baseVal
                    : a.pathname + a.search + (a.hash || ""))[0]
                    ? "/" + i
                    : i),
                w &&
                  i.match(/^\/[a-zA-Z]:\//) &&
                  (i = i.replace(/^\/[a-zA-Z]:\//, "/")),
                (o = i),
                (r = this._getBase()),
                0 === i.indexOf(r) && (i = i.substr(r.length)),
                this._hashbang && (i = i.replace("#!", "")),
                (!r ||
                  o !== i ||
                  (_ && "file:" === this._window.location.protocol)) &&
                  (t.preventDefault(), this.show(o))))));
      }
    }),
    (b.prototype._onpopstate =
      ((l = !1),
      g
        ? (f && "complete" === document.readyState
            ? (l = !0)
            : window.addEventListener("load", function () {
                setTimeout(function () {
                  l = !0;
                }, 0);
              }),
          function (t) {
            var e, n;
            l &&
              (t.state
                ? ((e = t.state.path), this.replace(e, t.state))
                : _ &&
                  ((n = this._window.location),
                  this.show(
                    n.pathname + n.search + n.hash,
                    void 0,
                    void 0,
                    !1,
                  )));
          })
        : function () {})),
    (b.prototype._which = function (t) {
      return null == (t = t || (g && this._window.event)).which
        ? t.button
        : t.which;
    }),
    (b.prototype._toURL = function (t) {
      var e = this._window;
      if ("function" == typeof URL && _)
        return new URL(t, e.location.toString());
      if (f) {
        var n = e.document.createElement("a");
        return (n.href = t), n;
      }
    }),
    (b.prototype.sameOrigin = function (t) {
      if (!t || !_) return !1;
      var e = this._toURL(t),
        n = this._window.location;
      return (
        n.protocol === e.protocol &&
        n.hostname === e.hostname &&
        n.port === e.port
      );
    }),
    (b.prototype._samePath = function (t) {
      if (!_) return !1;
      var e = this._window.location;
      return t.pathname === e.pathname && t.search === e.search;
    }),
    (b.prototype._decodeURLEncodedURIComponent = function (t) {
      return "string" == typeof t && this._decodeURLComponents
        ? decodeURIComponent(t.replace(/\+/g, " "))
        : t;
    }),
    (E.prototype.pushState = function () {
      var t = this.page,
        e = t._window,
        n = t._hashbang;
      t.len++,
        m &&
          e.history.pushState(
            this.state,
            this.title,
            n && "/" !== this.path ? "#!" + this.path : this.canonicalPath,
          );
    }),
    (E.prototype.save = function () {
      var t = this.page;
      m &&
        "file:" !== t._window.location.protocol &&
        t._window.history.replaceState(
          this.state,
          this.title,
          t._hashbang && "/" !== this.path
            ? "#!" + this.path
            : this.canonicalPath,
        );
    }),
    (R.prototype.middleware = function (n) {
      var i = this;
      return function (t, e) {
        if (i.match(t.path, t.params)) return n(t, e);
        e();
      };
    }),
    (R.prototype.match = function (t, e) {
      var n = this.keys,
        i = t.indexOf("?"),
        o = ~i ? t.slice(0, i) : t,
        r = this.regexp.exec(decodeURIComponent(o));
      if (!r) return !1;
      for (var a = 1, s = r.length; a < s; ++a) {
        var h = n[a - 1],
          c = this.page._decodeURLEncodedURIComponent(r[a]);
        (void 0 === c && hasOwnProperty.call(e, h.name)) || (e[h.name] = c);
      }
      return !0;
    });
  var k = (function t() {
      var e = new b();
      function n() {
        return x.apply(e, arguments);
      }
      return (
        (n.callbacks = e.callbacks),
        (n.exits = e.exits),
        (n.base = e.base.bind(e)),
        (n.strict = e.strict.bind(e)),
        (n.start = e.start.bind(e)),
        (n.stop = e.stop.bind(e)),
        (n.show = e.show.bind(e)),
        (n.back = e.back.bind(e)),
        (n.redirect = e.redirect.bind(e)),
        (n.replace = e.replace.bind(e)),
        (n.dispatch = e.dispatch.bind(e)),
        (n.exit = e.exit.bind(e)),
        (n.configure = e.configure.bind(e)),
        (n.sameOrigin = e.sameOrigin.bind(e)),
        (n.clickHandler = e.clickHandler.bind(e)),
        (n.create = t),
        Object.defineProperty(n, "len", {
          get: function () {
            return e.len;
          },
          set: function (t) {
            e.len = t;
          },
        }),
        Object.defineProperty(n, "current", {
          get: function () {
            return e.current;
          },
          set: function (t) {
            e.current = t;
          },
        }),
        (n.Context = E),
        (n.Route = R),
        n
      );
    })(),
    U = k;
  return (U.default = k), U;
});
/*!
 * EventEmitter v5.2.4 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */
!(function (e) {
  "use strict";
  function t() {}
  function n(e, t) {
    for (var n = e.length; n--; ) if (e[n].listener === t) return n;
    return -1;
  }
  function r(e) {
    return function () {
      return this[e].apply(this, arguments);
    };
  }
  function i(e) {
    return (
      "function" == typeof e ||
      e instanceof RegExp ||
      (!(!e || "object" != typeof e) && i(e.listener))
    );
  }
  var s = t.prototype,
    o = e.EventEmitter;
  (s.getListeners = function (e) {
    var t,
      n,
      r = this._getEvents();
    if (e instanceof RegExp) {
      t = {};
      for (n in r) r.hasOwnProperty(n) && e.test(n) && (t[n] = r[n]);
    } else t = r[e] || (r[e] = []);
    return t;
  }),
    (s.flattenListeners = function (e) {
      var t,
        n = [];
      for (t = 0; t < e.length; t += 1) n.push(e[t].listener);
      return n;
    }),
    (s.getListenersAsObject = function (e) {
      var t,
        n = this.getListeners(e);
      return n instanceof Array && ((t = {}), (t[e] = n)), t || n;
    }),
    (s.addListener = function (e, t) {
      if (!i(t)) throw new TypeError("listener must be a function");
      var r,
        s = this.getListenersAsObject(e),
        o = "object" == typeof t;
      for (r in s)
        s.hasOwnProperty(r) &&
          n(s[r], t) === -1 &&
          s[r].push(o ? t : { listener: t, once: !1 });
      return this;
    }),
    (s.on = r("addListener")),
    (s.addOnceListener = function (e, t) {
      return this.addListener(e, { listener: t, once: !0 });
    }),
    (s.once = r("addOnceListener")),
    (s.defineEvent = function (e) {
      return this.getListeners(e), this;
    }),
    (s.defineEvents = function (e) {
      for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
      return this;
    }),
    (s.removeListener = function (e, t) {
      var r,
        i,
        s = this.getListenersAsObject(e);
      for (i in s)
        s.hasOwnProperty(i) &&
          ((r = n(s[i], t)), r !== -1 && s[i].splice(r, 1));
      return this;
    }),
    (s.off = r("removeListener")),
    (s.addListeners = function (e, t) {
      return this.manipulateListeners(!1, e, t);
    }),
    (s.removeListeners = function (e, t) {
      return this.manipulateListeners(!0, e, t);
    }),
    (s.manipulateListeners = function (e, t, n) {
      var r,
        i,
        s = e ? this.removeListener : this.addListener,
        o = e ? this.removeListeners : this.addListeners;
      if ("object" != typeof t || t instanceof RegExp)
        for (r = n.length; r--; ) s.call(this, t, n[r]);
      else
        for (r in t)
          t.hasOwnProperty(r) &&
            (i = t[r]) &&
            ("function" == typeof i ? s.call(this, r, i) : o.call(this, r, i));
      return this;
    }),
    (s.removeEvent = function (e) {
      var t,
        n = typeof e,
        r = this._getEvents();
      if ("string" === n) delete r[e];
      else if (e instanceof RegExp)
        for (t in r) r.hasOwnProperty(t) && e.test(t) && delete r[t];
      else delete this._events;
      return this;
    }),
    (s.removeAllListeners = r("removeEvent")),
    (s.emitEvent = function (e, t) {
      var n,
        r,
        i,
        s,
        o,
        u = this.getListenersAsObject(e);
      for (s in u)
        if (u.hasOwnProperty(s))
          for (n = u[s].slice(0), i = 0; i < n.length; i++)
            (r = n[i]),
              r.once === !0 && this.removeListener(e, r.listener),
              (o = r.listener.apply(this, t || [])),
              o === this._getOnceReturnValue() &&
                this.removeListener(e, r.listener);
      return this;
    }),
    (s.trigger = r("emitEvent")),
    (s.emit = function (e) {
      var t = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(e, t);
    }),
    (s.setOnceReturnValue = function (e) {
      return (this._onceReturnValue = e), this;
    }),
    (s._getOnceReturnValue = function () {
      return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue;
    }),
    (s._getEvents = function () {
      return this._events || (this._events = {});
    }),
    (t.noConflict = function () {
      return (e.EventEmitter = o), t;
    }),
    "function" == typeof define && define.amd
      ? define(function () {
          return t;
        })
      : "object" == typeof module && module.exports
      ? (module.exports = t)
      : (e.EventEmitter = t);
})(this || {});
/* docma (dust) compiled templates */
(function (dust) {
  dust.register("docma-404", body_0);
  function body_0(chk, ctx) {
    return chk
      .p("navbar", ctx, ctx, { boxed: "true" })
      .w(
        '<div id="page-content-wrapper"><div class="container container-boxed"><br /><br /><h1>404</h1><hr /><h3>Page Not Found</h3><br />The file or page you have requested is not found. &nbsp;&nbsp;<br />Please make sure page address is entered correctly.<br /><br /><br /></div></div>',
      );
  }
  body_0.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("docma-api", body_0);
  function body_0(chk, ctx) {
    return chk
      .p("navbar", ctx, ctx, {})
      .w('<div id="wrapper">')
      .x(
        ctx.getPath(false, ["template", "options", "sidebar", "enabled"]),
        ctx,
        { block: body_1 },
        {},
      )
      .w('<div id="page-content-wrapper"><div class="container"><br />')
      .s(ctx.get(["documentation"], false), ctx, { block: body_2 }, {})
      .w(
        '<br /><span class="docma-info">Documentation built with <b><a target="_blank" rel="noopener noreferrer" href="https://onury.io/docma">Docma</a></b>.</span></div></div></div>',
      );
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk
      .w('<div id="sidebar-wrapper">')
      .p("sidebar", ctx, ctx, {})
      .w("</div>");
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk.p("symbol", ctx, ctx, {
      symbol: ctx.getPath(true, []),
      template: ctx.get(["template"], false),
    });
  }
  body_2.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("docma-content", body_0);
  function body_0(chk, ctx) {
    return chk
      .p("navbar", ctx, ctx, { boxed: "true" })
      .w('<div id="page-content-wrapper"><div class=\'')
      .h(
        "eq",
        ctx,
        { block: body_1 },
        {
          key: ctx.getPath(false, ["currentRoute", "sourceType"]),
          value: "md",
        },
        "h",
      )
      .w('\'><div id="docma-content"></div>')
      .h(
        "eq",
        ctx,
        { block: body_2 },
        {
          key: ctx.getPath(false, ["currentRoute", "sourceType"]),
          value: "md",
        },
        "h",
      )
      .w("</div></div>");
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk.w("container container-boxed");
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk.w(
      '<br /><hr /><span class="docma-info">Documentation built with <b><a target="_blank" rel="noopener noreferrer" href="https://onury.io/docma">Docma</a></b>.</span>',
    );
  }
  body_2.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("enums", body_0);
  function body_0(chk, ctx) {
    return chk.x(ctx.get(["$members"], false), ctx, { block: body_1 }, {});
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk.h(
      "eq",
      ctx,
      { else: body_2, block: body_4 },
      {
        key: ctx.getPath(false, ["template", "options", "symbols", "enums"]),
        value: "table",
      },
      "h",
    );
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk
      .w(
        '<div class="space-top-sm space-bottom-xs fw-bold">Enumeration</div><ul class="param-list">',
      )
      .s(ctx.get(["$members"], false), ctx, { block: body_3 }, {})
      .w("</ul>");
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk
      .w(
        '<li><div class="param-meta clearfix"><span class="inline-block space-right-sm"><code>',
      )
      .f(ctx.getPath(true, []), ctx, "h", ["$longname", "s", "$dot_prop"])
      .w("</code>&nbsp;:&nbsp;<code>")
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
      .w(
        '</code></span><span class="param-info-box"><span class="param-info value">Value:&nbsp;</span><code>',
      )
      .f(ctx.getPath(true, []), ctx, "h", ["$val"])
      .w('</code></span></div><div class="param-desc">')
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$desc"])
      .w("</div></li>");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk
      .w(
        '<table class="table table-striped table-bordered"><thead><tr><th>Enumeration</th><th>Type</th><th>Value</th><th>Description</th></tr></thead><tbody>',
      )
      .s(ctx.get(["$members"], false), ctx, { block: body_5 }, {})
      .w("</tbody></table>");
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk
      .w("<tr><td><code>")
      .f(ctx.getPath(true, []), ctx, "h", ["$longname", "s", "$dot_prop"])
      .w("</code></td><td><code>")
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
      .w("</code></td><td><code>")
      .f(ctx.getPath(true, []), ctx, "h", ["$val"])
      .w("</code></td><td>")
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$desc"])
      .w("</td></tr>");
  }
  body_5.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("navbar", body_0);
  function body_0(chk, ctx) {
    return chk.x(
      ctx.getPath(false, ["template", "options", "navbar", "enabled"]),
      ctx,
      { block: body_1 },
      {},
    );
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk
      .w('<nav class="navbar ')
      .x(
        ctx.getPath(false, ["template", "options", "navbar", "dark"]),
        ctx,
        { block: body_2 },
        {},
      )
      .w('"><div class="navbar-inner ')
      .x(ctx.get(["boxed"], false), ctx, { block: body_3 }, {})
      .w('"><div class="navbar-brand">')
      .x(
        ctx.getPath(false, ["template", "options", "logo", "dark"]),
        ctx,
        { block: body_4 },
        {},
      )
      .w('<span class="navbar-title"><a href="')
      .f(ctx.getPath(false, ["template", "options", "title", "href"]), ctx, "h")
      .w('">')
      .f(
        ctx.getPath(false, ["template", "options", "title", "label"]),
        ctx,
        "h",
      )
      .w("</a></span></div>")
      .h(
        "gt",
        ctx,
        { block: body_7 },
        {
          key: ctx.getPath(false, [
            "template",
            "options",
            "navbar",
            "menu",
            "length",
          ]),
          value: 0,
        },
        "h",
      )
      .w("</div></nav>")
      .x(
        ctx.getPath(false, ["template", "options", "navbar", "fixed"]),
        ctx,
        { block: body_16 },
        {},
      )
      .w('<div class="nav-overlay"></div>');
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk.w("dark");
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk.w("container container-boxed");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk.x(
      ctx.getPath(false, ["template", "options", "navbar", "dark"]),
      ctx,
      { else: body_5, block: body_6 },
      {},
    );
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk
      .w('<img src="')
      .f(ctx.getPath(false, ["template", "options", "logo", "dark"]), ctx, "h")
      .w('" alt="logo" class="navbar-logo" />');
  }
  body_5.__dustBody = !0;
  function body_6(chk, ctx) {
    return chk
      .w('<img src="')
      .f(ctx.getPath(false, ["template", "options", "logo", "light"]), ctx, "h")
      .w('" alt="logo" class="navbar-logo" />');
  }
  body_6.__dustBody = !0;
  function body_7(chk, ctx) {
    return chk
      .w(
        '<div class="navbar-menu-btn" tabindex="0"><i class="fas fa-lg fa-bars trans-all-ease"></i><i class="fas fa-md fa-times trans-all-ease"></i></div><div class="navbar-menu"><ul class="navbar-list">',
      )
      .s(
        ctx.getPath(false, ["template", "options", "navbar", "menu"]),
        ctx,
        { block: body_8 },
        {},
      )
      .w("</ul></div>");
  }
  body_7.__dustBody = !0;
  function body_8(chk, ctx) {
    return chk.x(
      ctx.get(["items"], false),
      ctx,
      { else: body_9, block: body_10 },
      {},
    );
  }
  body_8.__dustBody = !0;
  function body_9(chk, ctx) {
    return chk.p("navitem", ctx, ctx.rebase(ctx.getPath(true, [])), {});
  }
  body_9.__dustBody = !0;
  function body_10(chk, ctx) {
    return chk
      .w('<li class="dropdown"><a href="')
      .x(ctx.get(["href"], false), ctx, { else: body_11, block: body_12 }, {})
      .w(
        '" role="button" aria-haspopup="true" aria-expanded="false"><i class="nav-icon ',
      )
      .f(ctx.get(["iconClass"], false), ctx, "h")
      .w('" aria-hidden="true"></i>')
      .x(ctx.get(["label"], false), ctx, { block: body_13 }, {})
      .x(ctx.get(["chevron"], false), ctx, { block: body_14 }, {})
      .w("</a><ul>")
      .s(ctx.get(["items"], false), ctx, { block: body_15 }, {})
      .w("</ul></li>");
  }
  body_10.__dustBody = !0;
  function body_11(chk, ctx) {
    return chk.w("#");
  }
  body_11.__dustBody = !0;
  function body_12(chk, ctx) {
    return chk.f(ctx.get(["href"], false), ctx, "h");
  }
  body_12.__dustBody = !0;
  function body_13(chk, ctx) {
    return chk
      .w('<span class="nav-label">')
      .f(ctx.get(["label"], false), ctx, "h")
      .w("</span>");
  }
  body_13.__dustBody = !0;
  function body_14(chk, ctx) {
    return chk.w('<i class="nav-arrow fas fa-sm fa-angle-down"></i>');
  }
  body_14.__dustBody = !0;
  function body_15(chk, ctx) {
    return chk
      .w(" ")
      .p("navitem", ctx, ctx.rebase(ctx.getPath(true, [])), {})
      .w(" ");
  }
  body_15.__dustBody = !0;
  function body_16(chk, ctx) {
    return chk.w('<div class="nav-spacer"></div>');
  }
  body_16.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("navitem", body_0);
  function body_0(chk, ctx) {
    return chk.x(
      ctx.get(["separator"], false),
      ctx,
      { else: body_1, block: body_6 },
      {},
    );
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk
      .w('<li><a href="')
      .x(ctx.get(["href"], false), ctx, { else: body_2, block: body_3 }, {})
      .w('" target="')
      .f(ctx.get(["target"], false), ctx, "h")
      .w('">')
      .x(ctx.get(["iconClass"], false), ctx, { block: body_4 }, {})
      .x(ctx.get(["label"], false), ctx, { block: body_5 }, {})
      .w("</a></li>");
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk.w("#");
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk.f(ctx.get(["href"], false), ctx, "h");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk
      .w('<i class="nav-icon ')
      .f(ctx.get(["iconClass"], false), ctx, "h")
      .w('" aria-hidden="true"></i>');
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk
      .w('<span class="nav-label">')
      .f(ctx.get(["label"], false), ctx, "h", ["s"])
      .w("</span>");
  }
  body_5.__dustBody = !0;
  function body_6(chk, ctx) {
    return chk.w('<li role="separator" class="divider"></li>');
  }
  body_6.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("params", body_0);
  function body_0(chk, ctx) {
    return chk.x(ctx.get(["params"], false), ctx, { block: body_1 }, {});
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk.h(
      "eq",
      ctx,
      { else: body_2, block: body_8 },
      {
        key: ctx.getPath(false, ["template", "options", "symbols", "params"]),
        value: "table",
      },
      "h",
    );
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk
      .w(
        '<div class="space-top-sm space-bottom-xs fw-bold">Parameters</div><ul class="param-list">',
      )
      .s(ctx.get(["params"], false), ctx, { block: body_3 }, {})
      .w("</ul>");
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk
      .w(
        '<li><div class="param-meta clearfix"><span class="inline-block space-right-sm"><code>',
      )
      .x(ctx.get(["variable"], false), ctx, { block: body_4 }, {})
      .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
      .w("</code>&nbsp;:&nbsp;<code>")
      .x(ctx.get(["variable"], false), ctx, { block: body_5 }, {})
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
      .w('</code></span><span class="param-info-box">')
      .x(ctx.get(["optional"], false), ctx, { else: body_6, block: body_7 }, {})
      .w('</span></div><div class="param-desc">')
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$param_desc"])
      .w("</div></li>");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk.w("...");
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk.w("...");
  }
  body_5.__dustBody = !0;
  function body_6(chk, ctx) {
    return chk.w('<span class="param-info required boxed">Required</span>');
  }
  body_6.__dustBody = !0;
  function body_7(chk, ctx) {
    return chk
      .w('<span class="param-info default">Default:&nbsp;</span><code>')
      .f(ctx.getPath(true, []), ctx, "h", ["$def"])
      .w("</code>");
  }
  body_7.__dustBody = !0;
  function body_8(chk, ctx) {
    return chk
      .w(
        '<table class="table table-striped table-bordered"><thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead><tbody>',
      )
      .s(ctx.get(["params"], false), ctx, { block: body_9 }, {})
      .w("</tbody></table>");
  }
  body_8.__dustBody = !0;
  function body_9(chk, ctx) {
    return chk
      .w("<tr><td><code>")
      .x(ctx.get(["variable"], false), ctx, { block: body_10 }, {})
      .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
      .w("</code></td><td><code>")
      .x(ctx.get(["variable"], false), ctx, { block: body_11 }, {})
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
      .w("</code></td><td>")
      .x(
        ctx.get(["optional"], false),
        ctx,
        { else: body_12, block: body_13 },
        {},
      )
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$param_desc"])
      .w("</td></tr>");
  }
  body_9.__dustBody = !0;
  function body_10(chk, ctx) {
    return chk.w("...");
  }
  body_10.__dustBody = !0;
  function body_11(chk, ctx) {
    return chk.w("...");
  }
  body_11.__dustBody = !0;
  function body_12(chk, ctx) {
    return chk.w('<span class="param-info required boxed">Required</span>');
  }
  body_12.__dustBody = !0;
  function body_13(chk, ctx) {
    return chk
      .w(
        '<span class="param-info default boxed">Default</span><span class="color-gray">:</span><code>',
      )
      .f(ctx.getPath(true, []), ctx, "h", ["$def"])
      .w("</code>");
  }
  body_13.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("properties", body_0);
  function body_0(chk, ctx) {
    return chk.x(ctx.get(["properties"], false), ctx, { block: body_1 }, {});
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk.h(
      "eq",
      ctx,
      { else: body_2, block: body_4 },
      {
        key: ctx.getPath(false, ["template", "options", "symbols", "props"]),
        value: "table",
      },
      "h",
    );
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk
      .w(
        '<div class="space-top-sm space-bottom-xs fw-bold">Properties</div><ul class="param-list">',
      )
      .s(ctx.get(["properties"], false), ctx, { block: body_3 }, {})
      .w("</ul>");
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk
      .w(
        '<li><div class="param-meta clearfix"><span class="inline-block space-right-sm"><code>',
      )
      .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
      .w("</code>&nbsp;:&nbsp;<code>")
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
      .w('</code></span></div><div class="param-desc">')
      .f(ctx.get(["description"], false), ctx, "h", ["s", "$p"])
      .w("</div></li>");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk
      .w(
        '<table class="table table-striped table-bordered"><thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead><tbody>',
      )
      .s(ctx.get(["properties"], false), ctx, { block: body_5 }, {})
      .w("</tbody></table>");
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk
      .w("<tr><td><code>")
      .f(ctx.get(["name"], false), ctx, "h", ["s", "$dot_prop"])
      .w("</code></td><td><code>")
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$type"])
      .w("</code></td><td>")
      .f(ctx.get(["description"], false), ctx, "h", ["s", "$p"])
      .w("</td></tr>");
  }
  body_5.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("sidebar", body_0);
  function body_0(chk, ctx) {
    return chk
      .w(
        '<div class="sidebar-header"><div id="sidebar-toggle"><i class="fas fa-lg fa-bars trans-all-ease"></i></div><div class="sidebar-brand">',
      )
      .x(
        ctx.getPath(false, ["template", "options", "logo", "light"]),
        ctx,
        { block: body_1 },
        {},
      )
      .w('<span class="sidebar-title"><a href="')
      .f(ctx.getPath(false, ["template", "options", "title", "href"]), ctx, "h")
      .w('">')
      .f(
        ctx.getPath(false, ["template", "options", "title", "label"]),
        ctx,
        "h",
      )
      .w("</a></span></div>")
      .x(
        ctx.getPath(false, ["template", "options", "sidebar", "search"]),
        ctx,
        { block: body_2 },
        {},
      )
      .x(
        ctx.getPath(false, ["template", "options", "sidebar", "toolbar"]),
        ctx,
        { block: body_3 },
        {},
      )
      .w('</div><div class="sidebar-nav-container"><ul class="sidebar-nav">')
      .f(ctx.get(["symbols"], false), ctx, "h", ["s", "$navnodes"])
      .w("</ul></div>");
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk
      .w('<img src="')
      .f(ctx.getPath(false, ["template", "options", "logo", "light"]), ctx, "h")
      .w('" alt="logo" class="sidebar-logo" />');
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk.w(
      '<div class="sidebar-search"><div class="sidebar-search-icon"><i class="fas fa-md fa-search"></i></div><input id="txt-search" type="search" placeholder="Search..." autocorrect="off" autocapitalize="off" spellcheck="false" /><div class="sidebar-search-clean"><i class="fas fa-lg fa-times-circle"></i></div></div>',
    );
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk
      .w(
        '<div class="sidebar-toolbar"><div class="toolbar-scope-filters"></div><div class="toolbar-kind-filters"></div><div class="toolbar-buttons"><span class="btn-switch-fold inline-block" title="Fold Symbols">',
      )
      .h(
        "eq",
        ctx,
        { else: body_4, block: body_5 },
        {
          key: ctx.getPath(false, [
            "template",
            "options",
            "sidebar",
            "itemsFolded",
          ]),
          type: "boolean",
          value: "true",
        },
        "h",
      )
      .w(
        '</span><span class="btn-switch-outline inline-block space-left-xs" title="Toggle Outline">',
      )
      .h(
        "eq",
        ctx,
        { else: body_6, block: body_7 },
        {
          key: ctx.getPath(false, [
            "template",
            "options",
            "sidebar",
            "outline",
          ]),
          type: "string",
          value: "tree",
        },
        "h",
      )
      .w("</span></div></div>");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk.w('<i class="far fa-lg fa-caret-square-down"></i>');
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk.w('<i class="far fa-lg fa-caret-square-right"></i>');
  }
  body_5.__dustBody = !0;
  function body_6(chk, ctx) {
    return chk.w('<i class="fas fa-lg fa-outdent"></i>');
  }
  body_6.__dustBody = !0;
  function body_7(chk, ctx) {
    return chk.w('<i class="fas fa-lg fa-indent"></i>');
  }
  body_7.__dustBody = !0;
  return body_0;
})(dust);
(function (dust) {
  dust.register("symbol", body_0);
  function body_0(chk, ctx) {
    return chk.nx(
      ctx.getPath(false, ["symbol", "$hide"]),
      ctx,
      { block: body_1 },
      {},
    );
  }
  body_0.__dustBody = !0;
  function body_1(chk, ctx) {
    return chk
      .w('<div id="')
      .f(ctx.get(["symbol"], false), ctx, "h", ["$id"])
      .w(
        '" class="symbol-container"><div class="symbol-heading"><div class="symbol"><a href="#',
      )
      .f(ctx.get(["symbol"], false), ctx, "h", ["$id"])
      .w(
        '"><i class="fas fa-link color-gray-light" aria-hidden="true"></i></a><code class="symbol-name">',
      )
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$longname_params"])
      .w('</code><span class="symbol-sep">')
      .f(ctx.get(["symbol"], false), ctx, "h", ["$type_sep"])
      .w('</span><code class="symbol-type">')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$type"])
      .w("</code>")
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$tags"])
      .w('</div></div><div class="symbol-definition"><div class="symbol-info">')
      .x(ctx.getPath(false, ["symbol", "alias"]), ctx, { block: body_2 }, {})
      .x(ctx.getPath(false, ["symbol", "augments"]), ctx, { block: body_4 }, {})
      .x(ctx.getPath(false, ["symbol", "version"]), ctx, { block: body_5 }, {})
      .x(ctx.getPath(false, ["symbol", "since"]), ctx, { block: body_6 }, {})
      .x(
        ctx.getPath(false, ["symbol", "copyright"]),
        ctx,
        { block: body_7 },
        {},
      )
      .x(ctx.getPath(false, ["symbol", "author"]), ctx, { block: body_8 }, {})
      .x(ctx.getPath(false, ["symbol", "license"]), ctx, { block: body_9 }, {})
      .w("</div>")
      .x(
        ctx.getPath(false, ["symbol", "defaultvalue"]),
        ctx,
        { block: body_10 },
        {},
      )
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$desc"])
      .x(ctx.getPath(false, ["symbol", "see"]), ctx, { block: body_11 }, {})
      .h(
        "ne",
        ctx,
        { block: body_16 },
        {
          key: ctx.getPath(false, ["symbol", "meta", "code", "type"]),
          value: "ClassDeclaration",
        },
        "h",
      )
      .x(ctx.getPath(false, ["symbol", "fires"]), ctx, { block: body_19 }, {})
      .x(ctx.getPath(false, ["symbol", "returns"]), ctx, { block: body_21 }, {})
      .x(
        ctx.getPath(false, ["symbol", "generator"]),
        ctx,
        { block: body_24 },
        {},
      )
      .x(
        ctx.getPath(false, ["symbol", "exceptions"]),
        ctx,
        { block: body_28 },
        {},
      )
      .x(ctx.getPath(false, ["symbol", "isEnum"]), ctx, { block: body_31 }, {})
      .x(
        ctx.getPath(false, ["symbol", "examples"]),
        ctx,
        { block: body_32 },
        {},
      )
      .x(
        ctx.getPath(false, ["template", "options", "symbols", "meta"]),
        ctx,
        { block: body_35 },
        {},
      )
      .w("</div></div><hr />")
      .x(
        ctx.getPath(false, ["symbol", "$constructor"]),
        ctx,
        { block: body_39 },
        {},
      )
      .nx(
        ctx.getPath(false, ["symbol", "isEnum"]),
        ctx,
        { block: body_41 },
        {},
      );
  }
  body_1.__dustBody = !0;
  function body_2(chk, ctx) {
    return chk.nx(ctx.get(["$constructor"], false), ctx, { block: body_3 }, {});
  }
  body_2.__dustBody = !0;
  function body_3(chk, ctx) {
    return chk
      .w('<p><b class="caption">Alias:</b> <code>')
      .f(ctx.getPath(false, ["symbol", "alias"]), ctx, "h", ["s", "$dot_prop"])
      .w("</code></p>");
  }
  body_3.__dustBody = !0;
  function body_4(chk, ctx) {
    return chk
      .w('<p><b class="caption">Extends:</b> ')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$extends"])
      .w("</p>");
  }
  body_4.__dustBody = !0;
  function body_5(chk, ctx) {
    return chk
      .w('<p><b class="caption">Version:</b>&nbsp;')
      .f(ctx.getPath(false, ["symbol", "version"]), ctx, "h", ["s"])
      .w("</p>");
  }
  body_5.__dustBody = !0;
  function body_6(chk, ctx) {
    return chk
      .w('<p><b class="caption">Since:</b>&nbsp;')
      .f(ctx.getPath(false, ["symbol", "since"]), ctx, "h", ["s"])
      .w("</p>");
  }
  body_6.__dustBody = !0;
  function body_7(chk, ctx) {
    return chk
      .w('<p><b class="caption">Copyright:</b>&nbsp;')
      .f(ctx.getPath(false, ["symbol", "copyright"]), ctx, "h", ["s"])
      .w("</p>");
  }
  body_7.__dustBody = !0;
  function body_8(chk, ctx) {
    return chk
      .w('<p><b class="caption">Author:</b>&nbsp;')
      .f(ctx.getPath(false, ["symbol", "author"]), ctx, "h", ["s", "$author"])
      .w("</p>");
  }
  body_8.__dustBody = !0;
  function body_9(chk, ctx) {
    return chk
      .w('<p><b class="caption">License:</b>&nbsp;')
      .f(ctx.getPath(false, ["symbol", "license"]), ctx, "h", ["s"])
      .w("</p>");
  }
  body_9.__dustBody = !0;
  function body_10(chk, ctx) {
    return chk
      .w(
        '<p class="symbol-def-val"><b class="caption"><i>Value:</i></b>&nbsp;<code>',
      )
      .f(ctx.get(["symbol"], false), ctx, "h", ["$def"])
      .w("</code></p>");
  }
  body_10.__dustBody = !0;
  function body_11(chk, ctx) {
    return chk
      .w('<p class="no-margin"><b>See</b>')
      .h(
        "gt",
        ctx,
        { else: body_12, block: body_14 },
        { key: ctx.getPath(false, ["symbol", "see", "length"]), value: 1 },
        "h",
      )
      .w("</p>");
  }
  body_11.__dustBody = !0;
  function body_12(chk, ctx) {
    return chk.s(
      ctx.getPath(false, ["symbol", "see"]),
      ctx,
      { block: body_13 },
      {},
    );
  }
  body_12.__dustBody = !0;
  function body_13(chk, ctx) {
    return chk.w("&nbsp;").f(ctx.getPath(true, []), ctx, "h", ["s", "$pl"]);
  }
  body_13.__dustBody = !0;
  function body_14(chk, ctx) {
    return chk
      .w("<ul>")
      .s(ctx.getPath(false, ["symbol", "see"]), ctx, { block: body_15 }, {})
      .w("</ul>");
  }
  body_14.__dustBody = !0;
  function body_15(chk, ctx) {
    return chk
      .w("<li>")
      .f(ctx.getPath(true, []), ctx, "h", ["s", "$pl"])
      .w("</li>");
  }
  body_15.__dustBody = !0;
  function body_16(chk, ctx) {
    return chk
      .p("params", ctx, ctx.rebase(ctx.get(["symbol"], false)), {
        template: ctx.get(["template"], false),
      })
      .w(" ")
      .x(
        ctx.getPath(false, ["symbol", "isEnum"]),
        ctx,
        { else: body_17, block: body_18 },
        {},
      );
  }
  body_16.__dustBody = !0;
  function body_17(chk, ctx) {
    return chk
      .p("properties", ctx, ctx.rebase(ctx.get(["symbol"], false)), {
        template: ctx.get(["template"], false),
      })
      .w(" ");
  }
  body_17.__dustBody = !0;
  function body_18(chk, ctx) {
    return chk;
  }
  body_18.__dustBody = !0;
  function body_19(chk, ctx) {
    return chk.h(
      "gt",
      ctx,
      { block: body_20 },
      {
        key: ctx.getPath(false, ["symbol", "fires", "length"]),
        value: "0",
        type: "number",
      },
      "h",
    );
  }
  body_19.__dustBody = !0;
  function body_20(chk, ctx) {
    return chk
      .w('<p><b class="caption">Emits:</b>&nbsp;&nbsp;')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$emits"])
      .w("</p>");
  }
  body_20.__dustBody = !0;
  function body_21(chk, ctx) {
    return chk.h(
      "gt",
      ctx,
      { else: body_22, block: body_23 },
      {
        key: ctx.getPath(false, ["symbol", "returns", "length"]),
        value: "1",
        type: "number",
      },
      "h",
    );
  }
  body_21.__dustBody = !0;
  function body_22(chk, ctx) {
    return chk
      .w('<p><b class="caption">Returns:</b>&nbsp;&nbsp;')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$returns"])
      .w("</p>");
  }
  body_22.__dustBody = !0;
  function body_23(chk, ctx) {
    return chk
      .w('<b class="caption">Returns:</b><p class="pad-left">')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$returns"])
      .w("</p>");
  }
  body_23.__dustBody = !0;
  function body_24(chk, ctx) {
    return chk.x(
      ctx.getPath(false, ["symbol", "yields"]),
      ctx,
      { block: body_25 },
      {},
    );
  }
  body_24.__dustBody = !0;
  function body_25(chk, ctx) {
    return chk.h(
      "gt",
      ctx,
      { else: body_26, block: body_27 },
      {
        key: ctx.getPath(false, ["symbol", "yields", "length"]),
        value: "1",
        type: "number",
      },
      "h",
    );
  }
  body_25.__dustBody = !0;
  function body_26(chk, ctx) {
    return chk
      .w('<p><b class="caption">Yields:</b>&nbsp;&nbsp;')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$yields"])
      .w("</p>");
  }
  body_26.__dustBody = !0;
  function body_27(chk, ctx) {
    return chk
      .w('<b class="caption">Yields:</b><p class="pad-left">')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$yields"])
      .w("</p>");
  }
  body_27.__dustBody = !0;
  function body_28(chk, ctx) {
    return chk.h(
      "gt",
      ctx,
      { else: body_29, block: body_30 },
      {
        key: ctx.getPath(false, ["symbol", "exceptions", "length"]),
        value: "1",
        type: "number",
      },
      "h",
    );
  }
  body_28.__dustBody = !0;
  function body_29(chk, ctx) {
    return chk
      .w('<p><b class="caption">Throws:</b>&nbsp;&nbsp;')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$exceptions"])
      .w("</p>");
  }
  body_29.__dustBody = !0;
  function body_30(chk, ctx) {
    return chk
      .w('<b class="caption">Throws:</b><p class="pad-left">')
      .f(ctx.get(["symbol"], false), ctx, "h", ["s", "$exceptions"])
      .w("</p>");
  }
  body_30.__dustBody = !0;
  function body_31(chk, ctx) {
    return chk
      .p("enums", ctx, ctx.rebase(ctx.get(["symbol"], false)), {
        template: ctx.get(["template"], false),
      })
      .w(" ");
  }
  body_31.__dustBody = !0;
  function body_32(chk, ctx) {
    return chk.s(
      ctx.getPath(false, ["symbol", "examples"]),
      ctx,
      { block: body_33 },
      {},
    );
  }
  body_32.__dustBody = !0;
  function body_33(chk, ctx) {
    return chk
      .w("<p><b>Example")
      .h(
        "gt",
        ctx,
        { block: body_34 },
        { key: ctx.getPath(false, ["symbol", "examples", "length"]), value: 1 },
        "h",
      )
      .w("</b>")
      .f(ctx.getPath(true, []), ctx, "h", ["$get_caption", "s"])
      .w("</p><pre><code>")
      .f(ctx.getPath(true, []), ctx, "h", ["$nt", "$tnl", "$remove_caption"])
      .w("</code></pre>");
  }
  body_33.__dustBody = !0;
  function body_34(chk, ctx) {
    return chk
      .w("&nbsp;#")
      .h(
        "math",
        ctx,
        {},
        { key: ctx.get(["$idx"], false), method: "add", operand: "1" },
        "h",
      );
  }
  body_34.__dustBody = !0;
  function body_35(chk, ctx) {
    return chk.x(
      ctx.getPath(false, ["symbol", "meta", "lineno"]),
      ctx,
      { block: body_36 },
      {},
    );
  }
  body_35.__dustBody = !0;
  function body_36(chk, ctx) {
    return chk
      .w('<p class="symbol-meta">')
      .x(
        ctx.getPath(false, ["symbol", "meta", "filename"]),
        ctx,
        { block: body_37 },
        {},
      )
      .x(
        ctx.getPath(false, ["symbol", "meta", "lineno"]),
        ctx,
        { block: body_38 },
        {},
      )
      .w("</p>");
  }
  body_36.__dustBody = !0;
  function body_37(chk, ctx) {
    return chk
      .w("<b>File:</b> ")
      .f(ctx.getPath(false, ["symbol", "meta", "filename"]), ctx, "h")
      .w("&nbsp;&nbsp;");
  }
  body_37.__dustBody = !0;
  function body_38(chk, ctx) {
    return chk
      .w("<b>Line:</b> ")
      .f(ctx.getPath(false, ["symbol", "meta", "lineno"]), ctx, "h")
      .w("&nbsp;&nbsp;");
  }
  body_38.__dustBody = !0;
  function body_39(chk, ctx) {
    return chk.h(
      "ne",
      ctx,
      { block: body_40 },
      {
        key: ctx.getPath(false, ["symbol", "hideconstructor"]),
        type: "boolean",
        value: "true",
      },
      "h",
    );
  }
  body_39.__dustBody = !0;
  function body_40(chk, ctx) {
    return chk.p("symbol", ctx, ctx, {
      symbol: ctx.getPath(false, ["symbol", "$constructor"]),
      template: ctx.get(["template"], false),
    });
  }
  body_40.__dustBody = !0;
  function body_41(chk, ctx) {
    return chk.s(
      ctx.getPath(false, ["symbol", "$members"]),
      ctx,
      { block: body_42 },
      {},
    );
  }
  body_41.__dustBody = !0;
  function body_42(chk, ctx) {
    return chk.p("symbol", ctx, ctx, {
      symbol: ctx.getPath(true, []),
      template: ctx.get(["template"], false),
    });
  }
  body_42.__dustBody = !0;
  return body_0;
})(dust);
/*!
 * Docma (Web) Core
 * https://github.com/onury/docma
 * @license MIT
 */
var DocmaWeb = (function () {
  "use strict";

  var Utils = {};
  function getStr(e) {
    return "string" == typeof e ? e.trim() : "";
  }
  function bracket(e) {
    return /^[a-z$_][a-z\d$_]*$/i.test(e) ? "." + e : '["' + e + '"]';
  }
  function fixBracket(r) {
    return r.replace(/(.*?)\."([^"]+)"\]?$/, function (e, t, n) {
      return n ? t + bracket(n) : r;
    });
  }
  function cleanName(e) {
    return fixBracket(
      (e = getStr(e)
        .replace(/([^>]+>)?~?(.*)/, "$2")
        .replace(/^"[^"]+"\.?~?([^"]+)$/, "$1")
        .replace(/^(module\.)?exports\./, "")
        .replace(/^module:/, "")),
    );
  }
  function getMetaCodeName(e) {
    return cleanName(Utils.notate(e, "meta.code.name") || "");
  }
  function identity(e) {
    return e;
  }
  function hasConstructorTag(e) {
    return /\*\s+@construct(s|or)\b/.test(e.comment);
  }
  (Utils.type = function (e) {
    return Object.prototype.toString
      .call(e)
      .match(/\s(\w+)/i)[1]
      .toLowerCase();
  }),
    (Utils.notate = function (e, t) {
      if ("object" == typeof e) {
        var n,
          r = Array.isArray(t) ? t : t.split("."),
          i = r[0];
        if (i)
          return (n = e[i]), 1 < r.length ? (r.shift(), Utils.notate(n, r)) : n;
      }
    }),
    (Utils.getName = function (e) {
      if (e.alias) {
        var t = getMetaCodeName(e);
        if (t) return t.replace(/.*?[#.~:](\w+)$/i, "$1");
      }
      return e.name;
    }),
    (Utils.getLongName = function (e) {
      var t = cleanName(e.longname),
        n = getMetaCodeName(e) || t,
        r = e.memberof || "",
        r = /^".*"$/.test(r) ? "" : cleanName(r);
      if (e.name === r && Utils.isConstructor(e)) return n;
      var i = e.alias ? n : t;
      if (!r) return i;
      var l = new RegExp("^" + r + "[#.~:]"),
        o = "instance" === e.scope ? "#" : ".";
      return l.test(i) ? i : r + o + i;
    }),
    (Utils.getFullName = Utils.getLongName),
    (Utils.getCodeName = function (e) {
      return getMetaCodeName(e) || Utils.getLongName(e);
    }),
    (Utils.getSymbolByName = function (e, t) {
      var n, r, i;
      if ("object" === Utils.type(e)) {
        for (var l = Object.keys(e), o = 0; o < l.length; o++)
          if (((r = e[l[o]].documentation), (i = Utils.getSymbolByName(r, t))))
            return i;
        return null;
      }
      for (r = e, o = 0; o < r.length; o++) {
        if (
          (n = r[o]).name === t ||
          n.longname === t ||
          Utils.getFullName(n) === t
        )
          return n;
        if (n.$members && (i = Utils.getSymbolByName(n.$members, t))) return i;
      }
      return null;
    }),
    (Utils.getLevels = function (e) {
      var t = ("string" == typeof e ? e : e.$longname) || "";
      return (t = cleanName(t)) ? ((t || "").split(/[.#~]/) || []).length : 0;
    }),
    (Utils.getParentName = function (e) {
      var t;
      if ("string" != typeof e) {
        if (e.memberof && !1 === /^".*"$/.test(e.memberof))
          return cleanName(e.memberof);
        t = cleanName(e.$longname);
      } else t = cleanName(e);
      return t && /[.#~]/g.test(t) ? t.replace(/[.#~][^.#~]*$/, "") : "";
    }),
    (Utils.getParent = function (e, t) {
      var n = "string" == typeof t ? Utils.getSymbolByName(e, t) : t;
      if (!n) return null;
      var r = Utils.getParentName(n);
      return r ? Utils.getSymbolByName(e, r) : null;
    }),
    (Utils.isDeprecated = function (e) {
      return e.deprecated;
    }),
    (Utils.isGlobal = function (e) {
      return "global" === e.scope;
    }),
    (Utils.isNamespace = function (e) {
      return "namespace" === e.kind;
    }),
    (Utils.isModule = function (e) {
      return "module" === e.kind;
    }),
    (Utils.isMixin = function (e) {
      return "mixin" === e.kind;
    }),
    (Utils.isClass = function (e) {
      return (
        "class" === e.kind &&
        "MethodDefinition" !== Utils.notate(e, "meta.code.type") &&
        !hasConstructorTag(e)
      );
    }),
    (Utils.isConstant = function (e) {
      return "constant" === e.kind;
    }),
    (Utils.isConstructor = function (e) {
      return (
        "class" === e.kind &&
        ("MethodDefinition" === Utils.notate(e, "meta.code.type") ||
          hasConstructorTag(e))
      );
    }),
    (Utils.isStaticMember = function (e) {
      return "static" === e.scope;
    }),
    (Utils.isStatic = Utils.isStaticMember),
    (Utils.isInner = function (e) {
      return "inner" === e.scope;
    }),
    (Utils.isInstanceMember = function (e) {
      return "instance" === e.scope;
    }),
    (Utils.isInterface = function (e) {
      return "interface" === e.scope;
    }),
    (Utils.isMethod = function (e) {
      var t = Utils.notate(e, "meta.code.type");
      return (
        "function" === e.kind ||
        "FunctionExpression" === t ||
        "FunctionDeclaration" === t
      );
    }),
    (Utils.isFunction = Utils.isMethod),
    (Utils.isInstanceMethod = function (e) {
      return Utils.isInstanceMember(e) && Utils.isMethod(e);
    }),
    (Utils.isStaticMethod = function (e) {
      return Utils.isStaticMember(e) && Utils.isMethod(e);
    }),
    (Utils.isProperty = function (e) {
      return "member" === e.kind && !Utils.isMethod(e);
    }),
    (Utils.isInstanceProperty = function (e) {
      return Utils.isInstanceMember(e) && Utils.isProperty(e);
    }),
    (Utils.isStaticProperty = function (e) {
      return Utils.isStaticMember(e) && Utils.isProperty(e);
    }),
    (Utils.isTypeDef = function (e) {
      return "typedef" === e.kind;
    }),
    (Utils.isCustomType = Utils.isTypeDef),
    (Utils.isCallback = function (e) {
      var t = (e.type || {}).names || [];
      return (
        "typedef" === e.kind &&
        0 <= (e.comment || "").indexOf("@callback " + e.longname) &&
        1 === t.length &&
        "function" === t[0]
      );
    }),
    (Utils.isEnum = function (e) {
      return Boolean(e.isEnum);
    }),
    (Utils.isEvent = function (e) {
      return "event" === e.kind;
    }),
    (Utils.isExternal = function (e) {
      return "external" === e.kind;
    }),
    (Utils.isGenerator = function (e) {
      return e.generator && "function" === e.kind;
    }),
    (Utils.isReadOnly = function (e) {
      return e.readonly;
    }),
    (Utils.isPublic = function (e) {
      return "string" != typeof e.access || "public" === e.access;
    }),
    (Utils.isPrivate = function (e) {
      return "private" === e.access;
    }),
    (Utils.isPackagePrivate = function (e) {
      return "package" === e.access;
    }),
    (Utils.isProtected = function (e) {
      return "protected" === e.access;
    }),
    (Utils.isUndocumented = function (e) {
      return !e.comments;
    }),
    (Utils.hasDescription = function (e) {
      return Boolean(getStr(e.classdesc) || getStr(e.description));
    }),
    (Utils.trimLeft = function (e) {
      return e.replace(/^[\s\n\r\-—]*/, "");
    }),
    (Utils.trimNewLines = function (e) {
      return e.replace(/^[\r\n]+|[\r\n]+$/, "");
    }),
    (Utils.parseTicks = function (e) {
      return "string" != typeof e
        ? ""
        : e
            .replace(/(```\s*)([\s\S]*?)(\s*```)/g, function (e, t, n) {
              return Utils.normalizeTabs(
                Utils._wrapCode(n, !0, !0).replace(/`/g, "&#x60;"),
              );
            })
            .replace(/(`)(.*?)(`)/g, function (e, t, n) {
              return Utils._wrapCode(n, !0);
            });
    }),
    (Utils.parseNewLines = function (e, r) {
      return (
        (r = r || {}),
        Utils._tokenize(e, function (e, t) {
          if (t) return e;
          var n = e.split(/[\r\n]{2,}/);
          return n.length <= 1 && r.keepIfSingle
            ? e
            : n
                .map(function (e) {
                  return "<p>" + e + "</p>";
                })
                .join("");
        }).join("")
      );
    }),
    (Utils.parseLinks = function (e, l) {
      if ("string" != typeof e) return "";
      l = l || {};
      var t = e.replace(/\{@link +([^}]*?)\}/g, function (e, t) {
        var n,
          r,
          i = t.split("|");
        return (
          1 === i.length
            ? (n = r = i[0].trim())
            : ((n = i[0].trim()), (r = i[1].trim())),
          !1 === /[/?&=]/.test(n) && "#" !== n[0] && (n = "#" + n),
          '<a href="' +
            n +
            '"' +
            (l.target
              ? ' target="' + l.target + '" rel="noopener noreferrer"'
              : "") +
            ">" +
            r +
            "</a>"
        );
      });
      return Utils.parseTicks(t);
    }),
    (Utils.parse = function (e, t) {
      return (
        (t = t || {}),
        (e = Utils.trimLeft(e)),
        (e = Utils.parseNewLines(e, t)),
        (e = Utils.parseTicks(e)),
        Utils.parseLinks(e, t)
      );
    }),
    (Utils.normalizeTabs = function (e) {
      if ("string" != typeof e) return "";
      var t,
        r,
        n = e.match(/^\s*/gm),
        i = 1 / 0;
      return (
        n.forEach(function (e, t) {
          (e = e.replace(/\t/g, "  ")), 0 < t && (i = Math.min(e.length, i));
        }),
        i !== 1 / 0 &&
          ((t = new RegExp("^\\s{" + i + "}", "g")), (e = e.replace(t, ""))),
        (e = e.replace(/^\s*/, "")).replace(/([\r\n]+)(\s+)/gm, function (
          e,
          t,
          n,
        ) {
          return (
            (r = n.replace(/\t/g, "  ")),
            t + (r = new Array(r.length - (r.length % 2) + 1).join(" "))
          );
        })
      );
    }),
    (Utils.getKeywords = function (e) {
      if ("string" == typeof e) return e.toLowerCase();
      var t =
        Utils.getFullName(e) +
        " " +
        e.longname +
        " " +
        e.name +
        " " +
        (e.alias || "") +
        " " +
        (e.memberOf || "") +
        " " +
        (e.$kind || "") +
        " " +
        (e.scope || "") +
        " " +
        (e.classdesc || "") +
        " " +
        (e.description || "") +
        " " +
        (e.filename || "") +
        " " +
        (e.readonly ? "readonly" : "") +
        (e.isEnum ? "enum" : "");
      return (
        Utils.isConstructor(e) && (t += " constructor"),
        Utils.isMethod(e) && (t += " method"),
        Utils.isProperty(e) && (t += " property"),
        t.replace(/[><"'`\n\r]/g, "").toLowerCase()
      );
    }),
    (Utils.getCodeFileInfo = function (e) {
      return {
        filename: Utils.notate(e, "meta.filename"),
        lineno: Utils.notate(e, "meta.lineno"),
        path: Utils.notate(e, "meta.path"),
      };
    }),
    (Utils.getSymbolLink = function (e, t) {
      if ("string" != typeof t) return t.$docmaLink;
      var n = Utils.getSymbolByName(e, t);
      return n ? n.$docmaLink : "";
    });
  var reEndBrackets = /\[\]$/,
    reTypeParts = /^([^<]+?)(?:\.)?(?:<\(([^>)]+)\)>)?(?:<([^>]+)>)?(\[\])?$/;
  function _link(e, t, n) {
    var r,
      i = reEndBrackets.test(t) ? "[]" : "",
      l = (t || "").replace(reEndBrackets, ""),
      o = n || {},
      a = "";
    return (
      "internal" !== o.linkType &&
        (r = Utils._getTypeExternalLink(l)) &&
        (a = ' target="_blank" rel="noopener noreferrer"'),
      r || "external" === o.linkType || (r = Utils.getSymbolLink(e, l)),
      r &&
        (t =
          '<a href="' + r + '"' + a + ">" + (o.displayText || l) + i + "</a>"),
      t
    );
  }
  function serializer(r) {
    var i = [],
      l = [];
    return function (e, t) {
      return 2e3 < i.length
        ? "[Too Big Object]"
        : (0 < i.length
            ? (~(n = i.indexOf(this))
                ? (i.splice(n + 1), l.splice(n, 1 / 0, e))
                : (i.push(this), l.push(e)),
              0 <= i.indexOf(t) &&
                (t =
                  i[0] === t
                    ? "[Circular ~]"
                    : "[Circular ~." +
                      l.slice(0, i.indexOf(t)).join(".") +
                      "]"))
            : i.push(t),
          r ? r.call(this, e, t) : t);
      var n;
    };
  }
  function decodeHash(e) {
    return decodeURIComponent(e).replace(/^#/, "");
  }
  (Utils._parseAnchorLinks = function (t, e, n) {
    var r = e.match(reTypeParts);
    if (!r || !r[1]) return "";
    var i = r[4] || "",
      l = r[2] || r[3] || "";
    return (
      (l =
        (l =
          l &&
          l
            .split(",")
            .map(function (e) {
              return e
                .trim()
                .split("|")
                .map(function (e) {
                  return _link(t, e, n);
                })
                .join('<span class="code-delim">|</span>');
            })
            .join('<span class="code-delim">, </span>')) &&
        "&lt;" + l + "&gt;"),
      _link(t, r[1], n) + l + i
    );
  }),
    (Utils.getTypes = function (t, e, n) {
      var r = n || {},
        i = (i =
          "class" === e.kind ? ["class"] : Utils.notate(e, "type.names") || [])
          .map(function (e) {
            return (
              r.links &&
                (e = Utils._parseAnchorLinks(t, e, { linkType: r.links })),
              e
            );
          })
          .join('<span class="code-delim">|</span>');
      return e.isEnum ? "enum&lt;" + i + "&gt;" : i;
    }),
    (Utils.getReturnTypes = function (r, e, t) {
      var n = e.returns;
      if (!Array.isArray(n)) return "void";
      var i = t || {},
        l = n.reduce(function (e, t) {
          var n = Utils.notate(t, "type.names") || [];
          return (
            i.links &&
              (n = n.map(function (e) {
                return Utils._parseAnchorLinks(r, e, { linkType: i.links });
              })),
            e.concat(n)
          );
        }, []);
      return 0 < l.length
        ? l.join('<span class="code-delim">|</span>')
        : "void";
    }),
    (Utils.getCodeTags = function (n, e, t) {
      var r = t || {};
      return e
        .map(function (e) {
          if (r.links) {
            var t = Utils._parseAnchorLinks(n, e, { linkType: r.links });
            return Utils._wrapCode(t, !1);
          }
          return Utils._wrapCode(e, !0);
        })
        .join(r.demileter || ",");
    }),
    (Utils.getFormattedTypeList = function (n, e, t) {
      if (!Array.isArray(e) || 0 === e.length) return "";
      var r = t || {},
        i = '<span class="code-delim">' + (r.delimeter || "|") + "</span>",
        l = "boolean" != typeof r.descriptions || r.descriptions,
        o = r.descDelimeter || "&nbsp;&nbsp;—&nbsp;&nbsp;",
        a = "",
        s = e.map(function (e) {
          return (
            l &&
              (a =
                (a = Utils.parse(e.description || "", { keepIfSingle: !0 })) &&
                o + a),
            e.type
              ? (e.type.names || [])
                  .map(function (e) {
                    if (r.links) {
                      var t = Utils._parseAnchorLinks(n, e, {
                        linkType: r.links,
                      });
                      return Utils._wrapCode(t, !1);
                    }
                    return Utils._wrapCode(e, !0);
                  })
                  .join(i) + a
              : a
              ? "— " + a
              : ""
          );
        });
      return 1 < s.length ? "<ul><li>" + s.join("</li><li>") + "</li></ul>" : s;
    }),
    (Utils.getEmittedEvents = function (n, e, t) {
      if (!e || 0 === e.length) return "";
      var r,
        i,
        l = t || {},
        o = l.delimeter || ", ";
      return (e || [])
        .map(function (e) {
          if (
            ((r = e.split(/\s*[\s-—]\s*/g)), (i = (r[0] || "").trim()), l.links)
          ) {
            var t = Utils._parseAnchorLinks(n, i, { linkType: l.links });
            return Utils._wrapCode(t, !1);
          }
          return Utils._wrapCode(i, !0);
        })
        .join(o);
    }),
    (Utils._find = function (e, t) {
      if (!e || !t) return null;
      for (var n, r = null, i = 0; i < e.length; i++)
        if ((n = e[i]) && "object" == typeof n) {
          for (var l in t)
            if (void 0 !== t[l] && t.hasOwnProperty(l)) {
              if (t[l] !== n[l]) {
                r = null;
                break;
              }
              r = n;
            }
          if (r) break;
        }
      return r;
    }),
    (Utils._assign = function (e, t, n) {
      var r;
      for (r in ((e = e || {}), t))
        t.hasOwnProperty(r) &&
          (n
            ? Object.defineProperty(e, r, { enumerable: !0, value: t[r] })
            : (e[r] = t[r]));
      return e;
    }),
    (Utils._values = function (e) {
      if (Array.isArray(e)) return e;
      var t,
        n = [];
      for (t in e) e.hasOwnProperty(t) && n.push(e[t]);
      return n;
    }),
    (Utils._wrapCode = function (e, t, n) {
      return "string" != typeof e
        ? ""
        : ((void 0 !== t && !0 !== t) ||
            (e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;")),
          (e = "<code>" + e + "</code>"),
          n ? "<pre>" + e + "</pre>" : e);
    }),
    (Utils._tokenize = function (e, t) {
      "function" != typeof t && (t = identity);
      if (e.indexOf("```") < 0) return [t(e, !1)];
      for (
        var n = "```".length, r = "", i = "", l = [], o = !1, a = 0;
        a < e.length;
        a++
      )
        (r += e[a]),
          (i += e[a]),
          r.length > n && (r = r.slice(-n)),
          "```" === r &&
            (i = (o = !o)
              ? (l.push(t(i.slice(0, -n), !1)), r)
              : (l.push(t(i, !0)), ""));
      return l;
    }),
    (Utils._ensureSlash = function (e, t, n) {
      return t
        ? (e && "/" !== t.slice(0, 1) && (t = "/" + t),
          n && "/" !== t.slice(-1) && (t += "/"),
          t)
        : e || n
        ? "/"
        : "";
    }),
    (Utils._safeStringify = function (t, e, n) {
      try {
        return JSON.stringify(t, serializer(e), n);
      } catch (e) {
        return String(t);
      }
    }),
    (Utils.DOM = {});
  var ATTR_BODY_STYLE = "data-body-style";
  (Utils.DOM.getOffset = function (e) {
    var t = "object" == typeof e ? e : document.getElementById(e);
    if (t) {
      var n = t.getBoundingClientRect();
      if (n.width || n.height || t.getClientRects().length) {
        var r = document.documentElement;
        return {
          top: n.top + window.pageYOffset - r.clientTop,
          left: n.left + window.pageXOffset - r.clientLeft,
        };
      }
    }
  }),
    (Utils.DOM.scrollTo = function (e) {
      var t,
        n,
        r = document.documentElement || document.body;
      (e = decodeHash(e || window.location.hash || ""))
        ? !(t = document.getElementById(e)) ||
          ((n = Utils.DOM.getOffset(t)) && (r.scrollTop = n.top))
        : (r.scrollTop = 0);
    }),
    (Utils.DOM._createChild = function (e, t, n) {
      n = n || {};
      var r = document.createElement(t || "div");
      return (
        Object.keys(n).forEach(function (e) {
          r[e] = n[e];
        }),
        e.appendChild(r),
        r
      );
    }),
    (Utils.DOM._removePrevBodyStyles = function () {
      for (
        var e = document
          .getElementsByTagName("head")[0]
          .querySelectorAll("[" + ATTR_BODY_STYLE + "]");
        0 < e.length;

      )
        e[0].parentNode.removeChild(e[0]);
    }),
    (Utils.DOM._moveBodyStylesToHead = function () {
      for (
        var e,
          t = document.getElementsByTagName("head")[0],
          n = document.body.getElementsByTagName("style"),
          r = 0;
        r < n.length;
        r++
      )
        (e = n[r]).parentNode.removeChild(e),
          e.setAttribute(ATTR_BODY_STYLE, ""),
          t.appendChild(e);
    });
  var _builtinURLs = {
      globals:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/",
      statements:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/",
      operators:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/",
      functions:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/",
      web: "https://developer.mozilla.org/en-US/docs/Web/API/",
    },
    _builtins = {
      globals: [
        "Infinity",
        "NaN",
        "undefined",
        "null",
        "Object",
        "Function",
        "function",
        "Boolean",
        "boolean",
        "Symbol",
        "Error",
        "EvalError",
        "InternalError",
        "RangeError",
        "ReferenceError",
        "SyntaxError",
        "TypeError",
        "URIError",
        "Number",
        "number",
        "Math",
        "Date",
        "String",
        "string",
        "RegExp",
        "Array",
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "Float32Array",
        "Float64Array",
        "Map",
        "Set",
        "WeakMap",
        "WeakSet",
        "ArrayBuffer",
        "DataView",
        "JSON",
        "Promise",
        "Generator",
        "GeneratorFunction",
        "Reflect",
        "Proxy",
        "TypedArray",
        "Intl",
        "Intl.Collator",
        "Intl.DateTimeFormat",
        "Intl.NumberFormat",
        "WebAssembly",
        "WebAssembly.Module",
        "WebAssembly.Instance",
        "WebAssembly.Memory",
        "WebAssembly.Table",
        "WebAssembly.CompileError",
        "WebAssembly.LinkError",
        "WebAssembly.RuntimeError",
      ],
      statements: [
        "function",
        "function*",
        "async function",
        "class",
        "debugger",
      ],
      operators: ["void", "super", "this"],
      functions: ["arguments"],
      web: [
        "AbstractWorker",
        "AnalyserNode",
        "AudioBuffer",
        "AudioContext",
        "AudioListener",
        "AudioNode",
        "BaseAudioContext",
        "BeforeUnloadEvent",
        "Blob",
        "BlobEvent",
        "BufferSource",
        "ByteString",
        "CSSMediaRule",
        "CSSPageRule",
        "CSSPrimitiveValue",
        "CSSRule",
        "CSSRuleList",
        "CSSStyleDeclaration",
        "CSSStyleRule",
        "CSSStyleSheet",
        "CSSSupportsRule",
        "CSSValue",
        "CSSValueList",
        "CloseEvent",
        "CompositionEvent",
        "Console",
        "Coordinates",
        "Crypto",
        "CryptoKey",
        "CustomEvent",
        "DOMException",
        "DOMImplementation",
        "Document",
        "DocumentFragment",
        "DocumentType",
        "DoubleRange",
        "DragEvent",
        "Element",
        "ErrorEvent",
        "Event",
        "EventListener",
        "EventSource",
        "EventTarget",
        "File",
        "FileList",
        "FileReader",
        "FileReaderSync",
        "FormData",
        "Geolocation",
        "HTMLAnchorElement",
        "HTMLAreaElement",
        "HTMLAudioElement",
        "HTMLBRElement",
        "HTMLBaseElement",
        "HTMLBodyElement",
        "HTMLButtonElement",
        "HTMLCanvasElement",
        "HTMLCollection",
        "HTMLDListElement",
        "HTMLDataElement",
        "HTMLDataListElement",
        "HTMLDetailsElement",
        "HTMLDivElement",
        "HTMLDocument",
        "HTMLElement",
        "HTMLEmbedElement",
        "HTMLFieldSetElement",
        "HTMLFormControlsCollection",
        "HTMLFormElement",
        "HTMLHRElement",
        "HTMLHeadElement",
        "HTMLHeadingElement",
        "HTMLHtmlElement",
        "HTMLIFrameElement",
        "HTMLImageElement",
        "HTMLInputElement",
        "HTMLKeygenElement",
        "HTMLLIElement",
        "HTMLLabelElement",
        "HTMLLegendElement",
        "HTMLLinkElement",
        "HTMLMapElement",
        "HTMLMediaElement",
        "HTMLMetaElement",
        "HTMLMeterElement",
        "HTMLModElement",
        "HTMLOListElement",
        "HTMLObjectElement",
        "HTMLOptGroupElement",
        "HTMLOptionElement",
        "HTMLOptionsCollection",
        "HTMLOutputElement",
        "HTMLParagraphElement",
        "HTMLParamElement",
        "HTMLPreElement",
        "HTMLProgressElement",
        "HTMLQuoteElement",
        "HTMLScriptElement",
        "HTMLSelectElement",
        "HTMLSlotElement",
        "HTMLSourceElement",
        "HTMLSpanElement",
        "HTMLStyleElement",
        "HTMLTableCaptionElement",
        "HTMLTableCellElement",
        "HTMLTableColElement",
        "HTMLTableDataCellElement",
        "HTMLTableElement",
        "HTMLTableHeaderCellElement",
        "HTMLTableRowElement",
        "HTMLTableSectionElement",
        "HTMLTemplateElement",
        "HTMLTextAreaElement",
        "HTMLTimeElement",
        "HTMLTitleElement",
        "HTMLTrackElement",
        "HTMLUListElement",
        "HTMLUnknownElement",
        "HTMLVideoElement",
        "HashChangeEvent",
        "History",
        "ImageData",
        "InputEvent",
        "KeyboardEvent",
        "LinkStyle",
        "Location",
        "LongRange",
        "MediaDevices",
        "MediaDeviceInfo",
        "MediaError",
        "MediaRecorder",
        "MediaStream",
        "MessageChannel",
        "MessageEvent",
        "MessagePort",
        "MouseEvent",
        "MutationObserver",
        "MutationRecord",
        "NamedNodeMap",
        "Navigator",
        "NavigatorGeolocation",
        "Node",
        "NodeIterator",
        "NodeList",
        "NonDocumentTypeChildNode",
        "Notification",
        "PageTransitionEvent",
        "PointerEvent",
        "PopStateEvent",
        "Position",
        "PositionError",
        "PositionOptions",
        "ProgressEvent",
        "PromiseRejectionEvent",
        "RTCCertificate",
        "RTCConfiguration",
        "RTCDTMFSender",
        "RTCDTMFToneChangeEvent",
        "RTCDataChannel",
        "RTCPeerConnection",
        "RTCPeerConnection",
        "RTCRtpCodecParameters",
        "RTCRtpContributingSource",
        "RTCRtpReceiver",
        "RTCRtpSender",
        "RTCRtpSynchronizationSource",
        "RTCRtpTransceiver",
        "RTCRtpTransceiverDirection",
        "RTCRtpTransceiverInit",
        "RTCStatsReport",
        "RadioNodeList",
        "RandomSource",
        "Range",
        "RenderingContext",
        "SVGAnimateElement",
        "SVGAnimateMotionElement",
        "SVGAnimateTransformElement",
        "SVGAnimationElement",
        "SVGCircleElement",
        "SVGClipPathElement",
        "SVGCursorElement",
        "SVGElement",
        "SVGEllipseElement",
        "SVGEvent",
        "SVGFilterElement",
        "SVGGeometryElement",
        "SVGGradientElement",
        "SVGGraphicsElement",
        "SVGImageElement",
        "SVGLineElement",
        "SVGLinearGradientElement",
        "SVGMPathElement",
        "SVGMaskElement",
        "SVGMetadataElement",
        "SVGPathElement",
        "SVGPatternElement",
        "SVGPolygonElement",
        "SVGPolylineElement",
        "SVGRadialGradientElement",
        "SVGRect",
        "SVGRectElement",
        "SVGSVGElement",
        "SVGScriptElement",
        "SVGSetElement",
        "SVGStopElement",
        "SVGStyleElement",
        "SVGSwitchElement",
        "SVGSymbolElement",
        "SVGTSpanElement",
        "SVGTextContentElement",
        "SVGTextElement",
        "SVGTextPathElement",
        "SVGTextPositioningElement",
        "SVGTitleElement",
        "SVGTransform",
        "SVGTransformList",
        "SVGTransformable",
        "SVGUseElement",
        "SVGViewElement",
        "ShadowRoot",
        "SharedWorker",
        "Storage",
        "StorageEvent",
        "StyleSheet",
        "StyleSheetList",
        "Text",
        "TextMetrics",
        "TimeEvent",
        "TimeRanges",
        "Touch",
        "TouchEvent",
        "TouchList",
        "Transferable",
        "TreeWalker",
        "UIEvent",
        "URL",
        "WebGLActiveInfo",
        "WebGLBuffer",
        "WebGLContextEvent",
        "WebGLFramebuffer",
        "WebGLProgram",
        "WebGLRenderbuffer",
        "WebGLRenderingContext",
        "WebGLShader",
        "WebGLTexture",
        "WebGLUniformLocation",
        "WebGLVertexArrayObject",
        "WebSocket",
        "WheelEvent",
        "Window",
        "Worker",
        "WorkerGlobalScope",
        "WorkerLocation",
        "WorkerNavigator",
        "XMLHttpRequest",
        "XMLHttpRequestEventTarget",
        "XMLSerializer",
        "XPathExpression",
        "XPathResult",
        "XSLTProcessor",
      ],
    },
    _cats = Object.keys(_builtins);
  Utils._getTypeExternalLink = function (e) {
    for (var t, n = 0; n < _cats.length; n++)
      if (((t = _cats[n]), 0 <= _builtins[t].indexOf(e)))
        return _builtinURLs[t] + (e || "").replace(/^([^.]*\.)/, "");
    return "";
  };

  function DocmaWeb(t) {
    (this._ = t || {}),
      (this._.initialLoad = !1),
      (this._.appEntranceRI = null),
      (this._.emitter = new EventEmitter()),
      Object.defineProperty(this, "app", {
        configurable: !1,
        get: function () {
          return this._.app || null;
        },
      }),
      Object.defineProperty(this, "apis", {
        configurable: !1,
        get: function () {
          return this._.apis || {};
        },
      }),
      Object.defineProperty(this, "routes", {
        configurable: !1,
        get: function () {
          return this._.routes || {};
        },
      }),
      Object.defineProperty(this, "template", {
        configurable: !1,
        get: function () {
          return this._.template || {};
        },
      }),
      Object.defineProperty(this, "location", {
        configurable: !1,
        get: function () {
          var t = Utils._ensureSlash(!0, window.location.pathname, !0),
            e = Utils._ensureSlash(!0, docma.app.base, !0),
            o = t;
          return (
            t.slice(0, e.length) === e && (o = t.slice(e.length - 1, t.length)),
            {
              host: window.location.host,
              hostname: window.location.hostname,
              origin: window.location.origin,
              port: window.location.port,
              protocol: (window.location.protocol || "").replace(/:$/, ""),
              entrance: Utils._ensureSlash(!0, docma.app.entrance, !1),
              base: e,
              hash: (window.location.hash || "").replace(/^#/, ""),
              query: (window.location.search || "").replace(/^\?/, ""),
              href: window.location.href,
              fullpath: t,
              pathname: o,
              path: o + (window.location.search || ""),
              getQuery: function (t, e) {
                "?" ===
                  (e = void 0 === e ? window.location.search || "" : e).slice(
                    0,
                    1,
                  ) && (e = e.slice(1)),
                  (t = (t || "").replace(/[[\]]/g, "\\$&"));
                var o = new RegExp("&?" + t + "(=([^&#]*)|&|#|$)").exec(e);
                return o && o[2]
                  ? decodeURIComponent(o[2].replace(/\+/g, " "))
                  : "";
              },
            }
          );
        },
      }),
      Object.defineProperty(this, "currentRoute", {
        configurable: !1,
        get: function () {
          return this._.currentRoute || null;
        },
      }),
      Object.defineProperty(this, "documentation", {
        configurable: !1,
        get: function () {
          return this._.documentation || [];
        },
      }),
      Object.defineProperty(this, "symbols", {
        configurable: !1,
        get: function () {
          return this._.symbols || [];
        },
      });
  }
  (DocmaWeb.prototype._trigger = function (t, e) {
    this.info("Event:", t, e ? e[0] : ""), this._.emitter.trigger(t, e);
  }),
    (DocmaWeb.Event = {
      Ready: "ready",
      Render: "render",
      Route: "route",
      Navigate: "navigate",
    }),
    (DocmaWeb.prototype.on = function (t, e) {
      return this._.emitter.on.apply(this._.emitter, arguments), docma;
    }),
    (DocmaWeb.prototype.once = function () {
      return this._.emitter.once.apply(this._.emitter, arguments), this;
    }),
    (DocmaWeb.prototype.off = function () {
      return this._.emitter.off.apply(this._.emitter, arguments), this;
    }),
    (DocmaWeb.prototype.addListener = DocmaWeb.prototype.on),
    (DocmaWeb.prototype.addListenerOnce = DocmaWeb.prototype.once),
    (DocmaWeb.prototype.removeListener = DocmaWeb.prototype.off),
    (DocmaWeb.prototype.log = function () {
      docma._.logsEnabled && console.log.apply(console, arguments);
    }),
    (DocmaWeb.prototype.info = function () {
      docma._.logsEnabled && console.info.apply(console, arguments);
    }),
    (DocmaWeb.prototype.warn = function () {
      docma._.logsEnabled && console.warn.apply(console, arguments);
    }),
    (DocmaWeb.prototype.error = function () {
      docma._.logsEnabled && console.error.apply(console, arguments);
    }),
    (DocmaWeb.prototype.getDocmaElem = function () {
      return (
        document.getElementById(this._.elementID) ||
        Utils.DOM.createChild(document.body, "div", { id: this._.elementID })
      );
    }),
    (DocmaWeb.prototype.getContentElem = function () {
      var t = document.getElementById(this._.contentElementID);
      if (!t)
        throw new Error(
          "Partial " +
            this._.partials.content +
            ' should have an element with id="' +
            this._.contentElementID +
            '".',
        );
      return t;
    }),
    (DocmaWeb.prototype.loadContent = function (t) {
      (this.getContentElem().innerHTML = t),
        Utils.DOM._removePrevBodyStyles(),
        Utils.DOM._moveBodyStylesToHead(),
        Utils.DOM.scrollTo();
    }),
    (DocmaWeb.prototype._loadCompiledContent = function (t) {
      this.getDocmaElem().innerHTML = t;
    }),
    (DocmaWeb.prototype._fixAnchors = function (r) {
      this.app.base &&
        setTimeout(function () {
          for (
            var t, e = document.querySelectorAll('a[href^="#"]'), o = 0;
            o < e.length;
            o++
          ) {
            var n = (t = e[o]).getAttribute("href");
            "#" === n.slice(0, 1) &&
              1 < n.length &&
              ((n =
                window.location.pathname + (window.location.search || "") + n),
              t.setAttribute("href", n));
          }
          "function" == typeof r && r();
        }, 50);
    }),
    (DocmaWeb.prototype.addFilter = function (t, e) {
      if (this.filterExists(t))
        throw new Error('Filter "' + t + '" already exists.');
      return (dust.filters[t] = e), this;
    }),
    (DocmaWeb.prototype.removeFilter = function (t) {
      return delete dust.filters[t], this;
    }),
    (DocmaWeb.prototype.filterExists = function (t) {
      return "function" == typeof dust.filters[t];
    }),
    (DocmaWeb.prototype.createRoute = function (t, e) {
      return new DocmaWeb.Route(this, t, e);
    }),
    (DocmaWeb.prototype.createRouteFromID = function (t) {
      if ("string" != typeof t)
        return (
          this.warn("Route ID is not a string: " + t),
          new DocmaWeb.Route(this, null)
        );
      var e = t.split(":");
      return new DocmaWeb.Route(this, e[1], e[0]);
    }),
    (DocmaWeb.prototype.createRouteFromQuery = function (t) {
      if (!t) return new DocmaWeb.Route(null);
      var e = t.split("&")[0].split("="),
        o = e[0].toLowerCase(),
        n = e[1];
      return new DocmaWeb.Route(this, n, o);
    }),
    (DocmaWeb.prototype._render = function (o, n) {
      var r = this;
      dust.render(o, this, function (t, e) {
        if (t)
          throw (
            (r.warn("Could not load Docma partial:", o),
            r.log("Compiled HTML: ", e),
            t)
          );
        r._loadCompiledContent(e), "function" == typeof n && n();
      });
    }),
    (DocmaWeb.prototype._triggerAfterRender = function () {
      this._trigger(DocmaWeb.Event.Render, [docma.currentRoute]),
        this._.initialLoad &&
          (this._trigger(DocmaWeb.Event.Ready), (this._.initialLoad = !1));
    }),
    (DocmaWeb.prototype._render404 = function (t, e) {
      this._.currentRoute = this.createRoute(null);
      var o = this;
      this._render(this._.partials.notFound, function () {
        if (
          (o._trigger(DocmaWeb.Event.Render, [null]),
          Utils.DOM.scrollTo(),
          "function" == typeof e)
        )
          return e(404);
        throw new Error(
          "Page or content not found for route: " + Utils._safeStringify(t),
        );
      });
    }),
    (DocmaWeb.prototype.fetch = function (e, o) {
      var n = new XMLHttpRequest(),
        r = this;
      (n.onreadystatechange = function () {
        if (4 === n.readyState) {
          var t = 200 === n.status ? n.responseText : "";
          return r.log("XHR GET:", n.status, e), o(n.status, t);
        }
      }),
        n.open("GET", e, !0),
        n.send();
    }),
    (DocmaWeb.prototype.render = function (o, n) {
      if (!o || !o.exists()) return this._render404(o, n);
      var r, i;
      o.isEqualTo(this.currentRoute) ||
        ((this._.currentRoute = o),
        (r = "function" == typeof n),
        (i = this),
        o.type === DocmaWeb.Route.Type.API
          ? this._render(this._.partials.api, function () {
              i._triggerAfterRender(),
                r && n(200),
                i._fixAnchors(function () {
                  Utils.DOM.scrollTo();
                });
            })
          : docma.fetch(o.contentPath, function (t, e) {
              return 404 === t
                ? i._render404(o, n)
                : void i._render(i._.partials.content, function () {
                    i.loadContent(e),
                      i._triggerAfterRender(),
                      r && n(t),
                      i._fixAnchors(function () {
                        Utils.DOM.scrollTo();
                      });
                  });
            }));
    }),
    (DocmaWeb.Utils = Utils);

  var _arrRouteTypes;
  (DocmaWeb.Route = function (t, e, o) {
    if (((this._docma = t), o && !(_arrRouteTypes.indexOf(o) < 0))) {
      if (e) t.app.routing.caseSensitive || (e = e.toLowerCase());
      else {
        if (o !== DocmaWeb.Route.Type.API) return;
        e = t._.defaultApiName;
      }
      var i = Utils._find(t.routes, { type: o, name: e });
      i && Utils._assign(this, i);
    }
  }),
    (DocmaWeb.Route.Type = { API: "api", CONTENT: "content" }),
    (_arrRouteTypes = Utils._values(DocmaWeb.Route.Type)),
    (DocmaWeb.Route.SourceType = { JS: "js", MD: "md", HTML: "html" }),
    (DocmaWeb.Route.prototype.exists = function () {
      return Boolean(this.id);
    }),
    (DocmaWeb.Route.prototype.isEqualTo = function (t) {
      return !!(t && t.exists() && this.exists()) && t.path === this.path;
    }),
    (DocmaWeb.Route.prototype.isCurrent = function () {
      return this.isEqualTo(this._docma.currentRoute);
    }),
    (DocmaWeb.Route.prototype.apply = function (t) {
      return (
        this.type === DocmaWeb.Route.Type.API
          ? ((this._docma._.documentation = this._docma.apis[
              this.name
            ].documentation),
            (this._docma._.symbols = this._docma.apis[this.name].symbols))
          : ((this._docma._.documentation = null),
            (this._docma._.symbols = null)),
        this._docma._trigger(DocmaWeb.Event.Route, [
          this.exists() ? this : null,
        ]),
        this._docma.render(this, t),
        this
      );
    }),
    (DocmaWeb.Route.prototype.toString = function () {
      var e = this.toJSON();
      return Object.keys(e)
        .map(function (t) {
          return t + ": " + e[t];
        })
        .join(", ");
    }),
    (DocmaWeb.Route.prototype.toJSON = function () {
      return {
        id: this.id,
        contentPath: this.contentPath,
        path: this.path,
        type: this.type,
        sourceType: this.sourceType,
        name: this.name,
      };
    });

  (dust.filters = dust.filters || {}),
    (dust.filters.$pt = function (e) {
      return DocmaWeb.Utils.parseTicks(e);
    }),
    (dust.filters.$pnl = function (e) {
      return DocmaWeb.Utils.parseNewLines(e, { keepIfSingle: !0 });
    }),
    (dust.filters.$pl = function (e) {
      return DocmaWeb.Utils.parseLinks(e);
    }),
    (dust.filters.$tl = function (e) {
      return DocmaWeb.Utils.trimLeft(e);
    }),
    (dust.filters.$tnl = function (e) {
      return DocmaWeb.Utils.trimNewLines(e);
    }),
    (dust.filters.$p = function (e) {
      return DocmaWeb.Utils.parse(e, { keepIfSingle: !0 });
    }),
    (dust.filters.$nt = function (e) {
      return DocmaWeb.Utils.normalizeTabs(e);
    }),
    (dust.filters.$desc = function (e) {
      return DocmaWeb.Utils.parse(e.classdesc || e.description || "");
    });
  var reJSValues = /true|false|null|undefined|Infinity|NaN|\d+|Number\.\w+|Math\.(PI|E|LN(2|10)|LOG(2|10)E|SQRT(1_)?2)|\[.*?]|\{.*?}|new [a-zA-Z]+.*|\/.+\/[gmiu]*|Date\.(now\(\)|UTC\(.*)|window|document/;
  function getFormatValue(e, t) {
    if (
      (arguments.length < 2 &&
        (t = DocmaWeb.Utils.notate(e, "meta.code.value") || e.defaultvalue),
      "string" != typeof t)
    )
      return String(t);
    var n = DocmaWeb.Utils.notate(e, "type.names") || [];
    return !/['"`]/.test(t.slice(0, 1)) &&
      0 <= n.indexOf("String") &&
      (1 === n.length || -1 === reJSValues.indexOf(t))
      ? '"' + t + '"'
      : String(t);
  }
  (dust.filters.$def = function (e) {
    return e.hasOwnProperty("defaultvalue")
      ? getFormatValue(e, e.defaultvalue)
      : "undefined";
  }),
    (dust.filters.$val = function (e) {
      return getFormatValue(e);
    }),
    (dust.filters.$id = function (e) {
      return ("string" == typeof e
        ? e
        : (DocmaWeb.Utils.isConstructor(e) ? "new-" : "") + e.$longname
      ).replace(/ /g, "-");
    });

  DocmaWeb.version = "3.2.2";
  return DocmaWeb;
})();
var docma = Object.freeze(
  new DocmaWeb({
    version: "3.2.2",
    routes: [
      {
        id: "api:",
        type: "api",
        name: "_def_",
        path: "?api",
        contentPath: null,
        sourceType: "js",
      },
      {
        id: "content:readme",
        type: "content",
        name: "readme",
        path: "?content=readme",
        contentPath: "content/readme.html",
        sourceType: "md",
      },
    ],
    apis: {
      _def_: {
        documentation: [
          {
            comment:
              "/**\n * A module for bouncerJs micro-WebSocket starter.\n * @module BouncerJS\n */",
            meta: {
              filename: "index.js",
              lineno: 1,
              columnno: 0,
              path: "C:\\projects\\bouncer.js",
              code: {},
            },
            description: "A module for bouncerJs micro-WebSocket starter.",
            kind: "module",
            name: "BouncerJS",
            longname: "module:BouncerJS",
            $longname: "BouncerJS",
            $kind: "module",
            $docmaLink: "?api#BouncerJS",
            $members: [
              {
                comment:
                  "/**\n * @desc this is the default export\n * @param {BouncerConfig} userConfig\n * @returns {BouncerCallResult}\n */",
                meta: {
                  range: [324, 2331],
                  filename: "index.js",
                  lineno: 15,
                  columnno: 6,
                  path: "C:\\projects\\bouncer.js",
                  code: {
                    id: "astnode100000358",
                    name: "bouncerJs",
                    type: "ArrowFunctionExpression",
                  },
                  vars: {
                    rooms: "module:BouncerJS~bouncerJs~rooms",
                    config: "module:BouncerJS~bouncerJs~config",
                    ssl: "module:BouncerJS~bouncerJs~ssl",
                    undefined: null,
                    start: "module:BouncerJS~bouncerJs~start",
                    bouncer: "module:BouncerJS~bouncerJs~bouncer",
                    "": null,
                  },
                },
                description: "this is the default export",
                params: [
                  { type: { names: ["BouncerConfig"] }, name: "userConfig" },
                ],
                returns: [{ type: { names: ["BouncerCallResult"] } }],
                name: "bouncerJs",
                longname: "module:BouncerJS~bouncerJs",
                kind: "function",
                scope: "inner",
                memberof: "module:BouncerJS",
                $longname: "BouncerJS~bouncerJs",
                $kind: "method",
                $docmaLink: "?api#BouncerJS~bouncerJs",
              },
              {
                comment:
                  "/**\n       * @desc this is Leave room and broadcast leave event\n       * @param {WebSocket} ws\n       */",
                meta: {
                  range: [969, 1217],
                  filename: "index.js",
                  lineno: 39,
                  columnno: 6,
                  path: "C:\\projects\\bouncer.js",
                  code: {
                    id: "astnode100000452",
                    name: "close",
                    type: "ArrowFunctionExpression",
                  },
                  vars: { undefined: null },
                },
                description: "this is Leave room and broadcast leave event",
                params: [{ type: { names: ["WebSocket"] }, name: "ws" }],
                name: "close",
                longname: "module:BouncerJS~close",
                kind: "function",
                scope: "inner",
                memberof: "module:BouncerJS",
                $longname: "BouncerJS~close",
                $kind: "method",
                $docmaLink: "?api#BouncerJS~close",
              },
              {
                comment:
                  "/**\n       * @desc this is Join + run plugins + leave\n       * @param {WebSocket} ws\n       * @param {ArrayBuffer} message\n       */",
                meta: {
                  range: [1364, 1875],
                  filename: "index.js",
                  lineno: 55,
                  columnno: 6,
                  path: "C:\\projects\\bouncer.js",
                  code: {
                    id: "astnode100000496",
                    name: "message",
                    type: "ArrowFunctionExpression",
                  },
                  vars: {
                    utf8: "module:BouncerJS~message~utf8",
                    undefined: null,
                  },
                },
                description: "this is Join + run plugins + leave",
                params: [
                  { type: { names: ["WebSocket"] }, name: "ws" },
                  { type: { names: ["ArrayBuffer"] }, name: "message" },
                ],
                name: "message",
                longname: "module:BouncerJS~message",
                kind: "function",
                scope: "inner",
                memberof: "module:BouncerJS",
                $longname: "BouncerJS~message",
                $kind: "method",
                $docmaLink: "?api#BouncerJS~message",
              },
            ],
          },
          {
            comment:
              "/**\n * A module for bouncerJs API helper functions.\n * @module BouncerJSAPIFactory\n */",
            meta: {
              filename: "api.js",
              lineno: 1,
              columnno: 0,
              path: "C:\\projects\\bouncer.js",
              code: {},
            },
            description: "A module for bouncerJs API helper functions.",
            kind: "module",
            name: "BouncerJSAPIFactory",
            longname: "module:BouncerJSAPIFactory",
            $longname: "BouncerJSAPIFactory",
            $kind: "module",
            $docmaLink: "?api#BouncerJSAPIFactory",
          },
          {
            comment:
              "/**\n * @typedef {BouncerMessageObject} Object\n * @desc each message in backend will have this as a parameter\n * @property {string} id origin socket id\n * @property {string} event event name\n * @property {string|object} data message payload\n */",
            meta: {
              filename: "types.js",
              lineno: 1,
              columnno: 0,
              path: "C:\\projects\\bouncer.js",
              code: {},
            },
            kind: "typedef",
            name: "Object",
            type: { names: ["BouncerMessageObject"] },
            description:
              "each message in backend will have this as a parameter",
            properties: [
              {
                type: { names: ["string"] },
                description: "origin socket id",
                name: "id",
              },
              {
                type: { names: ["string"] },
                description: "event name",
                name: "event",
              },
              {
                type: { names: ["string", "object"] },
                description: "message payload",
                name: "data",
              },
            ],
            longname: "Object",
            scope: "global",
            $longname: "Object",
            $kind: "typedef",
            $docmaLink: "?api#Object",
          },
          {
            comment:
              "/**\n * @typedef {BouncerConfig} Object\n * @desc This is what the export eats\n * @property {boolean} debug false\n * @property {string} LOGO :)\n * @property {number} port 1337\n * @property {string} join /join\n * @property {string} leave /leave\n * @property {function} createSocketId () => string\n * @property {Object} plugins { function chat() {} }\n * @property {uWebSockets.App|uWebSockets.SSLApp} router\n */",
            meta: {
              filename: "types.js",
              lineno: 9,
              columnno: 0,
              path: "C:\\projects\\bouncer.js",
              code: {},
            },
            kind: "typedef",
            name: "Object",
            type: { names: ["BouncerConfig"] },
            description: "This is what the export eats",
            properties: [
              {
                type: { names: ["boolean"] },
                description: "false",
                name: "debug",
              },
              { type: { names: ["string"] }, description: ":)", name: "LOGO" },
              {
                type: { names: ["number"] },
                description: "1337",
                name: "port",
              },
              {
                type: { names: ["string"] },
                description: "/join",
                name: "join",
              },
              {
                type: { names: ["string"] },
                description: "/leave",
                name: "leave",
              },
              {
                type: { names: ["function"] },
                description: "() => string",
                name: "createSocketId",
              },
              {
                type: { names: ["Object"] },
                description: "{ function chat() {} }",
                name: "plugins",
              },
              {
                type: { names: ["uWebSockets.App", "uWebSockets.SSLApp"] },
                name: "router",
              },
            ],
            longname: "Object",
            scope: "global",
            $longname: "Object",
            $kind: "typedef",
            $docmaLink: "?api#Object",
          },
          {
            comment:
              "/**\n * @typedef {BouncerCallResult} Object\n * @desc This is what the export returns (api)\n * @property {function} join (WebSocket, string) => boolean\n * @property {function} leave (WebSocket) => boolean\n * @property {function} ({ topic: string }, BouncerMessageObject) => void\n * @property {function} send (WebSocket, BouncerMessageObject) => void\n * @property {uWebSockets.App|uWebSockets.SSLApp} router\n * @property {BouncerConfig} config\n * @property {Map} rooms\n */",
            meta: {
              filename: "types.js",
              lineno: 22,
              columnno: 0,
              path: "C:\\projects\\bouncer.js",
              code: {},
            },
            kind: "typedef",
            name: "Object",
            type: { names: ["BouncerCallResult"] },
            description: "This is what the export returns (api)",
            properties: [
              {
                type: { names: ["function"] },
                description: "(WebSocket, string) => boolean",
                name: "join",
              },
              {
                type: { names: ["function"] },
                description: "(WebSocket) => boolean",
                name: "leave",
              },
              {
                type: { names: ["function"] },
                description: "topic: string }, BouncerMessageObject) => void",
                name: "({",
              },
              {
                type: { names: ["function"] },
                description: "(WebSocket, BouncerMessageObject) => void",
                name: "send",
              },
              {
                type: { names: ["uWebSockets.App", "uWebSockets.SSLApp"] },
                name: "router",
              },
              { type: { names: ["BouncerConfig"] }, name: "config" },
              { type: { names: ["Map"] }, name: "rooms" },
            ],
            longname: "Object",
            scope: "global",
            $longname: "Object",
            $kind: "typedef",
            $docmaLink: "?api#Object",
          },
        ],
        symbols: [
          "BouncerJS",
          "BouncerJS~bouncerJs",
          "BouncerJS~close",
          "BouncerJS~message",
          "BouncerJSAPIFactory",
          "Object",
          "Object",
          "Object",
        ],
      },
    },
    app: {
      title: "",
      meta: null,
      base: "/",
      entrance: "api",
      routing: { method: "query", caseSensitive: true },
      server: "static",
      favicon: "",
    },
    template: {
      name: "docma-template-zebra",
      description:
        "Zebra - Default template for Docma. https://github.com/onury/docma",
      version: "2.3.1",
      supportedDocmaVersion: ">=2.0.0",
      author: "Onur Yıldırım",
      license: "MIT",
      mainHTML: "index.html",
      options: {
        title: { label: "Documentation", href: "#" },
        logo: null,
        sidebar: {
          enabled: true,
          outline: "tree",
          collapsed: false,
          toolbar: true,
          itemsFolded: false,
          itemsOverflow: "crop",
          badges: true,
          search: true,
          animations: true,
        },
        symbols: {
          autoLink: true,
          params: "list",
          enums: "list",
          props: "list",
          meta: false,
        },
        contentView: { bookmarks: false, faVersion: "5.5.0", faLibs: "all" },
        navbar: {
          enabled: true,
          fixed: true,
          dark: false,
          animations: true,
          menu: [],
        },
      },
    },
    partials: {
      api: "docma-api",
      content: "docma-content",
      notFound: "docma-404",
    },
    elementID: "docma-main",
    contentElementID: "docma-content",
    defaultApiName: "_def_",
    logsEnabled: false,
  }),
);

!(function () {
  "use strict";
  var r = "path" === docma.app.routing.method;
  function n(a) {
    return (a.params[1] || "").replace(/\/$/, "");
  }
  function a(a, e) {
    var o = n(a) || docma._.defaultApiName,
      t = docma.createRoute(o, DocmaWeb.Route.Type.API);
    if (!t || !t.exists()) return e();
    t.apply();
  }
  docma.app.base && page.base(docma.app.base),
    page.redirect("(/)?" + docma.template.main, ""),
    r &&
      (page("(/)?api/(.+)", a),
      page("(/)?api(/)?", a),
      page("(/)?(.*)", function (a, e) {
        var o = n(a),
          t = docma.createRoute(o, DocmaWeb.Route.Type.CONTENT);
        if (!t || !t.exists()) return e();
        t.apply();
      })),
    page("(/)?", function (c, i) {
      !(function () {
        if (r) {
          var a = sessionStorage.getItem("redirectPath") || null;
          if (a)
            return (
              sessionStorage.removeItem("redirectPath"),
              docma.info("Redirecting to:", a),
              page.redirect(a),
              1
            );
        }
      })() &&
        setTimeout(function () {
          var a,
            e,
            o,
            t =
              ((e = c.querystring),
              (o = e || window.location.search),
              /^[?&]/.test(o) && (o = o.slice(1)),
              o || null);
          if (r) {
            if (t) return i();
            a = docma._.appEntranceRI;
          } else docma.log("Query-string:", t), (a = t ? docma.createRouteFromQuery(t) : docma._.appEntranceRI);
          if (!a || !a.exists()) return i();
          function n() {
            docma._trigger(DocmaWeb.Event.Navigate, [a]);
          }
          a.isCurrent()
            ? n()
            : a.apply(function (a) {
                200 === a && n();
              });
        }, 100);
    }),
    page("*", function (a) {
      docma.warn("Unknown Route:", a.path),
        docma.log("context:", a),
        docma.createRoute(null).apply();
    }),
    docma.info("Docma SPA Configuration:"),
    docma.info("App Title:          ", docma.app.title),
    docma.info("Routing Method:     ", docma.app.routing.method),
    docma.info("App Server:         ", docma.app.server),
    docma.info("Base Path:          ", docma.app.base),
    docma.info("Entrance Route ID:  ", docma.app.entrance),
    (window.onload = function () {
      (docma._.initialLoad = !0),
        (docma._.appEntranceRI = docma.createRouteFromID(docma.app.entrance)),
        page.start({
          click: !0,
          popstate: !0,
          dispatch: !0,
          hashbang: !1,
          decodeURLComponents: !0,
        }),
        docma.info("Docma SPA loaded!");
    });
})();
