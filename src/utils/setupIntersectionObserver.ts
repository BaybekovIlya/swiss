export const setupIntersectionObserver = (
  element: Element,
  callback: () => void,
  shouldTriggerCallback: boolean = true,
  options: IntersectionObserverInit = { threshold: 1.0 }
) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && shouldTriggerCallback) {
      callback();
    }
  }, options);

  observer.observe(element);

  return () => observer.unobserve(element);
};
