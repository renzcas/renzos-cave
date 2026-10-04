import './style.css'
import * as THREE from 'three'

// 1. Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050508)
scene.fog = new THREE.FogExp2(0x050508, 0.035)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// 2. Build the Topological Grid Floor (Conquest Map Base)
const gridHelper = new THREE.GridHelper(50, 50, 0x00ffcc, 0x1a1a2e)
gridHelper.position.y = -2
scene.add(gridHelper)

// 3. Construct a Core Chamber Monolith (The Organ Node)
const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshStandardMaterial({ 
  color: 0x00ffcc, 
  wireframe: true,
  roughness: 0.2,
  metalness: 0.8
})
const coreMonolith = new THREE.Mesh(geometry, material)
scene.add(coreMonolith)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xff0055, 2, 50)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

// 4. Render Loop (The Frame Tick)
function animate() {
  requestAnimationFrame(animate)

  // Rotate the monolith like an active simulation core
  coreMonolith.rotation.x += 0.005
  coreMonolith.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})