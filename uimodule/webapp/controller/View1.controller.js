/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
// @ts-nocheck
// eslint-disable-next-line @sap/ui5-jsdocs/no-jsdoc
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
],
    function (Controller, JSONModel, MessageBox) {
        "use strict";
        return Controller.extend("oft.fiori.crudBatch.controller.View1", {
            onInit: function () {

                // Initilized here, better way is to initialize in manifest.json to resolve Model refresh issues,
                // work around is to use oModel.refesh() manually
                const ProductsModel = new JSONModel();
                this.getOwnerComponent().setModel(ProductsModel, "ProductsModel");
                const oModel = this.getOwnerComponent().getModel();
                oModel.read("/ProductSet", {
                    success: function (data, response) {
                        // console.log(data);
                        const res = data.results.map(function (item) {
                            item.bEditable = false;
                            item.isDirty = false;
                            return item;
                        });
                        ProductsModel.setData({ "ProductSet": res });
                    },
                    error: function (err) {
                        console.log(err);
                    },
                });

                // AppState JSON - Keep all app states here
                const AppStateModel = new JSONModel();
                AppStateModel.setData({
                    editMode: false
                });
                this.getOwnerComponent().setModel(AppStateModel, "AppStateModel");

                // Some Other JSON model
                this.site = "9000";
                if (this.site === "1002") {
                    const oTemplateN = new sap.ui.core.ListItem({
                        text: "{Waers}",
                        key: "{Waers}",
                    });

                    this.getView().byId("testSelect").bindItems("/VH_CurrencySet", {
                        template: oTemplateN,
                    });
                } else {
                    const oTemplateN = new sap.ui.core.ListItem({
                        text: "{Landx}",
                        key: "{Landx}",
                    });

                    this.getView().byId("testSelect").bindItems("/VH_CountrySet", oTemplateN);
                }
            },

            setEditMode: function (bBool) {
                const AppStateModel = this.getOwnerComponent().getModel("AppStateModel");
                AppStateModel.setProperty('/editMode', bBool);
                AppStateModel.refresh(true);
            },

            getEditMode: function (bBool) {
                const AppStateModel = this.getOwnerComponent().getModel("AppStateModel");
                let state = [AppStateModel.getProperty('/editMode')];
                state = [...state]
                return state[0];
            },

            /* There cound be a better way of making this happen using sap.ui.table.Table.extend */
            trackScroll: function () {
                // debugger;

                const oTable = this.getView().byId("prodTab");
                const oModel = this.getOwnerComponent().getModel("ProductsModel");
                const aItems = oTable.getSelectedIndices();
                console.log(`Selected Indices Array: [${aItems}] `);

                const editMode = this.getEditMode()

                let obj;

                // Set all visible rows to uneditable on scroll change.
                for (let i = 0; i < oTable.getVisibleRowCount(); i++) {
                    obj = oModel.getProperty(oTable.getRows()[i].getBindingContext("ProductsModel").getPath());
                    obj.bEditable = false;
                }

                if (editMode) {
                    // Use JSON model local bEditable state prop to track editable status. 2 - way binding efficiently does the job.
                    for (let idx = 0; idx < aItems.length; idx++) {
                        obj = oModel.getProperty('/ProductSet/' + aItems[idx]);
                        obj.bEditable = true;
                    }
                }
                oModel.refresh(true);

            },

            // TODO: on change of input field get context of the row from cell and update isDirty flag
            updateDirty: function (oEvent) {
            },

            // eslint-disable-next-line no-unused-vars
            onEditPress: function (oEvent) {
                this.setEditMode(true);
                this.trackScroll();
            },

            onSelctionChange: function (oEvent) {
                const editMode = this.getEditMode();
                const selection = oEvent.getSource().getSelectedIndices();

                if (selection.length > 0) {
                    this.getView().byId("editProd").setEnabled(true);

                } else {
                    this.getView().byId("editProd").setEnabled(false);
                }

                if (selection.length > 0 && editMode === true) {
                    this.trackScroll();
                }
            },

            onPressSaveEdit: function () {
                // Implement in similar way as cancel
                MessageBox.information("Data is saved");
                this.onPressCancelEdit();
            },

            onPressCancelEdit: function () {
                const oTable = this.getView().byId("prodTab");
                oTable.clearSelection();
                this.trackScroll();
                this.setEditMode(false);
            },

            onScroll: function (oEvent) {
                this.trackScroll();
            },
        });
    });
