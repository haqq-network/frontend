function getMobileDetect(userAgent: string) {
  const isAndroid = (): boolean => {
    return Boolean(userAgent.match(/Android/i));
  };
  const isIos = (): boolean => {
    return Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  };
  const isOpera = (): boolean => {
    return Boolean(userAgent.match(/Opera Mini/i));
  };
  const isWindows = (): boolean => {
    return Boolean(userAgent.match(/IEMobile/i));
  };
  const isSSR = (): boolean => {
    return Boolean(userAgent.match(/SSR/i));
  };

  const isMobile = (): boolean => {
    return Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  };
  const isDesktop = (): boolean => {
    return Boolean(!isMobile() && !isSSR());
  };
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
}

export function useMobileDetect() {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
  return getMobileDetect(userAgent);
}
