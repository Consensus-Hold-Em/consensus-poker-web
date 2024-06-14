"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CircuitBoard, Spade } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteSettings } from "@/config/site";

import IconCloud from "@/components/magicui/icon-cloud";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import RetroGrid from "@/components/magicui/retro-grid";
import DotPattern from "@/components/magicui/dot-pattern";
import BlurIn from "@/components/magicui/blur-in";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
 
const slugs = [
  "bitcon",
  "ethereum",
  "sui",
  "litecoin",
  "solana",
  "linux",

];
 



export default function Home() {

  const [duration, setDuration] = useState(2);
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex relative items-center justify-center py-12 h-screen">
     
          {/* <DotPattern
            className={cn(
              "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]",
            )}
          /> */}
          <div className="flex flex-col justify-center lg:justify-start items-center gap-4 text-center">
            <img src="/assets/cards_graphic.webp" 
              className="rounded-2xl"
              width={"40%"}
            />
              <BlurIn
                word={siteSettings?.name}
                className="text-lg font-bold text-black dark:text-white"
              />

              <AnimatedGradientText>
                  ♠️<hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
                  <span
                    className={cn(
                      `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                    )}
                  >
                   {siteSettings?.tagline}
                  </span>
                  <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedGradientText>

                {/* <IconCloud iconSlugs={slugs} /> */}
               
                <GradualSpacing
                  className="font-display text-center text-md"
                  text={siteSettings?.description}
                />

          <div className="hidden md:flex w-full px-8 max-w-[400px] m-12">
            <Slider defaultValue={[duration]} max={10} step={.5} onValueChange={(value) => {
              setDuration(value[0])
            }}
            />
        </div>
           
          </div>

         
         
      </div>
      <div className="hidden relative bg-muted lg:block group">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={.8}
          duration={duration}
          repeatDelay={duration / 10}
          className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0  skew-y-24 p-4",
          )}
        />
       

    
      
      </div>
    </div>
  );
}
