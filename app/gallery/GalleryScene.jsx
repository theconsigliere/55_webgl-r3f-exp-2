import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useScroll, Image } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"

export default function GalleryScene({ children, ...props }) {
  const scroll = useScroll()
  const objectRef = useRef()
  const [hovered, setHovered] = useState(false)

  const images = [1, 2, 3, 4, 5]

  const [clicked, setClick] = useState(false)

  useFrame((state, delta) => {
    // move plane according to camera scroll
    // rotate box on scroll
    objectRef.current.rotation.x = -scroll.offset * (Math.PI * 2)
    state.events.update() // Raycasts every frame rather than on pointer-move
    //damp3(objectRef.current.position, [0, 0, -scroll.offset * 10], 0.3, delta)

    easing.damp3(
      state.camera.position,
      hovered ? [-state.pointer.x, -state.pointer.y, 5] : [0, 0, 5],
      0.425,
      delta
    )

    state.camera.lookAt(0, 0, 0)
  })

  const material = new THREE.MeshBasicMaterial({
    color: "white",
    wireframe: true,
    side: THREE.DoubleSide,
  })

  return (
    <group
      {...props}
      ref={objectRef}
      onPointerOver={() => {
        setHovered(true)
      }}
      onPointerOut={() => {
        setHovered(false)
      }}
    >
      {images.map((index) => (
        <mesh key={index} scale={5} position={[0, 0, index * -0.5]}>
          {/* <planeGeometry args={[1, 1, 16, 16]} />
          <meshBasicMaterial {...material} /> */}
          <Image url={`/images/${index}.jpg`} />
          {/* <GradientTexture
              stops={[0, 0.45, 1]} // As many stops as you want
              colors={["purple", "hotpink", "orange"]} // Colors need to match the number of stops
              size={1024} // Size is optional, default = 1024
            />
          </meshBasicMaterial> */}
        </mesh>
      ))}
    </group>
  )
}
