import React, {useState, useEffect} from 'react'
import css from './SignIn.scss'

import {useMutation, useLazyQuery, useQuery } from '@apollo/client';

import {signIn, getAllUser} from '../../queries/queries'

// import {Cookies, useCookies} from 'react-cookie';
import Cookies from 'js-cookie'

export default function EntryPage() {

  const [currentView, setCurrentView] = useState('logIn');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [count, setCount] = useState(0)
  
  const [authCookies, setAuthCookies] = useState('');

  // const [cookies, setCookies, removeCookies] = useCookies(['auth-cookies'])

  const [loginSubmitForm, {data : dataSignIn, loading: loadingSignIn, error: errorSignIn}] = useMutation(signIn)


  const [
    getUsers, 
    {data: dataUsers, error: errorGetUser, loading: loadingGetUser, called}
  ] = useLazyQuery(getAllUser, {
    context: {
      headers: {
        "Authorization": "Bearer " +  authCookies
      }
    },
    fetchPolicy: 'no-cache'
  })

  let changeView = (view) => {
    setCurrentView(view);
  }


  useEffect(() => {
    if (!loadingSignIn) {
      if(dataSignIn)
      {
        Cookies.set('access_token', dataSignIn.login.access_token)
        setAuthCookies(dataSignIn.login.access_token)
        console.log('loading sign in: ',loadingSignIn)
    // console.log('loading get user: ', loadingGetUser)
      }
        
        
    }

    
    
  }, [loadingSignIn, dataSignIn])

  let getCurrentView = () => {
    switch(currentView) {
      case "signUp":
        return (
          <form>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" required/>
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" required/>
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" required/>
                </li>
              </ul>
            </fieldset>
            <button>Submit</button>
            <button type="button" onClick={ () => changeView("logIn")}>Have an Account?</button>
          </form>
        )
      case "logIn": //DOING HERE
        return (
          loadingSignIn ? <h1>loding</h1> :
          <form 
            onSubmit={e => {
                e.preventDefault();
                loginSubmitForm({
                  variables: {
                    input: {
                      username,
                      password
                    }
                  }
                })
                
            }}
          >
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </li>
                <li>
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </li>
                <li>
                  <i/>
                  <button 
                    style={{cursor: 'pointer'}} 
                    onClick={() => {
                      console.log(authCookies)

                      getUsers();
                      setCount(prev => prev + 1)
                    }} 
                  >Get user</button>
                </li>
              </ul>                               
            </fieldset>
            <button
              onClick={() => {
                loginSubmitForm({
                  variables: {
                    input: {
                      username,
                      password
                    }
                  }
                })

              }}
            >
                Login
            </button>
            <button 
                type="button" 
                onClick={ () => {
                    // changeView("signUp")
                    // console.log(dataSignIn)
                    // console.log(dataUsers)
                    // Cookies.remove('access_token')
                    console.log(called);
                    console.log(count)
                }}
            >
                Create an Account
            </button>
          </form>
        )
      case "PWReset":
        return (
          <form>
          <h2>Reset Password</h2>
          <fieldset>
            <legend>Password Reset</legend>
            <ul>
              <li>
                <em>A reset link will be sent to your inbox!</em>
              </li>
              <li>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required/>
              </li>
            </ul>
          </fieldset>
          <button>Send Reset Link</button>
          <button type="button" onClick={ () => changeView("logIn")}>Go Back</button>
        </form>
        )
      default:
        break
    }
  }


return (
    <section id="entry-page">
        {getCurrentView()}
    </section>
)
}
