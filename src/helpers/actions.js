// finding the slider closest to the scroll offset to snap at
import anime from "animejs/lib/anime.es";

const springConfig = `spring(1,90,20,13)`;

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

export function resizeListener(watchResize) {
  window.addEventListener("resize", () => {
    watchResize();
  });
}
