// Importing modules
import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
// import "./App.css";
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from "react-router-dom";

const useStyles = makeStyles({
	app: {
		backgroundColor: '#FADBD8',
		position: 'absolute',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		display: 'flex',
		textAlign: 'center'
	},
	description: {
		alignSelf: 'center',
	},
});

function App() {
	// usestate for setting a javascript
	// object for storing and using data
	// const useStyles = makeStyles({
	// 	app: {
	// 		backgroundColor: '#FADBD8',
	// 		// position: 'absolute',
	// 		// // top: 0,
	// 		// // left: 0,
	// 		// width: '100%',
	// 		// height: '100%',
	// 	  },
	// });
	const classes = useStyles();
	const [data, setdata] = useState({
		name: "",
		age: 0,
		date: "",
		programming: "",
	});

	// Using useEffect for single rendering
	useEffect(() => {
		// Using fetch to fetch the api from
		// flask server it will be redirected to proxy
		fetch("/data").then((res) =>
			res.json().then((data) => {
				// Setting a data from api
				setdata({
					name: data.Name,
					age: data.Age,
					date: data.Date,
					programming: data.programming,
				});
			})
		);
	}, []);

	return (
		<div className={classes.app}>
			{/* <header className="App-header">
				<p>nikita</p>
			</header> */}
			<div className={classes.description}>
				<Typography variant="h1">Upload your photos.</Typography>
				{/* Calling a data from setdata for showing */}
				<p></p>
				<Typography variant="h4"> Watch your images rotate and click on them for a fun surprise... 📸</Typography>
				<p></p>
				<NavLink style={{ textDecoration: 'none' }} to="/uploader">
					<Button sx={{ margin: '15px', backgroundColor: '#EA4D4D', '&:hover': {
											backgroundColor: '#DC4343'
										}, color: '#000000'
								}} 
						variant="contained"
						onClick={console.log("here")}
					>
                      Get Started
                  </Button>
				</NavLink>
			</div>
		</div>
	);
}

export default App;
