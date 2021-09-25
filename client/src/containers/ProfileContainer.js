import { useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ProfileContainer() {
	const [newUsername, setNewUsername] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const { authState, pageLanguage } = useContext(AuthContext);
	const history = useHistory();

	const handleEditCredentials = () => {
		Swal.fire({
			title:
				pageLanguage === "EN" ? "Are you sure?" : "Biztos vagy benne?",
			text:
				pageLanguage === "EN"
					? "Do you want to edit your profile data?"
					: "Biztos szerkeszteni szeretnéd az adataidat?",
			showCancelButton: true,
			confirmButtonText: pageLanguage === "EN" ? "Yes" : "Igen",
			cancelButtonText: pageLanguage === "EN" ? "Cancel" : "Mégse"
		}).then(response => {
			if (response.value) {
				if (
					newUsername.trim() === "" &&
					oldPassword.trim() === "" &&
					newPassword.trim() === ""
				) {
					Swal.fire({
						title: "",
						text:
							pageLanguage === "EN "
								? "If you want to edit your profile data, fill the username and/or the two password fields down below!"
								: "A szerkesztéshez töltsd ki a felhasználónév és/vagy a két jelszó mezőt!",
						type: "error"
					});
				} else {
					axios
						.put(
							"http://localhost:3001/api/editprofile",
							{
								googleId: authState.google_id,
								oldUsername: authState.username,
								newUsername: newUsername.trim(),
								oldPassword: oldPassword.trim(),
								newPassword: newPassword.trim(),
								languageToBackend: pageLanguage
							},
							{
								headers: {
									accessToken: localStorage.getItem(
										"accessToken"
									)
								}
							}
						)
						.then(response => {
							if (response.data.error) {
								Swal.fire({
									title: "",
									text: response.data.error,
									type: "error"
								});
							} else {
								Swal.fire({
									title: "",
									text: response.data.successMessage,
									type: "success"
								}).then(response => {
									if (response.value) {
										history.push("/");
										window.location.reload(false);
									}
								});
							}
						})
						.catch(error => {
							console.log(error);
							Swal.fire({
								title: "",
								text:
									pageLanguage === "EN"
										? "There was an error with the update, please try again!"
										: "Hiba adódott a szerkesztéssel, kérjük próbáld újra!",
								type: "error"
							});
						});
				}
			}
		});
	};

	const handleDeleteProfile = () => {
		Swal.fire({
			title:
				pageLanguage === "EN" ? "Are you sure?" : "Biztos vagy benne?",
			text:
				pageLanguage === "EN"
					? "Do you want to delete your profile?"
					: "Biztos törölni szeretnéd a profilodat?",
			showCancelButton: true,
			confirmButtonText: pageLanguage === "EN" ? "Yes" : "Igen",
			cancelButtonText: pageLanguage === "EN" ? "Cancel" : "Mégse"
		}).then(response => {
			if (response.value) {
				axios
					.delete("http://localhost:3001/api/deleteprofile", {
						headers: {
							accessToken: localStorage.getItem("accessToken")
						},
						data: {
							languageToBackend: pageLanguage
						}
					})
					.then(deleteResponse => {
						if (deleteResponse.data.error) {
							Swal.fire({
								title: "",
								text: deleteResponse.data.error,
								type: "error"
							});
						} else {
							localStorage.removeItem("accessToken");
							window.location.reload(false);
						}
					})
					.catch(deleteError => {
						console.log(deleteError);
						Swal.fire({
							title: "",
							text:
								pageLanguage === "EN"
									? "There was an error with the deletion, please try again!"
									: "Hiba adódott a törléssel, kérjük próbáld újra!",
							type: "error"
						});
					});
			}
		});
	};

	return {
		handleEditCredentials,
		setNewUsername,
		setOldPassword,
		setNewPassword,
		handleDeleteProfile
	};
}

export default ProfileContainer;
