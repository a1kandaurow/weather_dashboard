import { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  weatherCondition?: string; // clear, clouds, rain, snow, etc.
  isDay: boolean;
}

export default function WeatherBackground({
  weatherCondition,
  isDay,
}: WeatherBackgroundProps) {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!weatherCondition) {
      setParticles([]);
      return;
    }

    const newParticles: JSX.Element[] = [];

    // Облака (для облачной погоды)
    if (weatherCondition.includes("clouds")) {
      for (let i = 0; i < 8; i++) {
        newParticles.push(
          <div
            key={`cloud-${i}`}
            className="absolute animate-float-slow"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${-20 + Math.random() * 120}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${20 + Math.random() * 20}s`,
            }}
          >
            <Cloud
              size={60 + Math.random() * 80}
              opacity={0.3 + Math.random() * 0.3}
            />
          </div>,
        );
      }
    }

    // Дождь
    if (
      weatherCondition.includes("rain") ||
      weatherCondition.includes("drizzle")
    ) {
      for (let i = 0; i < 50; i++) {
        newParticles.push(
          <div
            key={`rain-${i}`}
            className="absolute animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10 + Math.random() * 10}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          >
            <div className="w-0.5 h-6 bg-blue-400/60" />
          </div>,
        );
      }
    }

    // Снег
    if (weatherCondition.includes("snow")) {
      for (let i = 0; i < 50; i++) {
        newParticles.push(
          <div
            key={`snow-${i}`}
            className="absolute animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10 + Math.random() * 10}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full opacity-80" />
          </div>,
        );
      }
    }

    // Солнце (для ясной погоды днём)
    if (weatherCondition.includes("clear") && isDay) {
      newParticles.push(
        <div key="sun" className="absolute top-20 right-20 animate-pulse-slow">
          <Sun />
        </div>,
      );
    }

    // Звёзды (для ясной погоды ночью)
    if (weatherCondition.includes("clear") && !isDay) {
      for (let i = 0; i < 30; i++) {
        newParticles.push(
          <div
            key={`star-${i}`}
            className="absolute animate-twinkle"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>,
        );
      }
      // Луна
      newParticles.push(
        <div key="moon" className="absolute top-20 right-20">
          <Moon />
        </div>,
      );
    }

    // Гроза
    if (weatherCondition.includes("thunderstorm")) {
      newParticles.push(
        <div key="lightning" className="absolute inset-0">
          <Lightning />
        </div>,
      );
      // Добавляем дождь к грозе
      for (let i = 0; i < 50; i++) {
        newParticles.push(
          <div
            key={`rain-thunder-${i}`}
            className="absolute animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-10 + Math.random() * 10}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.3 + Math.random() * 0.3}s`,
            }}
          >
            <div className="w-0.5 h-6 bg-blue-300/70" />
          </div>,
        );
      }
    }

    setParticles(newParticles);
  }, [weatherCondition, isDay]);

  // Определяем цвет фона в зависимости от погоды и времени суток
  const getBackgroundGradient = () => {
    if (!weatherCondition) {
      return "from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900";
    }

    if (!isDay) {
      // Ночные градиенты
      if (weatherCondition.includes("clear")) {
        return "from-indigo-900 via-purple-900 to-blue-900";
      }
      if (weatherCondition.includes("clouds")) {
        return "from-gray-800 via-slate-800 to-gray-900";
      }
      if (
        weatherCondition.includes("rain") ||
        weatherCondition.includes("thunderstorm")
      ) {
        return "from-slate-900 via-gray-900 to-slate-800";
      }
      if (weatherCondition.includes("snow")) {
        return "from-blue-900 via-slate-800 to-gray-900";
      }
      return "from-gray-900 via-blue-900 to-purple-900";
    }

    // Дневные градиенты
    if (weatherCondition.includes("clear")) {
      return "from-sky-300 via-blue-400 to-cyan-300";
    }
    if (weatherCondition.includes("clouds")) {
      return "from-gray-300 via-slate-300 to-blue-300";
    }
    if (
      weatherCondition.includes("rain") ||
      weatherCondition.includes("drizzle")
    ) {
      return "from-slate-400 via-gray-400 to-blue-400";
    }
    if (weatherCondition.includes("thunderstorm")) {
      return "from-gray-600 via-slate-700 to-gray-800";
    }
    if (weatherCondition.includes("snow")) {
      return "from-blue-100 via-slate-200 to-gray-200";
    }

    return "from-blue-200 via-purple-200 to-pink-200";
  };

  return (
    <div
      className={`fixed inset-0 -z-10 bg-gradient-to-br transition-all duration-1000 ${getBackgroundGradient()}`}
    >
      <div className="absolute inset-0 overflow-hidden">{particles}</div>
    </div>
  );
}

// Компонент облака
function Cloud({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      fill="white"
      style={{ opacity }}
    >
      <ellipse cx="25" cy="40" rx="20" ry="18" />
      <ellipse cx="45" cy="30" rx="25" ry="22" />
      <ellipse cx="70" cy="35" rx="20" ry="18" />
      <ellipse cx="50" cy="45" rx="30" ry="15" />
    </svg>
  );
}

// Компонент солнца
function Sun() {
  return (
    <div className="relative">
      <div className="w-20 h-20 bg-yellow-300 rounded-full animate-pulse-slow" />
      <div className="absolute inset-0 w-20 h-20 bg-yellow-200 rounded-full blur-xl animate-pulse-slow" />
    </div>
  );
}

// Компонент луны
function Moon() {
  return (
    <div className="relative">
      <div className="w-16 h-16 bg-gray-200 rounded-full" />
      <div className="absolute top-1 left-2 w-14 h-14 bg-indigo-900 rounded-full" />
    </div>
  );
}

// Компонент молнии
function Lightning() {
  return (
    <div className="animate-lightning">
      <svg
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-40 text-yellow-200 opacity-0"
        viewBox="0 0 10 100"
        fill="currentColor"
      >
        <path d="M5 0 L7 40 L4 40 L6 100 L3 50 L6 50 Z" />
      </svg>
    </div>
  );
}
