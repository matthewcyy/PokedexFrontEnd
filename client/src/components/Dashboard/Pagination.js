
import React, { useState, useEffect } from 'react';

function Pagination(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const maxNumPages = 34;

    // useEffect(() => {
    //     fetch(baseApiUrl)
    //       .then(response => response.json())
    //       .then(data => {
    //         const urls = data.results.slice(endPoint1, endPoint2).map((data) => data.url);
    //         Promise.all(
    //           urls.map((eachURL) => fetch(eachURL).then((res) => res.json()))
    //         ).then((res) => setMultPokemons(res));
    //       })
    //   }, [endPoint1, endPoint2])
    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / props.pageLimit) * props.pageLimit;
        return new Array(30).fill().map((_, idx) => start + idx + 1);
    }
    
    return (
    <div className="Pagination-list">
        {getPaginationGroup().map((item) => (
            <button
             key={item}
             onClick={() => {props.changePage(item)}}
            >
                {item}
            </button>
        ))}
    </div>
    )
}
export default Pagination;