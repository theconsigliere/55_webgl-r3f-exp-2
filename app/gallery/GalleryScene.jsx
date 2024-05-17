import { act, useEffect, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useScroll, Image } from "@react-three/drei"
import { damp, expo } from "maath/easing"
import * as THREE from "three"

export default function GalleryScene({ children, ...props }) {
  const scroll = useScroll()
  const objectRef = useRef()
  const imagesRef = useRef([])
  const [hovered, setHovered] = useState(false)
  const [clicked, setClick] = useState(false)
  const [scrollActivated, setScrollActivated] = useState(false)
  const { viewport } = useThree()
  const { galleryProps } = props
  let activeIndex = null
  const sliderMargin = galleryProps.margin
  let sliderWidth = viewport.width / 3

  // 8 images
  const images = [1, 2, 3, 4, 5, 1, 2, 3]
  const sliderLength = images.length
  const initialImagePositions = []

  // make sure we have the smae amount of imageRefs as images
  useEffect(() => {
    imagesRef.current = imagesRef.current.slice(0, images.length)

    // set initial position
    imagesRef.current.forEach((image, index) => {
      initialImagePositions[index] = index * (sliderWidth + sliderMargin)
    })
  })

  console.log("imagePositions", initialImagePositions)

  useFrame((state, delta) => {
    // move plane according to camera scroll

    // loop through images and update their position
    imagesRef.current.forEach((image, index) => {
      damp(
        image.position,
        "x",
        initialImagePositions[index] -
          // (sliderWidth + sliderMargin) - // offset to make first slide be in middle
          scroll.offset *
            (sliderLength - 1) * // when offset is in middle * (sliderLength - 1)
            (sliderWidth + sliderMargin),
        0.1,
        delta
      )

      // if image position is 1 or less or -1 or more than update greyscale value to 1
      if (Math.abs(image.position.x) > 1.5) {
        //   image.material.color.set("grey")
        damp(image.material, "grayscale", 1, 0.45, delta)
        damp(image.material, "opacity", 0.15, 0.45, delta)
      } else {
        // this is active!

        damp(image.material, "grayscale", 0, 0.45, delta)
        damp(image.material, "opacity", 1, 0.45, delta)

        activeIndex = index
      }

      // snap scroll on scroll

      // we have begun scrolling
      if (scroll.delta === 0 && scroll.offset > 0) {
        // snap to on scroll

        // if activeIndex is 1
        // index (0) - activeIndex (1) = -1
        // index (1) - activeIndex (1) = 0
        // index (2) - activeIndex (1) = 1

        // if activeIndex is 2
        // index (0) - activeIndex (2) = -2
        // index (1) - activeIndex (2) = -1
        // index (2) - activeIndex (2) = 0
        // index (3) - activeIndex (2) = 1

        damp(
          image.position,
          "x",
          (sliderMargin + sliderWidth) * (index - activeIndex),
          0.25,
          delta,
          1,
          expo.inOut,
          0.1
        )
      }
    })
  })

  return (
    <group
      {...props}
      ref={objectRef}
      // onPointerOver={() => {
      //   setHovered(true)
      // }}
      // onPointerOut={() => {
      //   setHovered(false)
      // }}
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

      {/* <Image url={`/images/${1}.jpg`} scale={sliderWidth} segments={10} /> */}
    </group>
  )
}
