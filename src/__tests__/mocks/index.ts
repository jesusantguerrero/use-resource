export const sites = [
  {
    id: 2,
    createdAt: "2022-04-23T13:50:29.387Z",
    updatedAt: "2022-05-29T19:53:08.286Z",
    title: "Node.js",
    url: "https://nodejs.org/en/",
    selector: ".home-downloadbutton[data-version]",
    actions: [
      {
        index: "2",
        value: "data-version",
        action: "attr",
      },
    ],
    results: ["v16.15.0", "v18.2.0"],
    published: false,
  },
  {
    id: 3,
    createdAt: "2022-04-23T22:56:54.339Z",
    updatedAt: "2022-05-29T19:53:13.578Z",
    title: "Vue.js",
    url: "https://github.com/vuejs/core/releases",
    selector: '[href*="/vuejs/core/releases/"]',
    actions: [
      {
        name: "text",
        index: 0,
      },
    ],
    results: ["v3.2.36"],
    published: false,
  },
];
