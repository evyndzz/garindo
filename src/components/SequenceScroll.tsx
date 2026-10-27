"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface SequenceScrollProps {
  onProgressUpdate?: (loadedPercent: number) => void;
  onLoadedComplete?: () => void;
  onModelLoaded?: () => void;
}

const TOTAL_FRAMES = 240;

export default function SequenceScroll({
  onProgressUpdate,
  onLoadedComplete,
  onModelLoaded,
}: SequenceScrollProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const lastSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // 5-second idle prompt state for "Gulir perlahan"
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Mobile progress indicator bar ref
  const progressBarFillRef = useRef<HTMLDivElement>(null);
  const progressHudRef = useRef<HTMLDivElement>(null);

  // Three.js 3D Emblem Refs
  const threeCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoGroupRef = useRef<THREE.Group | null>(null);
  const threeSceneRef = useRef<THREE.Scene | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const responsiveScaleRef = useRef<number>(1.0);
  const scrollProgressRef = useRef<number>(0);

  // Animated transform proxy for 3D Logo (manipulated by GSAP timeline)
  // Starts completely hidden below the viewport (y: -5.2, opacity: 0)
  // ONLY emerges and spins up from the bottom when user scrolls down!
  const logoTransformRef = useRef({
    x: 0,
    y: -5.2,
    z: 0,
    rotX: 0.35,
    rotY: -Math.PI * 2.5,
    rotZ: -0.15,
    scale: 1.1,
    opacity: 0,
  });

  // Refs for the 4 Apple-style floating text stages
  const stage1Ref = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const stage4Ref = useRef<HTMLDivElement>(null);

  // Show "Gulir perlahan" prompt only after 5 seconds of no scrolling when near top
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const startTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (typeof window !== "undefined" && window.scrollY < 80) {
        idleTimer = setTimeout(() => {
          if (window.scrollY < 80) {
            setShowScrollHint(true);
          }
        }, 5000);
      }
    };

    const handleUserScroll = () => {
      setShowScrollHint(false);
      startTimer();
    };

    startTimer();

    window.addEventListener("scroll", handleUserScroll, { passive: true });
    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener("scroll", handleUserScroll);
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
    };
  }, []);

  const renderImageToCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      img: HTMLImageElement,
      frameIndex: number = 0
    ) => {
      const w = canvas.width;
      const h = canvas.height;

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      if (imgW === 0 || imgH === 0) return;

      const imgRatio = imgW / imgH;
      const canvasRatio = w / h;

      const dpr = canvas.clientWidth > 0 ? w / canvas.clientWidth : 1;
      const cssWidth = w / dpr;
      const isPortraitMobile = canvasRatio < 0.85 || cssWidth < 640;

      // Clear canvas to pure OLED black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Smooth interpolation factor from opening logo frame (0..30) to warehouse/pallets (65..240)
      let t = 0;
      if (frameIndex <= 28) {
        t = 0;
      } else if (frameIndex >= 68) {
        t = 1;
      } else {
        const linear = (frameIndex - 28) / (68 - 28);
        t = linear * linear * (3 - 2 * linear);
      }

      if (isPortraitMobile) {
        // ============================================================================
        // MOBILE PORTRAIT OPTIMIZED RENDERING:
        // Prevents extreme 3.8x horizontal cropping on 16:9 sequence frames so all
        // product pallets (Semen Conch, Jawara, Bola Salju, Rose Brand) stay crisp,
        // centered, and fully visible while leaving top headroom for story text.
        // ============================================================================

        // 1) Subtle atmospheric ambient backdrop (fills portrait height softly)
        if (t > 0.05) {
          ctx.save();
          ctx.globalAlpha = 0.22 * t;
          const bgH = h * 0.92;
          const bgW = bgH * imgRatio;
          const bgX = (w - bgW) / 2;
          const bgY = (h - bgH) / 2;
          ctx.drawImage(img, 0, 0, imgW, imgH, bgX, bgY, bgW, bgH);
          ctx.restore();

          // Dark gradient mask over ambient backdrop so foreground pops cleanly
          const maskGrad = ctx.createLinearGradient(0, 0, 0, h);
          maskGrad.addColorStop(0, "rgba(0,0,0,0.95)");
          maskGrad.addColorStop(0.28, "rgba(0,0,0,0.72)");
          maskGrad.addColorStop(0.58, "rgba(0,0,0,0.35)");
          maskGrad.addColorStop(0.88, "rgba(0,0,0,0.75)");
          maskGrad.addColorStop(1, "rgba(0,0,0,0.98)");
          ctx.fillStyle = maskGrad;
          ctx.fillRect(0, 0, w, h);
        }

        // 2) Crisp Main Sequence Stage:
        //    - Opening frames (t=0): 1.02x width centered at 52% height (full logo fit)
        //    - Warehouse & Pallets (t=1): 1.28x width centered at 58% height (shows full pallet row, leaves top 36% free for text overlays)
        const startW = w * 1.02;
        const startH = startW / imgRatio;
        const startX = (w - startW) / 2;
        const startY = h * 0.52 - startH / 2;

        const targetW = w * 1.28;
        const targetH = targetW / imgRatio;
        const targetX = (w - targetW) / 2;
        const targetY = h * 0.58 - targetH / 2;

        const drawW = startW + (targetW - startW) * t;
        const drawH = startH + (targetH - startH) * t;
        const drawX = startX + (targetX - startX) * t;
        const drawY = startY + (targetY - startY) * t;

        ctx.drawImage(img, 0, 0, imgW, imgH, drawX, drawY, drawW, drawH);

        // 3) Seamless top & bottom feather blend on the main sequence edges
        const topEdge = Math.max(0, drawY - 2 * dpr);
        const topFeather = drawH * 0.22;
        const topGrad = ctx.createLinearGradient(0, topEdge, 0, topEdge + topFeather);
        topGrad.addColorStop(0, "rgba(0,0,0,1)");
        topGrad.addColorStop(0.45, "rgba(0,0,0,0.45)");
        topGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, topEdge, w, topFeather);

        const botEdge = Math.min(h, drawY + drawH + 2 * dpr);
        const botFeather = drawH * 0.22;
        const botGrad = ctx.createLinearGradient(0, botEdge - botFeather, 0, botEdge);
        botGrad.addColorStop(0, "rgba(0,0,0,0)");
        botGrad.addColorStop(0.55, "rgba(0,0,0,0.5)");
        botGrad.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = botGrad;
        ctx.fillRect(0, botEdge - botFeather, w, botFeather);
        return;
      }

      // ============================================================================
      // DESKTOP & TABLET LANDSCAPE RENDERING:
      // ============================================================================
      const navClearance = 72 * dpr;
      const bottomSafe = 48 * dpr;
      const availH = Math.max(100 * dpr, h - navClearance - bottomSafe);

      // 1) Contained safe framing (entire logo frame fits with comfortable headroom)
      const containH = Math.min(availH, w / imgRatio);
      const containW = containH * imgRatio;
      const containX = (w - containW) / 2;
      const containY = navClearance + (availH - containH) / 2;

      // 2) Full bleed cover framing (for cinematic warehouse & logistics footage)
      let coverW: number;
      let coverH: number;
      let coverX: number;
      let coverY: number;

      if (canvasRatio > imgRatio) {
        coverW = w;
        coverH = w / imgRatio;
        coverX = 0;
        coverY = (h - coverH) / 2;
      } else {
        coverH = h;
        coverW = h * imgRatio;
        coverX = (w - coverW) / 2;
        coverY = 0;
      }

      const drawX = containX + (coverX - containX) * t;
      const drawY = containY + (coverY - containY) * t;
      const drawW = containW + (coverW - containW) * t;
      const drawH = containH + (coverH - containH) * t;

      ctx.drawImage(
        img,
        0,
        0,
        imgW,
        imgH,
        drawX,
        drawY,
        drawW,
        drawH
      );
    },
    []
  );

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const clampedIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(frameIndex))
      );
      const img = imagesRef.current[clampedIndex];

      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < 30; offset++) {
          const prev = imagesRef.current[clampedIndex - offset];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            renderImageToCanvas(ctx, canvas, prev, clampedIndex);
            return;
          }
          const next = imagesRef.current[clampedIndex + offset];
          if (next && next.complete && next.naturalWidth > 0) {
            renderImageToCanvas(ctx, canvas, next, clampedIndex);
            return;
          }
        }
        return;
      }

      renderImageToCanvas(ctx, canvas, img, clampedIndex);
    },
    [renderImageToCanvas]
  );

  // Preload all 240 frames
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const checkAllLoaded = () => {
      if (loadedCount >= TOTAL_FRAMES && !isCancelled) {
        if (onLoadedComplete) onLoadedComplete();
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameNum = String(i + 1).padStart(3, "0");
      const img = new Image();
      img.decoding = "async";
      img.src = `/sequence/frame-${frameNum}.jpg`;

      img.onload = () => {
        if (isCancelled) return;
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (onProgressUpdate) onProgressUpdate(percent);

        if (i === 0 && canvasRef.current) {
          drawFrame(0);
        }
        checkAllLoaded();
      };

      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        checkAllLoaded();
      };

      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, onLoadedComplete, onProgressUpdate]);

  // Handle Canvas Resize with Retina DPR (ignoring small mobile URL-bar height shifts)
  useEffect(() => {
    const updateCanvasDimensions = (force = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const prev = lastSizeRef.current;
      const widthChanged = Math.abs(w - prev.w) > 2;
      const heightChangedSignificantly = Math.abs(h - prev.h) > 140;

      if (!force && !widthChanged && !heightChangedSignificantly) {
        return;
      }

      lastSizeRef.current = { w, h };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      drawFrame(currentFrameRef.current);
    };

    updateCanvasDimensions(true);

    const handleResize = () => updateCanvasDimensions(false);
    const handleOrientation = () => {
      setTimeout(() => updateCanvasDimensions(true), 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientation, {
      passive: true,
    });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, [drawFrame]);

  // Three.js WebGL Scene & 3D Logo Setup
  useEffect(() => {
    const canvas = threeCanvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    const scene = new THREE.Scene();
    threeSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, 5);
    threeCameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    threeRendererRef.current = renderer;

    // Studio Environment Map for realistic metallic & specular reflections (prevents flat polymer look)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // Balanced studio rim & directional lighting with high specular contrast
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const redRimLight = new THREE.DirectionalLight(0xd9383a, 2.6);
    redRimLight.position.set(-6, 0, 3);
    scene.add(redRimLight);

    const goldAccentLight = new THREE.DirectionalLight(0xffe2a0, 2.2);
    goldAccentLight.position.set(0, -4, 3);
    scene.add(goldAccentLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.8);
    backLight.position.set(0, 4, -4);
    scene.add(backLight);

    // Root Group for transformations
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // Responsive scaling for mobile portrait vs desktop
    const updateResponsiveScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const currAspect = w / h;
      if (currAspect < 1) {
        responsiveScaleRef.current = Math.max(0.54, currAspect * 0.85);
      } else {
        responsiveScaleRef.current = 1.0;
      }
    };
    updateResponsiveScale();

    // Load High-Fidelity Garindo 3D Logo GLTF
    const loader = new GLTFLoader();
    let isCancelled = false;

    loader.load(
      "/models/garindo-logo.glb",
      (gltf) => {
        if (isCancelled) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mats = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              mats.forEach((m) => {
                m.transparent = true;
                m.depthWrite = true;
                m.side = THREE.DoubleSide;
                // Boost reflection intensity with the environment map
                if ("envMapIntensity" in m) {
                  m.envMapIntensity = 1.6;
                }
                m.needsUpdate = true;
              });
            }
          }
        });

        logoGroup.add(model);
        if (onModelLoaded) onModelLoaded();
      },
      undefined,
      (err) => {
        console.error("Error loading Garindo 3D logo:", err);
      }
    );

    let lastThreeW = width;
    let lastThreeH = height;

    const handleThreeResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (Math.abs(w - lastThreeW) < 2 && Math.abs(h - lastThreeH) < 140) {
        return;
      }
      lastThreeW = w;
      lastThreeH = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      updateResponsiveScale();
    };
    window.addEventListener("resize", handleThreeResize, { passive: true });

    let animId: number;
    let isDisposed = false;

    const render = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(render);

      if (logoGroupRef.current) {
        const t = logoTransformRef.current;
        const p = scrollProgressRef.current;

        logoGroupRef.current.visible = t.opacity > 0.002;

        const idleWeight = Math.max(0, 1 - p * 15) * (t.opacity > 0.5 ? 1 : 0);
        const idleY = Math.sin(Date.now() * 0.002) * 0.05 * idleWeight;
        const idleRot = Math.sin(Date.now() * 0.0015) * 0.04 * idleWeight;

        logoGroupRef.current.position.set(t.x, t.y + idleY, t.z);
        logoGroupRef.current.rotation.set(t.rotX, t.rotY + idleRot, t.rotZ);
        logoGroupRef.current.scale.setScalar(
          t.scale * responsiveScaleRef.current
        );

        logoGroupRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = (child as THREE.Mesh).material;
            if (m) {
              const mats = Array.isArray(m) ? m : [m];
              mats.forEach((mat) => {
                mat.opacity = t.opacity;
              });
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    render();

    return () => {
      isDisposed = true;
      if (isCancelled) return;
      isCancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleThreeResize);
      pmremGenerator.dispose();
      roomEnv.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Master GSAP ScrollTrigger Pinning & Timeline Choreography
  useEffect(() => {
    if (typeof window === "undefined" || !triggerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const isMobileView = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const playhead = { frame: 0 };

      // Ensure stages 2, 3, 4 start completely invisible
      const hiddenStages = [
        stage2Ref.current,
        stage3Ref.current,
        stage4Ref.current,
      ].filter(Boolean);
      if (hiddenStages.length > 0) {
        gsap.set(hiddenStages, {
          autoAlpha: 0,
          y: isMobileView ? 24 : 36,
        });
      }
      if (stage1Ref.current) {
        gsap.set(stage1Ref.current, { autoAlpha: 1, y: 0, scale: 1 });
      }
      if (threeCanvasRef.current) {
        gsap.set(threeCanvasRef.current, { autoAlpha: 1 });
      }
      if (canvasRef.current) {
        gsap.set(canvasRef.current, { autoAlpha: 0 });
      }
      if (progressHudRef.current) {
        gsap.set(progressHudRef.current, { autoAlpha: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: isMobileView ? "+=350%" : "+=450%",
          pin: true,
          scrub: isMobileView ? 0.25 : 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
            if (progressBarFillRef.current) {
              progressBarFillRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Hide scroll hint immediately upon scroll
      if (scrollHintRef.current) {
        tl.to(scrollHintRef.current, { autoAlpha: 0, duration: 2 }, 0);
      }

      // Show subtle mobile progress bar once sequence starts
      if (progressHudRef.current) {
        tl.to(progressHudRef.current, { autoAlpha: 1, duration: 3 }, 12).to(
          progressHudRef.current,
          { autoAlpha: 0, duration: 4 },
          94
        );
      }

      // 1) 3D Logo Transition (Emerged majestically from below on scroll):
      //    a. (0% -> 2.5%): Fade in opacity as it rises from below
      tl.to(
        logoTransformRef.current,
        {
          opacity: 1,
          duration: 2.5,
          ease: "power1.out",
        },
        0
      );

      //    b. (0% -> 11%): Rise up from below (y: -4.8 -> 0.0), rotate 360 in 3D, scale up to cover "CV.GARINDO"
      tl.to(
        logoTransformRef.current,
        {
          y: 0.0,
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          scale: 3.15,
          duration: 11,
          ease: "power2.out",
        },
        0
      );

      //    c. (6% -> 11%): "CV.GARINDO" text fades and shrinks behind the covering 3D emblem
      if (stage1Ref.current) {
        tl.to(
          stage1Ref.current,
          {
            autoAlpha: 0,
            scale: 0.88,
            duration: 5,
            ease: "power2.in",
          },
          6
        );
      }

      //    d. (11% -> 18%): Logo zooms forward into camera lens and dissolves into image sequence
      tl.to(
        logoTransformRef.current,
        {
          z: 5.0,
          scale: 9.5,
          rotX: -0.08,
          opacity: 0,
          duration: 7,
          ease: "power2.in",
        },
        11
      );

      if (canvasRef.current) {
        tl.to(
          canvasRef.current,
          {
            autoAlpha: 1,
            duration: 4,
            ease: "power2.out",
          },
          13
        );
      }

      if (threeCanvasRef.current) {
        tl.to(threeCanvasRef.current, { autoAlpha: 0, duration: 1 }, 17);
      }

      // 2) Image sequence scrub (15% -> 84%):
      tl.to(
        playhead,
        {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          duration: 69,
          onUpdate: () => {
            const nextFrame = Math.round(playhead.frame);
            if (nextFrame !== currentFrameRef.current) {
              currentFrameRef.current = nextFrame;
              drawFrame(nextFrame);
            }
          },
        },
        15
      );

      // Hold final frame still from 84 -> 100
      tl.to(playhead, { frame: TOTAL_FRAMES - 1, duration: 16 }, 84);

      // 3) Stage 2 (25% -> 47%): Warehouse capacity statement
      tl.to(
        stage2Ref.current,
        { autoAlpha: 1, y: 0, duration: 8, ease: "power2.out" },
        25
      ).to(
        stage2Ref.current,
        {
          autoAlpha: 0,
          y: isMobileView ? -20 : -36,
          duration: 8,
          ease: "power2.in",
        },
        42
      );

      // 4) Stage 3 (53% -> 74%): Fleet logistics statement
      tl.to(
        stage3Ref.current,
        { autoAlpha: 1, y: 0, duration: 8, ease: "power2.out" },
        53
      ).to(
        stage3Ref.current,
        {
          autoAlpha: 0,
          y: isMobileView ? -20 : -36,
          duration: 8,
          ease: "power2.in",
        },
        70
      );

      // 5) Stage 4 (82% -> 100%): Final CTA holds above emerged pallets
      tl.to(
        stage4Ref.current,
        { autoAlpha: 1, y: 0, duration: 9, ease: "power2.out" },
        82
      );
    }, triggerRef);

    return () => ctx.revert();
  }, [drawFrame]);

  return (
    <section id="hero-sequence" className="relative bg-black select-none">
      {/* Pinned Fullscreen Stage (h-svh on mobile prevents URL bar resize jumps) */}
      <div
        ref={triggerRef}
        className="relative h-svh sm:h-screen w-full overflow-hidden bg-black"
      >
        {/* Fullscreen Canvas for 240-frame Image Sequence */}
        <canvas
          ref={canvasRef}
          className="invisible opacity-0 block w-full h-full"
        />

        {/* Fullscreen WebGL Canvas for 3D Emblem Transition */}
        <canvas
          ref={threeCanvasRef}
          className="pointer-events-none absolute inset-0 z-30 block w-full h-full"
        />

        {/* Subtle Apple-style vignette to blend frame edges into pure #000000 */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_48%,#000000_100%)] opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-28 z-10 bg-gradient-to-b from-black/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32 z-10 bg-gradient-to-t from-black to-transparent" />

        {/* =============================================================== */}
        {/* STAGE 1 (0%): Apple-style Centered Title                        */}
        {/* =============================================================== */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 z-20 flex flex-col items-center justify-between pt-20 pb-8 sm:pt-24 sm:pb-10 px-5 sm:px-6 text-center pointer-events-none"
        >
          <div />

          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#FF7A29] mb-2.5 sm:hidden">
              Distribusi Utama Sulawesi Tengah
            </p>
            <h1 className="text-[2.75rem] xs:text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold tracking-[-0.03em] leading-none text-[#F5F5F7] drop-shadow-[0_4px_28px_rgba(0,0,0,0.9)]">
              CV.GARINDO
            </h1>
          </div>

          {/* "Gulir perlahan" indicator - fades in after 5s of user inactivity near top */}
          <div
            ref={scrollHintRef}
            className={`flex flex-col items-center gap-1.5 text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase font-[family-name:var(--font-montserrat)] text-[#A1A1A6] transition-all duration-700 ${
              showScrollHint
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <span>Gulir perlahan</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#A1A1A6]/80" />
          </div>
        </div>

        {/* =============================================================== */}
        {/* STAGE 2 (25% - 47%): Mobile Top-Zone / Desktop Left-Aligned     */}
        {/* Positioned in upper safe zone on mobile so center pallets shine */}
        {/* =============================================================== */}
        <div
          ref={stage2Ref}
          className="invisible opacity-0 absolute inset-x-5 top-[10.5vh] sm:inset-x-auto sm:left-12 lg:left-24 sm:top-1/2 sm:-translate-y-1/2 z-20 max-w-md pointer-events-none"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A29] mb-1.5">
            01 • Infrastruktur Pergudangan
          </span>
          <h2 className="text-2xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.12] sm:leading-[1.06] text-[#F5F5F7] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            Skala operasi masif.{" "}
            <span className="text-[#A1A1A6] sm:text-[#86868B] font-medium sm:font-semibold">
              Gudang modern kapasitas 50.000 ton di Palu Barat menjaga mutu pangan dan ketahanan semen.
            </span>
          </h2>
        </div>

        {/* =============================================================== */}
        {/* STAGE 3 (53% - 74%): Mobile Top-Zone / Desktop Right-Aligned    */}
        {/* =============================================================== */}
        <div
          ref={stage3Ref}
          className="invisible opacity-0 absolute inset-x-5 top-[10.5vh] sm:inset-x-auto sm:right-12 lg:right-24 sm:top-1/2 sm:-translate-y-1/2 z-20 max-w-md sm:ml-auto pointer-events-none"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A29] mb-1.5">
            02 • Kedaulatan Ekspedisi
          </span>
          <h2 className="text-2xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.12] sm:leading-[1.06] text-[#F5F5F7] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            Logistik armada terpadu.{" "}
            <span className="text-[#A1A1A6] sm:text-[#86868B] font-medium sm:font-semibold">
              Lebih dari 100 unit tronton dan fuso mandiri menjangkau 13 kabupaten dan kota tepat waktu.
            </span>
          </h2>
        </div>

        {/* =============================================================== */}
        {/* STAGE 4 (82% - 100%): Clean Apple CTA Above Emerged Pallets     */}
        {/* =============================================================== */}
        <div
          ref={stage4Ref}
          className="invisible opacity-0 absolute top-[9.5vh] sm:top-[13vh] inset-x-5 sm:inset-x-6 z-20 flex flex-col items-center text-center max-w-2xl mx-auto"
        >
          <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A29] mb-1.5">
            03 • Kemitraan Pasokan B2B
          </span>
          <h2 className="text-2xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.1] sm:leading-[1.06] text-[#F5F5F7] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
            Pasokan pasti untuk bisnis Anda.
          </h2>
          <p className="mt-2 text-xs sm:text-xl font-medium text-[#A1A1A6] sm:text-[#86868B] tracking-tight max-w-md sm:max-w-none leading-relaxed">
            Semen Conch, Terigu Jawara, Bola Salju, Gula Bola Merah, dan Minyak Rose Brand.
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <a
              href="https://wa.me/628114567890?text=Halo%20CV.%20Garindo,%20kami%20ingin%20meminta%20katalog%20harga%20B2B%20dan%20pembukaan%20jalur%20distribusi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-[#F5F5F7] hover:bg-white text-black text-xs sm:text-sm font-semibold tracking-tight transition-colors pointer-events-auto shadow-lg"
            >
              Hubungi Pengadaan
            </a>

            <a
              href="#divisions"
              className="inline-flex items-center gap-1 px-4 py-2 sm:p-0 rounded-full bg-white/10 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border border-white/15 sm:border-0 text-xs sm:text-sm font-medium text-[#FF7A29] hover:underline pointer-events-auto"
            >
              <span>Lihat Katalog Produk</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>

        {/* =============================================================== */}
        {/* Mobile Scrollytelling Progress Pill (Bottom Safe Zone)          */}
        {/* =============================================================== */}
        <div
          ref={progressHudRef}
          className="invisible opacity-0 sm:hidden pointer-events-none absolute bottom-5 inset-x-8 z-20 flex flex-col items-center gap-2"
        >
          <div className="w-full max-w-[180px] h-[3px] rounded-full bg-white/15 overflow-hidden backdrop-blur-sm">
            <div
              ref={progressBarFillRef}
              className="w-full h-full origin-left scale-x-0 bg-gradient-to-r from-[#FF7A29] to-[#F56300]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
