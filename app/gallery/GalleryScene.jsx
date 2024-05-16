import { act, useEffect, useRef, useState } from "react"
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
  let activeIndex = 0

  const sliderMargin = galleryProps.margin

  let sliderWidth = viewport.width / 3

  // 8 images
  const images = [1, 2, 3, 4, 5, 1, 2, 3]
  const sliderLength = images.length
  const imagePositions = []

  // make sure we have the smae amount of imageRefs as images
  useEffect(() => {
    imagesRef.current = imagesRef.current.slice(0, images.length)

    // set initial position
    imagesRef.current.forEach((image, index) => {
      imagePositions[index] = index * (sliderWidth + sliderMargin)
    })
  })

  console.log("imagePositions", imagePositions)

  useFrame((state, delta) => {
    // move plane according to camera scroll

    // loop through images and update their position
    imagesRef.current.forEach((image, index) => {
      easing.damp(
        image.position,
        "x",
        imagePositions[index] -
          // (sliderWidth + sliderMargin) - // offset to make first slide be in middle
          scroll.offset *
            (sliderLength - 1) * // when offset is in middle * (sliderLength - 1)
            (sliderWidth + sliderMargin),
        0.15,
        delta
      )

      // if image position is 1 or less or -1 or more than update greyscale value to 1
      if (Math.abs(image.position.x) > 1) {
        //   image.material.color.set("grey")
        easing.damp(image.material, "grayscale", 1, 0.45, delta)
        easing.damp(image.material, "opacity", 0.15, 0.45, delta)
      } else {
        // this is active!

        easing.damp(image.material, "grayscale", 0, 0.45, delta)
        easing.damp(image.material, "opacity", 1, 0.45, delta)

        activeIndex = index
        console.log((sliderMargin + sliderWidth) * (index - activeIndex))
      }

      // snap scroll on scroll

      // snap to active

      if (scroll.delta === 0) {
        // console.log("activeIndex", activeIndex)

        //* if active index 6
        //  sliderLength = 8 - 1

        // 0 = sliderMargin + sliderWidth * -7
        // 1 = sliderMargin + sliderWidth * -6
        // 2 = sliderMargin + sliderWidth * -5
        // 3 = sliderMargin + sliderWidth * -3
        // 4 = sliderMargin + sliderWidth * -2
        // 5 = sliderMargin + sliderWidth * -1
        // 6 = sliderMargin + sliderWidth * 0
        // 7 = sliderMargin + sliderWidth * 1

        // if activeIndex is 6 how do we get to 0 using sliderLength and sliderWidth + sliderMargin

        // if activeIndex is 0
        // 0 = sliderMargin + sliderWidth * index (0) - activeIndex (0)
        // 1 = sliderMargin + sliderWidth * index (1) - activeIndex (0)
        // 2 = sliderMargin + sliderWidth * index (2) - activeIndex (0)
        // 3 = sliderMargin + sliderWidth * index (3) - activeIndex (0)
        // 4 = sliderMargin + sliderWidth * index (4) - activeIndex (0)
        // 5 = sliderMargin + sliderWidth * index (5) - activeIndex (0)
        // 6 = sliderMargin + sliderWidth * index (6) - activeIndex (0)
        // 7 = sliderMargin + sliderWidth * index (7) - activeIndex (0)

        // if activeIndex is 1
        // index (0) - activeIndex (1) = -1
        // index (1) - activeIndex (1) = 0
        // index (2) - activeIndex (1) = 1

        // if activeIndex is 2
        // index (0) - activeIndex (2) = -2
        // index (1) - activeIndex (2) = -1
        // index (2) - activeIndex (2) = 0
        // index (3) - activeIndex (2) = 1

        image.position.x = (sliderMargin + sliderWidth) * (index - activeIndex)

        // MAKE THIS WORK
        // easing.damp(
        //   image.position,
        //   "x",
        //   (sliderMargin + sliderWidth) * (index - activeIndex),
        //   0.15,
        //   delta
        // )
      }

      // snap scroll on click
    })
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
