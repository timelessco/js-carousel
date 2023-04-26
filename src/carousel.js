import { Gesture } from "@use-gesture/vanilla";
import anime from "animejs/lib/anime.es";

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
    dotsHTML = `<svg height="12" width="12" class="dots">
    <circle cx="5" cy="5" r="2.5" stroke="gray" stroke-width="3" fill="gray" />
  </svg>`,
  } = props;

  let { parent, child } = props;

  parent = document.querySelector(parent);
  child = document.querySelectorAll(child);
  //   const parent = document.querySelector(".parent2 .inner");
  //   const child = document.querySelectorAll(".slider");
  const lastChild = document.querySelectorAll(".slider:last-child");
  function getCurrentPosition(elem) {
    const style = window.getComputedStyle(elem);
    // eslint-disable-next-line
    var matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41;
  }
  let lastScrolledTo = getCurrentPosition(parent);

  function canScrollNext() {
    if (
      parent.clientWidth - lastScrolledTo >=
      parent.parentNode.clientWidth + 30
    )
      return true;
    return false;
  }
  let leftOffsetArray = [];

  function canScrollPrev() {
    if (leftOffsetArray.indexOf(lastScrolledTo) > 0) return true;
    return false;
  }
  onInit();
  const springConfig = `spring(1,90,20,13)`;
  let allLeftOffsets = [];
  if (axis === "y") {
    parent.style.flexDirection = "column";
    parent.parentNode.style.maxHeight = "800px";
  }
  function addToLoop() {
    const firstChild = parent.children[0];
    // moveToSnapPoint(0, axis);
    // parent.style.transform = `translateX(0px)`;
    // lastScrolledTo = 0;
    firstChild.style.transform = `translateX(${
      parent.parentNode.clientWidth + firstChild.clientWidth
    }px)`;
    // parent.removeChild(firstChild);
    // parent.appendChild(firstChild);
  }

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
  let indexValue = 1;
  let dotsArray = [];
  pushToOffsetArray();
  function dotsFunctionality(array, scrolledValue) {
    const scrolledIndex = leftOffsetArray.indexOf(scrolledValue);
    array?.forEach(i => {
      if (i.classList.contains("selected-dot")) {
        i.classList.remove("selected-dot");
      }
    });
    array?.[scrolledIndex]?.classList.add("selected-dot");
  }
  function moveToSnapPoint(snapValue, axisValue) {
    if (axisValue === "x") {
      anime({
        targets: parent,
        translateX: `${snapValue}px`,
        translateY: 0,
        easing: springConfig,
      });
    } else {
      anime({
        targets: parent,
        translateX: 0,
        translateY: `${snapValue}px`,
        easing: springConfig,
      });
    }
  }
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
        moveToSnapPoint(-lastScrolledTo, axis);
        dotsFunctionality(dotsArray, lastScrolledTo);
      });
    });
  }

  let timeout;

  function myLoop() {
    timeout = setTimeout(function () {
      if (
        parent.clientWidth - leftOffsetArray[indexValue] >
        parent.parentNode.clientWidth
      ) {
        moveToSnapPoint(-leftOffsetArray[indexValue], axis);
        lastScrolledTo = leftOffsetArray[indexValue];
        dotsArray[indexValue].classList.add("selected-dot");
      } else {
        indexValue = 0;
      }
      indexValue += 1;
      if (indexValue < leftOffsetArray.length) {
        myLoop();
      }
    }, autoplayTimeout);
  }
  if (autoplay === true && indexValue !== null) {
    myLoop();
  }
  function closestTo(offset, array) {
    const differences = [];
    array.forEach(i => {
      differences.push(Math.abs(offset - i));
    });
    const minIndex = differences.indexOf(Math.min(...differences));

    return array[minIndex];
  }

  Gesture(
    parent,
    {
      onDrag: ({ active, offset: [ox, oy] }) => {
        clearTimeout(timeout);

        leftOffsetArray = [];
        allLeftOffsets = [];
        const offsetValue = axis === "x" ? ox : oy;
        pushToOffsetArray();
        if (window.innerWidth > 700) {
          if (active) {
            if (offsetValue < 10) moveToSnapPoint(offsetValue, axis);
            if (loop && !canScrollNext()) addToLoop(offsetValue);
          } else {
            let snapValue;
            if (axis === "x") {
              snapValue =
                parent.clientWidth - closestTo(-offsetValue, leftOffsetArray) >
                parent.parentNode.clientWidth
                  ? -closestTo(-offsetValue, leftOffsetArray)
                  : offsetValue;
            } else {
              snapValue = -closestTo(-offsetValue, leftOffsetArray);
            }

            if (!dragFree) moveToSnapPoint(snapValue, axis);
            lastScrolledTo = closestTo(-snapValue, leftOffsetArray);
            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        }
        whileDragging();
        if (loop && !canScrollNext()) addToLoop(offsetValue);
      },
      onWheel: ({ offset: [ox, oy], active }) => {
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
                parent.clientWidth - closestTo(-offsetValue, leftOffsetArray) >
                parent.parentNode.clientWidth
                  ? -closestTo(-offsetValue, leftOffsetArray)
                  : offsetValue;
            } else {
              snapValue = -closestTo(-offsetValue, leftOffsetArray);
            }

            if (!dragFree) moveToSnapPoint(snapValue, axis);
            lastScrolledTo = closestTo(-offsetValue, leftOffsetArray);
            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        }
        whileScrolling();
        if (loop && !canScrollNext()) addToLoop(offsetValue);
      },
    },
    {
      wheel: {
        // from: () => [getCurrentPosition(parent), 0],
        bounds: {
          left: 0,
          right:
            lastChild[0].offsetLeft -
            parent.parentNode.clientWidth +
            child[0].clientWidth,
          top: 0,
        },
        axis,
      },
      drag: {
        from: () => [getCurrentPosition(parent), 0],
        bounds: {
          left: -(
            lastChild[0].offsetLeft -
            parent.parentNode.clientWidth +
            child[0].clientWidth
          ),
        },
        rubberband: true,
        axis,
      },
    },
  );

  function scrollPrev() {
    let currentIndex;
    // lastScrolledTo = -Math.round(getCurrentPosition(parent));
    leftOffsetArray.forEach((i, index) => {
      if (i === lastScrolledTo) {
        currentIndex = index;
      }
    });
    if (window.innerWidth > 700) {
      if (currentIndex - 1 >= 0) {
        moveToSnapPoint(-leftOffsetArray[currentIndex - 1], axis);
        lastScrolledTo = leftOffsetArray[currentIndex - 1];
        dotsFunctionality(dotsArray, lastScrolledTo);
      }
    } else {
      parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
      lastScrolledTo = leftOffsetArray[currentIndex + 1];
      dotsFunctionality(dotsArray, lastScrolledTo);
    }
  }

  function scrollNext() {
    let currentIndex;
    // lastScrolledTo = -Math.round(getCurrentPosition(parent));

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
          parent.clientWidth - leftOffsetArray[currentIndex + 1] >
          parent.parentNode.clientWidth
        ) {
          moveToSnapPoint(-leftOffsetArray[currentIndex + 1], axis);

          lastScrolledTo = leftOffsetArray[currentIndex + 1];
          dotsFunctionality(dotsArray, lastScrolledTo);
        }
      }
    } else {
      if (leftOffsetArray[currentIndex + 1])
        parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
      lastScrolledTo = leftOffsetArray[currentIndex + 1];
      dotsFunctionality(dotsArray, lastScrolledTo);
    }
  }

  function scrollTo() {}
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= -(element.clientWidth + 20) &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <=
        (parent.parentNode.clientWidth || document.documentElement.clientWidth)
    );
  }
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
