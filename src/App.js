import React, { Component } from "react";
import moment from "moment";

import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DateUtils } from "react-day-picker";

import {
  ReactiveBase,
  DateRange,
  ResultCard,
  SelectedFilters,
  ReactiveList
} from "@appbaseio/reactivesearch";

import "./index.css";

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      dateFormat: "yyyy-MM-dd"
    }
  }

  onChange = (e) => {
    this.setState({
      dateFormat: e.target.value
    })
  }

  dateQuery(value) {
    let query = null;
    if (value) {
      query = [
        {
          range: {
            date_from: {
              gte: moment(value.start).format("YYYYMMDD")
            }
          }
        },
        {
          range: {
            date_to: {
              lte: moment(value.end).format("YYYYMMDD")
            }
          }
        }
      ];
    }
    return query ? { query: { bool: { must: query } } } : null;
  }

  render() {
    const FORMAT = this.state.dateFormat;

    return (
      <div>
        
        <p>
          Date Format: <input type="text" value={this.state.dateFormat} onChange={(e) => this.onChange(e)}/>
        </p>

        <ReactiveBase
          app="airbeds-test-app"
          credentials="X8RsOu0Lp:9b4fe1a4-58c6-4089-a042-505d86d9da30"
          type="listing"
        >
          <div className="row">
            <div className="col">
              <DateRange
                componentId="DateSensor"
                dayPickerInputProps={{
                  formatDate,
                  format: FORMAT,
                  parseDate
                }}
                dataField="date_from"
                customQuery={this.dateQuery}
                initialMonth={new Date("2017-05-05")}
              />
            </div>

            <div className="col">
              <SelectedFilters />
              <ReactiveList
                componentId="SearchResult"
                dataField="name"
                from={0}
                size={40}
                showPagination
                react={{
                  and: ["DateSensor"]
                }}
                render={({ data }) => (
                  <ReactiveList.ResultCardsWrapper>
                    {data.map(item => (
                      <ResultCard href={item.listing_url} key={item.id}>
                        <ResultCard.Image src={item.image} />
                        <ResultCard.Title>
                          <div
                            className="book-title"
                            dangerouslySetInnerHTML={{
                              __html: item.name
                            }}
                          />
                        </ResultCard.Title>

                        <ResultCard.Description>
                          <div>
                            <div>${item.price}</div>
                            <span
                              style={{
                                backgroundImage: `url(${item.host_image})`
                              }}
                            />
                            <p>
                              {item.room_type} · {item.accommodates} guests
                            </p>
                          </div>
                        </ResultCard.Description>
                      </ResultCard>
                    ))}
                  </ReactiveList.ResultCardsWrapper>
                )}
              />
            </div>
          </div>
        </ReactiveBase>
      </div>
    );
  }
}

export default App
