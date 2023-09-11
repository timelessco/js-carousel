// finding the slider closest to the scroll offset to snap at
import anime from "animejs/lib/anime.es";

import { addSelectedStateClassName } from "./classes";

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

// snapping of slides are handled by this function
export function moveToSnapPoint(
  snapValue,
  axisValue,
  parent,
  slidesToScroll,
  customDragAction,
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
    } else if (customDragAction === "rotate") {
      anime({
        targets: parent,
        rotateY: `${snapValue}`,
        easing,
      });
    } else
      anime({
        targets: parent,
        translateX: `${snapValue}px`,
        translateY: 0,
        easing,
      });
  } else {
    anime({
      targets: parent,
      translateX: 0,
      translateY: `${snapValue}px`,
      easing,
    });
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
        if (window.innerWidth > 700) {
          dotsFunctionality(dotsArray, lastScrolledTo);
        } else {
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

// throttle
export function throttle(fn, delay) {
  let lastCall = 0;
  return function () {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    // eslint-disable-next-line consistent-return
    return fn();
  };
}

// autoplay slides functionality
export function autoplayLoop(
  autoplayTimeout,
  timeout,
  leftOffsetArray,
  indexValue,
  parent,
  axis,
  slidesToScroll,
  selectedScrollSnapIndex,
  children,
  selectedScrollClassName,
  lastScrolledTo,
  dotsArray,
  selectedState,
) {
  // eslint-disable-next-line no-param-reassign
  timeout = setTimeout(() => {
    if (window.innerWidth > 700) {
      if (
        parent.clientWidth - leftOffsetArray[indexValue] >
          parent.parentNode.clientWidth ||
        parent.clientHeight - leftOffsetArray[indexValue] + 100 >
          parent.parentNode.clientHeight
      ) {
        moveToSnapPoint(
          -leftOffsetArray[indexValue],
          axis,
          parent,
          slidesToScroll,
          springConfig,
        );
        // eslint-disable-next-line no-param-reassign
        selectedScrollSnapIndex += 1;
        children.forEach(i => {
          if (i.classList.contains(selectedScrollClassName)) {
            i?.classList?.remove(selectedScrollClassName);
          }
        });
        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          selectedScrollSnapIndex,
          selectedState,
        );
        // eslint-disable-next-line no-param-reassign
        lastScrolledTo = leftOffsetArray[indexValue];
        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          leftOffsetArray.indexOf(lastScrolledTo),
          selectedState,
        );
        dotsArray[indexValue]?.classList.add("selected-dot");
      } else {
        // eslint-disable-next-line no-param-reassign
        indexValue = 0;
      }
    } else {
      if (indexValue === leftOffsetArray.length) {
        // eslint-disable-next-line no-param-reassign
        indexValue = 0;
      }
      parent.scrollTo(leftOffsetArray[indexValue], 0);
    }
    // eslint-disable-next-line no-param-reassign
    indexValue += 1;

    if (indexValue < leftOffsetArray.length) {
      autoplayLoop(
        autoplayTimeout,
        timeout,
        leftOffsetArray,
        indexValue,
        parent,
        axis,
        slidesToScroll,
        selectedScrollSnapIndex,
        children,
        selectedScrollClassName,
        lastScrolledTo,
        dotsArray,
        selectedState,
      );
    }
  }, autoplayTimeout);
}

// pushing all the offset values of slides into an array
export function pushToOffsetArray(
  leftOffsetArray,
  expLoop,
  lastChild,
  children,
  slidesToScroll,
  allLeftOffsets,
  axis,
  alignment,
) {
  if (expLoop) {
    if (axis === "x") leftOffsetArray.push(-lastChild.clientWidth);
    else leftOffsetArray.push(-lastChild.clientHeight);
  }

  children.forEach((i, index) => {
    if (index % slidesToScroll === 0) {
      if (axis === "x") {
        if (index === 0) {
          leftOffsetArray.push(i.offsetLeft);
        } else if (alignment === "start") leftOffsetArray.push(i.offsetLeft);
        else if (alignment === "end") {
          leftOffsetArray.push(i.clientWidth + i.offsetLeft);
        } else {
          leftOffsetArray.push(i.clientWidth / 2 + i.offsetLeft);
        }
      } else if (index === 0) {
        leftOffsetArray.push(i.offsetTop);
      } else if (alignment === "start") leftOffsetArray.push(i.offsetTop);
      else if (alignment === "end") {
        leftOffsetArray.push(i.clientHeight + i.offsetTop);
      } else {
        leftOffsetArray.push(i.clientHeight / 2 + i.offsetTop);
      }
    }
  });
  if (expLoop) {
    if (axis === "x")
      leftOffsetArray.push(lastChild.offsetLeft + children[0].clientWidth);
    else leftOffsetArray.push(lastChild.offsetTop + children[0].clientHeight);
  }

  children.forEach(i => {
    allLeftOffsets.push(i.offsetLeft);
  });
}
