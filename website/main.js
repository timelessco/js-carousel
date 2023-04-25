// import "./style.css";
// import { DragGesture } from "@use-gesture/vanilla";
// import anime from "animejs/lib/anime.es";
// import EmblaCarousel from "embla-carousel";

// const slider = document.querySelector(".parent2");
// // let mouseDown = false;
// let startValue;
// let scrollLeft;
// const inner = document.querySelector(".parent2 .inner");

// // slider.addEventListener("scroll", e => {
// //   e.preventDefault();
// //   // slider.scrollLeft = 0;

// // });
// // const gesture = new WheelGesture(slider, ({ movement: [ox, oy], ...state }) => {
// //   let value;
// //   if (ox < 0) {
// //     value = 0;
// //   } else if (ox > inner.clientWidth) {
// //     ox = inner.clientWidth;
// //   } else {
// //     value = -ox;
// //   }

// //   anime({
// //     targets: inner,
// //     translateX: value,
// //     easing: "spring(1,100,30,30)",
// //   });
// // });
// DragGesture(slider, ({ active }) => {
//   if (active) {
//   } else {
//   }
// });
// let lastDelta = 0;
// slider.addEventListener("wheel", e => {
//   let delta = Math.abs(e.deltaX);
//   // console.log(lastDelta, "last", delta);
//   if (delta > lastDelta) {
//     anime({
//       targets: inner,
//       translateX: -delta,
//       easing: "spring(1,100,30,30)",
//     });
//     lastDelta = delta;
//   }
//   if (delta <= 0) {
//     lastDelta = 0;
//   }
// });
// // slider.addEventListener("touchstart", e => {
// //   startFunction(e);
// // });
// // slider.addEventListener("mousedown", e => {
// //   slider.style.scrollSnapType = "unset";
// //   startFunction(e);
// // });

// const startFunction = e => {
//   slider.classList.remove("active");
//   mouseDown = true;
//   startValue = e.pageX - slider.offsetLeft;
//   scrollLeft = slider.scrollLeft;
//   slider.style.scrollSnapType = "unset";
// };

// // // slider.addEventListener("touchend", e => {
// // //   endFunction(e);
// // // });

// slider.addEventListener("mouseup", e => {
//   // endFunction(e);
//   mouseDown = false;
// });

// const endFunction = e => {
//   const x = e.pageX - slider.offsetLeft;
//   const scrollSpeed = x - startValue;
//   const child2 = document.querySelectorAll(".parent2 .slider");
//   let leftOffsetValues = [];

//   mouseDown = false;
//   slider.classList.add("active");
//   child2.forEach(i => leftOffsetValues.push(i.offsetLeft));
//   // console.log(
//   //   closestTo(scrollLeft - scrollSpeed, leftOffsetValues),
//   //   typeof closestTo(scrollLeft - scrollSpeed, leftOffsetValues),
//   // );

//   anime({
//     targets: inner,
//     translateX: `${-closestTo(scrollLeft - scrollSpeed, leftOffsetValues)}px`,
//     duration: 2,
//     easing: "spring(1,100,30,30)",
//   });
//   // slider.scrollLeft =
//   // anime({
//   //   targets: inner,
//   //   translateX: `-${closestTo(scrollLeft - scrollSpeed, leftOffsetValues)}px`,
//   //   duration: 2,
//   //   easing: "spring(1,100,30,30)",
//   // });
// };

// function closestTo(offset, array) {
//   let differences = [];
//   array.forEach(i => {
//     differences.push(Math.abs(offset - i));
//   });
//   let minIndex = differences.indexOf(Math.min(...differences));

//   return array[minIndex];
// }

// // slider.addEventListener("mousemove", e => {
// //   e.preventDefault();
// //   const x = e.pageX - slider.offsetLeft;
// //   const scrollSpeed = x - startValue;
// //   let scrollValue;
// //   if (-(scrollLeft - scrollSpeed) > 0) {
// //     scrollValue = 0;
// //   } else if (scrollLeft - scrollSpeed > inner.clientWidth - window.innerWidth) {
// //     scrollValue = -(inner.clientWidth - window.innerWidth);
// //   } else {
// //     scrollValue = -(scrollLeft - scrollSpeed);
// //   }
// //   if (mouseDown) {
// //     anime({
// //       targets: inner,
// //       translateX: scrollValue,
// //       duration: 2,
// //       easing: "spring(1,100,30,30)",
// //     });
// //     // slider.scrollLeft = scrollLeft - scrollSpeed;

// //     // slider.style.scrollSnapType = "unset";
// //   }
// //   // else {
// //   //   setTimeout(() => {
// //   //     slider.style.scrollSnapType = "x mandatory";
// //   //   }, 1000);
// //   // }
// // });

// let scrollFlag = 0;
// slider.addEventListener("wheel", () => {
//   if (scrollFlag === 0) {
//     // slider.style.scrollSnapType = "x mandatory";
//     scrollFlag = 1;
//   }
// });
// slider.addEventListener("scrollend", () => {
//   // slider.style.scrollSnapType = "unset";
//   scrollFlag = 0;
// });
// // let lastScrolledTo = el.scrollLeft;
// // let currentIndex;

// // document.querySelector(".next").addEventListener("click", () => {
// //   leftOffsetArray.forEach((i, index) => {
// //     if (i === lastScrolledTo) {
// //       currentIndex = index;
// //     }
// //   });

// //   if (currentIndex < leftOffsetArray.length - 2) {
// //     el.scrollTo(leftOffsetArray[currentIndex + 1], 0);
// //     lastScrolledTo = leftOffsetArray[currentIndex + 1];
// //   }
// // });

// // document.querySelector(".previous").addEventListener("click", () => {
// //   leftOffsetArray.forEach((i, index) => {
// //     if (i === lastScrolledTo) {
// //       currentIndex = index;
// //     }
// //   });

// //   el.scrollTo(leftOffsetArray[currentIndex - 1], 0);
// //   lastScrolledTo = leftOffsetArray[currentIndex - 1];
// // });

// // import "./style.css";
// // import { DragGesture } from "@use-gesture/vanilla";
// // import anime from "animejs/lib/anime.es.js";

// // const el = document.querySelector(".parent");
// const child = document.querySelectorAll(".parent .slider");
// let leftOffsetArray = [];
// child.forEach(i => leftOffsetArray.push(i.offsetLeft));

// const gesture = new DragGesture(
//   slider,
//   ({ active, offset: [mx, my] }) => {
//     leftOffsetArray = [];
//     child.forEach(i => leftOffsetArray.push(i.offsetLeft));
//     if (window.innerWidth > 700) {
//       slider.style.scrollSnapType = "unset";
//       slider.style.scrollBehaviour = "auto";

//       if (active) {
//         slider.scrollTo(-mx, 0);
//       } else {
//         slider.style.scrollBehaviour = "smooth";
//         slider.scrollTo(closestTo(-mx, leftOffsetArray), 0);
//       }
//     }
//   },
//   {
//     axis: "x",
//   },
// );

// // function closestTo(offset, array) {
// //   let differences = [];
// //   array.forEach(i => {
// //     differences.push(Math.abs(offset - i));
// //   });

// //   let minIndex = differences.indexOf(Math.min(...differences));
// //   return array[minIndex];
// // }
// // el.addEventListener("wheel", () => {
// //   el.style.scrollSnapType = "x mandatory";
// // });
// // let lastScrolledTo = el.scrollLeft;
// // let currentIndex;

// // document.querySelector(".next").addEventListener("click", () => {
// //   leftOffsetArray.forEach((i, index) => {
// //     if (i === lastScrolledTo) {
// //       currentIndex = index;
// //     }
// //   });

// //   if (currentIndex < leftOffsetArray.length - 2) {
// //     el.scrollTo(leftOffsetArray[currentIndex + 1], 0);
// //     lastScrolledTo = leftOffsetArray[currentIndex + 1];
// //   }
// // });

// // document.querySelector(".previous").addEventListener("click", () => {
// //   leftOffsetArray.forEach((i, index) => {
// //     if (i === lastScrolledTo) {
// //       currentIndex = index;
// //     }
// //   });

// //   el.scrollTo(leftOffsetArray[currentIndex - 1], 0);
// //   lastScrolledTo = leftOffsetArray[currentIndex - 1];
// // });

// const el2 = document.querySelector(".parent2");
// const child2 = document.querySelectorAll(".parent2 .slider");
// let leftOffsetValues = [];
// let flag = 0;
// child2.forEach(i => leftOffsetValues.push(i.offsetLeft));
// // new DragGesture(el2, ({ active, movement: [mx, my] }) => {
// //   //   inner.style.paddingLeft = 0;
// //   let value;
// //   flag++;
// //   if (window.innerWidth > 700) {
// //     if (mx > 0) {
// //       value = 0;
// //     } else if (mx < -inner.clientWidth + el2.clientWidth) {
// //       value = -inner.clientWidth + el2.clientWidth;
// //     } else {
// //       value = mx;
// //     }
// //     if (active) {
// //       anime({
// //         targets: inner,
// //         translateX: value,
// //         duration: 0.2,
// //         easing: `spring(1,100,30,30)`,
// //       });
// //     } else {
// //       // flag > 2;
// //       anime({
// //         targets: inner,
// //         translateX:
// //           -closestTo(-mx, leftOffsetValues) <
// //           -inner.clientWidth + el2.clientWidth
// //             ? -inner.clientWidth + el2.clientWidth
// //             : -closestTo(-mx, leftOffsetValues),
// //         duration: 2,
// //         easing: "spring(1,100,30,11)",
// //       });
// //     }
// //   }
// // });

// el2.addEventListener("scroll", () => {
//   //   //   if (el2.scrollLeft > inner.clientWidth - el2.clientWidth) {
//   //   //     el2.scrollLeft = inner.clientWidth - el2.clientWidth;
//   //   //   }

//   var style = window.getComputedStyle(inner);
//   var matrix = new WebKitCSSMatrix(style.transform);
//   if (inner.style.paddingLeft !== `${-matrix.m41}px`) {
//     // inner.style.paddingLeft = `${-matrix.m41}px`;
//     // inner.style.marginRight = `${matrix.m41}px`;
//     // inner.style.width = `${inner.clientWidth - -matrix.m41}px`;
//     //     // if (el2.scrollLeft !== el2.scrollLeft + -matrix.m41) {
//     //     //   el2.scrollLeft = el2.scrollLeft + -matrix.m41;
//     //     //   el2.scrollBehaviour = "none";
//     //     // }
//   }

//   //   //   el2.scrollLeft = -matrix.m41;
//   //   //   inner.scrollLeft = -matrix.m41;
// });
// // // function closestToVal(offset, array){
// // //     array.forEach(())
// // // }

// const emblaNode = document.querySelector(".embla");
// let options = {
//   align: "start",
//   slidesToScroll: 1,
//   skipSnaps: true,
//   containScroll: "trimSnaps",
//   dragFree: false,
//   // loop: true,
// };

// const emblaApi = EmblaCarousel(emblaNode, options);
