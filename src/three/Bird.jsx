import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

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

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
camera.position.z = 10;
camera.position.y = 2;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('flappy-bird-container').appendChild(renderer.domElement);


window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  // Update renderer size
  renderer.setSize(newWidth, newHeight);
  // Update camera aspect ratio
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

// Bird setup
const birdGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const birdMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const bird = new THREE.Mesh(birdGeometry, birdMaterial);
bird.position.y = 0;
bird.position.x = -6;
scene.add(bird);

// Game variables
let gravity = 0.0018; // Adjust gravity for smoother motion
let velocity = 0;
let jumpStrength = 0.09; // Adjust jump strength for smoother jumping

// Handle user input
window.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    velocity = jumpStrength; // Apply jump strength when spacebar is pressed
  }
});


const fontLoader = new FontLoader();
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

// Load the Open Sans font
const movingCubes = [];
var unset = true;
fontLoader.load('src/three/helvetiker_bold.typeface.json', function (font) {
  if(unset){
    for (let row = 0; row < 8; row++) {
      movingCubes.push(makeCol(row, font, 10));
    }

    console.log(movingCubes);
    unset = false;
  }
});

function makeCol(row, font, gap){
  const cubeRow = [];
  const cubeGeometry = new THREE.BoxGeometry(0.5, 3, -0.1);
  const cubePassMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cubeFailMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

  const shuffled = shuffleAnswers(questions[row]);

  for (let i = 0; i < 5; i++) {
    if(i!=0){

      if (shuffled.question[i] == shuffled.answer){
        const cubeMaterial = cubePassMaterial;
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set((row+2)*gap, i * 3 - 6.5, 0);
        scene.add(cube);
        cubeRow.push([cube, "pass"]);  
      }else{
        const cubeMaterial = cubeFailMaterial;
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set((row+2)*gap, i * 3 - 6.5, 0);
        scene.add(cube);
        cubeRow.push([cube, "fail"]); 
      }
    }

    const textGeometry = new TextGeometry(breakLines(shuffled.question[i]), {
        font: font,
        size: (i === 0) ? 0.3 : 0.5,
        height: 0.001,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    if(i == 0){
      textMesh.position.set((row+2)*gap - 6.5, 0.9, 0);
    }else{
      textMesh.position.set((row+2)*gap - 0.5, i * 3 - 6.8, 0);
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
const animate = () => {
  requestAnimationFrame(animate);


  // Update positions of moving cubes
  for (let row = 0; row < movingCubes.length; row++) {
    for (let i = 0; i < movingCubes[row].length; i++) {
      movingCubes[row][i][0].position.x -= 0.06;


      const cube = movingCubes[row][i][0];

    const cubeBoundingBox = new THREE.Box3().setFromObject(cube);
    const birdBoundingBox = new THREE.Box3().setFromObject(bird);

    const collisionDetected = cubeBoundingBox.intersectsBox(birdBoundingBox);
    if (collisionDetected && movingCubes[row][i][1] == "fail") {
        // Handle collision
        console.log("Collision detected between cube and bird!");
        // Perform actions like stopping movement or removing objects
    }
          





      // Reset cube position if it moves out of the scene
      if (cube.position.x < -16) {
        scene.remove(cube);
      }
    }
  }

  // Apply gravity and velocity to the bird's position
  velocity -= gravity; // Apply gravity
  bird.position.y += velocity; // Update bird's position based on velocity

  bird.rotation.x += Math.random() * 0.01 - 0.03; // Random rotation around X-axis
  bird.rotation.y += Math.random() * 0.01 - 0.03; // Random rotation around Y-axis
  bird.rotation.z += Math.random() * 0.01 - 0.03; // Random rotation around Z-axis


  // Check for collision with ground
  if (bird.position.y < -5) {
    bird.position.y = -5;
    velocity = 0; // Reset velocity on ground collision
    // Game over logic
    // console.log('Game Over!');
  }

  renderer.render(scene, camera);
};

animate();

    return () => {
      // Cleanup logic if necessary
    };
  }, []); // Empty dependency array ensures useEffect runs once after initial render

  return <div id="flappy-bird-container" />;
};

export default Bird;

