import React, { useContext } from "react";
import Navbar from "../shared/Navbar";
import { EyeOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import LoginContainer from "../containers/LoginContainer";
import { AuthContext } from "../helpers/AuthContext";
import "./Profile.css";

function Profile() {
	const { authState } = useContext(AuthContext);
	const { isPassword, hidePassword, togglePasswordIcon } = LoginContainer();

	return (
		<div>
			<Navbar />

			<div className="profile-page-container">
				<div className="edit-credentials-container">
					<div className="username-section">
						<h2 className="edit-credentials-label">
							Change username:
						</h2>

						<form
							className="username-inputs-container"
							autoComplete="off"
						>
							<input
								type="text"
								className="edit-credentials-input"
								value={authState.username}
                                readOnly
							/>

							<input
								type="text"
								className="edit-credentials-input"
								placeholder="New username"
							/>
						</form>
					</div>

					<div className="password-section">
						<h2 className="edit-credentials-label">
							Change password:
						</h2>

						<div>
							<input
								type={isPassword ? "password" : "text"}
								placeholder="Old password"
								className="edit-credentials-input"
							/>

							<span onClick={() => togglePasswordIcon()}>
								{hidePassword
									? <EyeOutlined className="show-password-icon-profile-page" />
									: <EyeInvisibleOutlined className="show-password-icon-profile-page" />}
							</span>
						</div>

						<div>
							<input
								type={isPassword ? "password" : "text"}
								placeholder="New password"
								className="edit-credentials-input"
							/>
						</div>
					</div>

					<div className="edit-credentials-buttons-container">
						<div>
							<button className="save-changes-button edit-credentials-button">
								save changes
							</button>
						</div>
						<div>
							<button className="delete-profile-button edit-credentials-button">
								delete profile
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
