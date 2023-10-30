import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import './text.css'

const Text = ({setTitle}) => {
  setTitle("Edu Homepage");

  function createRender(){

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('flappy-bird-container').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.set(-1, 0, 0)

    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = 'Hello, 3D Text!';
    document.getElementById('flappy-bird-container').appendChild(labelDiv);


    var velocityX = 0.01;
    var velocityY = 0.01;

    function animate() {
      requestAnimationFrame(animate);

      // Update 3D object and position the HTML element
    cube.position.x += velocityX;
    cube.position.y += velocityY;

    // Check if the cube hits the screen bounds and reverse the velocity if so
    if (cube.position.x >= 1 || cube.position.x <= -1) {
        velocityX = -velocityX;
    }

    if (cube.position.y >= 1 || cube.position.y <= -1) {
        velocityY = -velocityY;
    }


      const position = cube.position.clone().project(camera);
      const x = (position.x + 2) * window.innerWidth / 2 - labelDiv.offsetWidth / 2;
      const y = -(position.y + 1) * window.innerHeight / 2 - labelDiv.offsetHeight / 2;
      const errorMargin = 1.05;
    const isInsideScreen = position.x >= -errorMargin && position.x <= errorMargin && position.y >= -errorMargin && position.y <= errorMargin;

    // Apply the calculated position to the HTML element and show/hide it based on visibility
    if (isInsideScreen) {
        labelDiv.style.transform = `translate(${x}px, ${y}px)`;
        labelDiv.style.display = 'block';
    } else {
        labelDiv.style.display = 'none';
    }

      renderer.render(scene, camera);
    }

    animate();
  }




  useEffect(() => {
    createRender();
    return () => {
    };
  }, []);

  return <div id="flappy-bird-container" />;
};

export default Text;

