import { Gesture } from "@use-gesture/vanilla";
import anime from "animejs/lib/anime.es";

import {
  addScrollClassNames,
  getclosestSliderElement,
  getCurrentPosition,
  getScrollProgress,
  isInViewport,
  moveToSnapPoint,
  mutationObserver,
  removeScrollClassNames,
  resizeListener,
  reverseChildren,
} from "./helpers/actions";

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
  } = props;

  let { parent, selectedScrollSnapIndex = 0 } = props;
  parent = document.querySelector(parent);
  let children = document.querySelectorAll(child);
  children[0].setAttribute("id", "first-child");

  let indexValue = 1;
  let dotsArray = [];
  let leftOffsetArray = [];
  let allLeftOffsets = [];
  let scrollProgress = 0;
  let lastScrolledTo = getCurrentPosition(parent);
  const lastChild = children[children.length - 1];
  // pushing all the offset values of slides into an array
  function pushToOffsetArray() {
    if (expLoop) leftOffsetArray.push(-lastChild.clientWidth);

    children.forEach((i, index) => {
      if (index % slidesToScroll === 0) {
        if (axis === "x") leftOffsetArray.push(i.offsetLeft);
        else leftOffsetArray.push(i.offsetTop);
      }
    });
    if (expLoop)
      leftOffsetArray.push(lastChild.offsetLeft + children[0].clientWidth);
    children.forEach(i => {
      allLeftOffsets.push(i.offsetLeft);
    });
  }

  // appends 'selected slide' classname
  function addSelectedStateClassName(childIndexValue) {
    if (selectedState) {
      children[childIndexValue]?.classList.add(selectedScrollClassName);
    }
  }

  addSelectedStateClassName(selectedScrollSnapIndex);

  pushToOffsetArray();

  // scrolls the slider to a particular mentioned value
  function scrollTo(scrollValue) {
    if (window.innerWidth > 700) {
      if (axis === "x")
        parent.style.transform = `translateX(${-leftOffsetArray[
          scrollValue
        ]}px)`;
      else
        parent.style.transform = `translateY(${-leftOffsetArray[
          scrollValue
        ]}px)`;
      lastScrolledTo = leftOffsetArray[scrollValue];
    } else {
      if (axis === "x") {
        parent.scrollTo(leftOffsetArray[scrollValue], 0);
      } else parent.scrollTo(0, leftOffsetArray[scrollValue]);
      lastScrolledTo = leftOffsetArray[scrollValue];
    }
  }

  if (direction === "rtl") {
    reverseChildren(parent);
    children = document.querySelectorAll(child);
    let scrollToVal;
    leftOffsetArray.forEach((i, index) => {
      if (window.innerWidth > 700) {
        if (i < parent.clientWidth - parent.parentNode.clientWidth) {
          scrollToVal = index;
        }
      }
    });
    if (window.innerWidth > 700) {
      scrollTo(scrollToVal);
    }
  }
  if (window.innerWidth < 700)
    document.querySelectorAll("#first-child").forEach(i => {
      i.scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "start",
      });
      window.scrollTo(0, 0);
    });

  if (axis === "y" && window.innerWidth > 700) {
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

  function throttle(fn, delay) {
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
  const throttleClick = throttle(function () {
    const firstChild =
      parent.childNodes[0].nodeType === Node.ELEMENT_NODE
        ? parent.childNodes[0]
        : parent.childNodes[1];

    parent.removeChild(firstChild);
    parent.appendChild(firstChild);
  }, 200);

  // checks if slider can be scrolled towards left direction
  function canScrollPrev() {
    if (window.innerWidth < 700 && axis === "y") {
      if (parent.scrollTop === 0) return false;
      return true;
    }
    if (window.innerWidth < 700 && axis === "x") {
      return parent.scrollLeft !== 0;
    }
    if (leftOffsetArray.indexOf(lastScrolledTo) > 0) return true;
    return false;
  }

  // checking if the slides can be scrolled anymore
  function canScrollNext() {
    if (axis === "x") {
      if (window.innerWidth > 700) {
        if (
          parent.clientWidth - lastScrolledTo >=
          parent.parentNode.clientWidth + 30
        )
          return true;
        return false;
      }
      return parent.scrollLeft < parent.scrollWidth - parent.clientWidth - 20;
    }
    if (window.innerWidth > 700) {
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
      if (window.innerWidth < 700) {
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
    const lastChildX = parent.childNodes[parent.childNodes.length - 1];

    if (!canScrollPrev() && expLoop) {
      if (window.innerWidth < 700) {
        parent.removeChild(lastChildX);

        parent.prepend(lastChildX);
      } else {
        lastChildX.style.transform = `translate3d(${-parent.clientWidth}px, 0, 0)`;
        setTimeout(() => {
          if (ox > children[0].clientWidth / 2) {
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
          }
        }, 600);
      }
    }
  }

  function loopingActionNextNew() {
    if (!canScrollPrev() && expLoop) {
      lastChild.style.transform = `translate3d(${-parent.clientWidth}px, 0, 0)`;
      setTimeout(() => {
        lastChild.style.transform = `translate3d(0, 0, 0)`;
        parent.style.transform = `translateX(${-lastChild.offsetLeft}px)`;
        parent.style.transition = `none 0s ease 0s`;
        lastChild.style.transition = `none 0s ease 0s`;
        anime({
          targets: parent,
          translateX: -lastChild.offsetLeft,
          translateY: 0,
        });
        lastScrolledTo = 0;
      }, 600);
    }
  }
  function loopingActionPrevious() {
    if (Math.abs(lastScrolledTo) === 0 && expLoop) {
      lastChild.style.transform = `translate3d(${-parent.clientWidth}px, 0, 0)`;
      setTimeout(() => {
        lastChild.style.transform = `translate3d(0, 0, 0)`;
        parent.style.transform = `translateX(${-lastChild.offsetLeft}px)`;
        parent.style.transition = `none 0s ease 0s`;
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
  );

  parent.addEventListener("scroll", () => {
    dotsFunctionality(
      dotsArray,
      getclosestSliderElement(parent.scrollLeft, leftOffsetArray),
    );
    scrollProgress = getScrollProgress(parent, children);

    whileScrolling(scrollProgress);
  });

  const demoElem = parent;
  const observerConfig = {
    attributes: true,
    attributeFilter: ["style"],
    childList: !!watchSlides,
  };

  // mutation observer
  observer.observe(demoElem, observerConfig);

  function handleWindowWidth() {
    removeScrollClassNames(parent);
    if (window.innerWidth < 700) {
      addScrollClassNames(axis, parent, slidesToScroll, dragFree, children);
    }
  }
  handleWindowWidth();

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
          children.forEach(i => {
            if (i.classList.contains(selectedScrollClassName)) {
              i?.classList?.remove(selectedScrollClassName);
            }
          });

          addSelectedStateClassName(selectedScrollSnapIndex);
          lastScrolledTo = uniqueArray[currentIndex - 1];
          addSelectedStateClassName(uniqueArray.indexOf(lastScrolledTo));
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
            children.forEach(i => {
              if (i.classList.contains(selectedScrollClassName)) {
                i?.classList?.remove(selectedScrollClassName);
              }
            });

            addSelectedStateClassName(selectedScrollSnapIndex);
            lastScrolledTo = leftOffsetArray[currentIndex - 1];
            addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
          } else {
            parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
            lastScrolledTo = leftOffsetArray[currentIndex + 1];
            if (selectedState)
              addSelectedStateClassName(
                leftOffsetArray.indexOf(lastScrolledTo),
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
          children.forEach(i => {
            if (i.classList.contains(selectedScrollClassName)) {
              i?.classList?.remove(selectedScrollClassName);
            }
          });

          addSelectedStateClassName(selectedScrollSnapIndex);
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
        addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
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

      addSelectedStateClassName(selectedScrollSnapIndex);
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

      addSelectedStateClassName(selectedScrollSnapIndex);
      lastScrolledTo = currentPosition;
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
      if (expLoop) {
        if (currentIndex >= leftOffsetArray.length - 1) {
          currentIndex = leftOffsetArray.length - 2;
          lastScrolledTo = leftOffsetArray[leftOffsetArray.length - 2];
        }
      }

      if (window.innerWidth > 700) {
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
          children.forEach(i => {
            if (i.classList.contains(selectedScrollClassName)) {
              i?.classList?.remove(selectedScrollClassName);
            }
          });

          addSelectedStateClassName(selectedScrollSnapIndex);
          lastScrolledTo = leftOffsetArray[currentIndex + 1];
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
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
            children.forEach(i => {
              if (i.classList.contains(selectedScrollClassName)) {
                i?.classList?.remove(selectedScrollClassName);
              }
            });

            addSelectedStateClassName(selectedScrollSnapIndex);
            lastScrolledTo = leftOffsetArray[currentIndex + 1];
            addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
          }
        } else if (leftOffsetArray[currentIndex + 1]) {
          parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
          lastScrolledTo = leftOffsetArray[currentIndex + 1];
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        }
      } else if (leftOffsetArray[currentIndex + 1]) {
        if (expLoop) {
          if (currentIndex === undefined) currentIndex = 0;
          loopingActionNext(-leftOffsetArray[currentIndex + 1], true);

          // moveToSnapPoint(-leftOffsetArray[currentIndex + 1], axis);
          // lastScrolledTo = leftOffsetArray[currentIndex + 1];
          // addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        }
        if (axis === "x") {
          if (parent.scrollLeft !== leftOffsetArray[currentIndex + 1])
            parent.scrollTo(leftOffsetArray[currentIndex + 1], 0);
        } else if (parent.scrolTop !== leftOffsetArray[currentIndex + 1])
          parent.scrollTo(0, leftOffsetArray[currentIndex + 1]);
        lastScrolledTo = leftOffsetArray[currentIndex + 1];
        addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
      }
    } else {
      let currentPosition = 0;
      const carouselItems = parent.children;
      currentPosition -= carouselItems[0].offsetWidth;
      if (window.innerWidth > 700) {
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

        addSelectedStateClassName(selectedScrollSnapIndex);
      } else if (axis === "x") parent.scrollTo(currentPosition, 0);
      else parent.scrollTo(0, currentPosition);
      const firstItem = carouselItems[0];
      currentPosition += carouselItems[0].offsetWidth;
      if (window.innerWidth > 700) {
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

        addSelectedStateClassName(selectedScrollSnapIndex);
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
        addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        if (window.innerWidth > 700) {
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

          addSelectedStateClassName(selectedScrollSnapIndex);
        } else parent.scrollTo(lastScrolledTo, 0);
      });
    });
  }

  // dots functionality
  if (displayDots) {
    handleDots();
  }
  let timeout;

  // autoplay slides functionality
  function autoplayLoop() {
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
          selectedScrollSnapIndex += 1;
          children.forEach(i => {
            if (i.classList.contains(selectedScrollClassName)) {
              i?.classList?.remove(selectedScrollClassName);
            }
          });

          addSelectedStateClassName(selectedScrollSnapIndex);
          lastScrolledTo = leftOffsetArray[indexValue];
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
          dotsArray[indexValue]?.classList.add("selected-dot");
        } else {
          indexValue = 0;
        }
      } else {
        if (indexValue === leftOffsetArray.length) {
          indexValue = 0;
        }
        parent.scrollTo(leftOffsetArray[indexValue], 0);
      }
      indexValue += 1;

      if (indexValue < leftOffsetArray.length) {
        autoplayLoop();
      }
    }, autoplayTimeout);
  }

  if (autoplay && indexValue !== null) {
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

  if (!expLoop && direction === "ltr") scrollTo(startIndex);

  // adding gestures like drag, scroll
  Gesture(
    parent,
    {
      onDrag: ({ active, offset: [ox, oy], direction: [dx] }) => {
        scrollProgress = getScrollProgress(parent, children);
        clearTimeout(timeout);
        // setTimeout(() => {
        whileDragging(scrollProgress);
        // }, 200);
        leftOffsetArray = [];
        allLeftOffsets = [];
        const offsetValue = axis === "x" ? ox : oy;
        const lastChildren = parent.children[parent.children.length - 1];
        pushToOffsetArray();
        if (
          window.innerWidth > 700
          // -ox < parent.clientWidth - lastChild.clientWidth + 700
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

              addSelectedStateClassName(selectedScrollSnapIndex);
            }
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
            children.forEach(i => {
              if (i.classList.contains(selectedScrollClassName)) {
                i?.classList?.remove(selectedScrollClassName);
              }
            });

            addSelectedStateClassName(selectedScrollSnapIndex);
            lastScrolledTo = getclosestSliderElement(
              -snapValue,
              leftOffsetArray,
            );
            addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
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
          if (dx < 0) {
            loopingActionNext(ox);
          } else loopingActionPrev(ox);
          whileScrolling(scrollProgress);
          if (axis === "x") {
            if (
              slidesToScroll !== 0 &&
              !(slidesToScroll === 1 && dragFree === true)
            ) {
              if (
                getclosestSliderElement(parent.scrollLeft, leftOffsetArray) > 0
              ) {
                parent.scrollTo(
                  getclosestSliderElement(parent.scrollLeft, leftOffsetArray),
                  0,
                );
              }

              lastScrolledTo = getclosestSliderElement(
                parent.scrollLeft,
                leftOffsetArray,
              );
            }
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

            setTimeout(() => {
              lastScrolledTo = getclosestSliderElement(
                parent.scrollTop,
                leftOffsetArray,
              );
            }, 500);
          }
        }
      },
      onWheel: ({ offset: [ox, oy], active, direction: [dx] }) => {
        scrollProgress = getScrollProgress(parent, children);

        const offsetValue = axis === "x" ? -ox : -oy;

        const lastChildren = parent.children[parent.children.length - 1];

        clearTimeout(timeout);
        leftOffsetArray = [];
        allLeftOffsets = [];
        pushToOffsetArray();

        loopingActionNextNew(ox);
        loopingActionPrev(ox);
        if (active) {
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

          addSelectedStateClassName(selectedScrollSnapIndex);
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
          children.forEach(i => {
            if (i.classList.contains(selectedScrollClassName)) {
              i?.classList?.remove(selectedScrollClassName);
            }
          });

          addSelectedStateClassName(selectedScrollSnapIndex);
          lastScrolledTo = getclosestSliderElement(
            -offsetValue,
            leftOffsetArray,
          );
          addSelectedStateClassName(leftOffsetArray.indexOf(lastScrolledTo));
        }
        whileScrolling(scrollProgress);
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

        if (axis === "y") {
          document.body.style.overflow = "hidden";
        }
      },
      onDragEnd: ({ offset: [ox], direction: [dx] }) => {
        handleCursor();
        whileScrolling(scrollProgress);
        whileDragging(scrollProgress);
        if (window.innerWidth > 700) {
          if (dx < 0) loopingActionNext(ox);
          else loopingActionPrev(ox);
        }
        if (window.innerWidth < 700 && !expLoop) {
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
            }, 500);
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
            setTimeout(() => {
              lastScrolledTo = getclosestSliderElement(
                parent.scrollTop,
                leftOffsetArray,
              );
            }, 500);
          } else {
            setTimeout(() => {
              lastScrolledTo = getclosestSliderElement(
                parent.scrollTop,
                leftOffsetArray,
              );
            }, 500);
          }
        }
      },
      onWheelEnd: ({ offset: [ox], direction: [dx] }) => {
        if (axis === "y") {
          document.body.style.overflow = "scroll";
        }

        if (dx < 0) loopingActionNext(ox);
        else loopingActionPrev(ox);
      },
    },
    {
      wheel: {
        enabled: window.innerWidth > 700 && scrollActive,
        bounds: {
          left: 0,
          right: !expLoop
            ? parent.children[parent.children.length - 1].offsetLeft -
              parent.parentNode.clientWidth +
              children[0].clientWidth
            : undefined,
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
        enabled: dragActive,
        bounds: {
          left: !expLoop
            ? -(
                parent.children[parent.children.length - 1].offsetLeft -
                parent.parentNode.clientWidth +
                children[0].clientWidth
              )
            : undefined,
          bottom: parent.clientHeight - parent.parentNode.clientHeight,
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
  };
  return self;
}
export default Carousel;
