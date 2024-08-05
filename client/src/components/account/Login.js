import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../apis/axios';

import { FloatingLabel, Form } from 'react-bootstrap';
import './Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function Login({
	switchLoginSignupViewsHandler,
	switchLoginForgotPasswordViewsHandler,
	loginUpdateHandler,
	closeAuthenticationHandler
}) {

	const EMAIL_REGEX = useMemo(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, []);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname;

	const loginRef = useRef(null);

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);
	const [password, setPassword] = useState('');

	// Determine if both fields are populated
	const areBothFieldsPopulated = email && validEmail && password;

	// Clear all fields
	const clearFields = () => {
		setEmail(''); setPassword('');
	}

	const submitHandler = async (event) => {
		event.preventDefault();

		try {
			const user = { email, password };
			const response = await axios.post(`/auths/login`,
				user,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			);

			if (response.status === 201 && response.headers['authorization']) {
				if (response.data.status_id === 2) {
					alert("Your account is not verified. Please verify your account.");
					return;
				}
				const accessToken = response.headers['authorization'].split(' ')[1];
				const user = response.data;
				const clearance = response.data.clearance_id;
				loginUpdateHandler(accessToken, user, clearance);
				closeAuthenticationHandler();
				if (from) {
					navigate(from, { replace: true });
				}
			} else {
				console.log("Authorization header missing or incorrect status code received.");
			}
		} catch (err) {
			if (!err?.response) {
				console.log("No server response. " + err);
			} else if (err.response.status === 400) {
				console.log("Missing email or password. " + err);
			} else if (err.response.status === 401) {
				console.log("Unauthorized. " + err);
			} else {
				console.log("Login failed. " + err);
			}
		} finally {
			clearFields();
			loginRef.current.reset();
		}
	}

	// Validate email
	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
		// TODO : Use a 3rd party API to verify that this is a valid and legit email address
	}, [email, EMAIL_REGEX]);

	return (
		<div className="d-flex login-modal">
			<Form ref={loginRef} onSubmit={submitHandler} className="login-container">
				<div className="d-flex row justify-content-center">
					<div className="login-form">
						<FloatingLabel className="form-group mb-3" label="Email">
							<Form.Control
								type="email"
								name="email"
								placeholder="Email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								onFocus={() => setEmailFocus(true)}
								onBlur={() => setEmailFocus(false)}
								autoComplete="off"
								autoFocus="on"
								required
							/>
							{emailFocus && email && !validEmail ?
								(<p>
									<FontAwesomeIcon icon={faInfoCircle} /> {" "}
									Must be a valid email address. <br />
									In the form example@stargazer.com.
								</p>)
								: null}
						</FloatingLabel>
						<FloatingLabel className="form-group mb-3" label="Password">
							<Form.Control
								type="password"
								name="password"
								placeholder="Password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
						</FloatingLabel>
						<h6 className="mb-3" onClick={switchLoginForgotPasswordViewsHandler} style={{ cursor: 'pointer' }}>Forgot password? Click here</h6>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={!areBothFieldsPopulated}
						>
							Login
						</button>
					</div>
				</div>
			</Form>
			<div className='registration-banner'>
				<h6 className="p-4" onClick={switchLoginSignupViewsHandler} style={{ cursor: 'pointer' }}>No account? Register here</h6>
			</div>
		</div>
	);
}