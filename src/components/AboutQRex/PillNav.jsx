import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PillNav.css'; // 위에서 만든 CSS import

const PillNav = ({
  items,          // [{ label: 'Name', id: 'value' }]
  activeTabId,    // 현재 선택된 탭 ID
  onTabChange,    // 탭 변경 함수
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#f1f5f9',      // 배경색 (slate-100)
  pillColor = '#84cc16',      // 활성/호버 색 (lime-500)
  pillTextColor = '#64748b',  // 기본 글자색 (slate-500)
  hoveredPillTextColor = '#ffffff', // 호버/활성 글자색 (white)
}) => {
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);

  // GSAP 애니메이션 레이아웃 계산
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        
        // 원의 크기와 위치 계산 (React Bits 원본 로직)
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        // 초기 설정
        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        // 텍스트 위치 초기화
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        // 타임라인 생성 (호버 시 실행될 애니메이션)
        tlRefs.current[i]?.kill();
        const tl = gsap.timeline({ paused: true });

        // 1. 원이 커지는 효과
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.6, ease, overwrite: 'auto' }, 0);

        // 2. 텍스트가 위로 올라가는 효과
        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.6, ease, overwrite: 'auto' }, 0);
        }
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 20), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.6, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[i] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    // 폰트 로딩 후 레이아웃 다시 계산 (안전장치)
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener('resize', layout);
  }, [items, ease]);

  // 마우스 올렸을 때
  const handleEnter = (i) => {
    // 이미 활성화된 탭이면 호버 효과 무시 (원하면 제거 가능)
    if (items[i].id === activeTabId) return; 

    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  // 마우스 떠났을 때
  const handleLeave = (i) => {
    if (items[i].id === activeTabId) return;

    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  // CSS 변수 주입
  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': pillTextColor
  };

  return (
    <div className={`pill-nav ${className}`} style={cssVars}>
      <ul className="pill-list">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              className={`pill ${activeTabId === item.id ? 'is-active' : ''}`}
              onClick={() => onTabChange(item.id)}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              aria-label={item.label}
            >
              {/* 호버 애니메이션용 원 */}
              <span
                className="hover-circle"
                aria-hidden="true"
                ref={(el) => (circleRefs.current[i] = el)}
              />
              
              {/* 텍스트 스택 (기본 + 호버시 올라올 텍스트) */}
              <span className="label-stack">
                <span className="pill-label">{item.label}</span>
                <span className="pill-label-hover" aria-hidden="true">
                  {item.label}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PillNav;