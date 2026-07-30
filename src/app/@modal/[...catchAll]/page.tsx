/**
 * Matches every other route ("/itinerary", "/calendar", etc). Without this,
 * Next.js would keep the panel's last content mounted when soft-navigating to
 * an unrelated page, e.g. via the Navbar. The exact "/" case is handled by
 * the sibling `@modal/page.tsx`.
 */
export default function ModalCatchAll() {
  return null;
}
