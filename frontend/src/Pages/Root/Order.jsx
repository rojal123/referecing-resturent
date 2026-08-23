import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../Context/AuthContext.jsx";
import "./order.css";
import order from "../../assets/4.png";

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
  const { user } = useAuth();

  // Menu items now come from the database via GET /api/menu instead of a
  // hardcoded MENU constant (that constant never existed here, which is
  // what was throwing "MENU is not defined").
  const [menuGroups, setMenuGroups] = useState([]);
  const [menuStatus, setMenuStatus] = useState("loading"); // loading | ready | error

  const [cart, setCart] = useState({});
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | submitting | success | error
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/menu")
      .then((res) => {
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data : [];
        const available = items.filter((item) => item.is_available !== false);

        const byCategory = new Map();
        available.forEach((item) => {
          const category = item.category || "Menu";
          if (!byCategory.has(category)) byCategory.set(category, []);
          byCategory.get(category).push(item);
        });

        setMenuGroups(
          Array.from(byCategory.entries()).map(([category, groupItems]) => ({
            category,
            items: groupItems,
          }))
        );
        setMenuStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setMenuStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
    (sum, entry) => sum + entry.quantity * Number(entry.item.price),
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
    form.pickupTime &&
    submitStatus !== "submitting";

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitStatus("submitting");
    setSubmitMessage("");

    try {
      await api.post("/orders", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        items: cartEntries.map(({ item, quantity }) => ({
          menuItemId: item.id,
          quantity,
          unitPrice: Number(item.price),
        })),
      });

      setSubmitStatus("success");
      setSubmitMessage("Order placed! We'll see you at pickup.");
      setCart({});
    } catch (err) {
      const status = err?.response?.status;
      setSubmitStatus("error");
      if (status === 401) {
        setSubmitMessage("Please log in to place an order.");
      } else {
        setSubmitMessage(
          err?.response?.data?.message || "Something went wrong placing your order. Please try again."
        );
      }
    }
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

          {menuStatus === "loading" && (
            <p className="order-summary__empty">Loading the menu...</p>
          )}

          {menuStatus === "error" && (
            <div className="form-msg error">
              We couldn't load the menu right now. Please refresh the page.
            </div>
          )}

          {menuStatus === "ready" && menuGroups.length === 0 && (
            <p className="order-summary__empty">No dishes are available right now.</p>
          )}

          {menuGroups.map((group) => (
            <div className="menu-group" key={group.category}>
              <div className="menu-group__heading">
                <span>{group.category}</span>
                <div className="menu-group__rule" />
              </div>

              {group.items.map((item) => (
                <div className="menu-item" key={item.id}>
                  {item.image_url && (
                    <div className="menu-item__thumb">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                  )}
                  <div className="menu-item__info">
                    <div className="menu-item__title-row">
                      <h4>{item.name}</h4>
                      <span className="menu-item__price">${Number(item.price).toFixed(2)}</span>
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
                      ${(Number(item.price) * quantity).toFixed(2)}
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
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          )}

          <div className="order-summary__divider" />

          <h4 className="order-summary__section-title">Pickup details</h4>

          {submitStatus === "success" && (
            <div className="form-msg success">{submitMessage}</div>
          )}
          {submitStatus === "error" && (
            <div className="form-msg error">
              {submitMessage}
              {submitMessage === "Please log in to place an order." && (
                <>
                  {" "}
                  <Link to="/login">Log in</Link>
                </>
              )}
            </div>
          )}

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
            {submitStatus === "submitting" ? "Placing order..." : "Add items to order"}
          </button>
          <p className="order-summary__note">
            Orders require at least 45 minutes notice.
          </p>
        </aside>
      </main>
    </div>
  );
}