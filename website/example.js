import Carousel from "../src/carousel";

let counter = "";
counter = Carousel({
  parent: ".carousel",
  child: ".counter-li",
  axis: "y",
  selectedState: true,
  customDragAction: "rotate",
  scrollOnClick: false,
  initialRotateValue: 90,
  customRotateArray: [0, -40, -80, -120, -160, -200, -240, -280, -320, -360],
  onClicking: (scrollProgress, index) => {
    counter.scrollTo(index, true, false, -index * 40);
    counter.addSelectedStateClass(index);
  },
  springConfig: "easeInCirc",
  dragActive: false,
});

// document.querySelectorAll(".counter-li").forEach((i, index) => {
//   const element = i;
//   const circleDivision = 360 / document.querySelectorAll(".counter-li").length;
//   if (index === 0) {
//     element.style.transform = `rotateX(${circleDivision}deg) translatez(${-window.innerWidth}px)`;
//   } else if (index === 1) {
//     element.style.transform = `rotateX(${0}deg) translatez(${-window.innerWidth}px)`;
//   } else
//     element.style.transform = `rotateX(${
//       (index - 1) * -circleDivision
//     }deg) translatez(${-window.innerWidth}px)`;
// });
