import {gql} from '@apollo/client';

import {GraphQLObjectType} from 'graphql'

const signUp = gql `
    mutation signup($input: CreateUserInput!) {
        signup(createUserInput: $input) {
            username
            id
            password
        }
    }
`

const signIn = gql `
    mutation login($input: LoginUserInput!) {
        login(loginUserInput: $input) {
            user {
            username
            id
            }
            access_token
    }
}
`

const getAllUser = gql `
    {
        users {
            username
        }
    }
`

export {
    getAllUser,
    signIn,
    signUp
}