import { createContext, useContext, useReducer } from "react";
import StoreReducer, { initialState } from "./StoreReducer.js";

export const StoreContext = createContext();

export const useStore = () => useContext(StoreContext)[0]
export const useDispatch = () => useContext(StoreContext)[1]

export default function StoreProvider({children}){
    const [store, dispatch] = useReducer(StoreReducer, initialState);
    return (
        <StoreContext.Provider value={[store, dispatch]}>
            {children}
        </StoreContext.Provider>
    )
}