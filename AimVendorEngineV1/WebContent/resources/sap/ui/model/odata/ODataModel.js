/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', './ODataUtils', './CountMode', './ODataContextBinding', './ODataListBinding', './ODataMetadata', './ODataPropertyBinding', './ODataTreeBinding', 'sap/ui/model/odata/ODataMetaModel', 'sap/ui/thirdparty/URI', 'sap/ui/thirdparty/datajs'], function(q, M, O, C, a, b, c, d, e, f, U, g) {
    "use strict";
    var h = M.extend("sap.ui.model.odata.ODataModel", {
        constructor: function(s, j, u, p, H, t, w, l) {
            M.apply(this, arguments);
            var i, r, m, A = null,
                L, k, D, S, n, o = this;
            if (typeof j === "object") {
                u = j.user;
                p = j.password;
                H = j.headers;
                t = j.tokenHandling;
                l = j.loadMetadataAsync;
                w = j.withCredentials;
                m = j.maxDataServiceVersion;
                i = j.useBatch;
                r = j.refreshAfterChange;
                A = j.annotationURI;
                L = j.loadAnnotationsJoined;
                D = j.defaultCountMode;
                k = j.metadataNamespaces;
                S = j.serviceUrlParams;
                n = j.metadataUrlParams;
                j = j.json;
            }
            this.oServiceData = {};
            this.sDefaultBindingMode = sap.ui.model.BindingMode.OneWay;
            this.mSupportedBindingModes = {
                "OneWay": true,
                "OneTime": true,
                "TwoWay": true
            };
            this.bCountSupported = true;
            this.bJSON = j;
            this.bCache = true;
            this.aPendingRequestHandles = [];
            this.oRequestQueue = {};
            this.aBatchOperations = [];
            this.oHandler;
            this.bTokenHandling = t !== false;
            this.bWithCredentials = w === true;
            this.bUseBatch = i === true;
            this.bRefreshAfterChange = r !== false;
            this.sMaxDataServiceVersion = m;
            this.bLoadMetadataAsync = !!l;
            this.bLoadAnnotationsJoined = L === undefined ? true : L;
            this.sAnnotationURI = A;
            this.sDefaultCountMode = D || C.Both;
            this.oMetadataLoadEvent = null;
            this.oMetadataFailedEvent = null;
            if (this.sAnnotationURI) {
                q.sap.require("sap.ui.model.odata.ODataAnnotations");
            }
            this.oHeaders = {};
            this.setHeaders(H);
            this.oData = {};
            this.oMetadata = null;
            this.oAnnotations = null;
            this.aUrlParams = [];
            if (s.indexOf("?") == -1) {
                this.sServiceUrl = s;
            } else {
                var v = s.split("?");
                this.sServiceUrl = v[0];
                if (v[1]) {
                    this.aUrlParams.push(v[1]);
                }
            }
            if (sap.ui.getCore().getConfiguration().getStatistics()) {
                this.aUrlParams.push("sap-statistics=true");
            }
            this.sServiceUrl = this.sServiceUrl.replace(/\/$/, "");
            if (!h.mServiceData[this.sServiceUrl]) {
                h.mServiceData[this.sServiceUrl] = {};
            }
            this.oServiceData = h.mServiceData[this.sServiceUrl];
            if (this.bTokenHandling && this.oServiceData.securityToken) {
                this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
            }
            this.sUser = u;
            this.sPassword = p;
            this.oHeaders["Accept-Language"] = sap.ui.getCore().getConfiguration().getLanguage();
            if (!this.oServiceData.oMetadata) {
                this.oServiceData.oMetadata = new sap.ui.model.odata.ODataMetadata(this._createRequestUrl("$metadata", undefined, n), {
                    async: this.bLoadMetadataAsync,
                    user: this.sUser,
                    password: this.sPassword,
                    headers: this.mCustomHeaders,
                    namespaces: k,
                    withCredentials: this.bWithCredentials
                });
            }
            this.oMetadata = this.oServiceData.oMetadata;
            if (S) {
                this.aUrlParams = this.aUrlParams.concat(O._createUrlParamsArray(S));
            }
            this.onMetadataLoaded = function(E) {
                o._initializeMetadata();
                o.initialize();
            };
            this.onMetadataFailed = function(E) {
                o.fireMetadataFailed(E.getParameters());
            };
            if (!this.oMetadata.isLoaded()) {
                this.oMetadata.attachLoaded(this.onMetadataLoaded);
                this.oMetadata.attachFailed(this.onMetadataFailed);
            }
            if (this.oMetadata.isFailed()) {
                this.refreshMetadata();
            }
            if (this.sAnnotationURI) {
                this.oAnnotations = new sap.ui.model.odata.ODataAnnotations(this.sAnnotationURI, this.oMetadata, {
                    async: this.bLoadMetadataAsync
                });
                this.oAnnotations.attachFailed(function(E) {
                    o.fireAnnotationsFailed(E.getParameters());
                });
                this.oAnnotations.attachLoaded(function(E) {
                    o.fireAnnotationsLoaded(E.getParameters());
                });
            }
            if (this.oMetadata.isLoaded()) {
                this._initializeMetadata(true);
            }
            if (this.bJSON) {
                if (this.sMaxDataServiceVersion === "3.0") {
                    this.oHeaders["Accept"] = "application/json;odata=fullmetadata";
                } else {
                    this.oHeaders["Accept"] = "application/json";
                }
                this.oHandler = OData.jsonHandler;
            } else {
                this.oHeaders["Accept"] = "application/atom+xml,application/atomsvc+xml,application/xml";
                this.oHandler = OData.atomHandler;
            }
            this.oHeaders["MaxDataServiceVersion"] = "2.0";
            if (this.sMaxDataServiceVersion) {
                this.oHeaders["MaxDataServiceVersion"] = this.sMaxDataServiceVersion;
            }
            this.oHeaders["DataServiceVersion"] = "2.0";
        },
        metadata: {
            publicMethods: ["create", "remove", "update", "submitChanges", "getServiceMetadata", "read", "hasPendingChanges", "refresh", "refreshMetadata", "resetChanges", "isCountSupported", "setCountSupported", "setDefaultCountMode", "getDefaultCountMode", "forceNoCache", "setProperty", "getSecurityToken", "refreshSecurityToken", "setHeaders", "getHeaders", "setUseBatch"]
        }
    });
    h.M_EVENTS = {
        RejectChange: "rejectChange",
        MetadataLoaded: "metadataLoaded",
        MetadataFailed: "metadataFailed",
        AnnotationsLoaded: "annotationsLoaded",
        AnnotationsFailed: "annotationsFailed"
    };
    h.mServiceData = {};
    h.prototype.fireRejectChange = function(A) {
        this.fireEvent("rejectChange", A);
        return this;
    };
    h.prototype.attachRejectChange = function(D, F, l) {
        this.attachEvent("rejectChange", D, F, l);
        return this;
    };
    h.prototype.detachRejectChange = function(F, l) {
        this.detachEvent("rejectChange", F, l);
        return this;
    };
    h.prototype._initializeMetadata = function(D) {
        var t = this;
        this.bUseBatch = this.bUseBatch || this.oMetadata.getUseBatch();
        var i = function(j) {
            if (!!j) {
                t.metadataLoadEvent = q.sap.delayedCall(0, t, i);
            } else {
                t.fireMetadataLoaded({
                    metadata: t.oMetadata
                });
                q.sap.log.debug("ODataModel fired metadataloaded");
            }
        };
        if (this.bLoadMetadataAsync && this.sAnnotationURI && this.bLoadAnnotationsJoined) {
            if (this.oAnnotations && this.oAnnotations.bInitialized) {
                i();
            } else {
                this.oAnnotations.attachLoaded(function() {
                    i();
                }, this);
            }
        } else {
            i(D);
        }
    };
    h.prototype.fireAnnotationsLoaded = function(A) {
        this.fireEvent("annotationsLoaded", A);
        return this;
    };
    h.prototype.attachAnnotationsLoaded = function(D, F, l) {
        this.attachEvent("annotationsLoaded", D, F, l);
        return this;
    };
    h.prototype.detachAnnotationsLoaded = function(F, l) {
        this.detachEvent("annotationsLoaded", F, l);
        return this;
    };
    h.prototype.fireAnnotationsFailed = function(A) {
        this.fireEvent("annotationsFailed", A);
        q.sap.log.debug("ODataModel fired annotationsfailed");
        return this;
    };
    h.prototype.attachAnnotationsFailed = function(D, F, l) {
        this.attachEvent("annotationsFailed", D, F, l);
        return this;
    };
    h.prototype.detachAnnotationsFailed = function(F, l) {
        this.detachEvent("annotationsFailed", F, l);
        return this;
    };
    h.prototype.fireMetadataLoaded = function(A) {
        this.fireEvent("metadataLoaded", A);
        return this;
    };
    h.prototype.attachMetadataLoaded = function(D, F, l) {
        this.attachEvent("metadataLoaded", D, F, l);
        return this;
    };
    h.prototype.detachMetadataLoaded = function(F, l) {
        this.detachEvent("metadataLoaded", F, l);
        return this;
    };
    h.prototype.fireMetadataFailed = function(A) {
        this.fireEvent("metadataFailed", A);
        return this;
    };
    h.prototype.attachMetadataFailed = function(D, F, l) {
        this.attachEvent("metadataFailed", D, F, l);
        return this;
    };
    h.prototype.detachMetadataFailed = function(F, l) {
        this.detachEvent("metadataFailed", F, l);
        return this;
    };
    h.prototype.refreshMetadata = function() {
        if (this.oMetadata && this.oMetadata.refresh) {
            this.oMetadata.refresh();
        }
    };
    h.prototype._createRequestUrl = function(p, o, u, B, i) {
        var j, r, s, k = "";
        if (p && p.indexOf('?') != -1) {
            s = p.substr(p.indexOf('?') + 1);
            p = p.substr(0, p.indexOf('?'));
        }
        r = this._normalizePath(p, o);
        if (!B) {
            k = this.sServiceUrl + r;
        } else {
            k = r.substr(r.indexOf('/') + 1);
        }
        j = O._createUrlParamsArray(u);
        if (this.aUrlParams) {
            j = j.concat(this.aUrlParams);
        }
        if (s) {
            j.push(s);
        }
        if (j.length > 0) {
            k += "?" + j.join("&");
        }
        if (i === undefined) {
            i = true;
        }
        if (i === false) {
            var t = q.now();
            var l = k.replace(/([?&])_=[^&]*/, "$1_=" + t);
            k = l + ((l === k) ? (/\?/.test(k) ? "&" : "?") + "_=" + t : "");
        }
        return k;
    };
    h.prototype._loadData = function(p, P, s, E, i, H, j) {
        var r, R, t = this;

        function _(D, o) {
            var n = D,
                v = {};
            if (o.statusCode == 204) {
                if (s) {
                    s(null);
                }
                if (j) {
                    j(null);
                }
                t.fireRequestCompleted({
                    url: R.requestUri,
                    type: "GET",
                    async: R.async,
                    info: "Accept headers:" + t.oHeaders["Accept"],
                    infoObject: {
                        acceptHeaders: t.oHeaders["Accept"]
                    },
                    success: true
                });
                return;
            }
            if (!n) {
                q.sap.log.fatal("The following problem occurred: No data was retrieved by service: " + o.requestUri);
                t.fireRequestCompleted({
                    url: R.requestUri,
                    type: "GET",
                    async: R.async,
                    info: "Accept headers:" + t.oHeaders["Accept"],
                    infoObject: {
                        acceptHeaders: t.oHeaders["Accept"]
                    },
                    success: false
                });
                return false;
            }
            if (t.bUseBatch) {
                var w = t._getBatchErrors(D);
                if (w.length > 0) {
                    k(w[0]);
                    return false;
                }
                if (n.__batchResponses && n.__batchResponses.length > 0) {
                    n = n.__batchResponses[0].data;
                } else {
                    q.sap.log.fatal("The following problem occurred: No data was retrieved by service: " + o.requestUri);
                }
            }
            m = m.concat(n.results);
            if (n.__next) {
                var x = new URI(n.__next);
                R.requestUri = x.absoluteTo(o.requestUri).toString();
                l(R);
            } else {
                q.sap.extend(n.results, m);
                if (n.results && !q.isArray(n.results)) {
                    n = n.results;
                }
                t._importData(n, v);
                if (t.sChangeKey && v) {
                    var y = t.sChangeKey.substr(t.sChangeKey.lastIndexOf('/') + 1);
                    if (v[y]) {
                        delete t.oRequestQueue[t.sChangeKey];
                        t.sChangeKey = null;
                    }
                }
                if (s) {
                    s(n);
                }
                t.checkUpdate(false, false, v);
                if (j) {
                    j(n);
                }
                t.fireRequestCompleted({
                    url: R.requestUri,
                    type: "GET",
                    async: R.async,
                    info: "Accept headers:" + t.oHeaders["Accept"],
                    infoObject: {
                        acceptHeaders: t.oHeaders["Accept"]
                    },
                    success: true
                });
            }
        }

        function k(o) {
            if (t.bTokenHandling && o.response) {
                var T = t._getHeader("x-csrf-token", o.response.headers);
                if (!R.bTokenReset && o.response.statusCode == '403' && T && T.toLowerCase() == "required") {
                    t.resetSecurityToken();
                    R.bTokenReset = true;
                    l();
                    return;
                }
            }
            var n = t._handleError(o);
            if (E) {
                E(o, r && r.bAborted);
            }
            t.fireRequestCompleted({
                url: R.requestUri,
                type: "GET",
                async: R.async,
                info: "Accept headers:" + t.oHeaders["Accept"],
                infoObject: {
                    acceptHeaders: t.oHeaders["Accept"]
                },
                success: false,
                errorobject: n
            });
            if (!r || !r.bAborted) {
                n.url = R.requestUri;
                t.fireRequestFailed(n);
            }
        }

        function l() {
            if (t.bUseBatch) {
                t.updateSecurityToken();
                var n = URI.parse(R.requestUri).query;
                var o = t._createRequestUrl(p, null, n, t.bUseBatch);
                R = t._createRequest(o, "GET", true);
                var B = t._createBatchRequest([R], true);
                r = t._request(B, _, k, OData.batchHandler, undefined, t.getServiceMetadata());
            } else {
                r = t._request(R, _, k, t.oHandler, undefined, t.getServiceMetadata());
            }
            if (H) {
                var w = {
                    abort: function() {
                        r.bAborted = true;
                        r.abort();
                    }
                };
                H(w);
            }
        }
        var m = [];
        var u = this._createRequestUrl(p, null, P, null, i || this.bCache);
        R = this._createRequest(u, "GET", true);
        this.fireRequestSent({
            url: R.requestUri,
            type: "GET",
            async: R.async,
            info: "Accept headers:" + this.oHeaders["Accept"],
            infoObject: {
                acceptHeaders: this.oHeaders["Accept"]
            }
        });
        l();
    };
    h.prototype._importData = function(D, k) {
        var t = this,
            l, K, r, E;
        if (D.results) {
            l = [];
            q.each(D.results, function(i, j) {
                l.push(t._importData(j, k));
            });
            return l;
        } else {
            K = this._getKey(D);
            E = this.oData[K];
            if (!E) {
                E = D;
                this.oData[K] = E;
            }
            q.each(D, function(n, p) {
                if (p && (p.__metadata && p.__metadata.uri || p.results) && !p.__deferred) {
                    r = t._importData(p, k);
                    if (q.isArray(r)) {
                        E[n] = {
                            __list: r
                        };
                    } else {
                        E[n] = {
                            __ref: r
                        };
                    }
                } else if (!p || !p.__deferred) {
                    E[n] = p;
                }
            });
            k[K] = true;
            return K;
        }
    };
    h.prototype._removeReferences = function(D) {
        var t = this,
            l;
        if (D.results) {
            l = [];
            q.each(D.results, function(i, j) {
                l.push(t._removeReferences(j));
            });
            return l;
        } else {
            q.each(D, function(p, o) {
                if (o) {
                    if (o["__ref"] || o["__list"]) {
                        delete D[p];
                    }
                }
            });
            return D;
        }
    };
    h.prototype._restoreReferences = function(D) {
        var t = this,
            l, r = [];
        if (D.results) {
            l = [];
            q.each(D.results, function(i, j) {
                l.push(t._restoreReferences(j));
            });
            return l;
        } else {
            q.each(D, function(p, o) {
                if (o && o["__ref"]) {
                    var i = t._getObject("/" + o["__ref"]);
                    if (i) {
                        delete o["__ref"];
                        D[p] = i;
                        t._restoreReferences(i);
                    }
                } else if (o && o["__list"]) {
                    q.each(o["__list"], function(j, E) {
                        var i = t._getObject("/" + o["__list"][j]);
                        if (i) {
                            r.push(i);
                            t._restoreReferences(i);
                        }
                    });
                    delete o["__list"];
                    o.results = r;
                    r = [];
                }
            });
            return D;
        }
    };
    h.prototype.removeData = function() {
        this.oData = {};
    };
    h.prototype.initialize = function() {
        var B = this.aBindings.slice(0);
        q.each(B, function(i, o) {
            o.initialize();
        });
    };
    h.prototype.refresh = function(F, r) {
        if (r) {
            this.removeData();
        }
        this._refresh(F);
    };
    h.prototype._refresh = function(F, m, E) {
        var B = this.aBindings.slice(0);
        q.each(B, function(i, o) {
            o.refresh(F, m, E);
        });
    };
    h.prototype.checkUpdate = function(F, A, m) {
        if (A) {
            if (!this.sUpdateTimer) {
                this.sUpdateTimer = q.sap.delayedCall(0, this, function() {
                    this.checkUpdate(F, false, m);
                });
            }
            return;
        }
        if (this.sUpdateTimer) {
            q.sap.clearDelayedCall(this.sUpdateTimer);
            this.sUpdateTimer = null;
        }
        var B = this.aBindings.slice(0);
        q.each(B, function(i, o) {
            o.checkUpdate(F, m);
        });
    };
    h.prototype.bindProperty = function(p, o, P) {
        var B = new d(this, p, o, P);
        return B;
    };
    h.prototype.bindList = function(p, o, s, F, P) {
        var B = new b(this, p, o, s, F, P);
        return B;
    };
    h.prototype.bindTree = function(p, o, F, P) {
        var B = new e(this, p, o, F, P);
        return B;
    };
    h.prototype.createBindingContext = function(p, o, P, i, r) {
        var r = !!r,
            F = this.resolve(p, o);
        if (typeof o == "function") {
            i = o;
            o = null;
        }
        if (typeof P == "function") {
            i = P;
            P = null;
        }
        if (!F) {
            if (i) {
                i(null);
            }
            return null;
        }
        var D = this._getObject(p, o),
            k, n, t = this;
        if (!r) {
            r = this._isReloadNeeded(F, D, P);
        }
        if (!r) {
            k = this._getKey(D);
            n = this.getContext('/' + k);
            if (i) {
                i(n);
            }
            return n;
        }
        if (i) {
            var I = !q.sap.startsWith(p, "/");
            if (F) {
                var j = [],
                    s = this.createCustomParams(P);
                if (s) {
                    j.push(s);
                }
                this._loadData(F, j, function(D) {
                    k = D ? t._getKey(D) : undefined;
                    if (k && o && I) {
                        var l = o.getPath();
                        l = l.substr(1);
                        if (t.oData[l]) {
                            t.oData[l][p] = {
                                __ref: k
                            };
                        }
                    }
                    n = t.getContext('/' + k);
                    i(n);
                }, function() {
                    i(null);
                });
            } else {
                i(null);
            }
        }
    };
    h.prototype._isReloadNeeded = function(F, D, p) {
        var n, N = [],
            s, S = [];
        if (!F) {
            return false;
        }
        if (!D) {
            return true;
        }
        if (p && p["expand"]) {
            n = p["expand"].replace(/\s/g, "");
            N = n.split(',');
        }
        if (N) {
            for (var i = 0; i < N.length; i++) {
                var j = N[i].indexOf("/");
                if (j !== -1) {
                    var k = N[i].slice(0, j);
                    var l = N[i].slice(j + 1);
                    N[i] = [k, l];
                }
            }
        }
        for (var i = 0; i < N.length; i++) {
            var m = N[i];
            if (q.isArray(m)) {
                var o = D[m[0]];
                var r = m[1];
                if (!o || (o && o.__deferred)) {
                    return true;
                } else {
                    if (o) {
                        if (o.__list && o.__list.length > 0) {
                            for (var t = 0; t < o.__list.length; t++) {
                                var P = "/" + o.__list[t];
                                var u = this.getObject(P);
                                var R = this._isReloadNeeded(P, u, {
                                    expand: r
                                });
                                if (R) {
                                    return true;
                                }
                            }
                        } else if (o.__ref) {
                            var P = "/" + o.__ref;
                            var u = this.getObject(P);
                            var R = this._isReloadNeeded(P, u, {
                                expand: r
                            });
                            if (R) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                if (D[m] === undefined || (D[m] && D[m].__deferred)) {
                    return true;
                }
            }
        }
        if (p && p["select"]) {
            s = p["select"].replace(/\s/g, "");
            S = s.split(',');
        }
        for (var i = 0; i < S.length; i++) {
            if (D[S[i]] === undefined) {
                return true;
            }
        }
        if (S.length == 0) {
            var E = this.oMetadata._getEntityTypeByPath(F);
            if (!E) {
                return false;
            } else {
                for (var i = 0; i < E.property.length; i++) {
                    if (D[E.property[i].name] === undefined) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    h.prototype.destroyBindingContext = function(o) {};
    h.prototype.createCustomParams = function(p) {
        var i = [],
            m, s = {
                expand: true,
                select: true
            };
        for (var n in p) {
            if (n in s) {
                i.push("$" + n + "=" + q.sap.encodeURL(p[n]));
            }
            if (n == "custom") {
                m = p[n];
                for (var n in m) {
                    if (n.indexOf("$") == 0) {
                        q.sap.log.warning("Trying to set OData parameter " + n + " as custom query option!");
                    } else {
                        i.push(n + "=" + q.sap.encodeURL(m[n]));
                    }
                }
            }
        }
        return i.join("&");
    };
    h.prototype.bindContext = function(p, o, P) {
        var B = new a(this, p, o, P);
        return B;
    };
    h.prototype.setCountSupported = function(i) {
        this.bCountSupported = i;
    };
    h.prototype.isCountSupported = function() {
        return this.bCountSupported;
    };
    h.prototype.setDefaultCountMode = function(s) {
        this.sDefaultCountMode = s;
    };
    h.prototype.getDefaultCountMode = function() {
        return this.sDefaultCountMode;
    };
    h.prototype._getKey = function(o, D) {
        var k, u;
        if (o instanceof sap.ui.model.Context) {
            k = o.getPath().substr(1);
        } else if (o && o.__metadata && o.__metadata.uri) {
            u = o.__metadata.uri;
            k = u.substr(u.lastIndexOf("/") + 1);
        }
        if (D) {
            k = decodeURIComponent(k);
        }
        return k;
    };
    h.prototype.getKey = function(o, D) {
        return this._getKey(o, D);
    };
    h.prototype.createKey = function(s, k, D) {
        var E = this.oMetadata._getEntityTypeByPath(s),
            K = s,
            t = this,
            n, v, p;
        K += "(";
        if (E.key.propertyRef.length == 1) {
            n = E.key.propertyRef[0].name;
            p = this.oMetadata._getPropertyMetadata(E, n);
            v = O.formatValue(k[n], p.type);
            K += D ? v : encodeURIComponent(v);
        } else {
            q.each(E.key.propertyRef, function(i, P) {
                if (i > 0) {
                    K += ",";
                }
                n = P.name;
                p = t.oMetadata._getPropertyMetadata(E, n);
                v = O.formatValue(k[n], p.type);
                K += n;
                K += "=";
                K += D ? v : encodeURIComponent(v);
            });
        }
        K += ")";
        return K;
    };
    h.prototype.getProperty = function(p, o, i) {
        var v = this._getObject(p, o);
        if (i == null || i == undefined) {
            return v;
        }
        if (!q.isPlainObject(v)) {
            return v;
        }
        v = q.sap.extend(true, {}, v);
        if (i == true) {
            return this._restoreReferences(v);
        } else {
            return this._removeReferences(v);
        }
    };
    h.prototype._getObject = function(p, o) {
        var n = this.isLegacySyntax() ? this.oData : null,
            r = this.resolve(p, o),
            s, D, m, i, k, j;
        if (this.oMetadata && r && r.indexOf('/#') > -1) {
            s = r.indexOf('/##');
            if (s >= 0) {
                j = this.getMetaModel();
                if (!this.bMetaModelLoaded) {
                    return null;
                }
                D = r.substr(0, s);
                m = r.substr(s + 3);
                i = j.getMetaContext(D);
                n = j.getProperty(m, i);
            } else {
                n = this.oMetadata._getAnnotation(r);
            }
        } else {
            if (o) {
                k = o.getPath();
                k = k.substr(1);
                n = this.oData[k];
            }
            if (!p) {
                return n;
            }
            var P = p.split("/"),
                I = 0;
            if (!P[0]) {
                n = this.oData;
                I++;
            }
            while (n && P[I]) {
                n = n[P[I]];
                if (n) {
                    if (n.__ref) {
                        n = this.oData[n.__ref];
                    } else if (n.__list) {
                        n = n.__list;
                    } else if (n.__deferred) {
                        n = undefined;
                    }
                }
                I++;
            }
        }
        return n;
    };
    h.prototype.updateSecurityToken = function() {
        if (this.bTokenHandling) {
            if (!this.oServiceData.securityToken) {
                this.refreshSecurityToken();
            }
            if (this.bTokenHandling) {
                this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
            }
        }
    };
    h.prototype.resetSecurityToken = function() {
        delete this.oServiceData.securityToken;
        delete this.oHeaders["x-csrf-token"];
    };
    h.prototype.getSecurityToken = function() {
        var t = this.oServiceData.securityToken;
        if (!t) {
            this.refreshSecurityToken();
            t = this.oServiceData.securityToken;
        }
        return t;
    };
    h.prototype.refreshSecurityToken = function(s, E, A) {
        var t = this,
            u, T;
        A = A === true;
        u = this._createRequestUrl("/");
        var r = this._createRequest(u, "GET", A);
        r.headers["x-csrf-token"] = "Fetch";

        function _(D, R) {
            if (R) {
                T = t._getHeader("x-csrf-token", R.headers);
                if (T) {
                    t.oServiceData.securityToken = T;
                    t.oHeaders["x-csrf-token"] = T;
                } else {
                    t.resetSecurityToken();
                    t.bTokenHandling = false;
                }
            }
            if (s) {
                s(D, R);
            }
        }

        function i(o) {
            t.resetSecurityToken();
            t.bTokenHandling = false;
            t._handleError(o);
            if (E) {
                E(o);
            }
        }
        return this._request(r, _, i, undefined, undefined, this.getServiceMetadata());
    };
    h.prototype._submitRequest = function(r, B, s, E, H, i) {
        var t = this,
            R, m = {};

        function _(D, o) {
            if (B && H) {
                var l = t._getBatchErrors(D);
                if (l.length > 0) {
                    j(l[0]);
                    return false;
                }
                if (D.__batchResponses && D.__batchResponses.length > 0) {
                    R = D.__batchResponses[0].data;
                    if (!R && D.__batchResponses[0].__changeResponses) {
                        R = D.__batchResponses[0].__changeResponses[0].data;
                    }
                }
                D = R;
            }
            if (i) {
                if (D && D.__batchResponses) {
                    q.each(D.__batchResponses, function(I, o) {
                        if (o && o.data) {
                            t._importData(o.data, m);
                        }
                    });
                }
            }
            t._handleETag(r, o, B);
            t._updateRequestQueue(r, B);
            if (t._isRefreshNeeded(r, o)) {
                t._refresh(false, r.keys, r.entityTypes);
            }
            if (s) {
                s(D, o);
            }
        }

        function j(o) {
            if (t.bTokenHandling && o.response) {
                var T = t._getHeader("x-csrf-token", o.response.headers);
                if (!r.bTokenReset && o.response.statusCode == '403' && T && T.toLowerCase() == "required") {
                    t.resetSecurityToken();
                    r.bTokenReset = true;
                    k();
                    return;
                }
            }
            t._handleError(o);
            if (E) {
                E(o);
            }
        }

        function k() {
            if (t.bTokenHandling && r.method !== "GET") {
                t.updateSecurityToken();
                if (t.bTokenHandling) {
                    r.headers["x-csrf-token"] = t.oServiceData.securityToken;
                }
            }
            if (B) {
                return t._request(r, _, j, OData.batchHandler, undefined, t.getServiceMetadata());
            } else {
                return t._request(r, _, j, t.oHandler, undefined, t.getServiceMetadata());
            }
        }
        return k();
    };
    h.prototype._createBatchRequest = function(B, A) {
        var u, r, o = {},
            p = {},
            K = {},
            E = {};
        p.__batchRequests = B;
        u = this.sServiceUrl + "/$batch";
        if (this.aUrlParams.length > 0) {
            u += "?" + this.aUrlParams.join("&");
        }
        q.extend(o, this.mCustomHeaders, this.oHeaders);
        delete o["Content-Type"];
        r = {
            headers: o,
            requestUri: u,
            method: "POST",
            data: p,
            user: this.sUser,
            password: this.sPassword,
            async: A
        };
        if (A) {
            r.withCredentials = this.bWithCredentials;
        }
        q.each(B, function(i, m) {
            if (m["__changeRequests"]) {
                q.each(m["__changeRequests"], function(j, n) {
                    if (n.keys && n.method != "POST") {
                        q.each(n.keys, function(k, s) {
                            K[k] = s;
                        });
                    } else if (n.entityTypes && n.method == "POST") {
                        q.each(n.entityTypes, function(l, s) {
                            E[l] = s;
                        });
                    }
                });
            }
        });
        r.keys = K;
        r.entityTypes = E;
        return r;
    };
    h.prototype._handleETag = function(r, R, B) {
        var u, E, k, l, m, n;
        if (B) {
            m = r.data.__batchRequests;
            n = R.data.__batchResponses;
            if (n && m) {
                for (var i = 0; i < m.length; i++) {
                    k = m[i].__changeRequests;
                    if (n[i]) {
                        l = n[i].__changeResponses;
                        if (k && l) {
                            for (var j = 0; j < k.length; j++) {
                                if (k[j].method == "MERGE" || k[j].method == "PUT") {
                                    u = k[j].requestUri.replace(this.sServiceUrl + '/', '');
                                    if (!q.sap.startsWith(u, "/")) {
                                        u = "/" + u;
                                    }
                                    E = this._getObject(u);
                                    if (E && E.__metadata && l[j].headers && l[j].headers.ETag) {
                                        E.__metadata.etag = l[j].headers.ETag;
                                    }
                                }
                            }
                        }
                    } else {
                        q.sap.log.warning("could not update ETags for batch request: corresponding response for request missing");
                    }
                }
            } else {
                q.sap.log.warning("could not update ETags for batch request: no batch responses/requests available");
            }
        } else {
            u = r.requestUri.replace(this.sServiceUrl + '/', '');
            if (!q.sap.startsWith(u, "/")) {
                u = "/" + u;
            }
            E = this._getObject(u);
            if (E && E.__metadata && R.headers.ETag) {
                E.__metadata.etag = R.headers.ETag;
            }
        }
    };
    h.prototype._handleBatchErrors = function(r, D) {
        this._getBatchErrors(D);
        this._handleETag();
    };
    h.prototype._getBatchErrors = function(D) {
        var E = [],
            s;
        q.each(D.__batchResponses, function(i, o) {
            if (o.message) {
                s = "The following problem occurred: " + o.message;
                if (o.response) {
                    s += o.response.statusCode + "," + o.response.statusText + "," + o.response.body;
                }
                E.push(o);
                q.sap.log.fatal(s);
            }
            if (o.__changeResponses) {
                q.each(o.__changeResponses, function(i, j) {
                    if (j.message) {
                        s = "The following problem occurred: " + j.message;
                        if (j.response) {
                            s += j.response.statusCode + "," + j.response.statusText + "," + j.response.body;
                        }
                        E.push(j);
                        q.sap.log.fatal(s);
                    }
                });
            }
        });
        return E;
    };
    h.prototype._handleError = function(E) {
        var p = {},
            t;
        var s = "The following problem occurred: " + E.message;
        p.message = E.message;
        if (E.response) {
            if (this.bTokenHandling) {
                t = this._getHeader("x-csrf-token", E.response.headers);
                if (E.response.statusCode == '403' && t && t.toLowerCase() == "required") {
                    this.resetSecurityToken();
                }
            }
            s += E.response.statusCode + "," + E.response.statusText + "," + E.response.body;
            p.statusCode = E.response.statusCode;
            p.statusText = E.response.statusText;
            p.responseText = E.response.body;
        }
        q.sap.log.fatal(s);
        return p;
    };
    h.prototype.getData = function(p, o, i) {
        return this.getProperty(p, o, i);
    };
    h.prototype._getETag = function(p, P, E) {
        var s, i, I;
        if (E) {
            s = E;
        } else {
            if (P && P.__metadata) {
                s = P.__metadata.etag;
            } else if (p) {
                i = p.replace(this.sServiceUrl + '/', '');
                I = i.indexOf("?");
                if (I > -1) {
                    i = i.substr(0, I);
                }
                if (this.oData.hasOwnProperty(i)) {
                    s = this.getProperty('/' + i + '/__metadata/etag');
                }
            }
        }
        return s;
    };
    h.prototype._createRequest = function(u, m, A, p, E) {
        var o = {},
            s;
        q.extend(o, this.mCustomHeaders, this.oHeaders);
        s = this._getETag(u, p, E);
        if (s && m != "GET") {
            o["If-Match"] = s;
        }
        if (this.bJSON && m != "DELETE" && this.sMaxDataServiceVersion === "2.0") {
            o["Content-Type"] = "application/json";
        }
        if (m == "MERGE" && !this.bUseBatch) {
            o["x-http-method"] = "MERGE";
            m = "POST";
        }
        var r = {
            headers: o,
            requestUri: u,
            method: m,
            user: this.sUser,
            password: this.sPassword,
            async: A
        };
        if (p) {
            r.data = p;
        }
        if (A) {
            r.withCredentials = this.bWithCredentials;
        }
        return r;
    };
    h.prototype._isRefreshNeeded = function(r, R) {
        var i = false,
            E, j = [],
            t = this;
        if (!this.bRefreshAfterChange) {
            return i;
        }
        if (r.data && q.isArray(r.data.__batchRequests)) {
            if (R) {
                j = t._getBatchErrors(R.data);
                q.each(j, function(I, o) {
                    if (o.response && o.response.statusCode == "412") {
                        E = o.response.statusCode;
                        return false;
                    }
                });
                if (!!E) {
                    return false;
                }
            }
            q.each(r.data.__batchRequests, function(I, B) {
                if (q.isArray(B.__changeRequests)) {
                    q.each(B.__changeRequests, function(I, o) {
                        i = i || t._isRefreshNeeded(o);
                        return !i;
                    });
                }
                return !i;
            });
        } else {
            if (r.method === "GET") {
                return false;
            } else {
                if (R && R.statusCode == "412") {
                    i = false;
                } else {
                    i = true;
                }
            }
        }
        return i;
    };
    h.prototype.update = function(p, D, P) {
        var s, E, m, r, u, o, i, R, B, S, k, j, A = false;
        if (P instanceof sap.ui.model.Context || arguments.length > 3) {
            o = P;
            s = arguments[3];
            E = arguments[4];
            m = arguments[5];
        } else {
            o = P.context || P.oContext;
            s = P.success || P.fnSuccess;
            E = P.error || P.fnError;
            i = P.eTag || P.sETag;
            m = typeof(P.merge) == "undefined" ? P.bMerge === true : P.merge === true;
            A = typeof(P.async) == "undefined" ? P.bAsync === true : P.async === true;
            j = P.urlParameters;
        }
        u = this._createRequestUrl(p, o, j, this.bUseBatch);
        if (m) {
            r = this._createRequest(u, "MERGE", A, D, i);
        } else {
            r = this._createRequest(u, "PUT", A, D, i);
        }
        p = this._normalizePath(p, o);
        S = this._getObject(p);
        r.keys = {};
        if (S) {
            k = this._getKey(S);
            r.keys[k] = true;
        }
        if (this.bUseBatch) {
            B = this._createBatchRequest([{
                __changeRequests: [r]
            }], A);
            R = this._submitRequest(B, this.bUseBatch, s, E, true);
        } else {
            R = this._submitRequest(r, this.bUseBatch, s, E);
        }
        return R;
    };
    h.prototype.create = function(p, D, P) {
        var r, B, u, R, E, o, s, i, A = false,
            m;
        if (P && typeof(P) == "object" && !(P instanceof sap.ui.model.Context)) {
            o = P.context;
            s = P.success;
            m = P.urlParameters;
            i = P.error;
            A = P.async === true;
        } else {
            o = P;
            s = arguments[3];
            i = arguments[4];
        }
        u = this._createRequestUrl(p, o, m, this.bUseBatch);
        r = this._createRequest(u, "POST", A, D);
        p = this._normalizePath(p, o);
        E = this.oMetadata._getEntityTypeByPath(p);
        r.entityTypes = {};
        if (E) {
            r.entityTypes[E.entityType] = true;
        }
        if (this.bUseBatch) {
            B = this._createBatchRequest([{
                __changeRequests: [r]
            }], A);
            R = this._submitRequest(B, this.bUseBatch, s, i, true);
        } else {
            R = this._submitRequest(r, this.bUseBatch, s, i);
        }
        return R;
    };
    h.prototype.remove = function(p, P) {
        var o, E, s, S, i, r, u, j, k, l, _, B, R, m, A = false,
            t = this;
        if ((P && P instanceof sap.ui.model.Context) || arguments[2]) {
            o = P;
            S = arguments[2];
            i = arguments[3];
        } else if (P) {
            o = P.context || P.oContext;
            S = P.success || P.fnSuccess;
            i = P.error || P.fnError;
            j = P.eTag || P.sETag;
            l = P.payload || P.oPayload;
            A = typeof(P.async) == "undefined" ? P.bAsync === true : P.async === true;
            m = P.urlParameters;
        }
        _ = function(D, n) {
            E = u.substr(u.lastIndexOf('/') + 1);
            if (E.indexOf('?') != -1) {
                E = E.substr(0, E.indexOf('?'));
            }
            delete t.oData[E];
            delete t.mContexts["/" + E];
            if (S) {
                S(D, n);
            }
        };
        u = this._createRequestUrl(p, o, m, this.bUseBatch);
        r = this._createRequest(u, "DELETE", A, l, j);
        p = this._normalizePath(p, o);
        s = this._getObject(p);
        r.keys = {};
        if (s) {
            k = this._getKey(s);
            r.keys[k] = true;
        }
        if (this.bUseBatch) {
            B = this._createBatchRequest([{
                __changeRequests: [r]
            }], A);
            R = this._submitRequest(B, this.bUseBatch, _, i, true);
        } else {
            R = this._submitRequest(r, this.bUseBatch, _, i);
        }
        return R;
    };
    h.prototype.callFunction = function(F, p) {
        var r, B, u, R, o, P, i, s, E, A, m = "GET",
            j = {},
            t = this;
        if (p && typeof(p) == "object") {
            m = p.method ? p.method : m;
            P = p.urlParameters;
            i = p.context;
            s = p.success;
            E = p.error;
            A = p.async === true;
        } else {
            m = p;
            P = arguments[2];
            i = arguments[3];
            s = arguments[4];
            E = arguments[5];
            A = arguments[6] === true;
        }
        o = this.oMetadata._getFunctionImportMetadata(F, m);
        if (o) {
            u = this._createRequestUrl(F, i, null, this.bUseBatch);
            var k = URI(u);
            if (o.parameter != null) {
                q.each(P, function(l, n) {
                    var v = q.grep(o.parameter, function(x) {
                        return x.name == l && x.mode == "In";
                    });
                    if (v != null && v.length > 0) {
                        var w = v[0];
                        j[l] = O.formatValue(n, w.type);
                    } else {
                        q.sap.log.warning("Parameter " + l + " is not defined for function call " + F + "!");
                    }
                });
            }
            if (m === "GET") {
                return t.read(F, i, j, true, s, E);
            } else {
                q.each(j, function(l, n) {
                    k.addQuery(l, n);
                });
                r = this._createRequest(k.toString(), m, A);
                if (this.bUseBatch) {
                    B = this._createBatchRequest([{
                        __changeRequests: [r]
                    }], A);
                    R = this._submitRequest(B, this.bUseBatch, s, E, true);
                } else {
                    R = this._submitRequest(r, this.bUseBatch, s, E);
                }
                return R;
            }
        }
    };
    h.prototype.read = function(p, P) {
        var r, u, R, B, o, m, A, s, E, F, S, i, j, k, l, n;
        if (P && typeof(P) == "object" && !(P instanceof sap.ui.model.Context)) {
            o = P.context;
            m = P.urlParameters;
            A = P.async !== false;
            s = P.success;
            E = P.error;
            F = P.filters;
            S = P.sorters;
        } else {
            o = P;
            m = arguments[2];
            A = arguments[3] !== false;
            s = arguments[4];
            E = arguments[5];
        }
        A = A !== false;
        n = O._createUrlParamsArray(m);
        j = O.createSortParams(S);
        if (j) {
            n.push(j);
        }
        if (F && !this.oMetadata) {
            q.sap.log.fatal("Tried to use filters in read method before metadata is available.");
        } else {
            l = this._normalizePath(p, o);
            k = this.oMetadata && this.oMetadata._getEntityTypeByPath(l);
            i = O.createFilterParams(F, this.oMetadata, k);
            if (i) {
                n.push(i);
            }
        }
        u = this._createRequestUrl(p, o, n, this.bUseBatch);
        r = this._createRequest(u, "GET", A);
        if (this.bUseBatch) {
            B = this._createBatchRequest([r], A);
            R = this._submitRequest(B, this.bUseBatch, s, E, true);
        } else {
            R = this._submitRequest(r, this.bUseBatch, s, E);
        }
        return R;
    };
    h.prototype.createBatchOperation = function(p, m, D, P) {
        var o = {},
            E, s, k, i;
        q.extend(o, this.mCustomHeaders, this.oHeaders);
        if (q.sap.startsWith(p, "/")) {
            p = p.substr(1);
        }
        if (P) {
            E = P.sETag;
        }
        if (m != "GET") {
            E = this._getETag(p, D, E);
            if (E) {
                o["If-Match"] = E;
            }
        }
        if (this.bJSON) {
            if (m != "DELETE" && m != "GET" && this.sMaxDataServiceVersion === "2.0") {
                o["Content-Type"] = "application/json";
            }
        } else {
            o["Content-Type"] = "application/atom+xml";
        }
        var r = {
            requestUri: p,
            method: m.toUpperCase(),
            headers: o
        };
        if (D) {
            r.data = D;
        }
        if (m != "GET" && m != "POST") {
            if (p && p.indexOf("/") != 0) {
                p = '/' + p;
            }
            s = this._getObject(p);
            if (s) {
                k = this._getKey(s);
                r.keys = {};
                r.keys[k] = true;
            }
        } else if (m == "POST") {
            var n = p;
            if (p.indexOf('?') != -1) {
                n = p.substr(0, p.indexOf('?'));
            }
            i = this.oMetadata._getEntityTypeByPath(n);
            if (i) {
                r.entityTypes = {};
                r.entityTypes[i.entityType] = true;
            }
        }
        return r;
    };
    h.prototype.addBatchReadOperations = function(r) {
        if (!q.isArray(r) || r.length <= 0) {
            q.sap.log.warning("No array with batch operations provided!");
            return false;
        }
        var t = this;
        q.each(r, function(i, R) {
            if (R.method != "GET") {
                q.sap.log.warning("Batch operation should be a GET operation!");
                return false;
            }
            t.aBatchOperations.push(R);
        });
    };
    h.prototype.addBatchChangeOperations = function(i) {
        if (!q.isArray(i) || i.length <= 0) {
            return false;
        }
        q.each(i, function(I, o) {
            if (o.method != "POST" && o.method != "PUT" && o.method != "MERGE" && o.method != "DELETE") {
                q.sap.log.warning("Batch operation should be a POST/PUT/MERGE/DELETE operation!");
                return false;
            }
        });
        this.aBatchOperations.push({
            __changeRequests: i
        });
    };
    h.prototype.clearBatch = function() {
        this.aBatchOperations = [];
    };
    h.prototype.submitBatch = function(s, E, A, i) {
        var r, R, t = this;

        function _(D, k) {
            if (s) {
                s(D, k, t._getBatchErrors(D));
            }
        }
        if (!(typeof(s) == "function")) {
            var o = A;
            var j = E;
            A = s;
            s = j;
            E = o;
        }
        A = A !== false;
        if (this.aBatchOperations.length <= 0) {
            q.sap.log.warning("No batch operations in batch. No request will be triggered!");
            return false;
        }
        r = this._createBatchRequest(this.aBatchOperations, A);
        R = this._submitRequest(r, true, _, E, false, i);
        this.clearBatch();
        return R;
    };
    h.prototype.getServiceMetadata = function() {
        if (this.oMetadata && this.oMetadata.isLoaded()) {
            return this.oMetadata.getServiceMetadata();
        }
    };
    h.prototype.getServiceAnnotations = function() {
        if (this.oAnnotations && this.oAnnotations.getAnnotationsData) {
            return this.oAnnotations.getAnnotationsData();
        }
    };
    h.prototype.submitChanges = function(s, E, p) {
        var r, P, t = this,
            i, j, T, m, S, k;
        if (this.sChangeKey) {
            i = this.sChangeKey.replace(this.sServiceUrl, '');
            S = this._getObject(i);
            P = S;
            if (q.isPlainObject(S)) {
                P = q.sap.extend(true, {}, S);
                if (P.__metadata) {
                    T = P.__metadata.type;
                    m = P.__metadata.etag;
                    delete P.__metadata;
                    if (T || m) {
                        P.__metadata = {};
                    }
                    if (T) {
                        P.__metadata.type = T;
                    }
                    if (!!m) {
                        P.__metadata.etag = m;
                    }
                }
                q.each(P, function(u, v) {
                    if (v && v.__deferred) {
                        delete P[u];
                    }
                });
                var o = this.oMetadata._getEntityTypeByPath(i);
                if (o) {
                    var n = this.oMetadata._getNavigationPropertyNames(o);
                    q.each(n, function(I, N) {
                        delete P[N];
                    });
                }
                P = this._removeReferences(P);
            }
            if (p && p.sETag) {
                j = p.sETag;
            }
            r = this._createRequest(this.sChangeKey, "MERGE", true, P, j);
            if (this.sUrlParams) {
                r.requestUri += "?" + this.sUrlParams;
            }
            r.keys = {};
            if (S) {
                k = this._getKey(S);
                r.keys[k] = true;
            }
            this.oRequestQueue[this.sChangeKey] = r;
        }
        if (q.isEmptyObject(this.oRequestQueue)) {
            return undefined;
        }
        if (this.bUseBatch) {
            var l = [];
            q.each(this.oRequestQueue, function(k, u) {
                delete u._oRef;
                var R = q.sap.extend(true, {}, u);
                u._oRef = R;
                R.requestUri = R.requestUri.replace(t.sServiceUrl + '/', '');
                R.data._bCreate ? delete R.data._bCreate : false;
                l.push(R);
            });
            r = this._createBatchRequest([{
                __changeRequests: l
            }], true);
            this._submitRequest(r, this.bUseBatch, s, E, true);
        } else {
            q.each(this.oRequestQueue, function(k, u) {
                delete u._oRef;
                var R = q.sap.extend(true, {}, u);
                u._oRef = R;
                if (R.data && R.data._bCreate) {
                    delete R.data._bCreate;
                }
                t._submitRequest(R, this.bUseBatch, s, E, true);
            });
        }
        return undefined;
    };
    h.prototype._updateRequestQueue = function(r, B) {
        var k, l, o, t = this;
        if (B) {
            k = r.data.__batchRequests;
            if (k) {
                for (var i = 0; i < k.length; i++) {
                    l = k[i].__changeRequests;
                    if (l) {
                        for (var j = 0; j < l.length; j++) {
                            o = l[j];
                            q.each(this.oRequestQueue, function(K, m) {
                                if (m._oRef === o && K !== t.sChangeKey) {
                                    delete t.oRequestQueue[K];
                                    delete t.oData[K];
                                    delete t.mContexts["/" + K];
                                } else if (t.sChangeKey && K === t.sChangeKey) {
                                    delete t.oRequestQueue[K];
                                    t.sChangeKey = null;
                                }
                            });
                        }
                    }
                }
            }
        } else {
            q.each(this.oRequestQueue, function(K, m) {
                if (m._oRef === r && K !== t.sChangeKey) {
                    delete t.oRequestQueue[K];
                    delete t.oData[K];
                    delete t.mContexts["/" + K];
                } else if (t.sChangeKey && K === t.sChangeKey) {
                    delete t.oRequestQueue[K];
                    t.sChangeKey = null;
                }
            });
        }
    };
    h.prototype.resetChanges = function(s, E) {
        var p;
        if (this.sChangeKey) {
            p = this.sChangeKey.replace(this.sServiceUrl, '');
            this._loadData(p, null, s, E);
        }
    };
    h.prototype.setProperty = function(p, v, o, A) {
        var P, E = {},
            D = {},
            s = this._createRequestUrl(p, o),
            j = p.substring(0, p.lastIndexOf("/")),
            k, l, m = {},
            n = false;
        if (!this.resolve(p, o)) {
            return false;
        }
        s = s.replace(this.sServiceUrl + '/', '');
        s = s.substring(0, s.indexOf("/"));
        s = this.sServiceUrl + '/' + s;
        P = p.substr(p.lastIndexOf("/") + 1);
        D = this._getObject(j, o);
        if (!D) {
            return false;
        }
        l = j.split("/");
        for (var i = l.length - 1; i >= 0; i--) {
            E = this._getObject(l.join("/"), o);
            if (E) {
                k = this._getKey(E);
                if (k) {
                    break;
                }
            }
            l.splice(i - 1, 1);
        }
        if (!k) {
            k = this._getKey(o);
        }
        if (k) {
            m[k] = true;
        }
        if (D._bCreate) {
            D[P] = v;
            n = true;
            this.checkUpdate(false, A, m);
        } else {
            if (!this.sChangeKey) {
                this.sChangeKey = s;
            }
            if (this.sChangeKey == s) {
                D[P] = v;
                n = true;
                this.checkUpdate(false, A, m);
            } else {
                this.fireRejectChange({
                    rejectedValue: v,
                    oldValue: D[P]
                });
            }
        }
        return n;
    };
    h.prototype._isHeaderPrivate = function(H) {
        switch (H.toLowerCase()) {
            case "accept":
            case "accept-language":
            case "maxdataserviceversion":
            case "dataserviceversion":
                return true;
            case "x-csrf-token":
                return this.bTokenHandling;
            default:
                return false;
        }
    };
    h.prototype.setHeaders = function(H) {
        var m = {},
            t = this;
        if (H) {
            q.each(H, function(s, i) {
                if (t._isHeaderPrivate(s)) {
                    q.sap.log.warning("Not allowed to modify private header: " + s);
                } else {
                    m[s] = i;
                }
            });
            this.mCustomHeaders = m;
        } else {
            this.mCustomHeaders = {};
        }
    };
    h.prototype.getHeaders = function() {
        return q.extend({}, this.mCustomHeaders, this.oHeaders);
    };
    h.prototype._getHeader = function(F, H) {
        var s;
        for (s in H) {
            if (s.toLowerCase() === F.toLowerCase()) {
                return H[s];
            }
        }
        return null;
    };
    h.prototype.hasPendingChanges = function() {
        return this.sChangeKey != null;
    };
    h.prototype.updateBindings = function(F) {
        this.checkUpdate(F);
    };
    h.prototype.forceNoCache = function(F) {
        this.bCache = !F;
    };
    h.prototype.setTokenHandlingEnabled = function(t) {
        this.bTokenHandling = t;
    };
    h.prototype.setUseBatch = function(u) {
        this.bUseBatch = u;
    };
    h.prototype.formatValue = function(v, t) {
        return O.formatValue(v, t);
    };
    h.prototype.deleteCreatedEntry = function(o) {
        if (o) {
            var p = o.getPath();
            delete this.mContexts[p];
            if (q.sap.startsWith(p, "/")) {
                p = p.substr(1);
            }
            delete this.oRequestQueue[p];
            delete this.oData[p];
        }
    };
    h.prototype.createEntry = function(p, P) {
        var E = {},
            k, u, r;
        if (!q.sap.startsWith(p, "/")) {
            p = "/" + p;
        }
        var o = this.oMetadata._getEntityTypeByPath(p);
        if (!o) {
            return undefined;
        }
        if (typeof P === "object" && !q.isArray(P)) {
            E = P;
        } else {
            for (var i = 0; i < o.property.length; i++) {
                var j = o.property[i];
                var t = j.type.split('.');
                var l = q.inArray(j.name, P) > -1;
                if (!P || l) {
                    E[j.name] = this._createPropertyValue(t);
                    if (l) {
                        P.splice(P.indexOf(j.name), 1);
                    }
                }
            }
            if (P) {}
        }
        E._bCreate = true;
        k = p.substring(1) + "('" + q.sap.uid() + "')";
        this.oData[k] = E;
        E.__metadata = {
            type: "" + o.entityType
        };
        u = this._createRequestUrl(p);
        r = this._createRequest(u, "POST", true, E);
        r.entityTypes = {};
        r.entityTypes[o.entityType] = true;
        this.oRequestQueue[k] = r;
        return this.getContext("/" + k);
    };
    h.prototype._createPropertyValue = function(t) {
        var n = t[0];
        var T = t[1];
        if (n.toUpperCase() !== 'EDM') {
            var o = {};
            var j = this.oMetadata._getObjectMetadata("complexType", T, n);
            for (var i = 0; i < j.property.length; i++) {
                var p = j.property[i];
                var t = p.type.split('.');
                o[p.name] = this._createPropertyValue(t);
            }
            return o;
        } else {
            return this._getDefaultPropertyValue(T, n);
        }
    };
    h.prototype._getDefaultPropertyValue = function(t, n) {
        return undefined;
    };
    h.prototype._normalizePath = function(p, o) {
        if (p && p.indexOf('?') != -1) {
            p = p.substr(0, p.indexOf('?'));
        }
        if (!o && !q.sap.startsWith(p, "/")) {
            p = '/' + p;
            q.sap.log.warning(this + " path " + p + " should be absolute if no Context is set");
        }
        return this.resolve(p, o);
    };
    h.prototype.setRefreshAfterChange = function(r) {
        this.bRefreshAfterChange = r;
    };
    h.prototype.isList = function(p, o) {
        var p = this.resolve(p, o);
        return p && p.substr(p.lastIndexOf("/")).indexOf("(") === -1;
    };
    h.prototype._request = function(r, s, E, H, o, m) {
        if (this.bDestroyed) {
            return {
                abort: function() {}
            };
        }
        var t = this;

        function w(i) {
            return function() {
                var I = q.inArray(R, t.aPendingRequestHandles);
                if (I > -1) {
                    t.aPendingRequestHandles.splice(I, 1);
                }
                if (!(R && R.bSuppressErrorHandlerCall)) {
                    i.apply(this, arguments);
                }
            };
        }
        var R = OData.request(r, w(s || OData.defaultSuccess), w(E || OData.defaultError), H, o, m);
        if (r.async !== false) {
            this.aPendingRequestHandles.push(R);
        }
        return R;
    };
    h.prototype.destroy = function() {
        if (this.aPendingRequestHandles) {
            for (var i = this.aPendingRequestHandles.length - 1; i >= 0; i--) {
                var r = this.aPendingRequestHandles[i];
                if (r && r.abort) {
                    r.bSuppressErrorHandlerCall = true;
                    r.abort();
                }
            }
            delete this.aPendingRequestHandles;
        }
        if (!!this.oMetadataLoadEvent) {
            q.sap.clearDelayedCall(this.oMetadataLoadEvent);
        }
        if (!!this.oMetadataFailedEvent) {
            q.sap.clearDelayedCall(this.oMetadataFailedEvent);
        }
        if (this.oMetadata) {
            this.oMetadata.detachLoaded(this.onMetadataLoaded);
            this.oMetadata.detachFailed(this.onMetadataFailed);
            if (!this.oMetadata.isLoaded() && !this.oMetadata.hasListeners("loaded")) {
                this.oMetadata.destroy();
                delete this.oServiceData.oMetadata;
            }
            delete this.oMetadata;
        }
        if (this.oAnnotations) {
            this.oAnnotations.destroy();
            delete this.oAnnotations;
        }
        M.prototype.destroy.apply(this, arguments);
    };
    h.prototype.getMetaModel = function() {
        var t = this;
        if (!this.oMetaModel) {
            this.oMetaModel = new f(this.oMetadata, this.oAnnotations);
            this.oMetaModel.loaded().then(function() {
                t.bMetaModelLoaded = true;
                t.checkUpdate();
            });
        }
        return this.oMetaModel;
    };
    return h;
}, true);