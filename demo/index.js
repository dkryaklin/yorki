import { tag, portal, state } from "../src";
import {
  className,
  attribute,
  style,
  attached,
  childrens
} from "../src/bindings";

const Button = counter => {
  const tree = tag(
    "button",
    {
      class: "button",
      click() {
        counter().set(counter().value() + 1);
      }
    },
    "Hello, world!"
  );

  return tree;
};

const ButtonWrapper = counter => {
  counter().subscribe(counterValue => {
    console.log("counter clicked ", counterValue);
  });

  const tree = tag("div", { class: "button-wrapper" }, [
    "button wrapper",
    tag("br"),
    { button: Button(counter) }
  ]);

  return tree;
};

const ListItem = item => {
  const tree = tag(
    "div",
    { class: "list-item" },
    { text: `list item ${item.val}` },
    {
      onUpdate: newItem => {
        tree.text().el.nodeValue = `list item ${newItem.val}`;
      }
    }
  );

  return tree;
};

const MyApp = () => {
  const myAppState = state({
    counter: 0,
    testChilds: [
      { key: "1", val: 1 },
      { key: "2", val: 2 },
      { key: "3", val: 3 }
    ]
  });

  setTimeout(() => {
    myAppState().set({
      testChilds: [
        { key: "1", val: 2 },
        { key: "3", val: 4 },
        { key: "4", val: 5 }
      ]
    });
  }, 2000);

  setTimeout(() => {
    myAppState().set({
      testChilds: [
        { key: "1", val: 2 },
        { key: "3", val: 4 },
        { key: "4", val: 5 },
        { key: "2", val: 2 }
      ]
    });
  }, 4000);

  const tree = tag(
    // tag name
    "div",
    // default attributes
    { class: "my-app" },
    // children or array of childrens
    [
      { button: ButtonWrapper(myAppState.counter) },
      { button2: ButtonWrapper(myAppState.counter) },
      { list: tag("div", { class: "list-test" }) }
    ],
    // hooks
    {
      onDestroy() {
        myAppState.destroy();
      }
    }
  );

  // set bindings
  tree().bind([
    className(tree, "test", myAppState.counter),
    attribute(tree.button, "data-test", myAppState.counter),
    style(tree.button.button, "order", myAppState.counter),
    attached(tree.button2, myAppState.counter, value => {
      return value % 2;
    }),
    childrens(tree.list, ListItem, myAppState.testChilds, "key")
  ]);

  return tree;
};

portal(document.querySelector("#app"), MyApp());
