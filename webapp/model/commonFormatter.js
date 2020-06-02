sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/ValueState"
], function(DateFormat, ValueState) {
	"use strict";
	
	return {
		formatDate: function (sDate) {
			if (!sDate) {
				return "";
			}
			//Standard OData date format fulfills the requirements, so the usage of targetType: 'any' prevents the automatic formatting already.
			//Nevertheless the formatter gives a single point of formatting in case it has to be changed later.
			return sDate;
		},
		
		formatDeviationPhaseToState: function(sPhase) {
			if (!sPhase) {
				return ValueState.None;
			}
			return sPhase === "Completed" ? ValueState.Success : ValueState.Error;
		},
		
		formatDeviationPhaseToIcon: function(sPhase) {
			if (!sPhase) {
				return "";
			}
			return sPhase === "Completed" ? "sap-icon://status-positive" : "sap-icon://status-negative";
		}
	};
});