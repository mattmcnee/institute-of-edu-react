import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import './text.css'

const Text = ({setTitle}) => {
  setTitle("Edu Homepage");

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




  function createRender(){

    // Create scene
    var scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    var camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 1000);
    camera.position.z = 2;
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    document.getElementById('flappy-bird-container').appendChild(renderer.domElement);


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


    // Game variables
    let gravity = 0.00036; 
    let velocity = 0;
    let jumpStrength = 0.018;

    // Handle user input
    window.addEventListener('keydown', function(event) {
      if (event.code === 'Space') {
        velocity = jumpStrength; // Apply jump strength when spacebar is pressed
      }
    });

    var questionsArray = [];
    const container = document.getElementById('flappy-bird-container');
    function createQuestionBlock(questionObj, xOffset){
      var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a89e });
      var clearMaterial = new THREE.SpriteMaterial({ color: 0xffffff, transparent: true, opacity: 0});
      var spriteArray = [];
      const labelsArray = [];

      const answers = questionObj.question.slice(1);
      const correctAnswer = questionObj.question[1];

      // Shuffle the answers (Fisher-Yates algorithm)
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }


        var sprite = new THREE.Sprite(clearMaterial.clone());
        sprite.scale.set(0.2, 0.5, 1);
        sprite.position.setY(0);
        sprite.position.setX(xOffset-1);
        scene.add(sprite);
        spriteArray.push(sprite);


      for (var i = 0; i < 4; i++) {
        var sprite = new THREE.Sprite(spriteMaterial.clone());
        sprite.scale.set(0.2, 0.5, 1);
        sprite.position.setY(-0.75 + 0.5 * i);
        sprite.position.setX(xOffset);
        scene.add(sprite);
        spriteArray.push(sprite);
      }

      for (let i = 0; i < 5; i++) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = (i === 0) ?  questionObj.question[0]: answers[i-1];
        container.appendChild(labelDiv);
        labelsArray.push(labelDiv);
      }

    questionsArray.push([spriteArray, labelsArray, answers.indexOf(correctAnswer), false])

    }


    var bird;
    var resetting = false;
    function reset(){
      resetting = true;
      for (var j = 0; j < questionsArray.length; j++) {
        for (var i = 0; i < questionsArray[j][0].length; i++) {
          scene.remove(questionsArray[j][0][i]);
        }
      }

      const elementsToRemove = container.getElementsByClassName('label');

      while (elementsToRemove.length > 0) {
          elementsToRemove[0].parentNode.removeChild(elementsToRemove[0]);
      }


      questionsArray = [];
      for (let i=0; i<questions.length; i++){
        createQuestionBlock(questions[i], (i+1)*2);     
      }

      bird.position.set(-0.5, 0, 0);
      velocity = 0;
      resetting = false;
    }



    // Create bird
    var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a852 });
    bird = new THREE.Sprite(spriteMaterial);
    bird.scale.set(0.1, 0.1, 1);
    scene.add(bird);

    reset();








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

    console.log(questionsArray);

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);

      if(!resetting){

        velocity -= gravity;
        bird.position.y += velocity;

        if(bird.position.y < -1){
          // reset();
        }

        for (var j = 0; j < questionsArray.length; j++) {
          for (var i = 0; i < questionsArray[j][0].length; i++) {
            questionsArray[j][0][i].position.setX(questionsArray[j][0][i].position.x - 0.005);
            alignHtmlText(questionsArray[j][0][i], questionsArray[j][1][i]);
          }
          if(!questionsArray[j][3] && questionsArray[j][0][1].position.x < bird.position.x){
            var lowerBound = 0.5 * questionsArray[j][2] - 1;
            var upperBound = 0.5 * (questionsArray[j][2]+1) -1;
            console.log(lowerBound)
            console.log(upperBound)
            console.log(bird.position.y)
            if(!(bird.position.y > lowerBound && bird.position.y < upperBound)){
              reset();
            }
            questionsArray[j][3] = true;
          }
        }

        renderer.render(scene, camera);
      }
    }

    animate();

  // End of createRender() 

  }
  useEffect(() => {
    createRender();
    return () => {
    };
  }, []);

  return <div id="flappy-bird-container" />;
};

export default Text;

