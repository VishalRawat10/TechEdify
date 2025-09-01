import { useMemo, useState } from "react";

export default function useWatchDuration() {
  const [lectureDuration, setLectureDuration] = useState();
  const [watchTime, setWatchTime] = useState(0);
  const [totalWatchDuration, setTotalWatchDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState();

  const handleLecturePause = (e) => {
    clearInterval(timerInterval);
    console.log(watchTime);
    console.log(e.target.currentTime);
  };

  const handleLecturePlay = (e) => {
    setTimerInterval(
      setInterval(() => {
        setWatchTime((prev) => prev + 1);
      }, 1000)
    );
  };

  const handleLectureEnd = (e) => {
    clearInterval(timerInterval);
  };

  const handleLoadedLectureMetaData = (e) => {
    console.log("lecture duration is :", e.target.duration);
    setLectureDuration(Math.floor(e.target.duration));
  };

  return {
    handleLectureEnd,
    handleLecturePause,
    handleLecturePlay,
    handleLoadedLectureMetaData,
  };
}
