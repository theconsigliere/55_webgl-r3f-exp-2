import { useEffect, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useScroll, Image } from "@react-three/drei"
import { easing } from "maath"
import * as THREE from "three"

export default function GalleryScene({ children, ...props }) {
  const scroll = useScroll()
  const objectRef = useRef()
  const imagesRef = useRef([])
  const [hovered, setHovered] = useState(false)

  const { viewport } = useThree()

  const sliderMargin = 0.45
  const sliderLength = 9
  let sliderWidth = viewport.width / 3

  // 6 images
  const images = [1, 2, 3, 4, 5, 1]

  const [clicked, setClick] = useState(false)

  // make sure we have the smae amount of imageRefs as images
  useEffect(() => {
    imagesRef.current = imagesRef.current.slice(0, images.length)
  })

  useFrame((state, delta) => {
    // move plane according to camera scroll

    // loop through images and update their position
    imagesRef.current.forEach((image, index) => {
      let initialPosition = index * (sliderWidth + sliderMargin)
      // goes 0 - 1 - 0 (1) in the middle
      const curve = scroll.curve(0, 1)

      // 1 needs to be furthest away
      // initial position index * (sliderWidth + sliderMargin)

      easing.damp(
        image.position,
        "x",
        initialPosition -
          scroll.offset * sliderLength * (sliderWidth + sliderMargin),
        0.15,
        delta
      )
      // image.position.x =
      //   (index + 1) * (sliderWidth + sliderMargin) * scroll.offset
    })

    // Give me a value between 0 and 1
    //   starting at the position of my item
    //   ranging across 4 / total length
    //   make it a sine, so the value goes from 0 to 1 to 0.

    // HOVER ANIMATION
    // easing.damp3(
    //   state.camera.position,
    //   hovered ? [-state.pointer.x, -state.pointer.y, 5] : [0, 0, 5],
    //   0.425,
    //   delta
    // )

    // state.camera.lookAt(0, 0, 0) // Look at center
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
      {images.map((image, index) => (
        // <mesh key={index} position={[index * (1 + margin), 0, 0]}>
        //
        // </mesh>
        <Image
          key={index}
          ref={(el) => (imagesRef.current[index] = el)}
          url={`/images/${image}.jpg`}
          // position={[index * (sliderWidth + sliderMargin), 0, 0]}
          segments={10}
          scale={sliderWidth}
        ></Image>
      ))}

      {/* REPEAT 6 MORE */}
      {images.map((image, index) => (
        // <mesh key={index} position={[index * (1 + margin), 0, 0]}>
        //
        // </mesh>
        <Image
          key={index}
          ref={(el) => (imagesRef.current[index] = el)}
          url={`/images/${image}.jpg`}
          // position={[index * (sliderWidth + sliderMargin), 0, 0]}
          segments={10}
          scale={sliderWidth}
        ></Image>
      ))}
    </group>
  )
}
