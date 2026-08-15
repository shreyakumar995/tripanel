import AnswerInput from "./components/AnswerInput";
import QuestionCard from "./components/QuestionCard";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <QuestionCard />
        <AnswerInput />
      </div>
    </div>
  );
}
