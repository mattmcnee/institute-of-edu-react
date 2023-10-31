import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

const Bird = ({setTitle}) => {
  setTitle("Edu Homepage");
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
        question: shuffleAnswers,
        answer: correctAnswer
    };
}

console.log("hello")
runGame();

function runGame(){
  // Set up Three.js scene
const scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,   // Left
    window.innerWidth / 2,    // Right
    window.innerHeight / 2,   // Top
    window.innerHeight / -2,  // Bottom
    -1,                       // Near
    100                         // Far
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('flappy-bird-container').appendChild(renderer.domElement);


window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // Update renderer size
  renderer.setSize(newWidth, newHeight);

  // Update camera's left, right, top, and bottom values to match the initial setup
  camera.left = newWidth / -2;
  camera.right = newWidth / 2;
  camera.top = newHeight / 2;
  camera.bottom = newHeight / -2;

  // Update camera aspect ratio and projection matrix
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

function resetBird(){
  bird.position.y = 0;
  bird.position.x = -6;
}

// Game variables
let gravity = 0.18; // Adjust gravity for smoother motion
let velocity = 0;
let jumpStrength = 9; // Adjust jump strength for smoother jumping

// Handle user input
window.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    velocity = jumpStrength; // Apply jump strength when spacebar is pressed
  }
});



        var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a852 });
        var bird = new THREE.Sprite(spriteMaterial);
        bird.scale.set(40, 40, 1); // Set the size of the sprite
        scene.add(bird);
        resetBird()




// const css2DRenderer = new CSS2DRenderer();
// css2DRenderer.setSize(window.innerWidth, window.innerHeight);
// css2DRenderer.domElement.style.position = 'absolute';
// css2DRenderer.domElement.style.top = '0';
// document.body.appendChild(css2DRenderer.domElement);


// const div = document.createElement('div');
// div.className = 'label';
// div.textContent = 'Hello, 3D Text!';
// const label = new THREE.CSS2DObject(div);
// label.position.set(0, 1, 0); // Set the position of the text in 3D space
// scene.add(label);


        


const fontLoader = new FontLoader();
const textMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });

// Load the Open Sans font
const movingCubes = [];
var fontHolder;
fontLoader.load('src/three/helvetiker_bold.typeface.json', function (font) {
  fontHolder = font;
  resetTowers();
});

function resetTowers(){
  movingCubes.splice(0, movingCubes.length);

  for (let row = 0; row < 8; row++) {
      movingCubes.push(makeCol(row, fontHolder, 60));
    }

  console.log(movingCubes);
}


function makeCol(row, font, gap){
  const cubeRow = [];
  var cubeMaterial = new THREE.SpriteMaterial({ color: 0x32a89e });

  const shuffled = shuffleAnswers(questions[row]);

  for (let i = 0; i < 5; i++) {
    if(i!=0){
      const cube = new THREE.Sprite(cubeMaterial);
      cube.scale.set(5, 30, 1);
      cube.position.set((row+2)*gap*5, i * 30, 0);
      scene.add(cube);
      if (shuffled.question[i] == shuffled.answer){
        cubeRow.push([cube, "pass"]);  
      }else{
        cubeRow.push([cube, "fail"]); 
      }
    }

    const textGeometry = new TextGeometry(breakLines(shuffled.question[i]), {
        font: font,
        size: (i === 0) ? 12 : 20,
        height: 0.001,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    if(i == 0){
      textMesh.position.set((row+2)*gap*5 - 230, 70, 0);
    }else{
      textMesh.position.set((row+2)*gap*5 + 5, i * 30 - 6.8, 0);
    }
      scene.add(textMesh);
      cubeRow.push([textMesh, "text"]);
  }
  return cubeRow;
}


function breakLines(text) {
    const maxLength = 30;
    const words = text.split(' ');
    let currentLine = '';
    let result = '';

    for (let i = 0; i < words.length; i++) {
        if ((currentLine + words[i]).length <= maxLength) {
            currentLine += words[i] + ' ';
        } else {
            result += currentLine.trim() + '\n';
            currentLine = words[i] + ' ';
        }
    }

    // Add the last line
    result += currentLine.trim();

    return result;
}


// Animation loop
var overlap = false;
var lastTime = 0; // Variable to store the timestamp of the last frame

const animate = (timestamp) => {
  // Calculate the time elapsed since the last frame
  const deltaTime = (timestamp - lastTime) * 0.06; // Convert to seconds
  lastTime = timestamp; // Update the lastTime variable

  requestAnimationFrame(animate);

  // Update the positions of moving cubes based on deltaTime
  for (let row = 0; row < movingCubes.length; row++) {
    for (let i = 0; i < movingCubes[row].length; i++) {
      movingCubes[row][i][0].position.x -= 1 * deltaTime; // Update position based on deltaTime
    }
  }

  // Apply gravity and velocity to the bird's position
  velocity -= gravity;
  bird.position.y += velocity;
  bird.material.rotation += Math.random() * 0.01 - 0.03;

  console.log(bird.position.y)

  // Check for collision with ground
  if (bird.position.y < -6) {
    bird.position.y = -6;
    velocity = 0;
  }

  renderer.render(scene, camera);
};
animate();
}




    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  return <div id="flappy-bird-container" />;
};

export default Bird;

