import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

//initial state
const initialState = {
    transactions: [],
    error: null,
    loading: true,
};

// create global context
export const GlobalContext = createContext(initialState);

//create gloabl provider
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    //actions
    // getting transactions from backend
    async function getTransactions() {
        try {
            const res = await axios.get('/api/v2/transactions');

            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: res.data.data,
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error,
            });
        }
    }

    //delete
    async function deleteTransaction(id) {
        try {
            await axios.delete(`/api/v2/transactions/${id}`);

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id,
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error,
            });
        }
    }

    //add
    async function addTransaction(transaction) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.post(
                `/api/v2/transactions`,
                transaction,
                config
            );
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data,
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error,
            });
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                transactions: state.transactions,
                error: state.error,
                loading: state.loading,
                deleteTransaction,
                addTransaction,
                getTransactions,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
