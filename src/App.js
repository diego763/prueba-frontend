import "./App.css";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import {
	Chart as ChartJS,
	CategoryScale,
	BarElement,
	LinearScale,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

//Opciones para el grafico de barras
const options = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
			position: "top",
		},
		title: {
			display: false,
			text: "",
		},
	},
};

//url de la api
const API_URL = "http://localhost:3001/get/resource/memory";

function App() {
	const [compare, setCompare] = useState(false);
	const [dataBar, setDataBar] = useState({
		labels: [],
		datasets: [
			{
				label: "Free memory",
				data: [],
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	});

	useEffect(() => {
		let interval = setInterval(async () => {
			try {
				const response = await fetch(API_URL).then((response) =>
					response.json()
				);

				if (response.status) {
					const { data } = response;
					const labels = [];
					const dataSetsData = [];
					data.forEach((memory) => {
						labels.push(memory.date_created);
						dataSetsData.push(memory.free_memory / 1024 / 1024);
					});
					const datasets = [
						{
							label: "Free memory",
							data: [...dataSetsData],
							backgroundColor: "rgba(255, 99, 132, 0.5)",
						},
					];
					setDataBar({ labels, datasets });
				}
			} catch (error) {}
		}, 1000);
		return () => clearInterval(interval);
	}, [dataBar]);

	return (
		<div className="App">
			{compare && (
				<header className="header">
					<form action="">
						<select className="header-input">
							<option value="30">
								Comparar 30 minutos antes
							</option>
							<option value="60">Comparar 1 hora antes</option>
							<option value="120">Comparar 2 hora antes</option>
							<option value="180">Comparar 3 hora antes</option>
						</select>
					</form>
				</header>
			)}

			<section className="compare-time-frame">
				<Bar options={options} data={dataBar} />
				<button
					className="btn-compare"
					onClick={() => setCompare(!compare)}
				>
					{compare
						? "Quitar comparación"
						: "Comparar con otro time frame"}
				</button>
			</section>

			{compare && (
				<section className="compare-time-frame">
					{/* Crear otra barra aqui, de momento esta duplicado el primero */}
					<Bar options={options} data={dataBar} />
				</section>
			)}
		</div>
	);
}

export default App;
