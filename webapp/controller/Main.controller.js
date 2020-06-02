sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.novonordisk.ibr.BatchDocumentation.controller.Main", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("BatchDocumentation").attachPatternMatched(this._onPathMatched, this);
		},

		dispositionIconFormatter: function (sDispositionCode) {
			switch (sDispositionCode.toLowerCase()) {
			case "active":
				return "sap-icon://message-error";
			case "pending release":
				return "sap-icon://message-warning";
			case "released":
				return "sap-icon://message-success";
			case "released with limitation":
				return "sap-icon://message-success";
			case "rejected":
				return "sap-icon://message-success";
			default:
				return "sap-icon://message-error";
			}
		},

		dispositionColorFormatter: function (sDispositionCode) {

			switch (sDispositionCode.toLowerCase()) {
			case "active":
				return "red";
			case "pending release":
				return "yellow";
			case "released":
				return "green";
			case "released with limitation":
				return "green";
			case "rejected":
				return "green";
			default:
				return "red";
			}
		},

		getBuildingAndPlant: function (sMaterialNumber, sPlant) {
			var oView = this.getView();
			var oModel = oView.getModel("businessRules"); 
			var payload = {
				"RuleServiceId": "a65f1ec2e2eb482984d3f1722589f7b3",
				"Vocabulary": [{
					"PlantAndItem": {
						"ItemNo": sMaterialNumber,
						"PlantNo": sPlant
					}
				}]
			};
			return new Promise(function (resolve, reject) {
				$.ajax({
					type: "POST",
					url: oModel.sServiceUrl,
					headers: {
						"Content-Type": "application/json"
					},
					data: JSON.stringify(payload),
					success: function (result, status, xhr) {
						resolve(result);

					},
					error: function (result, status, xhr) {
						reject($("#result").html(status + result.responseText));
					}
				});
			}.bind(this));

		},
		
		_onPathMatched: function(oEvent) {
			var oView = this.getView();
			var oMappedModel = oView.getModel("mappedData");
			
			var oArguments = oEvent.getParameter("arguments");
			var sPlant = oArguments.plant;
			var sMaterialNumber = oArguments.materialNumber;
			var sBatchNumber = oArguments.batchNumber;
			
			var sPath = "/Batches(plant='" + sPlant + "',materialNumber='" + sMaterialNumber + "',batchNumber='" + sBatchNumber + "')";
			oView.bindElement({
				path: sPath
			});
			
			this.getBuildingAndPlant(sMaterialNumber, sPlant).then(function (response) {
				if (response.Result[0]) {
					var building = response.Result[0].SiteBuilding.Building;
					var site = response.Result[0].SiteBuilding.Site;
					oMappedModel.setProperty("/building", building);
					oMappedModel.setProperty("/site", site);
				}
			});
		
		}
	});
});