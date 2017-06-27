// if called as a worker thread, set up a run loop for the Physics object and bail out
var trbl = null;
var _newBounds = null;

if (typeof(window) == 'undefined')
return (function() {
    /* hermetic.js */
    $ = {
        each: function(d, e) {
            if ($.isArray(d)) {
                for (var c = 0, b = d.length; c < b; c++) {
                    e(c, d[c])
                }
            } else {
                for (var a in d) {
                    e(a, d[a])
                }
            }
        },
        map: function(a, c) {
            var b = [];
            $.each(a, function(f, e) {
                var d = c(e);
                if (d !== undefined) {
                    b.push(d)
                }
            });
            return b
        },
        extend: function(c, b) {
            if (typeof b != "object") {
                return c
            }
            for (var a in b) {
                if (b.hasOwnProperty(a)) {
                    c[a] = b[a]
                }
            }
            return c
        },
        isArray: function(a) {
            if (!a) {
                return false
            }
            return (a.constructor.toString().indexOf("Array") != -1)
        },
        inArray: function(c, a) {
            for (var d = 0, b = a.length; d < b; d++) {
                if (a[d] === c) {
                    return d
                }
            }
            return -1
        },
        isEmptyObject: function(a) {
            if (typeof a !== "object") {
                return false
            }
            var b = true;
            $.each(a, function(c, d) {
                b = false
            });
            return b
        },
    };
    /*     worker.js */
    var PhysicsWorker = function() {
        var b = 20;
        var a = null;
        var d = null;
        var c = null;
        var g = [];
        var f = new Date().valueOf();
        var e = {
            init: function(h) {
                e.timeout(h.timeout);
                a = Physics(h.dt, h.stiffness, h.repulsion, h.friction, e.tock);
                return e
            },
            timeout: function(h) {
                if (h != b) {
                    b = h;
                    if (d !== null) {
                        e.stop();
                        e.go()
                    }
                }
            },
            go: function() {
                if (d !== null) {
                    return
                }
                c = null;
                d = setInterval(e.tick, b)
            },
            stop: function() {
                if (d === null) {
                    return
                }
                clearInterval(d);
                d = null
            },
            tick: function() {
                a.tick();
                var h = a.systemEnergy();
                if ((h.mean + h.max) / 2 < 0.05) {
                    if (c === null) {
                        c = new Date().valueOf()
                    }
                    if (new Date().valueOf() - c > 1000) {
                        e.stop()
                    } else {}
                } else {
                    c = null
                }
            },
            tock: function(h) {
                h.type = "geometry";
                postMessage(h)
            },
            modifyNode: function(i, h) {
                a.modifyNode(i, h);
                e.go()
            },
            modifyPhysics: function(h) {
                a.modifyPhysics(h)
            },
            update: function(h) {
                var i = a._update(h)
            }
        };
        return e
    };
    var physics = PhysicsWorker();
    onmessage = function(a) {
        if (!a.data.type) {
            postMessage("¿kérnèl?");
            return
        }
        if (a.data.type == "physics") {
            var b = a.data.physics;
            physics.init(a.data.physics);
            return
        }
        switch (a.data.type) {
            case "modify":
                physics.modifyNode(a.data.id, a.data.mods);
                break;
            case "changes":
                physics.update(a.data.changes);
                physics.go();
                break;
            case "start":
                physics.go();
                break;
            case "stop":
                physics.stop();
                break;
            case "sys":
                var b = a.data.param || {};
                if (!isNaN(b.timeout)) {
                    physics.timeout(b.timeout)
                }
                physics.modifyPhysics(b);
                physics.go();
                break
        }
    };
})()

window.arbor = (typeof(arbor) !== 'undefined') ? arbor : {}
arbor = Object.assign({}, {
    // object constructors (don't use ‘new’, just call them)
    ParticleSystem: ParticleSystem,
    Point: function(x, y) {
        return new Point(x, y)
    },

    // immutable object with useful methods
    etc: {
        trace: trace, // ƒ(msg) -> safe console logging
        dirname: dirname, // ƒ(path) -> leading part of path
        basename: basename, // ƒ(path) -> trailing part of path
        ordinalize: ordinalize, // ƒ(num) -> abbrev integers (and add commas)
        objcopy: objcopy, // ƒ(old) -> clone an object
        objcmp: objcmp, // ƒ(a, b, strict_ordering) -> t/f comparison
        objkeys: objkeys, // ƒ(obj) -> array of all keys in obj
        objmerge: objmerge, // ƒ(dst, src) -> like $.extend but non-destructive
        uniq: uniq, // ƒ(arr) -> array of unique items in arr
        arbor_path: arbor_path, // ƒ() -> guess the directory of the lib code
    }
})
