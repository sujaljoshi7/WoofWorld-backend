import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dogImage from "/puppy.png"; // Ensure correct path

export default function LoadingScreen() {
  const [text, setText] = useState("");
  const loadingText = "Fetching the best treats for your pup...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(loadingText.slice(0, i)); // Properly slice the string
      i++;

      if (i > loadingText.length) clearInterval(interval);
    }, 20); // Slightly slower for a smooth effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white text-center relative overflow-hidden">
      {/* Background Floating Dots Animation */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <div className="absolute top-10 left-20 w-6 h-6 bg-gray-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 right-16 w-8 h-8 bg-gray-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-10 left-32 w-5 h-5 bg-gray-200 rounded-full opacity-60"></div>
      </motion.div>

      {/* Bouncing Dog Icon */}
      <motion.img
        src={dogImage}
        alt="Loading Dog"
        className="w-28 h-28 mb-4"
        animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />

      {/* Typing Effect for Loading Text */}
      <motion.p
        className="text-lg font-semibold text-gray-700 max-w-md"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {text}
      </motion.p>
    </div>
  );
}
