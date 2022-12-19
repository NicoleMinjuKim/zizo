sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/viz/ui5/data/FlattenedDataset',
	'sap/viz/ui5/controls/common/feeds/FeedItem',
	'sap/m/Label',
	'sap/m/ColumnListItem',
	'sap/m/library',
	'sap/m/MessageToast',
	'sap/m/Column'],
	function (Controller, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, MessageToast, Column) {
		"use strict";

		var oPageController = Controller.extend("project3.controller.GlChartFixFlex", {

			_constants: {
				vizFrame: {
					id: "chartContainerVizFrame",
					dataset: {
						dimensions: [{
							name: 'Country',
							value: "{gl_external_id}"
						}],
						measures: [{
							group: 1,
							name: 'Profit',
							value: '{gl_external_id}'
						}, {
							group: 1,
							name: 'Target',
							value: '{Target}'
						}
					],
						data: {
							path: this.oModel
						}
					},					
					type: "line",
					properties: {
						plotArea: {
							showGap: true
						}
					},
					feedItems: [
						{
						'uid': "axisLabels",
						'type': "Dimension",
						'values': ["Country"]
						},
						{						
						'uid': "primaryValues",
						'type': "Measure",
						'values': ["Profit"]
						},
						{
						'uid': "targetValues",
						'type': "Measure",
						'values': ["Target"]
						}
					]
				}
	
			},




			/* ============================================================ */
			/* Life-cycle Handling                                          */
			/* ============================================================ */
			/**
			 * Method called when the application is initalized.
			 *
			 * @public
			 */
			onInit: async function () {
				

				const GL = await $.ajax({
					type: "GET",
					url: "/gl/Gl"
				});
				let GLModel = new JSONModel(GL.value);
				this.getView().setModel(GLModel, "GLModel");



				var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
				// var oTable = this.getView().byId(this._constants.table.id);

				this._updateVizFrame(oVizFrame);
				// this._updateTable(oTable);
			},





			/* ============================================================ */
			/* Helper Methods                                               */
			/* ============================================================ */
			/**
			 * Updated the Viz Frame in the view.
			 *
			 * @private
			 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame that needs to be updated
			 */
			_updateVizFrame: function (vizFrame) {
				var oVizFrame = this._constants.vizFrame;
				let oModel = this.getView().getModel("GLModel");
				var oDataset = new FlattenedDataset(oVizFrame.dataset);

				vizFrame.setVizProperties(oVizFrame.properties);
				vizFrame.setDataset(oDataset);
				vizFrame.setModel(oModel);
				this._addFeedItems(vizFrame, oVizFrame.feedItems);
				vizFrame.setVizType(oVizFrame.type);
			},





			/**
			 * Updated the Table in the view.
			 *
			 * @private
			 * @param {sap.m.table} table Table that needs to be updated
			 */


			// _updateTable: function (table) {
			// 	var oTable = this._constants.table;
			// 	var oTablePath = sap.ui.require.toUrl(this._constants.sampleName + oTable.modulePath);
			// 	var oTableModel = new JSONModel(oTablePath);
			// 	var aColumns = this._createTableColumns(oTable.columnLabelTexts);

			// 	for (var i = 0; i < aColumns.length; i++) {
			// 		table.addColumn(aColumns[i]);
			// 	}

			// 	var oTableTemplate = new ColumnListItem({
			// 		type: MobileLibrary.ListType.Active,
			// 		cells: this._createLabels(oTable.templateCellLabelTexts)
			// 	});

			// 	table.bindItems(oTable.itemBindingPath, oTableTemplate);
			// 	table.setModel(oTableModel);
			// },



			/**
			 * Adds the passed feed items to the passed Viz Frame.
			 *
			 * @private
			 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
			 * @param {Object[]} feedItems Feed items to add
			 */
			_addFeedItems: function (vizFrame, feedItems) {
				for (var i = 0; i < feedItems.length; i++) {
					vizFrame.addFeed(new FeedItem(feedItems[i]));
				}
			},




			/**
			 * Creates table columns with labels as headers.
			 *
			 * @private
			 * @param {String[]} labels Column labels
			 * @returns {sap.m.Column[]} Array of columns
			 */
			// _createTableColumns: function (labels) {
			// 	var aLabels = this._createLabels(labels);
			// 	return this._createControls(Column, "header", aLabels);
			// },





			/**
			 * Creates label control array with the specified texts.
			 *
			 * @private
			 * @param {String[]} labelTexts text array
			 * @returns {sap.m.Column[]} Array of columns
			 */
			// _createLabels: function (labelTexts) {
			// 	return this._createControls(Label, "text", labelTexts);
			// },



			/**
			 * Creates an array of controls with the specified control type, property name and value.
			 *
			 * @private
			 * @param {sap.ui.core.Control} Control Control type to create
			 * @param {String} prop Property name
			 * @param {Array} propValues Value of the control's property
			 * @returns {sap.ui.core.Control[]} array of the new controls
			 */
			// _createControls: function (Control, prop, propValues) {
			// 	var aControls = [];
			// 	var oProps = {};
			// 	for (var i = 0; i < propValues.length; i++) {
			// 		oProps[prop] = propValues[i];
			// 		aControls.push(new Control(oProps));
			// 	}
			// 	return aControls;
			// }
		});
		return oPageController;
	});
