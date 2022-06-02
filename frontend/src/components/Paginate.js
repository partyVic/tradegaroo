import React from 'react'
import { useLocation } from 'react-router-dom'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


// Note: the default value for the props
// isAdmin props is used for the Admin ProductListScreen http://localhost:3000/admin/productlist
const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
    return (

        // make sure pages more than 1, if less than 1, don't show the <Pagination>
        pages > 1

        && (
            <Pagination className='d-flex justify-content-center my-3'>
                {[...Array(pages).keys()].map((x) => (
                    <LinkContainer

                        // ***** use x + 1 , bacause x is array index, starting from 0 
                        key={x + 1}
                        to={
                            !isAdmin
                                ? keyword
                                    ? `/search/${keyword}/page/${x + 1}`
                                    : `/page/${x + 1}`
                                : `/admin/productlist/${x + 1}`
                        }
                    >
                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    )
}


// Our Paginate component contains hardcoded path and logic, 
// lets say we would like to use it for userslist, orderslist, etc.. 
// My try out to make it reusable:
// const Paginate = ({ total, page }) => {
//     const location = useLocation();
//     const path = location.pathname;

//     const baseURL = path.split('/page/')[0] === '/' ? '' : path.split('/page/')[0];

//     if (total <= 1) return null;

//     return (
//         <Pagination className='justify-content-center my-3'>
//             {[...Array(total).keys()].map((p) => (
//                 <LinkContainer key={p} to={`${baseURL}/page/${p + 1}`}>
//                     <Pagination.Item active={p + 1 === page}>{p + 1}</Pagination.Item>
//                 </LinkContainer>
//             ))}
//         </Pagination>
//     );
// };

export default Paginate