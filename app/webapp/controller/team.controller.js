sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
	

], function (Controller, JSONModel,  Fragment, MessageToast, DateFormat) {
	"use strict";


	return Controller.extend("project1.controller.team", {



		onInit: function () {

			this.getView().setModel(this.oModel, "team");
			this.oSettingsModel = new JSONModel();
			this.oSettingsModel.setData({
				"viewPortPercentWidth": 100
			});
			this.getView().setModel(this.oSettingsModel);

			this.oIndividualModel = new JSONModel();
			this.getView().setModel(this.oIndividualModel, "personData");

			this.oGroupModel = new JSONModel();
			this.getView().setModel(this.oGroupModel, "groupedAvatars");

			
		},

		onAfterRendering: function () {
			this._oAvatarGroup = this.getView().byId("avatarGroup");
			this._oSlider = this.getView().byId("slider");
		},

		onSliderMoved: function () {
			var iValue = this._oSlider.getModel().getProperty("/viewPortPercentWidth");

			this.byId("vl1").setWidth(iValue + "%");
		},


		onGroupPress: function (oEvent) {
			var iItemsCount = this.getView().getModel('team').getProperty("/totalCount"),
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
		},

		onAvatarPress: function (oEvent) {
			var oBindingInfo = oEvent.getSource().getBindingContext("team").getObject(),
				oNavCon = this.byId("navCon"),
				oDetailPage = this.byId("detail"),
				oGroupPopover = this.byId("groupPopover");

			oGroupPopover.setContentHeight("375px");
			oGroupPopover.setContentWidth("450px");
			this.oIndividualModel.setData(oBindingInfo);
			oNavCon.to(oDetailPage);
			oGroupPopover.focus();
		},

		_getContent: function (sGroupType, iAvatarsDisplayed) {
			var	aAllAvatars = this._oAvatarGroup.getItems(),
				aAvatarsToShowInPopover,
				oBindingInfo;

			if (sGroupType === "Individual") {
				aAvatarsToShowInPopover = aAllAvatars.slice(iAvatarsDisplayed);
			} else {
				aAvatarsToShowInPopover = aAllAvatars;
			}

			return aAvatarsToShowInPopover.map(function (oAvatarGroupItem) {
				oBindingInfo = oAvatarGroupItem.getBindingContext("team").getObject();
				return this._getAvatarModel(oBindingInfo, oAvatarGroupItem);
			}, this);
		},

		_getAvatarModel: function (oBindingInfo, oAvatarGroupItem) {
			return {
				src: oBindingInfo.src,
				name: oBindingInfo.name,
				jobPosition: oBindingInfo.jobPosition,
				backgroundColor: oAvatarGroupItem.getAvatarColor(),
				mobile: oBindingInfo.mobile,
				email: oBindingInfo.email
			};
		},

		onNavBack: function () {
			var oNavCon = this.byId("navCon");

			this.byId("groupPopover").setContentHeight(this._sGroupPopoverHeight);
			oNavCon.back();
		},

		onBack: function() {
			sap.ui.controller("project1.controller.App").onSelected("mainhome_display");
			this.getOwnerComponent().getRouter().navTo("home");
		},

		onfeed: function() {
			this.getOwnerComponent().getRouter().navTo("feed");
		},

		onPost: function(oEvent) {
			var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
			var oDate = new Date();
			var sDate = oFormat.format(oDate);
			// create new entry
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				Author: "누군지 안알랴줌~",
				AuthorPicUrl: "image/1.PNG",
				Type: "Reply",
				Date: "" + sDate,
				Text: sValue,
				Action : [{
					Icon : "sap-icon://delete",
					Key :  "delete",
					Text : 'Delete'
				}]
			};

			// update model
			var oModel = this.getView().getModel("feed");
			var aEntries = oModel.getData().EntryCollection;
			aEntries.unshift(oEntry);
			oModel.setData({
				EntryCollection: aEntries
			});
		},

		onSenderPress: function(oEvent) {
			MessageToast.show("Clicked on Link: " + oEvent.getSource().getSender());
		},

		onIconPress: function(oEvent) {
			MessageToast.show("Clicked on Image: " + oEvent.getSource().getSender());
		},

		onActionPressed: function(oEvent) {

			console.log(oEvent.getSource().getKey());
			var sAction = oEvent.getSource().getKey();

			console.log(oEvent.getParameter("item"));


			if (sAction === "delete") {
				this.removeItem(oEvent.getParameter("item"));
				MessageToast.show("Item deleted");
			}
		},

		removeItem: function(oFeedListItem) {

			console.log(oFeedListItem.getBindingContext("feed").getPath());
			var sFeedListItemBindingPath = oFeedListItem.getBindingContext("feed").getPath();
			console.log(sFeedListItemBindingPath.split("/").pop());			
			var sFeedListItemIndex = sFeedListItemBindingPath.split("/").pop();
			console.log(this.getView().getModel("feed").getProperty("/EntryCollection"));
			var aFeedCollection = this.getView().getModel("feed").getProperty("/EntryCollection");

			aFeedCollection.splice(sFeedListItemIndex, 1);
			this.getView().getModel("feed").setProperty("/EntryCollection", aFeedCollection);


			
		}
		


	});


});