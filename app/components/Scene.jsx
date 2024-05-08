"use client"
import { Canvas } from "@react-three/fiber"
// import { Model } from "./Model"
import { Perf } from "r3f-perf"
import { ScrollControls, Environment, OrbitControls } from "@react-three/drei"
import { useControls } from "leva"

import GalleryScene from "../gallery/GalleryScene"

export default function Scene() {
  // const modelProps = useControls("Model Props", {
  //   rotation: { value: 1, min: 0.0, max: 10 },
  //   // amplitude: { value: 0.1, min: 0, max: 1 },
  // })

  return (
    <Canvas dpr={[1, 2]} style={{ backgroundColor: "#141414" }}>
      <Perf position={"bottom-left"} />
      <ScrollControls pages={5} infinite>
        <GalleryScene position={[0, 0, 0]} />
      </ScrollControls>
    </Canvas>
  )
}
