import Countdown from 'react-countdown';

// Custom renderer
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span className="text-green-600 font-semibold">Time's up!</span>;
  } else {
    return (
      <div className="flex gap-4 text-center">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{days}</span>
          <span className="text-xs text-gray-500">Days</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{hours}</span>
          <span className="text-xs text-gray-500">Hours</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{minutes}</span>
          <span className="text-xs text-gray-500">Minutes</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{seconds}</span>
          <span className="text-xs text-gray-500">Seconds</span>
        </div>
      </div>
    );
  }
};

export default function CountdownRenderer() {
  return (
    <Countdown date={new Date("2025-12-31T23:59:59")} renderer={renderer} />
  );
}
