"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Group } from "three";
type ScenePart={number:number;slug:string;title:string};
const colors=["#ff5a1f","#2f5bff","#111111","#8a7dff","#ff9068","#5978ff"];
function Graph({parts}:{parts:ScenePart[]}){const group=useRef<Group>(null);const router=useRouter();const positions=parts.map((_,i)=>{const r=Math.floor(i/6)+1,a=(i%6)/6*Math.PI*2+r*.35;return[Math.cos(a)*r*.72,(i%3-1)*.72,Math.sin(a)*r*.58]as[number,number,number]});useFrame((s,d)=>{if(group.current){group.current.rotation.y+=d*.06;group.current.rotation.x=s.pointer.y*.08;group.current.rotation.z=-s.pointer.x*.04}});return <group ref={group} scale={.72}>{positions.slice(1).map((p,i)=><Line key={i} points={[positions[i],p]} color="#b7b2a8" lineWidth={.6}/>)}{parts.map((p,i)=><Node key={p.slug} part={p} position={positions[i]} color={colors[Math.min(5,Math.floor(i/6))]} open={()=>router.push(`/part/${p.slug}`)}/>)}</group>}
function Node({part,position,color,open}:{part:ScenePart;position:[number,number,number];color:string;open:()=>void}){const[hover,setHover]=useState(false);return <group position={position}><mesh scale={hover?1.5:1} onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)} onClick={open}><sphereGeometry args={[.13,18,18]}/><meshStandardMaterial color={color} roughness={.35}/></mesh>{hover&&<Html center distanceFactor={8}><button className="node-label" onClick={open}>P{part.number} · {part.title}</button></Html>}</group>}
export default function KnowledgeScene3D({parts}:{parts:ScenePart[]}){return <div className="knowledge-scene" role="img" aria-label="แผนที่สามมิติของหัวข้อความรู้ 31 หัวข้อ"><Canvas dpr={[1,1.5]} camera={{position:[0,1,7],fov:48}}><ambientLight intensity={1.8}/><directionalLight position={[5,5,5]} intensity={2}/><Graph parts={parts}/><OrbitControls enableZoom={false} enablePan={false}/></Canvas></div>}
