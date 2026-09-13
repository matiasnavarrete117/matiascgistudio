import React, { useState } from 'react';

export default function MetallicLogo({ lang, className = '' }: { lang: 'es' | 'en'; className?: string }) {
  const [sweep, setSweep] = useState(0);
  const activate = () => setSweep(value => value + 1);
  return (
    <a href="#" aria-label={lang === 'es' ? 'Ir al inicio' : 'Back to top'}
      className={'metallic-logo shrink-0 ' + className}
      onPointerEnter={event => { if (event.pointerType === 'mouse') activate(); }}
      onPointerDown={activate} onFocus={activate}>
      <img src="https://i.ibb.co/krv9LzL/mci-metallic-transparent-logo.png"
        alt="Matías CGI" width={805} height={529} decoding="async" loading="eager"
        referrerPolicy="no-referrer" />
      {sweep > 0 && <span key={sweep} className="metallic-logo-reflection" aria-hidden="true" />}
    </a>
  );
}
