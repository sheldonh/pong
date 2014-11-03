#pragma strict

var moveUp : KeyCode;
var moveDown : KeyCode;

var speed : float = 10;

var initialSize = 0.8;
var minSize = 0.6;
var maxSize = 1.0;
var fixedX: float;

var topWall : GameObject;
var bottomWall : GameObject;

var swipeForce : Vector2 = new Vector2(0, 0);

function Start() {
	topWall = GameObject.Find("TopWall");
	bottomWall = GameObject.Find("BottomWall");
	fixedX = transform.position.x;
}

function Update() {
	rigidbody2D.velocity.x = 0;
	transform.position.x = fixedX;
}

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

function FixedUpdate ()
{
	var maxY = topWall.collider2D.bounds.min.y;
	var minY = bottomWall.collider2D.bounds.max.y;
	var pos : Vector2 = transform.position;
		
	if (Input.GetKey(moveUp)) {
//		pos.y = Mathf.Clamp(pos.y + (speed * Time.deltaTime), minY, maxY);
//		swipeForce.y = speed;
		rigidbody2D.velocity.y = 10;
	} else if (Input.GetKey(moveDown)) {
//		pos.y = Mathf.Clamp(pos.y - (speed * Time.deltaTime), minY, maxY);
//		swipeForce.y = -speed;
		rigidbody2D.velocity.y = -10;
	} else {
//		swipeForce.y = 0;
		rigidbody2D.velocity.y = 0;
	}
	transform.position = pos;	
}

function DisablePlayerControls() {
	enabled = false;
}

function EnablePlayerControls() {
	enabled = true;
}

