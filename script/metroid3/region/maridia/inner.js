// Maridia: Inner
function canEnterMaridiaInner() {
	return canEnterMaridiaOuter() && (canSwimSM() || (canGrappleSM() && trackerData.items.hijump && trackerData.items.ice));
}
chests.metroid3[73] = {
	name: "Super Missile (yellow Maridia) (2 items)",
	x: "637",
	y: "457",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[74] = {
	name: "Missile (yellow Maridia false wall)",
	x: "781",
	y: "457",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[75] = {
	name: "Plasma Beam",
	x: "925",
	y: "385",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canDefeatDraygon() && (canDashSM() || ((trackerData.items.charge || trackerData.items.screw) && (canFlySM() || trackerData.items.hijump)))) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[76] = {
	name: "Missile (left Maridia sand pit room)",
	x: "781",
	y: "601",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[77] = {
	name: "Reserve Tank, Maridia",
	x: "799",
	y: "601",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[78] = {
	name: "Missile (right Maridia sand pit room)",
	x: "835",
	y: "601",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[79] = {
	name: "Power Bomb (right Maridia sand pit room) " + mini("gravity"),
	x: "853",
	y: "601",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canSwimSM()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[80] = {
	name: "Missile (pink Maridia) " + mini("gravity") + mini("speed"),
	x: "853",
	y: "511",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canSwimSM() && canDashSM()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[81] = {
	name: "Super Missile (pink Maridia) " + mini("gravity") + mini("speed"),
	x: "871",
	y: "511",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canSwimSM() && canDashSM()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[82] = {
	name: "Spring Ball " + mini("gravity") + mini("grappling"),
	x: "1015",
	y: "619",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canSwimSM() && canGrappleSM() && (canFlySM() || trackerData.items.hijump)) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[83] = {
	name: "Missile (Draygon)",
	x: "1177",
	y: "475",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canDefeatBotwoon()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[84] = {
	name: "Energy Tank, Botwoon",
	x: "943",
	y: "493",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canDefeatBotwoon()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
chests.metroid3[85] = {
	name: "Space Jump",
	x: "1105",
	y: "529",
	isOpened: false,
	isAvailable: function () {
		const availability = new Availability();
		if(canEnterMaridiaInner() && canDefeatDraygon()) {
			availability.tourneyLogic = "available";
		}
		return availability;
	}
};
