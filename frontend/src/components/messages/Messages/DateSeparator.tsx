import { formatDateSeparator } from "../../../lib/convertDate";

const DateSeparator = ({ date }: { date: string }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-neutral-200" />
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
        {formatDateSeparator(date)}
      </span>
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  );
};

export default DateSeparator;
