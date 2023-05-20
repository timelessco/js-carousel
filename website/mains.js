import "./style.css";
import EmblaCarousel from "embla-carousel";

import Carousel from "../src/carousel";

let carouselValue;
let dotCarousel;
let loopCarousel = "";
let selectCarousel;

document.querySelector(".new-slide")?.addEventListener("click", () => {});

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
function displayArrowsSelected() {
  if (!selectCarousel.canScrollPrev()) {
    document.querySelector(".left-arrow.selected").style.display = "none";
  } else {
    document.querySelector(".left-arrow.selected").style.display = "block";
  }
  if (!selectCarousel.canScrollNext()) {
    document.querySelector(".right-arrow.selected").style.display = "none";
  } else {
    document.querySelector(".right-arrow.selected").style.display = "block";
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

loopCarousel = Carousel({
  parent: ".carousel-item",
  child: ".carousel-item .slider",
  loop: true,
  whileScrolling: () => {
    displayArrowsNew();
    // document.body.style.overflowY = "hidden";
  },
  whileDragging: () => {
    displayArrowsNew();

    // document.body.style.overflowY = "hidden";
  },
});

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
  selectedState: true,
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
  selectedState: true,
});
// selectCarousel = Carousel({
//   parent: ".selected-state-div",
//   child: ".selected-state-div .slider",
//   whileScrolling: () => {
//     displayArrows();
//     // document.body.style.overflowY = "hidden";
//   },
//   whileDragging: () => {
//     displayArrows();
//     // document.body.style.overflowY = "hidden";
//   },
// });
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

document.querySelector(".left-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollPrev();
  displayArrowsSelected();
});
document.querySelector(".right-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollNext();
  displayArrowsSelected();
});

// let carItems = document.querySelectorAll(".carousel-item .slider");

document
  .querySelectorAll(".carousel-item .slider")[0]
  .addEventListener("click", () => {});

// let currentPosition = 0;

document.querySelector("#next-button")?.addEventListener("click", () => {
  loopCarousel.scrollNext(true);
});
document.querySelector("#previous-button").addEventListener("click", () => {
  loopCarousel.scrollPrev(true);
});
