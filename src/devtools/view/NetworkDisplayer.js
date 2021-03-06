import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from '../context';
import Record from './Components/Record';
import { execute } from "graphql";
import { debounce } from '../utils'

const combineEvents = (events) => {
  const combinedEvents = {};
  const eventTypes = {};
  events.forEach(event => {
    const tempObj = {};
    if (event.name === "execute.start") {
      tempObj.request = event.params;
      tempObj.variables = event.variables;
    } else if (event.name === "execute.info") {
      tempObj.info = event.info
    } else if (event.name === "execute.next") {
      tempObj.response = event.response
    } else if (event.name === "execute.complete") {
      tempObj.complete = true
    }
    combinedEvents[event.transactionID] ? combinedEvents[event.transactionID] = Object.assign(combinedEvents[event.transactionID], tempObj) : combinedEvents[event.transactionID] = tempObj;
  })

  //sort by type
  Object.keys(combinedEvents).forEach(transactionID => {
    const op = combinedEvents[transactionID].request.operationKind;
    eventTypes[op] ? eventTypes[op] = Object.assign(eventTypes[op], { [transactionID]: combinedEvents[transactionID] }) : eventTypes[op] = { [transactionID]: combinedEvents[transactionID] }
  })

  return eventTypes;
}

const NetworkDisplayer = (props) => {
  const [selection, setSelection] = useState("");
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const store = useContext(StoreContext);

  useEffect(() => {
    const onMutated = () => {
      console.log("mutation triggered onMutated in Network Displayer")
      setEvents(combineEvents(store._environmentEventsMap.get(1) || []));
    };
    store.addListener('mutated', onMutated);

    return () => {
      store.removeListener('mutated', onMutated);
    };
  }, [store]);

  //handle type menu click events
  function handleMenuClick(e, id) {
    //set new selection
    setSelection(id);
  }

  //shows you the entire network
  function handleReset(e) {
    //remove selecti on;
    setSelection("");
  };

  //updates search results
  const debounced = debounce((val) => setSearchResults(val), 300)
  function handleSearch(e) {
    //debounce search
    debounced(e.target.value)
  }

  const eventMenu = [];
  const eventsList = [];

  //for each event - add to menu list
  for (let type in events) {

    //creates an array of menu items for all events belonging to a given type
    const typeList = [];
    for (let id in events[type]) {
      //filter out results based on search input
      if (new RegExp(searchResults, "i").test(JSON.stringify(events[type][id]))) {
        typeList.push(
          <li>
            <a id={id} className={(selection === (id)) && "is-active"} onClick={(e) => { handleMenuClick(e, id) }}>{events[type][id].request.name}</a>
          </li>)
        //creates an array of elements for all events
        eventsList.push(
          <div id={id} className={`${(selection !== id && selection !== type && selection !== "") ? "is-hidden" : "record-line"}`}>
            <Record {...events[type][id]} />
          </div>
        );
      }
    }

    //pushes the new type element with child events to the typeList component array
    eventMenu.push(
      <li>
        <a id={type} className={(selection === type) && "is-active"} onClick={(e) => { handleMenuClick(e, type) }}>
          {type}
        </a>
        <ul>{typeList}</ul>
      </li>
    );
  }

  console.log("Rendering NetworkDisplayer")

  return (
    <React.Fragment>
      <div className="column is-one-third">
        <p class="control has-icons-left">
          <input className="input is-small is-primary" type="text" placeholder="Search" onChange={(e) => { handleSearch(e) }}></input>
          <button
            className="button is-small is-link"
            onClick={(e) => {
              handleReset(e);
            }}
          >
            Reset
        </button>
          <span class="icon is-left">
            <i class="fas fa-search"></i>
          </span>
        </p>
        <aside className="menu">
          <p className="menu-label">Event List</p>
          <ul className="menu-list">
            {eventMenu}
          </ul>
        </aside>
      </div>
      <div className="column">
        <div className="display-box">{eventsList}</div>
      </div>
    </React.Fragment>
  );
};

export default NetworkDisplayer;
