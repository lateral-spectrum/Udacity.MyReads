import React from 'react';
import SpinnerBox from './components/SpinnerBox/SpinnerBox';
import './SearchPage.css';
import Head from '../../components/Head/Head';
import Foot from '../../components/Foot/Foot';
import Bookshelf from '../../components/Bookshelf/Bookshelf';
import {BooksAPI} from "../../apis/BooksAPI";
import _ from 'lodash';

export default class SearchPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            search_term: "",

            all_results: [],

            uncategorized: [],
            currently_readings: [],
            want_to_reads: [],
            already_reads: [],

            data_fetched: false
        };

        this.fetchBooksData = this.fetchBooksData.bind(this);
        this.invalidateResults = this.invalidateResults.bind(this);
    }

    componentDidMount() {

        this.fetchBooksData();
    }

    fetchBooksData = async () => {

        let search_results = await BooksAPI.search(this.state.search_term, 10);
        await this.setState({data_fetched: true});

        try {
            search_results.map((item) => {
            });
        }
        catch (ex) {
            console.log("can't map result.");
            // this.setState({data_fetched: true});
            return;
        }

        let all_tracked_books = await BooksAPI.getAll();

        let results_tracked = [];
        search_results.map((result_item) => {
            console.log(result_item);

            let index = all_tracked_books.map((tracked_item) => {
                return tracked_item.id
            }).indexOf(result_item.id);

            console.log(all_tracked_books[index]);
            console.log("^^^ index item ^^^");

            if (index > -1) {
                results_tracked.push(all_tracked_books[index]);
            }
        });

        let currently_readings = [];
        let already_reads = [];
        let want_to_reads = [];
        let uncategorized = [];

        results_tracked.map((item) => {
            switch (item.shelf) {
                case "currentlyReading":
                    console.log(`Pushing to ${item.shelf}`);
                    currently_readings.push(item);
                    break;
                case "read":
                    console.log(`Pushing to ${item.shelf}`);
                    already_reads.push(item);
                    break;
                case "wantToRead":
                    console.log(`Pushing to ${item.shelf}`);
                    want_to_reads.push(item);
                    break;
                default:
                    console.log(`Pushing to ${item.shelf}`);
                    uncategorized.push(item);
                    break;
            }
        });

        this.setState({
            all_results: search_results,
            currently_readings: currently_readings,
            already_reads: already_reads,
            want_to_reads: want_to_reads,
            uncategorized: uncategorized
        });
    };

    invalidateResults = () => {
        this.setState({data_fetched: false});
    };

    onTermChange = _.debounce(async (value) => {
        await this.setState({search_term: value});
        this.fetchBooksData();
    }, 500);

    resultDisplayControl = () => {

        if (this.state.search_term.length === 0) {
            return (
                <div className="search-page-content-container" style={{minHeight: "800px"}}>
                    <div className="search-page-default-container" style={{marginBottom: "0px"}}>
                        <i className="material-icons">arrow_upward</i>
                    </div>
                    <div className="search-page-default-container" style={{marginTop: "0px"}}>
                        <p>Search for books <i className="material-icons">library_books</i></p>

                    </div>
                </div>
            )
        }

        if (!this.state.data_fetched) {
            return (
                <div className="search-page-content-container" style={{minHeight: "800px"}}>
                    <div className="search-page-default-container" style={{marginBottom: "0px"}}>
                        <i className="material-icons">accessibility_new</i>
                    </div>
                    <div className="search-page-default-container" style={{marginTop: "0px"}}>
                        <p>Loading...</p>
                    </div>
                </div>
            )
        }

        if (this.state.all_results.length === 0) {
            return (
                <div className="search-page-content-container">
                    <div className="search-page-noinfo-container">
                        <p>No results for search term: "{this.state.search_term}" </p>
                        <i className="material-icons">sentiment_very_dissatisfied</i>

                    </div>
                </div>
            )
        }

        return (
            <div className="search-page-content-container">
                <Bookshelf bookshelf_name={"None:"}
                           books={this.state.uncategorized}
                           data_fetched={this.state.data_fetched}
                           show={this.state.uncategorized.length > 0}
                           fetchBooksData={this.fetchBooksData}/>
                <Bookshelf bookshelf_name={"Currently Reading:"}
                           books={this.state.currently_readings}
                           data_fetched={this.state.data_fetched}
                           show={this.state.currently_readings.length > 0}
                           fetchBooksData={this.fetchBooksData}/>
                <Bookshelf bookshelf_name={"Want to Read:"}
                           books={this.state.want_to_reads}
                           data_fetched={this.state.data_fetched}
                           show={this.state.want_to_reads.length > 0}
                           fetchBooksData={this.fetchBooksData}/>
                <Bookshelf bookshelf_name={"Already Read:"}
                           books={this.state.already_reads}
                           data_fetched={this.state.data_fetched}
                           show={this.state.data_fetched > 0}
                           fetchBooksData={this.fetchBooksData}/>
            </div>
        )
    };

    render() {

        let document_title = "Search - Udacity.MyReads";
        if (this.state.search_term.length > 0) {
            document_title = `Search: "${this.state.search_term}"`;
        }
        document.title = document_title;

        return (
            <div className="search-page-main">
                <Head on_search_page={true}
                      onTermChange={this.onTermChange}
                      invalidateResults={this.invalidateResults}
                      search_term={this.state.search_term}/>

                {this.resultDisplayControl()}

                <Foot/>
            </div>
        );
    }
}
