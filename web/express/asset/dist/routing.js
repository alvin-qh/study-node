var bt = "top", Lt = "bottom", $t = "right", Tt = "left", gi = "auto", vn = [bt, Lt, $t, Tt], We = "start", fn = "end", Gs = "clippingParents", pr = "viewport", an = "popper", Xs = "reference", ar = /* @__PURE__ */ vn.reduce(function(a, e) {
  return a.concat([e + "-" + We, e + "-" + fn]);
}, []), gr = /* @__PURE__ */ [].concat(vn, [gi]).reduce(function(a, e) {
  return a.concat([e, e + "-" + We, e + "-" + fn]);
}, []), Qs = "beforeRead", Js = "read", Zs = "afterRead", to = "beforeMain", eo = "main", no = "afterMain", io = "beforeWrite", ro = "write", so = "afterWrite", oo = [Qs, Js, Zs, to, eo, no, io, ro, so];
function ee(a) {
  return a ? (a.nodeName || "").toLowerCase() : null;
}
function It(a) {
  if (a == null)
    return window;
  if (a.toString() !== "[object Window]") {
    var e = a.ownerDocument;
    return e && e.defaultView || window;
  }
  return a;
}
function qe(a) {
  var e = It(a).Element;
  return a instanceof e || a instanceof Element;
}
function jt(a) {
  var e = It(a).HTMLElement;
  return a instanceof e || a instanceof HTMLElement;
}
function mr(a) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = It(a).ShadowRoot;
  return a instanceof e || a instanceof ShadowRoot;
}
function Va(a) {
  var e = a.state;
  Object.keys(e.elements).forEach(function(r) {
    var f = e.styles[r] || {}, p = e.attributes[r] || {}, v = e.elements[r];
    !jt(v) || !ee(v) || (Object.assign(v.style, f), Object.keys(p).forEach(function(E) {
      var w = p[E];
      w === !1 ? v.removeAttribute(E) : v.setAttribute(E, w === !0 ? "" : w);
    }));
  });
}
function Wa(a) {
  var e = a.state, r = {
    popper: {
      position: e.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(e.elements.popper.style, r.popper), e.styles = r, e.elements.arrow && Object.assign(e.elements.arrow.style, r.arrow), function() {
    Object.keys(e.elements).forEach(function(f) {
      var p = e.elements[f], v = e.attributes[f] || {}, E = Object.keys(e.styles.hasOwnProperty(f) ? e.styles[f] : r[f]), w = E.reduce(function(x, R) {
        return x[R] = "", x;
      }, {});
      !jt(p) || !ee(p) || (Object.assign(p.style, w), Object.keys(v).forEach(function(x) {
        p.removeAttribute(x);
      }));
    });
  };
}
const _r = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: Va,
  effect: Wa,
  requires: ["computeStyles"]
};
function Zt(a) {
  return a.split("-")[0];
}
var Ve = Math.max, fi = Math.min, dn = Math.round;
function ur() {
  var a = navigator.userAgentData;
  return a != null && a.brands && Array.isArray(a.brands) ? a.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function ao() {
  return !/^((?!chrome|android).)*safari/i.test(ur());
}
function hn(a, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !1);
  var f = a.getBoundingClientRect(), p = 1, v = 1;
  e && jt(a) && (p = a.offsetWidth > 0 && dn(f.width) / a.offsetWidth || 1, v = a.offsetHeight > 0 && dn(f.height) / a.offsetHeight || 1);
  var E = qe(a) ? It(a) : window, w = E.visualViewport, x = !ao() && r, R = (f.left + (x && w ? w.offsetLeft : 0)) / p, D = (f.top + (x && w ? w.offsetTop : 0)) / v, F = f.width / p, X = f.height / v;
  return {
    width: F,
    height: X,
    top: D,
    right: R + F,
    bottom: D + X,
    left: R,
    x: R,
    y: D
  };
}
function vr(a) {
  var e = hn(a), r = a.offsetWidth, f = a.offsetHeight;
  return Math.abs(e.width - r) <= 1 && (r = e.width), Math.abs(e.height - f) <= 1 && (f = e.height), {
    x: a.offsetLeft,
    y: a.offsetTop,
    width: r,
    height: f
  };
}
function uo(a, e) {
  var r = e.getRootNode && e.getRootNode();
  if (a.contains(e))
    return !0;
  if (r && mr(r)) {
    var f = e;
    do {
      if (f && a.isSameNode(f))
        return !0;
      f = f.parentNode || f.host;
    } while (f);
  }
  return !1;
}
function de(a) {
  return It(a).getComputedStyle(a);
}
function qa(a) {
  return ["table", "td", "th"].indexOf(ee(a)) >= 0;
}
function Se(a) {
  return ((qe(a) ? a.ownerDocument : (
    // $FlowFixMe[prop-missing]
    a.document
  )) || window.document).documentElement;
}
function mi(a) {
  return ee(a) === "html" ? a : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    a.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    a.parentNode || // DOM Element detected
    (mr(a) ? a.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Se(a)
  );
}
function ds(a) {
  return !jt(a) || // https://github.com/popperjs/popper-core/issues/837
  de(a).position === "fixed" ? null : a.offsetParent;
}
function Fa(a) {
  var e = /firefox/i.test(ur()), r = /Trident/i.test(ur());
  if (r && jt(a)) {
    var f = de(a);
    if (f.position === "fixed")
      return null;
  }
  var p = mi(a);
  for (mr(p) && (p = p.host); jt(p) && ["html", "body"].indexOf(ee(p)) < 0; ) {
    var v = de(p);
    if (v.transform !== "none" || v.perspective !== "none" || v.contain === "paint" || ["transform", "perspective"].indexOf(v.willChange) !== -1 || e && v.willChange === "filter" || e && v.filter && v.filter !== "none")
      return p;
    p = p.parentNode;
  }
  return null;
}
function Rn(a) {
  for (var e = It(a), r = ds(a); r && qa(r) && de(r).position === "static"; )
    r = ds(r);
  return r && (ee(r) === "html" || ee(r) === "body" && de(r).position === "static") ? e : r || Fa(a) || e;
}
function yr(a) {
  return ["top", "bottom"].indexOf(a) >= 0 ? "x" : "y";
}
function kn(a, e, r) {
  return Ve(a, fi(e, r));
}
function Ba(a, e, r) {
  var f = kn(a, e, r);
  return f > r ? r : f;
}
function co() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function lo(a) {
  return Object.assign({}, co(), a);
}
function fo(a, e) {
  return e.reduce(function(r, f) {
    return r[f] = a, r;
  }, {});
}
var Ka = function(e, r) {
  return e = typeof e == "function" ? e(Object.assign({}, r.rects, {
    placement: r.placement
  })) : e, lo(typeof e != "number" ? e : fo(e, vn));
};
function Ya(a) {
  var e, r = a.state, f = a.name, p = a.options, v = r.elements.arrow, E = r.modifiersData.popperOffsets, w = Zt(r.placement), x = yr(w), R = [Tt, $t].indexOf(w) >= 0, D = R ? "height" : "width";
  if (!(!v || !E)) {
    var F = Ka(p.padding, r), X = vr(v), B = x === "y" ? bt : Tt, M = x === "y" ? Lt : $t, $ = r.rects.reference[D] + r.rects.reference[x] - E[x] - r.rects.popper[D], J = E[x] - r.rects.reference[x], P = Rn(v), ct = P ? x === "y" ? P.clientHeight || 0 : P.clientWidth || 0 : 0, ut = $ / 2 - J / 2, G = F[B], rt = ct - X[D] - F[M], st = ct / 2 - X[D] / 2 + ut, o = kn(G, st, rt), ft = x;
    r.modifiersData[f] = (e = {}, e[ft] = o, e.centerOffset = o - st, e);
  }
}
function Ua(a) {
  var e = a.state, r = a.options, f = r.element, p = f === void 0 ? "[data-popper-arrow]" : f;
  p != null && (typeof p == "string" && (p = e.elements.popper.querySelector(p), !p) || uo(e.elements.popper, p) && (e.elements.arrow = p));
}
const ho = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: Ya,
  effect: Ua,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function pn(a) {
  return a.split("-")[1];
}
var za = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function Ga(a, e) {
  var r = a.x, f = a.y, p = e.devicePixelRatio || 1;
  return {
    x: dn(r * p) / p || 0,
    y: dn(f * p) / p || 0
  };
}
function hs(a) {
  var e, r = a.popper, f = a.popperRect, p = a.placement, v = a.variation, E = a.offsets, w = a.position, x = a.gpuAcceleration, R = a.adaptive, D = a.roundOffsets, F = a.isFixed, X = E.x, B = X === void 0 ? 0 : X, M = E.y, $ = M === void 0 ? 0 : M, J = typeof D == "function" ? D({
    x: B,
    y: $
  }) : {
    x: B,
    y: $
  };
  B = J.x, $ = J.y;
  var P = E.hasOwnProperty("x"), ct = E.hasOwnProperty("y"), ut = Tt, G = bt, rt = window;
  if (R) {
    var st = Rn(r), o = "clientHeight", ft = "clientWidth";
    if (st === It(r) && (st = Se(r), de(st).position !== "static" && w === "absolute" && (o = "scrollHeight", ft = "scrollWidth")), st = st, p === bt || (p === Tt || p === $t) && v === fn) {
      G = Lt;
      var U = F && st === rt && rt.visualViewport ? rt.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        st[o]
      );
      $ -= U - f.height, $ *= x ? 1 : -1;
    }
    if (p === Tt || (p === bt || p === Lt) && v === fn) {
      ut = $t;
      var dt = F && st === rt && rt.visualViewport ? rt.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        st[ft]
      );
      B -= dt - f.width, B *= x ? 1 : -1;
    }
  }
  var gt = Object.assign({
    position: w
  }, R && za), Nt = D === !0 ? Ga({
    x: B,
    y: $
  }, It(r)) : {
    x: B,
    y: $
  };
  if (B = Nt.x, $ = Nt.y, x) {
    var z;
    return Object.assign({}, gt, (z = {}, z[G] = ct ? "0" : "", z[ut] = P ? "0" : "", z.transform = (rt.devicePixelRatio || 1) <= 1 ? "translate(" + B + "px, " + $ + "px)" : "translate3d(" + B + "px, " + $ + "px, 0)", z));
  }
  return Object.assign({}, gt, (e = {}, e[G] = ct ? $ + "px" : "", e[ut] = P ? B + "px" : "", e.transform = "", e));
}
function Xa(a) {
  var e = a.state, r = a.options, f = r.gpuAcceleration, p = f === void 0 ? !0 : f, v = r.adaptive, E = v === void 0 ? !0 : v, w = r.roundOffsets, x = w === void 0 ? !0 : w, R = {
    placement: Zt(e.placement),
    variation: pn(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: p,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, hs(Object.assign({}, R, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: E,
    roundOffsets: x
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, hs(Object.assign({}, R, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: x
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const Er = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Xa,
  data: {}
};
var ti = {
  passive: !0
};
function Qa(a) {
  var e = a.state, r = a.instance, f = a.options, p = f.scroll, v = p === void 0 ? !0 : p, E = f.resize, w = E === void 0 ? !0 : E, x = It(e.elements.popper), R = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return v && R.forEach(function(D) {
    D.addEventListener("scroll", r.update, ti);
  }), w && x.addEventListener("resize", r.update, ti), function() {
    v && R.forEach(function(D) {
      D.removeEventListener("scroll", r.update, ti);
    }), w && x.removeEventListener("resize", r.update, ti);
  };
}
const br = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: Qa,
  data: {}
};
var Ja = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function ai(a) {
  return a.replace(/left|right|bottom|top/g, function(e) {
    return Ja[e];
  });
}
var Za = {
  start: "end",
  end: "start"
};
function ps(a) {
  return a.replace(/start|end/g, function(e) {
    return Za[e];
  });
}
function Tr(a) {
  var e = It(a), r = e.pageXOffset, f = e.pageYOffset;
  return {
    scrollLeft: r,
    scrollTop: f
  };
}
function Ar(a) {
  return hn(Se(a)).left + Tr(a).scrollLeft;
}
function tu(a, e) {
  var r = It(a), f = Se(a), p = r.visualViewport, v = f.clientWidth, E = f.clientHeight, w = 0, x = 0;
  if (p) {
    v = p.width, E = p.height;
    var R = ao();
    (R || !R && e === "fixed") && (w = p.offsetLeft, x = p.offsetTop);
  }
  return {
    width: v,
    height: E,
    x: w + Ar(a),
    y: x
  };
}
function eu(a) {
  var e, r = Se(a), f = Tr(a), p = (e = a.ownerDocument) == null ? void 0 : e.body, v = Ve(r.scrollWidth, r.clientWidth, p ? p.scrollWidth : 0, p ? p.clientWidth : 0), E = Ve(r.scrollHeight, r.clientHeight, p ? p.scrollHeight : 0, p ? p.clientHeight : 0), w = -f.scrollLeft + Ar(a), x = -f.scrollTop;
  return de(p || r).direction === "rtl" && (w += Ve(r.clientWidth, p ? p.clientWidth : 0) - v), {
    width: v,
    height: E,
    x: w,
    y: x
  };
}
function wr(a) {
  var e = de(a), r = e.overflow, f = e.overflowX, p = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(r + p + f);
}
function po(a) {
  return ["html", "body", "#document"].indexOf(ee(a)) >= 0 ? a.ownerDocument.body : jt(a) && wr(a) ? a : po(mi(a));
}
function Pn(a, e) {
  var r;
  e === void 0 && (e = []);
  var f = po(a), p = f === ((r = a.ownerDocument) == null ? void 0 : r.body), v = It(f), E = p ? [v].concat(v.visualViewport || [], wr(f) ? f : []) : f, w = e.concat(E);
  return p ? w : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    w.concat(Pn(mi(E)))
  );
}
function cr(a) {
  return Object.assign({}, a, {
    left: a.x,
    top: a.y,
    right: a.x + a.width,
    bottom: a.y + a.height
  });
}
function nu(a, e) {
  var r = hn(a, !1, e === "fixed");
  return r.top = r.top + a.clientTop, r.left = r.left + a.clientLeft, r.bottom = r.top + a.clientHeight, r.right = r.left + a.clientWidth, r.width = a.clientWidth, r.height = a.clientHeight, r.x = r.left, r.y = r.top, r;
}
function gs(a, e, r) {
  return e === pr ? cr(tu(a, r)) : qe(e) ? nu(e, r) : cr(eu(Se(a)));
}
function iu(a) {
  var e = Pn(mi(a)), r = ["absolute", "fixed"].indexOf(de(a).position) >= 0, f = r && jt(a) ? Rn(a) : a;
  return qe(f) ? e.filter(function(p) {
    return qe(p) && uo(p, f) && ee(p) !== "body";
  }) : [];
}
function ru(a, e, r, f) {
  var p = e === "clippingParents" ? iu(a) : [].concat(e), v = [].concat(p, [r]), E = v[0], w = v.reduce(function(x, R) {
    var D = gs(a, R, f);
    return x.top = Ve(D.top, x.top), x.right = fi(D.right, x.right), x.bottom = fi(D.bottom, x.bottom), x.left = Ve(D.left, x.left), x;
  }, gs(a, E, f));
  return w.width = w.right - w.left, w.height = w.bottom - w.top, w.x = w.left, w.y = w.top, w;
}
function go(a) {
  var e = a.reference, r = a.element, f = a.placement, p = f ? Zt(f) : null, v = f ? pn(f) : null, E = e.x + e.width / 2 - r.width / 2, w = e.y + e.height / 2 - r.height / 2, x;
  switch (p) {
    case bt:
      x = {
        x: E,
        y: e.y - r.height
      };
      break;
    case Lt:
      x = {
        x: E,
        y: e.y + e.height
      };
      break;
    case $t:
      x = {
        x: e.x + e.width,
        y: w
      };
      break;
    case Tt:
      x = {
        x: e.x - r.width,
        y: w
      };
      break;
    default:
      x = {
        x: e.x,
        y: e.y
      };
  }
  var R = p ? yr(p) : null;
  if (R != null) {
    var D = R === "y" ? "height" : "width";
    switch (v) {
      case We:
        x[R] = x[R] - (e[D] / 2 - r[D] / 2);
        break;
      case fn:
        x[R] = x[R] + (e[D] / 2 - r[D] / 2);
        break;
    }
  }
  return x;
}
function gn(a, e) {
  e === void 0 && (e = {});
  var r = e, f = r.placement, p = f === void 0 ? a.placement : f, v = r.strategy, E = v === void 0 ? a.strategy : v, w = r.boundary, x = w === void 0 ? Gs : w, R = r.rootBoundary, D = R === void 0 ? pr : R, F = r.elementContext, X = F === void 0 ? an : F, B = r.altBoundary, M = B === void 0 ? !1 : B, $ = r.padding, J = $ === void 0 ? 0 : $, P = lo(typeof J != "number" ? J : fo(J, vn)), ct = X === an ? Xs : an, ut = a.rects.popper, G = a.elements[M ? ct : X], rt = ru(qe(G) ? G : G.contextElement || Se(a.elements.popper), x, D, E), st = hn(a.elements.reference), o = go({
    reference: st,
    element: ut,
    strategy: "absolute",
    placement: p
  }), ft = cr(Object.assign({}, ut, o)), U = X === an ? ft : st, dt = {
    top: rt.top - U.top + P.top,
    bottom: U.bottom - rt.bottom + P.bottom,
    left: rt.left - U.left + P.left,
    right: U.right - rt.right + P.right
  }, gt = a.modifiersData.offset;
  if (X === an && gt) {
    var Nt = gt[p];
    Object.keys(dt).forEach(function(z) {
      var Ot = [$t, Lt].indexOf(z) >= 0 ? 1 : -1, ne = [bt, Lt].indexOf(z) >= 0 ? "y" : "x";
      dt[z] += Nt[ne] * Ot;
    });
  }
  return dt;
}
function su(a, e) {
  e === void 0 && (e = {});
  var r = e, f = r.placement, p = r.boundary, v = r.rootBoundary, E = r.padding, w = r.flipVariations, x = r.allowedAutoPlacements, R = x === void 0 ? gr : x, D = pn(f), F = D ? w ? ar : ar.filter(function(M) {
    return pn(M) === D;
  }) : vn, X = F.filter(function(M) {
    return R.indexOf(M) >= 0;
  });
  X.length === 0 && (X = F);
  var B = X.reduce(function(M, $) {
    return M[$] = gn(a, {
      placement: $,
      boundary: p,
      rootBoundary: v,
      padding: E
    })[Zt($)], M;
  }, {});
  return Object.keys(B).sort(function(M, $) {
    return B[M] - B[$];
  });
}
function ou(a) {
  if (Zt(a) === gi)
    return [];
  var e = ai(a);
  return [ps(a), e, ps(e)];
}
function au(a) {
  var e = a.state, r = a.options, f = a.name;
  if (!e.modifiersData[f]._skip) {
    for (var p = r.mainAxis, v = p === void 0 ? !0 : p, E = r.altAxis, w = E === void 0 ? !0 : E, x = r.fallbackPlacements, R = r.padding, D = r.boundary, F = r.rootBoundary, X = r.altBoundary, B = r.flipVariations, M = B === void 0 ? !0 : B, $ = r.allowedAutoPlacements, J = e.options.placement, P = Zt(J), ct = P === J, ut = x || (ct || !M ? [ai(J)] : ou(J)), G = [J].concat(ut).reduce(function(ie, Ut) {
      return ie.concat(Zt(Ut) === gi ? su(e, {
        placement: Ut,
        boundary: D,
        rootBoundary: F,
        padding: R,
        flipVariations: M,
        allowedAutoPlacements: $
      }) : Ut);
    }, []), rt = e.rects.reference, st = e.rects.popper, o = /* @__PURE__ */ new Map(), ft = !0, U = G[0], dt = 0; dt < G.length; dt++) {
      var gt = G[dt], Nt = Zt(gt), z = pn(gt) === We, Ot = [bt, Lt].indexOf(Nt) >= 0, ne = Ot ? "width" : "height", yt = gn(e, {
        placement: gt,
        boundary: D,
        rootBoundary: F,
        altBoundary: X,
        padding: R
      }), ht = Ot ? z ? $t : Tt : z ? Lt : bt;
      rt[ne] > st[ne] && (ht = ai(ht));
      var pe = ai(ht), At = [];
      if (v && At.push(yt[Nt] <= 0), w && At.push(yt[ht] <= 0, yt[pe] <= 0), At.every(function(ie) {
        return ie;
      })) {
        U = gt, ft = !1;
        break;
      }
      o.set(gt, At);
    }
    if (ft)
      for (var Oe = M ? 3 : 1, Ke = function(Ut) {
        var De = G.find(function(Ye) {
          var re = o.get(Ye);
          if (re)
            return re.slice(0, Ut).every(function(Ue) {
              return Ue;
            });
        });
        if (De)
          return U = De, "break";
      }, ge = Oe; ge > 0; ge--) {
        var me = Ke(ge);
        if (me === "break") break;
      }
    e.placement !== U && (e.modifiersData[f]._skip = !0, e.placement = U, e.reset = !0);
  }
}
const mo = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: au,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function ms(a, e, r) {
  return r === void 0 && (r = {
    x: 0,
    y: 0
  }), {
    top: a.top - e.height - r.y,
    right: a.right - e.width + r.x,
    bottom: a.bottom - e.height + r.y,
    left: a.left - e.width - r.x
  };
}
function _s(a) {
  return [bt, $t, Lt, Tt].some(function(e) {
    return a[e] >= 0;
  });
}
function uu(a) {
  var e = a.state, r = a.name, f = e.rects.reference, p = e.rects.popper, v = e.modifiersData.preventOverflow, E = gn(e, {
    elementContext: "reference"
  }), w = gn(e, {
    altBoundary: !0
  }), x = ms(E, f), R = ms(w, p, v), D = _s(x), F = _s(R);
  e.modifiersData[r] = {
    referenceClippingOffsets: x,
    popperEscapeOffsets: R,
    isReferenceHidden: D,
    hasPopperEscaped: F
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": D,
    "data-popper-escaped": F
  });
}
const _o = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: uu
};
function cu(a, e, r) {
  var f = Zt(a), p = [Tt, bt].indexOf(f) >= 0 ? -1 : 1, v = typeof r == "function" ? r(Object.assign({}, e, {
    placement: a
  })) : r, E = v[0], w = v[1];
  return E = E || 0, w = (w || 0) * p, [Tt, $t].indexOf(f) >= 0 ? {
    x: w,
    y: E
  } : {
    x: E,
    y: w
  };
}
function lu(a) {
  var e = a.state, r = a.options, f = a.name, p = r.offset, v = p === void 0 ? [0, 0] : p, E = gr.reduce(function(D, F) {
    return D[F] = cu(F, e.rects, v), D;
  }, {}), w = E[e.placement], x = w.x, R = w.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += x, e.modifiersData.popperOffsets.y += R), e.modifiersData[f] = E;
}
const vo = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: lu
};
function fu(a) {
  var e = a.state, r = a.name;
  e.modifiersData[r] = go({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const Cr = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: fu,
  data: {}
};
function du(a) {
  return a === "x" ? "y" : "x";
}
function hu(a) {
  var e = a.state, r = a.options, f = a.name, p = r.mainAxis, v = p === void 0 ? !0 : p, E = r.altAxis, w = E === void 0 ? !1 : E, x = r.boundary, R = r.rootBoundary, D = r.altBoundary, F = r.padding, X = r.tether, B = X === void 0 ? !0 : X, M = r.tetherOffset, $ = M === void 0 ? 0 : M, J = gn(e, {
    boundary: x,
    rootBoundary: R,
    padding: F,
    altBoundary: D
  }), P = Zt(e.placement), ct = pn(e.placement), ut = !ct, G = yr(P), rt = du(G), st = e.modifiersData.popperOffsets, o = e.rects.reference, ft = e.rects.popper, U = typeof $ == "function" ? $(Object.assign({}, e.rects, {
    placement: e.placement
  })) : $, dt = typeof U == "number" ? {
    mainAxis: U,
    altAxis: U
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, U), gt = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, Nt = {
    x: 0,
    y: 0
  };
  if (st) {
    if (v) {
      var z, Ot = G === "y" ? bt : Tt, ne = G === "y" ? Lt : $t, yt = G === "y" ? "height" : "width", ht = st[G], pe = ht + J[Ot], At = ht - J[ne], Oe = B ? -ft[yt] / 2 : 0, Ke = ct === We ? o[yt] : ft[yt], ge = ct === We ? -ft[yt] : -o[yt], me = e.elements.arrow, ie = B && me ? vr(me) : {
        width: 0,
        height: 0
      }, Ut = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : co(), De = Ut[Ot], Ye = Ut[ne], re = kn(0, o[yt], ie[yt]), Ue = ut ? o[yt] / 2 - Oe - re - De - dt.mainAxis : Ke - re - De - dt.mainAxis, kt = ut ? -o[yt] / 2 + Oe + re + Ye + dt.mainAxis : ge + re + Ye + dt.mainAxis, Tn = e.elements.arrow && Rn(e.elements.arrow), _e = Tn ? G === "y" ? Tn.clientTop || 0 : Tn.clientLeft || 0 : 0, Le = (z = gt == null ? void 0 : gt[G]) != null ? z : 0, qn = ht + Ue - Le - _e, Ai = ht + kt - Le, ze = kn(B ? fi(pe, qn) : pe, ht, B ? Ve(At, Ai) : At);
      st[G] = ze, Nt[G] = ze - ht;
    }
    if (w) {
      var $e, Ft = G === "x" ? bt : Tt, wi = G === "x" ? Lt : $t, se = st[rt], Ge = rt === "y" ? "height" : "width", Dt = se + J[Ft], ve = se - J[wi], oe = [bt, Tt].indexOf(P) !== -1, H = ($e = gt == null ? void 0 : gt[rt]) != null ? $e : 0, mt = oe ? Dt : se - o[Ge] - ft[Ge] - H + dt.altAxis, Fn = oe ? se + o[Ge] + ft[Ge] - H - dt.altAxis : ve, Bn = B && oe ? Ba(mt, se, Fn) : kn(B ? mt : Dt, se, B ? Fn : ve);
      st[rt] = Bn, Nt[rt] = Bn - se;
    }
    e.modifiersData[f] = Nt;
  }
}
const yo = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: hu,
  requiresIfExists: ["offset"]
};
function pu(a) {
  return {
    scrollLeft: a.scrollLeft,
    scrollTop: a.scrollTop
  };
}
function gu(a) {
  return a === It(a) || !jt(a) ? Tr(a) : pu(a);
}
function mu(a) {
  var e = a.getBoundingClientRect(), r = dn(e.width) / a.offsetWidth || 1, f = dn(e.height) / a.offsetHeight || 1;
  return r !== 1 || f !== 1;
}
function _u(a, e, r) {
  r === void 0 && (r = !1);
  var f = jt(e), p = jt(e) && mu(e), v = Se(e), E = hn(a, p, r), w = {
    scrollLeft: 0,
    scrollTop: 0
  }, x = {
    x: 0,
    y: 0
  };
  return (f || !f && !r) && ((ee(e) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  wr(v)) && (w = gu(e)), jt(e) ? (x = hn(e, !0), x.x += e.clientLeft, x.y += e.clientTop) : v && (x.x = Ar(v))), {
    x: E.left + w.scrollLeft - x.x,
    y: E.top + w.scrollTop - x.y,
    width: E.width,
    height: E.height
  };
}
function vu(a) {
  var e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), f = [];
  a.forEach(function(v) {
    e.set(v.name, v);
  });
  function p(v) {
    r.add(v.name);
    var E = [].concat(v.requires || [], v.requiresIfExists || []);
    E.forEach(function(w) {
      if (!r.has(w)) {
        var x = e.get(w);
        x && p(x);
      }
    }), f.push(v);
  }
  return a.forEach(function(v) {
    r.has(v.name) || p(v);
  }), f;
}
function yu(a) {
  var e = vu(a);
  return oo.reduce(function(r, f) {
    return r.concat(e.filter(function(p) {
      return p.phase === f;
    }));
  }, []);
}
function Eu(a) {
  var e;
  return function() {
    return e || (e = new Promise(function(r) {
      Promise.resolve().then(function() {
        e = void 0, r(a());
      });
    })), e;
  };
}
function bu(a) {
  var e = a.reduce(function(r, f) {
    var p = r[f.name];
    return r[f.name] = p ? Object.assign({}, p, f, {
      options: Object.assign({}, p.options, f.options),
      data: Object.assign({}, p.data, f.data)
    }) : f, r;
  }, {});
  return Object.keys(e).map(function(r) {
    return e[r];
  });
}
var vs = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function ys() {
  for (var a = arguments.length, e = new Array(a), r = 0; r < a; r++)
    e[r] = arguments[r];
  return !e.some(function(f) {
    return !(f && typeof f.getBoundingClientRect == "function");
  });
}
function _i(a) {
  a === void 0 && (a = {});
  var e = a, r = e.defaultModifiers, f = r === void 0 ? [] : r, p = e.defaultOptions, v = p === void 0 ? vs : p;
  return function(w, x, R) {
    R === void 0 && (R = v);
    var D = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, vs, v),
      modifiersData: {},
      elements: {
        reference: w,
        popper: x
      },
      attributes: {},
      styles: {}
    }, F = [], X = !1, B = {
      state: D,
      setOptions: function(P) {
        var ct = typeof P == "function" ? P(D.options) : P;
        $(), D.options = Object.assign({}, v, D.options, ct), D.scrollParents = {
          reference: qe(w) ? Pn(w) : w.contextElement ? Pn(w.contextElement) : [],
          popper: Pn(x)
        };
        var ut = yu(bu([].concat(f, D.options.modifiers)));
        return D.orderedModifiers = ut.filter(function(G) {
          return G.enabled;
        }), M(), B.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!X) {
          var P = D.elements, ct = P.reference, ut = P.popper;
          if (ys(ct, ut)) {
            D.rects = {
              reference: _u(ct, Rn(ut), D.options.strategy === "fixed"),
              popper: vr(ut)
            }, D.reset = !1, D.placement = D.options.placement, D.orderedModifiers.forEach(function(dt) {
              return D.modifiersData[dt.name] = Object.assign({}, dt.data);
            });
            for (var G = 0; G < D.orderedModifiers.length; G++) {
              if (D.reset === !0) {
                D.reset = !1, G = -1;
                continue;
              }
              var rt = D.orderedModifiers[G], st = rt.fn, o = rt.options, ft = o === void 0 ? {} : o, U = rt.name;
              typeof st == "function" && (D = st({
                state: D,
                options: ft,
                name: U,
                instance: B
              }) || D);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Eu(function() {
        return new Promise(function(J) {
          B.forceUpdate(), J(D);
        });
      }),
      destroy: function() {
        $(), X = !0;
      }
    };
    if (!ys(w, x))
      return B;
    B.setOptions(R).then(function(J) {
      !X && R.onFirstUpdate && R.onFirstUpdate(J);
    });
    function M() {
      D.orderedModifiers.forEach(function(J) {
        var P = J.name, ct = J.options, ut = ct === void 0 ? {} : ct, G = J.effect;
        if (typeof G == "function") {
          var rt = G({
            state: D,
            name: P,
            instance: B,
            options: ut
          }), st = function() {
          };
          F.push(rt || st);
        }
      });
    }
    function $() {
      F.forEach(function(J) {
        return J();
      }), F = [];
    }
    return B;
  };
}
var Tu = /* @__PURE__ */ _i(), Au = [br, Cr, Er, _r], wu = /* @__PURE__ */ _i({
  defaultModifiers: Au
}), Cu = [br, Cr, Er, _r, vo, mo, yo, ho, _o], Sr = /* @__PURE__ */ _i({
  defaultModifiers: Cu
});
const Eo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  afterMain: no,
  afterRead: Zs,
  afterWrite: so,
  applyStyles: _r,
  arrow: ho,
  auto: gi,
  basePlacements: vn,
  beforeMain: to,
  beforeRead: Qs,
  beforeWrite: io,
  bottom: Lt,
  clippingParents: Gs,
  computeStyles: Er,
  createPopper: Sr,
  createPopperBase: Tu,
  createPopperLite: wu,
  detectOverflow: gn,
  end: fn,
  eventListeners: br,
  flip: mo,
  hide: _o,
  left: Tt,
  main: eo,
  modifierPhases: oo,
  offset: vo,
  placements: gr,
  popper: an,
  popperGenerator: _i,
  popperOffsets: Cr,
  preventOverflow: yo,
  read: Js,
  reference: Xs,
  right: $t,
  start: We,
  top: bt,
  variationPlacements: ar,
  viewport: pr,
  write: ro
}, Symbol.toStringTag, { value: "Module" }));
/*!
  * Bootstrap v5.3.3 (https://getbootstrap.com/)
  * Copyright 2011-2024 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
const Te = /* @__PURE__ */ new Map(), Yi = {
  set(a, e, r) {
    Te.has(a) || Te.set(a, /* @__PURE__ */ new Map());
    const f = Te.get(a);
    if (!f.has(e) && f.size !== 0) {
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(f.keys())[0]}.`);
      return;
    }
    f.set(e, r);
  },
  get(a, e) {
    return Te.has(a) && Te.get(a).get(e) || null;
  },
  remove(a, e) {
    if (!Te.has(a))
      return;
    const r = Te.get(a);
    r.delete(e), r.size === 0 && Te.delete(a);
  }
}, Su = 1e6, xu = 1e3, lr = "transitionend", bo = (a) => (a && window.CSS && window.CSS.escape && (a = a.replace(/#([^\s"#']+)/g, (e, r) => `#${CSS.escape(r)}`)), a), Nu = (a) => a == null ? `${a}` : Object.prototype.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase(), Ou = (a) => {
  do
    a += Math.floor(Math.random() * Su);
  while (document.getElementById(a));
  return a;
}, Du = (a) => {
  if (!a)
    return 0;
  let {
    transitionDuration: e,
    transitionDelay: r
  } = window.getComputedStyle(a);
  const f = Number.parseFloat(e), p = Number.parseFloat(r);
  return !f && !p ? 0 : (e = e.split(",")[0], r = r.split(",")[0], (Number.parseFloat(e) + Number.parseFloat(r)) * xu);
}, To = (a) => {
  a.dispatchEvent(new Event(lr));
}, le = (a) => !a || typeof a != "object" ? !1 : (typeof a.jquery < "u" && (a = a[0]), typeof a.nodeType < "u"), Ae = (a) => le(a) ? a.jquery ? a[0] : a : typeof a == "string" && a.length > 0 ? document.querySelector(bo(a)) : null, yn = (a) => {
  if (!le(a) || a.getClientRects().length === 0)
    return !1;
  const e = getComputedStyle(a).getPropertyValue("visibility") === "visible", r = a.closest("details:not([open])");
  if (!r)
    return e;
  if (r !== a) {
    const f = a.closest("summary");
    if (f && f.parentNode !== r || f === null)
      return !1;
  }
  return e;
}, we = (a) => !a || a.nodeType !== Node.ELEMENT_NODE || a.classList.contains("disabled") ? !0 : typeof a.disabled < "u" ? a.disabled : a.hasAttribute("disabled") && a.getAttribute("disabled") !== "false", Ao = (a) => {
  if (!document.documentElement.attachShadow)
    return null;
  if (typeof a.getRootNode == "function") {
    const e = a.getRootNode();
    return e instanceof ShadowRoot ? e : null;
  }
  return a instanceof ShadowRoot ? a : a.parentNode ? Ao(a.parentNode) : null;
}, di = () => {
}, Hn = (a) => {
  a.offsetHeight;
}, wo = () => window.jQuery && !document.body.hasAttribute("data-bs-no-jquery") ? window.jQuery : null, Ui = [], Lu = (a) => {
  document.readyState === "loading" ? (Ui.length || document.addEventListener("DOMContentLoaded", () => {
    for (const e of Ui)
      e();
  }), Ui.push(a)) : a();
}, Vt = () => document.documentElement.dir === "rtl", qt = (a) => {
  Lu(() => {
    const e = wo();
    if (e) {
      const r = a.NAME, f = e.fn[r];
      e.fn[r] = a.jQueryInterface, e.fn[r].Constructor = a, e.fn[r].noConflict = () => (e.fn[r] = f, a.jQueryInterface);
    }
  });
}, xt = (a, e = [], r = a) => typeof a == "function" ? a(...e) : r, Co = (a, e, r = !0) => {
  if (!r) {
    xt(a);
    return;
  }
  const p = Du(e) + 5;
  let v = !1;
  const E = ({
    target: w
  }) => {
    w === e && (v = !0, e.removeEventListener(lr, E), xt(a));
  };
  e.addEventListener(lr, E), setTimeout(() => {
    v || To(e);
  }, p);
}, xr = (a, e, r, f) => {
  const p = a.length;
  let v = a.indexOf(e);
  return v === -1 ? !r && f ? a[p - 1] : a[0] : (v += r ? 1 : -1, f && (v = (v + p) % p), a[Math.max(0, Math.min(v, p - 1))]);
}, $u = /[^.]*(?=\..*)\.|.*/, Iu = /\..*/, ku = /::\d+$/, zi = {};
let Es = 1;
const So = {
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, Pu = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
function xo(a, e) {
  return e && `${e}::${Es++}` || a.uidEvent || Es++;
}
function No(a) {
  const e = xo(a);
  return a.uidEvent = e, zi[e] = zi[e] || {}, zi[e];
}
function Mu(a, e) {
  return function r(f) {
    return Nr(f, {
      delegateTarget: a
    }), r.oneOff && N.off(a, f.type, e), e.apply(a, [f]);
  };
}
function Ru(a, e, r) {
  return function f(p) {
    const v = a.querySelectorAll(e);
    for (let {
      target: E
    } = p; E && E !== this; E = E.parentNode)
      for (const w of v)
        if (w === E)
          return Nr(p, {
            delegateTarget: E
          }), f.oneOff && N.off(a, p.type, e, r), r.apply(E, [p]);
  };
}
function Oo(a, e, r = null) {
  return Object.values(a).find((f) => f.callable === e && f.delegationSelector === r);
}
function Do(a, e, r) {
  const f = typeof e == "string", p = f ? r : e || r;
  let v = Lo(a);
  return Pu.has(v) || (v = a), [f, p, v];
}
function bs(a, e, r, f, p) {
  if (typeof e != "string" || !a)
    return;
  let [v, E, w] = Do(e, r, f);
  e in So && (E = ((M) => function($) {
    if (!$.relatedTarget || $.relatedTarget !== $.delegateTarget && !$.delegateTarget.contains($.relatedTarget))
      return M.call(this, $);
  })(E));
  const x = No(a), R = x[w] || (x[w] = {}), D = Oo(R, E, v ? r : null);
  if (D) {
    D.oneOff = D.oneOff && p;
    return;
  }
  const F = xo(E, e.replace($u, "")), X = v ? Ru(a, r, E) : Mu(a, E);
  X.delegationSelector = v ? r : null, X.callable = E, X.oneOff = p, X.uidEvent = F, R[F] = X, a.addEventListener(w, X, v);
}
function fr(a, e, r, f, p) {
  const v = Oo(e[r], f, p);
  v && (a.removeEventListener(r, v, !!p), delete e[r][v.uidEvent]);
}
function Hu(a, e, r, f) {
  const p = e[r] || {};
  for (const [v, E] of Object.entries(p))
    v.includes(f) && fr(a, e, r, E.callable, E.delegationSelector);
}
function Lo(a) {
  return a = a.replace(Iu, ""), So[a] || a;
}
const N = {
  on(a, e, r, f) {
    bs(a, e, r, f, !1);
  },
  one(a, e, r, f) {
    bs(a, e, r, f, !0);
  },
  off(a, e, r, f) {
    if (typeof e != "string" || !a)
      return;
    const [p, v, E] = Do(e, r, f), w = E !== e, x = No(a), R = x[E] || {}, D = e.startsWith(".");
    if (typeof v < "u") {
      if (!Object.keys(R).length)
        return;
      fr(a, x, E, v, p ? r : null);
      return;
    }
    if (D)
      for (const F of Object.keys(x))
        Hu(a, x, F, e.slice(1));
    for (const [F, X] of Object.entries(R)) {
      const B = F.replace(ku, "");
      (!w || e.includes(B)) && fr(a, x, E, X.callable, X.delegationSelector);
    }
  },
  trigger(a, e, r) {
    if (typeof e != "string" || !a)
      return null;
    const f = wo(), p = Lo(e), v = e !== p;
    let E = null, w = !0, x = !0, R = !1;
    v && f && (E = f.Event(e, r), f(a).trigger(E), w = !E.isPropagationStopped(), x = !E.isImmediatePropagationStopped(), R = E.isDefaultPrevented());
    const D = Nr(new Event(e, {
      bubbles: w,
      cancelable: !0
    }), r);
    return R && D.preventDefault(), x && a.dispatchEvent(D), D.defaultPrevented && E && E.preventDefault(), D;
  }
};
function Nr(a, e = {}) {
  for (const [r, f] of Object.entries(e))
    try {
      a[r] = f;
    } catch {
      Object.defineProperty(a, r, {
        configurable: !0,
        get() {
          return f;
        }
      });
    }
  return a;
}
function Ts(a) {
  if (a === "true")
    return !0;
  if (a === "false")
    return !1;
  if (a === Number(a).toString())
    return Number(a);
  if (a === "" || a === "null")
    return null;
  if (typeof a != "string")
    return a;
  try {
    return JSON.parse(decodeURIComponent(a));
  } catch {
    return a;
  }
}
function Gi(a) {
  return a.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
const fe = {
  setDataAttribute(a, e, r) {
    a.setAttribute(`data-bs-${Gi(e)}`, r);
  },
  removeDataAttribute(a, e) {
    a.removeAttribute(`data-bs-${Gi(e)}`);
  },
  getDataAttributes(a) {
    if (!a)
      return {};
    const e = {}, r = Object.keys(a.dataset).filter((f) => f.startsWith("bs") && !f.startsWith("bsConfig"));
    for (const f of r) {
      let p = f.replace(/^bs/, "");
      p = p.charAt(0).toLowerCase() + p.slice(1, p.length), e[p] = Ts(a.dataset[f]);
    }
    return e;
  },
  getDataAttribute(a, e) {
    return Ts(a.getAttribute(`data-bs-${Gi(e)}`));
  }
};
class jn {
  // Getters
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  _getConfig(e) {
    return e = this._mergeConfigObj(e), e = this._configAfterMerge(e), this._typeCheckConfig(e), e;
  }
  _configAfterMerge(e) {
    return e;
  }
  _mergeConfigObj(e, r) {
    const f = le(r) ? fe.getDataAttribute(r, "config") : {};
    return {
      ...this.constructor.Default,
      ...typeof f == "object" ? f : {},
      ...le(r) ? fe.getDataAttributes(r) : {},
      ...typeof e == "object" ? e : {}
    };
  }
  _typeCheckConfig(e, r = this.constructor.DefaultType) {
    for (const [f, p] of Object.entries(r)) {
      const v = e[f], E = le(v) ? "element" : Nu(v);
      if (!new RegExp(p).test(E))
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${f}" provided type "${E}" but expected type "${p}".`);
    }
  }
}
const ju = "5.3.3";
class Yt extends jn {
  constructor(e, r) {
    super(), e = Ae(e), e && (this._element = e, this._config = this._getConfig(r), Yi.set(this._element, this.constructor.DATA_KEY, this));
  }
  // Public
  dispose() {
    Yi.remove(this._element, this.constructor.DATA_KEY), N.off(this._element, this.constructor.EVENT_KEY);
    for (const e of Object.getOwnPropertyNames(this))
      this[e] = null;
  }
  _queueCallback(e, r, f = !0) {
    Co(e, r, f);
  }
  _getConfig(e) {
    return e = this._mergeConfigObj(e, this._element), e = this._configAfterMerge(e), this._typeCheckConfig(e), e;
  }
  // Static
  static getInstance(e) {
    return Yi.get(Ae(e), this.DATA_KEY);
  }
  static getOrCreateInstance(e, r = {}) {
    return this.getInstance(e) || new this(e, typeof r == "object" ? r : null);
  }
  static get VERSION() {
    return ju;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(e) {
    return `${e}${this.EVENT_KEY}`;
  }
}
const Xi = (a) => {
  let e = a.getAttribute("data-bs-target");
  if (!e || e === "#") {
    let r = a.getAttribute("href");
    if (!r || !r.includes("#") && !r.startsWith("."))
      return null;
    r.includes("#") && !r.startsWith("#") && (r = `#${r.split("#")[1]}`), e = r && r !== "#" ? r.trim() : null;
  }
  return e ? e.split(",").map((r) => bo(r)).join(",") : null;
}, V = {
  find(a, e = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(e, a));
  },
  findOne(a, e = document.documentElement) {
    return Element.prototype.querySelector.call(e, a);
  },
  children(a, e) {
    return [].concat(...a.children).filter((r) => r.matches(e));
  },
  parents(a, e) {
    const r = [];
    let f = a.parentNode.closest(e);
    for (; f; )
      r.push(f), f = f.parentNode.closest(e);
    return r;
  },
  prev(a, e) {
    let r = a.previousElementSibling;
    for (; r; ) {
      if (r.matches(e))
        return [r];
      r = r.previousElementSibling;
    }
    return [];
  },
  // TODO: this is now unused; remove later along with prev()
  next(a, e) {
    let r = a.nextElementSibling;
    for (; r; ) {
      if (r.matches(e))
        return [r];
      r = r.nextElementSibling;
    }
    return [];
  },
  focusableChildren(a) {
    const e = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((r) => `${r}:not([tabindex^="-"])`).join(",");
    return this.find(e, a).filter((r) => !we(r) && yn(r));
  },
  getSelectorFromElement(a) {
    const e = Xi(a);
    return e && V.findOne(e) ? e : null;
  },
  getElementFromSelector(a) {
    const e = Xi(a);
    return e ? V.findOne(e) : null;
  },
  getMultipleElementsFromSelector(a) {
    const e = Xi(a);
    return e ? V.find(e) : [];
  }
}, vi = (a, e = "hide") => {
  const r = `click.dismiss${a.EVENT_KEY}`, f = a.NAME;
  N.on(document, r, `[data-bs-dismiss="${f}"]`, function(p) {
    if (["A", "AREA"].includes(this.tagName) && p.preventDefault(), we(this))
      return;
    const v = V.getElementFromSelector(this) || this.closest(`.${f}`);
    a.getOrCreateInstance(v)[e]();
  });
}, Vu = "alert", Wu = "bs.alert", $o = `.${Wu}`, qu = `close${$o}`, Fu = `closed${$o}`, Bu = "fade", Ku = "show";
class yi extends Yt {
  // Getters
  static get NAME() {
    return Vu;
  }
  // Public
  close() {
    if (N.trigger(this._element, qu).defaultPrevented)
      return;
    this._element.classList.remove(Ku);
    const r = this._element.classList.contains(Bu);
    this._queueCallback(() => this._destroyElement(), this._element, r);
  }
  // Private
  _destroyElement() {
    this._element.remove(), N.trigger(this._element, Fu), this.dispose();
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = yi.getOrCreateInstance(this);
      if (typeof e == "string") {
        if (r[e] === void 0 || e.startsWith("_") || e === "constructor")
          throw new TypeError(`No method named "${e}"`);
        r[e](this);
      }
    });
  }
}
vi(yi, "close");
qt(yi);
const Yu = "button", Uu = "bs.button", zu = `.${Uu}`, Gu = ".data-api", Xu = "active", As = '[data-bs-toggle="button"]', Qu = `click${zu}${Gu}`;
class Ei extends Yt {
  // Getters
  static get NAME() {
    return Yu;
  }
  // Public
  toggle() {
    this._element.setAttribute("aria-pressed", this._element.classList.toggle(Xu));
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = Ei.getOrCreateInstance(this);
      e === "toggle" && r[e]();
    });
  }
}
N.on(document, Qu, As, (a) => {
  a.preventDefault();
  const e = a.target.closest(As);
  Ei.getOrCreateInstance(e).toggle();
});
qt(Ei);
const Ju = "swipe", En = ".bs.swipe", Zu = `touchstart${En}`, tc = `touchmove${En}`, ec = `touchend${En}`, nc = `pointerdown${En}`, ic = `pointerup${En}`, rc = "touch", sc = "pen", oc = "pointer-event", ac = 40, uc = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
}, cc = {
  endCallback: "(function|null)",
  leftCallback: "(function|null)",
  rightCallback: "(function|null)"
};
class hi extends jn {
  constructor(e, r) {
    super(), this._element = e, !(!e || !hi.isSupported()) && (this._config = this._getConfig(r), this._deltaX = 0, this._supportPointerEvents = !!window.PointerEvent, this._initEvents());
  }
  // Getters
  static get Default() {
    return uc;
  }
  static get DefaultType() {
    return cc;
  }
  static get NAME() {
    return Ju;
  }
  // Public
  dispose() {
    N.off(this._element, En);
  }
  // Private
  _start(e) {
    if (!this._supportPointerEvents) {
      this._deltaX = e.touches[0].clientX;
      return;
    }
    this._eventIsPointerPenTouch(e) && (this._deltaX = e.clientX);
  }
  _end(e) {
    this._eventIsPointerPenTouch(e) && (this._deltaX = e.clientX - this._deltaX), this._handleSwipe(), xt(this._config.endCallback);
  }
  _move(e) {
    this._deltaX = e.touches && e.touches.length > 1 ? 0 : e.touches[0].clientX - this._deltaX;
  }
  _handleSwipe() {
    const e = Math.abs(this._deltaX);
    if (e <= ac)
      return;
    const r = e / this._deltaX;
    this._deltaX = 0, r && xt(r > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    this._supportPointerEvents ? (N.on(this._element, nc, (e) => this._start(e)), N.on(this._element, ic, (e) => this._end(e)), this._element.classList.add(oc)) : (N.on(this._element, Zu, (e) => this._start(e)), N.on(this._element, tc, (e) => this._move(e)), N.on(this._element, ec, (e) => this._end(e)));
  }
  _eventIsPointerPenTouch(e) {
    return this._supportPointerEvents && (e.pointerType === sc || e.pointerType === rc);
  }
  // Static
  static isSupported() {
    return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
  }
}
const lc = "carousel", fc = "bs.carousel", xe = `.${fc}`, Io = ".data-api", dc = "ArrowLeft", hc = "ArrowRight", pc = 500, $n = "next", sn = "prev", un = "left", ui = "right", gc = `slide${xe}`, Qi = `slid${xe}`, mc = `keydown${xe}`, _c = `mouseenter${xe}`, vc = `mouseleave${xe}`, yc = `dragstart${xe}`, Ec = `load${xe}${Io}`, bc = `click${xe}${Io}`, ko = "carousel", ei = "active", Tc = "slide", Ac = "carousel-item-end", wc = "carousel-item-start", Cc = "carousel-item-next", Sc = "carousel-item-prev", Po = ".active", Mo = ".carousel-item", xc = Po + Mo, Nc = ".carousel-item img", Oc = ".carousel-indicators", Dc = "[data-bs-slide], [data-bs-slide-to]", Lc = '[data-bs-ride="carousel"]', $c = {
  [dc]: ui,
  [hc]: un
}, Ic = {
  interval: 5e3,
  keyboard: !0,
  pause: "hover",
  ride: !1,
  touch: !0,
  wrap: !0
}, kc = {
  interval: "(number|boolean)",
  // TODO:v6 remove boolean support
  keyboard: "boolean",
  pause: "(string|boolean)",
  ride: "(boolean|string)",
  touch: "boolean",
  wrap: "boolean"
};
class Vn extends Yt {
  constructor(e, r) {
    super(e, r), this._interval = null, this._activeElement = null, this._isSliding = !1, this.touchTimeout = null, this._swipeHelper = null, this._indicatorsElement = V.findOne(Oc, this._element), this._addEventListeners(), this._config.ride === ko && this.cycle();
  }
  // Getters
  static get Default() {
    return Ic;
  }
  static get DefaultType() {
    return kc;
  }
  static get NAME() {
    return lc;
  }
  // Public
  next() {
    this._slide($n);
  }
  nextWhenVisible() {
    !document.hidden && yn(this._element) && this.next();
  }
  prev() {
    this._slide(sn);
  }
  pause() {
    this._isSliding && To(this._element), this._clearInterval();
  }
  cycle() {
    this._clearInterval(), this._updateInterval(), this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }
  _maybeEnableCycle() {
    if (this._config.ride) {
      if (this._isSliding) {
        N.one(this._element, Qi, () => this.cycle());
        return;
      }
      this.cycle();
    }
  }
  to(e) {
    const r = this._getItems();
    if (e > r.length - 1 || e < 0)
      return;
    if (this._isSliding) {
      N.one(this._element, Qi, () => this.to(e));
      return;
    }
    const f = this._getItemIndex(this._getActive());
    if (f === e)
      return;
    const p = e > f ? $n : sn;
    this._slide(p, r[e]);
  }
  dispose() {
    this._swipeHelper && this._swipeHelper.dispose(), super.dispose();
  }
  // Private
  _configAfterMerge(e) {
    return e.defaultInterval = e.interval, e;
  }
  _addEventListeners() {
    this._config.keyboard && N.on(this._element, mc, (e) => this._keydown(e)), this._config.pause === "hover" && (N.on(this._element, _c, () => this.pause()), N.on(this._element, vc, () => this._maybeEnableCycle())), this._config.touch && hi.isSupported() && this._addTouchEventListeners();
  }
  _addTouchEventListeners() {
    for (const f of V.find(Nc, this._element))
      N.on(f, yc, (p) => p.preventDefault());
    const r = {
      leftCallback: () => this._slide(this._directionToOrder(un)),
      rightCallback: () => this._slide(this._directionToOrder(ui)),
      endCallback: () => {
        this._config.pause === "hover" && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), pc + this._config.interval));
      }
    };
    this._swipeHelper = new hi(this._element, r);
  }
  _keydown(e) {
    if (/input|textarea/i.test(e.target.tagName))
      return;
    const r = $c[e.key];
    r && (e.preventDefault(), this._slide(this._directionToOrder(r)));
  }
  _getItemIndex(e) {
    return this._getItems().indexOf(e);
  }
  _setActiveIndicatorElement(e) {
    if (!this._indicatorsElement)
      return;
    const r = V.findOne(Po, this._indicatorsElement);
    r.classList.remove(ei), r.removeAttribute("aria-current");
    const f = V.findOne(`[data-bs-slide-to="${e}"]`, this._indicatorsElement);
    f && (f.classList.add(ei), f.setAttribute("aria-current", "true"));
  }
  _updateInterval() {
    const e = this._activeElement || this._getActive();
    if (!e)
      return;
    const r = Number.parseInt(e.getAttribute("data-bs-interval"), 10);
    this._config.interval = r || this._config.defaultInterval;
  }
  _slide(e, r = null) {
    if (this._isSliding)
      return;
    const f = this._getActive(), p = e === $n, v = r || xr(this._getItems(), f, p, this._config.wrap);
    if (v === f)
      return;
    const E = this._getItemIndex(v), w = (B) => N.trigger(this._element, B, {
      relatedTarget: v,
      direction: this._orderToDirection(e),
      from: this._getItemIndex(f),
      to: E
    });
    if (w(gc).defaultPrevented || !f || !v)
      return;
    const R = !!this._interval;
    this.pause(), this._isSliding = !0, this._setActiveIndicatorElement(E), this._activeElement = v;
    const D = p ? wc : Ac, F = p ? Cc : Sc;
    v.classList.add(F), Hn(v), f.classList.add(D), v.classList.add(D);
    const X = () => {
      v.classList.remove(D, F), v.classList.add(ei), f.classList.remove(ei, F, D), this._isSliding = !1, w(Qi);
    };
    this._queueCallback(X, f, this._isAnimated()), R && this.cycle();
  }
  _isAnimated() {
    return this._element.classList.contains(Tc);
  }
  _getActive() {
    return V.findOne(xc, this._element);
  }
  _getItems() {
    return V.find(Mo, this._element);
  }
  _clearInterval() {
    this._interval && (clearInterval(this._interval), this._interval = null);
  }
  _directionToOrder(e) {
    return Vt() ? e === un ? sn : $n : e === un ? $n : sn;
  }
  _orderToDirection(e) {
    return Vt() ? e === sn ? un : ui : e === sn ? ui : un;
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = Vn.getOrCreateInstance(this, e);
      if (typeof e == "number") {
        r.to(e);
        return;
      }
      if (typeof e == "string") {
        if (r[e] === void 0 || e.startsWith("_") || e === "constructor")
          throw new TypeError(`No method named "${e}"`);
        r[e]();
      }
    });
  }
}
N.on(document, bc, Dc, function(a) {
  const e = V.getElementFromSelector(this);
  if (!e || !e.classList.contains(ko))
    return;
  a.preventDefault();
  const r = Vn.getOrCreateInstance(e), f = this.getAttribute("data-bs-slide-to");
  if (f) {
    r.to(f), r._maybeEnableCycle();
    return;
  }
  if (fe.getDataAttribute(this, "slide") === "next") {
    r.next(), r._maybeEnableCycle();
    return;
  }
  r.prev(), r._maybeEnableCycle();
});
N.on(window, Ec, () => {
  const a = V.find(Lc);
  for (const e of a)
    Vn.getOrCreateInstance(e);
});
qt(Vn);
const Pc = "collapse", Mc = "bs.collapse", Wn = `.${Mc}`, Rc = ".data-api", Hc = `show${Wn}`, jc = `shown${Wn}`, Vc = `hide${Wn}`, Wc = `hidden${Wn}`, qc = `click${Wn}${Rc}`, Ji = "show", ln = "collapse", ni = "collapsing", Fc = "collapsed", Bc = `:scope .${ln} .${ln}`, Kc = "collapse-horizontal", Yc = "width", Uc = "height", zc = ".collapse.show, .collapse.collapsing", dr = '[data-bs-toggle="collapse"]', Gc = {
  parent: null,
  toggle: !0
}, Xc = {
  parent: "(null|element)",
  toggle: "boolean"
};
class Mn extends Yt {
  constructor(e, r) {
    super(e, r), this._isTransitioning = !1, this._triggerArray = [];
    const f = V.find(dr);
    for (const p of f) {
      const v = V.getSelectorFromElement(p), E = V.find(v).filter((w) => w === this._element);
      v !== null && E.length && this._triggerArray.push(p);
    }
    this._initializeChildren(), this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()), this._config.toggle && this.toggle();
  }
  // Getters
  static get Default() {
    return Gc;
  }
  static get DefaultType() {
    return Xc;
  }
  static get NAME() {
    return Pc;
  }
  // Public
  toggle() {
    this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (this._isTransitioning || this._isShown())
      return;
    let e = [];
    if (this._config.parent && (e = this._getFirstLevelChildren(zc).filter((w) => w !== this._element).map((w) => Mn.getOrCreateInstance(w, {
      toggle: !1
    }))), e.length && e[0]._isTransitioning || N.trigger(this._element, Hc).defaultPrevented)
      return;
    for (const w of e)
      w.hide();
    const f = this._getDimension();
    this._element.classList.remove(ln), this._element.classList.add(ni), this._element.style[f] = 0, this._addAriaAndCollapsedClass(this._triggerArray, !0), this._isTransitioning = !0;
    const p = () => {
      this._isTransitioning = !1, this._element.classList.remove(ni), this._element.classList.add(ln, Ji), this._element.style[f] = "", N.trigger(this._element, jc);
    }, E = `scroll${f[0].toUpperCase() + f.slice(1)}`;
    this._queueCallback(p, this._element, !0), this._element.style[f] = `${this._element[E]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown() || N.trigger(this._element, Vc).defaultPrevented)
      return;
    const r = this._getDimension();
    this._element.style[r] = `${this._element.getBoundingClientRect()[r]}px`, Hn(this._element), this._element.classList.add(ni), this._element.classList.remove(ln, Ji);
    for (const p of this._triggerArray) {
      const v = V.getElementFromSelector(p);
      v && !this._isShown(v) && this._addAriaAndCollapsedClass([p], !1);
    }
    this._isTransitioning = !0;
    const f = () => {
      this._isTransitioning = !1, this._element.classList.remove(ni), this._element.classList.add(ln), N.trigger(this._element, Wc);
    };
    this._element.style[r] = "", this._queueCallback(f, this._element, !0);
  }
  _isShown(e = this._element) {
    return e.classList.contains(Ji);
  }
  // Private
  _configAfterMerge(e) {
    return e.toggle = !!e.toggle, e.parent = Ae(e.parent), e;
  }
  _getDimension() {
    return this._element.classList.contains(Kc) ? Yc : Uc;
  }
  _initializeChildren() {
    if (!this._config.parent)
      return;
    const e = this._getFirstLevelChildren(dr);
    for (const r of e) {
      const f = V.getElementFromSelector(r);
      f && this._addAriaAndCollapsedClass([r], this._isShown(f));
    }
  }
  _getFirstLevelChildren(e) {
    const r = V.find(Bc, this._config.parent);
    return V.find(e, this._config.parent).filter((f) => !r.includes(f));
  }
  _addAriaAndCollapsedClass(e, r) {
    if (e.length)
      for (const f of e)
        f.classList.toggle(Fc, !r), f.setAttribute("aria-expanded", r);
  }
  // Static
  static jQueryInterface(e) {
    const r = {};
    return typeof e == "string" && /show|hide/.test(e) && (r.toggle = !1), this.each(function() {
      const f = Mn.getOrCreateInstance(this, r);
      if (typeof e == "string") {
        if (typeof f[e] > "u")
          throw new TypeError(`No method named "${e}"`);
        f[e]();
      }
    });
  }
}
N.on(document, qc, dr, function(a) {
  (a.target.tagName === "A" || a.delegateTarget && a.delegateTarget.tagName === "A") && a.preventDefault();
  for (const e of V.getMultipleElementsFromSelector(this))
    Mn.getOrCreateInstance(e, {
      toggle: !1
    }).toggle();
});
qt(Mn);
const ws = "dropdown", Qc = "bs.dropdown", Fe = `.${Qc}`, Or = ".data-api", Jc = "Escape", Cs = "Tab", Zc = "ArrowUp", Ss = "ArrowDown", tl = 2, el = `hide${Fe}`, nl = `hidden${Fe}`, il = `show${Fe}`, rl = `shown${Fe}`, Ro = `click${Fe}${Or}`, Ho = `keydown${Fe}${Or}`, sl = `keyup${Fe}${Or}`, cn = "show", ol = "dropup", al = "dropend", ul = "dropstart", cl = "dropup-center", ll = "dropdown-center", He = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)', fl = `${He}.${cn}`, ci = ".dropdown-menu", dl = ".navbar", hl = ".navbar-nav", pl = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", gl = Vt() ? "top-end" : "top-start", ml = Vt() ? "top-start" : "top-end", _l = Vt() ? "bottom-end" : "bottom-start", vl = Vt() ? "bottom-start" : "bottom-end", yl = Vt() ? "left-start" : "right-start", El = Vt() ? "right-start" : "left-start", bl = "top", Tl = "bottom", Al = {
  autoClose: !0,
  boundary: "clippingParents",
  display: "dynamic",
  offset: [0, 2],
  popperConfig: null,
  reference: "toggle"
}, wl = {
  autoClose: "(boolean|string)",
  boundary: "(string|element)",
  display: "string",
  offset: "(array|string|function)",
  popperConfig: "(null|object|function)",
  reference: "(string|element|object)"
};
class te extends Yt {
  constructor(e, r) {
    super(e, r), this._popper = null, this._parent = this._element.parentNode, this._menu = V.next(this._element, ci)[0] || V.prev(this._element, ci)[0] || V.findOne(ci, this._parent), this._inNavbar = this._detectNavbar();
  }
  // Getters
  static get Default() {
    return Al;
  }
  static get DefaultType() {
    return wl;
  }
  static get NAME() {
    return ws;
  }
  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (we(this._element) || this._isShown())
      return;
    const e = {
      relatedTarget: this._element
    };
    if (!N.trigger(this._element, il, e).defaultPrevented) {
      if (this._createPopper(), "ontouchstart" in document.documentElement && !this._parent.closest(hl))
        for (const f of [].concat(...document.body.children))
          N.on(f, "mouseover", di);
      this._element.focus(), this._element.setAttribute("aria-expanded", !0), this._menu.classList.add(cn), this._element.classList.add(cn), N.trigger(this._element, rl, e);
    }
  }
  hide() {
    if (we(this._element) || !this._isShown())
      return;
    const e = {
      relatedTarget: this._element
    };
    this._completeHide(e);
  }
  dispose() {
    this._popper && this._popper.destroy(), super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar(), this._popper && this._popper.update();
  }
  // Private
  _completeHide(e) {
    if (!N.trigger(this._element, el, e).defaultPrevented) {
      if ("ontouchstart" in document.documentElement)
        for (const f of [].concat(...document.body.children))
          N.off(f, "mouseover", di);
      this._popper && this._popper.destroy(), this._menu.classList.remove(cn), this._element.classList.remove(cn), this._element.setAttribute("aria-expanded", "false"), fe.removeDataAttribute(this._menu, "popper"), N.trigger(this._element, nl, e);
    }
  }
  _getConfig(e) {
    if (e = super._getConfig(e), typeof e.reference == "object" && !le(e.reference) && typeof e.reference.getBoundingClientRect != "function")
      throw new TypeError(`${ws.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    return e;
  }
  _createPopper() {
    if (typeof Eo > "u")
      throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
    let e = this._element;
    this._config.reference === "parent" ? e = this._parent : le(this._config.reference) ? e = Ae(this._config.reference) : typeof this._config.reference == "object" && (e = this._config.reference);
    const r = this._getPopperConfig();
    this._popper = Sr(e, this._menu, r);
  }
  _isShown() {
    return this._menu.classList.contains(cn);
  }
  _getPlacement() {
    const e = this._parent;
    if (e.classList.contains(al))
      return yl;
    if (e.classList.contains(ul))
      return El;
    if (e.classList.contains(cl))
      return bl;
    if (e.classList.contains(ll))
      return Tl;
    const r = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
    return e.classList.contains(ol) ? r ? ml : gl : r ? vl : _l;
  }
  _detectNavbar() {
    return this._element.closest(dl) !== null;
  }
  _getOffset() {
    const {
      offset: e
    } = this._config;
    return typeof e == "string" ? e.split(",").map((r) => Number.parseInt(r, 10)) : typeof e == "function" ? (r) => e(r, this._element) : e;
  }
  _getPopperConfig() {
    const e = {
      placement: this._getPlacement(),
      modifiers: [{
        name: "preventOverflow",
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: "offset",
        options: {
          offset: this._getOffset()
        }
      }]
    };
    return (this._inNavbar || this._config.display === "static") && (fe.setDataAttribute(this._menu, "popper", "static"), e.modifiers = [{
      name: "applyStyles",
      enabled: !1
    }]), {
      ...e,
      ...xt(this._config.popperConfig, [e])
    };
  }
  _selectMenuItem({
    key: e,
    target: r
  }) {
    const f = V.find(pl, this._menu).filter((p) => yn(p));
    f.length && xr(f, r, e === Ss, !f.includes(r)).focus();
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = te.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (typeof r[e] > "u")
          throw new TypeError(`No method named "${e}"`);
        r[e]();
      }
    });
  }
  static clearMenus(e) {
    if (e.button === tl || e.type === "keyup" && e.key !== Cs)
      return;
    const r = V.find(fl);
    for (const f of r) {
      const p = te.getInstance(f);
      if (!p || p._config.autoClose === !1)
        continue;
      const v = e.composedPath(), E = v.includes(p._menu);
      if (v.includes(p._element) || p._config.autoClose === "inside" && !E || p._config.autoClose === "outside" && E || p._menu.contains(e.target) && (e.type === "keyup" && e.key === Cs || /input|select|option|textarea|form/i.test(e.target.tagName)))
        continue;
      const w = {
        relatedTarget: p._element
      };
      e.type === "click" && (w.clickEvent = e), p._completeHide(w);
    }
  }
  static dataApiKeydownHandler(e) {
    const r = /input|textarea/i.test(e.target.tagName), f = e.key === Jc, p = [Zc, Ss].includes(e.key);
    if (!p && !f || r && !f)
      return;
    e.preventDefault();
    const v = this.matches(He) ? this : V.prev(this, He)[0] || V.next(this, He)[0] || V.findOne(He, e.delegateTarget.parentNode), E = te.getOrCreateInstance(v);
    if (p) {
      e.stopPropagation(), E.show(), E._selectMenuItem(e);
      return;
    }
    E._isShown() && (e.stopPropagation(), E.hide(), v.focus());
  }
}
N.on(document, Ho, He, te.dataApiKeydownHandler);
N.on(document, Ho, ci, te.dataApiKeydownHandler);
N.on(document, Ro, te.clearMenus);
N.on(document, sl, te.clearMenus);
N.on(document, Ro, He, function(a) {
  a.preventDefault(), te.getOrCreateInstance(this).toggle();
});
qt(te);
const jo = "backdrop", Cl = "fade", xs = "show", Ns = `mousedown.bs.${jo}`, Sl = {
  className: "modal-backdrop",
  clickCallback: null,
  isAnimated: !1,
  isVisible: !0,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: "body"
  // give the choice to place backdrop under different elements
}, xl = {
  className: "string",
  clickCallback: "(function|null)",
  isAnimated: "boolean",
  isVisible: "boolean",
  rootElement: "(element|string)"
};
class Vo extends jn {
  constructor(e) {
    super(), this._config = this._getConfig(e), this._isAppended = !1, this._element = null;
  }
  // Getters
  static get Default() {
    return Sl;
  }
  static get DefaultType() {
    return xl;
  }
  static get NAME() {
    return jo;
  }
  // Public
  show(e) {
    if (!this._config.isVisible) {
      xt(e);
      return;
    }
    this._append();
    const r = this._getElement();
    this._config.isAnimated && Hn(r), r.classList.add(xs), this._emulateAnimation(() => {
      xt(e);
    });
  }
  hide(e) {
    if (!this._config.isVisible) {
      xt(e);
      return;
    }
    this._getElement().classList.remove(xs), this._emulateAnimation(() => {
      this.dispose(), xt(e);
    });
  }
  dispose() {
    this._isAppended && (N.off(this._element, Ns), this._element.remove(), this._isAppended = !1);
  }
  // Private
  _getElement() {
    if (!this._element) {
      const e = document.createElement("div");
      e.className = this._config.className, this._config.isAnimated && e.classList.add(Cl), this._element = e;
    }
    return this._element;
  }
  _configAfterMerge(e) {
    return e.rootElement = Ae(e.rootElement), e;
  }
  _append() {
    if (this._isAppended)
      return;
    const e = this._getElement();
    this._config.rootElement.append(e), N.on(e, Ns, () => {
      xt(this._config.clickCallback);
    }), this._isAppended = !0;
  }
  _emulateAnimation(e) {
    Co(e, this._getElement(), this._config.isAnimated);
  }
}
const Nl = "focustrap", Ol = "bs.focustrap", pi = `.${Ol}`, Dl = `focusin${pi}`, Ll = `keydown.tab${pi}`, $l = "Tab", Il = "forward", Os = "backward", kl = {
  autofocus: !0,
  trapElement: null
  // The element to trap focus inside of
}, Pl = {
  autofocus: "boolean",
  trapElement: "element"
};
class Wo extends jn {
  constructor(e) {
    super(), this._config = this._getConfig(e), this._isActive = !1, this._lastTabNavDirection = null;
  }
  // Getters
  static get Default() {
    return kl;
  }
  static get DefaultType() {
    return Pl;
  }
  static get NAME() {
    return Nl;
  }
  // Public
  activate() {
    this._isActive || (this._config.autofocus && this._config.trapElement.focus(), N.off(document, pi), N.on(document, Dl, (e) => this._handleFocusin(e)), N.on(document, Ll, (e) => this._handleKeydown(e)), this._isActive = !0);
  }
  deactivate() {
    this._isActive && (this._isActive = !1, N.off(document, pi));
  }
  // Private
  _handleFocusin(e) {
    const {
      trapElement: r
    } = this._config;
    if (e.target === document || e.target === r || r.contains(e.target))
      return;
    const f = V.focusableChildren(r);
    f.length === 0 ? r.focus() : this._lastTabNavDirection === Os ? f[f.length - 1].focus() : f[0].focus();
  }
  _handleKeydown(e) {
    e.key === $l && (this._lastTabNavDirection = e.shiftKey ? Os : Il);
  }
}
const Ds = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", Ls = ".sticky-top", ii = "padding-right", $s = "margin-right";
class hr {
  constructor() {
    this._element = document.body;
  }
  // Public
  getWidth() {
    const e = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - e);
  }
  hide() {
    const e = this.getWidth();
    this._disableOverFlow(), this._setElementAttributes(this._element, ii, (r) => r + e), this._setElementAttributes(Ds, ii, (r) => r + e), this._setElementAttributes(Ls, $s, (r) => r - e);
  }
  reset() {
    this._resetElementAttributes(this._element, "overflow"), this._resetElementAttributes(this._element, ii), this._resetElementAttributes(Ds, ii), this._resetElementAttributes(Ls, $s);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }
  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow"), this._element.style.overflow = "hidden";
  }
  _setElementAttributes(e, r, f) {
    const p = this.getWidth(), v = (E) => {
      if (E !== this._element && window.innerWidth > E.clientWidth + p)
        return;
      this._saveInitialAttribute(E, r);
      const w = window.getComputedStyle(E).getPropertyValue(r);
      E.style.setProperty(r, `${f(Number.parseFloat(w))}px`);
    };
    this._applyManipulationCallback(e, v);
  }
  _saveInitialAttribute(e, r) {
    const f = e.style.getPropertyValue(r);
    f && fe.setDataAttribute(e, r, f);
  }
  _resetElementAttributes(e, r) {
    const f = (p) => {
      const v = fe.getDataAttribute(p, r);
      if (v === null) {
        p.style.removeProperty(r);
        return;
      }
      fe.removeDataAttribute(p, r), p.style.setProperty(r, v);
    };
    this._applyManipulationCallback(e, f);
  }
  _applyManipulationCallback(e, r) {
    if (le(e)) {
      r(e);
      return;
    }
    for (const f of V.find(e, this._element))
      r(f);
  }
}
const Ml = "modal", Rl = "bs.modal", Wt = `.${Rl}`, Hl = ".data-api", jl = "Escape", Vl = `hide${Wt}`, Wl = `hidePrevented${Wt}`, qo = `hidden${Wt}`, Fo = `show${Wt}`, ql = `shown${Wt}`, Fl = `resize${Wt}`, Bl = `click.dismiss${Wt}`, Kl = `mousedown.dismiss${Wt}`, Yl = `keydown.dismiss${Wt}`, Ul = `click${Wt}${Hl}`, Is = "modal-open", zl = "fade", ks = "show", Zi = "modal-static", Gl = ".modal.show", Xl = ".modal-dialog", Ql = ".modal-body", Jl = '[data-bs-toggle="modal"]', Zl = {
  backdrop: !0,
  focus: !0,
  keyboard: !0
}, tf = {
  backdrop: "(boolean|string)",
  focus: "boolean",
  keyboard: "boolean"
};
class mn extends Yt {
  constructor(e, r) {
    super(e, r), this._dialog = V.findOne(Xl, this._element), this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._isShown = !1, this._isTransitioning = !1, this._scrollBar = new hr(), this._addEventListeners();
  }
  // Getters
  static get Default() {
    return Zl;
  }
  static get DefaultType() {
    return tf;
  }
  static get NAME() {
    return Ml;
  }
  // Public
  toggle(e) {
    return this._isShown ? this.hide() : this.show(e);
  }
  show(e) {
    this._isShown || this._isTransitioning || N.trigger(this._element, Fo, {
      relatedTarget: e
    }).defaultPrevented || (this._isShown = !0, this._isTransitioning = !0, this._scrollBar.hide(), document.body.classList.add(Is), this._adjustDialog(), this._backdrop.show(() => this._showElement(e)));
  }
  hide() {
    !this._isShown || this._isTransitioning || N.trigger(this._element, Vl).defaultPrevented || (this._isShown = !1, this._isTransitioning = !0, this._focustrap.deactivate(), this._element.classList.remove(ks), this._queueCallback(() => this._hideModal(), this._element, this._isAnimated()));
  }
  dispose() {
    N.off(window, Wt), N.off(this._dialog, Wt), this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }
  // Private
  _initializeBackDrop() {
    return new Vo({
      isVisible: !!this._config.backdrop,
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new Wo({
      trapElement: this._element
    });
  }
  _showElement(e) {
    document.body.contains(this._element) || document.body.append(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.scrollTop = 0;
    const r = V.findOne(Ql, this._dialog);
    r && (r.scrollTop = 0), Hn(this._element), this._element.classList.add(ks);
    const f = () => {
      this._config.focus && this._focustrap.activate(), this._isTransitioning = !1, N.trigger(this._element, ql, {
        relatedTarget: e
      });
    };
    this._queueCallback(f, this._dialog, this._isAnimated());
  }
  _addEventListeners() {
    N.on(this._element, Yl, (e) => {
      if (e.key === jl) {
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        this._triggerBackdropTransition();
      }
    }), N.on(window, Fl, () => {
      this._isShown && !this._isTransitioning && this._adjustDialog();
    }), N.on(this._element, Kl, (e) => {
      N.one(this._element, Bl, (r) => {
        if (!(this._element !== e.target || this._element !== r.target)) {
          if (this._config.backdrop === "static") {
            this._triggerBackdropTransition();
            return;
          }
          this._config.backdrop && this.hide();
        }
      });
    });
  }
  _hideModal() {
    this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = !1, this._backdrop.hide(() => {
      document.body.classList.remove(Is), this._resetAdjustments(), this._scrollBar.reset(), N.trigger(this._element, qo);
    });
  }
  _isAnimated() {
    return this._element.classList.contains(zl);
  }
  _triggerBackdropTransition() {
    if (N.trigger(this._element, Wl).defaultPrevented)
      return;
    const r = this._element.scrollHeight > document.documentElement.clientHeight, f = this._element.style.overflowY;
    f === "hidden" || this._element.classList.contains(Zi) || (r || (this._element.style.overflowY = "hidden"), this._element.classList.add(Zi), this._queueCallback(() => {
      this._element.classList.remove(Zi), this._queueCallback(() => {
        this._element.style.overflowY = f;
      }, this._dialog);
    }, this._dialog), this._element.focus());
  }
  /**
   * The following methods are used to handle overflowing modals
   */
  _adjustDialog() {
    const e = this._element.scrollHeight > document.documentElement.clientHeight, r = this._scrollBar.getWidth(), f = r > 0;
    if (f && !e) {
      const p = Vt() ? "paddingLeft" : "paddingRight";
      this._element.style[p] = `${r}px`;
    }
    if (!f && e) {
      const p = Vt() ? "paddingRight" : "paddingLeft";
      this._element.style[p] = `${r}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
  }
  // Static
  static jQueryInterface(e, r) {
    return this.each(function() {
      const f = mn.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (typeof f[e] > "u")
          throw new TypeError(`No method named "${e}"`);
        f[e](r);
      }
    });
  }
}
N.on(document, Ul, Jl, function(a) {
  const e = V.getElementFromSelector(this);
  ["A", "AREA"].includes(this.tagName) && a.preventDefault(), N.one(e, Fo, (p) => {
    p.defaultPrevented || N.one(e, qo, () => {
      yn(this) && this.focus();
    });
  });
  const r = V.findOne(Gl);
  r && mn.getInstance(r).hide(), mn.getOrCreateInstance(e).toggle(this);
});
vi(mn);
qt(mn);
const ef = "offcanvas", nf = "bs.offcanvas", he = `.${nf}`, Bo = ".data-api", rf = `load${he}${Bo}`, sf = "Escape", Ps = "show", Ms = "showing", Rs = "hiding", of = "offcanvas-backdrop", Ko = ".offcanvas.show", af = `show${he}`, uf = `shown${he}`, cf = `hide${he}`, Hs = `hidePrevented${he}`, Yo = `hidden${he}`, lf = `resize${he}`, ff = `click${he}${Bo}`, df = `keydown.dismiss${he}`, hf = '[data-bs-toggle="offcanvas"]', pf = {
  backdrop: !0,
  keyboard: !0,
  scroll: !1
}, gf = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  scroll: "boolean"
};
class Ce extends Yt {
  constructor(e, r) {
    super(e, r), this._isShown = !1, this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._addEventListeners();
  }
  // Getters
  static get Default() {
    return pf;
  }
  static get DefaultType() {
    return gf;
  }
  static get NAME() {
    return ef;
  }
  // Public
  toggle(e) {
    return this._isShown ? this.hide() : this.show(e);
  }
  show(e) {
    if (this._isShown || N.trigger(this._element, af, {
      relatedTarget: e
    }).defaultPrevented)
      return;
    this._isShown = !0, this._backdrop.show(), this._config.scroll || new hr().hide(), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.classList.add(Ms);
    const f = () => {
      (!this._config.scroll || this._config.backdrop) && this._focustrap.activate(), this._element.classList.add(Ps), this._element.classList.remove(Ms), N.trigger(this._element, uf, {
        relatedTarget: e
      });
    };
    this._queueCallback(f, this._element, !0);
  }
  hide() {
    if (!this._isShown || N.trigger(this._element, cf).defaultPrevented)
      return;
    this._focustrap.deactivate(), this._element.blur(), this._isShown = !1, this._element.classList.add(Rs), this._backdrop.hide();
    const r = () => {
      this._element.classList.remove(Ps, Rs), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._config.scroll || new hr().reset(), N.trigger(this._element, Yo);
    };
    this._queueCallback(r, this._element, !0);
  }
  dispose() {
    this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose();
  }
  // Private
  _initializeBackDrop() {
    const e = () => {
      if (this._config.backdrop === "static") {
        N.trigger(this._element, Hs);
        return;
      }
      this.hide();
    }, r = !!this._config.backdrop;
    return new Vo({
      className: of,
      isVisible: r,
      isAnimated: !0,
      rootElement: this._element.parentNode,
      clickCallback: r ? e : null
    });
  }
  _initializeFocusTrap() {
    return new Wo({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    N.on(this._element, df, (e) => {
      if (e.key === sf) {
        if (this._config.keyboard) {
          this.hide();
          return;
        }
        N.trigger(this._element, Hs);
      }
    });
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = Ce.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (r[e] === void 0 || e.startsWith("_") || e === "constructor")
          throw new TypeError(`No method named "${e}"`);
        r[e](this);
      }
    });
  }
}
N.on(document, ff, hf, function(a) {
  const e = V.getElementFromSelector(this);
  if (["A", "AREA"].includes(this.tagName) && a.preventDefault(), we(this))
    return;
  N.one(e, Yo, () => {
    yn(this) && this.focus();
  });
  const r = V.findOne(Ko);
  r && r !== e && Ce.getInstance(r).hide(), Ce.getOrCreateInstance(e).toggle(this);
});
N.on(window, rf, () => {
  for (const a of V.find(Ko))
    Ce.getOrCreateInstance(a).show();
});
N.on(window, lf, () => {
  for (const a of V.find("[aria-modal][class*=show][class*=offcanvas-]"))
    getComputedStyle(a).position !== "fixed" && Ce.getOrCreateInstance(a).hide();
});
vi(Ce);
qt(Ce);
const mf = /^aria-[\w-]*$/i, Uo = {
  // Global attributes allowed on any supplied element below.
  "*": ["class", "dir", "id", "lang", "role", mf],
  a: ["target", "href", "title", "rel"],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  dd: [],
  div: [],
  dl: [],
  dt: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ["src", "srcset", "alt", "title", "width", "height"],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
}, _f = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]), vf = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i, yf = (a, e) => {
  const r = a.nodeName.toLowerCase();
  return e.includes(r) ? _f.has(r) ? !!vf.test(a.nodeValue) : !0 : e.filter((f) => f instanceof RegExp).some((f) => f.test(r));
};
function Ef(a, e, r) {
  if (!a.length)
    return a;
  if (r && typeof r == "function")
    return r(a);
  const p = new window.DOMParser().parseFromString(a, "text/html"), v = [].concat(...p.body.querySelectorAll("*"));
  for (const E of v) {
    const w = E.nodeName.toLowerCase();
    if (!Object.keys(e).includes(w)) {
      E.remove();
      continue;
    }
    const x = [].concat(...E.attributes), R = [].concat(e["*"] || [], e[w] || []);
    for (const D of x)
      yf(D, R) || E.removeAttribute(D.nodeName);
  }
  return p.body.innerHTML;
}
const bf = "TemplateFactory", Tf = {
  allowList: Uo,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: "",
  html: !1,
  sanitize: !0,
  sanitizeFn: null,
  template: "<div></div>"
}, Af = {
  allowList: "object",
  content: "object",
  extraClass: "(string|function)",
  html: "boolean",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  template: "string"
}, wf = {
  entry: "(string|element|function|null)",
  selector: "(string|element)"
};
class Cf extends jn {
  constructor(e) {
    super(), this._config = this._getConfig(e);
  }
  // Getters
  static get Default() {
    return Tf;
  }
  static get DefaultType() {
    return Af;
  }
  static get NAME() {
    return bf;
  }
  // Public
  getContent() {
    return Object.values(this._config.content).map((e) => this._resolvePossibleFunction(e)).filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(e) {
    return this._checkContent(e), this._config.content = {
      ...this._config.content,
      ...e
    }, this;
  }
  toHtml() {
    const e = document.createElement("div");
    e.innerHTML = this._maybeSanitize(this._config.template);
    for (const [p, v] of Object.entries(this._config.content))
      this._setContent(e, v, p);
    const r = e.children[0], f = this._resolvePossibleFunction(this._config.extraClass);
    return f && r.classList.add(...f.split(" ")), r;
  }
  // Private
  _typeCheckConfig(e) {
    super._typeCheckConfig(e), this._checkContent(e.content);
  }
  _checkContent(e) {
    for (const [r, f] of Object.entries(e))
      super._typeCheckConfig({
        selector: r,
        entry: f
      }, wf);
  }
  _setContent(e, r, f) {
    const p = V.findOne(f, e);
    if (p) {
      if (r = this._resolvePossibleFunction(r), !r) {
        p.remove();
        return;
      }
      if (le(r)) {
        this._putElementInTemplate(Ae(r), p);
        return;
      }
      if (this._config.html) {
        p.innerHTML = this._maybeSanitize(r);
        return;
      }
      p.textContent = r;
    }
  }
  _maybeSanitize(e) {
    return this._config.sanitize ? Ef(e, this._config.allowList, this._config.sanitizeFn) : e;
  }
  _resolvePossibleFunction(e) {
    return xt(e, [this]);
  }
  _putElementInTemplate(e, r) {
    if (this._config.html) {
      r.innerHTML = "", r.append(e);
      return;
    }
    r.textContent = e.textContent;
  }
}
const Sf = "tooltip", xf = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]), tr = "fade", Nf = "modal", ri = "show", Of = ".tooltip-inner", js = `.${Nf}`, Vs = "hide.bs.modal", In = "hover", er = "focus", Df = "click", Lf = "manual", $f = "hide", If = "hidden", kf = "show", Pf = "shown", Mf = "inserted", Rf = "click", Hf = "focusin", jf = "focusout", Vf = "mouseenter", Wf = "mouseleave", qf = {
  AUTO: "auto",
  TOP: "top",
  RIGHT: Vt() ? "left" : "right",
  BOTTOM: "bottom",
  LEFT: Vt() ? "right" : "left"
}, Ff = {
  allowList: Uo,
  animation: !0,
  boundary: "clippingParents",
  container: !1,
  customClass: "",
  delay: 0,
  fallbackPlacements: ["top", "right", "bottom", "left"],
  html: !1,
  offset: [0, 6],
  placement: "top",
  popperConfig: null,
  sanitize: !0,
  sanitizeFn: null,
  selector: !1,
  template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  title: "",
  trigger: "hover focus"
}, Bf = {
  allowList: "object",
  animation: "boolean",
  boundary: "(string|element)",
  container: "(string|element|boolean)",
  customClass: "(string|function)",
  delay: "(number|object)",
  fallbackPlacements: "array",
  html: "boolean",
  offset: "(array|string|function)",
  placement: "(string|function)",
  popperConfig: "(null|object|function)",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  selector: "(string|boolean)",
  template: "string",
  title: "(string|element|function)",
  trigger: "string"
};
class bn extends Yt {
  constructor(e, r) {
    if (typeof Eo > "u")
      throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
    super(e, r), this._isEnabled = !0, this._timeout = 0, this._isHovered = null, this._activeTrigger = {}, this._popper = null, this._templateFactory = null, this._newContent = null, this.tip = null, this._setListeners(), this._config.selector || this._fixTitle();
  }
  // Getters
  static get Default() {
    return Ff;
  }
  static get DefaultType() {
    return Bf;
  }
  static get NAME() {
    return Sf;
  }
  // Public
  enable() {
    this._isEnabled = !0;
  }
  disable() {
    this._isEnabled = !1;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    if (this._isEnabled) {
      if (this._activeTrigger.click = !this._activeTrigger.click, this._isShown()) {
        this._leave();
        return;
      }
      this._enter();
    }
  }
  dispose() {
    clearTimeout(this._timeout), N.off(this._element.closest(js), Vs, this._hideModalHandler), this._element.getAttribute("data-bs-original-title") && this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title")), this._disposePopper(), super.dispose();
  }
  show() {
    if (this._element.style.display === "none")
      throw new Error("Please use show on visible elements");
    if (!(this._isWithContent() && this._isEnabled))
      return;
    const e = N.trigger(this._element, this.constructor.eventName(kf)), f = (Ao(this._element) || this._element.ownerDocument.documentElement).contains(this._element);
    if (e.defaultPrevented || !f)
      return;
    this._disposePopper();
    const p = this._getTipElement();
    this._element.setAttribute("aria-describedby", p.getAttribute("id"));
    const {
      container: v
    } = this._config;
    if (this._element.ownerDocument.documentElement.contains(this.tip) || (v.append(p), N.trigger(this._element, this.constructor.eventName(Mf))), this._popper = this._createPopper(p), p.classList.add(ri), "ontouchstart" in document.documentElement)
      for (const w of [].concat(...document.body.children))
        N.on(w, "mouseover", di);
    const E = () => {
      N.trigger(this._element, this.constructor.eventName(Pf)), this._isHovered === !1 && this._leave(), this._isHovered = !1;
    };
    this._queueCallback(E, this.tip, this._isAnimated());
  }
  hide() {
    if (!this._isShown() || N.trigger(this._element, this.constructor.eventName($f)).defaultPrevented)
      return;
    if (this._getTipElement().classList.remove(ri), "ontouchstart" in document.documentElement)
      for (const p of [].concat(...document.body.children))
        N.off(p, "mouseover", di);
    this._activeTrigger[Df] = !1, this._activeTrigger[er] = !1, this._activeTrigger[In] = !1, this._isHovered = null;
    const f = () => {
      this._isWithActiveTrigger() || (this._isHovered || this._disposePopper(), this._element.removeAttribute("aria-describedby"), N.trigger(this._element, this.constructor.eventName(If)));
    };
    this._queueCallback(f, this.tip, this._isAnimated());
  }
  update() {
    this._popper && this._popper.update();
  }
  // Protected
  _isWithContent() {
    return !!this._getTitle();
  }
  _getTipElement() {
    return this.tip || (this.tip = this._createTipElement(this._newContent || this._getContentForTemplate())), this.tip;
  }
  _createTipElement(e) {
    const r = this._getTemplateFactory(e).toHtml();
    if (!r)
      return null;
    r.classList.remove(tr, ri), r.classList.add(`bs-${this.constructor.NAME}-auto`);
    const f = Ou(this.constructor.NAME).toString();
    return r.setAttribute("id", f), this._isAnimated() && r.classList.add(tr), r;
  }
  setContent(e) {
    this._newContent = e, this._isShown() && (this._disposePopper(), this.show());
  }
  _getTemplateFactory(e) {
    return this._templateFactory ? this._templateFactory.changeContent(e) : this._templateFactory = new Cf({
      ...this._config,
      // the `content` var has to be after `this._config`
      // to override config.content in case of popover
      content: e,
      extraClass: this._resolvePossibleFunction(this._config.customClass)
    }), this._templateFactory;
  }
  _getContentForTemplate() {
    return {
      [Of]: this._getTitle()
    };
  }
  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title");
  }
  // Private
  _initializeOnDelegatedTarget(e) {
    return this.constructor.getOrCreateInstance(e.delegateTarget, this._getDelegateConfig());
  }
  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(tr);
  }
  _isShown() {
    return this.tip && this.tip.classList.contains(ri);
  }
  _createPopper(e) {
    const r = xt(this._config.placement, [this, e, this._element]), f = qf[r.toUpperCase()];
    return Sr(this._element, e, this._getPopperConfig(f));
  }
  _getOffset() {
    const {
      offset: e
    } = this._config;
    return typeof e == "string" ? e.split(",").map((r) => Number.parseInt(r, 10)) : typeof e == "function" ? (r) => e(r, this._element) : e;
  }
  _resolvePossibleFunction(e) {
    return xt(e, [this._element]);
  }
  _getPopperConfig(e) {
    const r = {
      placement: e,
      modifiers: [{
        name: "flip",
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: "offset",
        options: {
          offset: this._getOffset()
        }
      }, {
        name: "preventOverflow",
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: "arrow",
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: "preSetPlacement",
        enabled: !0,
        phase: "beforeMain",
        fn: (f) => {
          this._getTipElement().setAttribute("data-popper-placement", f.state.placement);
        }
      }]
    };
    return {
      ...r,
      ...xt(this._config.popperConfig, [r])
    };
  }
  _setListeners() {
    const e = this._config.trigger.split(" ");
    for (const r of e)
      if (r === "click")
        N.on(this._element, this.constructor.eventName(Rf), this._config.selector, (f) => {
          this._initializeOnDelegatedTarget(f).toggle();
        });
      else if (r !== Lf) {
        const f = r === In ? this.constructor.eventName(Vf) : this.constructor.eventName(Hf), p = r === In ? this.constructor.eventName(Wf) : this.constructor.eventName(jf);
        N.on(this._element, f, this._config.selector, (v) => {
          const E = this._initializeOnDelegatedTarget(v);
          E._activeTrigger[v.type === "focusin" ? er : In] = !0, E._enter();
        }), N.on(this._element, p, this._config.selector, (v) => {
          const E = this._initializeOnDelegatedTarget(v);
          E._activeTrigger[v.type === "focusout" ? er : In] = E._element.contains(v.relatedTarget), E._leave();
        });
      }
    this._hideModalHandler = () => {
      this._element && this.hide();
    }, N.on(this._element.closest(js), Vs, this._hideModalHandler);
  }
  _fixTitle() {
    const e = this._element.getAttribute("title");
    e && (!this._element.getAttribute("aria-label") && !this._element.textContent.trim() && this._element.setAttribute("aria-label", e), this._element.setAttribute("data-bs-original-title", e), this._element.removeAttribute("title"));
  }
  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = !0;
      return;
    }
    this._isHovered = !0, this._setTimeout(() => {
      this._isHovered && this.show();
    }, this._config.delay.show);
  }
  _leave() {
    this._isWithActiveTrigger() || (this._isHovered = !1, this._setTimeout(() => {
      this._isHovered || this.hide();
    }, this._config.delay.hide));
  }
  _setTimeout(e, r) {
    clearTimeout(this._timeout), this._timeout = setTimeout(e, r);
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(!0);
  }
  _getConfig(e) {
    const r = fe.getDataAttributes(this._element);
    for (const f of Object.keys(r))
      xf.has(f) && delete r[f];
    return e = {
      ...r,
      ...typeof e == "object" && e ? e : {}
    }, e = this._mergeConfigObj(e), e = this._configAfterMerge(e), this._typeCheckConfig(e), e;
  }
  _configAfterMerge(e) {
    return e.container = e.container === !1 ? document.body : Ae(e.container), typeof e.delay == "number" && (e.delay = {
      show: e.delay,
      hide: e.delay
    }), typeof e.title == "number" && (e.title = e.title.toString()), typeof e.content == "number" && (e.content = e.content.toString()), e;
  }
  _getDelegateConfig() {
    const e = {};
    for (const [r, f] of Object.entries(this._config))
      this.constructor.Default[r] !== f && (e[r] = f);
    return e.selector = !1, e.trigger = "manual", e;
  }
  _disposePopper() {
    this._popper && (this._popper.destroy(), this._popper = null), this.tip && (this.tip.remove(), this.tip = null);
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = bn.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (typeof r[e] > "u")
          throw new TypeError(`No method named "${e}"`);
        r[e]();
      }
    });
  }
}
qt(bn);
const Kf = "popover", Yf = ".popover-header", Uf = ".popover-body", zf = {
  ...bn.Default,
  content: "",
  offset: [0, 8],
  placement: "right",
  template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
  trigger: "click"
}, Gf = {
  ...bn.DefaultType,
  content: "(null|string|element|function)"
};
class Dr extends bn {
  // Getters
  static get Default() {
    return zf;
  }
  static get DefaultType() {
    return Gf;
  }
  static get NAME() {
    return Kf;
  }
  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }
  // Private
  _getContentForTemplate() {
    return {
      [Yf]: this._getTitle(),
      [Uf]: this._getContent()
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = Dr.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (typeof r[e] > "u")
          throw new TypeError(`No method named "${e}"`);
        r[e]();
      }
    });
  }
}
qt(Dr);
const Xf = "scrollspy", Qf = "bs.scrollspy", Lr = `.${Qf}`, Jf = ".data-api", Zf = `activate${Lr}`, Ws = `click${Lr}`, td = `load${Lr}${Jf}`, ed = "dropdown-item", on = "active", nd = '[data-bs-spy="scroll"]', nr = "[href]", id = ".nav, .list-group", qs = ".nav-link", rd = ".nav-item", sd = ".list-group-item", od = `${qs}, ${rd} > ${qs}, ${sd}`, ad = ".dropdown", ud = ".dropdown-toggle", cd = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: "0px 0px -25%",
  smoothScroll: !1,
  target: null,
  threshold: [0.1, 0.5, 1]
}, ld = {
  offset: "(number|null)",
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: "string",
  smoothScroll: "boolean",
  target: "element",
  threshold: "array"
};
class bi extends Yt {
  constructor(e, r) {
    super(e, r), this._targetLinks = /* @__PURE__ */ new Map(), this._observableSections = /* @__PURE__ */ new Map(), this._rootElement = getComputedStyle(this._element).overflowY === "visible" ? null : this._element, this._activeTarget = null, this._observer = null, this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    }, this.refresh();
  }
  // Getters
  static get Default() {
    return cd;
  }
  static get DefaultType() {
    return ld;
  }
  static get NAME() {
    return Xf;
  }
  // Public
  refresh() {
    this._initializeTargetsAndObservables(), this._maybeEnableSmoothScroll(), this._observer ? this._observer.disconnect() : this._observer = this._getNewObserver();
    for (const e of this._observableSections.values())
      this._observer.observe(e);
  }
  dispose() {
    this._observer.disconnect(), super.dispose();
  }
  // Private
  _configAfterMerge(e) {
    return e.target = Ae(e.target) || document.body, e.rootMargin = e.offset ? `${e.offset}px 0px -30%` : e.rootMargin, typeof e.threshold == "string" && (e.threshold = e.threshold.split(",").map((r) => Number.parseFloat(r))), e;
  }
  _maybeEnableSmoothScroll() {
    this._config.smoothScroll && (N.off(this._config.target, Ws), N.on(this._config.target, Ws, nr, (e) => {
      const r = this._observableSections.get(e.target.hash);
      if (r) {
        e.preventDefault();
        const f = this._rootElement || window, p = r.offsetTop - this._element.offsetTop;
        if (f.scrollTo) {
          f.scrollTo({
            top: p,
            behavior: "smooth"
          });
          return;
        }
        f.scrollTop = p;
      }
    }));
  }
  _getNewObserver() {
    const e = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver((r) => this._observerCallback(r), e);
  }
  // The logic of selection
  _observerCallback(e) {
    const r = (E) => this._targetLinks.get(`#${E.target.id}`), f = (E) => {
      this._previousScrollData.visibleEntryTop = E.target.offsetTop, this._process(r(E));
    }, p = (this._rootElement || document.documentElement).scrollTop, v = p >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = p;
    for (const E of e) {
      if (!E.isIntersecting) {
        this._activeTarget = null, this._clearActiveClass(r(E));
        continue;
      }
      const w = E.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      if (v && w) {
        if (f(E), !p)
          return;
        continue;
      }
      !v && !w && f(E);
    }
  }
  _initializeTargetsAndObservables() {
    this._targetLinks = /* @__PURE__ */ new Map(), this._observableSections = /* @__PURE__ */ new Map();
    const e = V.find(nr, this._config.target);
    for (const r of e) {
      if (!r.hash || we(r))
        continue;
      const f = V.findOne(decodeURI(r.hash), this._element);
      yn(f) && (this._targetLinks.set(decodeURI(r.hash), r), this._observableSections.set(r.hash, f));
    }
  }
  _process(e) {
    this._activeTarget !== e && (this._clearActiveClass(this._config.target), this._activeTarget = e, e.classList.add(on), this._activateParents(e), N.trigger(this._element, Zf, {
      relatedTarget: e
    }));
  }
  _activateParents(e) {
    if (e.classList.contains(ed)) {
      V.findOne(ud, e.closest(ad)).classList.add(on);
      return;
    }
    for (const r of V.parents(e, id))
      for (const f of V.prev(r, od))
        f.classList.add(on);
  }
  _clearActiveClass(e) {
    e.classList.remove(on);
    const r = V.find(`${nr}.${on}`, e);
    for (const f of r)
      f.classList.remove(on);
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = bi.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (r[e] === void 0 || e.startsWith("_") || e === "constructor")
          throw new TypeError(`No method named "${e}"`);
        r[e]();
      }
    });
  }
}
N.on(window, td, () => {
  for (const a of V.find(nd))
    bi.getOrCreateInstance(a);
});
qt(bi);
const fd = "tab", dd = "bs.tab", Be = `.${dd}`, hd = `hide${Be}`, pd = `hidden${Be}`, gd = `show${Be}`, md = `shown${Be}`, _d = `click${Be}`, vd = `keydown${Be}`, yd = `load${Be}`, Ed = "ArrowLeft", Fs = "ArrowRight", bd = "ArrowUp", Bs = "ArrowDown", ir = "Home", Ks = "End", je = "active", Ys = "fade", rr = "show", Td = "dropdown", zo = ".dropdown-toggle", Ad = ".dropdown-menu", sr = `:not(${zo})`, wd = '.list-group, .nav, [role="tablist"]', Cd = ".nav-item, .list-group-item", Sd = `.nav-link${sr}, .list-group-item${sr}, [role="tab"]${sr}`, Go = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]', or = `${Sd}, ${Go}`, xd = `.${je}[data-bs-toggle="tab"], .${je}[data-bs-toggle="pill"], .${je}[data-bs-toggle="list"]`;
class _n extends Yt {
  constructor(e) {
    super(e), this._parent = this._element.closest(wd), this._parent && (this._setInitialAttributes(this._parent, this._getChildren()), N.on(this._element, vd, (r) => this._keydown(r)));
  }
  // Getters
  static get NAME() {
    return fd;
  }
  // Public
  show() {
    const e = this._element;
    if (this._elemIsActive(e))
      return;
    const r = this._getActiveElem(), f = r ? N.trigger(r, hd, {
      relatedTarget: e
    }) : null;
    N.trigger(e, gd, {
      relatedTarget: r
    }).defaultPrevented || f && f.defaultPrevented || (this._deactivate(r, e), this._activate(e, r));
  }
  // Private
  _activate(e, r) {
    if (!e)
      return;
    e.classList.add(je), this._activate(V.getElementFromSelector(e));
    const f = () => {
      if (e.getAttribute("role") !== "tab") {
        e.classList.add(rr);
        return;
      }
      e.removeAttribute("tabindex"), e.setAttribute("aria-selected", !0), this._toggleDropDown(e, !0), N.trigger(e, md, {
        relatedTarget: r
      });
    };
    this._queueCallback(f, e, e.classList.contains(Ys));
  }
  _deactivate(e, r) {
    if (!e)
      return;
    e.classList.remove(je), e.blur(), this._deactivate(V.getElementFromSelector(e));
    const f = () => {
      if (e.getAttribute("role") !== "tab") {
        e.classList.remove(rr);
        return;
      }
      e.setAttribute("aria-selected", !1), e.setAttribute("tabindex", "-1"), this._toggleDropDown(e, !1), N.trigger(e, pd, {
        relatedTarget: r
      });
    };
    this._queueCallback(f, e, e.classList.contains(Ys));
  }
  _keydown(e) {
    if (![Ed, Fs, bd, Bs, ir, Ks].includes(e.key))
      return;
    e.stopPropagation(), e.preventDefault();
    const r = this._getChildren().filter((p) => !we(p));
    let f;
    if ([ir, Ks].includes(e.key))
      f = r[e.key === ir ? 0 : r.length - 1];
    else {
      const p = [Fs, Bs].includes(e.key);
      f = xr(r, e.target, p, !0);
    }
    f && (f.focus({
      preventScroll: !0
    }), _n.getOrCreateInstance(f).show());
  }
  _getChildren() {
    return V.find(or, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find((e) => this._elemIsActive(e)) || null;
  }
  _setInitialAttributes(e, r) {
    this._setAttributeIfNotExists(e, "role", "tablist");
    for (const f of r)
      this._setInitialAttributesOnChild(f);
  }
  _setInitialAttributesOnChild(e) {
    e = this._getInnerElement(e);
    const r = this._elemIsActive(e), f = this._getOuterElement(e);
    e.setAttribute("aria-selected", r), f !== e && this._setAttributeIfNotExists(f, "role", "presentation"), r || e.setAttribute("tabindex", "-1"), this._setAttributeIfNotExists(e, "role", "tab"), this._setInitialAttributesOnTargetPanel(e);
  }
  _setInitialAttributesOnTargetPanel(e) {
    const r = V.getElementFromSelector(e);
    r && (this._setAttributeIfNotExists(r, "role", "tabpanel"), e.id && this._setAttributeIfNotExists(r, "aria-labelledby", `${e.id}`));
  }
  _toggleDropDown(e, r) {
    const f = this._getOuterElement(e);
    if (!f.classList.contains(Td))
      return;
    const p = (v, E) => {
      const w = V.findOne(v, f);
      w && w.classList.toggle(E, r);
    };
    p(zo, je), p(Ad, rr), f.setAttribute("aria-expanded", r);
  }
  _setAttributeIfNotExists(e, r, f) {
    e.hasAttribute(r) || e.setAttribute(r, f);
  }
  _elemIsActive(e) {
    return e.classList.contains(je);
  }
  // Try to get the inner element (usually the .nav-link)
  _getInnerElement(e) {
    return e.matches(or) ? e : V.findOne(or, e);
  }
  // Try to get the outer element (usually the .nav-item)
  _getOuterElement(e) {
    return e.closest(Cd) || e;
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = _n.getOrCreateInstance(this);
      if (typeof e == "string") {
        if (r[e] === void 0 || e.startsWith("_") || e === "constructor")
          throw new TypeError(`No method named "${e}"`);
        r[e]();
      }
    });
  }
}
N.on(document, _d, Go, function(a) {
  ["A", "AREA"].includes(this.tagName) && a.preventDefault(), !we(this) && _n.getOrCreateInstance(this).show();
});
N.on(window, yd, () => {
  for (const a of V.find(xd))
    _n.getOrCreateInstance(a);
});
qt(_n);
const Nd = "toast", Od = "bs.toast", Ne = `.${Od}`, Dd = `mouseover${Ne}`, Ld = `mouseout${Ne}`, $d = `focusin${Ne}`, Id = `focusout${Ne}`, kd = `hide${Ne}`, Pd = `hidden${Ne}`, Md = `show${Ne}`, Rd = `shown${Ne}`, Hd = "fade", Us = "hide", si = "show", oi = "showing", jd = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
}, Vd = {
  animation: !0,
  autohide: !0,
  delay: 5e3
};
class Ti extends Yt {
  constructor(e, r) {
    super(e, r), this._timeout = null, this._hasMouseInteraction = !1, this._hasKeyboardInteraction = !1, this._setListeners();
  }
  // Getters
  static get Default() {
    return Vd;
  }
  static get DefaultType() {
    return jd;
  }
  static get NAME() {
    return Nd;
  }
  // Public
  show() {
    if (N.trigger(this._element, Md).defaultPrevented)
      return;
    this._clearTimeout(), this._config.animation && this._element.classList.add(Hd);
    const r = () => {
      this._element.classList.remove(oi), N.trigger(this._element, Rd), this._maybeScheduleHide();
    };
    this._element.classList.remove(Us), Hn(this._element), this._element.classList.add(si, oi), this._queueCallback(r, this._element, this._config.animation);
  }
  hide() {
    if (!this.isShown() || N.trigger(this._element, kd).defaultPrevented)
      return;
    const r = () => {
      this._element.classList.add(Us), this._element.classList.remove(oi, si), N.trigger(this._element, Pd);
    };
    this._element.classList.add(oi), this._queueCallback(r, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout(), this.isShown() && this._element.classList.remove(si), super.dispose();
  }
  isShown() {
    return this._element.classList.contains(si);
  }
  // Private
  _maybeScheduleHide() {
    this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay)));
  }
  _onInteraction(e, r) {
    switch (e.type) {
      case "mouseover":
      case "mouseout": {
        this._hasMouseInteraction = r;
        break;
      }
      case "focusin":
      case "focusout": {
        this._hasKeyboardInteraction = r;
        break;
      }
    }
    if (r) {
      this._clearTimeout();
      return;
    }
    const f = e.relatedTarget;
    this._element === f || this._element.contains(f) || this._maybeScheduleHide();
  }
  _setListeners() {
    N.on(this._element, Dd, (e) => this._onInteraction(e, !0)), N.on(this._element, Ld, (e) => this._onInteraction(e, !1)), N.on(this._element, $d, (e) => this._onInteraction(e, !0)), N.on(this._element, Id, (e) => this._onInteraction(e, !1));
  }
  _clearTimeout() {
    clearTimeout(this._timeout), this._timeout = null;
  }
  // Static
  static jQueryInterface(e) {
    return this.each(function() {
      const r = Ti.getOrCreateInstance(this, e);
      if (typeof e == "string") {
        if (typeof r[e] > "u")
          throw new TypeError(`No method named "${e}"`);
        r[e](this);
      }
    });
  }
}
vi(Ti);
qt(Ti);
function Wd(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var li = { exports: {} };
/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
var qd = li.exports, zs;
function Fd() {
  return zs || (zs = 1, function(a) {
    (function(e, r) {
      a.exports = e.document ? r(e, !0) : function(f) {
        if (!f.document)
          throw new Error("jQuery requires a window with a document");
        return r(f);
      };
    })(typeof window < "u" ? window : qd, function(e, r) {
      var f = [], p = Object.getPrototypeOf, v = f.slice, E = f.flat ? function(t) {
        return f.flat.call(t);
      } : function(t) {
        return f.concat.apply([], t);
      }, w = f.push, x = f.indexOf, R = {}, D = R.toString, F = R.hasOwnProperty, X = F.toString, B = X.call(Object), M = {}, $ = function(n) {
        return typeof n == "function" && typeof n.nodeType != "number" && typeof n.item != "function";
      }, J = function(n) {
        return n != null && n === n.window;
      }, P = e.document, ct = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
      };
      function ut(t, n, i) {
        i = i || P;
        var s, u, c = i.createElement("script");
        if (c.text = t, n)
          for (s in ct)
            u = n[s] || n.getAttribute && n.getAttribute(s), u && c.setAttribute(s, u);
        i.head.appendChild(c).parentNode.removeChild(c);
      }
      function G(t) {
        return t == null ? t + "" : typeof t == "object" || typeof t == "function" ? R[D.call(t)] || "object" : typeof t;
      }
      var rt = "3.7.1", st = /HTML$/i, o = function(t, n) {
        return new o.fn.init(t, n);
      };
      o.fn = o.prototype = {
        // The current version of jQuery being used
        jquery: rt,
        constructor: o,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return v.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(t) {
          return t == null ? v.call(this) : t < 0 ? this[t + this.length] : this[t];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(t) {
          var n = o.merge(this.constructor(), t);
          return n.prevObject = this, n;
        },
        // Execute a callback for every element in the matched set.
        each: function(t) {
          return o.each(this, t);
        },
        map: function(t) {
          return this.pushStack(o.map(this, function(n, i) {
            return t.call(n, i, n);
          }));
        },
        slice: function() {
          return this.pushStack(v.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(o.grep(this, function(t, n) {
            return (n + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(o.grep(this, function(t, n) {
            return n % 2;
          }));
        },
        eq: function(t) {
          var n = this.length, i = +t + (t < 0 ? n : 0);
          return this.pushStack(i >= 0 && i < n ? [this[i]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: w,
        sort: f.sort,
        splice: f.splice
      }, o.extend = o.fn.extend = function() {
        var t, n, i, s, u, c, l = arguments[0] || {}, g = 1, h = arguments.length, _ = !1;
        for (typeof l == "boolean" && (_ = l, l = arguments[g] || {}, g++), typeof l != "object" && !$(l) && (l = {}), g === h && (l = this, g--); g < h; g++)
          if ((t = arguments[g]) != null)
            for (n in t)
              s = t[n], !(n === "__proto__" || l === s) && (_ && s && (o.isPlainObject(s) || (u = Array.isArray(s))) ? (i = l[n], u && !Array.isArray(i) ? c = [] : !u && !o.isPlainObject(i) ? c = {} : c = i, u = !1, l[n] = o.extend(_, c, s)) : s !== void 0 && (l[n] = s));
        return l;
      }, o.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (rt + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: !0,
        error: function(t) {
          throw new Error(t);
        },
        noop: function() {
        },
        isPlainObject: function(t) {
          var n, i;
          return !t || D.call(t) !== "[object Object]" ? !1 : (n = p(t), n ? (i = F.call(n, "constructor") && n.constructor, typeof i == "function" && X.call(i) === B) : !0);
        },
        isEmptyObject: function(t) {
          var n;
          for (n in t)
            return !1;
          return !0;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(t, n, i) {
          ut(t, { nonce: n && n.nonce }, i);
        },
        each: function(t, n) {
          var i, s = 0;
          if (ft(t))
            for (i = t.length; s < i && n.call(t[s], s, t[s]) !== !1; s++)
              ;
          else
            for (s in t)
              if (n.call(t[s], s, t[s]) === !1)
                break;
          return t;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(t) {
          var n, i = "", s = 0, u = t.nodeType;
          if (!u)
            for (; n = t[s++]; )
              i += o.text(n);
          return u === 1 || u === 11 ? t.textContent : u === 9 ? t.documentElement.textContent : u === 3 || u === 4 ? t.nodeValue : i;
        },
        // results is for internal usage only
        makeArray: function(t, n) {
          var i = n || [];
          return t != null && (ft(Object(t)) ? o.merge(
            i,
            typeof t == "string" ? [t] : t
          ) : w.call(i, t)), i;
        },
        inArray: function(t, n, i) {
          return n == null ? -1 : x.call(n, t, i);
        },
        isXMLDoc: function(t) {
          var n = t && t.namespaceURI, i = t && (t.ownerDocument || t).documentElement;
          return !st.test(n || i && i.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(t, n) {
          for (var i = +n.length, s = 0, u = t.length; s < i; s++)
            t[u++] = n[s];
          return t.length = u, t;
        },
        grep: function(t, n, i) {
          for (var s, u = [], c = 0, l = t.length, g = !i; c < l; c++)
            s = !n(t[c], c), s !== g && u.push(t[c]);
          return u;
        },
        // arg is for internal usage only
        map: function(t, n, i) {
          var s, u, c = 0, l = [];
          if (ft(t))
            for (s = t.length; c < s; c++)
              u = n(t[c], c, i), u != null && l.push(u);
          else
            for (c in t)
              u = n(t[c], c, i), u != null && l.push(u);
          return E(l);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: M
      }), typeof Symbol == "function" && (o.fn[Symbol.iterator] = f[Symbol.iterator]), o.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(t, n) {
          R["[object " + n + "]"] = n.toLowerCase();
        }
      );
      function ft(t) {
        var n = !!t && "length" in t && t.length, i = G(t);
        return $(t) || J(t) ? !1 : i === "array" || n === 0 || typeof n == "number" && n > 0 && n - 1 in t;
      }
      function U(t, n) {
        return t.nodeName && t.nodeName.toLowerCase() === n.toLowerCase();
      }
      var dt = f.pop, gt = f.sort, Nt = f.splice, z = "[\\x20\\t\\r\\n\\f]", Ot = new RegExp(
        "^" + z + "+|((?:^|[^\\\\])(?:\\\\.)*)" + z + "+$",
        "g"
      );
      o.contains = function(t, n) {
        var i = n && n.parentNode;
        return t === i || !!(i && i.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (t.contains ? t.contains(i) : t.compareDocumentPosition && t.compareDocumentPosition(i) & 16));
      };
      var ne = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function yt(t, n) {
        return n ? t === "\0" ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t;
      }
      o.escapeSelector = function(t) {
        return (t + "").replace(ne, yt);
      };
      var ht = P, pe = w;
      (function() {
        var t, n, i, s, u, c = pe, l, g, h, _, A, S = o.expando, b = 0, O = 0, K = Xn(), nt = Xn(), Q = Xn(), _t = Xn(), pt = function(d, m) {
          return d === m && (u = !0), 0;
        }, zt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Gt = "(?:\\\\[\\da-fA-F]{1,6}" + z + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", et = "\\[" + z + "*(" + Gt + ")(?:" + z + // Operator (capture 2)
        "*([*^$|!~]?=)" + z + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + Gt + "))|)" + z + "*\\]", Me = ":(" + Gt + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + et + ")*)|.*)\\)|)", it = new RegExp(z + "+", "g"), lt = new RegExp("^" + z + "*," + z + "*"), On = new RegExp("^" + z + "*([>+~]|" + z + ")" + z + "*"), ji = new RegExp(z + "|>"), Xt = new RegExp(Me), Dn = new RegExp("^" + Gt + "$"), Qt = {
          ID: new RegExp("^#(" + Gt + ")"),
          CLASS: new RegExp("^\\.(" + Gt + ")"),
          TAG: new RegExp("^(" + Gt + "|[*])"),
          ATTR: new RegExp("^" + et),
          PSEUDO: new RegExp("^" + Me),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + z + "*(even|odd|(([+-]|)(\\d*)n|)" + z + "*(?:([+-]|)" + z + "*(\\d+)|))" + z + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + zt + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + z + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + z + "*((?:-\\d)?\\d*)" + z + "*\\)|)(?=[^-]|$)", "i")
        }, ye = /^(?:input|select|textarea|button)$/i, Ee = /^h\d$/i, Mt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Vi = /[+~]/, ue = new RegExp("\\\\[\\da-fA-F]{1,6}" + z + "?|\\\\([^\\r\\n\\f])", "g"), ce = function(d, m) {
          var y = "0x" + d.slice(1) - 65536;
          return m || (y < 0 ? String.fromCharCode(y + 65536) : String.fromCharCode(y >> 10 | 55296, y & 1023 | 56320));
        }, Ia = function() {
          be();
        }, ka = Jn(
          function(d) {
            return d.disabled === !0 && U(d, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function Pa() {
          try {
            return l.activeElement;
          } catch {
          }
        }
        try {
          c.apply(
            f = v.call(ht.childNodes),
            ht.childNodes
          ), f[ht.childNodes.length].nodeType;
        } catch {
          c = {
            apply: function(m, y) {
              pe.apply(m, v.call(y));
            },
            call: function(m) {
              pe.apply(m, v.call(arguments, 1));
            }
          };
        }
        function ot(d, m, y, T) {
          var C, L, I, j, k, Z, q, Y = m && m.ownerDocument, tt = m ? m.nodeType : 9;
          if (y = y || [], typeof d != "string" || !d || tt !== 1 && tt !== 9 && tt !== 11)
            return y;
          if (!T && (be(m), m = m || l, h)) {
            if (tt !== 11 && (k = Mt.exec(d)))
              if (C = k[1]) {
                if (tt === 9)
                  if (I = m.getElementById(C)) {
                    if (I.id === C)
                      return c.call(y, I), y;
                  } else
                    return y;
                else if (Y && (I = Y.getElementById(C)) && ot.contains(m, I) && I.id === C)
                  return c.call(y, I), y;
              } else {
                if (k[2])
                  return c.apply(y, m.getElementsByTagName(d)), y;
                if ((C = k[3]) && m.getElementsByClassName)
                  return c.apply(y, m.getElementsByClassName(C)), y;
              }
            if (!_t[d + " "] && (!_ || !_.test(d))) {
              if (q = d, Y = m, tt === 1 && (ji.test(d) || On.test(d))) {
                for (Y = Vi.test(d) && Wi(m.parentNode) || m, (Y != m || !M.scope) && ((j = m.getAttribute("id")) ? j = o.escapeSelector(j) : m.setAttribute("id", j = S)), Z = Ln(d), L = Z.length; L--; )
                  Z[L] = (j ? "#" + j : ":scope") + " " + Qn(Z[L]);
                q = Z.join(",");
              }
              try {
                return c.apply(
                  y,
                  Y.querySelectorAll(q)
                ), y;
              } catch {
                _t(d, !0);
              } finally {
                j === S && m.removeAttribute("id");
              }
            }
          }
          return fs(d.replace(Ot, "$1"), m, y, T);
        }
        function Xn() {
          var d = [];
          function m(y, T) {
            return d.push(y + " ") > n.cacheLength && delete m[d.shift()], m[y + " "] = T;
          }
          return m;
        }
        function Kt(d) {
          return d[S] = !0, d;
        }
        function nn(d) {
          var m = l.createElement("fieldset");
          try {
            return !!d(m);
          } catch {
            return !1;
          } finally {
            m.parentNode && m.parentNode.removeChild(m), m = null;
          }
        }
        function Ma(d) {
          return function(m) {
            return U(m, "input") && m.type === d;
          };
        }
        function Ra(d) {
          return function(m) {
            return (U(m, "input") || U(m, "button")) && m.type === d;
          };
        }
        function cs(d) {
          return function(m) {
            return "form" in m ? m.parentNode && m.disabled === !1 ? "label" in m ? "label" in m.parentNode ? m.parentNode.disabled === d : m.disabled === d : m.isDisabled === d || // Where there is no isDisabled, check manually
            m.isDisabled !== !d && ka(m) === d : m.disabled === d : "label" in m ? m.disabled === d : !1;
          };
        }
        function Re(d) {
          return Kt(function(m) {
            return m = +m, Kt(function(y, T) {
              for (var C, L = d([], y.length, m), I = L.length; I--; )
                y[C = L[I]] && (y[C] = !(T[C] = y[C]));
            });
          });
        }
        function Wi(d) {
          return d && typeof d.getElementsByTagName < "u" && d;
        }
        function be(d) {
          var m, y = d ? d.ownerDocument || d : ht;
          return y == l || y.nodeType !== 9 || !y.documentElement || (l = y, g = l.documentElement, h = !o.isXMLDoc(l), A = g.matches || g.webkitMatchesSelector || g.msMatchesSelector, g.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          ht != l && (m = l.defaultView) && m.top !== m && m.addEventListener("unload", Ia), M.getById = nn(function(T) {
            return g.appendChild(T).id = o.expando, !l.getElementsByName || !l.getElementsByName(o.expando).length;
          }), M.disconnectedMatch = nn(function(T) {
            return A.call(T, "*");
          }), M.scope = nn(function() {
            return l.querySelectorAll(":scope");
          }), M.cssHas = nn(function() {
            try {
              return l.querySelector(":has(*,:jqfake)"), !1;
            } catch {
              return !0;
            }
          }), M.getById ? (n.filter.ID = function(T) {
            var C = T.replace(ue, ce);
            return function(L) {
              return L.getAttribute("id") === C;
            };
          }, n.find.ID = function(T, C) {
            if (typeof C.getElementById < "u" && h) {
              var L = C.getElementById(T);
              return L ? [L] : [];
            }
          }) : (n.filter.ID = function(T) {
            var C = T.replace(ue, ce);
            return function(L) {
              var I = typeof L.getAttributeNode < "u" && L.getAttributeNode("id");
              return I && I.value === C;
            };
          }, n.find.ID = function(T, C) {
            if (typeof C.getElementById < "u" && h) {
              var L, I, j, k = C.getElementById(T);
              if (k) {
                if (L = k.getAttributeNode("id"), L && L.value === T)
                  return [k];
                for (j = C.getElementsByName(T), I = 0; k = j[I++]; )
                  if (L = k.getAttributeNode("id"), L && L.value === T)
                    return [k];
              }
              return [];
            }
          }), n.find.TAG = function(T, C) {
            return typeof C.getElementsByTagName < "u" ? C.getElementsByTagName(T) : C.querySelectorAll(T);
          }, n.find.CLASS = function(T, C) {
            if (typeof C.getElementsByClassName < "u" && h)
              return C.getElementsByClassName(T);
          }, _ = [], nn(function(T) {
            var C;
            g.appendChild(T).innerHTML = "<a id='" + S + "' href='' disabled='disabled'></a><select id='" + S + "-\r\\' disabled='disabled'><option selected=''></option></select>", T.querySelectorAll("[selected]").length || _.push("\\[" + z + "*(?:value|" + zt + ")"), T.querySelectorAll("[id~=" + S + "-]").length || _.push("~="), T.querySelectorAll("a#" + S + "+*").length || _.push(".#.+[+~]"), T.querySelectorAll(":checked").length || _.push(":checked"), C = l.createElement("input"), C.setAttribute("type", "hidden"), T.appendChild(C).setAttribute("name", "D"), g.appendChild(T).disabled = !0, T.querySelectorAll(":disabled").length !== 2 && _.push(":enabled", ":disabled"), C = l.createElement("input"), C.setAttribute("name", ""), T.appendChild(C), T.querySelectorAll("[name='']").length || _.push("\\[" + z + "*name" + z + "*=" + z + `*(?:''|"")`);
          }), M.cssHas || _.push(":has"), _ = _.length && new RegExp(_.join("|")), pt = function(T, C) {
            if (T === C)
              return u = !0, 0;
            var L = !T.compareDocumentPosition - !C.compareDocumentPosition;
            return L || (L = (T.ownerDocument || T) == (C.ownerDocument || C) ? T.compareDocumentPosition(C) : (
              // Otherwise we know they are disconnected
              1
            ), L & 1 || !M.sortDetached && C.compareDocumentPosition(T) === L ? T === l || T.ownerDocument == ht && ot.contains(ht, T) ? -1 : C === l || C.ownerDocument == ht && ot.contains(ht, C) ? 1 : s ? x.call(s, T) - x.call(s, C) : 0 : L & 4 ? -1 : 1);
          }), l;
        }
        ot.matches = function(d, m) {
          return ot(d, null, null, m);
        }, ot.matchesSelector = function(d, m) {
          if (be(d), h && !_t[m + " "] && (!_ || !_.test(m)))
            try {
              var y = A.call(d, m);
              if (y || M.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              d.document && d.document.nodeType !== 11)
                return y;
            } catch {
              _t(m, !0);
            }
          return ot(m, l, null, [d]).length > 0;
        }, ot.contains = function(d, m) {
          return (d.ownerDocument || d) != l && be(d), o.contains(d, m);
        }, ot.attr = function(d, m) {
          (d.ownerDocument || d) != l && be(d);
          var y = n.attrHandle[m.toLowerCase()], T = y && F.call(n.attrHandle, m.toLowerCase()) ? y(d, m, !h) : void 0;
          return T !== void 0 ? T : d.getAttribute(m);
        }, ot.error = function(d) {
          throw new Error("Syntax error, unrecognized expression: " + d);
        }, o.uniqueSort = function(d) {
          var m, y = [], T = 0, C = 0;
          if (u = !M.sortStable, s = !M.sortStable && v.call(d, 0), gt.call(d, pt), u) {
            for (; m = d[C++]; )
              m === d[C] && (T = y.push(C));
            for (; T--; )
              Nt.call(d, y[T], 1);
          }
          return s = null, d;
        }, o.fn.uniqueSort = function() {
          return this.pushStack(o.uniqueSort(v.apply(this)));
        }, n = o.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: Kt,
          match: Qt,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: !0 },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: !0 },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(d) {
              return d[1] = d[1].replace(ue, ce), d[3] = (d[3] || d[4] || d[5] || "").replace(ue, ce), d[2] === "~=" && (d[3] = " " + d[3] + " "), d.slice(0, 4);
            },
            CHILD: function(d) {
              return d[1] = d[1].toLowerCase(), d[1].slice(0, 3) === "nth" ? (d[3] || ot.error(d[0]), d[4] = +(d[4] ? d[5] + (d[6] || 1) : 2 * (d[3] === "even" || d[3] === "odd")), d[5] = +(d[7] + d[8] || d[3] === "odd")) : d[3] && ot.error(d[0]), d;
            },
            PSEUDO: function(d) {
              var m, y = !d[6] && d[2];
              return Qt.CHILD.test(d[0]) ? null : (d[3] ? d[2] = d[4] || d[5] || "" : y && Xt.test(y) && // Get excess from tokenize (recursively)
              (m = Ln(y, !0)) && // advance to the next closing parenthesis
              (m = y.indexOf(")", y.length - m) - y.length) && (d[0] = d[0].slice(0, m), d[2] = y.slice(0, m)), d.slice(0, 3));
            }
          },
          filter: {
            TAG: function(d) {
              var m = d.replace(ue, ce).toLowerCase();
              return d === "*" ? function() {
                return !0;
              } : function(y) {
                return U(y, m);
              };
            },
            CLASS: function(d) {
              var m = K[d + " "];
              return m || (m = new RegExp("(^|" + z + ")" + d + "(" + z + "|$)")) && K(d, function(y) {
                return m.test(
                  typeof y.className == "string" && y.className || typeof y.getAttribute < "u" && y.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(d, m, y) {
              return function(T) {
                var C = ot.attr(T, d);
                return C == null ? m === "!=" : m ? (C += "", m === "=" ? C === y : m === "!=" ? C !== y : m === "^=" ? y && C.indexOf(y) === 0 : m === "*=" ? y && C.indexOf(y) > -1 : m === "$=" ? y && C.slice(-y.length) === y : m === "~=" ? (" " + C.replace(it, " ") + " ").indexOf(y) > -1 : m === "|=" ? C === y || C.slice(0, y.length + 1) === y + "-" : !1) : !0;
              };
            },
            CHILD: function(d, m, y, T, C) {
              var L = d.slice(0, 3) !== "nth", I = d.slice(-4) !== "last", j = m === "of-type";
              return T === 1 && C === 0 ? (
                // Shortcut for :nth-*(n)
                function(k) {
                  return !!k.parentNode;
                }
              ) : function(k, Z, q) {
                var Y, tt, W, at, St, vt = L !== I ? "nextSibling" : "previousSibling", Rt = k.parentNode, Jt = j && k.nodeName.toLowerCase(), rn = !q && !j, Et = !1;
                if (Rt) {
                  if (L) {
                    for (; vt; ) {
                      for (W = k; W = W[vt]; )
                        if (j ? U(W, Jt) : W.nodeType === 1)
                          return !1;
                      St = vt = d === "only" && !St && "nextSibling";
                    }
                    return !0;
                  }
                  if (St = [I ? Rt.firstChild : Rt.lastChild], I && rn) {
                    for (tt = Rt[S] || (Rt[S] = {}), Y = tt[d] || [], at = Y[0] === b && Y[1], Et = at && Y[2], W = at && Rt.childNodes[at]; W = ++at && W && W[vt] || // Fallback to seeking `elem` from the start
                    (Et = at = 0) || St.pop(); )
                      if (W.nodeType === 1 && ++Et && W === k) {
                        tt[d] = [b, at, Et];
                        break;
                      }
                  } else if (rn && (tt = k[S] || (k[S] = {}), Y = tt[d] || [], at = Y[0] === b && Y[1], Et = at), Et === !1)
                    for (; (W = ++at && W && W[vt] || (Et = at = 0) || St.pop()) && !((j ? U(W, Jt) : W.nodeType === 1) && ++Et && (rn && (tt = W[S] || (W[S] = {}), tt[d] = [b, Et]), W === k)); )
                      ;
                  return Et -= C, Et === T || Et % T === 0 && Et / T >= 0;
                }
              };
            },
            PSEUDO: function(d, m) {
              var y, T = n.pseudos[d] || n.setFilters[d.toLowerCase()] || ot.error("unsupported pseudo: " + d);
              return T[S] ? T(m) : T.length > 1 ? (y = [d, d, "", m], n.setFilters.hasOwnProperty(d.toLowerCase()) ? Kt(function(C, L) {
                for (var I, j = T(C, m), k = j.length; k--; )
                  I = x.call(C, j[k]), C[I] = !(L[I] = j[k]);
              }) : function(C) {
                return T(C, 0, y);
              }) : T;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: Kt(function(d) {
              var m = [], y = [], T = Ki(d.replace(Ot, "$1"));
              return T[S] ? Kt(function(C, L, I, j) {
                for (var k, Z = T(C, null, j, []), q = C.length; q--; )
                  (k = Z[q]) && (C[q] = !(L[q] = k));
              }) : function(C, L, I) {
                return m[0] = C, T(m, null, I, y), m[0] = null, !y.pop();
              };
            }),
            has: Kt(function(d) {
              return function(m) {
                return ot(d, m).length > 0;
              };
            }),
            contains: Kt(function(d) {
              return d = d.replace(ue, ce), function(m) {
                return (m.textContent || o.text(m)).indexOf(d) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: Kt(function(d) {
              return Dn.test(d || "") || ot.error("unsupported lang: " + d), d = d.replace(ue, ce).toLowerCase(), function(m) {
                var y;
                do
                  if (y = h ? m.lang : m.getAttribute("xml:lang") || m.getAttribute("lang"))
                    return y = y.toLowerCase(), y === d || y.indexOf(d + "-") === 0;
                while ((m = m.parentNode) && m.nodeType === 1);
                return !1;
              };
            }),
            // Miscellaneous
            target: function(d) {
              var m = e.location && e.location.hash;
              return m && m.slice(1) === d.id;
            },
            root: function(d) {
              return d === g;
            },
            focus: function(d) {
              return d === Pa() && l.hasFocus() && !!(d.type || d.href || ~d.tabIndex);
            },
            // Boolean properties
            enabled: cs(!1),
            disabled: cs(!0),
            checked: function(d) {
              return U(d, "input") && !!d.checked || U(d, "option") && !!d.selected;
            },
            selected: function(d) {
              return d.parentNode && d.parentNode.selectedIndex, d.selected === !0;
            },
            // Contents
            empty: function(d) {
              for (d = d.firstChild; d; d = d.nextSibling)
                if (d.nodeType < 6)
                  return !1;
              return !0;
            },
            parent: function(d) {
              return !n.pseudos.empty(d);
            },
            // Element/input types
            header: function(d) {
              return Ee.test(d.nodeName);
            },
            input: function(d) {
              return ye.test(d.nodeName);
            },
            button: function(d) {
              return U(d, "input") && d.type === "button" || U(d, "button");
            },
            text: function(d) {
              var m;
              return U(d, "input") && d.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((m = d.getAttribute("type")) == null || m.toLowerCase() === "text");
            },
            // Position-in-collection
            first: Re(function() {
              return [0];
            }),
            last: Re(function(d, m) {
              return [m - 1];
            }),
            eq: Re(function(d, m, y) {
              return [y < 0 ? y + m : y];
            }),
            even: Re(function(d, m) {
              for (var y = 0; y < m; y += 2)
                d.push(y);
              return d;
            }),
            odd: Re(function(d, m) {
              for (var y = 1; y < m; y += 2)
                d.push(y);
              return d;
            }),
            lt: Re(function(d, m, y) {
              var T;
              for (y < 0 ? T = y + m : y > m ? T = m : T = y; --T >= 0; )
                d.push(T);
              return d;
            }),
            gt: Re(function(d, m, y) {
              for (var T = y < 0 ? y + m : y; ++T < m; )
                d.push(T);
              return d;
            })
          }
        }, n.pseudos.nth = n.pseudos.eq;
        for (t in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
          n.pseudos[t] = Ma(t);
        for (t in { submit: !0, reset: !0 })
          n.pseudos[t] = Ra(t);
        function ls() {
        }
        ls.prototype = n.filters = n.pseudos, n.setFilters = new ls();
        function Ln(d, m) {
          var y, T, C, L, I, j, k, Z = nt[d + " "];
          if (Z)
            return m ? 0 : Z.slice(0);
          for (I = d, j = [], k = n.preFilter; I; ) {
            (!y || (T = lt.exec(I))) && (T && (I = I.slice(T[0].length) || I), j.push(C = [])), y = !1, (T = On.exec(I)) && (y = T.shift(), C.push({
              value: y,
              // Cast descendant combinators to space
              type: T[0].replace(Ot, " ")
            }), I = I.slice(y.length));
            for (L in n.filter)
              (T = Qt[L].exec(I)) && (!k[L] || (T = k[L](T))) && (y = T.shift(), C.push({
                value: y,
                type: L,
                matches: T
              }), I = I.slice(y.length));
            if (!y)
              break;
          }
          return m ? I.length : I ? ot.error(d) : (
            // Cache the tokens
            nt(d, j).slice(0)
          );
        }
        function Qn(d) {
          for (var m = 0, y = d.length, T = ""; m < y; m++)
            T += d[m].value;
          return T;
        }
        function Jn(d, m, y) {
          var T = m.dir, C = m.next, L = C || T, I = y && L === "parentNode", j = O++;
          return m.first ? (
            // Check against closest ancestor/preceding element
            function(k, Z, q) {
              for (; k = k[T]; )
                if (k.nodeType === 1 || I)
                  return d(k, Z, q);
              return !1;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(k, Z, q) {
              var Y, tt, W = [b, j];
              if (q) {
                for (; k = k[T]; )
                  if ((k.nodeType === 1 || I) && d(k, Z, q))
                    return !0;
              } else
                for (; k = k[T]; )
                  if (k.nodeType === 1 || I)
                    if (tt = k[S] || (k[S] = {}), C && U(k, C))
                      k = k[T] || k;
                    else {
                      if ((Y = tt[L]) && Y[0] === b && Y[1] === j)
                        return W[2] = Y[2];
                      if (tt[L] = W, W[2] = d(k, Z, q))
                        return !0;
                    }
              return !1;
            }
          );
        }
        function qi(d) {
          return d.length > 1 ? function(m, y, T) {
            for (var C = d.length; C--; )
              if (!d[C](m, y, T))
                return !1;
            return !0;
          } : d[0];
        }
        function Ha(d, m, y) {
          for (var T = 0, C = m.length; T < C; T++)
            ot(d, m[T], y);
          return y;
        }
        function Zn(d, m, y, T, C) {
          for (var L, I = [], j = 0, k = d.length, Z = m != null; j < k; j++)
            (L = d[j]) && (!y || y(L, T, C)) && (I.push(L), Z && m.push(j));
          return I;
        }
        function Fi(d, m, y, T, C, L) {
          return T && !T[S] && (T = Fi(T)), C && !C[S] && (C = Fi(C, L)), Kt(function(I, j, k, Z) {
            var q, Y, tt, W, at = [], St = [], vt = j.length, Rt = I || Ha(
              m || "*",
              k.nodeType ? [k] : k,
              []
            ), Jt = d && (I || !m) ? Zn(Rt, at, d, k, Z) : Rt;
            if (y ? (W = C || (I ? d : vt || T) ? (
              // ...intermediate processing is necessary
              []
            ) : (
              // ...otherwise use results directly
              j
            ), y(Jt, W, k, Z)) : W = Jt, T)
              for (q = Zn(W, St), T(q, [], k, Z), Y = q.length; Y--; )
                (tt = q[Y]) && (W[St[Y]] = !(Jt[St[Y]] = tt));
            if (I) {
              if (C || d) {
                if (C) {
                  for (q = [], Y = W.length; Y--; )
                    (tt = W[Y]) && q.push(Jt[Y] = tt);
                  C(null, W = [], q, Z);
                }
                for (Y = W.length; Y--; )
                  (tt = W[Y]) && (q = C ? x.call(I, tt) : at[Y]) > -1 && (I[q] = !(j[q] = tt));
              }
            } else
              W = Zn(
                W === j ? W.splice(vt, W.length) : W
              ), C ? C(null, j, W, Z) : c.apply(j, W);
          });
        }
        function Bi(d) {
          for (var m, y, T, C = d.length, L = n.relative[d[0].type], I = L || n.relative[" "], j = L ? 1 : 0, k = Jn(function(Y) {
            return Y === m;
          }, I, !0), Z = Jn(function(Y) {
            return x.call(m, Y) > -1;
          }, I, !0), q = [function(Y, tt, W) {
            var at = !L && (W || tt != i) || ((m = tt).nodeType ? k(Y, tt, W) : Z(Y, tt, W));
            return m = null, at;
          }]; j < C; j++)
            if (y = n.relative[d[j].type])
              q = [Jn(qi(q), y)];
            else {
              if (y = n.filter[d[j].type].apply(null, d[j].matches), y[S]) {
                for (T = ++j; T < C && !n.relative[d[T].type]; T++)
                  ;
                return Fi(
                  j > 1 && qi(q),
                  j > 1 && Qn(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    d.slice(0, j - 1).concat({ value: d[j - 2].type === " " ? "*" : "" })
                  ).replace(Ot, "$1"),
                  y,
                  j < T && Bi(d.slice(j, T)),
                  T < C && Bi(d = d.slice(T)),
                  T < C && Qn(d)
                );
              }
              q.push(y);
            }
          return qi(q);
        }
        function ja(d, m) {
          var y = m.length > 0, T = d.length > 0, C = function(L, I, j, k, Z) {
            var q, Y, tt, W = 0, at = "0", St = L && [], vt = [], Rt = i, Jt = L || T && n.find.TAG("*", Z), rn = b += Rt == null ? 1 : Math.random() || 0.1, Et = Jt.length;
            for (Z && (i = I == l || I || Z); at !== Et && (q = Jt[at]) != null; at++) {
              if (T && q) {
                for (Y = 0, !I && q.ownerDocument != l && (be(q), j = !h); tt = d[Y++]; )
                  if (tt(q, I || l, j)) {
                    c.call(k, q);
                    break;
                  }
                Z && (b = rn);
              }
              y && ((q = !tt && q) && W--, L && St.push(q));
            }
            if (W += at, y && at !== W) {
              for (Y = 0; tt = m[Y++]; )
                tt(St, vt, I, j);
              if (L) {
                if (W > 0)
                  for (; at--; )
                    St[at] || vt[at] || (vt[at] = dt.call(k));
                vt = Zn(vt);
              }
              c.apply(k, vt), Z && !L && vt.length > 0 && W + m.length > 1 && o.uniqueSort(k);
            }
            return Z && (b = rn, i = Rt), St;
          };
          return y ? Kt(C) : C;
        }
        function Ki(d, m) {
          var y, T = [], C = [], L = Q[d + " "];
          if (!L) {
            for (m || (m = Ln(d)), y = m.length; y--; )
              L = Bi(m[y]), L[S] ? T.push(L) : C.push(L);
            L = Q(
              d,
              ja(C, T)
            ), L.selector = d;
          }
          return L;
        }
        function fs(d, m, y, T) {
          var C, L, I, j, k, Z = typeof d == "function" && d, q = !T && Ln(d = Z.selector || d);
          if (y = y || [], q.length === 1) {
            if (L = q[0] = q[0].slice(0), L.length > 2 && (I = L[0]).type === "ID" && m.nodeType === 9 && h && n.relative[L[1].type]) {
              if (m = (n.find.ID(
                I.matches[0].replace(ue, ce),
                m
              ) || [])[0], m)
                Z && (m = m.parentNode);
              else return y;
              d = d.slice(L.shift().value.length);
            }
            for (C = Qt.needsContext.test(d) ? 0 : L.length; C-- && (I = L[C], !n.relative[j = I.type]); )
              if ((k = n.find[j]) && (T = k(
                I.matches[0].replace(ue, ce),
                Vi.test(L[0].type) && Wi(m.parentNode) || m
              ))) {
                if (L.splice(C, 1), d = T.length && Qn(L), !d)
                  return c.apply(y, T), y;
                break;
              }
          }
          return (Z || Ki(d, q))(
            T,
            m,
            !h,
            y,
            !m || Vi.test(d) && Wi(m.parentNode) || m
          ), y;
        }
        M.sortStable = S.split("").sort(pt).join("") === S, be(), M.sortDetached = nn(function(d) {
          return d.compareDocumentPosition(l.createElement("fieldset")) & 1;
        }), o.find = ot, o.expr[":"] = o.expr.pseudos, o.unique = o.uniqueSort, ot.compile = Ki, ot.select = fs, ot.setDocument = be, ot.tokenize = Ln, ot.escape = o.escapeSelector, ot.getText = o.text, ot.isXML = o.isXMLDoc, ot.selectors = o.expr, ot.support = o.support, ot.uniqueSort = o.uniqueSort;
      })();
      var At = function(t, n, i) {
        for (var s = [], u = i !== void 0; (t = t[n]) && t.nodeType !== 9; )
          if (t.nodeType === 1) {
            if (u && o(t).is(i))
              break;
            s.push(t);
          }
        return s;
      }, Oe = function(t, n) {
        for (var i = []; t; t = t.nextSibling)
          t.nodeType === 1 && t !== n && i.push(t);
        return i;
      }, Ke = o.expr.match.needsContext, ge = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function me(t, n, i) {
        return $(n) ? o.grep(t, function(s, u) {
          return !!n.call(s, u, s) !== i;
        }) : n.nodeType ? o.grep(t, function(s) {
          return s === n !== i;
        }) : typeof n != "string" ? o.grep(t, function(s) {
          return x.call(n, s) > -1 !== i;
        }) : o.filter(n, t, i);
      }
      o.filter = function(t, n, i) {
        var s = n[0];
        return i && (t = ":not(" + t + ")"), n.length === 1 && s.nodeType === 1 ? o.find.matchesSelector(s, t) ? [s] : [] : o.find.matches(t, o.grep(n, function(u) {
          return u.nodeType === 1;
        }));
      }, o.fn.extend({
        find: function(t) {
          var n, i, s = this.length, u = this;
          if (typeof t != "string")
            return this.pushStack(o(t).filter(function() {
              for (n = 0; n < s; n++)
                if (o.contains(u[n], this))
                  return !0;
            }));
          for (i = this.pushStack([]), n = 0; n < s; n++)
            o.find(t, u[n], i);
          return s > 1 ? o.uniqueSort(i) : i;
        },
        filter: function(t) {
          return this.pushStack(me(this, t || [], !1));
        },
        not: function(t) {
          return this.pushStack(me(this, t || [], !0));
        },
        is: function(t) {
          return !!me(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof t == "string" && Ke.test(t) ? o(t) : t || [],
            !1
          ).length;
        }
      });
      var ie, Ut = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, De = o.fn.init = function(t, n, i) {
        var s, u;
        if (!t)
          return this;
        if (i = i || ie, typeof t == "string")
          if (t[0] === "<" && t[t.length - 1] === ">" && t.length >= 3 ? s = [null, t, null] : s = Ut.exec(t), s && (s[1] || !n))
            if (s[1]) {
              if (n = n instanceof o ? n[0] : n, o.merge(this, o.parseHTML(
                s[1],
                n && n.nodeType ? n.ownerDocument || n : P,
                !0
              )), ge.test(s[1]) && o.isPlainObject(n))
                for (s in n)
                  $(this[s]) ? this[s](n[s]) : this.attr(s, n[s]);
              return this;
            } else
              return u = P.getElementById(s[2]), u && (this[0] = u, this.length = 1), this;
          else return !n || n.jquery ? (n || i).find(t) : this.constructor(n).find(t);
        else {
          if (t.nodeType)
            return this[0] = t, this.length = 1, this;
          if ($(t))
            return i.ready !== void 0 ? i.ready(t) : (
              // Execute immediately if ready is not present
              t(o)
            );
        }
        return o.makeArray(t, this);
      };
      De.prototype = o.fn, ie = o(P);
      var Ye = /^(?:parents|prev(?:Until|All))/, re = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
      };
      o.fn.extend({
        has: function(t) {
          var n = o(t, this), i = n.length;
          return this.filter(function() {
            for (var s = 0; s < i; s++)
              if (o.contains(this, n[s]))
                return !0;
          });
        },
        closest: function(t, n) {
          var i, s = 0, u = this.length, c = [], l = typeof t != "string" && o(t);
          if (!Ke.test(t)) {
            for (; s < u; s++)
              for (i = this[s]; i && i !== n; i = i.parentNode)
                if (i.nodeType < 11 && (l ? l.index(i) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  i.nodeType === 1 && o.find.matchesSelector(i, t)
                ))) {
                  c.push(i);
                  break;
                }
          }
          return this.pushStack(c.length > 1 ? o.uniqueSort(c) : c);
        },
        // Determine the position of an element within the set
        index: function(t) {
          return t ? typeof t == "string" ? x.call(o(t), this[0]) : x.call(
            this,
            // If it receives a jQuery object, the first element is used
            t.jquery ? t[0] : t
          ) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        },
        add: function(t, n) {
          return this.pushStack(
            o.uniqueSort(
              o.merge(this.get(), o(t, n))
            )
          );
        },
        addBack: function(t) {
          return this.add(
            t == null ? this.prevObject : this.prevObject.filter(t)
          );
        }
      });
      function Ue(t, n) {
        for (; (t = t[n]) && t.nodeType !== 1; )
          ;
        return t;
      }
      o.each({
        parent: function(t) {
          var n = t.parentNode;
          return n && n.nodeType !== 11 ? n : null;
        },
        parents: function(t) {
          return At(t, "parentNode");
        },
        parentsUntil: function(t, n, i) {
          return At(t, "parentNode", i);
        },
        next: function(t) {
          return Ue(t, "nextSibling");
        },
        prev: function(t) {
          return Ue(t, "previousSibling");
        },
        nextAll: function(t) {
          return At(t, "nextSibling");
        },
        prevAll: function(t) {
          return At(t, "previousSibling");
        },
        nextUntil: function(t, n, i) {
          return At(t, "nextSibling", i);
        },
        prevUntil: function(t, n, i) {
          return At(t, "previousSibling", i);
        },
        siblings: function(t) {
          return Oe((t.parentNode || {}).firstChild, t);
        },
        children: function(t) {
          return Oe(t.firstChild);
        },
        contents: function(t) {
          return t.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          p(t.contentDocument) ? t.contentDocument : (U(t, "template") && (t = t.content || t), o.merge([], t.childNodes));
        }
      }, function(t, n) {
        o.fn[t] = function(i, s) {
          var u = o.map(this, n, i);
          return t.slice(-5) !== "Until" && (s = i), s && typeof s == "string" && (u = o.filter(s, u)), this.length > 1 && (re[t] || o.uniqueSort(u), Ye.test(t) && u.reverse()), this.pushStack(u);
        };
      });
      var kt = /[^\x20\t\r\n\f]+/g;
      function Tn(t) {
        var n = {};
        return o.each(t.match(kt) || [], function(i, s) {
          n[s] = !0;
        }), n;
      }
      o.Callbacks = function(t) {
        t = typeof t == "string" ? Tn(t) : o.extend({}, t);
        var n, i, s, u, c = [], l = [], g = -1, h = function() {
          for (u = u || t.once, s = n = !0; l.length; g = -1)
            for (i = l.shift(); ++g < c.length; )
              c[g].apply(i[0], i[1]) === !1 && t.stopOnFalse && (g = c.length, i = !1);
          t.memory || (i = !1), n = !1, u && (i ? c = [] : c = "");
        }, _ = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            return c && (i && !n && (g = c.length - 1, l.push(i)), function A(S) {
              o.each(S, function(b, O) {
                $(O) ? (!t.unique || !_.has(O)) && c.push(O) : O && O.length && G(O) !== "string" && A(O);
              });
            }(arguments), i && !n && h()), this;
          },
          // Remove a callback from the list
          remove: function() {
            return o.each(arguments, function(A, S) {
              for (var b; (b = o.inArray(S, c, b)) > -1; )
                c.splice(b, 1), b <= g && g--;
            }), this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(A) {
            return A ? o.inArray(A, c) > -1 : c.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            return c && (c = []), this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            return u = l = [], c = i = "", this;
          },
          disabled: function() {
            return !c;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            return u = l = [], !i && !n && (c = i = ""), this;
          },
          locked: function() {
            return !!u;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(A, S) {
            return u || (S = S || [], S = [A, S.slice ? S.slice() : S], l.push(S), n || h()), this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            return _.fireWith(this, arguments), this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!s;
          }
        };
        return _;
      };
      function _e(t) {
        return t;
      }
      function Le(t) {
        throw t;
      }
      function qn(t, n, i, s) {
        var u;
        try {
          t && $(u = t.promise) ? u.call(t).done(n).fail(i) : t && $(u = t.then) ? u.call(t, n, i) : n.apply(void 0, [t].slice(s));
        } catch (c) {
          i.apply(void 0, [c]);
        }
      }
      o.extend({
        Deferred: function(t) {
          var n = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              o.Callbacks("memory"),
              o.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              o.Callbacks("once memory"),
              o.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              o.Callbacks("once memory"),
              o.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], i = "pending", s = {
            state: function() {
              return i;
            },
            always: function() {
              return u.done(arguments).fail(arguments), this;
            },
            catch: function(c) {
              return s.then(null, c);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var c = arguments;
              return o.Deferred(function(l) {
                o.each(n, function(g, h) {
                  var _ = $(c[h[4]]) && c[h[4]];
                  u[h[1]](function() {
                    var A = _ && _.apply(this, arguments);
                    A && $(A.promise) ? A.promise().progress(l.notify).done(l.resolve).fail(l.reject) : l[h[0] + "With"](
                      this,
                      _ ? [A] : arguments
                    );
                  });
                }), c = null;
              }).promise();
            },
            then: function(c, l, g) {
              var h = 0;
              function _(A, S, b, O) {
                return function() {
                  var K = this, nt = arguments, Q = function() {
                    var pt, zt;
                    if (!(A < h)) {
                      if (pt = b.apply(K, nt), pt === S.promise())
                        throw new TypeError("Thenable self-resolution");
                      zt = pt && // Support: Promises/A+ section 2.3.4
                      // https://promisesaplus.com/#point-64
                      // Only check objects and functions for thenability
                      (typeof pt == "object" || typeof pt == "function") && pt.then, $(zt) ? O ? zt.call(
                        pt,
                        _(h, S, _e, O),
                        _(h, S, Le, O)
                      ) : (h++, zt.call(
                        pt,
                        _(h, S, _e, O),
                        _(h, S, Le, O),
                        _(
                          h,
                          S,
                          _e,
                          S.notifyWith
                        )
                      )) : (b !== _e && (K = void 0, nt = [pt]), (O || S.resolveWith)(K, nt));
                    }
                  }, _t = O ? Q : function() {
                    try {
                      Q();
                    } catch (pt) {
                      o.Deferred.exceptionHook && o.Deferred.exceptionHook(
                        pt,
                        _t.error
                      ), A + 1 >= h && (b !== Le && (K = void 0, nt = [pt]), S.rejectWith(K, nt));
                    }
                  };
                  A ? _t() : (o.Deferred.getErrorHook ? _t.error = o.Deferred.getErrorHook() : o.Deferred.getStackHook && (_t.error = o.Deferred.getStackHook()), e.setTimeout(_t));
                };
              }
              return o.Deferred(function(A) {
                n[0][3].add(
                  _(
                    0,
                    A,
                    $(g) ? g : _e,
                    A.notifyWith
                  )
                ), n[1][3].add(
                  _(
                    0,
                    A,
                    $(c) ? c : _e
                  )
                ), n[2][3].add(
                  _(
                    0,
                    A,
                    $(l) ? l : Le
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(c) {
              return c != null ? o.extend(c, s) : s;
            }
          }, u = {};
          return o.each(n, function(c, l) {
            var g = l[2], h = l[5];
            s[l[1]] = g.add, h && g.add(
              function() {
                i = h;
              },
              // rejected_callbacks.disable
              // fulfilled_callbacks.disable
              n[3 - c][2].disable,
              // rejected_handlers.disable
              // fulfilled_handlers.disable
              n[3 - c][3].disable,
              // progress_callbacks.lock
              n[0][2].lock,
              // progress_handlers.lock
              n[0][3].lock
            ), g.add(l[3].fire), u[l[0]] = function() {
              return u[l[0] + "With"](this === u ? void 0 : this, arguments), this;
            }, u[l[0] + "With"] = g.fireWith;
          }), s.promise(u), t && t.call(u, u), u;
        },
        // Deferred helper
        when: function(t) {
          var n = arguments.length, i = n, s = Array(i), u = v.call(arguments), c = o.Deferred(), l = function(g) {
            return function(h) {
              s[g] = this, u[g] = arguments.length > 1 ? v.call(arguments) : h, --n || c.resolveWith(s, u);
            };
          };
          if (n <= 1 && (qn(
            t,
            c.done(l(i)).resolve,
            c.reject,
            !n
          ), c.state() === "pending" || $(u[i] && u[i].then)))
            return c.then();
          for (; i--; )
            qn(u[i], l(i), c.reject);
          return c.promise();
        }
      });
      var Ai = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      o.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && Ai.test(t.name) && e.console.warn(
          "jQuery.Deferred exception: " + t.message,
          t.stack,
          n
        );
      }, o.readyException = function(t) {
        e.setTimeout(function() {
          throw t;
        });
      };
      var ze = o.Deferred();
      o.fn.ready = function(t) {
        return ze.then(t).catch(function(n) {
          o.readyException(n);
        }), this;
      }, o.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: !1,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(t) {
          (t === !0 ? --o.readyWait : o.isReady) || (o.isReady = !0, !(t !== !0 && --o.readyWait > 0) && ze.resolveWith(P, [o]));
        }
      }), o.ready.then = ze.then;
      function $e() {
        P.removeEventListener("DOMContentLoaded", $e), e.removeEventListener("load", $e), o.ready();
      }
      P.readyState === "complete" || P.readyState !== "loading" && !P.documentElement.doScroll ? e.setTimeout(o.ready) : (P.addEventListener("DOMContentLoaded", $e), e.addEventListener("load", $e));
      var Ft = function(t, n, i, s, u, c, l) {
        var g = 0, h = t.length, _ = i == null;
        if (G(i) === "object") {
          u = !0;
          for (g in i)
            Ft(t, n, g, i[g], !0, c, l);
        } else if (s !== void 0 && (u = !0, $(s) || (l = !0), _ && (l ? (n.call(t, s), n = null) : (_ = n, n = function(A, S, b) {
          return _.call(o(A), b);
        })), n))
          for (; g < h; g++)
            n(
              t[g],
              i,
              l ? s : s.call(t[g], g, n(t[g], i))
            );
        return u ? t : _ ? n.call(t) : h ? n(t[0], i) : c;
      }, wi = /^-ms-/, se = /-([a-z])/g;
      function Ge(t, n) {
        return n.toUpperCase();
      }
      function Dt(t) {
        return t.replace(wi, "ms-").replace(se, Ge);
      }
      var ve = function(t) {
        return t.nodeType === 1 || t.nodeType === 9 || !+t.nodeType;
      };
      function oe() {
        this.expando = o.expando + oe.uid++;
      }
      oe.uid = 1, oe.prototype = {
        cache: function(t) {
          var n = t[this.expando];
          return n || (n = {}, ve(t) && (t.nodeType ? t[this.expando] = n : Object.defineProperty(t, this.expando, {
            value: n,
            configurable: !0
          }))), n;
        },
        set: function(t, n, i) {
          var s, u = this.cache(t);
          if (typeof n == "string")
            u[Dt(n)] = i;
          else
            for (s in n)
              u[Dt(s)] = n[s];
          return u;
        },
        get: function(t, n) {
          return n === void 0 ? this.cache(t) : (
            // Always use camelCase key (gh-2257)
            t[this.expando] && t[this.expando][Dt(n)]
          );
        },
        access: function(t, n, i) {
          return n === void 0 || n && typeof n == "string" && i === void 0 ? this.get(t, n) : (this.set(t, n, i), i !== void 0 ? i : n);
        },
        remove: function(t, n) {
          var i, s = t[this.expando];
          if (s !== void 0) {
            if (n !== void 0)
              for (Array.isArray(n) ? n = n.map(Dt) : (n = Dt(n), n = n in s ? [n] : n.match(kt) || []), i = n.length; i--; )
                delete s[n[i]];
            (n === void 0 || o.isEmptyObject(s)) && (t.nodeType ? t[this.expando] = void 0 : delete t[this.expando]);
          }
        },
        hasData: function(t) {
          var n = t[this.expando];
          return n !== void 0 && !o.isEmptyObject(n);
        }
      };
      var H = new oe(), mt = new oe(), Fn = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Bn = /[A-Z]/g;
      function Xo(t) {
        return t === "true" ? !0 : t === "false" ? !1 : t === "null" ? null : t === +t + "" ? +t : Fn.test(t) ? JSON.parse(t) : t;
      }
      function $r(t, n, i) {
        var s;
        if (i === void 0 && t.nodeType === 1)
          if (s = "data-" + n.replace(Bn, "-$&").toLowerCase(), i = t.getAttribute(s), typeof i == "string") {
            try {
              i = Xo(i);
            } catch {
            }
            mt.set(t, n, i);
          } else
            i = void 0;
        return i;
      }
      o.extend({
        hasData: function(t) {
          return mt.hasData(t) || H.hasData(t);
        },
        data: function(t, n, i) {
          return mt.access(t, n, i);
        },
        removeData: function(t, n) {
          mt.remove(t, n);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(t, n, i) {
          return H.access(t, n, i);
        },
        _removeData: function(t, n) {
          H.remove(t, n);
        }
      }), o.fn.extend({
        data: function(t, n) {
          var i, s, u, c = this[0], l = c && c.attributes;
          if (t === void 0) {
            if (this.length && (u = mt.get(c), c.nodeType === 1 && !H.get(c, "hasDataAttrs"))) {
              for (i = l.length; i--; )
                l[i] && (s = l[i].name, s.indexOf("data-") === 0 && (s = Dt(s.slice(5)), $r(c, s, u[s])));
              H.set(c, "hasDataAttrs", !0);
            }
            return u;
          }
          return typeof t == "object" ? this.each(function() {
            mt.set(this, t);
          }) : Ft(this, function(g) {
            var h;
            if (c && g === void 0)
              return h = mt.get(c, t), h !== void 0 || (h = $r(c, t), h !== void 0) ? h : void 0;
            this.each(function() {
              mt.set(this, t, g);
            });
          }, null, n, arguments.length > 1, null, !0);
        },
        removeData: function(t) {
          return this.each(function() {
            mt.remove(this, t);
          });
        }
      }), o.extend({
        queue: function(t, n, i) {
          var s;
          if (t)
            return n = (n || "fx") + "queue", s = H.get(t, n), i && (!s || Array.isArray(i) ? s = H.access(t, n, o.makeArray(i)) : s.push(i)), s || [];
        },
        dequeue: function(t, n) {
          n = n || "fx";
          var i = o.queue(t, n), s = i.length, u = i.shift(), c = o._queueHooks(t, n), l = function() {
            o.dequeue(t, n);
          };
          u === "inprogress" && (u = i.shift(), s--), u && (n === "fx" && i.unshift("inprogress"), delete c.stop, u.call(t, l, c)), !s && c && c.empty.fire();
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(t, n) {
          var i = n + "queueHooks";
          return H.get(t, i) || H.access(t, i, {
            empty: o.Callbacks("once memory").add(function() {
              H.remove(t, [n + "queue", i]);
            })
          });
        }
      }), o.fn.extend({
        queue: function(t, n) {
          var i = 2;
          return typeof t != "string" && (n = t, t = "fx", i--), arguments.length < i ? o.queue(this[0], t) : n === void 0 ? this : this.each(function() {
            var s = o.queue(this, t, n);
            o._queueHooks(this, t), t === "fx" && s[0] !== "inprogress" && o.dequeue(this, t);
          });
        },
        dequeue: function(t) {
          return this.each(function() {
            o.dequeue(this, t);
          });
        },
        clearQueue: function(t) {
          return this.queue(t || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(t, n) {
          var i, s = 1, u = o.Deferred(), c = this, l = this.length, g = function() {
            --s || u.resolveWith(c, [c]);
          };
          for (typeof t != "string" && (n = t, t = void 0), t = t || "fx"; l--; )
            i = H.get(c[l], t + "queueHooks"), i && i.empty && (s++, i.empty.add(g));
          return g(), u.promise(n);
        }
      });
      var Ir = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, An = new RegExp("^(?:([+-])=|)(" + Ir + ")([a-z%]*)$", "i"), ae = ["Top", "Right", "Bottom", "Left"], Ie = P.documentElement, Xe = function(t) {
        return o.contains(t.ownerDocument, t);
      }, Qo = { composed: !0 };
      Ie.getRootNode && (Xe = function(t) {
        return o.contains(t.ownerDocument, t) || t.getRootNode(Qo) === t.ownerDocument;
      });
      var Kn = function(t, n) {
        return t = n || t, t.style.display === "none" || t.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        Xe(t) && o.css(t, "display") === "none";
      };
      function kr(t, n, i, s) {
        var u, c, l = 20, g = s ? function() {
          return s.cur();
        } : function() {
          return o.css(t, n, "");
        }, h = g(), _ = i && i[3] || (o.cssNumber[n] ? "" : "px"), A = t.nodeType && (o.cssNumber[n] || _ !== "px" && +h) && An.exec(o.css(t, n));
        if (A && A[3] !== _) {
          for (h = h / 2, _ = _ || A[3], A = +h || 1; l--; )
            o.style(t, n, A + _), (1 - c) * (1 - (c = g() / h || 0.5)) <= 0 && (l = 0), A = A / c;
          A = A * 2, o.style(t, n, A + _), i = i || [];
        }
        return i && (A = +A || +h || 0, u = i[1] ? A + (i[1] + 1) * i[2] : +i[2], s && (s.unit = _, s.start = A, s.end = u)), u;
      }
      var Pr = {};
      function Jo(t) {
        var n, i = t.ownerDocument, s = t.nodeName, u = Pr[s];
        return u || (n = i.body.appendChild(i.createElement(s)), u = o.css(n, "display"), n.parentNode.removeChild(n), u === "none" && (u = "block"), Pr[s] = u, u);
      }
      function Qe(t, n) {
        for (var i, s, u = [], c = 0, l = t.length; c < l; c++)
          s = t[c], s.style && (i = s.style.display, n ? (i === "none" && (u[c] = H.get(s, "display") || null, u[c] || (s.style.display = "")), s.style.display === "" && Kn(s) && (u[c] = Jo(s))) : i !== "none" && (u[c] = "none", H.set(s, "display", i)));
        for (c = 0; c < l; c++)
          u[c] != null && (t[c].style.display = u[c]);
        return t;
      }
      o.fn.extend({
        show: function() {
          return Qe(this, !0);
        },
        hide: function() {
          return Qe(this);
        },
        toggle: function(t) {
          return typeof t == "boolean" ? t ? this.show() : this.hide() : this.each(function() {
            Kn(this) ? o(this).show() : o(this).hide();
          });
        }
      });
      var wn = /^(?:checkbox|radio)$/i, Mr = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, Rr = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var t = P.createDocumentFragment(), n = t.appendChild(P.createElement("div")), i = P.createElement("input");
        i.setAttribute("type", "radio"), i.setAttribute("checked", "checked"), i.setAttribute("name", "t"), n.appendChild(i), M.checkClone = n.cloneNode(!0).cloneNode(!0).lastChild.checked, n.innerHTML = "<textarea>x</textarea>", M.noCloneChecked = !!n.cloneNode(!0).lastChild.defaultValue, n.innerHTML = "<option></option>", M.option = !!n.lastChild;
      })();
      var Pt = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      Pt.tbody = Pt.tfoot = Pt.colgroup = Pt.caption = Pt.thead, Pt.th = Pt.td, M.option || (Pt.optgroup = Pt.option = [1, "<select multiple='multiple'>", "</select>"]);
      function wt(t, n) {
        var i;
        return typeof t.getElementsByTagName < "u" ? i = t.getElementsByTagName(n || "*") : typeof t.querySelectorAll < "u" ? i = t.querySelectorAll(n || "*") : i = [], n === void 0 || n && U(t, n) ? o.merge([t], i) : i;
      }
      function Ci(t, n) {
        for (var i = 0, s = t.length; i < s; i++)
          H.set(
            t[i],
            "globalEval",
            !n || H.get(n[i], "globalEval")
          );
      }
      var Zo = /<|&#?\w+;/;
      function Hr(t, n, i, s, u) {
        for (var c, l, g, h, _, A, S = n.createDocumentFragment(), b = [], O = 0, K = t.length; O < K; O++)
          if (c = t[O], c || c === 0)
            if (G(c) === "object")
              o.merge(b, c.nodeType ? [c] : c);
            else if (!Zo.test(c))
              b.push(n.createTextNode(c));
            else {
              for (l = l || S.appendChild(n.createElement("div")), g = (Mr.exec(c) || ["", ""])[1].toLowerCase(), h = Pt[g] || Pt._default, l.innerHTML = h[1] + o.htmlPrefilter(c) + h[2], A = h[0]; A--; )
                l = l.lastChild;
              o.merge(b, l.childNodes), l = S.firstChild, l.textContent = "";
            }
        for (S.textContent = "", O = 0; c = b[O++]; ) {
          if (s && o.inArray(c, s) > -1) {
            u && u.push(c);
            continue;
          }
          if (_ = Xe(c), l = wt(S.appendChild(c), "script"), _ && Ci(l), i)
            for (A = 0; c = l[A++]; )
              Rr.test(c.type || "") && i.push(c);
        }
        return S;
      }
      var jr = /^([^.]*)(?:\.(.+)|)/;
      function Je() {
        return !0;
      }
      function Ze() {
        return !1;
      }
      function Si(t, n, i, s, u, c) {
        var l, g;
        if (typeof n == "object") {
          typeof i != "string" && (s = s || i, i = void 0);
          for (g in n)
            Si(t, g, i, s, n[g], c);
          return t;
        }
        if (s == null && u == null ? (u = i, s = i = void 0) : u == null && (typeof i == "string" ? (u = s, s = void 0) : (u = s, s = i, i = void 0)), u === !1)
          u = Ze;
        else if (!u)
          return t;
        return c === 1 && (l = u, u = function(h) {
          return o().off(h), l.apply(this, arguments);
        }, u.guid = l.guid || (l.guid = o.guid++)), t.each(function() {
          o.event.add(this, n, u, s, i);
        });
      }
      o.event = {
        global: {},
        add: function(t, n, i, s, u) {
          var c, l, g, h, _, A, S, b, O, K, nt, Q = H.get(t);
          if (ve(t))
            for (i.handler && (c = i, i = c.handler, u = c.selector), u && o.find.matchesSelector(Ie, u), i.guid || (i.guid = o.guid++), (h = Q.events) || (h = Q.events = /* @__PURE__ */ Object.create(null)), (l = Q.handle) || (l = Q.handle = function(_t) {
              return typeof o < "u" && o.event.triggered !== _t.type ? o.event.dispatch.apply(t, arguments) : void 0;
            }), n = (n || "").match(kt) || [""], _ = n.length; _--; )
              g = jr.exec(n[_]) || [], O = nt = g[1], K = (g[2] || "").split(".").sort(), O && (S = o.event.special[O] || {}, O = (u ? S.delegateType : S.bindType) || O, S = o.event.special[O] || {}, A = o.extend({
                type: O,
                origType: nt,
                data: s,
                handler: i,
                guid: i.guid,
                selector: u,
                needsContext: u && o.expr.match.needsContext.test(u),
                namespace: K.join(".")
              }, c), (b = h[O]) || (b = h[O] = [], b.delegateCount = 0, (!S.setup || S.setup.call(t, s, K, l) === !1) && t.addEventListener && t.addEventListener(O, l)), S.add && (S.add.call(t, A), A.handler.guid || (A.handler.guid = i.guid)), u ? b.splice(b.delegateCount++, 0, A) : b.push(A), o.event.global[O] = !0);
        },
        // Detach an event or set of events from an element
        remove: function(t, n, i, s, u) {
          var c, l, g, h, _, A, S, b, O, K, nt, Q = H.hasData(t) && H.get(t);
          if (!(!Q || !(h = Q.events))) {
            for (n = (n || "").match(kt) || [""], _ = n.length; _--; ) {
              if (g = jr.exec(n[_]) || [], O = nt = g[1], K = (g[2] || "").split(".").sort(), !O) {
                for (O in h)
                  o.event.remove(t, O + n[_], i, s, !0);
                continue;
              }
              for (S = o.event.special[O] || {}, O = (s ? S.delegateType : S.bindType) || O, b = h[O] || [], g = g[2] && new RegExp("(^|\\.)" + K.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = c = b.length; c--; )
                A = b[c], (u || nt === A.origType) && (!i || i.guid === A.guid) && (!g || g.test(A.namespace)) && (!s || s === A.selector || s === "**" && A.selector) && (b.splice(c, 1), A.selector && b.delegateCount--, S.remove && S.remove.call(t, A));
              l && !b.length && ((!S.teardown || S.teardown.call(t, K, Q.handle) === !1) && o.removeEvent(t, O, Q.handle), delete h[O]);
            }
            o.isEmptyObject(h) && H.remove(t, "handle events");
          }
        },
        dispatch: function(t) {
          var n, i, s, u, c, l, g = new Array(arguments.length), h = o.event.fix(t), _ = (H.get(this, "events") || /* @__PURE__ */ Object.create(null))[h.type] || [], A = o.event.special[h.type] || {};
          for (g[0] = h, n = 1; n < arguments.length; n++)
            g[n] = arguments[n];
          if (h.delegateTarget = this, !(A.preDispatch && A.preDispatch.call(this, h) === !1)) {
            for (l = o.event.handlers.call(this, h, _), n = 0; (u = l[n++]) && !h.isPropagationStopped(); )
              for (h.currentTarget = u.elem, i = 0; (c = u.handlers[i++]) && !h.isImmediatePropagationStopped(); )
                (!h.rnamespace || c.namespace === !1 || h.rnamespace.test(c.namespace)) && (h.handleObj = c, h.data = c.data, s = ((o.event.special[c.origType] || {}).handle || c.handler).apply(u.elem, g), s !== void 0 && (h.result = s) === !1 && (h.preventDefault(), h.stopPropagation()));
            return A.postDispatch && A.postDispatch.call(this, h), h.result;
          }
        },
        handlers: function(t, n) {
          var i, s, u, c, l, g = [], h = n.delegateCount, _ = t.target;
          if (h && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          _.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(t.type === "click" && t.button >= 1)) {
            for (; _ !== this; _ = _.parentNode || this)
              if (_.nodeType === 1 && !(t.type === "click" && _.disabled === !0)) {
                for (c = [], l = {}, i = 0; i < h; i++)
                  s = n[i], u = s.selector + " ", l[u] === void 0 && (l[u] = s.needsContext ? o(u, this).index(_) > -1 : o.find(u, this, null, [_]).length), l[u] && c.push(s);
                c.length && g.push({ elem: _, handlers: c });
              }
          }
          return _ = this, h < n.length && g.push({ elem: _, handlers: n.slice(h) }), g;
        },
        addProp: function(t, n) {
          Object.defineProperty(o.Event.prototype, t, {
            enumerable: !0,
            configurable: !0,
            get: $(n) ? function() {
              if (this.originalEvent)
                return n(this.originalEvent);
            } : function() {
              if (this.originalEvent)
                return this.originalEvent[t];
            },
            set: function(i) {
              Object.defineProperty(this, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: i
              });
            }
          });
        },
        fix: function(t) {
          return t[o.expando] ? t : new o.Event(t);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: !0
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(t) {
              var n = this || t;
              return wn.test(n.type) && n.click && U(n, "input") && Yn(n, "click", !0), !1;
            },
            trigger: function(t) {
              var n = this || t;
              return wn.test(n.type) && n.click && U(n, "input") && Yn(n, "click"), !0;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(t) {
              var n = t.target;
              return wn.test(n.type) && n.click && U(n, "input") && H.get(n, "click") || U(n, "a");
            }
          },
          beforeunload: {
            postDispatch: function(t) {
              t.result !== void 0 && t.originalEvent && (t.originalEvent.returnValue = t.result);
            }
          }
        }
      };
      function Yn(t, n, i) {
        if (!i) {
          H.get(t, n) === void 0 && o.event.add(t, n, Je);
          return;
        }
        H.set(t, n, !1), o.event.add(t, n, {
          namespace: !1,
          handler: function(s) {
            var u, c = H.get(this, n);
            if (s.isTrigger & 1 && this[n]) {
              if (c)
                (o.event.special[n] || {}).delegateType && s.stopPropagation();
              else if (c = v.call(arguments), H.set(this, n, c), this[n](), u = H.get(this, n), H.set(this, n, !1), c !== u)
                return s.stopImmediatePropagation(), s.preventDefault(), u;
            } else c && (H.set(this, n, o.event.trigger(
              c[0],
              c.slice(1),
              this
            )), s.stopPropagation(), s.isImmediatePropagationStopped = Je);
          }
        });
      }
      o.removeEvent = function(t, n, i) {
        t.removeEventListener && t.removeEventListener(n, i);
      }, o.Event = function(t, n) {
        if (!(this instanceof o.Event))
          return new o.Event(t, n);
        t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || t.defaultPrevented === void 0 && // Support: Android <=2.3 only
        t.returnValue === !1 ? Je : Ze, this.target = t.target && t.target.nodeType === 3 ? t.target.parentNode : t.target, this.currentTarget = t.currentTarget, this.relatedTarget = t.relatedTarget) : this.type = t, n && o.extend(this, n), this.timeStamp = t && t.timeStamp || Date.now(), this[o.expando] = !0;
      }, o.Event.prototype = {
        constructor: o.Event,
        isDefaultPrevented: Ze,
        isPropagationStopped: Ze,
        isImmediatePropagationStopped: Ze,
        isSimulated: !1,
        preventDefault: function() {
          var t = this.originalEvent;
          this.isDefaultPrevented = Je, t && !this.isSimulated && t.preventDefault();
        },
        stopPropagation: function() {
          var t = this.originalEvent;
          this.isPropagationStopped = Je, t && !this.isSimulated && t.stopPropagation();
        },
        stopImmediatePropagation: function() {
          var t = this.originalEvent;
          this.isImmediatePropagationStopped = Je, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation();
        }
      }, o.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
      }, o.event.addProp), o.each({ focus: "focusin", blur: "focusout" }, function(t, n) {
        function i(s) {
          if (P.documentMode) {
            var u = H.get(this, "handle"), c = o.event.fix(s);
            c.type = s.type === "focusin" ? "focus" : "blur", c.isSimulated = !0, u(s), c.target === c.currentTarget && u(c);
          } else
            o.event.simulate(
              n,
              s.target,
              o.event.fix(s)
            );
        }
        o.event.special[t] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var s;
            if (Yn(this, t, !0), P.documentMode)
              s = H.get(this, n), s || this.addEventListener(n, i), H.set(this, n, (s || 0) + 1);
            else
              return !1;
          },
          trigger: function() {
            return Yn(this, t), !0;
          },
          teardown: function() {
            var s;
            if (P.documentMode)
              s = H.get(this, n) - 1, s ? H.set(this, n, s) : (this.removeEventListener(n, i), H.remove(this, n));
            else
              return !1;
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(s) {
            return H.get(s.target, t);
          },
          delegateType: n
        }, o.event.special[n] = {
          setup: function() {
            var s = this.ownerDocument || this.document || this, u = P.documentMode ? this : s, c = H.get(u, n);
            c || (P.documentMode ? this.addEventListener(n, i) : s.addEventListener(t, i, !0)), H.set(u, n, (c || 0) + 1);
          },
          teardown: function() {
            var s = this.ownerDocument || this.document || this, u = P.documentMode ? this : s, c = H.get(u, n) - 1;
            c ? H.set(u, n, c) : (P.documentMode ? this.removeEventListener(n, i) : s.removeEventListener(t, i, !0), H.remove(u, n));
          }
        };
      }), o.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(t, n) {
        o.event.special[t] = {
          delegateType: n,
          bindType: n,
          handle: function(i) {
            var s, u = this, c = i.relatedTarget, l = i.handleObj;
            return (!c || c !== u && !o.contains(u, c)) && (i.type = l.origType, s = l.handler.apply(this, arguments), i.type = n), s;
          }
        };
      }), o.fn.extend({
        on: function(t, n, i, s) {
          return Si(this, t, n, i, s);
        },
        one: function(t, n, i, s) {
          return Si(this, t, n, i, s, 1);
        },
        off: function(t, n, i) {
          var s, u;
          if (t && t.preventDefault && t.handleObj)
            return s = t.handleObj, o(t.delegateTarget).off(
              s.namespace ? s.origType + "." + s.namespace : s.origType,
              s.selector,
              s.handler
            ), this;
          if (typeof t == "object") {
            for (u in t)
              this.off(u, n, t[u]);
            return this;
          }
          return (n === !1 || typeof n == "function") && (i = n, n = void 0), i === !1 && (i = Ze), this.each(function() {
            o.event.remove(this, t, i, n);
          });
        }
      });
      var ta = /<script|<style|<link/i, ea = /checked\s*(?:[^=]|=\s*.checked.)/i, na = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function Vr(t, n) {
        return U(t, "table") && U(n.nodeType !== 11 ? n : n.firstChild, "tr") && o(t).children("tbody")[0] || t;
      }
      function ia(t) {
        return t.type = (t.getAttribute("type") !== null) + "/" + t.type, t;
      }
      function ra(t) {
        return (t.type || "").slice(0, 5) === "true/" ? t.type = t.type.slice(5) : t.removeAttribute("type"), t;
      }
      function Wr(t, n) {
        var i, s, u, c, l, g, h;
        if (n.nodeType === 1) {
          if (H.hasData(t) && (c = H.get(t), h = c.events, h)) {
            H.remove(n, "handle events");
            for (u in h)
              for (i = 0, s = h[u].length; i < s; i++)
                o.event.add(n, u, h[u][i]);
          }
          mt.hasData(t) && (l = mt.access(t), g = o.extend({}, l), mt.set(n, g));
        }
      }
      function sa(t, n) {
        var i = n.nodeName.toLowerCase();
        i === "input" && wn.test(t.type) ? n.checked = t.checked : (i === "input" || i === "textarea") && (n.defaultValue = t.defaultValue);
      }
      function tn(t, n, i, s) {
        n = E(n);
        var u, c, l, g, h, _, A = 0, S = t.length, b = S - 1, O = n[0], K = $(O);
        if (K || S > 1 && typeof O == "string" && !M.checkClone && ea.test(O))
          return t.each(function(nt) {
            var Q = t.eq(nt);
            K && (n[0] = O.call(this, nt, Q.html())), tn(Q, n, i, s);
          });
        if (S && (u = Hr(n, t[0].ownerDocument, !1, t, s), c = u.firstChild, u.childNodes.length === 1 && (u = c), c || s)) {
          for (l = o.map(wt(u, "script"), ia), g = l.length; A < S; A++)
            h = u, A !== b && (h = o.clone(h, !0, !0), g && o.merge(l, wt(h, "script"))), i.call(t[A], h, A);
          if (g)
            for (_ = l[l.length - 1].ownerDocument, o.map(l, ra), A = 0; A < g; A++)
              h = l[A], Rr.test(h.type || "") && !H.access(h, "globalEval") && o.contains(_, h) && (h.src && (h.type || "").toLowerCase() !== "module" ? o._evalUrl && !h.noModule && o._evalUrl(h.src, {
                nonce: h.nonce || h.getAttribute("nonce")
              }, _) : ut(h.textContent.replace(na, ""), h, _));
        }
        return t;
      }
      function qr(t, n, i) {
        for (var s, u = n ? o.filter(n, t) : t, c = 0; (s = u[c]) != null; c++)
          !i && s.nodeType === 1 && o.cleanData(wt(s)), s.parentNode && (i && Xe(s) && Ci(wt(s, "script")), s.parentNode.removeChild(s));
        return t;
      }
      o.extend({
        htmlPrefilter: function(t) {
          return t;
        },
        clone: function(t, n, i) {
          var s, u, c, l, g = t.cloneNode(!0), h = Xe(t);
          if (!M.noCloneChecked && (t.nodeType === 1 || t.nodeType === 11) && !o.isXMLDoc(t))
            for (l = wt(g), c = wt(t), s = 0, u = c.length; s < u; s++)
              sa(c[s], l[s]);
          if (n)
            if (i)
              for (c = c || wt(t), l = l || wt(g), s = 0, u = c.length; s < u; s++)
                Wr(c[s], l[s]);
            else
              Wr(t, g);
          return l = wt(g, "script"), l.length > 0 && Ci(l, !h && wt(t, "script")), g;
        },
        cleanData: function(t) {
          for (var n, i, s, u = o.event.special, c = 0; (i = t[c]) !== void 0; c++)
            if (ve(i)) {
              if (n = i[H.expando]) {
                if (n.events)
                  for (s in n.events)
                    u[s] ? o.event.remove(i, s) : o.removeEvent(i, s, n.handle);
                i[H.expando] = void 0;
              }
              i[mt.expando] && (i[mt.expando] = void 0);
            }
        }
      }), o.fn.extend({
        detach: function(t) {
          return qr(this, t, !0);
        },
        remove: function(t) {
          return qr(this, t);
        },
        text: function(t) {
          return Ft(this, function(n) {
            return n === void 0 ? o.text(this) : this.empty().each(function() {
              (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) && (this.textContent = n);
            });
          }, null, t, arguments.length);
        },
        append: function() {
          return tn(this, arguments, function(t) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var n = Vr(this, t);
              n.appendChild(t);
            }
          });
        },
        prepend: function() {
          return tn(this, arguments, function(t) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var n = Vr(this, t);
              n.insertBefore(t, n.firstChild);
            }
          });
        },
        before: function() {
          return tn(this, arguments, function(t) {
            this.parentNode && this.parentNode.insertBefore(t, this);
          });
        },
        after: function() {
          return tn(this, arguments, function(t) {
            this.parentNode && this.parentNode.insertBefore(t, this.nextSibling);
          });
        },
        empty: function() {
          for (var t, n = 0; (t = this[n]) != null; n++)
            t.nodeType === 1 && (o.cleanData(wt(t, !1)), t.textContent = "");
          return this;
        },
        clone: function(t, n) {
          return t = t ?? !1, n = n ?? t, this.map(function() {
            return o.clone(this, t, n);
          });
        },
        html: function(t) {
          return Ft(this, function(n) {
            var i = this[0] || {}, s = 0, u = this.length;
            if (n === void 0 && i.nodeType === 1)
              return i.innerHTML;
            if (typeof n == "string" && !ta.test(n) && !Pt[(Mr.exec(n) || ["", ""])[1].toLowerCase()]) {
              n = o.htmlPrefilter(n);
              try {
                for (; s < u; s++)
                  i = this[s] || {}, i.nodeType === 1 && (o.cleanData(wt(i, !1)), i.innerHTML = n);
                i = 0;
              } catch {
              }
            }
            i && this.empty().append(n);
          }, null, t, arguments.length);
        },
        replaceWith: function() {
          var t = [];
          return tn(this, arguments, function(n) {
            var i = this.parentNode;
            o.inArray(this, t) < 0 && (o.cleanData(wt(this)), i && i.replaceChild(n, this));
          }, t);
        }
      }), o.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(t, n) {
        o.fn[t] = function(i) {
          for (var s, u = [], c = o(i), l = c.length - 1, g = 0; g <= l; g++)
            s = g === l ? this : this.clone(!0), o(c[g])[n](s), w.apply(u, s.get());
          return this.pushStack(u);
        };
      });
      var xi = new RegExp("^(" + Ir + ")(?!px)[a-z%]+$", "i"), Ni = /^--/, Un = function(t) {
        var n = t.ownerDocument.defaultView;
        return (!n || !n.opener) && (n = e), n.getComputedStyle(t);
      }, Fr = function(t, n, i) {
        var s, u, c = {};
        for (u in n)
          c[u] = t.style[u], t.style[u] = n[u];
        s = i.call(t);
        for (u in n)
          t.style[u] = c[u];
        return s;
      }, oa = new RegExp(ae.join("|"), "i");
      (function() {
        function t() {
          if (_) {
            h.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", _.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", Ie.appendChild(h).appendChild(_);
            var A = e.getComputedStyle(_);
            i = A.top !== "1%", g = n(A.marginLeft) === 12, _.style.right = "60%", c = n(A.right) === 36, s = n(A.width) === 36, _.style.position = "absolute", u = n(_.offsetWidth / 3) === 12, Ie.removeChild(h), _ = null;
          }
        }
        function n(A) {
          return Math.round(parseFloat(A));
        }
        var i, s, u, c, l, g, h = P.createElement("div"), _ = P.createElement("div");
        _.style && (_.style.backgroundClip = "content-box", _.cloneNode(!0).style.backgroundClip = "", M.clearCloneStyle = _.style.backgroundClip === "content-box", o.extend(M, {
          boxSizingReliable: function() {
            return t(), s;
          },
          pixelBoxStyles: function() {
            return t(), c;
          },
          pixelPosition: function() {
            return t(), i;
          },
          reliableMarginLeft: function() {
            return t(), g;
          },
          scrollboxSize: function() {
            return t(), u;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var A, S, b, O;
            return l == null && (A = P.createElement("table"), S = P.createElement("tr"), b = P.createElement("div"), A.style.cssText = "position:absolute;left:-11111px;border-collapse:separate", S.style.cssText = "box-sizing:content-box;border:1px solid", S.style.height = "1px", b.style.height = "9px", b.style.display = "block", Ie.appendChild(A).appendChild(S).appendChild(b), O = e.getComputedStyle(S), l = parseInt(O.height, 10) + parseInt(O.borderTopWidth, 10) + parseInt(O.borderBottomWidth, 10) === S.offsetHeight, Ie.removeChild(A)), l;
          }
        }));
      })();
      function Cn(t, n, i) {
        var s, u, c, l, g = Ni.test(n), h = t.style;
        return i = i || Un(t), i && (l = i.getPropertyValue(n) || i[n], g && l && (l = l.replace(Ot, "$1") || void 0), l === "" && !Xe(t) && (l = o.style(t, n)), !M.pixelBoxStyles() && xi.test(l) && oa.test(n) && (s = h.width, u = h.minWidth, c = h.maxWidth, h.minWidth = h.maxWidth = h.width = l, l = i.width, h.width = s, h.minWidth = u, h.maxWidth = c)), l !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          l + ""
        ) : l;
      }
      function Br(t, n) {
        return {
          get: function() {
            if (t()) {
              delete this.get;
              return;
            }
            return (this.get = n).apply(this, arguments);
          }
        };
      }
      var Kr = ["Webkit", "Moz", "ms"], Yr = P.createElement("div").style, Ur = {};
      function aa(t) {
        for (var n = t[0].toUpperCase() + t.slice(1), i = Kr.length; i--; )
          if (t = Kr[i] + n, t in Yr)
            return t;
      }
      function Oi(t) {
        var n = o.cssProps[t] || Ur[t];
        return n || (t in Yr ? t : Ur[t] = aa(t) || t);
      }
      var ua = /^(none|table(?!-c[ea]).+)/, ca = { position: "absolute", visibility: "hidden", display: "block" }, zr = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function Gr(t, n, i) {
        var s = An.exec(n);
        return s ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, s[2] - (i || 0)) + (s[3] || "px")
        ) : n;
      }
      function Di(t, n, i, s, u, c) {
        var l = n === "width" ? 1 : 0, g = 0, h = 0, _ = 0;
        if (i === (s ? "border" : "content"))
          return 0;
        for (; l < 4; l += 2)
          i === "margin" && (_ += o.css(t, i + ae[l], !0, u)), s ? (i === "content" && (h -= o.css(t, "padding" + ae[l], !0, u)), i !== "margin" && (h -= o.css(t, "border" + ae[l] + "Width", !0, u))) : (h += o.css(t, "padding" + ae[l], !0, u), i !== "padding" ? h += o.css(t, "border" + ae[l] + "Width", !0, u) : g += o.css(t, "border" + ae[l] + "Width", !0, u));
        return !s && c >= 0 && (h += Math.max(0, Math.ceil(
          t["offset" + n[0].toUpperCase() + n.slice(1)] - c - h - g - 0.5
          // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
          // Use an explicit zero to avoid NaN (gh-3964)
        )) || 0), h + _;
      }
      function Xr(t, n, i) {
        var s = Un(t), u = !M.boxSizingReliable() || i, c = u && o.css(t, "boxSizing", !1, s) === "border-box", l = c, g = Cn(t, n, s), h = "offset" + n[0].toUpperCase() + n.slice(1);
        if (xi.test(g)) {
          if (!i)
            return g;
          g = "auto";
        }
        return (!M.boxSizingReliable() && c || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !M.reliableTrDimensions() && U(t, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        g === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(g) && o.css(t, "display", !1, s) === "inline") && // Make sure the element is visible & connected
        t.getClientRects().length && (c = o.css(t, "boxSizing", !1, s) === "border-box", l = h in t, l && (g = t[h])), g = parseFloat(g) || 0, g + Di(
          t,
          n,
          i || (c ? "border" : "content"),
          l,
          s,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          g
        ) + "px";
      }
      o.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(t, n) {
              if (n) {
                var i = Cn(t, "opacity");
                return i === "" ? "1" : i;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: !0,
          aspectRatio: !0,
          borderImageSlice: !0,
          columnCount: !0,
          flexGrow: !0,
          flexShrink: !0,
          fontWeight: !0,
          gridArea: !0,
          gridColumn: !0,
          gridColumnEnd: !0,
          gridColumnStart: !0,
          gridRow: !0,
          gridRowEnd: !0,
          gridRowStart: !0,
          lineHeight: !0,
          opacity: !0,
          order: !0,
          orphans: !0,
          scale: !0,
          widows: !0,
          zIndex: !0,
          zoom: !0,
          // SVG-related
          fillOpacity: !0,
          floodOpacity: !0,
          stopOpacity: !0,
          strokeMiterlimit: !0,
          strokeOpacity: !0
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(t, n, i, s) {
          if (!(!t || t.nodeType === 3 || t.nodeType === 8 || !t.style)) {
            var u, c, l, g = Dt(n), h = Ni.test(n), _ = t.style;
            if (h || (n = Oi(g)), l = o.cssHooks[n] || o.cssHooks[g], i !== void 0) {
              if (c = typeof i, c === "string" && (u = An.exec(i)) && u[1] && (i = kr(t, n, u), c = "number"), i == null || i !== i)
                return;
              c === "number" && !h && (i += u && u[3] || (o.cssNumber[g] ? "" : "px")), !M.clearCloneStyle && i === "" && n.indexOf("background") === 0 && (_[n] = "inherit"), (!l || !("set" in l) || (i = l.set(t, i, s)) !== void 0) && (h ? _.setProperty(n, i) : _[n] = i);
            } else
              return l && "get" in l && (u = l.get(t, !1, s)) !== void 0 ? u : _[n];
          }
        },
        css: function(t, n, i, s) {
          var u, c, l, g = Dt(n), h = Ni.test(n);
          return h || (n = Oi(g)), l = o.cssHooks[n] || o.cssHooks[g], l && "get" in l && (u = l.get(t, !0, i)), u === void 0 && (u = Cn(t, n, s)), u === "normal" && n in zr && (u = zr[n]), i === "" || i ? (c = parseFloat(u), i === !0 || isFinite(c) ? c || 0 : u) : u;
        }
      }), o.each(["height", "width"], function(t, n) {
        o.cssHooks[n] = {
          get: function(i, s, u) {
            if (s)
              return ua.test(o.css(i, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!i.getClientRects().length || !i.getBoundingClientRect().width) ? Fr(i, ca, function() {
                return Xr(i, n, u);
              }) : Xr(i, n, u);
          },
          set: function(i, s, u) {
            var c, l = Un(i), g = !M.scrollboxSize() && l.position === "absolute", h = g || u, _ = h && o.css(i, "boxSizing", !1, l) === "border-box", A = u ? Di(
              i,
              n,
              u,
              _,
              l
            ) : 0;
            return _ && g && (A -= Math.ceil(
              i["offset" + n[0].toUpperCase() + n.slice(1)] - parseFloat(l[n]) - Di(i, n, "border", !1, l) - 0.5
            )), A && (c = An.exec(s)) && (c[3] || "px") !== "px" && (i.style[n] = s, s = o.css(i, n)), Gr(i, s, A);
          }
        };
      }), o.cssHooks.marginLeft = Br(
        M.reliableMarginLeft,
        function(t, n) {
          if (n)
            return (parseFloat(Cn(t, "marginLeft")) || t.getBoundingClientRect().left - Fr(t, { marginLeft: 0 }, function() {
              return t.getBoundingClientRect().left;
            })) + "px";
        }
      ), o.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(t, n) {
        o.cssHooks[t + n] = {
          expand: function(i) {
            for (var s = 0, u = {}, c = typeof i == "string" ? i.split(" ") : [i]; s < 4; s++)
              u[t + ae[s] + n] = c[s] || c[s - 2] || c[0];
            return u;
          }
        }, t !== "margin" && (o.cssHooks[t + n].set = Gr);
      }), o.fn.extend({
        css: function(t, n) {
          return Ft(this, function(i, s, u) {
            var c, l, g = {}, h = 0;
            if (Array.isArray(s)) {
              for (c = Un(i), l = s.length; h < l; h++)
                g[s[h]] = o.css(i, s[h], !1, c);
              return g;
            }
            return u !== void 0 ? o.style(i, s, u) : o.css(i, s);
          }, t, n, arguments.length > 1);
        }
      });
      function Ct(t, n, i, s, u) {
        return new Ct.prototype.init(t, n, i, s, u);
      }
      o.Tween = Ct, Ct.prototype = {
        constructor: Ct,
        init: function(t, n, i, s, u, c) {
          this.elem = t, this.prop = i, this.easing = u || o.easing._default, this.options = n, this.start = this.now = this.cur(), this.end = s, this.unit = c || (o.cssNumber[i] ? "" : "px");
        },
        cur: function() {
          var t = Ct.propHooks[this.prop];
          return t && t.get ? t.get(this) : Ct.propHooks._default.get(this);
        },
        run: function(t) {
          var n, i = Ct.propHooks[this.prop];
          return this.options.duration ? this.pos = n = o.easing[this.easing](
            t,
            this.options.duration * t,
            0,
            1,
            this.options.duration
          ) : this.pos = n = t, this.now = (this.end - this.start) * n + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : Ct.propHooks._default.set(this), this;
        }
      }, Ct.prototype.init.prototype = Ct.prototype, Ct.propHooks = {
        _default: {
          get: function(t) {
            var n;
            return t.elem.nodeType !== 1 || t.elem[t.prop] != null && t.elem.style[t.prop] == null ? t.elem[t.prop] : (n = o.css(t.elem, t.prop, ""), !n || n === "auto" ? 0 : n);
          },
          set: function(t) {
            o.fx.step[t.prop] ? o.fx.step[t.prop](t) : t.elem.nodeType === 1 && (o.cssHooks[t.prop] || t.elem.style[Oi(t.prop)] != null) ? o.style(t.elem, t.prop, t.now + t.unit) : t.elem[t.prop] = t.now;
          }
        }
      }, Ct.propHooks.scrollTop = Ct.propHooks.scrollLeft = {
        set: function(t) {
          t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now);
        }
      }, o.easing = {
        linear: function(t) {
          return t;
        },
        swing: function(t) {
          return 0.5 - Math.cos(t * Math.PI) / 2;
        },
        _default: "swing"
      }, o.fx = Ct.prototype.init, o.fx.step = {};
      var en, zn, la = /^(?:toggle|show|hide)$/, fa = /queueHooks$/;
      function Li() {
        zn && (P.hidden === !1 && e.requestAnimationFrame ? e.requestAnimationFrame(Li) : e.setTimeout(Li, o.fx.interval), o.fx.tick());
      }
      function Qr() {
        return e.setTimeout(function() {
          en = void 0;
        }), en = Date.now();
      }
      function Gn(t, n) {
        var i, s = 0, u = { height: t };
        for (n = n ? 1 : 0; s < 4; s += 2 - n)
          i = ae[s], u["margin" + i] = u["padding" + i] = t;
        return n && (u.opacity = u.width = t), u;
      }
      function Jr(t, n, i) {
        for (var s, u = (Bt.tweeners[n] || []).concat(Bt.tweeners["*"]), c = 0, l = u.length; c < l; c++)
          if (s = u[c].call(i, n, t))
            return s;
      }
      function da(t, n, i) {
        var s, u, c, l, g, h, _, A, S = "width" in n || "height" in n, b = this, O = {}, K = t.style, nt = t.nodeType && Kn(t), Q = H.get(t, "fxshow");
        i.queue || (l = o._queueHooks(t, "fx"), l.unqueued == null && (l.unqueued = 0, g = l.empty.fire, l.empty.fire = function() {
          l.unqueued || g();
        }), l.unqueued++, b.always(function() {
          b.always(function() {
            l.unqueued--, o.queue(t, "fx").length || l.empty.fire();
          });
        }));
        for (s in n)
          if (u = n[s], la.test(u)) {
            if (delete n[s], c = c || u === "toggle", u === (nt ? "hide" : "show"))
              if (u === "show" && Q && Q[s] !== void 0)
                nt = !0;
              else
                continue;
            O[s] = Q && Q[s] || o.style(t, s);
          }
        if (h = !o.isEmptyObject(n), !(!h && o.isEmptyObject(O))) {
          S && t.nodeType === 1 && (i.overflow = [K.overflow, K.overflowX, K.overflowY], _ = Q && Q.display, _ == null && (_ = H.get(t, "display")), A = o.css(t, "display"), A === "none" && (_ ? A = _ : (Qe([t], !0), _ = t.style.display || _, A = o.css(t, "display"), Qe([t]))), (A === "inline" || A === "inline-block" && _ != null) && o.css(t, "float") === "none" && (h || (b.done(function() {
            K.display = _;
          }), _ == null && (A = K.display, _ = A === "none" ? "" : A)), K.display = "inline-block")), i.overflow && (K.overflow = "hidden", b.always(function() {
            K.overflow = i.overflow[0], K.overflowX = i.overflow[1], K.overflowY = i.overflow[2];
          })), h = !1;
          for (s in O)
            h || (Q ? "hidden" in Q && (nt = Q.hidden) : Q = H.access(t, "fxshow", { display: _ }), c && (Q.hidden = !nt), nt && Qe([t], !0), b.done(function() {
              nt || Qe([t]), H.remove(t, "fxshow");
              for (s in O)
                o.style(t, s, O[s]);
            })), h = Jr(nt ? Q[s] : 0, s, b), s in Q || (Q[s] = h.start, nt && (h.end = h.start, h.start = 0));
        }
      }
      function ha(t, n) {
        var i, s, u, c, l;
        for (i in t)
          if (s = Dt(i), u = n[s], c = t[i], Array.isArray(c) && (u = c[1], c = t[i] = c[0]), i !== s && (t[s] = c, delete t[i]), l = o.cssHooks[s], l && "expand" in l) {
            c = l.expand(c), delete t[s];
            for (i in c)
              i in t || (t[i] = c[i], n[i] = u);
          } else
            n[s] = u;
      }
      function Bt(t, n, i) {
        var s, u, c = 0, l = Bt.prefilters.length, g = o.Deferred().always(function() {
          delete h.elem;
        }), h = function() {
          if (u)
            return !1;
          for (var S = en || Qr(), b = Math.max(0, _.startTime + _.duration - S), O = b / _.duration || 0, K = 1 - O, nt = 0, Q = _.tweens.length; nt < Q; nt++)
            _.tweens[nt].run(K);
          return g.notifyWith(t, [_, K, b]), K < 1 && Q ? b : (Q || g.notifyWith(t, [_, 1, 0]), g.resolveWith(t, [_]), !1);
        }, _ = g.promise({
          elem: t,
          props: o.extend({}, n),
          opts: o.extend(!0, {
            specialEasing: {},
            easing: o.easing._default
          }, i),
          originalProperties: n,
          originalOptions: i,
          startTime: en || Qr(),
          duration: i.duration,
          tweens: [],
          createTween: function(S, b) {
            var O = o.Tween(
              t,
              _.opts,
              S,
              b,
              _.opts.specialEasing[S] || _.opts.easing
            );
            return _.tweens.push(O), O;
          },
          stop: function(S) {
            var b = 0, O = S ? _.tweens.length : 0;
            if (u)
              return this;
            for (u = !0; b < O; b++)
              _.tweens[b].run(1);
            return S ? (g.notifyWith(t, [_, 1, 0]), g.resolveWith(t, [_, S])) : g.rejectWith(t, [_, S]), this;
          }
        }), A = _.props;
        for (ha(A, _.opts.specialEasing); c < l; c++)
          if (s = Bt.prefilters[c].call(_, t, A, _.opts), s)
            return $(s.stop) && (o._queueHooks(_.elem, _.opts.queue).stop = s.stop.bind(s)), s;
        return o.map(A, Jr, _), $(_.opts.start) && _.opts.start.call(t, _), _.progress(_.opts.progress).done(_.opts.done, _.opts.complete).fail(_.opts.fail).always(_.opts.always), o.fx.timer(
          o.extend(h, {
            elem: t,
            anim: _,
            queue: _.opts.queue
          })
        ), _;
      }
      o.Animation = o.extend(Bt, {
        tweeners: {
          "*": [function(t, n) {
            var i = this.createTween(t, n);
            return kr(i.elem, t, An.exec(n), i), i;
          }]
        },
        tweener: function(t, n) {
          $(t) ? (n = t, t = ["*"]) : t = t.match(kt);
          for (var i, s = 0, u = t.length; s < u; s++)
            i = t[s], Bt.tweeners[i] = Bt.tweeners[i] || [], Bt.tweeners[i].unshift(n);
        },
        prefilters: [da],
        prefilter: function(t, n) {
          n ? Bt.prefilters.unshift(t) : Bt.prefilters.push(t);
        }
      }), o.speed = function(t, n, i) {
        var s = t && typeof t == "object" ? o.extend({}, t) : {
          complete: i || !i && n || $(t) && t,
          duration: t,
          easing: i && n || n && !$(n) && n
        };
        return o.fx.off ? s.duration = 0 : typeof s.duration != "number" && (s.duration in o.fx.speeds ? s.duration = o.fx.speeds[s.duration] : s.duration = o.fx.speeds._default), (s.queue == null || s.queue === !0) && (s.queue = "fx"), s.old = s.complete, s.complete = function() {
          $(s.old) && s.old.call(this), s.queue && o.dequeue(this, s.queue);
        }, s;
      }, o.fn.extend({
        fadeTo: function(t, n, i, s) {
          return this.filter(Kn).css("opacity", 0).show().end().animate({ opacity: n }, t, i, s);
        },
        animate: function(t, n, i, s) {
          var u = o.isEmptyObject(t), c = o.speed(n, i, s), l = function() {
            var g = Bt(this, o.extend({}, t), c);
            (u || H.get(this, "finish")) && g.stop(!0);
          };
          return l.finish = l, u || c.queue === !1 ? this.each(l) : this.queue(c.queue, l);
        },
        stop: function(t, n, i) {
          var s = function(u) {
            var c = u.stop;
            delete u.stop, c(i);
          };
          return typeof t != "string" && (i = n, n = t, t = void 0), n && this.queue(t || "fx", []), this.each(function() {
            var u = !0, c = t != null && t + "queueHooks", l = o.timers, g = H.get(this);
            if (c)
              g[c] && g[c].stop && s(g[c]);
            else
              for (c in g)
                g[c] && g[c].stop && fa.test(c) && s(g[c]);
            for (c = l.length; c--; )
              l[c].elem === this && (t == null || l[c].queue === t) && (l[c].anim.stop(i), u = !1, l.splice(c, 1));
            (u || !i) && o.dequeue(this, t);
          });
        },
        finish: function(t) {
          return t !== !1 && (t = t || "fx"), this.each(function() {
            var n, i = H.get(this), s = i[t + "queue"], u = i[t + "queueHooks"], c = o.timers, l = s ? s.length : 0;
            for (i.finish = !0, o.queue(this, t, []), u && u.stop && u.stop.call(this, !0), n = c.length; n--; )
              c[n].elem === this && c[n].queue === t && (c[n].anim.stop(!0), c.splice(n, 1));
            for (n = 0; n < l; n++)
              s[n] && s[n].finish && s[n].finish.call(this);
            delete i.finish;
          });
        }
      }), o.each(["toggle", "show", "hide"], function(t, n) {
        var i = o.fn[n];
        o.fn[n] = function(s, u, c) {
          return s == null || typeof s == "boolean" ? i.apply(this, arguments) : this.animate(Gn(n, !0), s, u, c);
        };
      }), o.each({
        slideDown: Gn("show"),
        slideUp: Gn("hide"),
        slideToggle: Gn("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(t, n) {
        o.fn[t] = function(i, s, u) {
          return this.animate(n, i, s, u);
        };
      }), o.timers = [], o.fx.tick = function() {
        var t, n = 0, i = o.timers;
        for (en = Date.now(); n < i.length; n++)
          t = i[n], !t() && i[n] === t && i.splice(n--, 1);
        i.length || o.fx.stop(), en = void 0;
      }, o.fx.timer = function(t) {
        o.timers.push(t), o.fx.start();
      }, o.fx.interval = 13, o.fx.start = function() {
        zn || (zn = !0, Li());
      }, o.fx.stop = function() {
        zn = null;
      }, o.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      }, o.fn.delay = function(t, n) {
        return t = o.fx && o.fx.speeds[t] || t, n = n || "fx", this.queue(n, function(i, s) {
          var u = e.setTimeout(i, t);
          s.stop = function() {
            e.clearTimeout(u);
          };
        });
      }, function() {
        var t = P.createElement("input"), n = P.createElement("select"), i = n.appendChild(P.createElement("option"));
        t.type = "checkbox", M.checkOn = t.value !== "", M.optSelected = i.selected, t = P.createElement("input"), t.value = "t", t.type = "radio", M.radioValue = t.value === "t";
      }();
      var Zr, Sn = o.expr.attrHandle;
      o.fn.extend({
        attr: function(t, n) {
          return Ft(this, o.attr, t, n, arguments.length > 1);
        },
        removeAttr: function(t) {
          return this.each(function() {
            o.removeAttr(this, t);
          });
        }
      }), o.extend({
        attr: function(t, n, i) {
          var s, u, c = t.nodeType;
          if (!(c === 3 || c === 8 || c === 2)) {
            if (typeof t.getAttribute > "u")
              return o.prop(t, n, i);
            if ((c !== 1 || !o.isXMLDoc(t)) && (u = o.attrHooks[n.toLowerCase()] || (o.expr.match.bool.test(n) ? Zr : void 0)), i !== void 0) {
              if (i === null) {
                o.removeAttr(t, n);
                return;
              }
              return u && "set" in u && (s = u.set(t, i, n)) !== void 0 ? s : (t.setAttribute(n, i + ""), i);
            }
            return u && "get" in u && (s = u.get(t, n)) !== null ? s : (s = o.find.attr(t, n), s ?? void 0);
          }
        },
        attrHooks: {
          type: {
            set: function(t, n) {
              if (!M.radioValue && n === "radio" && U(t, "input")) {
                var i = t.value;
                return t.setAttribute("type", n), i && (t.value = i), n;
              }
            }
          }
        },
        removeAttr: function(t, n) {
          var i, s = 0, u = n && n.match(kt);
          if (u && t.nodeType === 1)
            for (; i = u[s++]; )
              t.removeAttribute(i);
        }
      }), Zr = {
        set: function(t, n, i) {
          return n === !1 ? o.removeAttr(t, i) : t.setAttribute(i, i), i;
        }
      }, o.each(o.expr.match.bool.source.match(/\w+/g), function(t, n) {
        var i = Sn[n] || o.find.attr;
        Sn[n] = function(s, u, c) {
          var l, g, h = u.toLowerCase();
          return c || (g = Sn[h], Sn[h] = l, l = i(s, u, c) != null ? h : null, Sn[h] = g), l;
        };
      });
      var pa = /^(?:input|select|textarea|button)$/i, ga = /^(?:a|area)$/i;
      o.fn.extend({
        prop: function(t, n) {
          return Ft(this, o.prop, t, n, arguments.length > 1);
        },
        removeProp: function(t) {
          return this.each(function() {
            delete this[o.propFix[t] || t];
          });
        }
      }), o.extend({
        prop: function(t, n, i) {
          var s, u, c = t.nodeType;
          if (!(c === 3 || c === 8 || c === 2))
            return (c !== 1 || !o.isXMLDoc(t)) && (n = o.propFix[n] || n, u = o.propHooks[n]), i !== void 0 ? u && "set" in u && (s = u.set(t, i, n)) !== void 0 ? s : t[n] = i : u && "get" in u && (s = u.get(t, n)) !== null ? s : t[n];
        },
        propHooks: {
          tabIndex: {
            get: function(t) {
              var n = o.find.attr(t, "tabindex");
              return n ? parseInt(n, 10) : pa.test(t.nodeName) || ga.test(t.nodeName) && t.href ? 0 : -1;
            }
          }
        },
        propFix: {
          for: "htmlFor",
          class: "className"
        }
      }), M.optSelected || (o.propHooks.selected = {
        get: function(t) {
          var n = t.parentNode;
          return n && n.parentNode && n.parentNode.selectedIndex, null;
        },
        set: function(t) {
          var n = t.parentNode;
          n && (n.selectedIndex, n.parentNode && n.parentNode.selectedIndex);
        }
      }), o.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        o.propFix[this.toLowerCase()] = this;
      });
      function ke(t) {
        var n = t.match(kt) || [];
        return n.join(" ");
      }
      function Pe(t) {
        return t.getAttribute && t.getAttribute("class") || "";
      }
      function $i(t) {
        return Array.isArray(t) ? t : typeof t == "string" ? t.match(kt) || [] : [];
      }
      o.fn.extend({
        addClass: function(t) {
          var n, i, s, u, c, l;
          return $(t) ? this.each(function(g) {
            o(this).addClass(t.call(this, g, Pe(this)));
          }) : (n = $i(t), n.length ? this.each(function() {
            if (s = Pe(this), i = this.nodeType === 1 && " " + ke(s) + " ", i) {
              for (c = 0; c < n.length; c++)
                u = n[c], i.indexOf(" " + u + " ") < 0 && (i += u + " ");
              l = ke(i), s !== l && this.setAttribute("class", l);
            }
          }) : this);
        },
        removeClass: function(t) {
          var n, i, s, u, c, l;
          return $(t) ? this.each(function(g) {
            o(this).removeClass(t.call(this, g, Pe(this)));
          }) : arguments.length ? (n = $i(t), n.length ? this.each(function() {
            if (s = Pe(this), i = this.nodeType === 1 && " " + ke(s) + " ", i) {
              for (c = 0; c < n.length; c++)
                for (u = n[c]; i.indexOf(" " + u + " ") > -1; )
                  i = i.replace(" " + u + " ", " ");
              l = ke(i), s !== l && this.setAttribute("class", l);
            }
          }) : this) : this.attr("class", "");
        },
        toggleClass: function(t, n) {
          var i, s, u, c, l = typeof t, g = l === "string" || Array.isArray(t);
          return $(t) ? this.each(function(h) {
            o(this).toggleClass(
              t.call(this, h, Pe(this), n),
              n
            );
          }) : typeof n == "boolean" && g ? n ? this.addClass(t) : this.removeClass(t) : (i = $i(t), this.each(function() {
            if (g)
              for (c = o(this), u = 0; u < i.length; u++)
                s = i[u], c.hasClass(s) ? c.removeClass(s) : c.addClass(s);
            else (t === void 0 || l === "boolean") && (s = Pe(this), s && H.set(this, "__className__", s), this.setAttribute && this.setAttribute(
              "class",
              s || t === !1 ? "" : H.get(this, "__className__") || ""
            ));
          }));
        },
        hasClass: function(t) {
          var n, i, s = 0;
          for (n = " " + t + " "; i = this[s++]; )
            if (i.nodeType === 1 && (" " + ke(Pe(i)) + " ").indexOf(n) > -1)
              return !0;
          return !1;
        }
      });
      var ma = /\r/g;
      o.fn.extend({
        val: function(t) {
          var n, i, s, u = this[0];
          return arguments.length ? (s = $(t), this.each(function(c) {
            var l;
            this.nodeType === 1 && (s ? l = t.call(this, c, o(this).val()) : l = t, l == null ? l = "" : typeof l == "number" ? l += "" : Array.isArray(l) && (l = o.map(l, function(g) {
              return g == null ? "" : g + "";
            })), n = o.valHooks[this.type] || o.valHooks[this.nodeName.toLowerCase()], (!n || !("set" in n) || n.set(this, l, "value") === void 0) && (this.value = l));
          })) : u ? (n = o.valHooks[u.type] || o.valHooks[u.nodeName.toLowerCase()], n && "get" in n && (i = n.get(u, "value")) !== void 0 ? i : (i = u.value, typeof i == "string" ? i.replace(ma, "") : i ?? "")) : void 0;
        }
      }), o.extend({
        valHooks: {
          option: {
            get: function(t) {
              var n = o.find.attr(t, "value");
              return n ?? // Support: IE <=10 - 11 only
              // option.text throws exceptions (trac-14686, trac-14858)
              // Strip and collapse whitespace
              // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
              ke(o.text(t));
            }
          },
          select: {
            get: function(t) {
              var n, i, s, u = t.options, c = t.selectedIndex, l = t.type === "select-one", g = l ? null : [], h = l ? c + 1 : u.length;
              for (c < 0 ? s = h : s = l ? c : 0; s < h; s++)
                if (i = u[s], (i.selected || s === c) && // Don't return options that are disabled or in a disabled optgroup
                !i.disabled && (!i.parentNode.disabled || !U(i.parentNode, "optgroup"))) {
                  if (n = o(i).val(), l)
                    return n;
                  g.push(n);
                }
              return g;
            },
            set: function(t, n) {
              for (var i, s, u = t.options, c = o.makeArray(n), l = u.length; l--; )
                s = u[l], (s.selected = o.inArray(o.valHooks.option.get(s), c) > -1) && (i = !0);
              return i || (t.selectedIndex = -1), c;
            }
          }
        }
      }), o.each(["radio", "checkbox"], function() {
        o.valHooks[this] = {
          set: function(t, n) {
            if (Array.isArray(n))
              return t.checked = o.inArray(o(t).val(), n) > -1;
          }
        }, M.checkOn || (o.valHooks[this].get = function(t) {
          return t.getAttribute("value") === null ? "on" : t.value;
        });
      });
      var xn = e.location, ts = { guid: Date.now() }, Ii = /\?/;
      o.parseXML = function(t) {
        var n, i;
        if (!t || typeof t != "string")
          return null;
        try {
          n = new e.DOMParser().parseFromString(t, "text/xml");
        } catch {
        }
        return i = n && n.getElementsByTagName("parsererror")[0], (!n || i) && o.error("Invalid XML: " + (i ? o.map(i.childNodes, function(s) {
          return s.textContent;
        }).join(`
`) : t)), n;
      };
      var es = /^(?:focusinfocus|focusoutblur)$/, ns = function(t) {
        t.stopPropagation();
      };
      o.extend(o.event, {
        trigger: function(t, n, i, s) {
          var u, c, l, g, h, _, A, S, b = [i || P], O = F.call(t, "type") ? t.type : t, K = F.call(t, "namespace") ? t.namespace.split(".") : [];
          if (c = S = l = i = i || P, !(i.nodeType === 3 || i.nodeType === 8) && !es.test(O + o.event.triggered) && (O.indexOf(".") > -1 && (K = O.split("."), O = K.shift(), K.sort()), h = O.indexOf(":") < 0 && "on" + O, t = t[o.expando] ? t : new o.Event(O, typeof t == "object" && t), t.isTrigger = s ? 2 : 3, t.namespace = K.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + K.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = n == null ? [t] : o.makeArray(n, [t]), A = o.event.special[O] || {}, !(!s && A.trigger && A.trigger.apply(i, n) === !1))) {
            if (!s && !A.noBubble && !J(i)) {
              for (g = A.delegateType || O, es.test(g + O) || (c = c.parentNode); c; c = c.parentNode)
                b.push(c), l = c;
              l === (i.ownerDocument || P) && b.push(l.defaultView || l.parentWindow || e);
            }
            for (u = 0; (c = b[u++]) && !t.isPropagationStopped(); )
              S = c, t.type = u > 1 ? g : A.bindType || O, _ = (H.get(c, "events") || /* @__PURE__ */ Object.create(null))[t.type] && H.get(c, "handle"), _ && _.apply(c, n), _ = h && c[h], _ && _.apply && ve(c) && (t.result = _.apply(c, n), t.result === !1 && t.preventDefault());
            return t.type = O, !s && !t.isDefaultPrevented() && (!A._default || A._default.apply(b.pop(), n) === !1) && ve(i) && h && $(i[O]) && !J(i) && (l = i[h], l && (i[h] = null), o.event.triggered = O, t.isPropagationStopped() && S.addEventListener(O, ns), i[O](), t.isPropagationStopped() && S.removeEventListener(O, ns), o.event.triggered = void 0, l && (i[h] = l)), t.result;
          }
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(t, n, i) {
          var s = o.extend(
            new o.Event(),
            i,
            {
              type: t,
              isSimulated: !0
            }
          );
          o.event.trigger(s, null, n);
        }
      }), o.fn.extend({
        trigger: function(t, n) {
          return this.each(function() {
            o.event.trigger(t, n, this);
          });
        },
        triggerHandler: function(t, n) {
          var i = this[0];
          if (i)
            return o.event.trigger(t, n, i, !0);
        }
      });
      var _a = /\[\]$/, is = /\r?\n/g, va = /^(?:submit|button|image|reset|file)$/i, ya = /^(?:input|select|textarea|keygen)/i;
      function ki(t, n, i, s) {
        var u;
        if (Array.isArray(n))
          o.each(n, function(c, l) {
            i || _a.test(t) ? s(t, l) : ki(
              t + "[" + (typeof l == "object" && l != null ? c : "") + "]",
              l,
              i,
              s
            );
          });
        else if (!i && G(n) === "object")
          for (u in n)
            ki(t + "[" + u + "]", n[u], i, s);
        else
          s(t, n);
      }
      o.param = function(t, n) {
        var i, s = [], u = function(c, l) {
          var g = $(l) ? l() : l;
          s[s.length] = encodeURIComponent(c) + "=" + encodeURIComponent(g ?? "");
        };
        if (t == null)
          return "";
        if (Array.isArray(t) || t.jquery && !o.isPlainObject(t))
          o.each(t, function() {
            u(this.name, this.value);
          });
        else
          for (i in t)
            ki(i, t[i], n, u);
        return s.join("&");
      }, o.fn.extend({
        serialize: function() {
          return o.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var t = o.prop(this, "elements");
            return t ? o.makeArray(t) : this;
          }).filter(function() {
            var t = this.type;
            return this.name && !o(this).is(":disabled") && ya.test(this.nodeName) && !va.test(t) && (this.checked || !wn.test(t));
          }).map(function(t, n) {
            var i = o(this).val();
            return i == null ? null : Array.isArray(i) ? o.map(i, function(s) {
              return { name: n.name, value: s.replace(is, `\r
`) };
            }) : { name: n.name, value: i.replace(is, `\r
`) };
          }).get();
        }
      });
      var Ea = /%20/g, ba = /#.*$/, Ta = /([?&])_=[^&]*/, Aa = /^(.*?):[ \t]*([^\r\n]*)$/mg, wa = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ca = /^(?:GET|HEAD)$/, Sa = /^\/\//, rs = {}, Pi = {}, ss = "*/".concat("*"), Mi = P.createElement("a");
      Mi.href = xn.href;
      function os(t) {
        return function(n, i) {
          typeof n != "string" && (i = n, n = "*");
          var s, u = 0, c = n.toLowerCase().match(kt) || [];
          if ($(i))
            for (; s = c[u++]; )
              s[0] === "+" ? (s = s.slice(1) || "*", (t[s] = t[s] || []).unshift(i)) : (t[s] = t[s] || []).push(i);
        };
      }
      function as(t, n, i, s) {
        var u = {}, c = t === Pi;
        function l(g) {
          var h;
          return u[g] = !0, o.each(t[g] || [], function(_, A) {
            var S = A(n, i, s);
            if (typeof S == "string" && !c && !u[S])
              return n.dataTypes.unshift(S), l(S), !1;
            if (c)
              return !(h = S);
          }), h;
        }
        return l(n.dataTypes[0]) || !u["*"] && l("*");
      }
      function Ri(t, n) {
        var i, s, u = o.ajaxSettings.flatOptions || {};
        for (i in n)
          n[i] !== void 0 && ((u[i] ? t : s || (s = {}))[i] = n[i]);
        return s && o.extend(!0, t, s), t;
      }
      function xa(t, n, i) {
        for (var s, u, c, l, g = t.contents, h = t.dataTypes; h[0] === "*"; )
          h.shift(), s === void 0 && (s = t.mimeType || n.getResponseHeader("Content-Type"));
        if (s) {
          for (u in g)
            if (g[u] && g[u].test(s)) {
              h.unshift(u);
              break;
            }
        }
        if (h[0] in i)
          c = h[0];
        else {
          for (u in i) {
            if (!h[0] || t.converters[u + " " + h[0]]) {
              c = u;
              break;
            }
            l || (l = u);
          }
          c = c || l;
        }
        if (c)
          return c !== h[0] && h.unshift(c), i[c];
      }
      function Na(t, n, i, s) {
        var u, c, l, g, h, _ = {}, A = t.dataTypes.slice();
        if (A[1])
          for (l in t.converters)
            _[l.toLowerCase()] = t.converters[l];
        for (c = A.shift(); c; )
          if (t.responseFields[c] && (i[t.responseFields[c]] = n), !h && s && t.dataFilter && (n = t.dataFilter(n, t.dataType)), h = c, c = A.shift(), c) {
            if (c === "*")
              c = h;
            else if (h !== "*" && h !== c) {
              if (l = _[h + " " + c] || _["* " + c], !l) {
                for (u in _)
                  if (g = u.split(" "), g[1] === c && (l = _[h + " " + g[0]] || _["* " + g[0]], l)) {
                    l === !0 ? l = _[u] : _[u] !== !0 && (c = g[0], A.unshift(g[1]));
                    break;
                  }
              }
              if (l !== !0)
                if (l && t.throws)
                  n = l(n);
                else
                  try {
                    n = l(n);
                  } catch (S) {
                    return {
                      state: "parsererror",
                      error: l ? S : "No conversion from " + h + " to " + c
                    };
                  }
            }
          }
        return { state: "success", data: n };
      }
      o.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: xn.href,
          type: "GET",
          isLocal: wa.test(xn.protocol),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": ss,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": !0,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": o.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: !0,
            context: !0
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(t, n) {
          return n ? (
            // Building a settings object
            Ri(Ri(t, o.ajaxSettings), n)
          ) : (
            // Extending ajaxSettings
            Ri(o.ajaxSettings, t)
          );
        },
        ajaxPrefilter: os(rs),
        ajaxTransport: os(Pi),
        // Main method
        ajax: function(t, n) {
          typeof t == "object" && (n = t, t = void 0), n = n || {};
          var i, s, u, c, l, g, h, _, A, S, b = o.ajaxSetup({}, n), O = b.context || b, K = b.context && (O.nodeType || O.jquery) ? o(O) : o.event, nt = o.Deferred(), Q = o.Callbacks("once memory"), _t = b.statusCode || {}, pt = {}, zt = {}, Gt = "canceled", et = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(it) {
              var lt;
              if (h) {
                if (!c)
                  for (c = {}; lt = Aa.exec(u); )
                    c[lt[1].toLowerCase() + " "] = (c[lt[1].toLowerCase() + " "] || []).concat(lt[2]);
                lt = c[it.toLowerCase() + " "];
              }
              return lt == null ? null : lt.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return h ? u : null;
            },
            // Caches the header
            setRequestHeader: function(it, lt) {
              return h == null && (it = zt[it.toLowerCase()] = zt[it.toLowerCase()] || it, pt[it] = lt), this;
            },
            // Overrides response content-type header
            overrideMimeType: function(it) {
              return h == null && (b.mimeType = it), this;
            },
            // Status-dependent callbacks
            statusCode: function(it) {
              var lt;
              if (it)
                if (h)
                  et.always(it[et.status]);
                else
                  for (lt in it)
                    _t[lt] = [_t[lt], it[lt]];
              return this;
            },
            // Cancel the request
            abort: function(it) {
              var lt = it || Gt;
              return i && i.abort(lt), Me(0, lt), this;
            }
          };
          if (nt.promise(et), b.url = ((t || b.url || xn.href) + "").replace(Sa, xn.protocol + "//"), b.type = n.method || n.type || b.method || b.type, b.dataTypes = (b.dataType || "*").toLowerCase().match(kt) || [""], b.crossDomain == null) {
            g = P.createElement("a");
            try {
              g.href = b.url, g.href = g.href, b.crossDomain = Mi.protocol + "//" + Mi.host != g.protocol + "//" + g.host;
            } catch {
              b.crossDomain = !0;
            }
          }
          if (b.data && b.processData && typeof b.data != "string" && (b.data = o.param(b.data, b.traditional)), as(rs, b, n, et), h)
            return et;
          _ = o.event && b.global, _ && o.active++ === 0 && o.event.trigger("ajaxStart"), b.type = b.type.toUpperCase(), b.hasContent = !Ca.test(b.type), s = b.url.replace(ba, ""), b.hasContent ? b.data && b.processData && (b.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && (b.data = b.data.replace(Ea, "+")) : (S = b.url.slice(s.length), b.data && (b.processData || typeof b.data == "string") && (s += (Ii.test(s) ? "&" : "?") + b.data, delete b.data), b.cache === !1 && (s = s.replace(Ta, "$1"), S = (Ii.test(s) ? "&" : "?") + "_=" + ts.guid++ + S), b.url = s + S), b.ifModified && (o.lastModified[s] && et.setRequestHeader("If-Modified-Since", o.lastModified[s]), o.etag[s] && et.setRequestHeader("If-None-Match", o.etag[s])), (b.data && b.hasContent && b.contentType !== !1 || n.contentType) && et.setRequestHeader("Content-Type", b.contentType), et.setRequestHeader(
            "Accept",
            b.dataTypes[0] && b.accepts[b.dataTypes[0]] ? b.accepts[b.dataTypes[0]] + (b.dataTypes[0] !== "*" ? ", " + ss + "; q=0.01" : "") : b.accepts["*"]
          );
          for (A in b.headers)
            et.setRequestHeader(A, b.headers[A]);
          if (b.beforeSend && (b.beforeSend.call(O, et, b) === !1 || h))
            return et.abort();
          if (Gt = "abort", Q.add(b.complete), et.done(b.success), et.fail(b.error), i = as(Pi, b, n, et), !i)
            Me(-1, "No Transport");
          else {
            if (et.readyState = 1, _ && K.trigger("ajaxSend", [et, b]), h)
              return et;
            b.async && b.timeout > 0 && (l = e.setTimeout(function() {
              et.abort("timeout");
            }, b.timeout));
            try {
              h = !1, i.send(pt, Me);
            } catch (it) {
              if (h)
                throw it;
              Me(-1, it);
            }
          }
          function Me(it, lt, On, ji) {
            var Xt, Dn, Qt, ye, Ee, Mt = lt;
            h || (h = !0, l && e.clearTimeout(l), i = void 0, u = ji || "", et.readyState = it > 0 ? 4 : 0, Xt = it >= 200 && it < 300 || it === 304, On && (ye = xa(b, et, On)), !Xt && o.inArray("script", b.dataTypes) > -1 && o.inArray("json", b.dataTypes) < 0 && (b.converters["text script"] = function() {
            }), ye = Na(b, ye, et, Xt), Xt ? (b.ifModified && (Ee = et.getResponseHeader("Last-Modified"), Ee && (o.lastModified[s] = Ee), Ee = et.getResponseHeader("etag"), Ee && (o.etag[s] = Ee)), it === 204 || b.type === "HEAD" ? Mt = "nocontent" : it === 304 ? Mt = "notmodified" : (Mt = ye.state, Dn = ye.data, Qt = ye.error, Xt = !Qt)) : (Qt = Mt, (it || !Mt) && (Mt = "error", it < 0 && (it = 0))), et.status = it, et.statusText = (lt || Mt) + "", Xt ? nt.resolveWith(O, [Dn, Mt, et]) : nt.rejectWith(O, [et, Mt, Qt]), et.statusCode(_t), _t = void 0, _ && K.trigger(
              Xt ? "ajaxSuccess" : "ajaxError",
              [et, b, Xt ? Dn : Qt]
            ), Q.fireWith(O, [et, Mt]), _ && (K.trigger("ajaxComplete", [et, b]), --o.active || o.event.trigger("ajaxStop")));
          }
          return et;
        },
        getJSON: function(t, n, i) {
          return o.get(t, n, i, "json");
        },
        getScript: function(t, n) {
          return o.get(t, void 0, n, "script");
        }
      }), o.each(["get", "post"], function(t, n) {
        o[n] = function(i, s, u, c) {
          return $(s) && (c = c || u, u = s, s = void 0), o.ajax(o.extend({
            url: i,
            type: n,
            dataType: c,
            data: s,
            success: u
          }, o.isPlainObject(i) && i));
        };
      }), o.ajaxPrefilter(function(t) {
        var n;
        for (n in t.headers)
          n.toLowerCase() === "content-type" && (t.contentType = t.headers[n] || "");
      }), o._evalUrl = function(t, n, i) {
        return o.ajax({
          url: t,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: !0,
          async: !1,
          global: !1,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(s) {
            o.globalEval(s, n, i);
          }
        });
      }, o.fn.extend({
        wrapAll: function(t) {
          var n;
          return this[0] && ($(t) && (t = t.call(this[0])), n = o(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && n.insertBefore(this[0]), n.map(function() {
            for (var i = this; i.firstElementChild; )
              i = i.firstElementChild;
            return i;
          }).append(this)), this;
        },
        wrapInner: function(t) {
          return $(t) ? this.each(function(n) {
            o(this).wrapInner(t.call(this, n));
          }) : this.each(function() {
            var n = o(this), i = n.contents();
            i.length ? i.wrapAll(t) : n.append(t);
          });
        },
        wrap: function(t) {
          var n = $(t);
          return this.each(function(i) {
            o(this).wrapAll(n ? t.call(this, i) : t);
          });
        },
        unwrap: function(t) {
          return this.parent(t).not("body").each(function() {
            o(this).replaceWith(this.childNodes);
          }), this;
        }
      }), o.expr.pseudos.hidden = function(t) {
        return !o.expr.pseudos.visible(t);
      }, o.expr.pseudos.visible = function(t) {
        return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
      }, o.ajaxSettings.xhr = function() {
        try {
          return new e.XMLHttpRequest();
        } catch {
        }
      };
      var Oa = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, Nn = o.ajaxSettings.xhr();
      M.cors = !!Nn && "withCredentials" in Nn, M.ajax = Nn = !!Nn, o.ajaxTransport(function(t) {
        var n, i;
        if (M.cors || Nn && !t.crossDomain)
          return {
            send: function(s, u) {
              var c, l = t.xhr();
              if (l.open(
                t.type,
                t.url,
                t.async,
                t.username,
                t.password
              ), t.xhrFields)
                for (c in t.xhrFields)
                  l[c] = t.xhrFields[c];
              t.mimeType && l.overrideMimeType && l.overrideMimeType(t.mimeType), !t.crossDomain && !s["X-Requested-With"] && (s["X-Requested-With"] = "XMLHttpRequest");
              for (c in s)
                l.setRequestHeader(c, s[c]);
              n = function(g) {
                return function() {
                  n && (n = i = l.onload = l.onerror = l.onabort = l.ontimeout = l.onreadystatechange = null, g === "abort" ? l.abort() : g === "error" ? typeof l.status != "number" ? u(0, "error") : u(
                    // File: protocol always yields status 0; see trac-8605, trac-14207
                    l.status,
                    l.statusText
                  ) : u(
                    Oa[l.status] || l.status,
                    l.statusText,
                    // Support: IE <=9 only
                    // IE9 has no XHR2 but throws on binary (trac-11426)
                    // For XHR2 non-text, let the caller handle it (gh-2498)
                    (l.responseType || "text") !== "text" || typeof l.responseText != "string" ? { binary: l.response } : { text: l.responseText },
                    l.getAllResponseHeaders()
                  ));
                };
              }, l.onload = n(), i = l.onerror = l.ontimeout = n("error"), l.onabort !== void 0 ? l.onabort = i : l.onreadystatechange = function() {
                l.readyState === 4 && e.setTimeout(function() {
                  n && i();
                });
              }, n = n("abort");
              try {
                l.send(t.hasContent && t.data || null);
              } catch (g) {
                if (n)
                  throw g;
              }
            },
            abort: function() {
              n && n();
            }
          };
      }), o.ajaxPrefilter(function(t) {
        t.crossDomain && (t.contents.script = !1);
      }), o.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(t) {
            return o.globalEval(t), t;
          }
        }
      }), o.ajaxPrefilter("script", function(t) {
        t.cache === void 0 && (t.cache = !1), t.crossDomain && (t.type = "GET");
      }), o.ajaxTransport("script", function(t) {
        if (t.crossDomain || t.scriptAttrs) {
          var n, i;
          return {
            send: function(s, u) {
              n = o("<script>").attr(t.scriptAttrs || {}).prop({ charset: t.scriptCharset, src: t.url }).on("load error", i = function(c) {
                n.remove(), i = null, c && u(c.type === "error" ? 404 : 200, c.type);
              }), P.head.appendChild(n[0]);
            },
            abort: function() {
              i && i();
            }
          };
        }
      });
      var us = [], Hi = /(=)\?(?=&|$)|\?\?/;
      o.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var t = us.pop() || o.expando + "_" + ts.guid++;
          return this[t] = !0, t;
        }
      }), o.ajaxPrefilter("json jsonp", function(t, n, i) {
        var s, u, c, l = t.jsonp !== !1 && (Hi.test(t.url) ? "url" : typeof t.data == "string" && (t.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Hi.test(t.data) && "data");
        if (l || t.dataTypes[0] === "jsonp")
          return s = t.jsonpCallback = $(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, l ? t[l] = t[l].replace(Hi, "$1" + s) : t.jsonp !== !1 && (t.url += (Ii.test(t.url) ? "&" : "?") + t.jsonp + "=" + s), t.converters["script json"] = function() {
            return c || o.error(s + " was not called"), c[0];
          }, t.dataTypes[0] = "json", u = e[s], e[s] = function() {
            c = arguments;
          }, i.always(function() {
            u === void 0 ? o(e).removeProp(s) : e[s] = u, t[s] && (t.jsonpCallback = n.jsonpCallback, us.push(s)), c && $(u) && u(c[0]), c = u = void 0;
          }), "script";
      }), M.createHTMLDocument = function() {
        var t = P.implementation.createHTMLDocument("").body;
        return t.innerHTML = "<form></form><form></form>", t.childNodes.length === 2;
      }(), o.parseHTML = function(t, n, i) {
        if (typeof t != "string")
          return [];
        typeof n == "boolean" && (i = n, n = !1);
        var s, u, c;
        return n || (M.createHTMLDocument ? (n = P.implementation.createHTMLDocument(""), s = n.createElement("base"), s.href = P.location.href, n.head.appendChild(s)) : n = P), u = ge.exec(t), c = !i && [], u ? [n.createElement(u[1])] : (u = Hr([t], n, c), c && c.length && o(c).remove(), o.merge([], u.childNodes));
      }, o.fn.load = function(t, n, i) {
        var s, u, c, l = this, g = t.indexOf(" ");
        return g > -1 && (s = ke(t.slice(g)), t = t.slice(0, g)), $(n) ? (i = n, n = void 0) : n && typeof n == "object" && (u = "POST"), l.length > 0 && o.ajax({
          url: t,
          // If "type" variable is undefined, then "GET" method will be used.
          // Make value of this field explicit since
          // user can override it through ajaxSetup method
          type: u || "GET",
          dataType: "html",
          data: n
        }).done(function(h) {
          c = arguments, l.html(s ? (
            // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            o("<div>").append(o.parseHTML(h)).find(s)
          ) : (
            // Otherwise use the full result
            h
          ));
        }).always(i && function(h, _) {
          l.each(function() {
            i.apply(this, c || [h.responseText, _, h]);
          });
        }), this;
      }, o.expr.pseudos.animated = function(t) {
        return o.grep(o.timers, function(n) {
          return t === n.elem;
        }).length;
      }, o.offset = {
        setOffset: function(t, n, i) {
          var s, u, c, l, g, h, _, A = o.css(t, "position"), S = o(t), b = {};
          A === "static" && (t.style.position = "relative"), g = S.offset(), c = o.css(t, "top"), h = o.css(t, "left"), _ = (A === "absolute" || A === "fixed") && (c + h).indexOf("auto") > -1, _ ? (s = S.position(), l = s.top, u = s.left) : (l = parseFloat(c) || 0, u = parseFloat(h) || 0), $(n) && (n = n.call(t, i, o.extend({}, g))), n.top != null && (b.top = n.top - g.top + l), n.left != null && (b.left = n.left - g.left + u), "using" in n ? n.using.call(t, b) : S.css(b);
        }
      }, o.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(t) {
          if (arguments.length)
            return t === void 0 ? this : this.each(function(u) {
              o.offset.setOffset(this, t, u);
            });
          var n, i, s = this[0];
          if (s)
            return s.getClientRects().length ? (n = s.getBoundingClientRect(), i = s.ownerDocument.defaultView, {
              top: n.top + i.pageYOffset,
              left: n.left + i.pageXOffset
            }) : { top: 0, left: 0 };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (this[0]) {
            var t, n, i, s = this[0], u = { top: 0, left: 0 };
            if (o.css(s, "position") === "fixed")
              n = s.getBoundingClientRect();
            else {
              for (n = this.offset(), i = s.ownerDocument, t = s.offsetParent || i.documentElement; t && (t === i.body || t === i.documentElement) && o.css(t, "position") === "static"; )
                t = t.parentNode;
              t && t !== s && t.nodeType === 1 && (u = o(t).offset(), u.top += o.css(t, "borderTopWidth", !0), u.left += o.css(t, "borderLeftWidth", !0));
            }
            return {
              top: n.top - u.top - o.css(s, "marginTop", !0),
              left: n.left - u.left - o.css(s, "marginLeft", !0)
            };
          }
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            for (var t = this.offsetParent; t && o.css(t, "position") === "static"; )
              t = t.offsetParent;
            return t || Ie;
          });
        }
      }), o.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(t, n) {
        var i = n === "pageYOffset";
        o.fn[t] = function(s) {
          return Ft(this, function(u, c, l) {
            var g;
            if (J(u) ? g = u : u.nodeType === 9 && (g = u.defaultView), l === void 0)
              return g ? g[n] : u[c];
            g ? g.scrollTo(
              i ? g.pageXOffset : l,
              i ? l : g.pageYOffset
            ) : u[c] = l;
          }, t, s, arguments.length);
        };
      }), o.each(["top", "left"], function(t, n) {
        o.cssHooks[n] = Br(
          M.pixelPosition,
          function(i, s) {
            if (s)
              return s = Cn(i, n), xi.test(s) ? o(i).position()[n] + "px" : s;
          }
        );
      }), o.each({ Height: "height", Width: "width" }, function(t, n) {
        o.each({
          padding: "inner" + t,
          content: n,
          "": "outer" + t
        }, function(i, s) {
          o.fn[s] = function(u, c) {
            var l = arguments.length && (i || typeof u != "boolean"), g = i || (u === !0 || c === !0 ? "margin" : "border");
            return Ft(this, function(h, _, A) {
              var S;
              return J(h) ? s.indexOf("outer") === 0 ? h["inner" + t] : h.document.documentElement["client" + t] : h.nodeType === 9 ? (S = h.documentElement, Math.max(
                h.body["scroll" + t],
                S["scroll" + t],
                h.body["offset" + t],
                S["offset" + t],
                S["client" + t]
              )) : A === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                o.css(h, _, g)
              ) : (
                // Set width or height on the element
                o.style(h, _, A, g)
              );
            }, n, l ? u : void 0, l);
          };
        });
      }), o.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(t, n) {
        o.fn[n] = function(i) {
          return this.on(n, i);
        };
      }), o.fn.extend({
        bind: function(t, n, i) {
          return this.on(t, null, n, i);
        },
        unbind: function(t, n) {
          return this.off(t, null, n);
        },
        delegate: function(t, n, i, s) {
          return this.on(n, t, i, s);
        },
        undelegate: function(t, n, i) {
          return arguments.length === 1 ? this.off(t, "**") : this.off(n, t || "**", i);
        },
        hover: function(t, n) {
          return this.on("mouseenter", t).on("mouseleave", n || t);
        }
      }), o.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(t, n) {
          o.fn[n] = function(i, s) {
            return arguments.length > 0 ? this.on(n, null, i, s) : this.trigger(n);
          };
        }
      );
      var Da = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      o.proxy = function(t, n) {
        var i, s, u;
        if (typeof n == "string" && (i = t[n], n = t, t = i), !!$(t))
          return s = v.call(arguments, 2), u = function() {
            return t.apply(n || this, s.concat(v.call(arguments)));
          }, u.guid = t.guid = t.guid || o.guid++, u;
      }, o.holdReady = function(t) {
        t ? o.readyWait++ : o.ready(!0);
      }, o.isArray = Array.isArray, o.parseJSON = JSON.parse, o.nodeName = U, o.isFunction = $, o.isWindow = J, o.camelCase = Dt, o.type = G, o.now = Date.now, o.isNumeric = function(t) {
        var n = o.type(t);
        return (n === "number" || n === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(t - parseFloat(t));
      }, o.trim = function(t) {
        return t == null ? "" : (t + "").replace(Da, "$1");
      };
      var La = e.jQuery, $a = e.$;
      return o.noConflict = function(t) {
        return e.$ === o && (e.$ = $a), t && e.jQuery === o && (e.jQuery = La), o;
      }, typeof r > "u" && (e.jQuery = e.$ = o), o;
    });
  }(li)), li.exports;
}
var Bd = Fd();
const Ht = /* @__PURE__ */ Wd(Bd);
Ht("a.logout").on("click", (a) => {
  Ht(a.currentTarget).closest("form").submit();
});
const Kd = Ht("input[name=question]"), Yd = Ht("div.answer");
Ht("#question-button").on("click", () => {
  Ht(".loading").show("fast"), Ht(".btn-question").prop("disabled", !0).addClass("disabled"), Ht(".help-block").text(""), setTimeout(() => {
    Ht.get("/routing/question", { question: Kd.val() }).done((e) => Yd.show("fast").find("p.content").text(e.answer)).fail((e) => {
      if (e.status === 400) {
        const r = e.responseJSON[0], f = Ht(".help-block").filter(`.${r.param}`);
        f.length > 0 && f.text(r.msg);
      }
    }).always(() => {
      Ht(".loading").hide(), Ht(".btn-question").prop("disabled", !1).removeClass("disabled");
    });
  }, 2e3);
});
