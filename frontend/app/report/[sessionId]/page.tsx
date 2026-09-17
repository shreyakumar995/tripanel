type ReportPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { sessionId } = await params;

  return (
    <div className="app-shell flex-1 overflow-y-auto bg-[#12141C]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-white/5 bg-[#1B1E29] p-8 sm:p-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Session Report
          </h1>
          <p className="mt-3 text-base text-zinc-400">
            Report for session: {sessionId}
          </p>
        </div>
      </div>
    </div>
  );
}
