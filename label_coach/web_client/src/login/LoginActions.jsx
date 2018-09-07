import {login as authLogin, logout as authLogout, fetchCurrentUser} from 'girder/auth';
import {restRequest} from 'girder/rest';
import {browserHistory} from "react-router";
import {corsAuth, getCurrentToken, getCurrentUser, setCurrentToken, setCurrentUser} from "girder/auth";
import events from "girder/events";
import {handleClose} from "girder/dialog";
import UserModel from "girder/models/UserModel";


export function successMessage(message) {
    return {type: 'ALERT_SUCCESS', message};
}

export function errorMessage(message) {
    return {type: 'ALERT_ERROR', message};
}

export function clearMessage() {
    return {type: 'ALERT_CLEAR'};
}

export function getLoggedUser(history) {
    return dispatch => {
        fetchCurrentUser()
            .done(user => {
                dispatch(success(user));
            })
            .fail(error => {
                dispatch(errorMessage(error.toString));
                history.push("/");
            });
    };

    function success(user) {
        return {type: 'LOGIN_SUCCESS', user}
    }
}

export function login(username, password, history) {
    return dispatch => {
        authLogin(username, password)
            .done(
                user => {
                    dispatch(success(user));
                    history.push("/content");

                })
            .fail(
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(errorMessage(error.toString()));
                }
            );
    };

    function request(user) {
        return {type: 'LOGIN_REQUEST', user}
    }

    function success(user) {
        return {type: 'LOGIN_SUCCESS', user}
    }

    function failure(error) {
        return {type: 'LOGIN_FAILURE', error}
    }
}

export function logout() {
    authLogout();
    return {type: 'LOGOUT'};
}

export function register(user) {
    return dispatch => {
        dispatch(request(user));
        user.on('g:saved', function () {
                if (getCurrentUser()) {
                    this.trigger('g:userCreated', {
                        user: user
                    });
                } else {
                    let authToken = user.get('authToken') || {};

                    if (authToken.token) {
                        setCurrentUser(user);
                        setCurrentToken(authToken.token);

                        if (corsAuth) {
                            document.cookie = 'girderToken=' + getCurrentToken();
                        }

                        events.trigger('g:login');
                    } else {
                        events.trigger('g:alert', {
                            icon: 'ok',
                            text: 'Check your email to verify registration.',
                            type: 'success',
                            timeout: 4000
                        });
                    }

                    handleClose('register', {replace: true});
                }

                dispatch(success());
                history.push('/login');
                dispatch(successMessage('Registration successful'));
            }, this)
            .on('g:error', function (err) {
                let resp = err.responseJSON;
                dispatch(errorMessage(resp));
                dispatch(failure(resp.toString()));
                dispatch(errorMessage(resp.toString()));
            }, this)
            .save();
    };

    function request(user) {
        return {type: 'REGISTER_REQUEST', user}
    }

    function success(user) {
        return {type: 'REGISTER_SUCCESS', user}
    }

    function failure(error) {
        return {type: 'REGISTER_FAILURE', error}
    }
}

export function getAll() {
    return dispatch => {
        dispatch(request());

        girderAuth.getAll()
                  .then(
                      users => dispatch(success(users)),
                      error => dispatch(failure(error.toString()))
                  );
    };

    function request() {
        return {type: 'GETALL_REQUEST'}
    }

    function success(users) {
        return {type: 'GETALL_SUCCESS', users}
    }

    function failure(error) {
        return {type: 'GETALL_FAILURE', error}
    }
}

// prefixed function name with underscore because delete is a reserved word in javascript
export function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        girderAuth.delete(id)
                  .then(
                      user => dispatch(success(id)),
                      error => dispatch(failure(id, error.toString()))
                  );
    };

    function request(id) {
        return {type: 'DELETE_REQUEST', id}
    }

    function success(id) {
        return {type: 'DELETE_SUCCESS', id}
    }

    function failure(id, error) {
        return {type: 'DELETE_FAILURE', id, error}
    }
}
