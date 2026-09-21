import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useDrop } from '../context/DropContext';
import './CartPage.css';

/* ============================================================
   MMAI — CART PAGE
   Cart items with customization details + order summary.
   ============================================================ */

const FREE_SHIPPING_THRESHOLD = 1500;

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const { activeDrop } = useDrop();

  if (items.length === 0) {
    return (
      <section className="cart-page cart-page--empty">
        <div className="cart-empty__placeholder" />
        <h1 className="cart-empty__title">Your cart is empty.</h1>
        <p className="cart-empty__subtext">Drop 001 is live — four pieces, no restocks.</p>
        <Link to="/shop" className="cart-empty__cta">
          Shop The Drop
        </Link>
      </section>
    );
  }

  const handleDecrement = (item) => {
    if (item.qty === 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.qty - 1);
    }
  };

  const handleIncrement = (item) => {
    updateQuantity(item.id, item.qty + 1);
  };

  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <section className="cart-page">
      <header className="cart-header">
        <h1 className="cart-header__title">Your Cart</h1>
        <p className="cart-header__count">
          {items.length} ITEM{items.length === 1 ? '' : 'S'}
        </p>
      </header>

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => {
            const product = activeDrop?.products.find((p) => p.id === item.productId);
            const categoryClass = product ? product.category.toLowerCase() : null;

            return (
              <li key={item.id} className="cart-item">
                <div
                  className={`cart-item__thumb${
                    categoryClass ? ` cart-item__thumb--${categoryClass}` : ''
                  }`}
                />

                <div className="cart-item__middle">
                  <p className="cart-item__title">{item.title}</p>
                  <p className="cart-item__meta">
                    SIZE {item.size}
                    {product && ` · ${product.category}`}
                  </p>

                  {/* Customization details render here once Phase 3's customization engine populates this field */}
                  {item.customization && (
                    <div className="cart-item__customization">
                      {item.customization.nameBadge && (
                        <p className="cart-item__customization-line">
                          Name: {item.customization.nameBadge}
                        </p>
                      )}
                      {item.customization.quote && (
                        <p className="cart-item__customization-line">
                          Quote: {item.customization.quote}
                        </p>
                      )}
                      {item.customization.placement && (
                        <p className="cart-item__customization-line">
                          Placement: {item.customization.placement}
                        </p>
                      )}
                      {item.customization.barcodeId && (
                        <p className="cart-item__customization-line">
                          Barcode ID: {item.customization.barcodeId}
                        </p>
                      )}
                      {item.customization.colorVariant && (
                        <p className="cart-item__customization-line">
                          Colour: {item.customization.colorVariant}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="cart-item__stepper">
                    <button
                      type="button"
                      className="cart-item__stepper-btn"
                      onClick={() => handleDecrement(item)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-item__qty">{item.qty}</span>
                    <button
                      type="button"
                      className="cart-item__stepper-btn"
                      onClick={() => handleIncrement(item)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </p>
                </div>

                <p className="cart-item__line-total">
                  R {(item.price * item.qty).toLocaleString()}
                </p>
              </li>
            );
          })}
        </ul>

        <aside className="cart-summary">
          <p className="cart-summary__eyebrow">Order Summary</p>

          <p className="cart-summary__shipping-message">
            {amountToFreeShipping <= 0
              ? "You've unlocked free shipping"
              : `R${amountToFreeShipping.toLocaleString()} away from free shipping`}
          </p>
          <div className="cart-summary__progress">
            <div
              className="cart-summary__progress-fill"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>

          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>R {subtotal.toLocaleString()}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>R {subtotal.toLocaleString()}</span>
          </div>

          <Link to="/checkout" className="cart-summary__checkout">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="cart-summary__continue">
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
