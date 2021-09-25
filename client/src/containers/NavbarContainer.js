import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

function NavbarContainer() {
	const { setAuthState, pageLanguage } = useContext(AuthContext);
	const history = useHistory();

	const handleLogout = () => {
		Swal.fire({
			title:
				pageLanguage === "EN" ? "Are you sure?" : "Biztos vagy benne?",
			text:
				pageLanguage === "EN"
					? "Do you want to log out?"
					: "Biztos ki szeretnél jelentkezni?",
			showCancelButton: true,
			cancelButtonText: pageLanguage === "EN" ? "Cancel" : "Mégse"
		}).then(response => {
			if (response.value) {
				localStorage.removeItem("accessToken");
				setAuthState({
					username: "",
					id: 0,
					status: false
				});

				history.push("/login");
				window.location.reload(false);
			}
		});
	};

	return {
		handleLogout
	};
}

export default NavbarContainer;
