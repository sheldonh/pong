#pragma strict

var moveUp : KeyCode;
var moveDown : KeyCode;

var speed : float = 10;

var initialSize = 0.8;
var minSize = 0.6;
var maxSize = 1.0;

function ResetSize() {
	transform.localScale.y = initialSize;
}

function Grow() {
	if (transform.localScale.y < maxSize) {
		for (var i = 0; i < 25; i++) {
			yield WaitForEndOfFrame();
			transform.localScale.y += 0.001;
		}
	}
}

function Shrink() {
	if (transform.localScale.y > minSize) {
		for (var i = 0; i < 25; i++) {
			yield WaitForEndOfFrame();
			transform.localScale.y -= 0.001;
		}
	}
}

function Update ()
{
	if (Input.GetKey(moveUp))
	{
		rigidbody2D.velocity.y = speed;
	}
	else if (Input.GetKey(moveDown))
	{
		rigidbody2D.velocity.y = speed * -1;
	}
	else
	{
		rigidbody2D.velocity.y = 0;
	}
	rigidbody2D.velocity.x = 0;
}

function DisablePlayerControls() {
	enabled = false;
}

function EnablePlayerControls() {
	enabled = true;
}

