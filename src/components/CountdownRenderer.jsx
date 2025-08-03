import Countdown from 'react-countdown';

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span className="text-green-600 font-semibold">Time's up!</span>;
  } else {
    return (
      <div className="flex gap-4 text-center">
        {[{ label: 'Days', value: days }, { label: 'Hours', value: hours }, { label: 'Minutes', value: minutes }, { label: 'Seconds', value: seconds }].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center bg-blue-600 text-white px-2 py-2 rounded-lg w-18 shadow-md"
          >
            <span className="text-xl font-bold">{item.value}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }
};

export default function CountdownRenderer({ endDate }) {
  return (
    <Countdown date={new Date(endDate)} renderer={renderer} />
  );
}
