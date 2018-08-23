export function alert(state = {}, action) {
    switch (action.type) {
        case 'ALERT_SUCCESS':
            return {
                type: 'alert-success',
                message: action.message
            };
        case 'ALERT_ERROR':
            return {
                type: 'alert-danger',
                message: action.message
            };
        case 'ALERT_CLEAR':
            return {};
        default:
            return state
    }
}

export function authentication(state = {}, action) {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return {
                loggingIn: true,
                user: action.user
            };
        case 'LOGIN_SUCCESS':
            return {
                loggedIn: true,
                user: action.user
            };
        case 'LOGIN_FAILURE':
            return {};
        case 'LOGOUT':
            return {};
        default:
            return state
    }
}