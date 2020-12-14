import React from 'react';

const Pagination = ({ currentPage, itemPerPage, OnPageChange, length}) => {

    const pagesCount = Math.ceil(length / itemPerPage)
    console.log(pagesCount)
    const pages = []
    for(let i = 1; i <= pagesCount; i++){
        pages.push(i);
    }

    return ( 
        <div>
        <ul className="pagination pagination-sm">
            <li className={"page-item" + (currentPage === 1 && " disabled")}>
                <button onClick={() => OnPageChange(currentPage - 1)} className="page-link">&laquo;</button>
            </li>
            {pages.map(page => 
                <li key={page} className={"page-item" + (currentPage === page && " active")}>
                    <button
                        onClick={() => OnPageChange(page)}
                        className="page-link"
                    >
                        {page}
                    </button>
                </li>
             )}
            
            <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                <button onClick={() => OnPageChange(currentPage + 1)} className="page-link">&raquo;</button>
            </li>
        </ul>
    </div>
     );
}

Pagination.getData = (items, currentPage, itemPerPage) => {     
    const start = currentPage * itemPerPage - itemPerPage
    return items.slice(start, start + itemPerPage)
}
 
export default Pagination