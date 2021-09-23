import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { AuthContext } from "../helpers/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import {
	findFlagUrlByNationality,
	findFlagUrlByCountryName
} from "country-flags-svg";

import { GoogleLogin } from "react-google-login";

import "../components/Login.css";

import SignupContainer from "../containers/SignupContainer";
import LoginContainer from "../containers/LoginContainer";

function LoginSignupForm({ pageName }) {
	const history = useHistory();
	const { pageLanguage } = useContext(AuthContext);
	const hungarianFlagUrl = findFlagUrlByNationality("Hungarian");
	const englishFlagUrl = findFlagUrlByCountryName("United Kingdom");

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
		togglePasswordIcon,
		handleChangeLanguage
	} = LoginContainer();

	return (
		<div className="login-page-container">
			<div className="login-page-title-container">
				<h1 className="login-page-main-title">Recipy</h1>
				<h3 className="login-page-subtitle">
					{pageLanguage === "EN"
						? "What should I cook today?"
						: "Mit főzzek ma?"}
				</h3>

				<div>
					<IconButton
						onClick={() => {
							handleChangeLanguage("EN");
						}}
					>
						<img src={englishFlagUrl} className="flag-icon" />
					</IconButton>

					<IconButton
						onClick={() => {
							handleChangeLanguage("HU");
						}}
					>
						<img src={hungarianFlagUrl} className="flag-icon" />
					</IconButton>
				</div>
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
							placeholder={
								pageLanguage === "EN"
									? "Username"
									: "Felhasználónév"
							}
							autoComplete="off"
							onChange={event =>
								pageName === "Login" ||
								pageName === "Bejelentkezés"
									? setLoginUsername(event.target.value)
									: setSignupUsername(event.target.value)}
						/>
					</div>

					<div>
						<input
							className="credentials-input-field"
							type={isPassword ? "password" : "text"}
							id="login-password"
							placeholder={
								pageLanguage === "EN" ? "Password" : "Jelszó"
							}
							autoComplete="off"
							onChange={event =>
								pageName === "Login" ||
								pageName === "Bejelentkezés"
									? setLoginPassword(event.target.value)
									: setSignupPassword(event.target.value)}
						/>
						<span onClick={() => togglePasswordIcon()}>
							{hidePassword
								? <EyeOutlined className="show-password-icon" />
								: <EyeInvisibleOutlined className="show-password-icon" />}
						</span>
					</div>

					{pageName === "Sign up" ||
						(pageName === "Regisztráció" &&
							<div>
								<input
									className="credentials-input-field"
									type={isPassword ? "password" : "text"}
									id="login-password-again"
									placeholder={
										pageLanguage === "EN"
											? "Confirm password"
											: "Jelszó megerősítése"
									}
									autoComplete="off"
									onChange={event =>
										setPasswordAgain(event.target.value)}
								/>
							</div>)}

					<div className="login-button-container">
						<button
							className="login-button"
							type="button"
							onClick={() =>
								pageName === "Login" ||
								pageName === "Bejelentkezés"
									? handleLogin()
									: handleSignup()}
						>
							{pageName}
						</button>
					</div>

					{(pageName === "Login" || pageName === "Bejelentkezés") &&
						<div>
							<div>
								<h3 className="or-google-login">
									{pageLanguage === "EN" ? "or" : "vagy"}
								</h3>
							</div>

							<GoogleLogin
								className="google-login-button"
								clientId={process.env.REACT_APP_CLIENT_ID}
								buttonText={
									pageLanguage === "EN"
										? "Sign in"
										: "Bejelentkezés"
								}
								onSuccess={loginGoogle}
								onFailure={loginGoogle}
								cookiePolicy={"single_host_origin"}
							/>
						</div>}
				</div>

				{pageName === "Sign up" || pageName === "Regisztráció"
					? <div className="account-question-container">
							<h4 className="account-question">
								{pageLanguage === "EN"
									? "Do you already have an account?"
									: "Van már fiókod?"}
							</h4>
							<span
								className="login-signup-link"
								onClick={() => {
									history.push("/login");
								}}
							>
								{pageLanguage === "EN"
									? "Sign in"
									: "Bejelentkezés"}
							</span>
						</div>
					: <div className="account-question-container">
							<h4 className="account-question">
								{pageLanguage === "EN"
									? "Don't you have an account?"
									: "Nincs még fiókod?"}
							</h4>
							<span
								className="login-signup-link"
								onClick={() => {
									history.push("/signup");
								}}
							>
								{pageLanguage === "EN"
									? "Sign up"
									: "Regisztráció"}
							</span>
						</div>}
			</div>
		</div>
	);
}

export default LoginSignupForm;
