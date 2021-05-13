import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import {
    RSocketClient,
    JsonSerializers,
    encodeRoute,
    MESSAGE_RSOCKET_ROUTING,
    MESSAGE_RSOCKET_COMPOSITE_METADATA,
    encodeCompositeMetadata,
    encodeAndAddWellKnownMetadata,
    BufferEncoders
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

const metadataMimeType = MESSAGE_RSOCKET_COMPOSITE_METADATA.string; // message/x.rsocket.composite-metadata.v0
// Create an instance of a client
const client = new RSocketClient({
    // send/receive objects instead of strings/buffers
    serializers: JsonSerializers,
    setup: {
        // ms btw sending keepalive to server
        keepAlive: 60000,
        // ms timeout if no keepalive response
        lifetime: 180000,
        // format of `data`
        dataMimeType: 'application/json',
        // format of `metadata`
        metadataMimeType: metadataMimeType,
    },
    transport: new RSocketWebSocketClient({ url: 'ws://localhost:7000' }, BufferEncoders),
});


// Open the connection
client.connect().subscribe({
    onComplete: socket => {
        console.log("Connected to socket!")
        socket.fireAndForget({
            metadata: encodeCompositeMetadata([[MESSAGE_RSOCKET_ROUTING, encodeRoute("fire-and-forget")]]),
            data: Buffer.from(JSON.stringify({ someData: "Hello world!" }))
        });
    },
    onError: error => console.error(error),
    onSubscribe: cancel => {/* call cancel() to abort */ }
});

/* THREE JS CODE */
const scene: THREE.Scene = new THREE.Scene()

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
camera.position.z = 10

pointCloud()
addTarget(1, 0, 0, 1)

function addTarget(id: number, x: number, y: number, z: number) {
    const vertices = new Float32Array([
        x, y, z,
    ])
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material: THREE.PointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.5 })
    const points: THREE.Points = new THREE.Points(geometry, material)
    scene.add(points)
}

function pointCloud() {
    const vertices = new Float32Array([
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
    ])
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material: THREE.PointsMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 })
    const points: THREE.Points = new THREE.Points(geometry, material)
    scene.add(points)
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
