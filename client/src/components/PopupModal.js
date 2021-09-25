import React, { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import "./RecipeCard.css";

function PopupModal({
	type,
	recipeTitle,
	recipeContent,
	openModal,
	handleCloseModal,
	handleSubmitRecipe,
	setRecipeTitle,
	setRecipePreparation
}) {
	const { pageLanguage } = useContext(AuthContext);
	const useStyles = makeStyles(theme => ({
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			border: "none",
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
			borderRadius: 20,
			minWidth: "30vw"
		}
	}));
	const modalClasses = useStyles();
	let translatedCreateRecipeTitle =
		pageLanguage === "EN"
			? "Create your new recipe"
			: "Új recept létrehozása";

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={openModal}
			onClose={handleCloseModal}
			className={modalClasses.modal}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500
			}}
		>
			<Fade in={openModal}>
				<div id="popup-modal" className={modalClasses.paper}>
					<h2 className="modal-title">
						{type === "create-form"
							? translatedCreateRecipeTitle
							: recipeTitle}
					</h2>

					<div className="create-recipe-form">
						<div className="create-recipe-input-container">
							{type === "create-form"
								? <input
										type="text"
										placeholder={
											pageLanguage === "EN"
												? "Recipe title"
												: "Recept címe"
										}
										className="recipe-title-input"
										onChange={event =>
											setRecipeTitle(event.target.value)}
									/>
								: <div className="recipe-card-content-modal-container">
										<p>
											{recipeContent}
										</p>
									</div>}
						</div>

						{type === "create-form" &&
							<div className="create-recipe-input-container">
								<textarea
									placeholder={
										pageLanguage === "EN"
											? "Preparation"
											: "Elkészítés"
									}
									className="recipe-preparation-textarea"
									onChange={event =>
										setRecipePreparation(
											event.target.value
										)}
								/>
							</div>}

						{type === "create-form" &&
							<div className="create-recipe-button-container">
								<button
									className="create-recipe-button"
									onClick={handleSubmitRecipe}
								>
									{pageLanguage === "EN"
										? "Create"
										: "Létrehozás"}
								</button>
							</div>}
					</div>

					<Tooltip
						title={pageLanguage === "EN" ? "Close" : "Bezár"}
						placement="top"
						arrow
					>
						<button
							className="close-modal-button"
							onClick={handleCloseModal}
						>
							x
						</button>
					</Tooltip>
				</div>
			</Fade>
		</Modal>
	);
}

export default PopupModal;
