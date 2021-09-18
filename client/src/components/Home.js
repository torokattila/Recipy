import React, { useEffect, useContext, useState } from "react";
import HomeContainer from "../containers/HomeContainer";
import Navbar from "../shared/Navbar";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import "./Home.css";

function Home() {
	const { openModal, handleOpenModal, handleCloseModal } = HomeContainer();
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
		<div>
			<Navbar />

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
					<div className={modalClasses.paper}>
						<h2 className="modal-title">Create your new recipe</h2>

						<div className="create-recipe-form">
							<div className="create-recipe-input-container">
								<input
									type="text"
									placeholder="Recipe title"
									className="recipe-title-input"
								/>
							</div>

							<div className="create-recipe-input-container">
								<textarea
									placeholder="Preparation"
									className="recipe-preparation-textarea"
								/>
							</div>

							<div className="create-recipe-button-container">
								<button className="create-recipe-button">
									Create
								</button>
							</div>
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

			<div className="add-recipe-button-container">
				<Tooltip title="Add new recipe" arrow>
					<button
						className="add-recipe-button"
						onClick={handleOpenModal}
					>
						+
					</button>
				</Tooltip>
			</div>
		</div>
	);
}

export default Home;
