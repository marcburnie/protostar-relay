import React from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreTimeline from '../src/devtools/view/StoreTimeline';
import { BridgeContext, StoreContext } from "../src/devtools/context";
import Store from "../src/devtools/store";

configure({ adapter: new Adapter() });

describe('StoreTimeline', () => {
  let wrapper;
  let full;
  const props = {
    currentEnvID: 1,
  }
  const bridge = { "hi": "there" };
  const store = Object.assign(Store, {
    "getRecords": () => { return { "yes": "no" } },
  })


  beforeEach(() => {
    wrapper = shallow(<StoreTimeline {...props} />);
    // full = mount(
    //   <BridgeContext.Provider value={bridge}>
    //     <StoreContext.Provider value={store}>
    //       <StoreTimeline {...props} />
    //     </StoreContext.Provider>
    //   </BridgeContext.Provider>
    // );
  });

  it("Renders a StoreDisplayer component and passes store as a prop", () => {
    expect(wrapper.find('StoreDisplayer').length).toEqual(1);

  })


  // it("Passes the store based on the currentEnvID", () => {
  // })


  // describe("Snapshots", () => {

  //   it("Takes a snapshot at startup", () => {

  //   })

  //   it("Has a snapshot button that takes and saves a snapshot", () => {

  //   })

  //   it("Defaults to displaying the latest store value when a snapshot is taken", () => {

  //   })

  //   it("Remembers snapshots when switching between environments", () => {

  //   })

  //   it("Has a snapshot text input", () => {

  //   })

  //   it("Has a previous buttons to move to the previous snapshot", () => {

  //   })

  //   it("Has a next button to move to the previous snapshot", () => {

  //   })

  //   it("Has a current button that shows the current store value", () => {

  //   })

  //   it("Has a slider that updates when a new snapshot is taken and when switching between environments", () => {

  //   })


  // })

  it('Renders correctly', () => {
    const date = new Date(Date.UTC(2020));
    global.Date = jest.fn(() => date);
    const tree = renderer.create(<StoreTimeline {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
    jest.clearAllMocks()
  })

});
