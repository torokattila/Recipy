import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import HomeContainer from "../containers/HomeContainer";
import Navbar from "../shared/Navbar";

function Home() {
	const history = useHistory();

	return (
		<div>
			<Navbar />
			<h1>home</h1>
		</div>
	);
}

export default Home;
