import Countdown from 'react-countdown';

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <div className="flex items-center justify-center gap-2 text-green-500 font-black uppercase tracking-widest text-xs">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Campaign Successfully Ended
      </div>
    );
  } else {
    return (
      <div className="flex justify-between items-center gap-4">
        {[
          { label: 'Days', value: days },
          { label: 'Hrs', value: hours },
          { label: 'Min', value: minutes },
          { label: 'Sec', value: seconds }
        ].map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {item.label}
            </span>
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
