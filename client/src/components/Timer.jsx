import { useState, useEffect, useRef } from 'react';
import { AlarmClock, ChevronLeft, CirclePause, CirclePlay, RotateCcw } from 'lucide-react';

export default function Timer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // time in seconds
  const intervalRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/Stop timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Handle timer toggle
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Handle reset
  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  // Handle expand/collapse
  const toggleExpanded = () => {
    if (isExpanded) {
      // If collapsing, also stop the timer
      setIsRunning(false);
    } else {
      // If expanding, start the timer automatically
      setIsRunning(true);
    }
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    // Collapsed state - just the clock icon
    return (
      <div className="bg-[#2A2A2A] rounded-sm px-3 py-2 flex items-center">
        <button
          className="w-5 cursor-pointer text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center"
          aria-label="Start Timer"
          onClick={toggleExpanded}
        >
          <AlarmClock className="h-5 w-5" />
        </button>
      </div>
    );
  }

  // Expanded state - full timer controls
  return (
    <div className="flex items-center gap-1">
      {/* Hide Timer Button */}
      <div className="bg-[#2A2A2A] rounded-sm rounded-r-none px-3 py-2 flex items-center">
        <button
          className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center cursor-pointer"
          aria-label="Hide Timer"
          onClick={toggleExpanded}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Timer Controls and Display */}
      <div className="bg-[#2A2A2A] rounded-none px-3 py-2 flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center cursor-pointer"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
          onClick={toggleTimer}
        >
          {isRunning ? (
            <CirclePause className="h-5 w-5" />
          ) : (
            <CirclePlay className="h-5 w-5" />
          )}
        </button>

        {/* Timer Display */}
        <button
          className="text-sm font-mono text-white h-full flex items-center cursor-pointer"
          aria-label="Timer Display"
          onClick={toggleTimer}
        >
          {formatTime(time)}
        </button>
      </div>

      {/* Reset Button */}
      <div className="bg-[#2A2A2A] rounded-sm rounded-l-none px-3 py-2 flex items-center">
        <button
          className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center cursor-pointer"
          aria-label="Reset Timer"
          onClick={resetTimer}
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}