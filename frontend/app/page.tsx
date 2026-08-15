import AnswerInput from "./components/AnswerInput";
import QuestionCard from "./components/QuestionCard";
import ScorePanel from "./components/ScorePanel";

const DUMMY_RESULTS = [
  {
    persona: "Strict Technical Reviewer",
    score: 7,
    reasoning:
      "Solid approach but missed the edge case where the input array is empty.",
    weaknesses: ["Edge case handling", "Time complexity not mentioned"],
  },
  {
    persona: "Friendly HR Interviewer",
    score: 8,
    reasoning: "Clear and confident explanation, good structure.",
    weaknesses: ["Could be more concise"],
  },
  {
    persona: "System Design Skeptic",
    score: 5,
    reasoning:
      "No mention of what happens at scale or with concurrent requests.",
    weaknesses: ["No scalability discussion", "No assumptions stated"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-100 px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <QuestionCard />
        <AnswerInput />
        <ScorePanel results={DUMMY_RESULTS} />
      </div>
    </div>
  );
}
