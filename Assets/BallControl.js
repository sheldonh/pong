#pragma strict

var level : int;

var speed : float;
var stopped : boolean;

function Start() {
	stopped = true;
	SetLevel(1);
}

function Update() {
	FixSpeed();
}

function OnCollisionEnter2D(collision : Collision2D) {
	var ball = rigidbody2D;
	var velX = ball.velocity.x;
	var velY = ball.velocity.y;

	if (collision.collider.tag == "Player") {
		var player = collision.collider.GetComponent(PlayerControls);
		if (player.swipeForce.magnitude > 0) {
			ball.velocity.y = ball.velocity.y / 2 + collision.collider.GetComponent(PlayerControls).swipeForce.y / 3;
			Debug.Log("Swiped");
		} else {
			ball.velocity.y *= 0.8;
			Debug.Log("Flattened");
		}
		speed += 0.1;

		audio.pitch = Random.Range(0.9f, 1.1f);
		audio.Play();
	} else if (collision.collider.tag == "NonScoreWall") {
		if (Mathf.Abs(ball.velocity.y) < 1) {
			ball.velocity.y -= Mathf.Sign(ball.position.y) * 1;
			Debug.Log("Nudged");
		}
	} else if (collision.collider.tag == "ScoreWall") {
		GameManager.Score(collision.collider.transform.name);
		return;
	}
	FixSpeed();
}

function StopBall() {
	stopped = true;
	speed = 0.0;
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
	speed = LevelSpeed();
	rigidbody2D.velocity.y = Random.Range(-2f, 2f);
	if (Random.Range(0f, 1f) <= 0.5) {
		rigidbody2D.velocity.x = speed;
	} else {
		rigidbody2D.velocity.x = -speed;
	}
	FixSpeed();
		
	stopped = false;
}

function FixSpeed() {
	rigidbody2D.velocity = rigidbody2D.velocity.normalized * speed;
}

function SetLevel(i: int) {
	level = i;
}

function LevelSpeed(): float {
	if (level == 1) {
		return 15.0;
	} else if (level == 2) {
		return 16.0;
	} else if (level == 3) {
		return 17.0;
	} else if (level == 4) {
		return 18.0;
	} else if (level == 5) {
		return 18.6;
	} else if (level == 6) {
		return 19.2;
	} else if (level == 7) {
		return 19.75;
	} else if (level == 8) {
		return 20.25;
	} else {
		return 20.75;
	}
}