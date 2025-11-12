"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizAnswer {
  fitness_goal: string
  current_fitness_level: string
  workout_frequency: string
  workout_duration: string
  workout_preference: string
  activity_level: string
  diet_preference: string
  health_conditions: string
  sleep_hours: string
  stress_level: string
}

const QUIZ_QUESTIONS = [
  {
    id: "fitness_goal",
    question: "What is your primary fitness goal?",
    options: ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility", "General Fitness"],
  },
  {
    id: "current_fitness_level",
    question: "What is your current fitness level?",
    options: ["Beginner", "Intermediate", "Advanced", "Professional Athlete"],
  },
  {
    id: "workout_frequency",
    question: "How often can you workout per week?",
    options: ["1-2 times", "3-4 times", "5-6 times", "Daily"],
  },
  {
    id: "workout_duration",
    question: "How long can you spend per workout?",
    options: ["15-30 min", "30-45 min", "45-60 min", "60+ min"],
  },
  {
    id: "workout_preference",
    question: "What type of exercise do you prefer?",
    options: ["Strength Training", "Cardio", "Yoga/Pilates", "Mixed/HIIT", "Sports"],
  },
  {
    id: "activity_level",
    question: "What is your daily activity level?",
    options: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
  },
  {
    id: "diet_preference",
    question: "What diet approach interests you?",
    options: ["Balanced", "High Protein", "Keto", "Vegetarian/Vegan", "No Preference"],
  },
  {
    id: "health_conditions",
    question: "Do you have any health conditions to consider?",
    options: ["None", "Knee Issues", "Back Issues", "Joint Issues", "Other"],
  },
  {
    id: "sleep_hours",
    question: "How many hours of sleep do you get per night?",
    options: ["Less than 5", "5-6 hours", "6-7 hours", "7-8 hours", "8+ hours"],
  },
  {
    id: "stress_level",
    question: "What is your typical stress level?",
    options: ["Low", "Moderate", "High", "Very High"],
  },
]

interface FitnessQuizProps {
  onComplete: (answers: QuizAnswer) => void
  isLoading?: boolean
}

export function FitnessQuiz({ onComplete, isLoading = false }: FitnessQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswer>>({})

  const currentQ = QUIZ_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete(answers as QuizAnswer)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQ.id]: value,
    })
  }

  const isAnswered = answers[currentQ.id as keyof QuizAnswer] !== undefined
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1

  return (
    <div className="w-full min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-2xl">Personalization Quiz</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </p>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold">{currentQ.question}</h3>

          <RadioGroup value={answers[currentQ.id as keyof QuizAnswer] || ""} onValueChange={handleAnswer}>
            <div className="space-y-2">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id as keyof QuizAnswer] === option
                return (
                  <div
                    key={option}
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={option} disabled={isLoading} className="flex-shrink-0" />
                    <Label htmlFor={option} className={cn("cursor-pointer flex-1", isSelected && "font-medium")}>
                      {option}
                    </Label>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                  </div>
                )
              })}
            </div>
          </RadioGroup>

          <div className="flex gap-3 justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0 || isLoading}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button onClick={handleNext} disabled={!isAnswered || isLoading} className="bg-rose-500 hover:bg-rose-600">
              {isLastQuestion ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Complete"}
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
