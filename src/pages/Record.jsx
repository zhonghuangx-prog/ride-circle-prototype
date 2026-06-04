import { useRideSession } from '../context/RideSessionContext';

export default function Record() {
  const { rideRecords } = useRideSession();

  return (
    <section className="flex min-h-[calc(100vh-9rem)] flex-col gap-5 pt-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Ride Journal
        </p>
        <h1 className="text-[34px] font-semibold tracking-tight text-white">
          骑行记录
        </h1>
      </header>

      <div className="space-y-4 pb-6">
        {rideRecords.map((record) => (
          <article
            key={record.id}
            className="glass-ripple relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl transition duration-300 active:scale-[0.98]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  {record.date}
                </p>
                <h2 className="text-lg font-medium text-white">{record.title}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-200">{record.distance}</p>
                <p className="mt-2 text-xs text-white/40">{record.duration}</p>
              </div>
            </div>
            <p className="mt-4 max-w-[88%] text-sm leading-7 text-white/54">
              {record.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
