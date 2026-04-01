/**
 * generate_ppt.js
 * Usage: node generate_ppt.js <agent-profile.md 경로> <소속> <이름> <직급> [출력폴더]
 * Example: node generate_ppt.js ./agent-profile.md "OKH 인재개발팀" "박선우" "사원" "./박선우_평가자료"
 */

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ── 인자 파싱 ──────────────────────────────────────────────
const [,, profilePath, dept, name, rank, outDir] = process.argv;

if (!profilePath || !dept || !name || !rank) {
  console.error("Usage: node generate_ppt.js <profile.md> <소속> <이름> <직급> [출력폴더]");
  process.exit(1);
}

const mdText = fs.readFileSync(profilePath, "utf-8");

// ── agent-profile.md 파싱 ──────────────────────────────────
function extractSection(text, sectionTitle) {
  const lines = text.split("\n");
  const lower = sectionTitle.toLowerCase();
  let startIdx = -1;
  let startDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^(#{1,4})\s+(.*)/);
    if (!hm) continue;
    const headingText = hm[2].replace(/^\d+[..]?\s*/, "").toLowerCase();
    if (headingText.includes(lower) || lower.includes(headingText.replace(/\s/g, ""))) {
      startIdx = i + 1;
      startDepth = hm[1].length;
      break;
    }
  }
  if (startIdx === -1) return "";
  const result = [];
  for (let i = startIdx; i < lines.length; i++) {
    const hm = lines[i].match(/^(#{1,4})\s/);
    if (hm && hm[1].length <= startDepth) break;
    result.push(lines[i]);
  }
  return result.join("\n").trim();
}

function bulletLines(raw, maxLines = 5) {
  return raw
    .split("\n")
    .map(l => l.replace(/^[-*•]\s*/, "").replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, maxLines);
}

function firstLine(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  return lines[0] || "";
}

// 에이전트 이름/제목 추출 (첫 번째 # 제목 또는 파일명)
function extractTitle(text) {
  const m = text.match(/^#\s+(.+)/m);
  if (m) return m[1].trim();
  // 없으면 "해결하려는 문제" 첫 줄에서 키워드 추출
  const prob = extractSection(text, "해결하려는 문제");
  const first = firstLine(prob);
  return first.length > 0 ? first.replace(/Pain Point[:\s]*/i, "").slice(0, 40) : "AI 에이전트";
}

const agentTitle = extractTitle(mdText);

// 각 섹션 추출
const sec1Raw = extractSection(mdText, "해결하려는 문제");
const sec2Raw = extractSection(mdText, "설계 구조")
  || extractSection(mdText, "개발 과정")
  || extractSection(mdText, "개발과정")
  || extractSection(mdText, "설계");
const sec3Raw = extractSection(mdText, "기술적 특이사항")
  || extractSection(mdText, "사용/기대효과")
  || extractSection(mdText, "기대 효과")
  || extractSection(mdText, "기대효과")
  || extractSection(mdText, "사용");

// 개발배경: Pain Point + As-Is → To-Be
const bg_lines = (() => {
  const painM = sec1Raw.match(/Pain Point[^:\n]*[:\n]+([^\n]+)/i);
  const asIsM  = sec1Raw.match(/As-Is[^:\n]*[:\n]+([^\n]+)/i);
  const toBeM  = sec1Raw.match(/To-Be[^:\n]*[:\n]+([^\n]+)/i);
  if (painM || asIsM || toBeM) {
    const lines = [];
    if (painM) lines.push("Pain Point: " + painM[1].trim());
    if (asIsM)  lines.push("As-Is: " + asIsM[1].trim());
    if (toBeM)  lines.push("To-Be: " + toBeM[1].trim());
    return lines;
  }
  return bulletLines(sec1Raw, 4);
})();

// 개발과정: 핵심기능 + 도구 + 어려웠던 점
const dev_lines = (() => {
  const funcM = sec2Raw.match(/핵심 기능[^:\n]*[:\n]+([\s\S]*?)(?=워크플로우|사용한|$)/i);
  const toolM = sec2Raw.match(/도구[^:\n]*[:\n]+([\s\S]*?)(?=\n#{2,3}|$)/i);
  const lines = [];
  if (funcM) bulletLines(funcM[1], 3).forEach(l => lines.push("기능: " + l));
  if (toolM) bulletLines(toolM[1], 2).forEach(l => lines.push("도구: " + l));
  if (lines.length === 0) return bulletLines(sec2Raw, 5);
  return lines.slice(0, 5);
})();

// 사용/기대효과
const effect_lines = bulletLines(sec3Raw, 4);

// ── 색상 팔레트 ─────────────────────────────────────────────
const OK_ORANGE  = "E8431A";
const DARK_BROWN = "4A3B30";
const WHITE      = "FFFFFF";
const LIGHT_BG   = "F8F8F8";
const TEXT_DARK  = "2B2B2B";
const TEXT_MID   = "555555";
const BORDER_01  = "E8431A";
const BORDER_02  = "2B6CB0";
const BORDER_03  = "2E7D32";
const CARD_LINE  = "E0E0E0";

// ── PPT 생성 ───────────────────────────────────────────────
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" × 5.625"

const slide = pres.addSlide();

// 전체 배경
slide.background = { color: LIGHT_BG };

// ── 상단 헤더 바 ──
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.72,
  fill: { color: DARK_BROWN }, line: { color: DARK_BROWN }
});

// 오렌지 포인트 선
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0.72, w: 10, h: 0.055,
  fill: { color: OK_ORANGE }, line: { color: OK_ORANGE }
});

// 산출물 제목 (에이전트명에서 자동 추출)
slide.addText(agentTitle, {
  x: 0.38, y: 0, w: 7.5, h: 0.72,
  fontSize: 20, bold: true, color: WHITE,
  fontFace: "Arial", valign: "middle", margin: 0
});

// AI Engineer 뱃지
slide.addShape(pres.shapes.RECTANGLE, {
  x: 7.8, y: 0.12, w: 1.3, h: 0.38,
  fill: { color: OK_ORANGE }, line: { color: OK_ORANGE },
  rectRadius: 0.04
});
slide.addText("AI Engineer", {
  x: 7.8, y: 0.12, w: 1.3, h: 0.38,
  fontSize: 9, bold: true, color: WHITE,
  fontFace: "Arial", align: "center", valign: "middle", margin: 0
});

// 소속 + 이름 + 직급
slide.addText(`${dept}  ${name} ${rank}`, {
  x: 0.38, y: 0.80, w: 9.2, h: 0.32,
  fontSize: 10.5, color: TEXT_MID, fontFace: "Arial",
  bold: false, valign: "middle", margin: 0
});

// ── 3개 섹션 카드 ─────────────────────────────────────────
const cards = [
  { num: "01", title: "개발배경",    border: BORDER_01, lines: bg_lines },
  { num: "02", title: "개발과정",    border: BORDER_02, lines: dev_lines },
  { num: "03", title: "사용/기대효과", border: BORDER_03, lines: effect_lines },
];

const cardX     = [0.25, 3.5, 6.75];
const cardW     = 3.0;
const cardH     = 3.65;
const cardY     = 1.22;
const numRadius = 0.19; // circle radius (approx)

cards.forEach((card, i) => {
  const cx = cardX[i];

  // 카드 배경
  slide.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cardY, w: cardW, h: cardH,
    fill: { color: WHITE },
    line: { color: CARD_LINE, width: 0.5 },
    shadow: { type: "outer", color: "000000", blur: 5, offset: 2, angle: 135, opacity: 0.08 }
  });

  // 왼쪽 색상 액센트 바
  slide.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cardY, w: 0.07, h: cardH,
    fill: { color: card.border }, line: { color: card.border }
  });

  // 번호 원형 배지
  slide.addShape(pres.shapes.OVAL, {
    x: cx + 0.18, y: cardY + 0.13, w: 0.38, h: 0.38,
    fill: { color: card.border }, line: { color: card.border }
  });
  slide.addText(card.num, {
    x: cx + 0.18, y: cardY + 0.13, w: 0.38, h: 0.38,
    fontSize: 10, bold: true, color: WHITE,
    fontFace: "Arial", align: "center", valign: "middle", margin: 0
  });

  // 섹션 제목
  slide.addText(card.title, {
    x: cx + 0.64, y: cardY + 0.13, w: cardW - 0.74, h: 0.38,
    fontSize: 12, bold: true, color: TEXT_DARK,
    fontFace: "Arial", valign: "middle", margin: 0
  });

  // 구분선
  slide.addShape(pres.shapes.LINE, {
    x: cx + 0.15, y: cardY + 0.60, w: cardW - 0.25, h: 0,
    line: { color: CARD_LINE, width: 0.8 }
  });

  // 본문 내용 - 빈 경우 placeholder
  const bodyLines = card.lines.length > 0
    ? card.lines
    : ["(내용 없음 — agent-profile.md 확인)"];

  const richText = bodyLines.map((l, idx) => ({
    text: l,
    options: {
      bullet: true,
      breakLine: idx < bodyLines.length - 1,
      fontSize: 9.5,
      color: TEXT_MID,
      fontFace: "Arial"
    }
  }));

  slide.addText(richText, {
    x: cx + 0.2, y: cardY + 0.70, w: cardW - 0.35, h: cardH - 0.85,
    valign: "top", margin: 4,
    paraSpaceAfter: 4
  });
});

// ── 하단 푸터 ──
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.3, w: 10, h: 0.325,
  fill: { color: DARK_BROWN }, line: { color: DARK_BROWN }
});

slide.addText("AI Engineer 2기 | OK금융그룹 인재개발팀", {
  x: 0.35, y: 5.3, w: 6, h: 0.325,
  fontSize: 8.5, color: "AAAAAA",
  fontFace: "Arial", valign: "middle", margin: 0
});

// ── 출력 ──
const outputFolder = outDir || ".";
if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

const safeName = name.replace(/\s+/g, "_");
const fileName = path.join(outputFolder, `${safeName}_발표자료.pptx`);

pres.writeFile({ fileName }).then(() => {
  console.log(`✅ PPT 생성 완료: ${fileName}`);
}).catch(err => {
  console.error("❌ PPT 생성 실패:", err);
  process.exit(1);
});
