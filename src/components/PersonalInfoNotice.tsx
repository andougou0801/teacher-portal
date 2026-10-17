import type { PersonalInfoRisk } from "@/lib/personalInfoCheck";

/** 投稿フォームの上に常に出しておく、書き方のお願い。 */
export function PostingGuideline() {
  return (
    <div className="mb-3 rounded-xl border border-warn-line bg-warn-bg p-3 text-[13px] text-warn">
      <p className="font-bold">投稿するときのお願い</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-4">
        <li>児童生徒の名前、学校名、学年・学級は書かないでください</li>
        <li>保護者や同僚のことは、個人が分からない形に書きかえてください</li>
        <li>書き込みは誰でも読めます。消したいときは通報ボタンからお知らせください</li>
      </ul>
    </div>
  );
}

/** 送信前の確認。個人情報らしき記述が見つかったときだけ出す。 */
export function PersonalInfoWarning({ risks }: { risks: PersonalInfoRisk[] }) {
  return (
    <div className="rounded-xl border border-[#c0392b] bg-[#FDF0EE] p-3 text-[13px] text-[#c0392b]">
      <p className="font-bold">
        個人情報かもしれない記述が見つかりました。送信する前にご確認ください。
      </p>
      <ul className="mt-1 list-disc space-y-0.5 pl-4">
        {risks.map((risk) => (
          <li key={`${risk.label}-${risk.found}`}>
            {risk.label}：「{risk.found}」
          </li>
        ))}
      </ul>
      <p className="mt-1.5">
        書きかえる場合は、上の入力欄を直してからもう一度送信してください。
        問題なければ、下のボタンをもう一度押すとそのまま投稿します。
      </p>
    </div>
  );
}
