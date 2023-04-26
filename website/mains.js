import "./style.css";
import EmblaCarousel from "embla-carousel";

import Carousel from "../src/carousel";

let carouselValue;
let dotCarousel;

function displayArrows() {
  if (!carouselValue.canScrollPrev()) {
    document.querySelector(".left-arrow").style.display = "none";
  } else {
    document.querySelector(".left-arrow").style.display = "block";
  }
  if (!carouselValue.canScrollNext()) {
    document.querySelector(".right-arrow").style.display = "none";
  } else {
    document.querySelector(".right-arrow").style.display = "block";
  }
}
function displayArrowsNew() {
  if (!dotCarousel.canScrollPrev()) {
    document.querySelector(".left-arrow.dots").style.display = "none";
  } else {
    document.querySelector(".left-arrow.dots").style.display = "block";
  }
  if (!dotCarousel.canScrollNext()) {
    document.querySelector(".right-arrow.dots").style.display = "none";
  } else {
    document.querySelector(".right-arrow.dots").style.display = "block";
  }
}

document.querySelector(".left-arrow").style.display = "none";
document.querySelector(".left-arrow.dots").style.display = "none";

carouselValue = Carousel({
  parent: ".parent2 .inner",
  child: ".parent2 .slider",
  slidesToScroll: 4,

  whileScrolling: () => {
    displayArrows();
    // document.body.style.overflowY = "hidden";
  },
  whileDragging: () => {
    displayArrows();

    // document.body.style.overflowY = "hidden";
  },
  //   dragFree: false,
});

// Carousel({
//   parent: ".loop .inner",
//   child: ".loop .slider",
//   loop: true,
//   whileScrolling: () => {
//     displayArrows();
//     // document.body.style.overflowY = "hidden";
//   },
//   whileDragging: () => {
//     displayArrows();

//     // document.body.style.overflowY = "hidden";
//   },
// });

dotCarousel = Carousel({
  parent: ".dots-parent .inner",
  child: ".dots-parent .slider",
  displayDots: true,
  whileScrolling: () => {
    displayArrowsNew();
  },
  whileDragging: () => {
    displayArrowsNew();
  },
});
Carousel({
  parent: ".autoplay .inner",
  child: ".autoplay .slider",
  autoplay: true,
  whileScrolling: () => {
    displayArrows();
    // document.body.style.overflowY = "hidden";
  },
  whileDragging: () => {
    displayArrows();
    // document.body.style.overflowY = "hidden";
  },
});
// Carousel({
//   parent: ".dragfree .inner",
//   child: ".dragfree .slider",
//   dragFree: true,
//   whileScrolling: () => {
//     displayArrows();
//   },
//   whileDragging: () => {
//     displayArrows();
//   },
// });

const emblaNode = document.querySelector(".embla");
const options = {
  align: "start",
  loop: true,
  containScroll: "trimSnaps",
  dragFree: false,
};

EmblaCarousel(emblaNode, options);

document.querySelector(".left-arrow").addEventListener("click", () => {
  carouselValue.scrollPrev();
  displayArrows();

  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
});
document.querySelector(".right-arrow").addEventListener("click", () => {
  carouselValue.scrollNext();
  displayArrows();
  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
  console.log(carouselValue.slideNodes(), "slide nodes");
  console.log(carouselValue.rootNode(), "root node");
  console.log(carouselValue.containerNode(), "container node");
});

document.querySelector(".left-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollPrev();
  displayArrowsNew();
});
document.querySelector(".right-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollNext();
  displayArrowsNew();
});
