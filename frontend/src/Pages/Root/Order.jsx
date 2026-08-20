import React, { useState } from "react";
import "./Order.css";
import order from "../../assets/4.png";

const MENU = [
  {
    category: "Antipasti",
    items: [
      {
        id: "bruschetta",
        name: "Bruschetta al Pomodoro",
        price: 9,
        description: "Grilled sourdough, marinated tomato, basil, garlic oil.",
        initials: "BP",
        image: order,
      },
      {
        id: "burrata",
        name: "Burrata & Peaches",
        price: 14,
        description: "Creamy burrata, grilled peach, prosciutto, aged balsamic.",
        initials: "BP",
        image: order,
      },
      {
        id: "arancini",
        name: "Saffron Arancini",
        price: 11,
        description: "Crisp risotto spheres, mozzarella, spicy arrabbiata.",
        initials: "SA",
        image: order,
      },
    ],
  },
  {
    category: "Pasta",
    items: [
      {
        id: "tagliatelle",
        name: "Tagliatelle al Ragù",
        price: 19,
        description: "Slow-braised beef ragù, hand-cut tagliatelle, parmigiano.",
        initials: "TR",
        image: order,
      },
      {
        id: "cacio",
        name: "Cacio e Pepe",
        price: 17,
        description: "Tonnarelli, pecorino romano, cracked black pepper.",
        initials: "CP",
        image: order,
      },
      {
        id: "gnocchi",
        name: "Gnocchi al Pesto",
        price: 18,
        description: "Potato gnocchi, basil pesto, green beans, pine nuts.",
        initials: "GP",
        image: order,
      },
    ],
  },
  {
    category: "Mains",
    items: [
      {
        id: "branzino",
        name: "Branzino al Forno",
        price: 28,
        description: "Whole roasted sea bass, lemon, capers, herb salsa.",
        initials: "BF",
        image: order,
      },
      {
        id: "pollo",
        name: "Pollo alla Milanese",
        price: 24,
        description: "Breaded chicken cutlet, arugula, cherry tomato, lemon.",
        initials: "PM",
        image: order,
      },
    ],
  },
  {
    category: "Dolci",
    items: [
      {
        id: "tiramisu",
        name: "Tiramisù",
        price: 10,
        description: "Espresso-soaked savoiardi, mascarpone, cocoa.",
        initials: "TI",
        image: order,
      },
      {
        id: "pannacotta",
        name: "Panna Cotta",
        price: 9,
        description: "Vanilla bean cream, macerated berries.",
        initials: "PC",
        image: order,
      },
    ],
  },
];

const FEATURES = [
  {
    icon: "clock",
    title: "Order in advance",
    description: "Place your order at least 45 minutes before your pickup time.",
  },
  {
    icon: "shield",
    title: "Free cancellation",
    description: "Cancel up to 2 hours before pickup for a full refund.",
  },
  {
    icon: "info",
    title: "Strict pickup windows",
    description: "Windows are enforced so every plate leaves the kitchen at its best.",
  },
];

function Icon({ name }) {
  switch (name) {
    case "clock":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "info":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" strokeLinecap="round" />
          <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
          <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function OrderPage() {
  const [cart, setCart] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
  });

  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const removeItem = (itemId) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  const cartEntries = Object.values(cart);
  const totalItems = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = cartEntries.reduce(
    (sum, entry) => sum + entry.quantity * entry.item.price,
    0
  );

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canSubmit =
    totalItems > 0 &&
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.pickupDate &&
    form.pickupTime;

  const handleSubmit = () => {
    if (!canSubmit) return;
    alert("Order placed! (demo only)");
  };

  return (
    <div className="order-page">
      <section className="order-hero">
        <div className="order-hero__text">
          <p className="order-hero__eyebrow">Order Ahead</p>
          <h1 className="order-hero__title">Build your order.</h1>
          <p className="order-hero__subtitle">
            Seasonal Italian cooking, ready when you are. Add your favorites,
            choose a pickup time, and skip the wait.
          </p>
          <div className="order-hero__features">
            {FEATURES.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-card__icon">
                  <Icon name={feature.icon} />
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-hero__image">
          <img
            src={order}
            alt="Fresh tagliatelle pasta with tomato sauce and basil, served with a glass of red wine"
          />
          <div className="order-hero__badge">
            <span className="order-hero__badge-title">Kitchen open</span>
            <span className="order-hero__badge-time">11:30am – 10:00pm</span>
          </div>
        </div>
      </section>

      <main className="order-main">
        <section className="menu-section">
          <h2 className="menu-section__title">The Menu</h2>
          <p className="menu-section__subtitle">
            Tap a dish to add it to your order.
          </p>

          {MENU.map((group) => (
            <div className="menu-group" key={group.category}>
              <div className="menu-group__heading">
                <span>{group.category}</span>
                <div className="menu-group__rule" />
              </div>

              {group.items.map((item) => (
                <div className="menu-item" key={item.id}>
                  <div className="menu-item__thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="menu-item__info">
                    <div className="menu-item__title-row">
                      <h4>{item.name}</h4>
                      <span className="menu-item__price">${item.price}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                  <button
                    className="menu-item__add"
                    onClick={() => addItem(item)}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          ))}
        </section>

        <aside className="order-summary">
          <h3 className="order-summary__title">
            <Icon name="bag" />
            Your Order
          </h3>

          <div className="order-summary__items">
            {cartEntries.length === 0 ? (
              <p className="order-summary__empty">
                No items yet. Add dishes from the menu to get started.
              </p>
            ) : (
              cartEntries.map(({ item, quantity }) => (
                <div className="cart-line" key={item.id}>
                  <div className="cart-line__info">
                    <span className="cart-line__name">{item.name}</span>
                    <span className="cart-line__price">
                      ${item.price * quantity}
                    </span>
                  </div>
                  <div className="cart-line__controls">
                    <button onClick={() => removeItem(item.id)}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => addItem(item)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartEntries.length > 0 && (
            <div className="order-summary__total">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          )}

          <div className="order-summary__divider" />

          <h4 className="order-summary__section-title">Pickup details</h4>

          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              placeholder="Maria Rossi"
              value={form.fullName}
              onChange={handleFormChange("fullName")}
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="maria@example.com"
              value={form.email}
              onChange={handleFormChange("email")}
            />
          </label>

          <label className="field">
            <span>Phone</span>
            <input
              type="tel"
              placeholder="+977 12345678"
              value={form.phone}
              onChange={handleFormChange("phone")}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Pickup date</span>
              <input
                type="date"
                value={form.pickupDate}
                onChange={handleFormChange("pickupDate")}
              />
            </label>
            <label className="field">
              <span>Pickup time</span>
              <input
                type="time"
                value={form.pickupTime}
                onChange={handleFormChange("pickupTime")}
              />
            </label>
          </div>

          <button
            className="order-summary__submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Add items to order
          </button>
          <p className="order-summary__note">
            Orders require at least 45 minutes notice.
          </p>
        </aside>
      </main>
    </div>
  );
}