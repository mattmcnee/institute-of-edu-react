import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { flappyBird } from './GameLogic';

const Game = ({gameType, src}) => {
  const canvasRef = useRef();
  const gameContainerRef = useRef(null);
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

    // Iffy solution to stop double render of game in react strict mode
    var opacity = 1;
    if(!begun == true){
      runGame();
    }
    begun = true;


    function runGame(){
      // Set up Three.js scene
      const gameContainer = gameContainerRef.current;
      var embed = true;
      var scene = new THREE.Scene();
      var aspectRatio = 16/9;
      var width = gameContainer.clientWidth;
      var height = width/aspectRatio;
      console.log(width);
      var camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 1000);
      camera.position.z = 2;
      var renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvasRef.current  });
      renderer.setSize(width, height);
      gameContainer.appendChild(renderer.domElement);


      // Update camera and renderer on screen resize
      window.addEventListener('resize', () => {
        var width = gameContainer.clientWidth;
        var height = width/aspectRatio;
        console.log(height)

        renderer.setSize(width, height);

        camera.left = -aspectRatio;
        camera.right = aspectRatio;
        camera.top = 1;
        camera.bottom = -1;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      });

      var game = {
        "scene": scene,
        "camera": camera,
        "renderer": renderer,
        "container": gameContainer,
        "ratio": aspectRatio
      };

      console.log(game);

      


      switch (gameType) {
        case "bird":
          flappyBird(game, questions);
          break;
        default:
          // flappyBird(game, questions);
          console.log(gameType);
          break;
      }
    }

    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  return <div id="main-game-container" ref= {gameContainerRef}></div>;
};

export default Game;

