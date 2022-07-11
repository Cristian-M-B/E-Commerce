export const initialState = {
    allProducts: [],
    darkMode: true
}

export const actionsTypes = {
    LOAD_PRODUCTS: 'LOAD PRODUCTS',
    CHANGE_MODE: 'CHANGE MODE'
}

export default function StoreReducer(state, action) {
    switch (action.type) {

        case actionsTypes.LOAD_PRODUCTS:
            return {
                ...state,
                allProducts: action.payload
            }

        case actionsTypes.CHANGE_MODE:
            return {
                ...state,
                darkMode: !state.darkMode
            }

        default:
            return state
    }
}