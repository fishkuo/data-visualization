function setDate(start, end) {
	let all_date = [];
	for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
		formatDt = `${new Date(d).getFullYear()}-${new Date(d).getMonth() + 1}-${new Date(d).getDate()}`;
		all_date.push(formatDt);
	}
	// console.log(all_date);
	return all_date;
}
async function getData() {
	let pos_count = 0;
	let neg_count = 0;
	let neutral_count = 0;
	let pos_line = {};
	let neg_line = {};
	const all_date = await setDate(start_date, end_date);
	// console.log(all_date);
	const response = await fetch('./seperated_csv/sentiment.csv');
	const data = await response.text();
	const rows = data.split('\n').splice(1);

	// date as object values
	all_date.forEach((d) => {
		pos_line[d] = 0;
		neg_line[d] = 0;
	});
	// console.log(Object.keys(pos_line));
	// console.log(pos_line);
	// pos_line = {Object.keys(pos_line): Object.values(pos_line)}
	rows.forEach((element) => {
		const column = element.split(',');
		const title = column[1];
		const sentiment = column[2];
		const dt = `${new Date(column[3]).getFullYear()}-${new Date(column[3]).getMonth() + 1}-${new Date(
			column[3]
		).getDate()}`;
		// console.log(dt);
		// all_date.push(dt);

		if (sentiment == 'positive') {
			pos_count += 1;
			pos_line[dt] += 1;
			// console.log(1);
		} else if (sentiment == 'negative') {
			neg_count += 1;
			neg_line[dt] += 1;
		} else {
			neutral_count += 1;
		}
	});
	return { pos_count, neg_count, neutral_count, pos_line, neg_line };
}
async function sentBar() {
	const get_data = await getData();
	const ctx = document.getElementById('myChart').getContext('2d');
	const myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['正面', '負面', '中立'],
			datasets: [
				{
					label: '（主文）情緒長條圖',
					data: [get_data.pos_count, get_data.neg_count, get_data.neutral_count],
					backgroundColor: ['lightgreen', 'tomato', 'lightblue']
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							callback: function (value, index, values) {
								return value + ' 則';
							}
						}
					}
				]
			}
		}
	});
}
async function sentLine() {
	const all_date = await setDate(start_date, end_date);
	const get_data = await getData();
	const ctx = document.getElementById('myChart').getContext('2d');
	// console.log(all_date);
	// console.log(get_data.pos_line);
	const myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: all_date,
			datasets: [
				{
					label: '（主文）正面聲量',
					data: Object.values(get_data.pos_line),
					backgroundColor: '#8FC31F',
					fill: false,
					pointRadius: 5,
					borderColor: '#8FC31F'
				},
				{
					label: '（主文）負面聲量',
					data: Object.values(get_data.neg_line),
					backgroundColor: 'red',
					fill: false,
					pointRadius: 5,
					borderColor: 'red'
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							callback: function (value, index, values) {
								return value + ' 則';
							}
						}
					}
				]
			}
		}
	});
}

start_date = '2018-08-15';
end_date = '2018-10-15';
setDate(start_date, end_date);
getData();
sentBar();

const bar_btn = document.querySelector('.bar');
const line_btn = document.querySelector('.line');

bar_btn.addEventListener('click', sentBar);
line_btn.addEventListener('click', sentLine);
