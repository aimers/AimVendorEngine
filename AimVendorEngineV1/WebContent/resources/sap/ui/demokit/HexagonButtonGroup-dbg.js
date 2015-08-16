/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.demokit.HexagonButtonGroup.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './library'],
	function(jQuery, Control, library) {
	"use strict";

	/**
	 * Constructor for a new HexagonButtonGroup.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A group of HexagonButtons, aligned in a packed grid
	 * @extends sap.ui.core.Control
	 * @version 1.28.12
	 *
	 * @constructor
	 * @public
	 * @name sap.ui.demokit.HexagonButtonGroup
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HexagonButtonGroup = Control.extend("sap.ui.demokit.HexagonButtonGroup", /** @lends sap.ui.demokit.HexagonButtonGroup.prototype */ { metadata : {
	
		library : "sap.ui.demokit",
		properties : {
	
			/**
			 * How many buttons might be placed in the same row of the grid
			 */
			colspan : {type : "int", group : "Misc", defaultValue : 3}
		},
		aggregations : {
	
			/**
			 * The buttons to layout in a grid
			 */
			buttons : {type : "sap.ui.demokit.HexagonButton", multiple : true, singularName : "button"}
		}
	}});

	return HexagonButtonGroup;

}, /* bExport= */ true);
