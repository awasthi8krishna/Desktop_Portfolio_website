console.log("Script started");
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Error caught: ", message, " at ", source, ":", lineno, ":", colno);
};

// Animate skill bars on scroll
function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.width = bar.style.getPropertyValue('--skill-level');
  });
}

// Mobile menu toggle
const menuToggleBtn = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggleBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Scroll reveal animations for about, projects, skills and contact
let lastScrollTop = 0;
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollingUp = scrollTop < lastScrollTop;
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

  for (const reveal of reveals) {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const revealPoint = 150;

    if (elementTop < windowHeight - revealPoint) {
      if (scrollingUp) {
        reveal.classList.add('scroll-up');
        reveal.classList.remove('active');
      } else {
        reveal.classList.add('active');
        reveal.classList.remove('scroll-up');
        if (reveal.id === 'skills') {
          animateSkillBars();
        }
      }
    }
  }
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
  revealOnScroll();
  // Animate skill bars immediately if visible on load
  const skills = document.getElementById('skills');
  if (skills.getBoundingClientRect().top < window.innerHeight - 150) {
    animateSkillBars();
  }
});

// New dark theme inspired 3D animated background using Three.js

let scene, camera, renderer;
let shapes = [];
let clock;

function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.set(0, 0, 1000);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0a0a, 1); // dark background color

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.7); // soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x8a2be2, 1); // blue violet light
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Create floating shapes with different geometry and colors
  const geometryTypes = [
    new THREE.DodecahedronGeometry(30),
    new THREE.OctahedronGeometry(25),
    new THREE.TorusKnotGeometry(20, 6, 100, 16)
  ];

  // Create shapes and add to scene
  for (let i = 0; i < 30; i++) {
    const geometry = geometryTypes[i % geometryTypes.length];
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 60%)`),
      roughness: 0.5,
      metalness: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
    scene.add(mesh);
    shapes.push(mesh);
  }

  clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    shapes.forEach((shape, index) => {
      shape.rotation.x += 0.01 + index * 0.0001;
      shape.rotation.y += 0.01 + index * 0.0001;
      shape.position.x = 1000 * Math.sin(elapsed + index);
      shape.position.y = 1000 * Math.cos(elapsed + index);
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Initialize background animation
initBackground();

// Typing animation for #animated-name
const typingPhrases = [
  "Krishna Awasthi",
  "A Student",
  "A coder",
  "The Future Software Engineer"
];
const typingElement = document.getElementById("animated-name");
let phraseIndex = 0;
let charIndex = 0;
let typingDelay = 100;
let erasingDelay = 50;
let newPhraseDelay = 1500; // Delay between phrases
let isErasing = false;

function type() {
  const currentPhrase = typingPhrases[phraseIndex];
  if (!isErasing) {
    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isErasing = true;
      setTimeout(type, newPhraseDelay);
    } else {
      setTimeout(type, typingDelay);
    }
  } else {
    typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isErasing = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(type, erasingDelay);
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  if (typingPhrases.length) {
    setTimeout(type, newPhraseDelay);
  }
});
