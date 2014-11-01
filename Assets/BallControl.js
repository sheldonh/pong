#pragma strict

var level : int;
var minSpeed : float;
var minVerticalSpeed : float;
var nudgeFactor : float;
var stopped : boolean;

function Start() {
	stopped = true;
	SetLevel(1);
}

function OnCollisionEnter2D(collision : Collision2D) {
	var ball = rigidbody2D;
	var velX = ball.velocity.x;
	var velY = ball.velocity.y;

	if (collision.collider.tag == "PlayerEdge") {
		Debug.Log("Edge collision");
	} else if (collision.collider.tag == "Player") {
		rigidbody2D.AddForce(collision.collider.GetComponent(PlayerControls).swipeForce);

		audio.pitch = Random.Range(0.9f, 1.1f);
		audio.Play();
	} else if (collision.collider.tag == "ScoreWall") {
		GameManager.Score(collision.collider.transform.name);
	}
}

function StopBall() {
	stopped = true;
	yield WaitForEndOfFrame();
	
	rigidbody2D.velocity.x = 0;
	rigidbody2D.velocity.y = 0;
	rigidbody2D.position.x = 0;
	rigidbody2D.position.y = 0;
	transform.rotation = Quaternion.identity;
}

function ResetBall(wait: float) {
	StopBall();

	if (wait >= 0) {
		yield WaitForSeconds(wait);
		GoBall();
	} else {
		Debug.Log("Ball stopped without resume on request");
	}
}

function GoBall() {
	rigidbody2D.velocity.y = Random.Range(-2f, 2f);
	var randomNumber = Random.Range(0f, 1f);
	if (Random.Range(0f, 1f) <= 0.5) {
		rigidbody2D.velocity.x = minSpeed - Mathf.Abs(rigidbody2D.velocity.y);
	} else {
		rigidbody2D.velocity.x = -minSpeed + Mathf.Abs(rigidbody2D.velocity.y);
	}
		
	stopped = false;
}

function SetLevel(i: int) {
	level = i;
	nudgeFactor = NudgeFactor(i);
	minSpeed = MinSpeed(i);
	Debug.Log("Setting minimum ball speed to " + minSpeed + "(nudge factor " + nudgeFactor + ")");
}

function NudgeFactor(i: int): float {
	if (i == 1) {
		return 0.005;
	} else if (i == 2) {
		return 0.01;
	} else if (i == 3) {
		return 0.025;
	} else {
		return 0.01 * Mathf.Min(i + 1, 10);
	}
}

function MinSpeed(i: int): float {
	if (i == 1) {
		return 15.0;
	} else if (i == 2) {
		return 16.0;
	} else if (i == 3) {
		return 17.0;
	} else if (i == 4) {
		return 18.0;
	} else if (i == 5) {
		return 18.6;
	} else if (i == 6) {
		return 19.2;
	} else if (i == 7) {
		return 19.75;
	} else if (i == 8) {
		return 20.25;
	} else {
		return 20.75;
	}
}