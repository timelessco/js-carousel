// finding the slider closest to the scroll offset to snap at
export function getclosestSliderElement(offset, array) {
  const differences = [];
  array.forEach(i => {
    differences.push(Math.abs(offset - i));
  });
  const minIndex = differences.indexOf(Math.min(...differences));

  return array[minIndex];
}

// checks if element is in viewport
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= -(element.clientWidth + 20) &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

// get the current position of an element
export function getCurrentPosition(elem, y = false) {
  const style = window?.getComputedStyle(elem);
  // eslint-disable-next-line
  var matrix = new WebKitCSSMatrix(style.transform);

  if (y) return matrix.m42;
  return matrix.m41;
}
