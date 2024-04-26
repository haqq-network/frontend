export function getDynamicLink(
  link: string,
  distinctId: string,
  forwardTo?: string,
) {
  const linkIrl = new URL(link);
  linkIrl.searchParams.append('distinct_id', distinctId);

  if (forwardTo) {
    linkIrl.searchParams.append('go_to', forwardTo);
  }

  return (
    'https://haqq.page.link/' +
    `?link=${encodeURIComponent(linkIrl.toString())}` +
    '&apn=com.haqq.wallet&isi=6443843352&ibi=com.haqq.wallet'
  );
}
