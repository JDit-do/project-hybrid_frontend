"use client";

import Image from "next/image";

import style from "./index.module.scss";

export default function OnboardingPage() {
  return (
    <section className={style.wrap}>
      <ul>
        <li className={style.service}>
          <div className={style.image}>
            <Image
              src="/images/onboarding/service.svg"
              alt="서비스 이미지"
              width={200}
              height={150}
            />
          </div>
          <span className={style.title}>
            사진 업로드부터 앨범 태그 자동 생성까지 한 번에.
          </span>
        </li>

        <li className={style.infra}>
          <div className={style.image}>
            <Image
              src="/images/onboarding/infra.svg"
              alt="인프라 이미지"
              width={200}
              height={150}
            />
          </div>
          <span className={style.title}>
            확장 가능한 클라우드 인프라로 안정적인 운영.
          </span>
        </li>
      </ul>

      <p className={style.description}>
        Memory에서 AI가 정리해주는 앨범을 시작하세요.
      </p>
    </section>
  );
}
