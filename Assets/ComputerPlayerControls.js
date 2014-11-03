#pragma strict

var speed : float = 10;

var level : int = 1;
var close = 4.0;
var far = 10.0;

var theBall : Transform;

var playerControls : PlayerControls;

function SetLevel(i: int) {
	Debug.Log("Setting computer player level " + i);
	level = i;
	if (level == 1) {
		close = 2.0;
		far = 6.0;
	} else if (level == 2) {
		close = 3.0;
		far = 7.5;
	} else if (level == 3) {
		close = 4.0;
		far = 10.0;
	} else if (level == 4) {
		close = 4.0;
		far = 11.0;
	} else if (level == 5) {
		close = 4.25;
		far = 12.0;
	} else if (level == 6) {
		close = 4.50;
		far = 13.0;
	} else if (level == 7) {
		close = 4.75;
		far = 14.0;
	} else if (level == 8) {
		close = 5.0;
		far = 15.0;
	} else {
		close = 5.25;
		far = 16.25;
	}
}

function DisableComputerControls() {
	enabled = false;
}

function EnableComputerControls() {
	enabled = true;
}

function Start() {
	theBall = GameObject.FindGameObjectWithTag("Ball").transform;
	playerControls = GetComponent(PlayerControls);
	level = 1;
}

function Update ()
{
	playerControls.Update();

	if ((BallIsApproaching() && BallIsNotFar()) || BallIsClose()) {
		var deltaY = theBall.position.y - transform.position.y;
		// Why does this magic number 100 give me the <10 speeds I want when deltaY is small? What is the relationship between velocity and 1 unit?
		rigidbody2D.velocity.y = Mathf.Sign(deltaY) * Mathf.Min(speed, Time.deltaTime * speed * 100 * Mathf.Abs(deltaY));
	} else {
		rigidbody2D.velocity.y = 0;
		rigidbody2D.velocity.x = 0;
	}
	playerControls.swipeForce = rigidbody2D.velocity;
}

function BallIsApproaching() {
	return theBall.gameObject.rigidbody2D.velocity.x > 0.0;
}

function BallIsClose() {
	return transform.position.x - theBall.position.x < close;
}

function BallIsNotFar() {
	return transform.position.x - theBall.position.x < far;
}