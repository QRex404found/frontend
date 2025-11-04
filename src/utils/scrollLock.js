// utils/scrollLock.js
// 안전한 scroll lock: 현재 스크롤 위치 저장 -> body를 fixed로 고정 -> padding-right 보정

const KEY = '__app_scroll_lock_v2__';

function getState() {
  if (!window[KEY]) {
    window[KEY] = {
      count: 0,
      scrollY: 0,
      originalOverflow: '',
      originalPaddingRight: '',
      originalPosition: '',
      originalTop: '',
    };
  }
  return window[KEY];
}

export function lockScroll() {
  if (typeof window === 'undefined') return;
  const state = getState();
  state.count += 1;
  if (state.count > 1) return;

  const body = document.body;
  const docEl = document.documentElement;

  // 저장
  state.scrollY = window.scrollY || window.pageYOffset || 0;
  state.originalOverflow = body.style.overflow || '';
  state.originalPaddingRight = body.style.paddingRight || '';
  state.originalPosition = body.style.position || '';
  state.originalTop = body.style.top || '';

  // 스크롤바 폭 계산
  const scrollbarWidth = window.innerWidth - docEl.clientWidth;
  const computedPaddingRight = parseFloat(getComputedStyle(body).paddingRight || '0') || 0;

  // 적용: body를 fixed로 만들어 화면 전체의 스크롤/레이아웃 이동을 방지
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
  }
  body.style.position = 'fixed';
  body.style.top = `-${state.scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
}

export function unlockScroll(force = false) {
  if (typeof window === 'undefined') return;
  const state = getState();
  if (force) state.count = 0;
  else state.count = Math.max(0, state.count - 1);
  if (state.count > 0) return;

  const body = document.body;

  // 복구
  body.style.overflow = state.originalOverflow || '';
  body.style.paddingRight = state.originalPaddingRight || '';
  body.style.position = state.originalPosition || '';
  body.style.top = state.originalTop || '';
  body.style.left = '';
  body.style.right = '';

  // 스크롤 위치 복원 (setTimeout 0을 쓰면 브라우저가 스타일 복구 후 스크롤 복원)
  const scrollY = state.scrollY || 0;
  window.scrollTo(0, scrollY);

  // 초기화
  state.scrollY = 0;
  state.originalOverflow = '';
  state.originalPaddingRight = '';
  state.originalPosition = '';
  state.originalTop = '';
}
