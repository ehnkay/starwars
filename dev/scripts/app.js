import React from "react";
import ReactDOM from "react-dom";
import {ajax} from "jquery";
import {
	BrowserRouter as Router,
	Route, Link } from "react-router-dom";


class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			category: "",
			search: "",
			results: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.categorySelection = this.categorySelection.bind(this);
		this.getStarWarsInfo = this.getStarWarsInfo.bind(this);
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	};
	categorySelection(e) {
		this.setState({
			category: e.target.value
		});
	}
	getStarWarsInfo(e) {
		e.preventDefault();
		this.setState({
			results: []
		});
		ajax({
			url: `http://swapi.co/api/${this.state.category}`,
			method: "GET",
			dataType: "json",
			data: {
				search: this.state.search
			}
		}).then((res) => {
			this.setState({
				results: res.results
			});
		});
	}
	render() {
		return (
			<div>
				<h1>Star Wars API Demo</h1>
				<form action="" onSubmit={this.getStarWarsInfo}>
					<h2>I'm looking for:</h2>
					<div className="flexContainer">
						<div className="unit">
							<input type="radio" name="category" value="films" id="films" onClick={this.categorySelection} onSubmit={this.getStarWarsInfo} />
							<label htmlFor="films">Films</label>
						</div>

						<div className="unit">
							<input type="radio" name="category" value="people" id="people" onClick={this.categorySelection} onSubmit={this.getStarWarsInfo}/>
							<label htmlFor="people">People</label>
						</div>

						<div className="unit">
							<input type="radio" name="category" value="planets" id="planets" onClick={this.categorySelection}/>
							<label htmlFor="planets">Planets</label>
						</div>

						<div className="unit">
							<input type="radio" name="category" value="species" id="species" onClick={this.categorySelection}/>
							<label htmlFor="species">Species</label>
						</div>

						<div className="unit">
							<input type="radio" name="category" value="starships" id="starships" onClick={this.categorySelection}/>
							<label htmlFor="starships">Starships</label>
						</div>

						<div className="unit">
							<input type="radio" name="category" value="vehicles" id="vehicles" onClick={this.categorySelection}/>
							<label htmlFor="vehicles">Vehicles</label>
						</div>
					</div>

					<input type="text" name="search" onChange={this.handleChange}/>
					<input type="submit" value="Go!"/>
				</form>

				<ul className="results">
					{this.state.results.map((result, i) => {
						return(
							<li key={`result-${i}`}><Link to={"details/" + result.url.slice(20)}>{result.name} <span>➡</span></Link></li>
						)
					})}
				</ul>
			</div>
		)
	}
}


class Details extends React.Component {
	constructor() {
		super();
		this.state = {
			result: []
		}
	}
	componentDidMount() {
		ajax({
			url: `http://swapi.co/api/${this.props.match.params.category}/${this.props.match.params.number}`,
			method: "GET",
			dataType: "json"
		}).then((res) => {
			var obj = res;
			var result = Object.keys(obj).map((e) => {
				return [e, obj[e]];
			});

			this.setState({
				result: result
			});
		});
	}
	render() {
		return(
			<div>
				<div className="singleResult">
					<h1>Object Details</h1>
					<Link to="/" className="back">Back To Search</Link>
					<ul className="details">
						{this.state.result.map((detail, i) => {
							if (Array.isArray(detail[1]) && detail[1].length > 1) {
								return(
									<li key={`detail-${i}`}><span className="property">{detail[0]}:</span> {detail[1].map((item, i) => {
										return(
											<li key={`item-${i}`} className="item">{item}</li>
										)
									})}</li>
								)
							} 
							else {
								return(
									<li key={`detail-${i}`}><span className="property">{detail[0]}:</span> {detail[1]}</li>
								)
							}	
						})}
					</ul>
				</div>
			</div>
		)
	}
}


class App extends React.Component {
	render() { 
		return(
			<Router>
				<div>
					<div className="wrapper">
						<Route exact path="/" component={Search} />
						<Route path="/details/:category/:number" component={Details} />
					</div>
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById("app"));