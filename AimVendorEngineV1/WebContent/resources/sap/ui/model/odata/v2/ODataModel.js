/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', 'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/CountMode', 'sap/ui/model/odata/OperationMode', './ODataContextBinding', './ODataListBinding', 'sap/ui/model/odata/ODataMetadata', 'sap/ui/model/odata/ODataPropertyBinding', './ODataTreeBinding', 'sap/ui/model/odata/ODataMetaModel', 'sap/ui/core/message/MessageParser', 'sap/ui/model/odata/ODataMessageParser', 'sap/ui/thirdparty/URI', 'sap/ui/thirdparty/datajs'], function(q, M, O, C, a, b, c, d, e, f, g, h, k, U, l) {
    "use strict";
    var m = M.extend("sap.ui.model.odata.v2.ODataModel", {
        constructor: function(s, p) {
            M.apply(this, arguments);
            var u, P, H, t, w, i, j, r, A, L, D, n, o, v, S, x, y, J, z, B = this;
            if (typeof(s) === "object") {
                p = s;
                s = p.serviceUrl;
            }
            if (p) {
                u = p.user;
                P = p.password;
                H = p.headers;
                t = p.tokenHandling;
                w = p.withCredentials;
                i = p.maxDataServiceVersion;
                j = p.useBatch;
                r = p.refreshAfterChange;
                A = p.annotationURI;
                L = p.loadAnnotationsJoined;
                n = p.defaultBindingMode;
                D = p.defaultCountMode;
                o = p.defaultOperationMode;
                v = p.metadataNamespaces;
                S = p.serviceUrlParams;
                x = p.metadataUrlParams;
                J = p.json;
                z = p.messageParser;
            }
            this.mSupportedBindingModes = {
                "OneWay": true,
                "OneTime": true,
                "TwoWay": true
            };
            this.sDefaultBindingMode = n || sap.ui.model.BindingMode.OneWay;
            this.bJSON = J !== false;
            this.aPendingRequestHandles = [];
            this.aCallAfterUpdate = [];
            this.mRequests = {};
            this.mDeferredRequests = {};
            this.mChangedEntities = {};
            this.mChangeHandles = {};
            this.mDeferredBatchGroups = {};
            this.mChangeBatchGroups = {
                '*': {
                    batchGroupId: undefined,
                    single: true
                }
            };
            this.bTokenHandling = t !== false;
            this.bWithCredentials = w === true;
            this.bUseBatch = j !== false;
            this.bRefreshAfterChange = r !== false;
            this.sMaxDataServiceVersion = i;
            this.bLoadMetadataAsync = true;
            this.bLoadAnnotationsJoined = L !== false;
            this.sAnnotationURI = A;
            this.sDefaultCountMode = D || C.Request;
            this.sDefaultOperationMode = o || a.Server;
            this.oMetadataLoadEvent = null;
            this.oMetadataFailedEvent = null;
            this.sRefreshBatchGroupId = undefined;
            this.bIncludeInCurrentBatch = false;
            if (z) {
                z.setProcessor(this);
            }
            this.oMessageParser = z;
            this.sDefaultChangeBatchGroup = "changes";
            this.setDeferredBatchGroups([this.sDefaultChangeBatchGroup]);
            this.setChangeBatchGroups({
                "*": {
                    batchGroupId: this.sDefaultChangeBatchGroup
                }
            });
            if (this.sAnnotationURI) {
                q.sap.require("sap.ui.model.odata.ODataAnnotations");
            }
            this.oData = {};
            this.oMetadata = null;
            this.oAnnotations = null;
            this.aUrlParams = [];
            this.sServiceUrl = s;
            var E = s.split("?");
            if (E.length > 1) {
                this.sServiceUrl = E[0];
                if (E[1]) {
                    this.aUrlParams.push(E[1]);
                }
            }
            this.sServiceUrl = this.sServiceUrl.replace(/\/$/, "");
            this.sUser = u;
            this.sPassword = P;
            if (sap.ui.getCore().getConfiguration().getStatistics()) {
                this.aUrlParams.push("sap-statistics=true");
            }
            this.oHeaders = {};
            this.setHeaders(H);
            this.oServiceData = m.mServiceData[this.sServiceUrl];
            if (!this.oServiceData) {
                m.mServiceData[this.sServiceUrl] = {};
                this.oServiceData = m.mServiceData[this.sServiceUrl];
            }
            if (!this.oServiceData.oMetadata) {
                y = O._createUrlParamsArray(x);
                this.oMetadata = new sap.ui.model.odata.ODataMetadata(this._createRequestUrl("/$metadata", undefined, y), {
                    async: this.bLoadMetadataAsync,
                    user: this.sUser,
                    password: this.sPassword,
                    headers: this.mCustomHeaders,
                    namespaces: v,
                    withCredentials: this.bWithCredentials
                });
                this.oServiceData.oMetadata = this.oMetadata;
            } else {
                this.oMetadata = this.oServiceData.oMetadata;
            }
            if (S) {
                this.aUrlParams = this.aUrlParams.concat(O._createUrlParamsArray(S));
            }
            this.onMetadataLoaded = function(F) {
                B._initializeMetadata();
            };
            this.onMetadataFailed = function(F) {
                B.fireMetadataFailed(F.getParameters());
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
                this.oAnnotations.attachFailed(function(F) {
                    B.fireAnnotationsFailed(F.getParameters());
                });
                this.oAnnotations.attachLoaded(function(F) {
                    B.fireAnnotationsLoaded(F.getParameters());
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
                this.oHeaders["Content-Type"] = "application/json";
            } else {
                this.oHeaders["Accept"] = "application/atom+xml,application/atomsvc+xml,application/xml";
                this.oHeaders["Content-Type"] = "application/atom+xml";
            }
            if (this.bTokenHandling && this.oServiceData.securityToken) {
                this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
            }
            this.oHeaders["Accept-Language"] = sap.ui.getCore().getConfiguration().getLanguage();
            this.oHeaders["DataServiceVersion"] = "2.0";
            this.oHeaders["MaxDataServiceVersion"] = "2.0";
            if (this.sMaxDataServiceVersion) {
                this.oHeaders["MaxDataServiceVersion"] = this.sMaxDataServiceVersion;
            }
        },
        metadata: {
            publicMethods: ["read", "create", "update", "remove", "submitChanges", "getServiceMetadata", "hasPendingChanges", "refresh", "refreshMetadata", "resetChanges", "setDefaultCountMode", "setDefaultBindingMode", "getDefaultBindingMode", "getDefaultCountMode", "setProperty", "getSecurityToken", "refreshSecurityToken", "setHeaders", "getHeaders", "setUseBatch", "setDeferredBatchGroups", "getDeferredBatchGroups", "setChangeBatchGroups", "getChangeBatchGroups"]
        }
    });
    m.M_EVENTS = {
        RejectChange: "rejectChange",
        MetadataLoaded: "metadataLoaded",
        MetadataFailed: "metadataFailed",
        AnnotationsLoaded: "annotationsLoaded",
        AnnotationsFailed: "annotationsFailed",
        BatchRequestFailed: "batchRequestFailed",
        BatchRequestSent: "batchRequestSent",
        BatchRequestCompleted: "batchRequestCompleted"
    };
    m.prototype.attachBatchRequestFailed = function(D, F, L) {
        this.attachEvent("batchRequestFailed", D, F, L);
        return this;
    };
    m.prototype.detachBatchRequestFailed = function(F, L) {
        this.detachEvent("batchRequestFailed", F, L);
        return this;
    };
    m.prototype.fireBatchRequestFailed = function(A) {
        this.fireEvent("batchRequestFailed", A);
        return this;
    };
    m.prototype.attachBatchRequestSent = function(D, F, L) {
        this.attachEvent("batchRequestSent", D, F, L);
        return this;
    };
    m.prototype.detachBatchRequestSent = function(F, L) {
        this.detachEvent("batchRequestSent", F, L);
        return this;
    };
    m.prototype.fireBatchRequestSent = function(A) {
        this.fireEvent("batchRequestSent", A);
        return this;
    };
    m.prototype.attachBatchRequestCompleted = function(D, F, L) {
        this.attachEvent("batchRequestCompleted", D, F, L);
        return this;
    };
    m.prototype.detachBatchRequestCompleted = function(F, L) {
        this.detachEvent("batchRequestCompleted", F, L);
        return this;
    };
    m.prototype.fireBatchRequestCompleted = function(A) {
        this.fireEvent("batchRequestCompleted", A);
        return this;
    };
    m.mServiceData = {};
    m.prototype.fireRejectChange = function(A) {
        this.fireEvent("rejectChange", A);
        return this;
    };
    m.prototype.attachRejectChange = function(D, F, L) {
        this.attachEvent("rejectChange", D, F, L);
        return this;
    };
    m.prototype.detachRejectChange = function(F, L) {
        this.detachEvent("rejectChange", F, L);
        return this;
    };
    m.prototype._initializeMetadata = function(D) {
        var t = this;
        this.bUseBatch = this.bUseBatch || this.oMetadata.getUseBatch();
        var i = function(I, j) {
            if (j) {
                t.metadataLoadEvent = q.sap.delayedCall(0, t, i, [t.bLoadMetadataAsync]);
            } else {
                if (I) {
                    t.initialize();
                }
                t.fireMetadataLoaded({
                    metadata: t.oMetadata
                });
                q.sap.log.debug(t + " - metadataloaded fired");
            }
        };
        if (this.bLoadMetadataAsync && this.sAnnotationURI && this.bLoadAnnotationsJoined) {
            if (this.oAnnotations && this.oAnnotations.bInitialized) {
                i(true);
            } else {
                this.oAnnotations.attachLoaded(function() {
                    i(true);
                }, this);
            }
        } else {
            i(this.bLoadMetadataAsync, D);
        }
    };
    m.prototype.refreshMetadata = function() {
        if (this.oMetadata && this.oMetadata.refresh) {
            this.oMetadata.refresh();
        }
    };
    m.prototype.fireAnnotationsLoaded = function(A) {
        this.fireEvent("annotationsLoaded", A);
        return this;
    };
    m.prototype.attachAnnotationsLoaded = function(D, F, L) {
        this.attachEvent("annotationsLoaded", D, F, L);
        return this;
    };
    m.prototype.detachAnnotationsLoaded = function(F, L) {
        this.detachEvent("annotationsLoaded", F, L);
        return this;
    };
    m.prototype.fireAnnotationsFailed = function(A) {
        this.fireEvent("annotationsFailed", A);
        q.sap.log.debug(this + " - annotationsfailed fired");
        return this;
    };
    m.prototype.attachAnnotationsFailed = function(D, F, L) {
        this.attachEvent("annotationsFailed", D, F, L);
        return this;
    };
    m.prototype.detachAnnotationsFailed = function(F, L) {
        this.detachEvent("annotationsFailed", F, L);
        return this;
    };
    m.prototype.fireMetadataLoaded = function(A) {
        this.fireEvent("metadataLoaded", A);
        return this;
    };
    m.prototype.attachMetadataLoaded = function(D, F, L) {
        this.attachEvent("metadataLoaded", D, F, L);
        return this;
    };
    m.prototype.detachMetadataLoaded = function(F, L) {
        this.detachEvent("metadataLoaded", F, L);
        return this;
    };
    m.prototype.fireMetadataFailed = function(A) {
        this.fireEvent("metadataFailed", A);
        return this;
    };
    m.prototype.attachMetadataFailed = function(D, F, L) {
        this.attachEvent("metadataFailed", D, F, L);
        return this;
    };
    m.prototype.detachMetadataFailed = function(F, L) {
        this.detachEvent("metadataFailed", F, L);
        return this;
    };
    m.prototype._createEventInfo = function(r, R, B) {
        var E = {};
        E.url = r.requestUri;
        E.method = r.method;
        E.async = r.async;
        E.headers = r.headers;
        if (B) {
            E.requests = [];
            for (var i = 0; i < B.length; i++) {
                var o = {};
                if (q.isArray(B[i])) {
                    var n = B[i];
                    for (var j = 0; j < n.length; j++) {
                        var r = n[j].request;
                        var I = B[i][j].response;
                        o = {};
                        o.url = r.requestUri;
                        o.method = r.method;
                        o.headers = r.headers;
                        if (I) {
                            o.response = {};
                            if (r._aborted) {
                                o.success = false;
                                o.response.statusCode = 0;
                                o.response.statusText = "abort";
                            } else {
                                o.success = true;
                                if (I.message) {
                                    o.response.message = I.message;
                                    I = I.response;
                                    o.response.responseText = I.body;
                                    o.success = false;
                                }
                                o.response.headers = I.headers;
                                o.response.statusCode = I.statusCode;
                                o.response.statusText = I.statusText;
                            }
                        }
                        E.requests.push(o);
                    }
                } else {
                    var r = B[i].request;
                    var I = B[i].response;
                    o.url = r.requestUri;
                    o.method = r.method;
                    o.headers = r.headers;
                    if (I) {
                        o.response = {};
                        if (r._aborted) {
                            o.success = false;
                            o.response.statusCode = 0;
                            o.response.statusText = "abort";
                        } else {
                            o.success = true;
                            if (I.message) {
                                o.response.message = I.message;
                                I = I.response;
                                o.response.responseText = I.body;
                                o.success = false;
                            }
                            o.response.headers = I.headers;
                            o.response.statusCode = I.statusCode;
                            o.response.statusText = I.statusText;
                        }
                    }
                    E.requests.push(o);
                }
            }
        }
        if (R) {
            E.response = {};
            E.success = true;
            if (R.message) {
                E.response.message = R.message;
                E.success = false;
            }
            if (R.response) {
                R = R.response;
            }
            if (R && R.statusCode != undefined) {
                E.response.headers = R.headers;
                E.response.statusCode = R.statusCode;
                E.response.statusText = R.statusText;
                E.response.responseText = R.body !== undefined ? R.body : R.responseText;
            }
        }
        E.ID = r.requestID;
        return E;
    };
    m.prototype._createRequestID = function() {
        var r;
        r = q.sap.uid();
        return r;
    };
    m.prototype._createRequestUrl = function(p, o, u, B) {
        var n, A = [],
            s = "";
        n = this._normalizePath(p, o);
        if (!B) {
            s = this.sServiceUrl + n;
        } else {
            s = n.substr(n.indexOf('/') + 1);
        }
        if (this.aUrlParams) {
            A = A.concat(this.aUrlParams);
        }
        if (u) {
            A = A.concat(u);
        }
        if (A && A.length > 0) {
            s += "?" + A.join("&");
        }
        return s;
    };
    m.prototype._importData = function(D, j) {
        var t = this,
            L, K, r, E;
        if (D.results) {
            L = [];
            q.each(D.results, function(i, n) {
                var K = t._importData(n, j);
                if (K) {
                    L.push(K);
                }
            });
            return L;
        } else {
            K = this._getKey(D);
            if (!K) {
                return K;
            }
            E = this.oData[K];
            if (!E) {
                E = D;
                this.oData[K] = E;
            }
            q.each(D, function(n, p) {
                if (p && (p.__metadata && p.__metadata.uri || p.results) && !p.__deferred) {
                    r = t._importData(p, j);
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
            j[K] = true;
            return K;
        }
    };
    m.prototype._removeReferences = function(D) {
        var t = this,
            L;
        if (D.results) {
            L = [];
            q.each(D.results, function(i, j) {
                L.push(t._removeReferences(j));
            });
            return L;
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
    m.prototype._restoreReferences = function(D) {
        var t = this,
            L, r = [];
        if (D.results) {
            L = [];
            q.each(D.results, function(i, j) {
                L.push(t._restoreReferences(j));
            });
            return L;
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
    m.prototype.removeData = function() {
        this.oData = {};
    };
    m.prototype.initialize = function() {
        var B = this.aBindings.slice(0);
        q.each(B, function(i, o) {
            o.initialize();
        });
    };
    m.prototype.refresh = function(F, r, B) {
        if (r) {
            this.removeData();
        }
        this._refresh(F, B);
    };
    m.prototype._refresh = function(F, B, i, E) {
        var j = this.aBindings.slice(0);
        this.sRefreshBatchGroupId = B;
        q.each(j, function(I, o) {
            o.refresh(F, i, E);
        });
        this.sRefreshBatchGroupId = undefined;
    };
    m.prototype.checkUpdate = function(F, A, j) {
        if (A) {
            if (!this.sUpdateTimer) {
                this.sUpdateTimer = q.sap.delayedCall(0, this, function() {
                    this.checkUpdate(F, false, j);
                });
            }
            return;
        }
        if (this.sUpdateTimer) {
            q.sap.clearDelayedCall(this.sUpdateTimer);
            this.sUpdateTimer = null;
        }
        var B = this.aBindings.slice(0);
        q.each(B, function(I, o) {
            o.checkUpdate(F, j);
        });
        var n = this.aCallAfterUpdate;
        this.aCallAfterUpdate = [];
        for (var i = 0; i < n.length; i++) {
            n[i]();
        }
    };
    m.prototype.bindProperty = function(p, o, P) {
        var B = new e(this, p, o, P);
        return B;
    };
    m.prototype.bindList = function(p, o, s, F, P) {
        var B = new c(this, p, o, s, F, P);
        return B;
    };
    m.prototype.bindTree = function(p, o, F, P) {
        var B = new f(this, p, o, F, P);
        return B;
    };
    m.prototype.createBindingContext = function(p, o, P, i, r) {
        var F = this.resolve(p, o);
        r = !!r;
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
            K, n, B, t = this;
        if (!r) {
            r = this._isReloadNeeded(F, D, P);
        }
        if (!r) {
            K = this._getKey(D);
            n = this.getContext('/' + K);
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
                if (P && P.batchGroupId) {
                    B = P.batchGroupId;
                }
                var u = function(D) {
                    K = D ? t._getKey(D) : undefined;
                    if (K && o && I) {
                        var w = o.getPath();
                        w = w.substr(1);
                        if (t.oData[w]) {
                            t.oData[w][p] = {
                                __ref: K
                            };
                        }
                    }
                    n = t.getContext('/' + K);
                    i(n);
                };
                var v = function(E) {
                    if (E.statusCode == '404' && o && I) {
                        var w = o.getPath();
                        w = w.substr(1);
                        if (t.oData[w]) {
                            t.oData[w][p] = {
                                __ref: null
                            };
                        }
                    }
                    i(null);
                };
                this.read(F, {
                    batchGroupId: B,
                    urlParameters: j,
                    success: u,
                    error: v
                });
            } else {
                i(null);
            }
        }
    };
    m.prototype._isReloadNeeded = function(F, D, p) {
        var n, N = [],
            s, S = [],
            i;
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
            for (i = 0; i < N.length; i++) {
                var j = N[i].indexOf("/");
                if (j !== -1) {
                    var o = N[i].slice(0, j);
                    var r = N[i].slice(j + 1);
                    N[i] = [o, r];
                }
            }
        }
        for (i = 0; i < N.length; i++) {
            var t = N[i];
            if (q.isArray(t)) {
                var u = D[t[0]];
                var v = t[1];
                if (!u || (u && u.__deferred)) {
                    return true;
                } else {
                    if (u) {
                        var P, w, R;
                        if (u.__list && u.__list.length > 0) {
                            for (var x = 0; x < u.__list.length; x++) {
                                P = "/" + u.__list[x];
                                w = this.getObject(P);
                                R = this._isReloadNeeded(P, w, {
                                    expand: v
                                });
                                if (R) {
                                    return true;
                                }
                            }
                        } else if (u.__ref) {
                            P = "/" + u.__ref;
                            w = this.getObject(P);
                            R = this._isReloadNeeded(P, w, {
                                expand: v
                            });
                            if (R) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                if (D[t] === undefined || (D[t] && D[t].__deferred)) {
                    return true;
                }
            }
        }
        if (p && p["select"]) {
            s = p["select"].replace(/\s/g, "");
            S = s.split(',');
        }
        for (i = 0; i < S.length; i++) {
            if (D[S[i]] === undefined) {
                return true;
            }
        }
        if (S.length === 0) {
            var E = this.oMetadata._getEntityTypeByPath(F);
            if (!E) {
                return false;
            } else {
                for (i = 0; i < E.property.length; i++) {
                    if (D[E.property[i].name] === undefined) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    m.prototype.createCustomParams = function(p) {
        var i = [],
            j, s = {
                expand: true,
                select: true
            };
        for (var n in p) {
            if (n in s) {
                i.push("$" + n + "=" + q.sap.encodeURL(p[n]));
            }
            if (n === "custom") {
                j = p[n];
                for (n in j) {
                    if (n.indexOf("$") === 0) {
                        q.sap.log.warning(this + " - Trying to set OData parameter '" + n + "' as custom query option!");
                    } else {
                        i.push(n + "=" + q.sap.encodeURL(j[n]));
                    }
                }
            }
        }
        return i.join("&");
    };
    m.prototype.bindContext = function(p, o, P) {
        var B = new b(this, p, o, P);
        return B;
    };
    m.prototype.setDefaultCountMode = function(s) {
        this.sDefaultCountMode = s;
    };
    m.prototype.getDefaultCountMode = function() {
        return this.sDefaultCountMode;
    };
    m.prototype._getKey = function(o) {
        var K, u;
        if (o instanceof sap.ui.model.Context) {
            K = o.getPath().substr(1);
        } else if (o && o.__metadata && o.__metadata.uri) {
            u = o.__metadata.uri;
            K = u.substr(u.lastIndexOf("/") + 1);
        }
        return K;
    };
    m.prototype.getKey = function(o) {
        return this._getKey(o);
    };
    m.prototype.createKey = function(s, K) {
        var E = this.oMetadata._getEntityTypeByPath(s),
            j = s,
            t = this,
            n, p;
        j += "(";
        if (E.key.propertyRef.length === 1) {
            n = E.key.propertyRef[0].name;
            p = this.oMetadata._getPropertyMetadata(E, n);
            j += O.formatValue(K[n], p.type);
        } else {
            q.each(E.key.propertyRef, function(i, P) {
                if (i > 0) {
                    j += ",";
                }
                n = P.name;
                p = t.oMetadata._getPropertyMetadata(E, n);
                j += n;
                j += "=";
                j += O.formatValue(K[n], p.type);
            });
        }
        j += ")";
        return j;
    };
    m.prototype.getProperty = function(p, o, i) {
        var v = this._getObject(p, o);
        if (!i) {
            return v;
        }
        if (!q.isPlainObject(v)) {
            return v;
        }
        v = q.sap.extend(true, {}, v);
        if (i === true) {
            return this._restoreReferences(v);
        } else {
            return this._removeReferences(v);
        }
    };
    m.prototype._getObject = function(p, o) {
        var n = this.isLegacySyntax() ? this.oData : null,
            r = this.resolve(p, o),
            s, D, i, j, K, t;
        if (this.oMetadata && r && r.indexOf('/#') > -1) {
            s = r.indexOf('/##');
            if (s >= 0) {
                t = this.getMetaModel();
                if (!this.bMetaModelLoaded) {
                    return null;
                }
                D = r.substr(0, s);
                i = r.substr(s + 3);
                j = t.getMetaContext(D);
                n = t.getProperty(i, j);
            } else {
                n = this.oMetadata._getAnnotation(r);
            }
        } else {
            if (o) {
                K = o.getPath();
                K = K.substr(1);
                n = this.mChangedEntities[K] ? this.mChangedEntities[K] : this.oData[K];
            }
            if (!p) {
                return n;
            }
            var P = p.split("/"),
                I = 0;
            if (!P[0]) {
                I++;
                if (this.mChangedEntities[P[I]]) {
                    n = this.mChangedEntities;
                } else {
                    n = this.oData;
                }
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
    m.prototype.updateSecurityToken = function() {
        if (this.bTokenHandling) {
            if (!this.oServiceData.securityToken) {
                this.refreshSecurityToken();
            }
            if (this.bTokenHandling) {
                this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
            }
        }
    };
    m.prototype.resetSecurityToken = function() {
        delete this.oServiceData.securityToken;
        delete this.oHeaders["x-csrf-token"];
    };
    m.prototype.getSecurityToken = function() {
        var t = this.oServiceData.securityToken;
        if (!t) {
            this.refreshSecurityToken();
            t = this.oServiceData.securityToken;
        }
        return t;
    };
    m.prototype.refreshSecurityToken = function(s, E) {
        var t = this,
            u, T;
        u = this._createRequestUrl("/");
        var r = this._createRequest(u, "GET", this._getHeaders(), null, null, false);
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
    m.prototype._submitRequest = function(r, s, E) {
        var t = this,
            H;

        function _(D, R) {
            if (s) {
                s(D, R);
            }
        }

        function i(o) {
            if (t.bTokenHandling && o.response) {
                var T = t._getHeader("x-csrf-token", o.response.headers);
                if (!r.bTokenReset && o.response.statusCode == '403' && T && T.toLowerCase() === "required") {
                    t.resetSecurityToken();
                    r.bTokenReset = true;
                    j();
                    return;
                }
            }
            t._handleError(o);
            if (E) {
                E(o);
            }
        }

        function j() {
            if (t.bTokenHandling && r.method !== "GET") {
                t.updateSecurityToken();
                if (t.bTokenHandling) {
                    r.headers["x-csrf-token"] = t.oServiceData.securityToken;
                }
            }
            H = t._getODataHandler(r.requestUri);
            return t._request(r, _, i, H, undefined, t.getServiceMetadata());
        }
        return j();
    };
    m.prototype._submitSingleRequest = function(r, s, E) {
        var t = this,
            R, i = {},
            G = {},
            j = {},
            o;
        var n = function(D, u) {
            var S = function(D, u) {
                if (s) {
                    s(D, u);
                }
                if (r.requestUri.indexOf("$count") === -1) {
                    t.checkUpdate(false, false, G);
                    if (t._isRefreshNeeded(r, u)) {
                        t._refresh(false, undefined, i, j);
                    }
                }
                t._updateChangedEntities(i);
            };
            t._processSuccess(r, u, S, G, i, j);
        };
        var p = function(u) {
            if (u.message == "Request aborted") {
                t._processAborted(r, u, E);
            } else {
                t._processError(r, u, E);
            }
        };
        R = this._submitRequest(r, n, p);
        o = this._createEventInfo(r);
        this.fireRequestSent(o);
        return R;
    };
    m.prototype._submitBatchRequest = function(B, r, s, E) {
        var t = this;
        var n = function(D, u) {
            var v, w, x, y = D.__batchResponses,
                z, A = {},
                G = {},
                F = {};
            if (y) {
                var i, j;
                for (i = 0; i < y.length; i++) {
                    v = y[i];
                    if (q.isArray(r[i])) {
                        if (v.message) {
                            for (j = 0; j < r[i].length; j++) {
                                w = r[i][j];
                                if (w.request._aborted) {
                                    t._processAborted(w.request, v, w.fnError);
                                } else {
                                    t._processError(w.request, v, w.fnError);
                                }
                                w.response = v;
                            }
                        } else {
                            x = v.__changeResponses;
                            for (j = 0; j < x.length; j++) {
                                var H = x[j];
                                w = r[i][j];
                                if (w.request._aborted) {
                                    t._processAborted(w.request, H, w.fnError);
                                } else if (H.message) {
                                    t._processError(w.request, H, w.fnError);
                                } else {
                                    t._processSuccess(w.request, H, w.fnSuccess, G, A, F);
                                }
                                w.response = H;
                            }
                        }
                    } else {
                        w = r[i];
                        if (w.request._aborted) {
                            t._processAborted(w.request, v, w.fnError);
                        } else if (v.message) {
                            t._processError(w.request, v, w.fnError);
                        } else {
                            t._processSuccess(w.request, v, w.fnSuccess, G, A, F);
                        }
                        w.response = v;
                    }
                }
                t.checkUpdate(false, false, G);
            }
            if (s) {
                s(D);
            }
            z = t._createEventInfo(B, u, r);
            t.fireBatchRequestCompleted(z);
        };
        var o = function(j) {
            var u, A = R && R.bAborted;
            q.each(r, function(i, v) {
                if (q.isArray(v)) {
                    q.each(v, function(i, v) {
                        if (A) {
                            t._processAborted(v.request, j, v.fnError);
                        } else {
                            t._processError(v.request, j, v.fnError);
                        }
                    });
                } else {
                    if (A) {
                        t._processAborted(v.request, j, v.fnError);
                    } else {
                        t._processError(v.request, j, v.fnError);
                    }
                }
            });
            if (E) {
                E(j);
            }
            u = t._createEventInfo(B, j, r);
            t.fireBatchRequestCompleted(u);
            if (!A) {
                t.fireBatchRequestFailed(u);
            }
        };
        var p = function(T, B, j, r) {
            var u;
            q.each(r, function(i, v) {
                if (q.isArray(v)) {
                    q.each(v, function(i, v) {
                        u = t._createEventInfo(v.request, j);
                        t["fireRequest" + T](u);
                    });
                } else {
                    u = t._createEventInfo(v.request, j);
                    t["fireRequest" + T](u);
                }
            });
            u = t._createEventInfo(B, j, r);
            t["fireBatchRequest" + T](u);
        };
        var R = this._submitRequest(B, n, o);
        p("Sent", B, null, r);
        return R;
    };
    m.prototype._createBatchRequest = function(B) {
        var u, r, o = {},
            p = {};
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
            async: true
        };
        r.withCredentials = this.bWithCredentials;
        return r;
    };
    m.prototype._pushToRequestQueue = function(r, B, s, R, S, E) {
        var o, i = r[B];
        if (!i) {
            i = {};
            i.requests = [];
            r[B] = i;
        }
        if (R.method !== "GET") {
            if (!i.changes) {
                i.changes = {};
            }
            if (R.key && i.map && R.key in i.map) {
                if (R.method === "POST") {
                    i.map[R.key].method = "POST";
                }
                if (i.map[R.key]._aborted) {
                    delete i.map[R.key]._aborted;
                }
                i.map[R.key].data = R.data;
            } else {
                o = i.changes[s];
                if (!o) {
                    o = [];
                    i.changes[s] = o;
                }
                R._changeSetId = s;
                o.push({
                    request: R,
                    fnSuccess: S,
                    fnError: E,
                    changeSetId: s
                });
                if (R.key) {
                    if (!i.map) {
                        i.map = {};
                    }
                    i.map[R.key] = R;
                }
            }
        } else {
            i.requests.push({
                request: R,
                fnSuccess: S,
                fnError: E
            });
        }
    };
    m.prototype._collectChangedEntities = function(G, j, E) {
        var t = this;
        if (G.changes) {
            q.each(G.changes, function(s, n) {
                for (var i = 0; i < n.length; i++) {
                    var r = n[i].request,
                        K = r.requestUri.split('?')[0];
                    if (r.method === "POST") {
                        var o = t.oMetadata._getEntityTypeByPath("/" + K);
                        if (o) {
                            E[o.entityType] = true;
                        }
                    } else {
                        j[K] = true;
                    }
                }
            });
        }
    };
    m.prototype._processRequestQueue = function(r, B, s, E) {
        var t = this,
            R = [];
        if (this.oRequestTimer && r !== this.mDeferredRequests) {
            q.sap.clearDelayedCall(this.oRequestTimer);
            this.oRequestTimer = undefined;
        }
        if (this.bUseBatch) {
            if (t.bRefreshAfterChange) {
                q.each(r, function(G, o) {
                    if (G === B || !B) {
                        var i = {},
                            j = {};
                        t._collectChangedEntities(o, i, j);
                        t.bIncludeInCurrentBatch = true;
                        t._refresh(false, G, i, j);
                        t.bIncludeInCurrentBatch = false;
                    }
                });
            }
            q.each(r, function(G, o) {
                if (G === B || !B) {
                    var j = [],
                        n = [],
                        p, u;
                    if (o.changes) {
                        q.each(o.changes, function(x, y) {
                            p = {
                                __changeRequests: []
                            };
                            u = [];
                            for (var i = 0; i < y.length; i++) {
                                if (y[i].request._aborted) {
                                    t._processAborted(y[i].request, null, y[i].fnError);
                                } else {
                                    if (y[i].request.data && y[i].request.data.__metadata) {
                                        delete y[i].request.data.__metadata.created;
                                    }
                                    p.__changeRequests.push(y[i].request);
                                    u.push(y[i]);
                                }
                            }
                            if (p.__changeRequests && p.__changeRequests.length > 0) {
                                j.push(p);
                                n.push(u);
                            }
                        });
                    }
                    if (o.requests) {
                        var v = o.requests;
                        for (var i = 0; i < v.length; i++) {
                            if (v[i].request._aborted) {
                                t._processAborted(v[i].request, null, v[i].fnError);
                            } else {
                                j.push(v[i].request);
                                n.push(v[i]);
                            }
                        }
                    }
                    if (j.length > 0) {
                        var w = t._createBatchRequest(j, true);
                        R.push(t._submitBatchRequest(w, n, s, E));
                    }
                    delete r[G];
                }
            });
        } else {
            q.each(r, function(G, o) {
                if (G === B || !B) {
                    if (o.changes) {
                        q.each(o.changes, function(n, p) {
                            for (var i = 0; i < p.length; i++) {
                                if (p[i].request._aborted) {
                                    t._processAborted(p[i].request, null, p[i].fnError);
                                } else {
                                    p[i].request._handle = t._submitSingleRequest(p[i].request, p[i].fnSuccess, p[i].fnError);
                                    R.push(p[i].request._handle);
                                }
                            }
                        });
                    }
                    if (o.requests) {
                        var j = o.requests;
                        for (var i = 0; i < j.length; i++) {
                            if (j[i].request._aborted) {
                                t._processAborted(j[i].request, null, j[i].fnError);
                            } else {
                                j[i].request._handle = t._submitSingleRequest(j[i].request, j[i].fnSuccess, j[i].fnError);
                                R.push(j[i].request._handle);
                            }
                        }
                    }
                    delete r[G];
                }
            });
        }
        return R.length == 1 ? R[0] : R;
    };
    m.prototype._processSuccess = function(r, R, s, G, i, E) {
        var o = R.data,
            j, u, p, P, n, t = this;
        j = !(R.statusCode === 204 || R.statusCode === '204');
        if (j && !o && R) {
            this._parseResponse(R, r, G, i);
            q.sap.log.fatal(this + " - No data was retrieved by service: '" + R.requestUri + "'");
            t.fireRequestCompleted({
                url: R.requestUri,
                type: "GET",
                async: R.async,
                info: "Accept headers:" + this.oHeaders["Accept"],
                infoObject: {
                    acceptHeaders: this.oHeaders["Accept"]
                },
                success: false
            });
            return false;
        }
        if (o && o.results && !q.isArray(o.results)) {
            o = o.results;
        }
        if (o && (q.isArray(o) || typeof o == 'object')) {
            o = q.sap.extend(true, {}, o);
            t._importData(o, G);
        }
        u = r.requestUri;
        p = u.replace(this.sServiceUrl, "");
        if (!q.sap.startsWith(p, '/')) {
            p = '/' + p;
        }
        p = this._normalizePath(p);
        if (!j) {
            P = p.split("/");
            if (P[1]) {
                i[P[1]] = true;
                var v = {};
                v[P[1]] = true;
                this._updateChangedEntities(v);
            }
            if (r.method === "DELETE") {
                delete t.oData[P[1]];
                delete t.mContexts["/" + P[1]];
            }
        }
        if (j && r.method === "POST") {
            n = this.oMetadata._getEntityTypeByPath(p);
            if (n) {
                E[n.entityType] = true;
            }
            if (r.context) {
                var K = this._getKey(o);
                delete this.mChangedEntities[r.context.sPath.substr(1)];
                delete this.oData[r.context.sPath.substr(1)];
                r.context.sPath = '/' + K;
            }
        }
        this._parseResponse(R, r, G, i);
        this._updateETag(r, R);
        if (s) {
            s(R.data, R);
        }
        var w = this._createEventInfo(r, R);
        this.fireRequestCompleted(w);
        return true;
    };
    m.prototype._processError = function(r, R, E) {
        var o = this._handleError(R, r);
        if (E) {
            E(o);
        }
        var i = this._createEventInfo(r, o);
        this.fireRequestCompleted(i);
        this.fireRequestFailed(i);
    };
    m.prototype._processAborted = function(r, R, E) {
        var o = {
            message: "Request aborted",
            statusCode: 0,
            statusText: "abort",
            headers: {},
            responseText: ""
        };
        if (E) {
            E(o);
        }
        if (R) {
            var i = this._createEventInfo(r, o);
            i.success = false;
            this.fireRequestCompleted(i);
        }
    };
    m.prototype._processChange = function(K, D, i) {
        var p, E, s, j, u, H, r, t;
        E = this.oMetadata._getEntityTypeByPath(K);
        i = i !== false;
        if (D.__metadata && D.__metadata.created) {
            j = "POST";
            K = D.__metadata.created.key;
        } else if (i) {
            j = "MERGE";
        } else {
            j = "PUT";
        }
        p = q.sap.extend(true, {}, D);
        if (p.__metadata) {
            t = p.__metadata.type;
            s = p.__metadata.etag;
            delete p.__metadata;
            if (t || s) {
                p.__metadata = {};
            }
            if (t) {
                p.__metadata.type = t;
            }
            if (s) {
                p.__metadata.etag = s;
            }
        }
        q.each(p, function(P, o) {
            if (o && o.__deferred) {
                delete p[P];
            }
        });
        if (E) {
            var n = this.oMetadata._getNavigationPropertyNames(E);
            q.each(n, function(I, N) {
                delete p[N];
            });
        }
        p = this._removeReferences(p);
        u = this._createRequestUrl('/' + K);
        H = this._getHeaders();
        r = this._createRequest(u, j, H, p, s);
        if (this.bUseBatch) {
            r.requestUri = r.requestUri.replace(this.sServiceUrl + '/', '');
        }
        return r;
    };
    m.prototype._resolveGroup = function(K) {
        var o, E, B, s;
        E = this.oMetadata._getEntityTypeByPath(K);
        if (this.mChangeBatchGroups[E.name]) {
            o = this.mChangeBatchGroups[E.name];
            B = o.batchGroupId;
            s = o.single ? q.sap.uid() : o.changeSetId;
        } else if (this.mChangeBatchGroups['*']) {
            o = this.mChangeBatchGroups['*'];
            B = o.batchGroupId;
            s = o.single ? q.sap.uid() : o.changeSetId;
        }
        return {
            batchGroupId: B,
            changeSetId: s
        };
    };
    m.prototype._updateETag = function(r, R) {
        var u, E, s;
        u = r.requestUri.replace(this.sServiceUrl + '/', '');
        if (!q.sap.startsWith(u, "/")) {
            u = "/" + u;
        }
        E = this._getObject(u);
        s = this._getHeader("etag", R.headers);
        if (E && E.__metadata && s) {
            E.__metadata.etag = s;
        }
    };
    m.prototype._handleError = function(E, r) {
        var p = {},
            t;
        var s = "The following problem occurred: " + E.message;
        p.message = E.message;
        if (E.response) {
            this._parseResponse(E.response, r);
            if (this.bTokenHandling) {
                t = this._getHeader("x-csrf-token", E.response.headers);
                if (E.response.statusCode == '403' && t && t.toLowerCase() === "required") {
                    this.resetSecurityToken();
                }
            }
            s += E.response.statusCode + "," + E.response.statusText + "," + E.response.body;
            p.statusCode = E.response.statusCode;
            p.statusText = E.response.statusText;
            p.headers = E.response.headers;
            p.responseText = E.response.body;
        }
        q.sap.log.fatal(s);
        return p;
    };
    m.prototype.getData = function(p, o, i) {
        return this.getProperty(p, o, i);
    };
    m.prototype._getODataHandler = function(u) {
        if (u.indexOf("$batch") > -1) {
            return OData.batchHandler;
        } else if (u.indexOf("$count") > -1) {
            return undefined;
        } else if (this.bJSON) {
            return OData.jsonHandler;
        } else {
            return OData.atomHandler;
        }
    };
    m.prototype._getETag = function(p, o, D) {
        if (!D || !D.__metadata) {
            D = this._getObject(p, o);
        }
        if (D && D.__metadata) {
            return D.__metadata.etag;
        }
        return null;
    };
    m.prototype._createRequest = function(u, s, H, D, E, A) {
        A = A !== false;
        if (E && s !== "GET") {
            H["If-Match"] = E;
        }
        if (this.bJSON && s !== "DELETE" && this.sMaxDataServiceVersion === "2.0") {
            H["Content-Type"] = "application/json";
        }
        if (u.indexOf("$count") > -1) {
            H["Accept"] = "text/plain, */*;q=0.5";
        }
        if (s === "MERGE" && !this.bUseBatch) {
            H["x-http-method"] = "MERGE";
            s = "POST";
        }
        var r = {
            headers: H,
            requestUri: u,
            method: s,
            user: this.sUser,
            password: this.sPassword,
            async: A
        };
        if (D) {
            r.data = D;
        }
        if (this.bWithCredentials) {
            r.withCredentials = this.bWithCredentials;
        }
        r.requestID = this._createRequestID();
        return r;
    };
    m.prototype._isRefreshNeeded = function(r, R) {
        var i = false;
        if (this.bRefreshAfterChange) {
            i = true;
        }
        return i;
    };
    m.prototype._processRequest = function(p) {
        var r, R, A = false,
            t = this;
        this.oMetadata.loaded().then(function() {
            R = p();
            if (!t.oRequestTimer) {
                t.oRequestTimer = q.sap.delayedCall(0, t, t._processRequestQueue, [t.mRequests]);
            }
            if (A) {
                r.abort();
            }
        });
        r = {
            abort: function() {
                A = true;
                if (R) {
                    R._aborted = true;
                    if (R._handle) {
                        R._handle.abort();
                    }
                }
            }
        };
        return r;
    };
    m.prototype.update = function(p, D, P) {
        var s, E, i, r, u, o, j, S, K, n, B, t, v, H, w, R, x = {},
            y = this;
        if (P) {
            B = P.batchGroupId;
            t = P.changeSetId;
            o = P.context;
            s = P.success;
            E = P.error;
            j = P.eTag;
            H = P.headers;
            i = P.merge !== false;
            v = P.urlParameters;
        }
        n = O._createUrlParamsArray(v);
        H = this._getHeaders(H);
        w = i ? "MERGE" : "PUT";
        j = j || this._getETag(p, o, D);
        S = y._getObject(p, o);
        if (S) {
            K = this._getKey(S);
            x[K] = true;
        }
        return this._processRequest(function() {
            u = y._createRequestUrl(p, o, n, y.bUseBatch);
            r = y._createRequest(u, w, H, D, j);
            r.keys = x;
            R = y.mRequests;
            if (B in y.mDeferredBatchGroups) {
                R = y.mDeferredRequests;
            }
            y._pushToRequestQueue(R, B, t, r, s, E);
            return r;
        });
    };
    m.prototype.create = function(p, D, P) {
        var r, u, E, o, s, i, j, R, H, n, t, B, v, w, x = this;
        if (P) {
            o = P.context;
            j = P.urlParameters;
            s = P.success;
            i = P.error;
            B = P.batchGroupId;
            w = P.changeSetId;
            t = P.eTag;
            H = P.headers;
        }
        n = O._createUrlParamsArray(j);
        H = this._getHeaders(H);
        v = "POST";
        return this._processRequest(function() {
            u = x._createRequestUrl(p, o, n, x.bUseBatch);
            r = x._createRequest(u, v, H, D, t);
            p = x._normalizePath(p, o);
            E = x.oMetadata._getEntityTypeByPath(p);
            r.entityTypes = {};
            if (E) {
                r.entityTypes[E.entityType] = true;
            }
            R = x.mRequests;
            if (B in x.mDeferredBatchGroups) {
                R = x.mDeferredRequests;
            }
            x._pushToRequestQueue(R, B, w, r, s, i);
            return r;
        });
    };
    m.prototype.remove = function(p, P) {
        var o, E, s, i, r, u, B, j, n, t, v, H, w, x, R, y = this;
        if (P) {
            B = P.batchGroupId;
            j = P.changeSetId;
            o = P.context;
            s = P.success;
            i = P.error;
            n = P.eTag;
            H = P.headers;
            v = P.urlParameters;
        }
        w = O._createUrlParamsArray(v);
        H = this._getHeaders(H);
        x = "DELETE";
        n = n || this._getETag(p, o);
        t = function(D, z) {
            E = u.substr(u.lastIndexOf('/') + 1);
            if (E.indexOf('?') !== -1) {
                E = E.substr(0, E.indexOf('?'));
            }
            delete y.oData[E];
            delete y.mContexts["/" + E];
            if (s) {
                s(D, z);
            }
        };
        return this._processRequest(function() {
            u = y._createRequestUrl(p, o, w, y.bUseBatch);
            r = y._createRequest(u, x, H, undefined, n);
            R = y.mRequests;
            if (B in y.mDeferredBatchGroups) {
                R = y.mDeferredRequests;
            }
            y._pushToRequestQueue(R, B, j, r, t, i);
            return r;
        });
    };
    m.prototype.callFunction = function(F, p) {
        var r, u, o, R, i, j, s, E, n = "GET",
            j, I = {},
            B, t, H, v = this;
        if (p) {
            B = p.batchGroupId;
            t = p.changeSetId;
            n = p.method ? p.method : n;
            i = p.urlParameters;
            s = p.success;
            E = p.error;
            H = p.headers;
        }
        if (!q.sap.startsWith(F, "/")) {
            q.sap.log.fatal(this + " callFunction: path '" + F + "' must be absolute!");
            return;
        }
        H = this._getHeaders(H);
        return this._processRequest(function() {
            o = v.oMetadata._getFunctionImportMetadata(F, n);
            if (!o) {
                return;
            }
            if (o.parameter != null) {
                q.each(i, function(P, w) {
                    var x = q.grep(o.parameter, function(y) {
                        return y.name === P && (!y.mode || y.mode === "In");
                    });
                    if (x != null && x.length > 0) {
                        I[P] = O.formatValue(w, x[0].type);
                    } else {
                        q.sap.log.warning(v + " - Parameter '" + P + "' is not defined for function call '" + F + "'!");
                    }
                });
            }
            j = O._createUrlParamsArray(I);
            u = v._createRequestUrl(F, null, j, v.bUseBatch);
            r = v._createRequest(u, n, H, undefined);
            R = v.mRequests;
            if (B in v.mDeferredBatchGroups) {
                R = v.mDeferredRequests;
            }
            v._pushToRequestQueue(R, B, t, r, s, E);
            return r;
        });
    };
    m.prototype.read = function(p, P) {
        var r, u, o, i, s, E, F, S, j, n, t, N, v, H, w, B, x, R, y = this;
        if (P) {
            o = P.context;
            i = P.urlParameters;
            s = P.success;
            E = P.error;
            F = P.filters;
            S = P.sorters;
            B = P.batchGroupId;
            H = P.headers;
        }
        if (this.sRefreshBatchGroupId) {
            B = this.sRefreshBatchGroupId;
        }
        v = O._createUrlParamsArray(i);
        H = this._getHeaders(H);
        w = "GET";
        x = this._getETag(p, o);

        function z() {
            n = O.createSortParams(S);
            if (n) {
                v.push(n);
            }
            var T = p;
            var I = p.indexOf("$count");
            if (I !== -1) {
                T = p.substring(0, I - 1);
            }
            N = y._normalizePath(T, o);
            t = y.oMetadata._getEntityTypeByPath(N);
            j = O.createFilterParams(F, y.oMetadata, t);
            if (j) {
                v.push(j);
            }
            u = y._createRequestUrl(p, o, v, y.bUseBatch);
            r = y._createRequest(u, w, H, null, x);
            R = y.mRequests;
            if (B in y.mDeferredBatchGroups) {
                R = y.mDeferredRequests;
            }
            y._pushToRequestQueue(R, B, null, r, s, E);
            return r;
        }
        if (this.bUseBatch && this.bIncludeInCurrentBatch) {
            r = z();
            return {
                abort: function() {
                    if (r) {
                        r._aborted = true;
                    }
                }
            };
        } else {
            return this._processRequest(z);
        }
    };
    m.prototype.getServiceMetadata = function() {
        if (this.oMetadata && this.oMetadata.isLoaded()) {
            return this.oMetadata.getServiceMetadata();
        }
    };
    m.prototype.getServiceAnnotations = function() {
        if (this.oAnnotations && this.oAnnotations.getAnnotationsData) {
            return this.oAnnotations.getAnnotationsData();
        }
    };
    m.prototype.submitChanges = function(p) {
        var j = true,
            r, B, G, s, E, R, v, A = false,
            t = this;
        if (p) {
            B = p.batchGroupId;
            s = p.success;
            E = p.error;
            j = p.merge !== false;
        }
        if (B && !this.mDeferredBatchGroups[B]) {
            q.sap.log.fatal(this + " submitChanges: \"" + B + "\" is not a deferred batch group!");
        }
        this.oMetadata.loaded().then(function() {
            q.each(t.mChangedEntities, function(K, D) {
                G = t._resolveGroup(K);
                if (G.batchGroupId === B || !B) {
                    r = t._processChange(K, D, j);
                    r.key = K;
                    if (G.batchGroupId in t.mDeferredBatchGroups) {
                        t._pushToRequestQueue(t.mDeferredRequests, G.batchGroupId, G.changeSetId, r);
                    }
                }
            });
            v = t._processRequestQueue(t.mDeferredRequests, B, s, E);
            if (A) {
                R.abort();
            }
        });
        R = {
            abort: function() {
                if (v) {
                    if (q.isArray(v)) {
                        q.each(v, function(i, R) {
                            R.abort();
                        });
                    } else {
                        v.abort();
                    }
                } else {
                    A = true;
                }
            }
        };
        return R;
    };
    m.prototype._updateChangedEntities = function(i) {
        var t = this;
        q.each(i, function(K, j) {
            if (K in t.mChangedEntities) {
                var o = t._getObject('/' + K);
                delete t.mChangedEntities[K];
                var E = t._getObject('/' + K);
                q.sap.extend(true, E, o);
            }
        });
    };
    m.prototype.resetChanges = function(K) {
        var t = this;
        if (K) {
            q.each(K, function(i, s) {
                if (s in t.mChangedEntities) {
                    t.mChangeHandles[s].abort();
                    delete t.mChangeHandles[s];
                    delete t.mChangedEntities[s];
                } else {
                    q.sap.log.warning(t + " - resetChanges: " + s + " is not changed nor a valid change key!");
                }
            });
        } else {
            q.each(this.mChangedEntities, function(s, o) {
                t.mChangeHandles[s].abort();
                delete t.mChangeHandles[s];
                delete t.mChangedEntities[s];
            });
        }
        this.checkUpdate();
    };
    m.prototype.setProperty = function(p, v, o, A) {
        var P, r, R, E = {},
            D = {},
            s = this.resolve(p, o),
            j, K, G, n, t = {},
            u;
        if (!s) {
            q.sap.log.warning(this + " - TwoWay binding: path '" + p + "' not resolvable!");
            return false;
        }
        j = s.split("/");
        P = j[j.length - 1];
        D = this._getObject(s.substr(0, s.lastIndexOf("/")));
        if (!D) {
            return false;
        }
        for (var i = j.length - 1; i >= 0; i--) {
            u = j.join("/");
            E = this._getObject(u);
            if (E) {
                K = this._getKey(E);
                if (K) {
                    break;
                }
            }
            j.splice(i, 1);
        }
        if (!this.mChangedEntities[K]) {
            E = q.sap.extend(true, {}, E);
        }
        this.mChangedEntities[K] = E;
        var w = E;
        j = s.substr(u.length).split("/");
        for (var i = 1; i < j.length - 1; i++) {
            if (!w.hasOwnProperty(j[i])) {
                w[j[i]] = {};
            }
            w = w[j[i]];
        }
        w[P] = v;
        G = this._resolveGroup(K);
        r = this.mRequests;
        if (G.batchGroupId in this.mDeferredBatchGroups) {
            r = this.mDeferredRequests;
            R = this._processChange(K, {
                __metadata: E.__metadata
            });
            R.key = K;
        } else {
            R = this._processChange(K, E);
        }
        if (!this.mChangeHandles[K]) {
            n = {
                abort: function() {
                    R._aborted = true;
                }
            };
            this.mChangeHandles[K] = n;
        }
        this._pushToRequestQueue(r, G.batchGroupId, G.changeSetId, R);
        if (this.bUseBatch) {
            if (!this.oRequestTimer) {
                this.oRequestTimer = q.sap.delayedCall(0, this, this._processRequestQueue, [this.mRequests]);
            }
        } else {
            this._processRequestQueue(this.mRequests);
        }
        t[K] = true;
        this.checkUpdate(false, A, t);
        return true;
    };
    m.prototype._isHeaderPrivate = function(H) {
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
        return false;
    };
    m.prototype.setHeaders = function(H) {
        var i = {},
            t = this;
        this.mCustomHeaders = {};
        if (H) {
            q.each(H, function(s, j) {
                if (t._isHeaderPrivate(s)) {
                    q.sap.log.warning(this + " - modifying private header: '" + s + "' not allowed!");
                } else {
                    i[s] = j;
                }
            });
            this.mCustomHeaders = i;
        }
    };
    m.prototype._getHeaders = function(H) {
        var i = {},
            t = this;
        if (H) {
            q.each(H, function(s, j) {
                if (t._isHeaderPrivate(s)) {
                    q.sap.log.warning(this + " - modifying private header: '" + s + "' not allowed!");
                } else {
                    i[s] = j;
                }
            });
        }
        return q.extend({}, this.mCustomHeaders, i, this.oHeaders);
    };
    m.prototype.getHeaders = function() {
        return q.extend({}, this.mCustomHeaders, this.oHeaders);
    };
    m.prototype._getHeader = function(H, i) {
        var s;
        for (s in i) {
            if (s.toLowerCase() === H.toLowerCase()) {
                return i[s];
            }
        }
        return null;
    };
    m.prototype.hasPendingChanges = function() {
        return !q.isEmptyObject(this.mChangedEntities);
    };
    m.prototype.getPendingChanges = function() {
        return q.sap.extend(true, {}, this.mChangedEntities);
    };
    m.prototype.updateBindings = function(F) {
        this.checkUpdate(F);
    };
    m.prototype.setTokenHandlingEnabled = function(t) {
        this.bTokenHandling = t;
    };
    m.prototype.setUseBatch = function(u) {
        this.bUseBatch = u;
    };
    m.prototype.formatValue = function(v, t) {
        return O.formatValue(v, t);
    };
    m.prototype.deleteCreatedEntry = function(o) {
        if (o) {
            var p = o.getPath();
            delete this.mContexts[p];
            if (q.sap.startsWith(p, "/")) {
                p = p.substr(1);
            }
            this.mChangeHandles[p].abort();
            delete this.mChangeHandles[p];
            delete this.mChangedEntities[p];
            delete this.oData[p];
        }
    };
    m.prototype.createEntry = function(p, P) {
        var s, E, r, u, j, o, K, n, B, t, R, v, H, w, x, y = {},
            z, A = "POST",
            D = this;
        if (P) {
            x = P.properties;
            B = P.batchGroupId;
            t = P.changeSetId;
            o = P.context;
            s = P.success;
            E = P.error;
            z = P.created;
            j = P.eTag;
            H = P.headers;
            v = P.urlParameters;
        }
        B = B ? B : this.sDefaultChangeBatchGroup;
        n = O._createUrlParamsArray(v);
        H = this._getHeaders(H);

        function F() {
            var G;
            if (!q.sap.startsWith(p, "/")) {
                p = "/" + p;
            }
            var I = D.oMetadata._getEntityTypeByPath(p);
            if (!I) {
                return undefined;
            }
            if (typeof x === "object" && !q.isArray(x)) {
                y = x;
            } else {
                for (var i = 0; i < I.property.length; i++) {
                    var J = I.property[i];
                    var T = J.type.split('.');
                    var L = q.inArray(J.name, x) > -1;
                    if (!x || L) {
                        y[J.name] = D._createPropertyValue(T);
                        if (L) {
                            x.splice(x.indexOf(J.name), 1);
                        }
                    }
                }
                if (x) {}
            }
            K = p.substring(1) + "('" + q.sap.uid() + "')";
            D.oData[K] = y;
            y.__metadata = {
                type: "" + I.entityType,
                uri: D.sServiceUrl + '/' + K,
                created: {
                    key: p.substring(1)
                }
            };
            u = D._createRequestUrl(p, o, n, D.bUseBatch);
            r = D._createRequest(u, A, H, y, undefined, j);
            G = D.getContext("/" + K);
            r.context = G;
            r.key = K;
            w = D.mRequests;
            if (B in D.mDeferredBatchGroups) {
                w = D.mDeferredRequests;
            }
            D._pushToRequestQueue(w, B, t, r, s, E, P);
            R = {
                abort: function() {
                    r._aborted = true;
                }
            };
            D.mChangeHandles[K] = R;
            if (D.bUseBatch) {
                if (!D.oRequestTimer) {
                    D.oRequestTimer = q.sap.delayedCall(0, D, D._processRequestQueue, [D.mRequests]);
                }
            } else {
                D._processRequestQueue(D.mRequests);
            }
            return G;
        }
        if (z) {
            this.oMetadata.loaded().then(function() {
                z(F());
            });
        } else if (this.oMetadata.isLoaded()) {
            return F();
        } else {
            q.sap.log.error("Tried to use createEntry without created-callback, before metadata is available!");
        }
    };
    m.prototype._createPropertyValue = function(t) {
        var n = t[0];
        var T = t[1];
        if (n.toUpperCase() !== 'EDM') {
            var o = {};
            var j = this.oMetadata._getObjectMetadata("complexType", T, n);
            for (var i = 0; i < j.property.length; i++) {
                var p = j.property[i];
                t = p.type.split('.');
                o[p.name] = this._createPropertyValue(t);
            }
            return o;
        } else {
            return this._getDefaultPropertyValue(T, n);
        }
    };
    m.prototype._getDefaultPropertyValue = function(t, n) {
        return undefined;
    };
    m.prototype._normalizePath = function(p, o) {
        if (p && p.indexOf('?') !== -1) {
            p = p.substr(0, p.indexOf('?'));
        }
        if (!o && !q.sap.startsWith(p, "/")) {
            q.sap.log.fatal(this + " path " + p + " must be absolute if no Context is set");
        }
        return this.resolve(p, o);
    };
    m.prototype.setRefreshAfterChange = function(r) {
        this.bRefreshAfterChange = r;
    };
    m.prototype.isList = function(p, o) {
        p = this.resolve(p, o);
        return p && p.substr(p.lastIndexOf("/")).indexOf("(") === -1;
    };
    m.prototype._request = function(r, s, E, H, o, i) {
        var R;
        if (this.bDestroyed) {
            return {
                abort: function() {}
            };
        }
        var t = this;

        function w(j) {
            return function() {
                var I = q.inArray(R, t.aPendingRequestHandles);
                if (I > -1) {
                    t.aPendingRequestHandles.splice(I, 1);
                }
                if (!(R && R.bSuppressErrorHandlerCall)) {
                    j.apply(this, arguments);
                }
            };
        }
        R = OData.request(r, w(s || OData.defaultSuccess), w(E || OData.defaultError), H, o, i);
        if (r.async !== false) {
            this.aPendingRequestHandles.push(R);
        }
        return R;
    };
    m.prototype.destroy = function() {
        M.prototype.destroy.apply(this, arguments);
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
        if (this.oMetadataLoadEvent) {
            q.sap.clearDelayedCall(this.oMetadataLoadEvent);
        }
        if (this.oMetadataFailedEvent) {
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
    };
    m.prototype.setDeferredBatchGroups = function(G) {
        var t = this;
        this.mDeferredBatchGroups = {};
        q.each(G, function(i, B) {
            t.mDeferredBatchGroups[B] = B;
        });
    };
    m.prototype.getDeferredBatchGroups = function() {
        var G = [],
            i = 0;
        q.each(this.mDeferredBatchGroups, function(K, B) {
            G[i] = B;
            i++;
        });
        return G;
    };
    m.prototype.setChangeBatchGroups = function(G) {
        this.mChangeBatchGroups = G;
    };
    m.prototype.getChangeBatchGroups = function() {
        return this.mChangeBatchGroups;
    };
    m.prototype.setMessageParser = function(p) {
        if (!(p instanceof h)) {
            q.sap.log.error("Given MessageParser is not of type sap.ui.core.message.MessageParser");
            return;
        }
        p.setProcessor(this);
        this.oMessageParser = p;
        return this;
    };
    m.prototype._parseResponse = function(r, R, G, i) {
        try {
            if (!this.oMessageParser) {
                this.oMessageParser = new k(this.sServiceUrl, this.oMetadata);
                this.oMessageParser.setProcessor(this);
            }
            return this.oMessageParser.parse(r, R, G, i);
        } catch (j) {
            q.sap.log.error("Error parsing OData messages: " + j);
        }
    };
    m.prototype.callAfterUpdate = function(F) {
        this.aCallAfterUpdate.push(F);
    };
    m.prototype.getMetaModel = function() {
        var t = this;
        if (!this.oMetaModel) {
            this.oMetaModel = new g(this.oMetadata, this.oAnnotations);
            this.oMetaModel.loaded().then(function() {
                t.bMetaModelLoaded = true;
                t.checkUpdate();
            });
        }
        return this.oMetaModel;
    };
    return m;
}, true);