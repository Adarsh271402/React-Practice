import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const projects = [
  "Calculator", "Todo App", "Weather App", "Image Gallery", "Responsive Navbar",
  "Accordion", "Modal Popup", "Login Form", "Product Search", "Pagination"
];

function Calculator() {
  const [display, setDisplay] = useState("");
  const press = (value) => {
    if (value === "C") return setDisplay("");
    if (value === "=") {
      try {
        if (!/^[0-9+\-*/(). ]+$/.test(display)) throw new Error("Invalid");
        setDisplay(String(Function(`"use strict"; return (${display})`)()));
      } catch {
        setDisplay("Error");
      }
      return;
    }
    setDisplay((d) => (d === "Error" ? value : d + value));
  };
  return <div className="calculator">
    <input value={display} readOnly placeholder="0" aria-label="Calculator display" />
    <div className="calc-grid">
      {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+","C"].map(k =>
        <button key={k} className={k === "C" ? "danger" : ""} onClick={() => press(k)}>{k}</button>
      )}
    </div>
  </div>;
}

function TodoApp() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("todos") || "[]"));
  useEffect(() => localStorage.setItem("todos", JSON.stringify(todos)), [todos]);
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
    setText("");
  };
  return <div>
    <form className="row" onSubmit={add}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Enter a task" />
      <button>Add</button>
    </form>
    <ul className="todo-list">
      {todos.map(t => <li key={t.id}>
        <label><input type="checkbox" checked={t.done} onChange={() =>
          setTodos(todos.map(x => x.id === t.id ? {...x, done: !x.done} : x))
        } /> <span className={t.done ? "done" : ""}>{t.text}</span></label>
        <button className="danger" onClick={() => setTodos(todos.filter(x => x.id !== t.id))}>Delete</button>
      </li>)}
    </ul>
  </div>;
}

function WeatherApp() {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const search = async (e) => {
    e?.preventDefault();
    setError(""); setWeather(null);
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`).then(r => r.json());
      if (!geo.results?.length) throw new Error("City not found");
      const place = geo.results[0];
      const data = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`).then(r => r.json());
      setWeather({ place, current: data.current, units: data.current_units });
    } catch (err) { setError(err.message); }
  };
  useEffect(() => { search(); }, []);
  return <div>
    <form className="row" onSubmit={search}>
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="Search city" />
      <button>Search</button>
    </form>
    {error && <p className="error">{error}</p>}
    {weather && <div className="weather-card">
      <h3>{weather.place.name}, {weather.place.country}</h3>
      <strong>{weather.current.temperature_2m}{weather.units.temperature_2m}</strong>
      <p>Humidity: {weather.current.relative_humidity_2m}{weather.units.relative_humidity_2m}</p>
      <p>Wind: {weather.current.wind_speed_10m} {weather.units.wind_speed_10m}</p>
    </div>}
  </div>;
}

const galleryImages = [
  "https://picsum.photos/id/1015/600/400", "https://picsum.photos/id/1025/600/400",
  "https://picsum.photos/id/1035/600/400", "https://picsum.photos/id/1043/600/400",
  "https://picsum.photos/id/106/600/400", "https://picsum.photos/id/1084/600/400"
];
function ImageGallery() {
  const [selected, setSelected] = useState(null);
  return <><div className="gallery">{galleryImages.map((src, i) =>
    <img key={src} src={src} alt={`Gallery ${i+1}`} onClick={() => setSelected(src)} />
  )}</div>{selected && <div className="lightbox" onClick={() => setSelected(null)}>
    <img src={selected} alt="Selected" />
  </div>}</>;
}

function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);
  return <nav className="demo-nav">
    <b>Adarsh.dev</b>
    <button className="menu-btn" onClick={() => setOpen(!open)}>☰</button>
    <div className={open ? "nav-links open" : "nav-links"}>
      {["Home","About","Projects","Contact"].map(x => <a href={`#${x}`} key={x}>{x}</a>)}
    </div>
  </nav>;
}

const faq = [
  ["What is React?", "React is a JavaScript library for building component-based user interfaces."],
  ["What is state?", "State is data managed inside a component that can trigger re-rendering."],
  ["What are props?", "Props are read-only values passed from a parent component to a child."]
];
function Accordion() {
  const [active, setActive] = useState(0);
  return <div>{faq.map(([q,a], i) => <div className="accordion" key={q}>
    <button onClick={() => setActive(active === i ? -1 : i)}>{q}<span>{active === i ? "−" : "+"}</span></button>
    {active === i && <p>{a}</p>}
  </div>)}</div>;
}

function ModalPopup() {
  const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(true)}>Open Modal</button>
    {open && <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={() => setOpen(false)}>×</button>
        <h3>Modal Popup</h3><p>This modal closes using the button or backdrop.</p>
      </div>
    </div>}</>;
}

function LoginForm() {
  const [form, setForm] = useState({email:"", password:""});
  const [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 6) next.password = "Password must contain at least 6 characters.";
    setErrors(next);
    if (!Object.keys(next).length) alert("Login validation successful!");
  };
  return <form className="form" onSubmit={submit} noValidate>
    <label>Email<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
    {errors.email && <small>{errors.email}</small>}
    <label>Password<input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>
    {errors.password && <small>{errors.password}</small>}
    <button>Login</button>
  </form>;
}

const productData = [
  {id:1,name:"Mechanical Keyboard",price:2499},{id:2,name:"Wireless Mouse",price:899},
  {id:3,name:"USB-C Hub",price:1499},{id:4,name:"Laptop Stand",price:1199},
  {id:5,name:"Webcam",price:1899},{id:6,name:"Headphones",price:2999}
];
function ProductSearch() {
  const [query, setQuery] = useState("");
  const filtered = productData.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  return <div><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." />
    <div className="products">{filtered.map(p => <article key={p.id}><h3>{p.name}</h3><p>₹{p.price}</p></article>)}</div>
    {!filtered.length && <p>No products found.</p>}
  </div>;
}

function Pagination() {
  const items = Array.from({length: 42}, (_,i) => `Item ${i+1}`);
  const perPage = 6;
  const [page, setPage] = useState(1);
  const pages = Math.ceil(items.length / perPage);
  const visible = items.slice((page-1)*perPage, page*perPage);
  return <div><div className="products">{visible.map(x => <article key={x}>{x}</article>)}</div>
    <div className="pagination">
      <button disabled={page===1} onClick={() => setPage(page-1)}>Previous</button>
      {Array.from({length:pages},(_,i)=>i+1).map(n => <button className={page===n ? "active" : ""} key={n} onClick={() => setPage(n)}>{n}</button>)}
      <button disabled={page===pages} onClick={() => setPage(page+1)}>Next</button>
    </div>
  </div>;
}

const components = [Calculator, TodoApp, WeatherApp, ImageGallery, ResponsiveNavbar, Accordion, ModalPopup, LoginForm, ProductSearch, Pagination];

function App() {
  const [active, setActive] = useState(0);
  const ActiveComponent = components[active];
  return <main>
    <header className="hero">
      <p>React machine-coding practice</p>
      <h1>10 Frontend Mini Projects</h1>
      <span>Built for interview preparation</span>
    </header>
    <div className="tabs">{projects.map((name,i) =>
      <button className={active===i ? "active" : ""} key={name} onClick={() => setActive(i)}>{name}</button>
    )}</div>
    <section className="project-card"><h2>{projects[active]}</h2><ActiveComponent /></section>
  </main>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
