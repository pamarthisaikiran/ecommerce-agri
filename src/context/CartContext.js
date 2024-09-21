import React, { createContext, useState } from "react"

const CartContext = createContext({
  cartList: [],
  addCartItem: () => {},
  removeCartItem: () => {},
  clearCart: () => {},
  updateCartItemQuantity: () => {}, // Ensure this is added
})

export const CartProvider = ({ children }) => {
  const [cartList, setCartList] = useState([])

  const addCartItem = product => {
    const productExists = cartList.find(item => item.id === product.id && item.selectedQuantity === product.selectedQuantity);
    if (productExists) {
      setCartList(prevCartList =>
        prevCartList.map(item =>
          item.id === product.id && item.selectedQuantity === product.selectedQuantity
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartList(prevCartList => [...prevCartList, { ...product, selectedQuantity: product.selectedQuantity }]);
    }
  }
  

  const removeCartItem = id => {
    setCartList(prevCartList => prevCartList.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartList([])
  }

  const updateCartItemQuantity = (id, newQuantity) => {
    setCartList(prevCartList =>
      prevCartList.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  return (
    <CartContext.Provider
      value={{
        cartList,
        setCartList,
        addCartItem,
        removeCartItem,
        clearCart,
        updateCartItemQuantity, // Ensure this is passed to the provider
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext