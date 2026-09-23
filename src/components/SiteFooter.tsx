export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <div className={`site-footer ${className}`}>
      <p className="site-copyright">© 2026 Chaipawat. All rights reserved.</p>
      <a
        className="creator-mark"
        href="https://github.com/Chaipawat"
        target="_blank"
        rel="noreferrer"
        aria-label="BUILT BY CHAIPAWAT — เปิด GitHub ของ Chaipawat ในแท็บใหม่"
      >
        <span>BUILT BY</span> CHAIPAWAT <i aria-hidden="true">↗</i>
      </a>
    </div>
  );
}
