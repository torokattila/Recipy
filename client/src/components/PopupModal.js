import React from "react";
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
	handleOpenRecipeModal,
	handleCloseModal,
	handleSubmitRecipe,
	setRecipeTitle,
	setRecipePreparation
}) {
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
							? "Create your new recipe"
							: recipeTitle}
					</h2>

					<div className="create-recipe-form">
						<div className="create-recipe-input-container">
							{type === "create-form"
								? <input
										type="text"
										placeholder="Recipe title"
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
									placeholder="Preparation"
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
									Create
								</button>
							</div>}
					</div>

					<Tooltip title="Close" placement="top" arrow>
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
