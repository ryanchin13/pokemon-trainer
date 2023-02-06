import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { Provider } from 'react-redux'
import store from './redux/store'

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
  //   https://www.apollographql.com/docs/react/pagination/core-api
    cache: new InMemoryCache()
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
        <ApolloProvider client={client}>
            <Provider store={store}>
              <App />
            </Provider>
        </ApolloProvider>
    </ChakraProvider>
);
setTimeout(() => {
  const body = document.getElementById("htmlBody")
  body.removeChild(body.lastChild)
}, 1)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
