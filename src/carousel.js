import { Gesture } from "@use-gesture/vanilla";
import anime from "animejs/lib/anime.es";

import {
  autoplayLoop,
  getclosestSliderElement,
  getCurrentPosition,
  getScrollProgress,
  isInViewport,
  moveToSnapPoint,
  mutationObserver,
  pushToOffsetArray,
  resizeListener,
  reverseChildren,
  throttle,
} from "./helpers/actions";
import {
  addScrollClassNames,
  addSelectedStateClassName,
  removeScrollClassNames,
  removeSelectedStateClassName,
} from "./helpers/classes";

function Carousel(props) {
  const { breakpoints = {} } = props;
  if (Object.keys(breakpoints).length > 0) {
    Object.keys(breakpoints).forEach(i => {
      if (i.split(":")[0] === "min-width") {
        if (window.innerWidth < i.split(":")[1]) {
          Object.keys(breakpoints[i]).forEach(x => {
            // eslint-disable-next-line no-param-reassign
            props[x] = breakpoints[i][x];
          });
        }
      } else if (i.split(":")[0] === "max-width") {
        if (window.innerWidth > i.split(":")[1]) {
          Object.keys(breakpoints[i]).forEach(x => {
            // eslint-disable-next-line no-param-reassign
            props[x] = breakpoints[i][x];
          });
        }
      }
    });
  }
  const {
    slidesToScroll = 1,
    whileScrolling = () => {},
    whileDragging = () => {},
    watchResize = false,
    watchSlides = false,
    axis = "x",
    loop = false,
    dragFree = false,
    autoplay = false,
    autoplayTimeout = 2000,
    onInit = () => {},
    displayDots = false,
    selectedState = false,
    startIndex = 0,
    direction = "ltr",
    dotsHTML = `<svg height="12" width="12" class="dots">
    <circle cx="5" cy="5" r="2.5" stroke="gray" stroke-width="3" fill="gray" />
  </svg>`,
    selectedScrollClassName = "selected",
    expLoop = false,
    dragActive = true,
    scrollActive = true,
    springConfig = `spring(1,90,20,13)`,
    child,
    alignment = "start",
    clickEvent = false,
    onClicking = () => {},
  } = props;

  let { parent, selectedScrollSnapIndex = 0 } = props;
  parent = document.querySelector(parent);
  let children = document.querySelectorAll(child);
  children[0].setAttribute("id", "first-child");
  let isDragging = false;

  const indexValue = 1;
  let dotsArray = [];
  let leftOffsetArray = [];
  let allLeftOffsets = [];
  let scrollProgress = 0;
  let lastScrolledTo = getCurrentPosition(parent);
  const lastChild = children[children.length - 1];
  const minWebWidth = 700;

  addSelectedStateClassName(
    selectedScrollClassName,
    children,
    selectedScrollSnapIndex,
    selectedState,
  );

  pushToOffsetArray(
    leftOffsetArray,
    expLoop,
    lastChild,
    children,
    slidesToScroll,
    allLeftOffsets,
    axis,
    alignment,
  );

  const throttleClick = throttle(function () {
    const firstChild =
      parent.childNodes[0].nodeType === Node.ELEMENT_NODE
        ? parent.childNodes[0]
        : parent.childNodes[1];

    parent.removeChild(firstChild);
    parent.appendChild(firstChild);
  }, 200);

  if (clickEvent) {
    children.forEach((i, index) => {
      i.addEventListener("click", () => {
        if (!isDragging) {
          onClicking(scrollProgress, index);
        }
      });
    });
  }

  // scrolls the slider to a particular mentioned value
  function scrollTo(scrollValue, animate, selectedStateValue) {
    if (window.innerWidth > minWebWidth) {
      if (selectedStateValue) {
        removeSelectedStateClassName(children, selectedScrollClassName);

        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          scrollValue,
          selectedStateValue,
        );
      }
      if (axis === "x") {
        if (animate) {
          moveToSnapPoint(
            -leftOffsetArray[scrollValue],
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );
        } else {
          parent.style.transform = `translateX(${-leftOffsetArray[
            scrollValue
          ]}px)`;
        }
      } else
        parent.style.transform = `translateY(${-leftOffsetArray[
          scrollValue
        ]}px)`;
      lastScrolledTo = leftOffsetArray[scrollValue];
    } else {
      if (axis === "x") {
        if (scrollValue <= leftOffsetArray.length)
          parent.scrollTo(leftOffsetArray[scrollValue], 0);
      } else if (scrollValue <= leftOffsetArray.length)
        parent.scrollTo(0, leftOffsetArray[scrollValue]);
      lastScrolledTo = leftOffsetArray[scrollValue];

      if (selectedStateValue) {
        removeSelectedStateClassName(children, selectedScrollClassName);

        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          scrollValue,
          selectedStateValue,
        );
      }
    }
  }

  if (direction === "rtl") {
    reverseChildren(parent);
    children = document.querySelectorAll(child);
    let scrollToVal;
    leftOffsetArray.forEach((i, index) => {
      if (window.innerWidth > minWebWidth) {
        if (i < parent.clientWidth - parent.parentNode.clientWidth) {
          scrollToVal = index;
        }
      }
    });
    if (window.innerWidth > minWebWidth) {
      scrollTo(scrollToVal);
    }
  }

  if (window.innerWidth < minWebWidth)
    document.querySelectorAll("#first-child").forEach(i => {
      i.scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "start",
      });
      window.scrollTo(0, 0);
    });

  if (axis === "y" && window.innerWidth > minWebWidth) {
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
  if (dragActive || scrollActive) handleCursor();

  // resize listerner
  if (watchResize) resizeListener(watchResize);

  // checks if slider can be scrolled towards left direction
  function canScrollPrev() {
    if (window.innerWidth < minWebWidth && axis === "y" && slidesToScroll < 2) {
      if (parent.scrollTop === 0) return false;
      return true;
    }
    if (window.innerWidth < minWebWidth && axis === "x" && slidesToScroll < 2) {
      return parent.scrollLeft !== 0;
    }
    if (leftOffsetArray.indexOf(lastScrolledTo) > 0) return true;
    return false;
  }

  // checking if the slides can be scrolled anymore
  function canScrollNext() {
    if (axis === "x") {
      if (
        window.innerWidth > minWebWidth ||
        (window.innerWidth < minWebWidth && slidesToScroll > 1)
      ) {
        if (
          parent.clientWidth - lastScrolledTo >=
            parent.parentNode.clientWidth + 30 ||
          parent.children[parent.children.length - 1].offsetLeft +
            parent.children[parent.children.length - 1].clientWidth >
            parent.offsetLeft + parent.clientWidth
        )
          return true;
        return false;
      }
      return parent.scrollLeft < parent.scrollWidth - parent.clientWidth - 20;
    }
    if (
      window.innerWidth > minWebWidth ||
      (window.innerWidth < minWebWidth && slidesToScroll > 1)
    ) {
      if (
        parent.clientHeight - lastScrolledTo >=
        parent.parentNode.clientHeight + 30
      )
        return true;
      return false;
    }
    return parent.scrollTop < parent.scrollHeight - parent.clientHeight;
  }
  // returns the slides that are not in view
  function slidesNotInView() {
    const visibleElements = [];
    children.forEach(i => {
      if (!isInViewport(i, parent)) {
        visibleElements.push(Array.from(children).indexOf(i));
      }
    });
    return visibleElements;
  }

  let slidesNotInViewArray = slidesNotInView();
  function loopingActionNext(ox) {
    if (!canScrollNext() && expLoop) {
      if (window.innerWidth < minWebWidth) {
        throttleClick();
      } else {
        slidesNotInViewArray = slidesNotInView();

        slidesNotInViewArray.forEach(i => {
          if (lastScrolledTo > children[i].offsetLeft) {
            children[
              i
            ].style.transform = `translate3d(${parent.clientWidth}px, 0, 0)`;
          }
        });

        setTimeout(() => {
          if (-ox > parent.clientWidth - lastChild.clientWidth / 2) {
            slidesNotInViewArray.forEach(i => {
              children[i].style.transform = `translate3d(0, 0, 0)`;
            });
            parent.style.transform = `translateX(0)`;
            parent.style.transition = `none 0s ease 0s`;
            anime({
              targets: parent,
              translateX: 0,
              translateY: 0,
            });
            lastScrolledTo = 0;
          }
        }, 600);
      }
    }
  }
  function loopingActionPrev(ox) {
    const lastChildX = parent.children[parent.children.length - 1];
    if (!canScrollPrev() && expLoop) {
      if (window.innerWidth < minWebWidth) {
        parent.removeChild(lastChildX);

        parent.prepend(lastChildX);
      } else {
        if (axis === "x") {
          lastChildX.style.transform = `translate3d(${-parent.clientWidth}px, 0, 0)`;
        } else {
          parent.children[
            parent.children.length - 1
          ].style.transform = `translate3d(0, ${-parent.clientHeight}px, 0)`;
        }
        setTimeout(() => {
          if (ox > children[0].clientWidth / 2 && axis === "x") {
            lastChildX.style.transform = `translate3d(0, 0, 0)`;
            parent.style.transform = `translateX(${-lastChildX.offsetLeft}px)`;
            parent.style.transition = `none 0s ease 0s`;
            lastChildX.style.transition = `none 0s ease 0s`;
            anime({
              targets: parent,
              translateX: -lastChildX.offsetLeft,
              translateY: 0,
            });
            lastScrolledTo = 0;
          } else if (axis === "y" && ox > children[0].clientHeight / 2) {
            lastChildX.style.transform = `translate3d(0, 0, 0)`;
            parent.style.transform = `translateY(${-lastChildX.offsetTop}px)`;
            parent.style.transition = `none 0s ease 0s`;
            lastChildX.style.transition = `none 0s ease 0s`;
            anime({
              targets: parent,
              translateY:
                -parent.children[parent.children.length - 1].offsetTop,
            });
            lastScrolledTo = 0;
          }
        }, 600);
      }
    }
  }

  // function loopingActionNextNew() {
  //   if (!canScrollPrev() && expLoop) {
  //     lastChild.style.transform = `translate3d(${-parent.clientWidth}px, 0, 0)`;
  //     setTimeout(() => {
  //       lastChild.style.transform = `translate3d(0, 0, 0)`;
  //       parent.style.transform = `translateX(${-lastChild.offsetLeft}px)`;
  //       parent.style.transition = `none 0s ease 0s`;
  //       lastChild.style.transition = `none 0s ease 0s`;
  //       anime({
  //         targets: parent,
  //         translateX: -lastChild.offsetLeft,
  //         translateY: 0,
  //       });
  //       lastScrolledTo = 0;
  //     }, 600);
  //   }
  // }

  function loopingActionPrevious() {
    if (Math.abs(lastScrolledTo) === 0 && expLoop) {
      lastChild.style.transform = `translate3d(${-parent.clientWidth}px, 0, 0)`;
      setTimeout(() => {
        lastChild.style.transform = `translate3d(0, 0, 0)`;
        parent.style.transform = `translateX(${-lastChild.offsetLeft}px)`;
        lastChild.style.transition = `none 0s ease 0s`;
        anime({
          targets: parent,
          translateX: -lastChild.offsetLeft,
          translateY: 0,
        });
      }, 300);
    }
  }

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

  const observer = mutationObserver(
    dotsFunctionality,
    dotsArray,
    watchSlides,
    lastScrolledTo,
    parent,
    leftOffsetArray,
    selectedScrollClassName,
    children,
    selectedScrollSnapIndex,
    selectedState,
  );

  parent.addEventListener("scroll", () => {
    dotsFunctionality(
      dotsArray,
      getclosestSliderElement(parent.scrollLeft, leftOffsetArray),
    );
    scrollProgress = getScrollProgress(parent, children);
    lastScrolledTo = getclosestSliderElement(
      parent.scrollLeft,
      leftOffsetArray,
    );
    // whileScrolling(scrollProgress, leftOffsetArray.indexOf(lastScrolledTo));
  });

  const demoElem = parent;
  const observerConfig = {
    attributes: true,
    attributeFilter: ["style"],
    childList: !!watchSlides,
  };

  // mutation observer
  if (!autoplay) observer.observe(demoElem, observerConfig);

  function handleWindowWidth() {
    removeScrollClassNames(parent);
    if (window.innerWidth < minWebWidth && slidesToScroll < 2) {
      console.log("aligmn, alignment", alignment);
      addScrollClassNames(
        axis,
        parent,
        slidesToScroll,
        dragFree,
        children,
        alignment,
      );
    }
  }
  handleWindowWidth();

  onInit();

  // scrolling to previous slide
  function scrollPrev(looping) {
    let currentIndex;
    if (selectedScrollSnapIndex !== 0) {
      selectedScrollSnapIndex -= 1;

      addSelectedStateClassName(
        selectedScrollClassName,
        children,
        selectedScrollSnapIndex,
        selectedState,
      );
    }
    if (!looping) {
      leftOffsetArray.forEach((i, index) => {
        if (i === lastScrolledTo) {
          currentIndex = index;
        }
      });

      if (
        window.innerWidth > minWebWidth ||
        (window.innerWidth < minWebWidth && slidesToScroll > 1)
      ) {
        if (expLoop) {
          const uniqueArray = [];
          leftOffsetArray.forEach(i => {
            if (i >= 0) {
              uniqueArray.push(i);
            }
          });

          if (currentIndex === undefined || currentIndex === 0)
            currentIndex = uniqueArray.length - 1;
          loopingActionPrevious(-uniqueArray[currentIndex - 1]);

          moveToSnapPoint(
            -uniqueArray[currentIndex - 1],
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );
          selectedScrollSnapIndex += 1;
          removeSelectedStateClassName(children, selectedScrollClassName);

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            selectedScrollSnapIndex,
            selectedState,
          );
          lastScrolledTo = uniqueArray[currentIndex - 1];

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            uniqueArray.indexOf(lastScrolledTo),
            selectedState,
          );
        }
        if (axis === "x") {
          if (currentIndex - 1 >= 0) {
            moveToSnapPoint(
              -leftOffsetArray[currentIndex - 1],
              axis,
              parent,
              slidesToScroll,
              springConfig,
            );
            selectedScrollSnapIndex += 1;
            removeSelectedStateClassName(children, selectedScrollClassName);

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              selectedScrollSnapIndex,
              selectedState,
            );
            lastScrolledTo = leftOffsetArray[currentIndex - 1];

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              leftOffsetArray.indexOf(lastScrolledTo),
              selectedState,
            );
          } else {
            parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
            lastScrolledTo = leftOffsetArray[currentIndex + 1];

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              leftOffsetArray.indexOf(lastScrolledTo),
              selectedState,
            );
          }
        } else if (currentIndex - 1 >= 0) {
          moveToSnapPoint(
            -leftOffsetArray[currentIndex - 1],
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );
          selectedScrollSnapIndex += 1;
          removeSelectedStateClassName(children, selectedScrollClassName);

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            selectedScrollSnapIndex,
            selectedState,
          );
          lastScrolledTo = leftOffsetArray[currentIndex - 1];
        }
      } else {
        if (currentIndex >= 0) {
          if (axis === "x") {
            if (parent.scrollLeft !== leftOffsetArray[currentIndex - 1])
              parent.scrollTo(leftOffsetArray[currentIndex - 1], 0);
          } else if (parent.scrolTop !== leftOffsetArray[currentIndex - 1])
            parent.scrollTo(0, leftOffsetArray[currentIndex - 1]);
          lastScrolledTo = leftOffsetArray[currentIndex - 1];
        }

        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          leftOffsetArray.indexOf(lastScrolledTo),
          selectedState,
        );
      }
    } else {
      let currentPosition = 0;
      const carouselItems = parent.children;
      currentPosition += carouselItems[0].offsetWidth;

      moveToSnapPoint(
        currentPosition,
        axis,
        parent,
        slidesToScroll,
        springConfig,
      );
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
      lastScrolledTo = currentPosition;
      const lastItem = carouselItems[carouselItems.length - 1];
      parent.insertBefore(lastItem, carouselItems[0]);
      currentPosition -= carouselItems[0].offsetWidth;

      moveToSnapPoint(
        currentPosition,
        axis,
        parent,
        slidesToScroll,
        springConfig,
      );
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
      lastScrolledTo = currentPosition;
    }
  }

  // scrolling to next slide
  function scrollNext(looping) {
    let currentIndex;

    addSelectedStateClassName(
      selectedScrollClassName,
      children,
      selectedScrollSnapIndex,
      selectedState,
    );
    if (!looping) {
      leftOffsetArray.forEach((i, index) => {
        if (i === lastScrolledTo) {
          currentIndex = index;
        }
      });
      if (expLoop) {
        if (currentIndex >= leftOffsetArray.length - 1) {
          currentIndex = leftOffsetArray.length - 2;
          lastScrolledTo = leftOffsetArray[leftOffsetArray.length - 2];
        }
      }

      if (
        window.innerWidth > minWebWidth ||
        (window.innerWidth < minWebWidth && slidesToScroll > 1)
      ) {
        if (expLoop) {
          if (currentIndex === undefined) currentIndex = 0;
          loopingActionNext(-leftOffsetArray[currentIndex + 1], true);

          moveToSnapPoint(
            -leftOffsetArray[currentIndex + 1],
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );

          selectedScrollSnapIndex += 1;
          removeSelectedStateClassName(children, selectedScrollClassName);

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            selectedScrollSnapIndex,
            selectedState,
          );
          lastScrolledTo = leftOffsetArray[currentIndex + 1];

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            leftOffsetArray.indexOf(lastScrolledTo),
            selectedState,
          );
        }
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
            moveToSnapPoint(
              -leftOffsetArray[currentIndex + 1],
              axis,
              parent,
              slidesToScroll,
              springConfig,
            );
            selectedScrollSnapIndex += 1;
            removeSelectedStateClassName(children, selectedScrollClassName);

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              selectedScrollSnapIndex,
              selectedState,
            );
            lastScrolledTo = leftOffsetArray[currentIndex + 1];

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              leftOffsetArray.indexOf(lastScrolledTo),
              selectedState,
            );
          }
        } else if (leftOffsetArray[currentIndex + 1]) {
          parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
          lastScrolledTo = leftOffsetArray[currentIndex + 1];

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            leftOffsetArray.indexOf(lastScrolledTo),
            selectedState,
          );
        }
      } else if (leftOffsetArray[currentIndex + 1]) {
        if (expLoop) {
          if (currentIndex === undefined) currentIndex = 0;
          loopingActionNext(-leftOffsetArray[currentIndex + 1], true);
        }
        if (axis === "x") {
          if (parent.scrollLeft !== leftOffsetArray[currentIndex + 1])
            parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
        } else if (parent.scrollTop !== leftOffsetArray[currentIndex + 1])
          parent.scrollTo(0, leftOffsetArray[currentIndex + 1]);
        lastScrolledTo = leftOffsetArray[currentIndex + 1];

        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          leftOffsetArray.indexOf(lastScrolledTo),
          selectedState,
        );
      }
    } else {
      let currentPosition = 0;
      const carouselItems = parent.children;
      currentPosition -= carouselItems[0].offsetWidth;
      if (window.innerWidth > minWebWidth) {
        moveToSnapPoint(
          currentPosition,
          axis,
          parent,
          slidesToScroll,
          springConfig,
        );
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
      } else if (axis === "x") parent.scrollTo(currentPosition, 0);
      else parent.scrollTo(0, currentPosition);
      const firstItem = carouselItems[0];
      currentPosition += carouselItems[0].offsetWidth;
      if (window.innerWidth > minWebWidth) {
        parent.appendChild(firstItem);

        moveToSnapPoint(
          currentPosition,
          axis,
          parent,
          slidesToScroll,
          springConfig,
        );
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
      } else {
        parent.appendChild(firstItem);

        if (axis === "x") parent.scrollTo(currentPosition, 0);
        else parent.scrollTo(0, currentPosition);
      }
    }
  }

  function handleDots() {
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
        dotsFunctionality(dotsArray, lastScrolledTo);

        addSelectedStateClassName(
          selectedScrollClassName,
          children,
          leftOffsetArray.indexOf(lastScrolledTo),
          selectedState,
        );
        if (window.innerWidth > minWebWidth) {
          moveToSnapPoint(
            -lastScrolledTo,
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );
          selectedScrollSnapIndex += 1;
          children.forEach(x => {
            if (x.classList.contains(selectedScrollClassName)) {
              x?.classList?.remove(selectedScrollClassName);
            }
          });

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            selectedScrollSnapIndex,
            selectedState,
          );
        } else parent.scrollTo(lastScrolledTo, 0);
      });
    });
  }

  // dots functionality
  if (displayDots) {
    handleDots();
  }
  let timeout;

  if (autoplay && indexValue !== null) {
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

  if (!expLoop && direction === "ltr") scrollTo(startIndex);

  // adding gestures like drag, scroll
  Gesture(
    parent,
    {
      onDrag: ({ active, offset: [ox, oy], direction: [dx] }) => {
        isDragging = true;
        scrollProgress = getScrollProgress(parent, children);
        clearTimeout(timeout);
        // setTimeout(() => {

        // }, 200);
        leftOffsetArray = [];
        allLeftOffsets = [];
        const offsetValue = axis === "x" ? ox : oy;
        const lastChildren = parent.children[parent.children.length - 1];
        pushToOffsetArray(
          leftOffsetArray,
          expLoop,
          lastChild,
          children,
          slidesToScroll,
          allLeftOffsets,
          axis,
          alignment,
        );
        if (
          window.innerWidth > minWebWidth ||
          (window.innerWidth < minWebWidth && slidesToScroll > 1)
        ) {
          if (active) {
            if (offsetValue < 10) {
              moveToSnapPoint(
                offsetValue,
                axis,
                parent,
                slidesToScroll,
                springConfig,
              );
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
            }
            if (
              loop &&
              isInViewport(lastChildren, parent) &&
              dx < 0 &&
              -(
                lastChildren.offsetLeft -
                parent.parentNode.clientWidth +
                children[0].clientWidth
              ) === offsetValue
            )
              scrollNext(loop);

            if (loop && parent.children[0].scrollLeft >= 0 && dx > 0)
              throttleFunction(scrollPrev(loop), 250);
          } else {
            let snapValue;
            if (axis === "x") {
              if (expLoop)
                snapValue = -getclosestSliderElement(
                  -offsetValue,
                  leftOffsetArray,
                );
              else
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
            moveToSnapPoint(
              snapValue,
              axis,
              parent,
              slidesToScroll,
              springConfig,
            );
            selectedScrollSnapIndex += 1;
            removeSelectedStateClassName(children, selectedScrollClassName);

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              selectedScrollSnapIndex,
              selectedState,
            );
            lastScrolledTo = getclosestSliderElement(
              -snapValue,
              leftOffsetArray,
            );

            addSelectedStateClassName(
              selectedScrollClassName,
              children,
              leftOffsetArray.indexOf(lastScrolledTo),
              selectedState,
            );
          }

          handleCursor(true);
          if (
            loop &&
            isInViewport(lastChildren, parent) &&
            dx < 0 &&
            -(
              parent.children[parent.children.length - 1].offsetLeft -
              parent.parentNode.clientWidth +
              children[0].clientWidth
            ) === offsetValue
          )
            scrollNext(loop);
          if (loop && parent.children[0].scrollLeft >= 0 && dx > 0)
            throttleFunction(scrollPrev(loop), 2500);
        } else {
          whileDragging(
            scrollProgress,
            leftOffsetArray.indexOf(lastScrolledTo),
            lastScrolledTo,
          );
          if (dx < 0) {
            loopingActionNext(axis === "x" ? ox : oy);
          } else loopingActionPrev(axis === "x" ? ox : oy);

          if (axis === "x") {
            setTimeout(() => {
              lastScrolledTo = getclosestSliderElement(
                parent.scrollLeft,
                leftOffsetArray,
              );
            }, 100);
          } else if (
            slidesToScroll !== 0 &&
            !(slidesToScroll === 1 && dragFree === true)
          ) {
            if (
              getclosestSliderElement(parent.scrollLeft, leftOffsetArray) > 0 &&
              parent.scrollLeft + parent.offsetWidth < parent.scrollWidth
            ) {
              parent.scrollTo(
                0,
                getclosestSliderElement(parent.scrollTop, leftOffsetArray),
              );
            }

            // setTimeout(() => {
            lastScrolledTo = getclosestSliderElement(
              parent.scrollTop,
              leftOffsetArray,
            );
            // }, 500);
          }
        }
        dotsFunctionality(dotsArray, lastScrolledTo);

        setTimeout(() => {
          whileDragging(
            getScrollProgress(parent, children),
            leftOffsetArray.indexOf(lastScrolledTo),
            lastScrolledTo,
          );
        }, 100);
      },
      onWheel: ({ offset: [ox, oy], active, direction: [dx] }) => {
        scrollProgress = getScrollProgress(parent, children);

        const offsetValue = axis === "x" ? -ox : -oy;

        const lastChildren = parent.children[parent.children.length - 1];

        clearTimeout(timeout);
        leftOffsetArray = [];
        allLeftOffsets = [];
        pushToOffsetArray(
          leftOffsetArray,
          expLoop,
          lastChild,
          children,
          slidesToScroll,
          allLeftOffsets,
          axis,
          alignment,
        );
        if (dx > 0) loopingActionNext(axis === "x" ? -ox : oy);
        else loopingActionPrev(axis === "x" ? ox : oy);
        if (active) {
          moveToSnapPoint(
            offsetValue,
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );
          selectedScrollSnapIndex += 1;
          removeSelectedStateClassName(children, selectedScrollClassName);

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            selectedScrollSnapIndex,
            selectedState,
          );
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
            snapValue = -getclosestSliderElement(-offsetValue, leftOffsetArray);
          }

          moveToSnapPoint(
            snapValue,
            axis,
            parent,
            slidesToScroll,
            springConfig,
          );
          selectedScrollSnapIndex += 1;
          removeSelectedStateClassName(children, selectedScrollClassName);

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            selectedScrollSnapIndex,
            selectedState,
          );
          lastScrolledTo = getclosestSliderElement(
            -offsetValue,
            leftOffsetArray,
          );

          addSelectedStateClassName(
            selectedScrollClassName,
            children,
            leftOffsetArray.indexOf(lastScrolledTo),
            selectedState,
          );
        }
        whileScrolling(
          getScrollProgress(parent, children),
          leftOffsetArray.indexOf(lastScrolledTo),
        );
        if (
          loop &&
          isInViewport(lastChildren, parent) &&
          dx < 0 &&
          -(
            lastChildren.offsetLeft -
            parent.parentNode.clientWidth +
            children[0].clientWidth
          ) === offsetValue
        )
          scrollNext(loop);
        if (loop && parent.children[0].scrollLeft >= 0 && dx > 0)
          throttleFunction(scrollPrev(loop), 2500);

        if (axis === "y") {
          document.body.style.overflow = "hidden";
        }
        dotsFunctionality(dotsArray, lastScrolledTo);
      },
      onDragEnd: ({ offset: [ox, oy], direction: [dx] }) => {
        handleCursor();
        whileDragging(
          scrollProgress,
          leftOffsetArray.indexOf(lastScrolledTo),
          lastScrolledTo,
        );
        if (
          window.innerWidth > minWebWidth ||
          (window.innerWidth < minWebWidth && slidesToScroll > 1)
        ) {
          if (dx < 0) loopingActionNext(axis === "x" ? ox : oy);
          else loopingActionPrev(axis === "x" ? ox : oy);
        }
        if (window.innerWidth < minWebWidth && !expLoop && slidesToScroll < 2) {
          if (axis === "x") {
            parent.scrollTo(
              getclosestSliderElement(parent.scrollLeft, leftOffsetArray),
              0,
            );
            setTimeout(() => {
              lastScrolledTo = getclosestSliderElement(
                parent.scrollLeft,
                leftOffsetArray,
              );
            }, 100);
          } else if (
            slidesToScroll !== 0 &&
            !(slidesToScroll === 1 && dragFree === true)
          ) {
            if (
              getclosestSliderElement(parent.scrollLeft, leftOffsetArray) > 0 &&
              parent.scrollLeft + parent.offsetWidth < parent.scrollWidth
            ) {
              parent.scrollTo(
                0,
                getclosestSliderElement(parent.scrollTop, leftOffsetArray),
              );
            }
            lastScrolledTo = getclosestSliderElement(
              parent.scrollTop,
              leftOffsetArray,
            );
          } else {
            setTimeout(() => {
              lastScrolledTo = getclosestSliderElement(
                parent.scrollTop,
                leftOffsetArray,
              );
            }, 100);
          }
        }
        setTimeout(() => {
          whileDragging(
            getScrollProgress(parent, children),
            leftOffsetArray.indexOf(lastScrolledTo),
            lastScrolledTo,
          );
        }, 100);

        setTimeout(() => {
          isDragging = false;
        }, 200);
      },
      onWheelEnd: ({ offset: [ox, oy], direction: [dx] }) => {
        if (axis === "y") {
          document.body.style.overflow = "scroll";
        }

        if (dx < 0) loopingActionNext(axis === "x" ? ox : oy);
        else loopingActionPrev(axis === "x" ? ox : oy);
      },
    },
    {
      wheel: {
        enabled: window.innerWidth > minWebWidth && scrollActive,
        bounds: {
          left: 0,
          right: !expLoop
            ? parent.children[parent.children.length - 1].offsetLeft -
              parent.parentNode.clientWidth +
              children[0].clientWidth
            : undefined,
          top: 0,
          bottom: !expLoop
            ? parent.clientHeight - parent.parentNode.clientHeight
            : undefined,
        },
        axis,
      },
      drag: {
        from: () => [
          getCurrentPosition(parent),
          getCurrentPosition(parent, true),
        ],
        enabled: dragActive,
        bounds: {
          left: !expLoop
            ? -(
                parent.children[parent.children.length - 1].offsetLeft -
                parent.parentNode.clientWidth +
                children[0].clientWidth
              )
            : undefined,
          top: -(parent.clientHeight - parent.parentNode.clientHeight),
          bottom: !expLoop
            ? parent.clientHeight - parent.parentNode.clientHeight
            : undefined,
        },
        rubberband: true,
        axis,
      },
    },
  );

  // returns the slides that are in view
  function slidesInView() {
    const visibleElements = [];
    children.forEach(i => {
      if (isInViewport(i, parent)) {
        visibleElements.push(Array.from(children).indexOf(i));
      }
    });
    return visibleElements;
  }

  // returns slides
  function slideNodes() {
    return Array.from(children);
  }

  // returns the root node
  function rootNode() {
    return parent.parentNode;
  }

  // returns container node
  function containerNode() {
    return parent;
  }

  function addSelectedStateClass(childIndexValue) {
    removeSelectedStateClassName(children, selectedScrollClassName);
    if (selectedState) {
      children[childIndexValue]?.classList.add(selectedScrollClassName);
    }
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
    getScrollProgress,
    addSelectedStateClass,
  };
  return self;
}
export default Carousel;
