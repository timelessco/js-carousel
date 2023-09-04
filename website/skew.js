import Carousel from "../src/carousel";

Carousel({
  parent: ".skew .inner",
  child: ".skew .slider",
  // direction: "ltr",
  selectedState: true,
  minWebWidth: 100,
  // whileDragging: () => {
  //   document.querySelectorAll(".skew .slider").forEach((i, index) => {
  //     if (i.classList.contains("selected")) {
  //       if (index > 0) {
  //         document
  //           .querySelectorAll(".skew .slider")
  //           [index - 1].classList.add("rotate-opp");
  //       }
  //     }
  //   });
  // },
});
