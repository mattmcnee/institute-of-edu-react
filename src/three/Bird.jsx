import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import './text.css'

const Bird = ({setTitle}) => {
  setTitle("Edu Homepage");
  const canvasRef = useRef();
  const flappyBirdContainerRef = useRef(null);
  var begun;

  useEffect(() => {

    let questions = [
    {"question": ["What is 4 * 5?", "20", "18", "22", "25"]},
    {"question": ["Solve for x: 2x + 7 = 15", "4", "5", "3", "6"]},
    {"question": ["Calculate the area of a rectangle with length 8 and width 6", "48", "40", "54", "50"]},
    {"question": ["What is the square root of 144?", "12", "10", "14", "16"]},
    {"question": ["Simplify: 3x + 2x - 5", "5x - 5", "6x - 5", "4x - 5", "5x + 5"]},
    {"question": ["Find the value of pi (π) to three decimal places", "3.142", "3.141", "3.140", "3.145"]},
    {"question": ["If a car travels at 60 miles per hour, how far will it travel in 3 hours?", "180", "160", "200", "170"]},
    {"question": ["What is 3 squared?", "9", "6", "12", "15"]},
    {"question": ["Solve for y: 2y - 10 = 14", "12", "10", "16", "14"]},
    {"question": ["Calculate the perimeter of a square with side length 10", "40", "36", "44", "38"]}
]

    // Very disgusting solution to hide double render of labels in react strict mode
    var opacity = 1;
    if(begun == true){
      opacity = 0;
    }
    begun = true;

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
runGame();

function runGame(){
  // Set up Three.js scene
  var scene = new THREE.Scene();
  var width = window.innerWidth;
  var height = window.innerHeight;
  var aspectRatio = width / height;
  var camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 1000);
  camera.position.z = 2;
  var renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvasRef.current  });
  renderer.setSize(width, height);
  const flappyBirdContainer = flappyBirdContainerRef.current;
  flappyBirdContainer.appendChild(renderer.domElement);


  // Update camera and renderer on screen resize
  window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    renderer.setSize(newWidth, newHeight);
    var aspectRatio = newWidth / newHeight;

    camera.left = -aspectRatio;
    camera.right = aspectRatio;
    camera.top = 1;
    camera.bottom = -1;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
  });

  function resetBird(){
    bird.position.y = 0;
    bird.position.x = 0;
  }

  // Bird setup
  var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a852 });
  const bird = new THREE.Sprite(spriteMaterial);
  bird.scale.set(0.1, 0.1, 1);
  scene.add(bird);

  // Game variables
  let gravity = 0.00036; 
  let velocity = 0;
  let jumpStrength = 0.018;

  // Apply jump strength when spacebar is pressed
  window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      velocity = jumpStrength; 
    }
  });

var movingCubes = [];
function resetTowers(){
  movingCubes.splice(0, movingCubes.length);

  for (let row = 0; row < questions.length; row++) {
    movingCubes.push(makeCol(row, 2));
  }

  console.log(movingCubes);
}


const container = document.getElementById('flappy-bird-container');
function makeCol(row, gap){
  const cubeRow = [];
  var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a89e });
  var clearMaterial = new THREE.SpriteMaterial({ color: 0xffffff, transparent: true, opacity: 0});

  const shuffled = shuffleAnswers(questions[row]);
  var xOffset = Math.round(row + 2)*gap;

  for (let i = 0; i < 5; i++) {

    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.style.opacity = `${opacity}`;
    labelDiv.textContent = (i === 0) ?  shuffled.question: shuffled.answers[i];
    container.appendChild(labelDiv);
    var spriteType;

    if(i==0){
      var sprite = new THREE.Sprite(clearMaterial.clone());
      sprite.scale.set(0.2, 0.5, 1);
      sprite.position.setY(0);
      sprite.position.setX(xOffset -1);
      spriteType = "text";
    }else{
      var sprite = new THREE.Sprite(spriteMaterial.clone());
      sprite.scale.set(0.2, 0.5, 1);
      sprite.position.setY(-0.75 + 0.5 * (i-1));
      sprite.position.setX(xOffset);
      spriteType = (shuffled.answers[i] == shuffled.answer) ?  "pass": "fail";
    }
    scene.add(sprite);
    cubeRow.push({
      cube: sprite,
      type: spriteType,
      label: labelDiv,
      passed: false});
  }
  return cubeRow;
}


    function alignHtmlText(sprite, label){
      const position = sprite.position.clone().project(camera);
      const x = (position.x + 1) * window.innerWidth / 2 - label.offsetWidth / 2;
      const y = -(position.y - 1) * window.innerHeight / 2 - label.offsetHeight / 2;
      const errorMargin = 1.2;
      const isInsideScreen = position.x >= -errorMargin && position.x <= errorMargin && position.y >= -errorMargin && position.y <= errorMargin;

      // Apply the calculated position to the HTML element and show/hide it based on visibility
      if (isInsideScreen) {
        label.style.transform = `translate(${x}px, ${y}px)`;
        label.style.display = 'block';
      } else {
        label.style.display = 'none';
      }
    }


function handleCollsion(){
  console.log("Collision detected between cube and bird!");
  for (let row = 0; row < movingCubes.length; row++) {
    for (let i = 0; i < movingCubes[row].length; i++) {
      const cube = movingCubes[row][i].cube;
      scene.remove(cube);
      movingCubes[row][i].label.parentNode.removeChild(movingCubes[row][i].label);
    }
  }
}



// Animation loop
var overlap = false;
resetTowers();
const animate = () => {
  requestAnimationFrame(animate);

  // Update positions of moving cubes
  for (let col = 0; col < movingCubes.length; col++) {
    for (let row = 0; row < movingCubes[col].length; row++) {
      movingCubes[col][row].cube.position.x -= 0.01;

      alignHtmlText(movingCubes[col][row].cube, movingCubes[col][row].label);


      const cube = movingCubes[col][row].cube;
          
      // Reset cube position if it moves out of the scene
      if (cube.position.x < -16) {
        scene.remove(cube);
      }

      if(!movingCubes[col][row].passed && movingCubes[col][row].type == "pass" && cube.position.x < bird.position.x){
        var lowerBound = 0.5 * row - 1.5;
        var upperBound = 0.5 * (row+1) -1.5;
          if(!(bird.position.y > lowerBound && bird.position.y < upperBound)){
            handleCollsion();
            resetTowers();
            resetBird();
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
    velocity = 0; // Reset velocity on ground collision
    // Game over logic
    // console.log('Game Over!');
  }

  renderer.render(scene, camera);

  };

animate();

}




    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  return <div id="flappy-bird-container" ref={flappyBirdContainerRef}></div>;
};

export default Bird;

