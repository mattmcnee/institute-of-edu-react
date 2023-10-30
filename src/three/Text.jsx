import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import './text.css'

const Text = ({setTitle}) => {
  setTitle("Edu Homepage");

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


    // Create sprites with red texture
    var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a89e });
    var spriteArray = [];
    for (var i = 0; i < 4; i++) {
        var sprite = new THREE.Sprite(spriteMaterial.clone());
        sprite.scale.set(0.2, 0.5, 1);
        sprite.position.setY(-0.75 + 0.5 * i);
        sprite.position.setX(2);
        scene.add(sprite);
        spriteArray.push(sprite);
    }

    // Create text labels
    const container = document.getElementById('flappy-bird-container');
    const labelsArray = [];

    for (let i = 0; i < 4; i++) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = 'Hello, 3D Text!';
        container.appendChild(labelDiv);
        labelsArray.push(labelDiv);
    }


    // Create bird
    var spriteMaterial = new THREE.SpriteMaterial({ color: 0x32a852 });
    var bird = new THREE.Sprite(spriteMaterial);
    bird.scale.set(0.1, 0.1, 1);
    scene.add(bird);

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




    function alignHtmlText(sprite, label){
      const position = sprite.position.clone().project(camera);
      const x = (position.x + 2) * window.innerWidth / 2 - label.offsetWidth / 2;
      const y = -(position.y + 1) * window.innerHeight / 1.65 - label.offsetHeight / 2;
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



    // Render the scene
    function animate() {
      requestAnimationFrame(animate);


      velocity -= gravity;
      bird.position.y += velocity;

      for (var i = 0; i < spriteArray.length; i++) {
        spriteArray[i].position.setX(spriteArray[i].position.x - 0.005);
        alignHtmlText(spriteArray[i], labelsArray[i]);
    }

      renderer.render(scene, camera);
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

