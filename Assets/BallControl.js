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

function Update() {
	if (!stopped) {
		var velX : float = rigidbody2D.velocity.x;
		var velY : float = rigidbody2D.velocity.y;
		var velT : float = Mathf.Abs(velX) + Mathf.Abs(velY);
		if (velT < (minSpeed * 0.95) && velT != 0) {
			rigidbody2D.velocity.x = Mathf.Sign(velX) * (minSpeed - Mathf.Abs(velY));
			Debug.Log("Adjusted ball X velocity from " + velX + " to " + rigidbody2D.velocity.x);
		}

		var spin = rigidbody2D.velocity.y > 0 ? Vector3.forward : Vector3.back;
		transform.Rotate(spin, Time.deltaTime * (180 / minVerticalSpeed) * Mathf.Abs(rigidbody2D.velocity.y));
	}
}

function OnCollisionEnter2D(collision : Collision2D) {
	var ball = rigidbody2D;
	var velX = ball.velocity.x;
	var velY = ball.velocity.y;

	Debug.Log("Collided with velocity x " + velX + " y " + velY);
	if (collision.collider.tag == "PlayerEdge") {
		Debug.Log("Edge collision");
	} else if (collision.collider.tag == "Player") {
		var d : float;
		if (collision.collider.rigidbody2D.velocity.y != 0) {
			var p : float = velY/2 + collision.collider.rigidbody2D.velocity.y/3;
			d = Mathf.Abs(p - velY);
			rigidbody2D.velocity.y = p;
//			rigidbody2D.velocity.x -= Mathf.Sign(velX) * d;
//			Debug.Log("Swiped " + d + " of x " + velX + " y " + velY + "   ->   x " + rigidbody2D.velocity.x + " y " + rigidbody2D.velocity.y);
		} else {
			d = Mathf.Abs(velY * 0.2);
			rigidbody2D.velocity.y -= Mathf.Sign(velY) * d;
			rigidbody2D.velocity.x += Mathf.Sign(velX) * d;
			Debug.Log("Flattened " + d + " of x " + velX + " y " + velY + "   ->   x " + rigidbody2D.velocity.x + " y " + rigidbody2D.velocity.y);
		}
		
		audio.pitch = Random.Range(0.9f, 1.1f);
		audio.Play();
	} else if (collision.collider.tag == "NonScoreWall") {
		if (ball.velocity.y > -minVerticalSpeed && ball.velocity.y < minVerticalSpeed) {
			// TODO Don't just add minVerticalSpeed; take it from velX
			if (ball.velocity.y > 0) {
				ball.velocity.y = minVerticalSpeed;
			} else {
				ball.velocity.y = -minVerticalSpeed;
			}
			Debug.Log("Nudged ball Y velocity from " + velY + " to " + ball.velocity.y);
		}
 		ball.velocity.x += Mathf.Sign(ball.velocity.x) * nudgeFactor * minSpeed;
		Debug.Log("Nudged ball X velocity from " + velX + " to " + ball.velocity.x);
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