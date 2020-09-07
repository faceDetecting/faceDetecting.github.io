let outputWidth;
let outputHeight;

let faceTracker;
let videoInput;

let imgMask;
let imgFace;
let imgFace2;
let imgFace3;

let selected = -1;


function preload() {
	imgMask = loadImage('mask1.png');
	imgFace1 = loadImage('mask2.png')
	imgFace2 = loadImage('mask3.png')
	imgFace3 = loadImage('mask4.png')
}

function setup() {
	const maxWidth = Math.min(windowWidth, windowHeight);
	pixelDensity(1)
	outputHeight = maxWidth * 0.75;
	outputWidth = maxWidth;

	createCanvas(outputWidth, outputHeight);

	videoInput = createCapture(VIDEO);
	videoInput.size(outputWidth, outputHeight)
	videoInput.hide()

	const sel = createSelect();
	const selList = ['Smile(surprised)', 'Smile(shocked)', 'Smile(sad)', 'Smile(happy)']

	sel.option('Select filter', -1)

	for(let i = 0; i < selList.length; i++) {
		sel.option(selList[i],i)
	}
	sel.changed(applyFilter)

	faceTracker = new clm.tracker();
	faceTracker.init();
	faceTracker.start(videoInput.elt)
}
function applyFilter() {
	selected = this.selected();
}

function draw() {
	image(videoInput, 0, 0, outputWidth, outputHeight);
	switch (selected) {
		case "-1": break;
		case '0': drawMask(imgMask); break;
		case '1': drawMask(imgFace1); break;
		case '2': drawMask(imgFace2); break;
		case '3': drawMask(imgFace3); break;
	}
}

function drawMask(customMask) {
	const positions = faceTracker.getCurrentPosition();
	if(positions !== false) {
		push();
		const wx = Math.abs(positions[13][0] - positions[1][0]) * 2;
		const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 2;
		translate(-wx/2, -wy/2)
		image(customMask, positions[62][0], positions[62][1], wx, wy);
		pop();
	}
}

// function drawFace() {
// 	const positions = faceTracker.getCurrentPosition();
// 	if(positions !== false) {
// 		push();
// 		const wx = Math.abs(positions[13][0] - positions[1][0]) * 2;
// 		const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 2;
// 		translate(-wx/2, -wy/2)
// 		image(imgFace, positions[62][0], positions[62][1], wx, wy);
// 		pop();
// 	}
// }

function windowResize() {
	const maxWidth = Math.min(windowWidth, windowHeight);
	pixelDensity(1)
	outputHeight = maxWidth * 0.75;
	outputWidth = maxWidth;
	resizeCanvas(outputWidth, outputHeight)
}