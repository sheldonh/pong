#pragma strict

var menuKey : KeyCode;

var gameManager : GameObject;
var menuCanvas : GameObject;

function Start() {
	menuCanvas = GameObject.Find("MenuCanvas");
	gameManager = GameObject.Find("_GM");
}

function Update() {
	if (Input.GetKeyUp(menuKey)) {
		Toggle();
	}
}

function Toggle() {
	if (menuCanvas.activeInHierarchy) {
		Screen.showCursor = false;
		menuCanvas.SetActive(false);
		Time.timeScale = 1;
	} else {
		Time.timeScale = 0;
		menuCanvas.SetActive(true);
		Screen.showCursor = true;
	}
}

function LaunchGame1P() {
	Toggle();
	gameManager.SendMessage("LaunchGame1P");
}

function LaunchGame2P() {
	Toggle();
	gameManager.SendMessage("LaunchGame2P");
}

function QuitGame() {
	Application.Quit();
}