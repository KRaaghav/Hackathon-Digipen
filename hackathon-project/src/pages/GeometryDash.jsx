import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Play } from "lucide-react"

export default function GeometryDash() {
  const canvasRef = useRef(null)

  const [gameState, setGameState] = useState("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("gd_high") || "0")
  )

  const player = useRef({
    x: 120,
    y: 0,
    size: 30,
    velocity: 0,
    jumping: false
  })

  const obstacles = useRef([])
  const speed = useRef(6)
  const frame = useRef()

  const gravity = 0.8
  const jumpForce = -14
  const ground = 320

  const spawnObstacle = () => {
    obstacles.current.push({
      x: 900,
      width: 30,
      height: 40
    })
  }

  const startGame = () => {
    player.current.y = ground
    player.current.velocity = 0
    player.current.jumping = false
    obstacles.current = []
    speed.current = 6
    setScore(0)
    setGameState("playing")
  }

  const jump = () => {
    if (!player.current.jumping) {
      player.current.velocity = jumpForce
      player.current.jumping = true
    }
  }

  const update = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // background
    ctx.fillStyle = "#0f0b25"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // grid glow
    ctx.strokeStyle = "#7c6af7"
    ctx.globalAlpha = 0.15
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // player physics
    player.current.velocity += gravity
    player.current.y += player.current.velocity

    if (player.current.y >= ground) {
      player.current.y = ground
      player.current.velocity = 0
      player.current.jumping = false
    }

    // draw player cube
    ctx.fillStyle = "#7c6af7"
    ctx.shadowColor = "#7c6af7"
    ctx.shadowBlur = 20

    ctx.fillRect(
      player.current.x,
      player.current.y - player.current.size,
      player.current.size,
      player.current.size
    )

    ctx.shadowBlur = 0

    // obstacles
    obstacles.current.forEach((obs, i) => {
      obs.x -= speed.current

      ctx.fillStyle = "#f76af7"

      ctx.beginPath()
      ctx.moveTo(obs.x, ground)
      ctx.lineTo(obs.x + obs.width / 2, ground - obs.height)
      ctx.lineTo(obs.x + obs.width, ground)
      ctx.closePath()
      ctx.fill()

      // collision
      if (
        player.current.x < obs.x + obs.width &&
        player.current.x + player.current.size > obs.x &&
        player.current.y > ground - obs.height
      ) {
        setGameState("over")
      }

      if (obs.x + obs.width < 0) {
        obstacles.current.splice(i, 1)
      }
    })

    // spawn obstacles
    if (Math.random() < 0.02) spawnObstacle()

    // increase difficulty
    speed.current += 0.001

    setScore((s) => s + 1)

    if (gameState === "playing") {
      frame.current = requestAnimationFrame(update)
    }
  }

  useEffect(() => {
    if (gameState === "playing") {
      frame.current = requestAnimationFrame(update)
    }

    if (gameState === "over") {
      cancelAnimationFrame(frame.current)

      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem("gd_high", score)
      }
    }

    return () => cancelAnimationFrame(frame.current)
  }, [gameState])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") jump()
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <div className="page-container">

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "2.2rem",
          marginBottom: "1rem"
        }}
      >
        Geometry Runner ♾
      </h1>

      {gameState === "menu" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            className="btn btn-primary"
            onClick={startGame}
            style={{ padding: "14px 28px", fontSize: "1rem" }}
          >
            <Play size={18} /> Start
          </button>
        </motion.div>
      )}

      {gameState === "over" && (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <h2>Game Over</h2>

          <p>Score: {score}</p>
          <p>Best: {highScore}</p>

          <button
            className="btn btn-primary"
            onClick={startGame}
          >
            <RotateCcw size={16} /> Restart
          </button>
        </motion.div>
      )}

      <div
        style={{
          marginTop: "20px",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid var(--border)"
        }}
        onClick={jump}
      >
        <canvas
          ref={canvasRef}
          width={900}
          height={400}
        />
      </div>

      <div
        style={{
          marginTop: "10px",
          fontFamily: "var(--font-display)",
          fontWeight: 700
        }}
      >
        Score: {score}
      </div>

    </div>
  )
}