import { useState } from "react";
// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Pants", quantity: 6, packed: true },
// ];
export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handlePackedState(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClear() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the items?"
    );
    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Logo />
      <Form addItem={handleAddItems} />
      <PackageList
        items={items}
        deleteItem={handleDeleteItem}
        updateItem={handlePackedState}
        handleClear={handleClear}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴FAR AWAY💼</h1>;
}

function Form({ addItem }) {
  const [description, setDescription] = useState("");
  const [select, setSelect] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (description === "") return;
    const newItem = {
      description,
      select,
      package: false,
      id: Date.now(),
    };
    console.log(newItem);

    addItem(newItem);

    setDescription("");
    setSelect(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select
        value={select}
        onChange={(e) => setSelect(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item....."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button>Add</button>
    </form>
  );
}

function PackageList({ items, deleteItem, updateItem, handleClear }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems = [];
  if (sortBy === "done") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  return (
    <div className="list">
      <ul style={{ overflow: "hidden" }}>
        {sortedItems.map((item) => (
          <Item
            item={item}
            deleteItems={deleteItem}
            updateItem={updateItem}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="done">Sort by packed order</option>
        </select>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}

function Stats({ items }) {
  if (items.length === 0) {
    return (
      <footer
        className="stats
      "
      >
        <em>Start adding item to your packing list 🚀</em>
      </footer>
    );
  } else {
    const numItems = items.length;
    const numPackedItems = items.filter((item) =>
      item.packed ? true : false
    ).length;
    const perc = Math.round((numPackedItems / numItems) * 100);
    const full = perc === 100 ? true : false;

    return (
      <div>
        <footer
          className="stats
      "
        >
          <em>
            {full
              ? "You got everything! Ready to go ✈"
              : `You have  ${numItems} items already on your list. You have packed
          ${numPackedItems} items (${perc}%)`}
          </em>
        </footer>
      </div>
    );
  }
}

function Item({ item, deleteItems, updateItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => updateItem(item.id)}
      ></input>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.select} {item.description}
      </span>{" "}
      <button onClick={() => deleteItems(item.id)}>❌</button>
    </li>
  );
}
