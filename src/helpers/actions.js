// finding the slider closest to the scroll offset to snap at
import anime from "animejs/lib/anime.es";

const springConfig = `spring(1,90,20,13)`;

// gets the closest slider element to the scrolled value for snapping
export function getclosestSliderElement(offset, array) {
  const differences = [];
  array.forEach(i => {
    differences.push(Math.abs(offset - i));
  });
  const minIndex = differences.indexOf(Math.min(...differences));

  return array[minIndex];
}

// checks if element is in viewport
export function isInViewport(element, parent) {
  const rect = element.getBoundingClientRect();
  const parentRect = parent.parentNode.getBoundingClientRect();
  return (
    rect.top >= parentRect.top &&
    rect.left >= parentRect.left &&
    rect.bottom <= parentRect.bottom &&
    rect.right <= parentRect.right
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

// gets scroll progress of slider
export function getScrollProgress(elem, children) {
  if (window.innerWidth > 700) {
    return Math.abs(
      getCurrentPosition(elem) /
        (elem.clientWidth - children[children.length - 1].clientWidth),
    );
  }
  return elem.scrollLeft / (elem.scrollWidth - elem.clientWidth);
}

// adding scroll snap classnames
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

// snapping of slides are handled by this function
export function moveToSnapPoint(
  snapValue,
  axisValue,
  parent,
  slidesToScroll,
  easing = springConfig,
) {
  if (axisValue === "x") {
    if (slidesToScroll === 0 && snapValue > 0) {
      anime({
        targets: parent,
        translateX: `${0}px`,
        translateY: 0,
        easing,
      });
    } else {
      anime({
        targets: parent,
        translateX: `${snapValue}px`,
        translateY: 0,
        easing,
      });
    }
  } else {
    anime({
      targets: parent,
      translateX: 0,
      translateY: `${snapValue}px`,
      easing,
    });
  }
}

// remove scroll snap classnames
export function removeScrollClassNames(parent, child) {
  if (parent.classList.contains("scroll-snap-x")) {
    parent.classList.remove("scroll-snap-x");
  }
  if (parent.classList.contains("drag-free")) {
    parent.classList.remove("drag-free");
  }
  if (parent.classList.contains("snap-always")) {
    parent.classList.remove("snap-always");
    child.forEach(i => {
      i.classList.remove("snap-always");
    });
  }
  if (parent.classList.contains("scroll-snap-y")) {
    parent.classList.remove("scroll-snap-y");
  }
}

// mutation observer
export function mutationObserver(
  dotsFunctionality,
  dotsArray,
  watchSlides,
  lastScrolledTo,
  parent,
  leftOffsetArray,
) {
  return new MutationObserver(mutations => {
    mutations.forEach(function x(mutation) {
      if (mutation.attributeName === "style") {
        if (window.innerWidth > 700)
          dotsFunctionality(dotsArray, lastScrolledTo);
        else {
          dotsFunctionality(
            dotsArray,
            getclosestSliderElement(parent.scrollLeft, leftOffsetArray),
          );
        }
      } else if (mutation.type === "childList") {
        watchSlides();
      }
    });
  });
}

// resize listener
export function resizeListener(watchResize) {
  window.addEventListener("resize", () => {
    watchResize();
  });
}

// reverses the children of the parent - used for direction property
export function reverseChildren(parent) {
  for (let i = 1; i < parent.childNodes.length; i += 1) {
    parent.insertBefore(parent.childNodes[i], parent.firstChild);
  }
}
