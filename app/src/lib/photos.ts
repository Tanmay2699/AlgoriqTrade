/**
 * Editorial photography — lifestyle images, not product captures. They show
 * people doing the work (reading, journaling, reviewing), never a screen we
 * claim is the terminal; real product visuals go through ProductFrame and
 * its capture manifest, which is the only path allowed to say "this is our
 * UI" (README rule 4).
 *
 * Source files were cropped at export to remove the generator watermark
 * (originals live outside public/ in redesign/source-images/ so they are
 * never served). All are 1232×768.
 */

export interface Photo {
  src: string;
  alt: string;
}

const p = (file: string, alt: string): Photo => ({ src: `/images/${file}.webp`, alt });

export const PHOTOS = {
  closedLaptopPhone: p(
    "closed-laptop-and-glowing-phone",
    "A laptop and phone on a dark desk, both showing market charts",
  ),
  handPhone: p("hand-hovering-over-phone-screen", "A hand about to tap a glowing phone screen"),
  handPhone2: p(
    "hand-hovering-over-phone-screen-2",
    "A finger hovering over a phone lying on a bright white desk",
  ),
  laptopPhoneDesk: p(
    "laptop-and-phone-on-desk",
    "A closed laptop beside a phone on a light wooden desk",
  ),
  tablet: p("man-comparing-layouts-on-tablet", "A man on a sofa studying charts on a tablet"),
  tablet2: p(
    "man-comparing-layouts-on-tablet-2",
    "A smiling man comparing two layouts on a tablet in a sunlit room",
  ),
  leaningBack: p(
    "man-leaning-back-at-desk",
    "A relaxed man leaning back from his laptop, hands behind his head",
  ),
  leaningBack2: p(
    "man-leaning-back-from-desk",
    "A man sitting back from his desk in a dim study, thinking",
  ),
  lookingPhone: p("man-looking-at-phone", "A young man smiling at his phone by a window"),
  monitorsNight: p(
    "man-sitting-at-computer-monitors",
    "A man at a three-monitor desk at night, charts and code on screen",
  ),
  deskSunset: p(
    "man-sitting-at-desk",
    "A man working at a dual-monitor desk as the sun sets behind him",
  ),
  laptopFloor: p(
    "man-sitting-with-laptop-and",
    "A man sitting cross-legged on the floor with a laptop and notebook",
  ),
  smilingPhone: p(
    "man-smiling-at-phone",
    "A man smiling at his phone at a window seat in the evening",
  ),
  monitorsDay: p(
    "man-working-at-computer-monitors",
    "A man at a three-monitor workstation in a bright room",
  ),
  deskDusk: p("man-working-at-desk", "A man typing at his desk with the city at dusk behind"),
  journal: p(
    "man-writing-in-journal",
    "A man in a hoodie writing in a journal next to his laptop",
  ),
  notebook: p("man-writing-in-notebook", "A man writing notes by hand in front of his monitor"),
  paperNotebook: p(
    "man-writing-in-paper-notebook",
    "A man writing in a paper notebook at a bright office desk",
  ),
  laptopReport: p(
    "woman-reading-laptop-report",
    "A woman in a blazer reading a report on her laptop, chin in hand",
  ),
  laptopReport2: p(
    "woman-reading-report-on-laptop",
    "A woman reviewing a report on her laptop in an office at night",
  ),
  printedReport: p(
    "woman-reviewing-printed-report",
    "A woman annotating a printed report with a pen",
  ),
  printedReport2: p(
    "woman-reviewing-printed-report-2",
    "A woman reviewing printed charts at a bright desk",
  ),
  screenNight: p(
    "woman-reviewing-screen-at-workst",
    "A woman studying charts on a monitor in a dark room",
  ),
  screenDay: p(
    "woman-reviewing-screen-at-workst-2",
    "A woman considering a dashboard on a monitor in a white studio",
  ),
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
