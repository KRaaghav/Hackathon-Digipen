import { useEffect, useRef } from 'react'

export default function Antigravity({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#5227FF',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10
}) {
  const canvasRef = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = []
    let time = 0

    // Track mouse position relative to canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current.x = e.clientX - rect.left
      mousePos.current.y = e.clientY - rect.top
    }

    window.addEventListener('mousemove', handleMouseMove)

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        this.targetX = this.x
        this.targetY = this.y
        this.size = particleSize + (Math.random() - 0.5) * particleVariance
        this.rotation = Math.random() * Math.PI * 2
        this.pulse = Math.random() * Math.PI * 2
      }

      update() {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        
        // Distance to center
        const dxCenter = centerX - this.x
        const dyCenter = centerY - this.y
        const distanceToCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter)

        // Distance to cursor
        const dxCursor = mousePos.current.x - this.x
        const dyCursor = mousePos.current.y - this.y
        const distanceToCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor)

        // Strong attraction to cursor if in range
        if (distanceToCursor < 400) {
          this.targetX = this.x + dxCursor * 0.15 * fieldStrength
          this.targetY = this.y + dyCursor * 0.15 * fieldStrength
        } else if (distanceToCenter < ringRadius * 100) {
          // Attraction to center for particles near the center
          this.targetX = this.x + dxCenter * 0.01 * fieldStrength
          this.targetY = this.y + dyCenter * 0.01 * fieldStrength
        } else {
          // Wave motion for particles far away
          this.targetX = centerX + Math.cos(time * waveSpeed + this.y / 100) * waveAmplitude * 100
          this.targetY = centerY + Math.sin(time * waveSpeed + this.x / 100) * waveAmplitude * 100
        }

        this.x += (this.targetX - this.x) * lerpSpeed
        this.y += (this.targetY - this.y) * lerpSpeed
        this.rotation += rotationSpeed
        this.pulse += pulseSpeed * 0.01

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        const pulseScale = 1 + Math.sin(this.pulse) * 0.3

        ctx.fillStyle = color
        ctx.globalAlpha = 0.6 + Math.sin(this.pulse) * 0.3

        if (particleShape === 'capsule') {
          ctx.beginPath()
          ctx.roundRect(-this.size * pulseScale, -this.size * 0.5, this.size * 2 * pulseScale, this.size, this.size * 0.5)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size * pulseScale, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(13, 13, 26, 0)'
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 1

      // Update all particles first
      particles.forEach(particle => {
        particle.update()
      })

      // Apply separation forces between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = 35 // Minimum distance between particles (increased for more spread)
          
          if (distance < minDistance && distance > 0) {
            // Calculate repulsion force
            const angle = Math.atan2(dy, dx)
            const force = (minDistance - distance) * 0.8
            
            const fx = Math.cos(angle) * force
            const fy = Math.sin(angle) * force
            
            // Apply repulsion
            p1.x -= fx
            p1.y -= fy
            p2.x += fx
            p2.y += fy
          }
        }
      }

      // Draw all particles
      particles.forEach(particle => {
        particle.draw()
      })

      if (autoAnimate) {
        requestAnimationFrame(animate)
      }
    }

    animate()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [count, magnetRadius, ringRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, color, autoAnimate, particleVariance, rotationSpeed, depthFactor, pulseSpeed, particleShape, fieldStrength])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  )
}
