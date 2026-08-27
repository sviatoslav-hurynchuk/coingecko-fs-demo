import React from 'react'

interface LoadingStateProps {
  viewMode: 'cards' | 'table'
}

export const LoadingState: React.FC<LoadingStateProps> = ({ viewMode }) => {
  if (viewMode === 'table') {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 animate-pulse">
        <div className="h-6 bg-gray-800 rounded-lg w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800/60 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 animate-pulse flex flex-col justify-between h-72"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-11 h-11 bg-gray-800 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                <div className="h-3 bg-gray-800/70 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-800/80 rounded-lg w-2/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="h-12 bg-gray-800/50 rounded-xl"></div>
              <div className="h-12 bg-gray-800/50 rounded-xl"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-800/60 rounded w-full"></div>
        </div>
      ))}
    </div>
  )
}
