import Link from "next/link";
import { Fragment } from "react";

const LEDGER_HREF = "/how-its-built#ledger-title";
const CLAIM_RE = /\s*\((CL-\d{3})\)/g;

/** Copy carries claim ids inline as "(CL-004)"; render each as a small mono
 *  link into the public ledger instead of parenthesised text. */
export function WithClaims({ text }: { text: string }) {
  const parts = text.split(CLAIM_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Fragment key={i}>
            {" "}
            <Link href={LEDGER_HREF} className="ae-num text-xs text-link hover:underline">
              {part}
            </Link>
          </Fragment>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
