sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel,  Fragment) {
	"use strict";

	return Controller.extend("project1.controller.team", {

		onInit: function () {

			this.oSettingsModel = new JSONModel();
			this.oSettingsModel.setData({
				"viewPortPercentWidth": 100
			});
			this.getView().setModel(this.oSettingsModel);

			this.oGroupModel = new JSONModel();
			this.getView().setModel(this.oGroupModel, "groupedAvatars");

			
		},

		onAfterRendering: function () {
			this._oSlider = this.getView().byId("slider");
		},

		onSliderMoved: function () {
			var iValue = this._oSlider.getModel().getProperty("/viewPortPercentWidth");

			this.byId("vl1").setWidth(iValue + "%");
		},


		onGroupPress: function (oEvent) {
			var iItemsCount = this.oModel.getProperty("/totalCount"),
				sGroupType = oEvent.getParameter("groupType"),
				iAvatarsDisplayed = oEvent.getParameter("avatarsDisplayed"),
				oView = this.getView(),
				oEventSource,
				sTitle;

				if (sGroupType === "Group") {
					oEventSource = oEvent.getSource();
				} else {
					oEventSource = oEvent.getParameter("eventSource");
				}

			

			sTitle = "Team Members (" + iItemsCount + ")";
			this.oSettingsModel.setData({
				"popoverTitle": sTitle
			});

			if (!this._pGroupPopover) {
				this._pGroupPopover = Fragment.load({
					id: oView.getId(),
					name: "project1.view.fragment.teampop",
					controller: this
				}).then(function(oGroupPopover) {
					oView.addDependent(oGroupPopover);
					return oGroupPopover;
				});
			}
			this._pGroupPopover.then(function(oGroupPopover){
				var oNavCon = this.byId("navCon"),
					oMainPage = this.byId("main"),
					aContent = this._getContent(sGroupType, iAvatarsDisplayed),
					iNumberOfAvatarsInPopover = aContent.length;

				// Every cell has 68px height + 40px from Popover's header and 8px top margin of the VerticalColumnLayout
				this._sGroupPopoverHeight = (Math.floor(iNumberOfAvatarsInPopover / 2) + iNumberOfAvatarsInPopover % 2) * 68 + 48 + "px";
				this.oGroupModel.setData(aContent);
				oGroupPopover.setContentHeight(this._sGroupPopoverHeight);
				oNavCon.to(oMainPage);
				oGroupPopover.openBy(oEventSource).addStyleClass("sapFAvatarGroupPopover");
			}.bind(this));
		}

		// onAvatarPress: function (oEvent) {
		// 	var oBindingInfo = oEvent.getSource().getBindingContext("groupedAvatars").getObject(),
		// 		oNavCon = this.byId("navCon"),
		// 		oDetailPage = this.byId("detail"),
		// 		oGroupPopover = this.byId("groupPopover");

		// 	oGroupPopover.setContentHeight("375px");
		// 	oGroupPopover.setContentWidth("450px");
		// 	this.oIndividualModel.setData(oBindingInfo);
		// 	oNavCon.to(oDetailPage);
		// 	oGroupPopover.focus();
		// },

		// _getContent: function (sGroupType, iAvatarsDisplayed) {
		// 	var	aAllAvatars = this._oAvatarGroup.getItems(),
		// 		aAvatarsToShowInPopover,
		// 		oBindingInfo;

		// 	if (sGroupType === "Individual") {
		// 		aAvatarsToShowInPopover = aAllAvatars.slice(iAvatarsDisplayed);
		// 	} else {
		// 		aAvatarsToShowInPopover = aAllAvatars;
		// 	}

		// 	return aAvatarsToShowInPopover.map(function (oAvatarGroupItem) {
		// 		oBindingInfo = oAvatarGroupItem.getBindingContext("items").getObject();
		// 		return this._getAvatarModel(oBindingInfo, oAvatarGroupItem);
		// 	}, this);
		// },

		// _getAvatarModel: function (oBindingInfo, oAvatarGroupItem) {
		// 	return {
		// 		src: oBindingInfo.src,
		// 		initials: oBindingInfo.initials,
		// 		fallbackIcon: oBindingInfo.fallbackIcon,
		// 		backgroundColor: oAvatarGroupItem.getAvatarColor(),
		// 		name: oBindingInfo.name,
		// 		jobPosition: oBindingInfo.jobPosition,
		// 		mobile: oBindingInfo.mobile,
		// 		phone: oBindingInfo.phone,
		// 		email: oBindingInfo.email
		// 	};
		// },

		// onNavBack: function () {
		// 	var oNavCon = this.byId("navCon");

		// 	this.byId("groupPopover").setContentHeight(this._sGroupPopoverHeight);
		// 	oNavCon.back();
		// }
	});
});