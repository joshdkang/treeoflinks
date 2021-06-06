import axios from 'axios';
import React, { useContext }  from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../context/AuthContext';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

const Login = () => {
  const {getLoggedIn} = useContext(AuthContext);
  const history = useHistory();
  
  const login = async (values) => {
    try {
      await axios.post('https://treeoflinks.herokuapp.com/login', values);
      await getLoggedIn();
      history.push('/admin');
    } catch(error) {
      if (error.response) 
        return { [FORM_ERROR] : 'Incorrect login details. Please retry.' };        
    }
  }

  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className="ui small red message">
          <div className="content" align="left">{error}</div>
        </div>
      );
    }
  };
  
  const renderInput = ({ input, meta, placeholder }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
  
    return (
      <div className={className}>
        <input {...input} autoComplete="off" placeholder={placeholder} />
        {renderError(meta)}
      </div>
    )
  };

  return (
    <div className="ui center aligned three column grid" style={{ marginTop: '10px' }}>
      <div className="column">
        <h2>
          <div className="content">
            Sign in to your account
          </div>
        </h2>
        <Form
          onSubmit={login}
          validate={values => {
            const errors = {};
  
            if (!values.username) errors.username = 'Enter username';
            if (!values.password) errors.password = 'Enter password';
            return errors;
          }}
          render={({ handleSubmit, submitError, hasValidationErrors, submitting, pristine, values }) =>(
            <form 
              onSubmit={handleSubmit}
              className="ui equal width form"
            >
              <div className="ui segment">
                <Field 
                  name="username"
                  component={renderInput} 
                  placeholder="Username"
                >
                </Field>
                <Field 
                  name="password" 
                  type="password"
                  component={renderInput}
                  placeholder="Password"
                >
                </Field>
                {submitError && <div className="ui small red message">{submitError}</div>}
              </div>
              <button 
                className="ui fluid large button" 
                type="submit"
                disabled={submitting || pristine || hasValidationErrors}
              >
                Sign in
              </button> 
            </form>
          )}
        />
      </div>
    </div>
  );
}

export default Login;