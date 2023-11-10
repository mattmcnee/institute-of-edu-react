import * as THREE from 'three';

function shuffleAnswers(questionObj) {
    const question = questionObj.question[0];
    const answers = questionObj.question.slice(1);
    const correctAnswer = questionObj.question[1];
    
    // Shuffle the answers (Fisher-Yates algorithm)
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

  const shuffleAnswers = [];
  shuffleAnswers.push(question);
  shuffleAnswers.push(...answers);
    
    return {
        question: question,
        answers: shuffleAnswers,
        answer: correctAnswer
    };
}

function shuffleQuestions(questions) {
  let shuffledQuestions = questions.slice(); // Create a shallow copy of the original array
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]]; // Swap elements
  }
  return shuffledQuestions;
}

// Positions a div at the location of a cube rendered in
// orthographic camera, matching the height and width
function fitLabelToBox(box, label, game){
  const position = box.position.clone().project(game.camera);

  var newWidth = box.scale.x * game.container.clientWidth/2 /game.ratio;
  var newHeight = box.scale.y * game.container.clientHeight/2;

  label.style.width = `${newWidth}px`;
  label.style.maxWidth = `${newWidth}px`;
  label.style.height = `${newHeight}px`;
  label.style.maxHeight = `${newHeight}px`;

  const x = (position.x + 1) * game.container.clientWidth/ 2 - label.offsetWidth / 2;
  const y = (-position.y + 1) * game.container.clientHeight / 2 - label.offsetHeight / 2;
  const errorMargin = 1.5;
  const isInsideScreen = position.x >= -errorMargin && position.x <= errorMargin && position.y >= -errorMargin && position.y <= errorMargin;

  // Apply the calculated position to the HTML element and show/hide it based on visibility
  if (isInsideScreen) {
    label.style.transform = `translate(${x}px, ${y}px)`;
    label.style.display = 'flex';
  } else {
    label.style.display = 'none';
  }
}

// 
// 
//  bird jump game
// 
// 

export function birdJump(game, questions) {

    // Game variables
  let gravity = 0.00036; 
  let velocity = 0;
  let jumpStrength = 0.018;
  let score = 0;
  var movingCubes = [];
  let paused = true;

  var shuffledQuestions = shuffleQuestions(questions);

  const scoreDiv = document.createElement('div');
  scoreDiv.className = 'label';
  const miniScoreDiv = document.createElement('div');
  miniScoreDiv.textContent = "Press space to begin";
  scoreDiv.style.display = 'block';
  scoreDiv.style.transform = `translate(10px, 10px)`;
  scoreDiv.appendChild(miniScoreDiv);
  game.container.appendChild(scoreDiv);

  function resetBird(){
    bird.position.y = 0;
    bird.position.x = -0.7;
  }

  // Bird setup
  var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a852 });
  const bird = new THREE.Sprite(spriteMaterial);
  bird.scale.set(0.1, 0.1, 1);
  resetBird()
  game.scene.add(bird);
  resetTowers();



  // Apply jump strength when spacebar is pressed
  window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      event.preventDefault();
      velocity = jumpStrength; 
      if(paused){
         miniScoreDiv.textContent = "0";
        paused = false;
      }
    }
  });

  function resetTowers(){
    score = 0;
    movingCubes.splice(0, movingCubes.length);

    for (let row = 0; row < questions.length; row++) {
      movingCubes.push(makeCol(row, 2.5));
    }

    console.log(movingCubes);
  }


  function makeCol(row, gap){
    const cubeRow = [];
    var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a89e });
    var clearMaterial = new THREE.SpriteMaterial({ color: 0xffffff, transparent: true, opacity: 0});

    const shuffled = shuffleAnswers(shuffledQuestions[row]);
    var xOffset = Math.round(row + 2)*gap;

    for (let i = 0; i < 5; i++) {

      const labelDiv = document.createElement('div');
      labelDiv.className = 'label';
      const babylabel = document.createElement('div');
      babylabel.textContent = (i === 0) ?  shuffled.question: shuffled.answers[i];
      labelDiv.appendChild(babylabel);
      labelDiv.style.display = 'none';
      game.container.appendChild(labelDiv);
      var spriteType;

      if(i==0){
        var sprite = new THREE.Sprite(clearMaterial.clone());
        sprite.scale.set(1.2, 0.5, 1);
        sprite.position.setY(0);
        sprite.position.setX(xOffset -1);
        spriteType = "text";
      }else{
        var sprite = new THREE.Sprite(clearMaterial.clone());
        sprite.scale.set(0.5, 0.5, 1);
        sprite.position.setY(-0.75 + 0.5 * (i-1));
        sprite.position.setX(xOffset);
        spriteType = (shuffled.answers[i] == shuffled.answer) ?  "pass": "fail";
      }
      fitLabelToBox(sprite, labelDiv, game);
      game.scene.add(sprite);
      cubeRow.push({
        cube: sprite,
        type: spriteType,
        label: labelDiv,
        passed: false});
    }
    return cubeRow;
  }

  function handleCollsion(){
    console.log("Collision detected between cube and bird!");
    for (let row = 0; row < movingCubes.length; row++) {
      for (let i = 0; i < movingCubes[row].length; i++) {
        const cube = movingCubes[row][i].cube;
        game.scene.remove(cube);
        movingCubes[row][i].label.parentNode.removeChild(movingCubes[row][i].label);
      }
    }
    resetTowers();
    resetBird();
    velocity = 0;
    paused = true;
  }



  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    if(paused){
      return;
    }

    // Update positions of moving cubes
    for (let col = 0; col < movingCubes.length; col++) {
      for (let row = 0; row < movingCubes[col].length; row++) {
        movingCubes[col][row].cube.position.x -= 0.01;

        fitLabelToBox(movingCubes[col][row].cube, movingCubes[col][row].label, game);


        const cube = movingCubes[col][row].cube;
            
        // Reset cube position if it moves out of the scene
        if (cube.position.x < -16) {
          game.scene.remove(cube);
        }

        if(!movingCubes[col][row].passed && movingCubes[col][row].type == "pass" && cube.position.x < bird.position.x){
          var lowerBound = 0.5 * row - 1.5;
          var upperBound = 0.5 * (row+1) -1.5;
            if(!(bird.position.y > lowerBound && bird.position.y < upperBound)){
              handleCollsion();
            }else{
              score+=1;
               miniScoreDiv.textContent = score;
            }
            movingCubes[col][row].passed = true;
        }
      }
    }

    // Apply gravity and velocity to the bird's position
    velocity -= gravity; // Apply gravity
    bird.position.y += velocity; // Update bird's position based on velocity


    // Check for collision with ground
    if (bird.position.y < -1) {
      bird.position.y = -1;
      handleCollsion();
    }

    game.renderer.render(game.scene, game.camera);
  };

  animate();
}

// 
// 
//  cube tower game
// 
// 

export function cubeTower(game, questions) {
  var gridSize = 0.1;

  var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a852 });
  var wallMaterial = new THREE.SpriteMaterial({ color: 0x222222 });
  

  // Second cube
  const cube2 = new THREE.Sprite(wallMaterial);
  cube2.scale.set(gridSize, 2, 0.1);
  cube2.position.y = 0;
  cube2.position.x = -12.5*gridSize;
  game.scene.add(cube2);

  // Third cube
  const cube3 = new THREE.Sprite(wallMaterial);
  cube3.scale.set(gridSize, 2, 0.1);
  cube3.position.y = 0;
  cube3.position.x = -3.5*gridSize;
  game.scene.add(cube3);

  var pieceGroup = [];




var positionState = 0;
  createCubeSet();

  animate();



function getSmallPositionsFor() {
  var type = Math.floor(Math.random() * 2);
  switch (type) {
    case 0: // Small L
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [0, gridSize, 0]
      ]; 
    case 1: // Small Line
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [gridSize, 0, 0],
      ];
    default:
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [0, gridSize, 0]
      ]; 
  }
}

function getPositionsFor() {
  var type = Math.floor(Math.random() * 7);
  switch (type) {
    case 0: // Box
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [-gridSize, gridSize, 0],
        [0, gridSize, 0]
      ];
    case 1: // T-shape
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [gridSize, 0, 0],
        [0, gridSize, 0]
      ];
    case 2: // Line
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [gridSize, 0, 0],
        [2 * gridSize, 0, 0]
      ];
    case 3: // L-shape
      return [
        [0, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0],
        [-gridSize, -gridSize, 0]
      ];
    case 4: // L-shape 2
      return [
        [0, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0],
        [gridSize, -gridSize, 0]
      ];
    case 5: // S-shape
      return [
        [-gridSize, 0, 0],
        [0, 0, 0],
        [0, gridSize, 0],
        [gridSize, gridSize, 0]
      ];
    case 6: // Z-shape
      return [
        [gridSize, 0, 0],
        [0, 0, 0],
        [0, gridSize, 0],
        [-gridSize, gridSize, 0]
      ];
    default:
      return [
        [0, 0, 0]
      ];
  }
}

function getLargePositionsFor() {
  var type = Math.floor(Math.random() * 5);
  switch (type) {
    case 0: // Five-block L-shape
      return [
        [0, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0],
        [0, -gridSize*2, 0],
        [-gridSize, -gridSize*2, 0]
      ];
    case 1: // Five-block T-shape
      return [
        [0, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0],
        [0, -gridSize*2, 0],
        [0, -gridSize*2, 0]
      ];
    case 2: // Five-block Line
      return [
        [0, gridSize*2, 0],
        [0, gridSize, 0],
        [0, 0, 0],
        [0, -gridSize, 0],
        [0, -gridSize*2, 0]
      ];

    case 3: // Five-block L-shape 2
      return [
        [0, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0],
        [0, -gridSize*2, 0],
        [gridSize, -gridSize*2, 0]
      ];
    case 4: // Five-block Cross
      return [
        [0, 0, 0],
        [-gridSize, 0, 0],
        [gridSize, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0]
      ];
    default:
      return [
        [0, 0, 0],
        [-gridSize, 0, 0],
        [gridSize, 0, 0],
        [0, gridSize, 0],
        [0, -gridSize, 0]
      ];
  }
}

// Define the function that alternates between states
function usePositionState() {
  switch (positionState) {
    case 0:
      positionState = 1;
      return getSmallPositionsFor();
    case 1:
      positionState = 2;
      return getPositionsFor();
    case 2:
      positionState = 0;
      return getLargePositionsFor();
    default:
      console.log("Invalid state");
      return getPositionsFor();
  }
}




  
function createCubeSet() {
  // Create a group to hold all the cubes
    const lCubeGroup = new THREE.Group();

  var positions = usePositionState();

  console.log(positions);

  for (const position of positions) {
    const cube = new THREE.Sprite(spriteMaterial);
    cube.scale.set(gridSize, gridSize, 1);
    cube.position.set(position[0], position[1], position[2]);
    lCubeGroup.add(cube);
  }

  lCubeGroup.position.set(-8.5*gridSize , 0.95, 0)

  // Add the entire group to the scene
  game.scene.add(lCubeGroup);
  pieceGroup.push(lCubeGroup);
}

// Define an array of positions for the cubes







var lastTime = 0;
var deltaMove = 0;
function animate() {
  requestAnimationFrame(animate);

  // Calculate the time elapsed since the last frame
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;

 
  if(deltaTime > 1000){
    for (let i = 0; i < pieceGroup.length; i++) {
      pieceGroup[i].rotateZ(Math.PI / 2);
      pieceGroup[i].position.y -= gridSize;
    }
    lastTime = currentTime;   
    deltaMove += 1;
  }

  if(deltaMove >= 5){
    createCubeSet();
    deltaMove = 0;
  }


  game.renderer.render(game.scene, game.camera);
}
}
