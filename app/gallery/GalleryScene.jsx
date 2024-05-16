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
  const [clicked, setClick] = useState(false)
  const { viewport } = useThree()

  const { galleryProps } = props

  const sliderMargin = galleryProps.margin
  const sliderLength = 6
  let sliderWidth = viewport.width / 3

  // 8 images
  const images = [1, 2, 3, 4, 5, 1, 2, 3]

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
          //  (sliderWidth + sliderMargin) - // offset to make first slide be in middle
          scroll.offset *
            (sliderLength + 1) * // when offset is in middle * (sliderLength - 1)
            (sliderWidth + sliderMargin),
        0.15,
        delta
      )

      // if image position is 1 or less or -1 or more than update greyscale value to 1
      if (Math.abs(image.position.x) > 2) {
        //   image.material.color.set("grey")
        easing.damp(image.material, "grayscale", 1, 0.45, delta)
        easing.damp(image.material, "opacity", 0.25, 0.45, delta)
      } else {
        easing.damp(image.material, "grayscale", 0, 0.45, delta)
        easing.damp(image.material, "opacity", 1, 0.45, delta)
      }

      // snap scroll on scroll
      console
      // snap scroll on click
    })
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
          transparent={true}
          scale={sliderWidth}
          onClick={() => {
            setClick(true)
          }}
        ></Image>
      ))}
    </group>
  )
}
