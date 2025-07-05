import { gql } from '@apollo/client';

export const CREATE_ITEM = gql`
    mutation CreateItem($input: CreateItemInput!) {
        createItem(input: $input) {
            id
            name
            description
        }
    }
`;

export const UPDATE_ITEM = gql`
    mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
        updateItem(id: $id, input: $input) {
            id
            name
            description
        }
    }
`;

export const DELETE_ITEM = gql`
    mutation DeleteItem($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`;

export const Login = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                email
                name
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation Mutation($input: UserInput!) {
        addUser(input: $input) {
            user {
                username
                _id
            }
            token
        }
    }
`;