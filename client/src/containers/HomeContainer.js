import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function HomeContainer() {
	const [openModal, setOpenModal] = useState(false);
	const [recipeTitle, setRecipeTitle] = useState("");
	const [recipePreparation, setRecipePreparation] = useState("");

	const handleOpenModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleSubmitRecipe = () => {
		const data = { title: recipeTitle, preparation: recipePreparation };

		axios
			.post("http://localhost:3001/api/createrecipe", data, {
				headers: {
					accessToken: localStorage.getItem("accessToken")
				}
			})
			.then(response => {
				if (response.data.error) {
					Swal.fire({
						title: "",
						text: response.data.error,
						type: "error"
					});
				} else {
					handleCloseModal();
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	return {
		setRecipeTitle,
		setRecipePreparation,
		openModal,
		handleOpenModal,
		handleCloseModal,
		handleSubmitRecipe
	};
}

export default HomeContainer;
