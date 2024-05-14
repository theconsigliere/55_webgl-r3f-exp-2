"use client"
import { Canvas } from "@react-three/fiber"
// import { Model } from "./Model"
import { Perf } from "r3f-perf"
import { ScrollControls, Scroll } from "@react-three/drei"
import { useControls } from "leva"

import GalleryScene from "../gallery/GalleryScene"

export default function Scene() {
  const galleryProps = useControls("Gallery Props", {
    margin: { value: 0.45, min: 0.0, max: 10 },
    // amplitude: { value: 0.1, min: 0, max: 1 },
  })

  return (
    <Canvas dpr={[1, 2]} style={{ backgroundColor: "#141414" }}>
      <Perf position={"bottom-left"} />
      <ScrollControls distance={9}>
        <GalleryScene galleryProps={galleryProps} />
      </ScrollControls>
    </Canvas>
  )
}
