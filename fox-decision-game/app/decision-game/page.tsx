
'use client'

import { useState } from "react"
import { Howl } from "howler"
import { motion } from "framer-motion"
import Image from "next/image"

const choices = [
  { label: "Quan sát thêm", score: 0, sound: "/observe.mp3" },
  { label: "Tấn công", score: 2, sound: "/hunt.mp3" },
  { label: "Bỏ qua", score: -1, sound: "/pass.mp3" },
]

const getRandomPreyImage = () => {
  const index = Math.floor(Math.random() * 3) + 1
  return `/fox-prey${index}.png`
}

export default function DecisionGame() {
  const [logs, setLogs] = useState<any[]>([])
  const [currentImage, setCurrentImage] = useState(getRandomPreyImage())
  const [gameOver, setGameOver] = useState(false)

  const playSound = (src: string) => {
    const sound = new Howl({ src: [src] })
    sound.play()
  }

  const handleChoice = (choice: any) => {
    if (gameOver) return
    playSound(choice.sound)
    const log = {
      image: currentImage,
      choice: choice.label,
      score: choice.score,
    }
    setLogs([...logs, log])
    setCurrentImage(getRandomPreyImage())
  }

  const endGame = () => setGameOver(true)

  const totalScore = logs.reduce((sum, log) => sum + log.score, 0)

  const decisionStyle =
    totalScore >= 6
      ? "Dám mạo hiểm"
      : totalScore >= 3
      ? "Cân bằng"
      : totalScore >= 0
      ? "Cẩn trọng"
      : "Rất thận trọng / né tránh"

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🦊 Game Phong Cách Ra Quyết Định</h1>

      {!gameOver && (
        <>
          <Image
            src={currentImage}
            alt="prey"
            width={300}
            height={200}
            className="mx-auto mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {choices.map((choice) => (
              <button
                key={choice.label}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2"
                onClick={() => handleChoice(choice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
              onClick={endGame}
            >
              Kết thúc lượt chơi
            </button>
          </div>
        </>
      )}

      {gameOver && (
        <div className="mt-8 p-4 bg-gray-100 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">🎯 Kết quả của bạn</h2>
          <p className="mb-2">Tổng điểm: <strong>{totalScore}</strong></p>
          <p className="mb-2">Phong cách ra quyết định: <strong>{decisionStyle}</strong></p>
          <h3 className="font-semibold mt-4">Chi tiết các lượt:</h3>
          <ul className="list-disc list-inside">
            {logs.map((log, i) => (
              <li key={i}>
                <span className="italic">{log.choice}</span> (Điểm: {log.score})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
