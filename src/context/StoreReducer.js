import Cookies from 'js-cookie'

export const initialState = {
    allProducts: [],
    userInfo: {},
    order: {},
    reviews: []
}

export const actionsTypes = {
    LOAD_PRODUCTS: 'LOAD PRODUCTS',
    LOAD_USER_INFO: 'LOAD USER INFO',
    REMOVE_USER_INFO: 'REMOVE USER INFO',
    GET_USER_INFO_LOCAL_STORAGE: 'GET USER INFO LOCAL STORAGE',
    UPDATE_USER_INFO: 'UPDATE USER INFO',
    UPDATE_AVATAR: 'UPDATE AVATAR',
    UPDATE_FAVORITE: 'UPDATE FAVORITE',
    UPDATE_CART: 'UPDATE CART',
    UPDATE_SHIPPING_DATA: 'UPDATE SHIPPING DATA',
    LOAD_ORDER: 'LOAD ORDER',
    GET_ORDER_LOCAL_STORAGE: 'GET ORDER LOCAL STORAGE',
    GET_REVIEWS: 'GET REVIEWS'
}

export default function StoreReducer(state, action) {
    switch (action.type) {

        case actionsTypes.LOAD_PRODUCTS:
            return {
                ...state,
                allProducts: action.payload
            }

        case actionsTypes.LOAD_USER_INFO:
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
            return {
                ...state,
                userInfo: action.payload
            }

        case actionsTypes.REMOVE_USER_INFO:
            Cookies.remove('E-Commerce_token')
            localStorage.removeItem('userInfo')
            return {
                ...state,
                userInfo: {}
            }

        case actionsTypes.GET_USER_INFO_LOCAL_STORAGE:
            return {
                ...state,
                userInfo: localStorage.getItem('userInfo') && Cookies.get('E-Commerce_token') ? JSON.parse(localStorage.getItem('userInfo')) : {}
            }

        case actionsTypes.UPDATE_USER_INFO:
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
            return {
                ...state,
                userInfo: action.payload
            }

        case actionsTypes.UPDATE_AVATAR:
            localStorage.setItem('userInfo', JSON.stringify({ ...state.userInfo, image: action.payload }))
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    image: action.payload
                }
            }

        case actionsTypes.UPDATE_FAVORITE:
            localStorage.setItem('userInfo', JSON.stringify({ ...state.userInfo, favorites: action.payload }))
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    favorites: action.payload
                }
            }

        case actionsTypes.UPDATE_CART:
            localStorage.setItem('userInfo', JSON.stringify({ ...state.userInfo, cart: action.payload }))
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    cart: action.payload
                }
            }

        case actionsTypes.UPDATE_SHIPPING_DATA:
            localStorage.setItem('userInfo', JSON.stringify({ ...state.userInfo, shippingData: action.payload }))
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    shippingData: action.payload
                }
            }

        case actionsTypes.LOAD_ORDER:
            localStorage.setItem('order', JSON.stringify(action.payload))
            return {
                ...state,
                order: action.payload
            }

        case actionsTypes.GET_ORDER_LOCAL_STORAGE:
            return {
                ...state,
                order: localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : {}
            }

        case actionsTypes.GET_REVIEWS:
            return {
                ...state,
                reviews: action.payload
            }

        default:
            return state
    }
}