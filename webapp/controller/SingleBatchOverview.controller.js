sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Tokenizer',
	'sap/m/Token',
	"com/novonordisk/ibr/BatchDocumentation/model/commonFormatter"
], function (Controller, Filter, FilterOperator, Tokenizer, Token, commonFormatter) {
	"use strict";
	return Controller.extend("com.novonordisk.ibr.BatchDocumentation.controller.SingleBatchOverview", {
		commonFormatter: commonFormatter,
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.novonordisk.ibr.BatchDocumentation.view.SingleBatchOverview
		 */
		onInit: function () {
			var oView = this.getView();
			var oMultiInputPlant = oView.byId("plantMultiIn");
			var oMultiInputBuilding = oView.byId("buildingMultiIn");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.pingAnalytics();
			this._createValidator(oMultiInputBuilding);
			this._createValidator(oMultiInputPlant);
		},
		
		
		pingAnalytics: function(){
			jQuery.sap.includeScript({
	            url : "//cdn.appdynamics.com/adrum/adrum-4.5.17.2890.js"
	        });
	         
			window["adrum-start-time"] = new Date().getTime(); //eslint-disable-line sap-no-global-define
			(function(config){
			    config.appKey = "EC-AAB-HTF";
			    config.adrumExtUrlHttp = "http://cdn.appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.adrumExtUrlHttps = "https://cdn.appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.beaconUrlHttp = "http://fra-col.eum-appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.beaconUrlHttps = "https://fra-col.eum-appdynamics.com"; //eslint-disable-line sap-no-hardcoded-url
			    config.xd = {enable : false}; 
			})(window["adrum-config"] || (window["adrum-config"] = {})); //eslint-disable-line sap-no-global-define
		},
		
		searchTable: function() {
			var aFilter = [];
			var oView = this.getView();
			var oTable = this.byId("sboTable");
			var oBinding = oTable.getBinding("items");
			var sBatchQuery = oView.byId("batchSearchField").getValue();
			var oBatchFilterinfo;
			var sQueryPlant = oView.byId("plantMultiIn").getTokens();
			var sQueryBuilding = oView.byId("buildingMultiIn").getTokens();
			this._createMultiInputFilters(sQueryPlant, aFilter, "plant");
			this._createMultiInputFilters(sQueryBuilding, aFilter, "building");
			if(sBatchQuery) {
				oBatchFilterinfo = {path: "batchNumber", operator: FilterOperator.Contains, value1: sBatchQuery, caseSensitive: false };
				aFilter.push(new Filter(oBatchFilterinfo));
			}
			oBinding.filter(aFilter);
		},
		
		onTokenUpdate: function(oEvent){
			var aTokens;
			var aRemovedTokens;
			if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Removed){
				aRemovedTokens = oEvent.getParameter('removedTokens');
				aTokens = oEvent.getSource().getTokens();
				for( var i = 0; i < aTokens.length; i++){
					if(aTokens[i] === aRemovedTokens[0]){
						oEvent.getSource().removeToken(aRemovedTokens[0]);
					}
				}
			}
			this.searchTable();
		},
		
		navigateToDetails: function (oEvent) {
			var oBindingContext = oEvent.getSource().getBindingContext();
			
			this.getOwnerComponent().getRouter().navTo("BatchDocumentation", {
				plant: oBindingContext.getProperty("plant"),
				materialNumber: oBindingContext.getProperty("materialNumber"),
				batchNumber: oBindingContext.getProperty("batchNumber")
			});
		},
		
		_createValidator: function(oFilter){
			oFilter.addValidator(function(args){
				var text = args.text;
				return new Token({key: text, text: text});
			});
		},
		
		_createMultiInputFilters: function(sQuery, aFilter, sTarget){
			var oFilterInfo;
			if(sQuery){
				sQuery.forEach(function(token){
					oFilterInfo = {path: sTarget, operator: FilterOperator.EQ, value1: token.getKey(), caseSensitive: false }; 
					aFilter.push(new Filter(oFilterInfo));
				});
			}
		}
		
		

	});
});