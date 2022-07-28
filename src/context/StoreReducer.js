export const initialState = {
    allProducts: [],
    userInfo: {}
}

export const actionsTypes = {
    LOAD_PRODUCTS: 'LOAD PRODUCTS',
    LOAD_USER_INFO: 'LOAD USER INFO',
    REMOVE_USER_INFO: 'REMOVE USER INFO',
    UPDATE_FAVORITE: 'UPDATE FAVORITE',
    UPDATE_CART: 'UPDATE CART'
}

export default function StoreReducer(state, action) {
    switch (action.type) {

        case actionsTypes.LOAD_PRODUCTS:
            return {
                ...state,
                allProducts: action.payload
            }

        case actionsTypes.LOAD_USER_INFO:
            return {
                ...state,
                userInfo: action.payload
            }

        case actionsTypes.REMOVE_USER_INFO:
            return {
                ...state,
                userInfo: {}
            }

        case actionsTypes.UPDATE_FAVORITE:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    favorites: action.payload
                }
            }

        case actionsTypes.UPDATE_CART:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    cart: action.payload
                }
            }

        default:
            return state
    }
}