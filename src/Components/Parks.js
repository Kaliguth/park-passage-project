import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const url =
  "https://developer.nps.gov/api/v1/parks?api_key=fqcD9ajfrQy8VHiZXiF15L4qgQ0r40KTsqmj39eP";

export default function Parks() {
  const [parksArray, setParksArray] = useState([]);
  const [allParks, setAllParks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        let response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch API data");
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error(error);
        return [];
      } finally {
        setLoading(false);
      }
    };

    const getApiData = async () => {
      let apiData = await fetchApiData();
      setParksArray(apiData);
      setAllParks(apiData);
    };

    getApiData();
  }, []);
  console.log(parksArray);

  if (!parksArray || loading)
    return (
      <div className="text-center">
        <h3 className="d-inline-block bg-warning bg-opacity-75 border border-dark rounded px-3 py-3">
          <u>
            <b>Loading...</b>
          </u>
        </h3>
      </div>
    );

  // The search function uses the api search by park code parameter in the url
  // becuase there is no search by name in it.
  // First the function checks if input is empty. If it is, shows all parks on button click.
  // The function takes the input value as lower case,
  // goes over allParks array to find the first park that includes the input
  // and then takes its' park code to use it as park code parameter to search by within the url.
  // If no park is valid for the input, changes parksArray to be empty.
  // This allows the return of the component show "No parks found" div instead of empty list.
  // If a park is found, fetches with new url and changes parksArray to have only the found park.
  const searchParkByName = async () => {
    const searchInput = document
      .getElementById("parkSearch")
      .value.toLowerCase();

    if (!searchInput) {
      setParksArray(allParks);
      return;
    }

    try {
      let parkCode;
      for (let i = 0; i < allParks.length; i++) {
        if (allParks[i].fullName.toLowerCase().includes(searchInput)) {
          parkCode = allParks[i].parkCode;
          break;
        }
      }

      if (!parkCode) {
        console.log("No parks found");
        setParksArray([]);
        return;
      }

      const searchUrl = `https://developer.nps.gov/api/v1/parks?limit=1&parkCode=${parkCode}&api_key=fqcD9ajfrQy8VHiZXiF15L4qgQ0r40KTsqmj39eP`;
      let response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch API data");
      }

      const result = await response.json();
      setParksArray(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to change parksArray to be filtered by activity.
  // The API does not have get by activity parameter.
  // Only offers get by parkCode, relevance score (all parks are 1), and full name. All of those return 1 park.
  // The function first empties parksArray.
  // If the value selected in select box is "all", sets parksArray to show all.
  // Otherwise goes over allParks array and adds any park that includes the activity selected into parksArray.
  const filterByActivity = () => {
    const activity = document.getElementById("activityFilter").value;

    setParksArray([]);
    if (activity === "all") {
      setParksArray(allParks);
      return;
    }

    for (let i = 0; i < allParks.length; i++) {
      for (let j = 0; j < allParks[i].activities.length; j++) {
        if (allParks[i].activities[j].name === activity) {
          setParksArray((prevParksArray) => [...prevParksArray, allParks[i]]);
          break;
        }
      }
    }
  };

  return (
    <div className="text-center">
      <h2 className="d-inline-block bg-light bg-opacity-75 border border-dark rounded px-3 py-3 mb-4">
        <u>
          <b>National parks</b>
        </u>
      </h2>
      <br />
      <div className="align-center">
        <div className="d-inline-block bg-warning bg-opacity-75 border border-dark rounded px-3 py-2 pb-3 pt-3">
          <h5>Search for a park: </h5>
          <input
            type="text"
            id="parkSearch"
            placeholder="Park name"
            className="rounded pb-1"
          />
          <span className="mx-1"> </span>
          <button className="btn btn-light btn-sm" onClick={searchParkByName}>
            Search
          </button>{" "}
        </div>
        <span className="mx-4"> </span>
        <div className="d-inline-block bg-warning bg-opacity-75 border border-dark rounded px-3 py-3 pb-3">
          <h5>Find parks by activity:</h5>
          <select
            id="activityFilter"
            className="form-select form-select-md"
            onChange={filterByActivity}
          >
            <option value="all">All parks</option>
            <option value="Astronomy">Astronomy</option>
            <option value="Stargazing">Stargazing</option>
            <option value="Food">Food</option>
            <option value="Picnicking">Picnicking</option>
            <option value="Guided Tours">Guided Tours</option>
            <option value="Hiking">Hiking</option>
            <option value="Wildlife Watching">Wildlife Watching</option>
            <option value="Birdwatching">Birdwatching</option>
            <option value="Biking">Biking</option>
            <option value="Boating">Boating</option>
            <option value="Camping">Camping</option>
            <option value="Climbing">Climbing</option>
            <option value="Fishing">Fishing</option>
            <option value="Kayaking">Kayaking</option>
            <option value="Swimming">Swimming</option>
            <option value="Snorkeling">Snorkeling</option>
            <option value="Surfing">Surfing</option>
            <option value="Museum Exhibits">Museum Exhibits</option>
            <option value="Horseback Riding">Horseback Riding</option>
          </select>
        </div>
      </div>
      <br />
      {parksArray.length === 0 ? (
        <div className="text-center">
          <h6 className="d-inline-block bg-danger border border-dark rounded px-3 py-3 pb-3">
            No parks found
          </h6>
        </div>
      ) : (
        <div className="text-center">
          <h6 className="d-inline-block bg-warning bg-opacity-75 border border-dark rounded px-3 py-3 pb-3">
            Click any park for more details
          </h6>
          <br />
          {parksArray.map((park) => (
            <div
              key={park.id}
              className="d-inline-block bg-primary border border-dark rounded mx-3 my-3 px-3 py-3 vw-25"
            >
              <Link to={`${park.parkCode}`}>
                <div className="bg-light bg-opacity-75 border border-dark rounded px-3 py-3 pb-3">
                  <h3 className="text-dark">
                    <u>{park.name}</u>
                  </h3>
                  <img
                    src={park.images[0].url}
                    alt={park.images[0].altText}
                    width="250"
                    height="200"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
