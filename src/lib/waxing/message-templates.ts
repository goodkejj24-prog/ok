import type { Customer, Reservation } from './types';

/** 1) 예약 확정 문자 */
export function bookingMessage(customer: Customer, reservation: Reservation): string {
  const dateStr = formatDate(reservation.date);
  return `${customer.name}님 안녕하세요 💕
${dateStr} ${reservation.time}에 왁싱 예약이 확정되었습니다 ✨

혹시 일정 변경이 필요하시면 하루 전까지 편하게 연락주세요! 📞

안내드릴 사항이 하나 있어요 🙏
예약 시간에 맞춰 준비하고 있어서, 당일 무단 불참 시에는 노쇼비 2만원이 발생하는 점 너그러이 양해 부탁드려요 🥺
노쇼비는 시술비에서 차감되어 차액만 결제하시면 되니 부담 갖지 않으셔도 돼요! 😊

💳 카카오뱅크 3333-04-2140067 김*정

🅿️ 참고로 매장 전용 주차장이 없어서, 근처 공영주차장이나 대중교통 이용 부탁드려요!

그럼 당일 뵙겠습니다 🤗
Waxing Artist, Eunjeong 💜`;
}

/** 2) 예약 전날 리마인드 문자 */
export function dayBeforeMessage(customer: Customer, reservation: Reservation): string {
  const dateStr = formatDate(reservation.date);
  return `${customer.name}님 안녕하세요 💕
내일 ${dateStr} ${reservation.time} 왁싱 예약 안내드려요! 📅

시술 전 참고사항 알려드릴게요 📝
✔️ 시술 부위 면도는 하지 말아주세요 (모발 길이 0.5cm 이상 유지)
✔️ 시술 당일 보습제/오일 사용을 삼가주세요
✔️ 편한 옷차림으로 오시면 좋아요

내일 뵙겠습니다! 🤗
일정 변경이 필요하시면 오늘 중으로 연락 부탁드려요 📞
Waxing Artist, Eunjeong 💜`;
}

/** 3) 시술 후 주의사항 문자 */
export function aftercareMessage(customer: Customer): string {
  return `${customer.name}님, 오늘 시술 감사합니다 🥰
왁싱 후 주의사항 간단히 안내드려요! 📝

🚿 24시간 내 뜨거운 물(사우나, 반신욕) 삼가주세요
👗 시술 부위 꽉 끼는 옷 피해주세요
🏊 2~3일간 격한 운동, 수영장 이용 삼가주세요
🙅 시술 부위를 손으로 만지거나 터치하는 건 피해주세요
🧴 피부에 아무 이상이 없다면 1주일 후부터 부드럽게 각질/보습 관리 가능해요!

궁금한 점 있으시면 편하게 연락주세요 😊
Waxing Artist, Eunjeong 💜`;
}

/** 4) 5주 뒤 재예약 안내 문자 */
export function reminderMessage(customer: Customer): string {
  return `${customer.name}님 안녕하세요 💕
지난 시술 후 벌써 5주가 지났네요! ⏰

왁싱은 약 5주 주기로 관리해주시면 더 깔끔한 결과를 유지하실 수 있어요 ✨
편하신 시간에 예약 잡아주시면 감사하겠습니다! 🗓️

Waxing Artist, Eunjeong 💜`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[d.getDay()];
  return `${month}월 ${day}일(${weekday})`;
}
