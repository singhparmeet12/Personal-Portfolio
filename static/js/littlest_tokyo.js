/**
 * LITTLEST TOKYO — OFFICIAL THREE.JS KEYFRAME ANIMATION VIEWER
 * Authentic Three.js 3D WebGL Demonstration
 * Model: "Littlest Tokyo" by Glen Fox (licensed under CC-BY)
 * 
 * Features:
 * - High-performance DRACO-compressed GLTF loading
 * - Physically-based PBR rendering with RoomEnvironment & PMREM Generator
 * - Continuous 60FPS Skeletal & Keyframe Animation (Moving Train, Lucky Cat, Fans)
 * - Smooth OrbitControls with Damping & Preset Camera Focus Points
 * - Responsive WebGL Canvas & Graceful Resource Management
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class LittlestTokyoViewer {
  constructor(containerElement, loadingScreenElement) {
    this.container = containerElement;
    this.loadingScreen = loadingScreenElement;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.animId = null;
    this.isInitialized = false;

    // Camera animation state
    this.cameraTargetPos = new THREE.Vector3(5, 2, 8);
    this.cameraTargetLook = new THREE.Vector3(0, 0.5, 0);
    this.isTransitioningCamera = false;
    this.isAutoTour = false;
    this.tourAngle = 0;

    // Camera Viewpoints
    this.viewpoints = {
      overview: { pos: new THREE.Vector3(5, 2, 8), target: new THREE.Vector3(0, 0.5, 0) },
      cat: { pos: new THREE.Vector3(1.4, 3.2, 2.8), target: new THREE.Vector3(0.2, 2.4, 0.0) },
      train: { pos: new THREE.Vector3(3.8, 1.2, 2.8), target: new THREE.Vector3(1.2, 0.6, -0.6) },
      shop: { pos: new THREE.Vector3(1.2, 0.8, 3.2), target: new THREE.Vector3(0.2, 0.5, 0.6) },
      rooftop: { pos: new THREE.Vector3(-2.8, 3.5, 3.8), target: new THREE.Vector3(0, 1.8, 0) }
    };
  }

  init() {
    if (this.isInitialized) return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.appendChild(this.renderer.domElement);

    // 2. PMREM Room Environment for PBR reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    // 3. Scene with clean pastel Japanese sky
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfe3dd);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;

    // 4. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.copy(this.cameraTargetPos);

    // 5. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(this.cameraTargetLook);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 20.0;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.update();

    // 6. Load Model with DRACO Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/static/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/static/models/LittlestTokyo.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);
        this.scene.add(model);

        // Setup Keyframe Animation Mixer
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(model);
          const action = this.mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        // Hide loading screen
        if (this.loadingScreen) {
          this.loadingScreen.classList.add('fade-out');
          setTimeout(() => {
            this.loadingScreen.style.display = 'none';
          }, 400);
        }

        this.isInitialized = true;
        this.animate();
      },
      (xhr) => {
        if (this.loadingScreen && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          const textEl = this.loadingScreen.querySelector('.text-muted');
          if (textEl) textEl.textContent = `Loading 3D Model: ${percent}%`;
        }
      },
      (error) => {
        console.error('An error occurred loading LittlestTokyo.glb:', error);
        if (this.loadingScreen) {
          const textEl = this.loadingScreen.querySelector('.text-muted');
          if (textEl) textEl.textContent = 'Error loading 3D model. Please refresh.';
        }
      }
    );

    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
  }

  start() {
    this.init();
  }

  stop() {
    this.dispose();
  }

  resetCamera() {
    this.setViewpoint('overview');
  }

  setViewpoint(key) {
    const vp = this.viewpoints[key];
    if (!vp) return;

    this.isAutoTour = false;
    this.cameraTargetPos.copy(vp.pos);
    this.cameraTargetLook.copy(vp.target);
    this.isTransitioningCamera = true;
  }

  setCameraViewpoint(key) {
    this.setViewpoint(key);
  }

  toggleAutoTour() {
    this.isAutoTour = !this.isAutoTour;
    return this.isAutoTour;
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Update animations (Train, Cat, Props)
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // Smooth Camera Transition
    if (this.isTransitioningCamera) {
      this.camera.position.lerp(this.cameraTargetPos, 0.06);
      this.controls.target.lerp(this.cameraTargetLook, 0.06);

      if (this.camera.position.distanceTo(this.cameraTargetPos) < 0.05) {
        this.camera.position.copy(this.cameraTargetPos);
        this.controls.target.copy(this.cameraTargetLook);
        this.isTransitioningCamera = false;
      }
    }

    // Cinematic Auto-Tour Orbit
    if (this.isAutoTour) {
      this.tourAngle += delta * 0.28;
      const radius = 8.5;
      this.camera.position.x = Math.sin(this.tourAngle) * radius;
      this.camera.position.z = Math.cos(this.tourAngle) * radius;
      this.camera.position.y = 2.4 + Math.sin(this.tourAngle * 0.5) * 0.8;
      this.controls.target.set(0, 0.8, 0);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.onWindowResize);

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    this.isInitialized = false;
  }
}
