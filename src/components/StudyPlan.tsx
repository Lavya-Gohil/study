'use client'

import { useState } from 'react'

interface Task {
  subject: string
  topic: string
  duration: number
  priority: string
  type: string
  completed?: boolean
}

interface StudyPlanProps {
  tasks: Task[]
  planId: string
  onTaskComplete: (taskIndex: number) => void
}

export default function StudyPlan({ tasks, planId, onTaskComplete }: StudyPlanProps) {
  const completedCount = tasks.filter(t => t.completed).length
  const progress = (completedCount / tasks.length) * 100

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">Today's Study Plan</h3>
          <span className="text-sm text-gray-600">
            {completedCount}/{tasks.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg transition ${getPriorityColor(
              task.priority
            )} ${task.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{task.subject}</span>
                  <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                    {task.type}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">{task.topic}</div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>⏱️ {task.duration}h</span>
                  <span className="capitalize">🎯 {task.priority} priority</span>
                </div>
              </div>
              <button
                onClick={() => onTaskComplete(index)}
                disabled={task.completed}
                className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {task.completed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <span className="text-2xl">🎉</span>
          <p className="text-green-800 font-medium mt-2">
            Congratulations! You've completed today's plan!
          </p>
        </div>
      )}
    </div>
  )
}
