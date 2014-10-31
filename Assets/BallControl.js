#pragma strict

var minSpeed : float;
var minVerticalSpeed : float;
var stopped : boolean;

function Start() {
	stopped = true;
}

function Update() {
	if (!stopped) {
		var xVel : float = rigidbody2D.velocity.x;
		if (xVel < (minSpeed * 0.95) && xVel > (minSpeed * -0.95) && xVel != 0) {
			if (xVel > 0) {
				rigidbody2D.velocity.x = minSpeed;
			} else {
				rigidbody2D.velocity.x = -minSpeed;
			}
			Debug.Log("Adjusted ball X velocity from " + xVel + " to " + rigidbody2D.velocity.x);
		}

		var spin = rigidbody2D.velocity.y > 0 ? Vector3.forward : Vector3.back;
		transform.Rotate(spin, Time.deltaTime * (180 / minVerticalSpeed) * Mathf.Abs(rigidbody2D.velocity.y));
	}
}

function OnCollisionEnter2D (collision : Collision2D) {
	var ball = rigidbody2D;
	var velY = ball.velocity.y;
	var velX = ball.velocity.x;

	if (collision.collider.tag == "Player") {
		if (stopped) {
			Debug.Log("Gotcha! Hit a player while supposedly stopped!");
		} else {
			if (collision.collider.rigidbody2D.velocity.y != 0) {
				velY = velY/2 + collision.collider.rigidbody2D.velocity.y/3;
				rigidbody2D.velocity.y = velY;
			} else {
				rigidbody2D.velocity.y = velY * 0.8;
			}
			
			audio.pitch = Random.Range(0.9f, 1.1f);
			audio.Play();
		}
	} else if (collision.collider.tag == "ScoreWall") {
		GameManager.Score(collision.collider.transform.name);
	} else if (collision.collider.tag == "NonScoreWall") {
		if (stopped) {
			Debug.Log("Gotcha! Hit a non-score wall while supposedly stopped!");
		} else {
			if (ball.velocity.y > -minVerticalSpeed && ball.velocity.y < minVerticalSpeed) {
				if (ball.velocity.y > 0) {
					ball.velocity.y = minVerticalSpeed;
				} else {
					ball.velocity.y = -minVerticalSpeed;
				}
				Debug.Log("Adjusted ball Y velocity from " + velY + " to " + ball.velocity.y);
			}
			// I *really* need the current difficulty level here!!!
			// (I want approx 2.5% - 10% nudge factor from level 1 to 9, at about 5% at level 4
			var nudgeFactor: float = Mathf.Sqrt(minSpeed) / (35750000 / Mathf.Pow(minSpeed, 4));
	 		ball.velocity.x += Mathf.Sign(ball.velocity.x) * nudgeFactor * minSpeed;
			Debug.Log("Adjusted ball X velocity from " + velX + " to " + ball.velocity.x);
		}
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
		GoBall(minSpeed);
	} else {
		Debug.Log("Ball stopped without resume on request");
	}
}

function GoBall(newMinSpeed: float) {
	minSpeed = newMinSpeed;
	
	var randomNumber = Random.Range(0f, 1f);
	if (Random.Range(0f, 1f) <= 0.5) {
		rigidbody2D.velocity.x = minSpeed;
	} else {
		rigidbody2D.velocity.x = -minSpeed;
	}
	rigidbody2D.velocity.y = Random.Range(-2f, 2f);
	
	stopped = false;
}