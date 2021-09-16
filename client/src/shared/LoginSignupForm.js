import React from "react";
import { useHistory } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import { GoogleLogin } from "react-google-login";

import "../components/Login.css";

import SignupContainer from "../containers/SignupContainer";
import LoginContainer from "../containers/LoginContainer";

function LoginSignupForm({ pageName }) {
	const history = useHistory();
	const {
		setSignupUsername,
		setSignupPassword,
		setPasswordAgain,
		handleSignup
	} = SignupContainer();

	const {
		setLoginUsername,
		setLoginPassword,
		isPassword,
		handleLogin,
		loginGoogle,
		hidePassword,
		togglePasswordIcon
	} = LoginContainer();

	return (
		<div className="login-page-container">
			<div className="login-page-title-container">
				<h1 className="login-page-main-title">Recipy</h1>
				<h3 className="login-page-subtitle">
					What should I cook today?
				</h3>
			</div>

			<div className="login-page-login-card-container">
				<div className="login-page-card-header-container">
					<div>
						<h1>
							{pageName}
						</h1>
					</div>
				</div>

				<div className="login-form-container">
					<div>
						<input
							className="credentials-input-field"
							type="text"
							id="login-username"
							placeholder="Username"
							autoComplete="off"
							onChange={event =>
								pageName === "Login"
									? setLoginUsername(event.target.value)
									: setSignupUsername(event.target.value)}
						/>
					</div>

					<div>
						<input
							className="credentials-input-field"
							type={isPassword ? "password" : "text"}
							id="login-password"
							placeholder="Password"
							autoComplete="off"
							onChange={event =>
								pageName === "Login"
									? setLoginPassword(event.target.value)
									: setSignupPassword(event.target.value)}
						/>
						<span onClick={() => togglePasswordIcon()}>
							{hidePassword
								? <EyeOutlined className="show-password-icon" />
								: <EyeInvisibleOutlined className="show-password-icon" />}
						</span>
					</div>

					{pageName === "Sign up" &&
						<div>
							<input
								className="credentials-input-field"
								type={isPassword ? "password" : "text"}
								id="login-password-again"
								placeholder="Confirm password"
								autoComplete="off"
								onChange={event =>
									setPasswordAgain(event.target.value)}
							/>
						</div>}

					<div className="login-button-container">
						<button
							className="login-button"
							type="button"
							onClick={() =>
								pageName === "Login"
									? handleLogin()
									: handleSignup()}
						>
							{pageName}
						</button>
					</div>

					{pageName === "Login" &&
						<div>
							<div>
								<h3 className="or-google-login">or</h3>
							</div>

							<GoogleLogin
								className="google-login-button"
								clientId={process.env.REACT_APP_CLIENT_ID}
								buttonText="Sign in"
								onSuccess={loginGoogle}
								onFailure={loginGoogle}
								cookiePolicy={"single_host_origin"}
							/>
						</div>}
				</div>

				{pageName === "Sign up"
					? <div className="account-question-container">
							<h4 className="account-question">
								Do you already have an account?
							</h4>
							<span
								className="login-signup-link"
								onClick={() => {
									history.push("/login");
								}}
							>
								Sign in
							</span>
						</div>
					: <div className="account-question-container">
							<h4 className="account-question">
								Don't you have an account?
							</h4>
							<span
								className="login-signup-link"
								onClick={() => {
									history.push("/signup");
								}}
							>
								Sign up
							</span>
						</div>}
			</div>
		</div>
	);
}

export default LoginSignupForm;
