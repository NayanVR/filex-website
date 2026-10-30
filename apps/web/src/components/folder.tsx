import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";

/** The S-curved shoulder that climbs from the folder's body to its tab, as in the Filex mark. */
const Shoulder = () => (
  <svg viewBox="0 0 88 40" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 40C44 40 44 0 88 0V40Z" fill="currentColor" />
  </svg>
);

/** Filex's folder silhouette, the page's one motif. `fill` colours tab and body together. With `href` it is a link. */
export const Folder = ({
  fill,
  href,
  className = "",
  bodyClassName = "",
  style,
  children,
}: {
  fill: string;
  href?: string;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => {
  const Root = href ? "a" : "div";
  // Phrasing content only inside a link.
  const Part = href ? "span" : "div";
  return (
    <Root
      href={href}
      className={`folder ${className}`}
      style={{ "--fill": fill, ...style } as CSSProperties}
    >
      <Part className="folder-tab" aria-hidden="true">
        <Shoulder />
        <span />
      </Part>
      <Part className={`folder-body ${bodyClassName}`}>{children}</Part>
    </Root>
  );
};

// Reveals fire once, when an element's top is 85% of the way down the viewport.
const REVEAL_MARGIN = "0px 0px -15% 0px";

/** Adds .is-in to every [data-reveal] element once it scrolls into view.  */
const useReveal = () => {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not(.is-in)"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: REVEAL_MARGIN }
    );
    for (const target of targets) {
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, []);
};

/** Runs the reveal observer; key it by route so each page's elements are observed. */
export const Reveal = () => {
  useReveal();
  return null;
};
