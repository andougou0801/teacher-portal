-- ============================================================================
-- 「忙しい先生のためのページ」を、管理画面(/admin/life)から編集できるようにする
--
-- これを実行すると life_groups（2件）と life_terms（7件）が作られ、
-- いま src/lib/lifeTerms.ts に入っている内容がそのまま登録されます。
-- ページ下部の公式窓口3件は、既存の official_links に
-- 「忙しい先生のためのページ」というカテゴリーで登録します（004を先に実行してください）。
--
-- つながらないときは lifeTerms.ts の内容にもどるので、表示が消えることはありません。
-- Supabase の SQL Editor に貼り付けて実行してください。何度実行しても安全です。
-- ============================================================================

create table if not exists life_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text not null default '',
  note text,
  sort_order integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists life_terms (
  id uuid primary key default gen_random_uuid(),
  group_title text not null,
  name text not null,
  description text not null default '',
  sub_items jsonb,
  sort_order integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table life_groups enable row level security;
alter table life_terms enable row level security;

drop policy if exists "life groups are publicly readable" on life_groups;
create policy "life groups are publicly readable" on life_groups
  for select using (not hidden);
drop policy if exists "admins can read all life groups" on life_groups;
create policy "admins can read all life groups" on life_groups for select using (is_admin());
drop policy if exists "admins can insert life groups" on life_groups;
create policy "admins can insert life groups" on life_groups for insert with check (is_admin());
drop policy if exists "admins can update life groups" on life_groups;
create policy "admins can update life groups" on life_groups for update using (is_admin()) with check (is_admin());
drop policy if exists "admins can delete life groups" on life_groups;
create policy "admins can delete life groups" on life_groups for delete using (is_admin());

drop policy if exists "life terms are publicly readable" on life_terms;
create policy "life terms are publicly readable" on life_terms
  for select using (not hidden);
drop policy if exists "admins can read all life terms" on life_terms;
create policy "admins can read all life terms" on life_terms for select using (is_admin());
drop policy if exists "admins can insert life terms" on life_terms;
create policy "admins can insert life terms" on life_terms for insert with check (is_admin());
drop policy if exists "admins can update life terms" on life_terms;
create policy "admins can update life terms" on life_terms for update using (is_admin()) with check (is_admin());
drop policy if exists "admins can delete life terms" on life_terms;
create policy "admins can delete life terms" on life_terms for delete using (is_admin());

insert into life_groups (title, icon, note, sort_order)
select * from (values
  ('休みたいときに使える休暇の種類', '🌴', '以下は国家公務員の基準（人事院規則15-14）を「一例」として紹介したものです。教員も含めた地方公務員は都道府県・市区町村ごとに条例が定められており、休暇の種類の数・分類・日数のいずれも、この一例とは異なる場合があります。まずはこのページで大まかなイメージをつかんだうえで、正確なところは必ずお勤め先の都道府県・市区町村の公式サイトでご確認ください。', 1),
  ('育児・介護と仕事を両立するための制度', '👶', '似た名前の制度が多く混同しやすいので、代表的な3つの違いをまとめました。', 2)
) as seed(title, icon, note, sort_order)
where not exists (select 1 from life_groups);

insert into life_terms (group_title, name, description, sub_items, sort_order)
select * from (values
  ('休みたいときに使える休暇の種類', '年次有給休暇（年休）', '理由を問わず、自分の都合で自由に取得できる休暇です。「休みたいから休む」で使えるのはこれです。国家公務員の基準では年20日（人事院規則15-14 第18〜20条）で、多くの自治体もこれに準じています。', null, 1),
  ('休みたいときに使える休暇の種類', '病気休暇', '本人がケガや病気で療養が必要なときに取る休暇です（人事院規則15-14 第21条）。私傷病・妊産疾病は原則連続90日まで、生理日の就業困難や公務・通勤上の傷病、勤務軽減措置も同じ条文でまとめて定められています。年休とは別枠で、医師の診断書などが必要になることが多いです。', null, 2),
  ('休みたいときに使える休暇の種類', '特別休暇', '結婚・忌引・出産・介護・災害など、特別な事情があるときに認められる休暇です。国の基準（人事院規則15-14 第22条）では下記のように号（条文の中の項目番号）ごとに細かく種類が分かれています。号をタップすると詳細が開きます。ただし種類の数・分類・日数は自治体ごとに違うことが多いので、あくまで「一例」としてご覧ください。', '[{"name":"公民権行使（選挙の投票など）","article":"第22条1項1号","duration":"必要と認められる期間","note":"選挙の投票や、裁判員として裁判所に行く場合など、国民としての権利を行使するための休暇です。"},{"name":"官公署への出頭","article":"第22条1項2号","duration":"必要と認められる期間","note":"裁判の証人・鑑定人として呼ばれたときなど、法令により役所や裁判所に出向く義務があるときの休暇です。"},{"name":"骨髄移植のためのドナー登録・提供","article":"第22条1項3号","duration":"必要と認められる期間","note":"骨髄移植等のドナー（提供者）として、骨髄液の提供や、そのための検査・入院をするときの休暇です。"},{"name":"ボランティア活動","article":"第22条1項4号","duration":"1年に5日以内","note":"「本当にあるの？」と思われがちですが、実在する休暇です。ただし何でも使えるわけではなく、報酬を得ずに行う社会貢献活動（被災地でのボランティアや、社会福祉施設での活動など）が対象で、多くの場合、社会福祉協議会など活動を仲介する団体からの証明が必要です。"},{"name":"結婚","article":"第22条1項5号","duration":"連続5暦日以内（結婚の5日前〜結婚後1か月まで）","common":true},{"name":"出生サポート（不妊治療の通院等）","article":"第22条1項5号の2","duration":"1年に5日以内（体外受精・顕微授精は10日）","common":true},{"name":"産前休暇","article":"第22条1項6号","duration":"6週間（多胎妊娠は14週間）","common":true},{"name":"産後休暇","article":"第22条1項7号","duration":"8週間","common":true},{"name":"保育時間（生後1年未満の子の授乳等）","article":"第22条1項8号","duration":"1日2回、各30分以内","note":"生後1年に達しない子を育てている職員が、授乳や搾乳などのために勤務時間中に取れる短い休暇です。"},{"name":"妻の出産に伴う休暇","article":"第22条1項9号","duration":"2日以内","common":true},{"name":"男性の育児参加のための休暇","article":"第22条1項10号","duration":"5日以内","common":true},{"name":"子の看護（就学前の子の病気・予防接種等）","article":"第22条1項11号","duration":"1年に5日以内（子2人以上は10日）","common":true},{"name":"短期の介護","article":"第22条1項12号","duration":"1年に5日以内（要介護者2人以上は10日）","common":true},{"name":"忌引（親族が亡くなったとき）","article":"第22条1項13号","duration":"親族との続柄により日数が異なる","common":true},{"name":"父母の追悼（祥月命日など）","article":"第22条1項14号","duration":"1日以内（父母の死後15年まで）","note":"父母が亡くなった後、命日（祥月命日）などに法要のため休むための休暇です。"},{"name":"夏季休暇","article":"第22条1項15号","duration":"国の基準は7〜9月の間で連続3日以内","note":"これは国家公務員の基準日数です。地方公務員（教員含む）はこれより多いことが一般的で、自治体によっては5〜6日程度の場合もあります。実際の日数は勤務先の条例でご確認ください。","common":true},{"name":"現住居の滅失・破損（災害等）","article":"第22条1項16号","duration":"連続7暦日以内","note":"地震・火災・水害などで自宅に住めなくなったとき、片付けや住まい探しのために取れる休暇です。"},{"name":"出勤困難（交通機関の途絶等）","article":"第22条1項17号","duration":"必要と認められる期間","note":"台風・大雪・公共交通機関の運休など、通勤そのものが困難・危険なときに、出勤しなくても欠勤扱いにならない休暇です。"},{"name":"退勤途上の危険回避（災害等）","article":"第22条1項18号","duration":"必要と認められる期間","note":"勤務中に台風・大雨・地震などが発生し、帰り道が危険な状態になったとき、無理に帰宅せず、安全になるまで待機したり早めに退勤したりできる休暇です（17号「出勤困難」の帰り道バージョンです）。"}]'::jsonb, 3),
  ('休みたいときに使える休暇の種類', '介護休暇・介護時間', '家族の介護が必要になったときに取れる制度です。「介護休暇」はまとまった期間仕事を休む制度（通算6か月以内、3回まで分割可）、「介護時間」は働きながら1日2時間まで勤務時間を短くできる制度（連続3年以内）で、それぞれ別に定められています。', null, 4),
  ('育児・介護と仕事を両立するための制度', '育児休業', '子が3歳になるまで取得できる、仕事を完全に休む制度です。ただし育児休業手当金（給与の代わりに支給されるお金）が出るのは、原則子が1歳になるまで（両親で交代して取る「パパ・ママプラス」を使うと1歳2か月まで）という点に注意が必要です。', null, 1),
  ('育児・介護と仕事を両立するための制度', '育児短時間勤務（育短）', '子が小学校に入学するまでの間、常勤のまま1日の勤務時間そのものを短くできる制度です。原則1年以内の単位で申請しますが、間隔をあけて申請し直せば、通算で最大2年ほど利用できます。', null, 2),
  ('育児・介護と仕事を両立するための制度', '部分休業（部分休）', '子が小学校に入学するまでの間、1日2時間を超えない範囲で（30分単位で）勤務時間を短くできる制度です。育短と似ていますが、短くできる時間の上限や仕組みが異なります。休んだ時間分は給与から差し引かれ、ボーナスの査定にも影響することがあります。', null, 3)
) as seed(group_title, name, description, sub_items, sort_order)
where not exists (select 1 from life_terms);

-- ページ下部の公式窓口（official_links に相乗りさせる）
insert into official_links (name, url, description, when_to_use, category, subject, sort_order)
select * from (values
  ('人事院（休暇制度の条文・人事院規則15-14）', 'https://www.jinji.go.jp/', 'このページで紹介している休暇の「国の基準」の出どころです。', '', '忙しい先生のためのページ', null, 900),
  ('公立学校共済組合（医療費・出産・弔慰金などの給付）', 'https://www.kouritu.or.jp/', '全国の公立学校教職員が加入する共済組合の本部サイトです。手続きの窓口は都道府県ごとの支部になります。', '', '忙しい先生のためのページ', null, 901),
  ('文部科学省「学校における働き方改革について」', 'https://www.mext.go.jp/a_menu/shotou/hatarakikata/index.htm', '勤務時間の上限の指針など、国が出している方針をまとめたページです。', '', '忙しい先生のためのページ', null, 902)
) as seed(name, url, description, when_to_use, category, subject, sort_order)
where not exists (
  select 1 from official_links where category = '忙しい先生のためのページ'
);
(node:21124) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///C:/Users/andou/AppData/Local/Temp/claude/C--Users-andou-OneDrive--------claud-code/93e7fb76-5e26-4d73-a573-3c43f0f1b317/scratchpad/wt/src/lib/lifeTerms.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to \\?\C:\Users\andou\AppData\Local\Temp\claude\C--Users-andou-OneDrive--------claud-code\93e7fb76-5e26-4d73-a573-3c43f0f1b317\scratchpad\wt\package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
