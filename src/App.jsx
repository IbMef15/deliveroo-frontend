import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

import logo from "./assets/img/deliveroo-logo.svg";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [cart, setCart] = useState([]);

  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const meal = cart[i];
    total = total + meal.price * meal.quantity;
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://site--deliveroo-backend-andromeda-24--5ytnmfswy69s.code.run/"
      );
      setData(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleAddToCart = (meal) => {
    const newCart = [...cart];
    const found = newCart.find((elem) => elem.id === meal.id);

    if (found) {
      found.quantity++;
    } else {
      newCart.push({ ...meal, quantity: 1 });
    }

    setCart(newCart);
  };

  const handleRemoveFromCart = (meal) => {
    const newCart = [...cart];

    const found = newCart.find((elem) => elem.id === meal.id);

    if (found.quantity === 1) {
      const index = newCart.indexOf(found);
      newCart.splice(index, 1);
    } else {
      found.quantity--;
    }

    setCart(newCart);
  };

  return isLoading ? (
    <p>Loading ...</p>
  ) : (
    <>
      <header>
        <div className="container">
          <img src={logo} alt="deliveroo logo" />
        </div>
      </header>
      <section>
        <div className="container hero-container">
          <div>
            <h1>{data.restaurant.name}</h1>
            <p>{data.restaurant.description}</p>
          </div>
          <img src={data.restaurant.picture} alt="miam" />
        </div>
      </section>
      <main>
        <div className="container main-container">
          <section className="col-left">
            {data.categories.map((category) => {
              if (category.meals.length !== 0) {
                return (
                  <div key={category.name}>
                    <h2>{category.name}</h2>
                    <div className="articles-container">
                      {category.meals.map((meal) => {
                        return (
                          <article
                            key={meal.id}
                            onClick={() => {
                              handleAddToCart(meal);
                            }}
                          >
                            <div>
                              <h3>{meal.title}</h3>
                              <p className="description">{meal.description}</p>
                              <span>{meal.price} €</span>
                              {meal.popular && <span>Populaire</span>}
                            </div>
                            {meal.picture && (
                              <img src={meal.picture} alt={meal.title} />
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </section>
          <section className="col-right">
            <aside className="container-panier">
              <button className="valider-mon-panier">Valider mon panier</button>
              {cart.length === 0 ? (
                <p>Panier vide</p>
              ) : (
                <div className="food-selected">
                  {cart.map((meal) => {
                    return (
                      <div key={meal.id}>
                        <button
                          onClick={() => {
                            handleRemoveFromCart(meal);
                          }}
                        >
                          -
                        </button>
                        <span>{meal.quantity}</span>
                        <button
                          onClick={() => {
                            handleAddToCart(meal);
                          }}
                        >
                          +
                        </button>
                        <span>{meal.title}</span>
                        <span className="price">
                          {(meal.price * meal.quantity).toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}

                  <p className="total">
                    Total :<span className="price">{total.toFixed(2)} €</span>
                  </p>

                  <button
                    className="remove-cart"
                    onClick={() => {
                      setCart([]);
                    }}
                  >
                    Remove cart
                  </button>
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
