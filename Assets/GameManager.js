#pragma strict

static var startingLevel : int = 1;
static var levelToWin : int = 10;
static var scoreToWin : int = 9;

static var playerScore01 : int = 0;
static var playerScore02 : int = 0;

static var theBall : Transform;
static var player01 : Transform;
static var player02 : Transform;
static var singlePlayer : boolean;
static var gameManager: GameManager;
static var menu: GameObject;
static var level: GameObject;
static var bonusAudio: AudioSource;

var scoreText1P : UI.Text;
var scoreText2P : UI.Text;
var messageText : UI.Text;

function Start() {
	theBall = GameObject.FindGameObjectWithTag("Ball").transform;
	player01 = GameObject.Find("Player01").transform;
	player02 = GameObject.Find("Player02").transform;
	scoreText1P = GameObject.Find("ScoreText1P").GetComponent(UI.Text);
	scoreText2P = GameObject.Find("ScoreText2P").GetComponent(UI.Text);
	messageText = GameObject.Find("MessageText").GetComponent(UI.Text);
	level = GameObject.Find("LevelText");
	gameManager = GetComponent(GameManager);
	menu = GameObject.Find("Menu");
	bonusAudio = GameObject.Find("rightWall").audio;
}

static function Score(wallName : String) {
	theBall.gameObject.SendMessage("StopBall");

	if (wallName == "rightWall") {
		playerScore01 += 1;
		player01.gameObject.SendMessage("Shrink");
		player02.gameObject.SendMessage("Grow");
	} else if (wallName == "leftWall") {
		playerScore02 += 1;
		player02.gameObject.SendMessage("Shrink");
		player01.gameObject.SendMessage("Grow");
	}
	
	if (singlePlayer) {
		if (playerScore01 == scoreToWin) {
			for (var i = 0; i < 5; i++) {
				bonusAudio.pitch = 0.9f + 0.1 * i;
				bonusAudio.Play();
				yield WaitForSeconds(0.150);
			}
			yield WaitForSeconds(0.5);
			gameManager.gameObject.SendMessage("LaunchLevel", Level.level + 1);
		} else if (playerScore02 == scoreToWin) {
			for (var d = 9; d > 0; d--) {
				bonusAudio.pitch = 0.2f + 0.1 * d;
				bonusAudio.Play();
				yield WaitForSeconds(0.150);
			}
			yield WaitForSeconds(0.5);
			menu.SendMessage("Toggle");
		} else {
			bonusAudio.pitch = Random.Range(0.9f, 1.1f);
			bonusAudio.Play();
			theBall.gameObject.SendMessage("ResetBall", 0.6f);
		}
	} else {
		if (playerScore01 == scoreToWin || playerScore02 == scoreToWin) {
			for (var p = 0; p < 5; p++) {
				bonusAudio.pitch = 0.9f + 0.1 * p;
				bonusAudio.Play();
				yield WaitForSeconds(0.150);
			}
			yield WaitForSeconds(0.5);
			menu.SendMessage("Toggle");
		} else {
			bonusAudio.pitch = Random.Range(0.9f, 1.1f);
			bonusAudio.Play();
			theBall.gameObject.SendMessage("ResetBall", 0.6f);
		}
	}
}

function OnGUI() {
	scoreText1P.text = "" + playerScore01;	
	scoreText2P.text = "" + playerScore02;
}

function LaunchGame1P() {
	singlePlayer = true;
	player02.gameObject.SendMessage("DisablePlayerControls");
	player02.gameObject.SendMessage("EnableComputerControls");
	LaunchLevel(startingLevel);
}

function LaunchGame2P() {
	singlePlayer = false;
	player02.gameObject.SendMessage("DisableComputerControls");
	player02.gameObject.SendMessage("EnablePlayerControls");
	LaunchLevel(startingLevel);
}

function LaunchLevel(difficultyLevel: int) {
	if (difficultyLevel == levelToWin) {
		Debug.Log("OMG! Clocked!");
		messageText.text = "1P IS TEH WINNER!";
		yield WaitForSeconds(4.0);
		messageText.CrossFadeAlpha(0.0, 4.0, true);
		yield WaitForSeconds(4.0);
		messageText.text = "";
		messageText.CrossFadeAlpha(1.0, 0.0, true);
		menu.SendMessage("Toggle");
	} else {
		playerScore01 = 0;
		playerScore02 = 0;
		theBall.gameObject.SendMessage("SetLevel", difficultyLevel);
		if (singlePlayer) {
			level.SendMessage("SetLevel", difficultyLevel);
			player02.gameObject.SendMessage("SetLevel", difficultyLevel);
		} else {
			level.SendMessage("SetLevel", 0);
		}
		player01.gameObject.SendMessage("ResetSize");
		player02.gameObject.SendMessage("ResetSize");
		player01.position.y = 0;
		player02.position.y = 0;
		
		yield WaitForSeconds(2.0);
		theBall.gameObject.SendMessage("GoBall");
	}
}

function QuitGame() {
	Application.Quit();
}