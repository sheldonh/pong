#pragma strict

static var level : int = 0;

var levelText : UI.Text;

function Start () {
	level = 0;
	levelText = GameObject.Find("LevelText").GetComponent(UI.Text);
}

function SetLevel(i: int) {
	level = i;
}

function OnGUI() {
	if (level > 0) {
		levelText.text = "LEVEL " + level;
	} else {
		levelText.text = "";
	}
}
