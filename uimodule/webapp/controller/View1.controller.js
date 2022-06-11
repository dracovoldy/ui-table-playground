// @ts-nocheck
/* eslint-disable no-var */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], function (Controller, JSONModel) {
    "use strict";
    // this.site = "1002";
    return Controller.extend("oft.fiori.crudBatch.controller.View1", {
        onInit: function () {
            var oODataJSONModelDLSet = new JSONModel();

            this.getOwnerComponent().setModel(oODataJSONModelDLSet, "ProductsModel");

            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/ProductSet", {
                success: function (data, response) {
                    // console.log(data);
                    oODataJSONModelDLSet.setData({ ProductSet: data });
                },
                error: function (err) {},
            });
            // console.log(this.getOwnerComponent().getModel("ProductsModel"));
            // console.log(this.getView().byId("testSelect"));

            var visibilityDataMod = new JSONModel();
            visibilityDataMod.setData({ visibleTrue: true, visibleFalse: false });

            this.getOwnerComponent().setModel(visibilityDataMod, "controlVisibilityModel");
            console.log(this.getOwnerComponent().getModel("controlVisibilityModel"));
            this.site = "9000";
            if (this.site === "1002") {
                var oTemplateN = new sap.ui.core.ListItem({
                    text: "{Waers}",
                    key: "{Waers}",
                });

                this.getView().byId("testSelect").bindItems("/VH_CurrencySet", {
                    template: oTemplateN,
                });
            } else {
                oTemplateN = new sap.ui.core.ListItem({
                    text: "{Landx}",
                    key: "{Landx}",
                });

                this.getView().byId("testSelect").bindItems("/VH_CountrySet", oTemplateN);
            }
        },

        getUpdateHeader: function () {
            this.oModel = this.getOwnerComponent().getModel();
            var that = this;
            return new Promise(function (resolve, reject) {
                that.oModel.read("/ProductSet('AA005')", {
                    success: function (data, response) {
                        // console.log(data);
                        // console.log(response);
                        // console.log(response.headers.etag);
                        var eTAG = response.headers.etag;
                        resolve(response.headers);
                    },
                    error: function (err) {},
                });
            });
        },

        createBatchProductsData: function () {
            this.data1 = {
                ProductID: "AA005",
                TypeCode: "PR",
                Category: "Notebooks",
                Name: "Pri2",
                SupplierID: "0100000046",
                SupplierName: "SAP",
                TaxTarifCode: parseInt("1"),
                MeasureUnit: "EA",
                WeightMeasure: "20",
                WeightUnit: "KG",
                CurrencyCode: "EUR",
                Price: "300",
            };

            var data2 = {
                ProductID: "AA007",
                TypeCode: "PR",
                Category: "Notebooks",
                Name: "PS2",
                SupplierID: "0100000046",
                SupplierName: "SAP",
                TaxTarifCode: parseInt("1"),
                MeasureUnit: "EA",
                WeightMeasure: "20",
                WeightUnit: "KG",
                CurrencyCode: "EUR",
                Price: "250",
            };
            this.oModel = this.getOwnerComponent().getModel();

            var eTAG;
            var that = this;

            // oModel.createEntry("/ProductSet", {properties:data1});

            this.getUpdateHeader().then(function (headerData) {
                console.log(headerData.etag);
                // 	that.oModel.createEntry("/ProductSet('AA005')", {
                // 	"headers":{"If-Match":headerData.etag},
                // 	// "headers":headerData,
                // 	properties: that.data1

                // });

                that.oModel.update("/ProductSet('AA005')", that.data1, {
                    success: function (data, response) {},
                    error: function (err) {},
                });

                // that.oModel.createEntry("/ProductSet", {
                // 	properties: this.data1
                // });

                that.oModel.createEntry("/ProductSet", {
                    properties: data2,
                });

                console.log("test");
                console.log(that.oModel.hasPendingChanges());
                console.log(that.oModel.getPendingChanges());
                that.oModel.submitChanges({
                    success: function (data, response) {},
                    error: function (err) {},
                });
            });
        },

        trackScroll: function (iStart, iVisibleRowCount) {
            if(!this.EditMode) {
				return;
			}
            var oTable = this.getView().byId("prodTab");
            var aItems = oTable.getSelectedIndices();

			for (let i = 0; i < iVisibleRowCount; i++) {
                oTable.getAggregation("rows")[i].getAggregation("cells")[1].getItems()[0].setVisible(true);
                oTable.getAggregation("rows")[i].getAggregation("cells")[1].getItems()[1].setVisible(false);
            }

            for (let idx = 0; idx < aItems.length; idx++) {
                if (aItems[idx] >= iStart && aItems[idx] <= iEnd) {
                    oTable.getAggregation("rows")[aItems[idx] - iStart].getAggregation("cells")[1].getItems()[0].setVisible(false);
                    oTable.getAggregation("rows")[aItems[idx] - iStart].getAggregation("cells")[1].getItems()[1].setVisible(true);
                }
                // else {
                // 	oTable.getAggregation("rows")[i].getAggregation("cells")[1].getItems()[0].setVisible(true);
                // 	oTable.getAggregation("rows")[i].getAggregation("cells")[1].getItems()[1].setVisible(false);
                // }
            }

            
        },

        onEditPress: function () {
			this.EditMode = true;
            var oProdTable = this.getView().byId("prodTab");
            var selectedIndicesArr = oProdTable.getSelectedIndices();
            // var selectedIndicesArr = this.onSelctionChange();
            // this.getSelectedItemBinding(selectedIndicesArr).then(function (data) {
            	selectedIndicesArr.forEach(function (selectedIndex) {
            		oProdTable.getAggregation("rows")[selectedIndex].getAggregation("cells")[1].getItems()[0].setVisible(false);
            		oProdTable.getAggregation("rows")[selectedIndex].getAggregation("cells")[1].getItems()[1].setVisible(true);
            	});
            // });
            this.getView().byId("editSave").setVisible(true);
            this.getView().byId("cancel").setVisible(true);
            this.getView().byId("editProd").setVisible(false);
        },

        getSelectedItemBinding: function (selectedIndicesArr) {
            // console.log(selectedIndicesArr);
            var oProdTable = this.getView().byId("prodTab");
            var selectedContextArr = [];
            return new Promise(function (resolve, reject) {
                selectedIndicesArr.forEach(function (index) {
                    selectedContextArr.push(oProdTable.getContextByIndex(index));
                    // resolve(oProdTable.getAggregation("rows")[index].getBindingContext());
                    // resolve(oProdTable.getContextByIndex(index));
                });

                resolve(selectedContextArr);
            });
        },

        onSelctionChange: function (oEvent) {
            var that = this;
            this.oTable = this.getView().byId("prodTab");
            this.getSelection = this.oTable.getSelectedIndices();
            // console.log(getSelection);

            if (this.getSelection.length > 0) {
                this.getView().byId("editProd").setEnabled(true);
            } else {
                this.getView().byId("editProd").setEnabled(false);
            }

            return this.getSelection;
        },

        onPressSaveEdit: function () {
            this.oProdTable = this.getView().byId("prodTab");
            var selectedIndicesArr = this.onSelctionChange();

            var that = this;

            selectedIndicesArr.forEach(function (selectedIndex) {
                that.oProdTable.getAggregation("rows")[selectedIndex].getAggregation("cells")[1].getItems()[0].setVisible(true);
                that.oProdTable.getAggregation("rows")[selectedIndex].getAggregation("cells")[1].getItems()[1].setVisible(false);
            });
            this.oProdTable.clearSelection();
            // console.log(this.getOwnerComponent().getModel().getPendingChanges());
            this.getOwnerComponent().getModel().submitChanges();
            this.getOwnerComponent().getModel().refresh(true);

            this.getView().byId("editSave").setVisible(false);
            this.getView().byId("cancel").setVisible(false);

            this.getView().byId("editProd").setVisible(true);
        },

        onPressCancelEdit: function () {
			this.EditMode = false;
            this.oProdTable = this.getView().byId("prodTab");
            var oModel = this.getOwnerComponent().getModel();
            // console.log(oModel.getPendingChanges());
            this.getView().byId("editSave").setVisible(false);
            this.getView().byId("cancel").setVisible(false);

            this.getView().byId("editProd").setVisible(true);
            // this.getView().byId("colWithProdNameText").setVisible(true);
            // this.getView().byId("colWithProdNameInp").setVisible(false);

            // var selectedIndicesArr = this.oProdTable.getSelectedIndices();
            var selectedIndicesArr = this.onSelctionChange();
            var that = this;
            selectedIndicesArr.forEach(function (selectedIndex) {
                that.oProdTable.getAggregation("rows")[selectedIndex].getAggregation("cells")[1].getItems()[0].setVisible(true);
                that.oProdTable.getAggregation("rows")[selectedIndex].getAggregation("cells")[1].getItems()[1].setVisible(false);
            });
            this.oProdTable.clearSelection();
            oModel.resetChanges();
            oModel.refresh(true);
        },

        onScroll: function (oEvent) {
            this.trackScroll(oEvent.getParameter("firstVisibleRow"), oEvent.getSource().getVisibleRowCount());
            // var iCount = this.getView().byId("prodTab").getVisibleRowCount() + oEvent.getParameter("firstVisibleRow");
            // // this.getView().byId("prodTab").setVisibleRowCount(iCount);
            // console.log(iCount);
        },
    });
});
