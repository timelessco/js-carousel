import { Gesture } from "@use-gesture/vanilla";
import anime from "animejs/lib/anime.es";

import {
  getclosestSliderElement,
  getCurrentPosition,
  isInViewport,
} from "./helpers/actions";

function Carousel(props) {
  const {
    slidesToScroll = 1,
    whileScrolling = () => {},
    whileDragging = () => {},
    axis = "x",
    loop = false,
    dragFree = false,
    autoplay = false,
    autoplayTimeout = 2000,
    onInit = () => {},
    displayDots = false,
    selectedState = false,
    dotsHTML = `<svg height="12" width="12" class="dots">
    <circle cx="5" cy="5" r="2.5" stroke="gray" stroke-width="3" fill="gray" />
  </svg>`,
    selectedScrollClassName = "selected",
  } = props;

  let { parent, child, selectedScrollSnapIndex = 0 } = props;
  parent = document.querySelector(parent);
  child = document.querySelectorAll(child);
  const springConfig = `spring(1,90,20,13)`;
  let indexValue = 1;
  let dotsArray = [];
  let leftOffsetArray = [];
  let allLeftOffsets = [];
  let lastScrolledTo = getCurrentPosition(parent);

  if (axis === "y") {
    parent.style.height = "100%";
  }
  // handles cursor actions
  function handleCursor(dragging = false) {
    if (dragging) {
      parent.style.cursor = "grabbing";
    } else {
      parent.style.cursor = "grab";
    }
  }
  handleCursor();

  // dots functionality in carousel
  function dotsFunctionality(array, scrolledValue) {
    const scrolledIndex = leftOffsetArray.indexOf(scrolledValue);
    array?.forEach(i => {
      if (i.classList.contains("selected-dot")) {
        i.classList.remove("selected-dot");
      }
    });
    if (array && array[scrolledIndex])
      array?.[scrolledIndex]?.classList.add("selected-dot");
  }

  // checking if the slides can be scrolled anymore
  function canScrollNext() {
    if (axis === "x") {
      if (
        parent.clientWidth - lastScrolledTo >=
        parent.parentNode.clientWidth + 30
      )
        return true;
      return false;
    }
    if (
      parent.clientHeight - lastScrolledTo >=
      parent.parentNode.clientHeight + 30
    )
      return true;
    return false;
  }

  // appends 'selected slide' classname
  function addSelectedStateClassName(childIndexValue) {
    if (selectedState) {
      child[childIndexValue]?.classList.add(selectedScrollClassName);
    }
  }

  // snapping of slides are handled by this function
  function moveToSnapPoint(snapValue, axisValue, easing = springConfig) {
    if (axisValue === "x") {
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
    selectedScrollSnapIndex += 1;
    child.forEach(i => {
      if (i.classList.contains(selectedScrollClassName)) {
        i?.classList?.remove(selectedScrollClassName);
      }
    });

    addSelectedStateClassName(selectedScrollSnapIndex);
  }

  // checks if slider can be scrolled to previous slide
  function canScrollPrev() {
    if (leftOffsetArray.indexOf(lastScrolledTo) > 0) return true;
    return false;
  }

  onInit();

  // scrolling to previous slide
  function scrollPrev(looping) {
    let currentIndex;
    if (selectedScrollSnapIndex !== 0) {
      selectedScrollSnapIndex -= 1;
      addSelectedStateClassName(selectedScrollSnapIndex);
    }
    if (!looping) {
      leftOffsetArray.forEach((i, index) => {
        if (i === lastScrolledTo) {
          currentIndex = index;
        }
      });
      if (window.innerWidth > 700) {
        if (currentIndex - 1 >= 0) {
          moveToSnapPoint(-leftOffsetArray[currentIndex - 1], axis);
          lastScrolledTo = leftOffsetArray[currentIndex - 1];
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
          dotsFunctionality(dotsArray, lastScrolledTo);
        }
      } else {
        parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
        lastScrolledTo = leftOffsetArray[currentIndex + 1];
        if (selectedState)
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        dotsFunctionality(dotsArray, lastScrolledTo);
      }
    } else {
      let currentPosition = 0;
      const carouselItems = parent.children;
      currentPosition += carouselItems[0].offsetWidth;
      moveToSnapPoint(currentPosition, axis);
      const lastItem = carouselItems[carouselItems.length - 1];
      parent.insertBefore(lastItem, carouselItems[0]);
      currentPosition -= carouselItems[0].offsetWidth;
      moveToSnapPoint(currentPosition, axis);
    }
  }

  // scrolling to next slide
  function scrollNext(looping) {
    let currentIndex;
    addSelectedStateClassName(selectedScrollSnapIndex);
    if (!looping) {
      leftOffsetArray.forEach((i, index) => {
        if (i === lastScrolledTo) {
          currentIndex = index;
        }
      });
      if (window.innerWidth > 700) {
        if (
          parent.parentNode.clientWidth -
            document.querySelector(".inner").getBoundingClientRect().right <=
          0
        ) {
          if (
            (parent.clientWidth - leftOffsetArray[currentIndex + 1] >
              parent.parentNode.clientWidth &&
              axis === "x") ||
            (axis === "y" &&
              parent.clientHeight - leftOffsetArray[currentIndex] >
                parent.parentNode.clientHeight)
          ) {
            moveToSnapPoint(-leftOffsetArray[currentIndex + 1], axis);

            lastScrolledTo = leftOffsetArray[currentIndex + 1];
            addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        } else {
          if (leftOffsetArray[currentIndex + 1])
            parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
          lastScrolledTo = leftOffsetArray[currentIndex + 1];
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
          dotsFunctionality(dotsArray, lastScrolledTo);
        }
      } else {
        if (leftOffsetArray[currentIndex + 1])
          parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
        lastScrolledTo = leftOffsetArray[currentIndex + 1];
        addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        dotsFunctionality(dotsArray, lastScrolledTo);
      }
    } else {
      let currentPosition = 0;
      const carouselItems = parent.children;
      currentPosition -= carouselItems[0].offsetWidth;
      moveToSnapPoint(currentPosition, axis);
      const firstItem = carouselItems[0];
      parent.appendChild(firstItem);
      currentPosition += carouselItems[0].offsetWidth;
      moveToSnapPoint(currentPosition, axis);
    }
  }

  // pushing all the offset values of slides into an array
  function pushToOffsetArray() {
    child.forEach((i, index) => {
      if (index % slidesToScroll === 0) {
        if (axis === "x") leftOffsetArray.push(i.offsetLeft);
        else leftOffsetArray.push(i.offsetTop);
      }
    });
    child.forEach(i => {
      allLeftOffsets.push(i.offsetLeft);
    });
  }

  addSelectedStateClassName(selectedScrollSnapIndex);

  pushToOffsetArray();

  if (displayDots) {
    const dotsFlex = document.createElement("div");
    dotsFlex.classList.add("dots-flex");
    parent.parentNode.appendChild(dotsFlex);

    leftOffsetArray.forEach(() => {
      dotsFlex.insertAdjacentHTML("beforeend", dotsHTML);
    });
    dotsArray = dotsFlex.childNodes;

    dotsArray[0].classList.add("selected-dot");

    dotsArray.forEach((i, index) => {
      i.addEventListener("click", () => {
        lastScrolledTo = leftOffsetArray[index];
        addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        moveToSnapPoint(-lastScrolledTo, axis);
        dotsFunctionality(dotsArray, lastScrolledTo);
      });
    });
  }

  let timeout;

  // autoplay slides functionality
  function autoplayLoop() {
    timeout = setTimeout(() => {
      if (
        parent.clientWidth - leftOffsetArray[indexValue] >
          parent.parentNode.clientWidth ||
        parent.clientHeight - leftOffsetArray[indexValue] + 100 >
          parent.parentNode.clientHeight
      ) {
        moveToSnapPoint(-leftOffsetArray[indexValue], axis);
        lastScrolledTo = leftOffsetArray[indexValue];
        addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        dotsArray[indexValue]?.classList.add("selected-dot");
      } else {
        indexValue = 0;
      }
      indexValue += 1;
      if (indexValue < leftOffsetArray.length) {
        autoplayLoop();
      }
    }, autoplayTimeout);
  }

  if (autoplay === true && indexValue !== null) {
    autoplayLoop();
  }

  // throttle function
  const throttleFunction = (func, delay) => {
    let prev = 0;
    return () => {
      const now = new Date().getTime();
      if (now - prev > delay) {
        prev = now;
      }
      return null;
    };
  };

  // adding gestures like drag, scroll
  Gesture(
    parent,
    {
      onDrag: ({ active, offset: [ox, oy], direction: [dx] }) => {
        clearTimeout(timeout);

        leftOffsetArray = [];
        allLeftOffsets = [];
        const offsetValue = axis === "x" ? ox : oy;
        const lastChildren = parent.children[parent.children.length - 1];
        pushToOffsetArray();
        if (window.innerWidth > 700) {
          if (active) {
            if (offsetValue < 10) moveToSnapPoint(offsetValue, axis);
            if (
              loop &&
              isInViewport(lastChildren) &&
              dx < 0 &&
              -(
                parent.children[parent.children.length - 1].offsetLeft -
                parent.parentNode.clientWidth +
                child[0].clientWidth
              ) === offsetValue
            )
              scrollNext(loop);
            if (loop && parent.children[0].scrollLeft >= 0 && dx > 0)
              throttleFunction(scrollPrev(loop), 250);
          } else {
            let snapValue;
            if (axis === "x") {
              snapValue =
                parent.clientWidth -
                  getclosestSliderElement(-offsetValue, leftOffsetArray) >
                parent.parentNode.clientWidth
                  ? -getclosestSliderElement(-offsetValue, leftOffsetArray)
                  : offsetValue;
            } else {
              snapValue = -getclosestSliderElement(
                -offsetValue,
                leftOffsetArray,
              );
            }

            if (!dragFree) moveToSnapPoint(snapValue, axis);
            lastScrolledTo = getclosestSliderElement(
              -snapValue,
              leftOffsetArray,
            );
            addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        }
        whileDragging();
        handleCursor(true);
        if (
          loop &&
          isInViewport(lastChildren) &&
          dx < 0 &&
          -(
            parent.children[parent.children.length - 1].offsetLeft -
            parent.parentNode.clientWidth +
            child[0].clientWidth
          ) === offsetValue
        )
          scrollNext(loop);
        if (loop && parent.children[0].scrollLeft >= 0 && dx > 0)
          throttleFunction(scrollPrev(loop), 2500);
      },
      onWheel: ({ offset: [ox, oy], active, direction: [dx] }) => {
        const lastChildren = parent.children[parent.children.length - 1];

        clearTimeout(timeout);
        leftOffsetArray = [];
        allLeftOffsets = [];
        pushToOffsetArray();
        const offsetValue = axis === "x" ? -ox : -oy;

        if (window.innerWidth > 700) {
          if (active) {
            moveToSnapPoint(offsetValue, axis);
          } else {
            let snapValue;
            if (axis === "x") {
              snapValue =
                parent.clientWidth -
                  getclosestSliderElement(-offsetValue, leftOffsetArray) >
                parent.parentNode.clientWidth
                  ? -getclosestSliderElement(-offsetValue, leftOffsetArray)
                  : offsetValue;
            } else {
              snapValue = -getclosestSliderElement(
                -offsetValue,
                leftOffsetArray,
              );
            }

            if (!dragFree) moveToSnapPoint(snapValue, axis);
            lastScrolledTo = getclosestSliderElement(
              -offsetValue,
              leftOffsetArray,
            );
            addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));

            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        }
        whileScrolling();
        if (
          loop &&
          isInViewport(lastChildren) &&
          dx < 0 &&
          -(
            parent.children[parent.children.length - 1].offsetLeft -
            parent.parentNode.clientWidth +
            child[0].clientWidth
          ) === offsetValue
        )
          scrollNext(loop);
        if (loop && parent.children[0].scrollLeft >= 0 && dx > 0)
          throttleFunction(scrollPrev(loop), 2500);

        if (axis === "y") {
          document.body.style.overflow = "hidden";
        }
      },
      onDragEnd: () => {
        handleCursor();
      },
      onWheelEnd: () => {
        if (axis === "y") {
          document.body.style.overflow = "scroll";
        }
      },
    },
    {
      wheel: {
        // from: () => [getCurrentPosition(parent), 0],
        bounds: {
          left: 0,
          right:
            parent.children[parent.children.length - 1].offsetLeft -
            parent.parentNode.clientWidth +
            child[0].clientWidth,
          top: 0,
          bottom: parent.clientHeight - parent.parentNode.clientHeight,
        },
        axis,
      },
      drag: {
        from: () => [
          getCurrentPosition(parent),
          getCurrentPosition(parent, true),
        ],
        bounds: {
          left: -(
            parent.children[parent.children.length - 1].offsetLeft -
            parent.parentNode.clientWidth +
            child[0].clientWidth
          ),
          bottom: parent.clientHeight - parent.parentNode.clientHeight,
        },
        rubberband: true,
        axis,
      },
    },
  );

  function scrollTo() {}

  function slidesInView() {
    const visibleElements = [];

    child.forEach(i => {
      if (isInViewport(i)) {
        visibleElements.push(Array.from(child).indexOf(i));
      }
    });

    return visibleElements;
  }

  function slidesNotInView() {
    const visibleElements = [];

    child.forEach(i => {
      if (!isInViewport(i)) {
        visibleElements.push(Array.from(child).indexOf(i));
      }
    });

    return visibleElements;
  }

  function slideNodes() {
    return Array.from(child);
  }

  function rootNode() {
    return parent.parentNode;
  }

  function containerNode() {
    return parent;
  }

  const self = {
    scrollPrev,
    scrollNext,
    canScrollNext,
    canScrollPrev,
    scrollTo,
    slidesInView,
    slidesNotInView,
    slideNodes,
    rootNode,
    containerNode,
  };
  return self;
}
export default Carousel;
