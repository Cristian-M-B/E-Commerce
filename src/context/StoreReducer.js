export const initialState = {
    allProducts: [],
    userInfo: {}
}

export const actionsTypes = {
    LOAD_PRODUCTS: 'LOAD PRODUCTS',
    LOAD_USER_INFO: 'LOAD USER INFO',
    REMOVE_USER_INFO: 'REMOVE USER INFO'
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

        default:
            return state
    }
}