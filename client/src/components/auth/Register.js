import axios from 'axios';
import React, { useContext }  from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../context/AuthContext';
import { Form, Field } from 'react-final-form';
import validator from 'validator';

const Register = () => {
  const {getLoggedIn} = useContext(AuthContext);
  const history = useHistory();

  const register = async (values) => {
    try {
      await axios.post('https://treeoflinks.herokuapp.com/register', values);
      await getLoggedIn();
      history.push('/admin');
    } catch(error) {
      if (error.response) return error.response.data;
    }
  }

  const renderError = ({ error, submitError, touched }) => {
    if (touched && (error || submitError)) {
      return (
        <div className="ui small red message">
          <div className="content" align="left">{error || submitError}</div>
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
            Create an account
          </div>
        </h2>
        <Form
          onSubmit={register}
          validate={values => {
            const errors = {};
            const regex = /^[a-z0-9._]+$/i;
  
            if (!values.email || !validator.isEmail(values.email)) errors.email = 'Please enter a valid email address';
            if (!values.username) errors.username = 'Please enter a valid username';
            if (!regex.test(values.username)) errors.username = 'Usernames may only contain letters, numbers, underscores ("_") and periods (".")';
            if (!values.password || values.password.length < 8) errors.password = 'Password must be at least 8 characters';
            if (!values.passwordVerify) errors.passwordVerify = 'Please verify password';
            if (values.password !== values.passwordVerify) errors.passwordVerify = 'Passwords must match'
            return errors;
          }}
          render={({ handleSubmit, form, submitting, pristine, values, hasValidationErrors }) =>(
            <form 
              onSubmit={handleSubmit}
              className="ui equal width form"
            >
              <div className="ui segment">
                <Field 
                  name="email"
                  component={renderInput}
                  placeholder="Email"
                >
                </Field>
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
                <Field 
                  name="passwordVerify"
                  type="password"
                  component={renderInput}
                  placeholder="Verify Password"
                >
                </Field>
              </div>
              <button 
                className="ui fluid large button" 
                type="submit"
                disabled={submitting || pristine || hasValidationErrors}
              >
                Sign Up
              </button> 
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default Register;