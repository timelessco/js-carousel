import "./style.css";
import EmblaCarousel from "embla-carousel";

import Carousel from "../src/carousel";

let carouselValue;

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

document.querySelector(".left-arrow").style.display = "none";
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

Carousel({
  parent: ".loop .inner",
  child: ".loop .slider",
  loop: true,
  whileScrolling: () => {
    displayArrows();
    // document.body.style.overflowY = "hidden";
  },
  whileDragging: () => {
    displayArrows();

    // document.body.style.overflowY = "hidden";
  },
});

Carousel({
  parent: ".autoplay .inner",
  child: ".autoplay .slider",
  autoplay: true,
  whileScrolling: () => {
    displayArrows();
    document.body.style.overflowY = "hidden";
  },
  whileDragging: () => {
    displayArrows();
    document.body.style.overflowY = "hidden";
  },
});

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
