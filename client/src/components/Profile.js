import React, { useContext } from "react";
import Navbar from "../shared/Navbar";
import { EyeOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import LoginContainer from "../containers/LoginContainer";
import ProfileContainer from "../containers/ProfileContainer";
import { AuthContext } from "../helpers/AuthContext";
import "./Profile.css";

function Profile() {
	const { authState, pageLanguage } = useContext(AuthContext);
	const { isPassword, hidePassword, togglePasswordIcon } = LoginContainer();
	const {
		handleEditCredentials,
		setNewUsername,
		setOldPassword,
		setNewPassword,
		handleDeleteProfile
	} = ProfileContainer();

	return (
		<div>
			<Navbar />

			<div className="profile-page-container">
				<div className="edit-credentials-container">
					<div className="username-section">
						<h2 className="edit-credentials-label">
							{pageLanguage === "EN"
								? "Change username"
								: "Felhasználónév módosítása"}:
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
								placeholder={
									pageLanguage === "EN"
										? "New username"
										: "Új felhasználónév"
								}
								onChange={event =>
									setNewUsername(event.target.value)}
								readOnly={authState.google_id ? true : false}
							/>
						</form>
					</div>

					<div className="password-section">
						<h2 className="edit-credentials-label">
							{pageLanguage === "EN"
								? "Change password"
								: "Jelszó módosítása"}:
						</h2>

						<div>
							<input
								type={isPassword ? "password" : "text"}
								placeholder={
									pageLanguage === "EN"
										? "Old password"
										: "Régi jelszó"
								}
								className="edit-credentials-input"
								onChange={event =>
									setOldPassword(event.target.value)}
								readOnly={authState.google_id ? true : false}
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
								placeholder={
									pageLanguage === "EN"
										? "New password"
										: "Új jelszó"
								}
								className="edit-credentials-input"
								onChange={event =>
									setNewPassword(event.target.value)}
								readOnly={authState.google_id ? true : false}
							/>
						</div>
					</div>

					<div className="edit-credentials-buttons-container">
						<div>
							<button
								className="save-changes-button edit-credentials-button"
								onClick={handleEditCredentials}
								disabled={authState.google_id ? true : false}
							>
								{pageLanguage === "EN"
									? "save changes"
									: "módosítás"}
							</button>
						</div>
						<div>
							<button
								className="delete-profile-button edit-credentials-button"
								onClick={handleDeleteProfile}
							>
								{pageLanguage === "EN"
									? "delete profile"
									: "profil törlése"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
