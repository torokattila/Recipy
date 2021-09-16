import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
	const { authState, setAuthState } = useContext(AuthContext);
	let history = useHistory();

	console.log(history);

	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			console.log("nincs token");
			history.push("/login")
		} else {
			
		}
	}, []);

	return (
		<div>
			<h2>hello</h2>
		</div>
	);
}

export default Home;
