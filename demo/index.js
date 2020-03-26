import Yorki from '../src/yorki';

const Button = (counter) => {
  return Yorki({
    tag: 'button',
    className: 'button',
    props: { counter },
    events: {
      click(event, tree, state, props) {
        const { counter } = props;
        counter().set(counter().value() + 1);
      },
    },
    childrens() {
      return ['Hello, world!'];
    },
  });
};

const ButtonWrapper = (counter) => {
  counter().subscribe((counterValue) => {
    console.log('counter clicked ', counterValue);
  });

  return Yorki({
    className: 'button-wrapper',
    childrens() {
      return ['button wrapper', Yorki({ tag: 'br' }), { button: Button(counter) }];
    },
  });
};

const ListItem = (item) => {
  return Yorki({
    className: 'list-item',
    props: { ...item },
    childrens(state, props) {
      return [{ text: `list item ${props.val}` }];
    },
    onUpdate(tree, state, props) {
      tree.text().element.nodeValue = `list item ${props.val}`;
    },
  });
};

const MyApp = () => {
  return Yorki({
    className: 'my-app',
    state: {
      counter: 0,
      testChilds: [
        { key: '1', val: 1 },
        { key: '2', val: 2 },
        { key: '3', val: 3 },
      ],
    },
    childrens(state) {
      return [
        { button: ButtonWrapper(state.counter) },
        { button2: ButtonWrapper(state.counter) },
        { list: Yorki({ className: 'list-test' }) },
      ];
    },
    onMount(tree, state) {
      setTimeout(() => {
        state().set({
          testChilds: [
            { key: '1', val: 2 },
            { key: '3', val: 4 },
            { key: '4', val: 5 },
          ],
        });
      }, 2000);
      setTimeout(() => {
        state().set({
          testChilds: [
            { key: '1', val: 2 },
            { key: '3', val: 4 },
            { key: '4', val: 5 },
            { key: '2', val: 2 },
          ],
        });
      }, 4000);
    },
    bindings(tree, state, bindings) {
      return [
        bindings.bindClassName(tree, 'test', state.counter),
        bindings.bindAttribute(tree.button, 'data-test', state.counter),
        bindings.bindStyle(tree.button.button, 'order', state.counter),
        bindings.bindAttached(tree.button2, state.counter, (value) => {
          return value % 2;
        }),
        bindings.bindChildrens(tree.list, ListItem, state.testChilds, 'key'),
      ];
    },
  });
};

Yorki.portal(document.querySelector('#app'), MyApp());
