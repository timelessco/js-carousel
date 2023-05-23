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
    selectedState = false,
    dotsHTML = `<svg height="12" width="12" class="dots">
    <circle cx="5" cy="5" r="2.5" stroke="gray" stroke-width="3" fill="gray" />
  </svg>`,
    selectedScrollClassName = "selected",
  } = props;

  let { parent, child, selectedScrollSnapIndex = 0 } = props;
  parent = document.querySelector(parent);
  child = document.querySelectorAll(child);
  //   const parent = document.querySelector(".parent2 .inner");
  //   const child = document.querySelectorAll(".slider");
  const springConfig = `spring(1,90,20,13)`;
  let indexValue = 1;
  let dotsArray = [];
  let leftOffsetArray = [];
  if (axis === "y") {
    parent.style.height = "100%";
  }
  function getCurrentPosition(elem, y = false) {
    const style = window?.getComputedStyle(elem);
    // eslint-disable-next-line
    var matrix = new WebKitCSSMatrix(style.transform);

    if (y) return matrix.m42;
    return matrix.m41;
  }
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
  let lastScrolledTo = getCurrentPosition(parent);
  function addClassName() {
    if (selectedState) {
      child[selectedScrollSnapIndex]?.classList.add(selectedScrollClassName);
    }
  }
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

    addClassName();
  }

  function canScrollPrev() {
    if (leftOffsetArray.indexOf(lastScrolledTo) > 0) return true;
    return false;
  }
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= -(element.clientWidth + 20) &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  onInit();

  function addToOffsetArray() {
    if (selectedState) {
      child[leftOffsetArray.indexOf(lastScrolledTo)].classList.add(
        selectedScrollClassName,
      );
    }
  }
  function scrollPrev(looping) {
    let currentIndex;
    if (selectedScrollSnapIndex !== 0) {
      selectedScrollSnapIndex -= 1;
      addClassName();
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
          addToOffsetArray();
          dotsFunctionality(dotsArray, lastScrolledTo);
        }
      } else {
        parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
        lastScrolledTo = leftOffsetArray[currentIndex + 1];
        if (selectedState) addToOffsetArray();
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
  function scrollNext(looping) {
    let currentIndex;
    addClassName();
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
            addToOffsetArray();
            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        } else {
          if (leftOffsetArray[currentIndex + 1])
            parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
          lastScrolledTo = leftOffsetArray[currentIndex + 1];
          addToOffsetArray();
          dotsFunctionality(dotsArray, lastScrolledTo);
        }
      } else {
        if (leftOffsetArray[currentIndex + 1])
          parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
        lastScrolledTo = leftOffsetArray[currentIndex + 1];
        addToOffsetArray();
        dotsFunctionality(dotsArray, lastScrolledTo);
      }
    } else {
      let currentPosition = 0;
      const carouselItems = parent.children;
      currentPosition -= carouselItems[0].offsetWidth;
      //   parent.style.transform = `translateX(${currentPosition}px)`;
      moveToSnapPoint(currentPosition, axis);
      const firstItem = carouselItems[0];
      parent.appendChild(firstItem);
      currentPosition += carouselItems[0].offsetWidth;
      moveToSnapPoint(currentPosition, axis);

      // function nextItem() {

      //     currentPosition -= carouselItems[0].offsetWidth;
      //     carouselContainer.style.transform = `translateX(${currentPosition}px)`;
      //     console.log(currentPosition, "pos");
      //     const firstItem = carouselItems[0];
      //     carouselContainer.appendChild(firstItem);
      //     currentPosition += carouselItems[0].offsetWidth;
      //     carouselContainer.style.transform = `translateX(${currentPosition}px)`;
      //   }
    }
    // selectedScrollSnapIndex += 1;
  }

  let allLeftOffsets = [];
  // if (axis === "y") {
  //   parent.style.flexDirection = "column";
  //   parent.parentNode.style.maxHeight = "800px";
  // }
  //   function scrollNext(loop) {
  //     console.log("true");
  //     let currentPosition = 0;
  //     const carouselItems = parent.children;
  //     currentPosition -= carouselItems[0].offsetWidth;
  //     //   parent.style.transform = `translateX(${currentPosition}px)`;
  //     moveToSnapPoint(currentPosition, axis);
  //     const firstItem = carouselItems[0];
  //     parent.appendChild(firstItem);
  //     currentPosition += carouselItems[0].offsetWidth;
  //     moveToSnapPoint(currentPosition, axis);
  //   }

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

  addClassName();

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
        addToOffsetArray();
        moveToSnapPoint(-lastScrolledTo, axis);
        dotsFunctionality(dotsArray, lastScrolledTo);
      });
    });
  }

  let timeout;

  function myLoop() {
    timeout = setTimeout(() => {
      if (
        parent.clientWidth - leftOffsetArray[indexValue] >
        parent.parentNode.clientWidth
      ) {
        moveToSnapPoint(-leftOffsetArray[indexValue], axis);
        lastScrolledTo = leftOffsetArray[indexValue];
        addToOffsetArray();
        dotsArray[indexValue]?.classList.add("selected-dot");
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

  // function debounce(func, wait, immediate) {
  //   var timeout;
  //   return function () {
  //     var context = this,
  //       args = arguments;
  //     var later = function () {
  //       timeout = null;
  //       if (!immediate) func.apply(context, args);
  //     };
  //     var callNow = immediate && !timeout;
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, 14000);
  //     if (callNow) func.apply(context, args);
  //   };
  // }
  //   <button id="throttle">Click Me</button>
  // <script>
  // 	const btn=document.querySelector("#throttle");

  // 	// Throttling Function
  const throttleFunction = (func, delay) => {
    // Previously called time of the function
    let prev = 0;
    return (...args) => {
      // Current called time of the function
      const now = new Date().getTime();

      // Logging the difference between previously
      // called and current called timings

      // If difference is greater than delay call
      // the function again.
      if (now - prev > delay) {
        prev = now;

        // "..." is the spread operator here
        // returning the function with the
        // array of arguments
        return func(...args);
      }
      return null;
    };
  };
  // btn.addEventListener("click", throttleFunction(()=>{
  // console.log("button is clicked")
  // }, 1500));
  // </script>

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
                parent.clientWidth - closestTo(-offsetValue, leftOffsetArray) >
                parent.parentNode.clientWidth
                  ? -closestTo(-offsetValue, leftOffsetArray)
                  : offsetValue;
            } else {
              snapValue = -closestTo(-offsetValue, leftOffsetArray);
            }

            if (!dragFree) moveToSnapPoint(snapValue, axis);
            lastScrolledTo = closestTo(-snapValue, leftOffsetArray);
            addToOffsetArray();
            dotsFunctionality(dotsArray, lastScrolledTo);
          }
        }
        whileDragging();
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
                parent.clientWidth - closestTo(-offsetValue, leftOffsetArray) >
                parent.parentNode.clientWidth
                  ? -closestTo(-offsetValue, leftOffsetArray)
                  : offsetValue;
            } else {
              snapValue = -closestTo(-offsetValue, leftOffsetArray);
            }

            if (!dragFree) moveToSnapPoint(snapValue, axis);
            lastScrolledTo = closestTo(-offsetValue, leftOffsetArray);
            addToOffsetArray();

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
          bottom: parent.parentNode.clientHeight + child[0].clientHeight,
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
          bottom: parent.parentNode.clientHeight + child[0].clientHeight,
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
