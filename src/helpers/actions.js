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

export function getScrollProgress(elem, children) {
  if (window.innerWidth > 700) {
    return Math.abs(
      getCurrentPosition(elem) /
        (elem.clientWidth - children[children.length - 1].clientWidth),
    );
  }
  return elem.scrollLeft / (elem.scrollWidth - elem.clientWidth);
}

export function addScrollClassNames(
  axis,
  parent,
  slidesToScroll,
  dragFree,
  child,
) {
  if (axis === "x") {
    parent.classList.add("scroll-x");
    if (parent.classList.contains("scroll-snap-x")) {
      parent.classList.remove("scroll-snap-x");
    }
    if (slidesToScroll !== 0) {
      parent.classList.add("scroll-snap-x");
      if (dragFree) {
        parent.classList.add("drag-free");
      } else {
        parent.classList.add("snap-always");
        child.forEach(i => {
          i.classList.add("snap-always");
        });
      }
    }
  } else {
    parent.classList.add("scroll-y");

    if (slidesToScroll !== 0) {
      parent.classList.add("scroll-snap-y");
      if (dragFree) {
        parent.classList.add("drag-free");
      } else {
        parent.classList.add("snap-always");
        child.forEach(i => {
          i.classList.add("snap-always");
        });
      }
    }
  }
}
