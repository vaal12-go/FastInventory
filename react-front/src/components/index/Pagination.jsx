import { useState, useEffect } from "react";

import { useSearchParams } from 'react-router-dom';

import { getFilterParams } from "../../lib/utils";


function add_if_no_duplicates(arr, value) {
    if (arr.indexOf(value) == -1)
        arr.push(value)
}

function draw_navigation_link(link_page_no,
    curr_page_no,
    call_page_callback) {
    if (link_page_no == curr_page_no) {
        return `${link_page_no}`;
    } else {
        if (link_page_no == "..")
            return (<>&nbsp;...&nbsp;</>)
        else
            return (
                <a href="#" onClick={call_page_callback(link_page_no)}
                    className="page_number_span">
                    {link_page_no}
                </a>
            );
    }
};//const draw_navigation_link = (page_no) => {

export function Pagination({
    total_pages = 1,
    onChange = null,
}) {
    // console.log("total_pages:", total_pages)
    const [nav_pages_to_show, setNavigationPages] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState(getFilterParams(searchParams))
    // const [current_page, setCurrent_page] = useState(filters.page)

    useEffect(() => {
        // console.log("total_pages:", total_pages)
        let curr_filters = getFilterParams(searchParams)

        if (curr_filters.page > total_pages) {
            setSearchParams((params) => {
                params.set("page", total_pages)
                return params
            });
            return;
        }
        // TODO: extend this logic to pages >10
        if (total_pages <= 10) {
            const nav_array = Array.from({ length: total_pages }, (_, i) => i + 1);
            setNavigationPages(nav_array);
        } else {
            const current_page = Number(curr_filters.page);
            console.log('current_page :>> ', current_page);
            const nav_array = [1, 2, 3];

            if (current_page > 5)
                nav_array.push("..")
        
            console.log('nav_array 1 :>> ', nav_array);

            if (
                current_page > 2 &&
                (current_page <= total_pages - 2)
            ) {
                console.log('current_page :>> ', current_page);
                for (let i = current_page - 1; i <= (current_page + 1); i++) {
                    console.log('Adding i :>> ', i);
                    add_if_no_duplicates(nav_array, i)
                }
            }

            console.log('nav_array 2 :>> ', nav_array);

            if (current_page < total_pages - 4) {
                nav_array.push("..")
            }

            add_if_no_duplicates(nav_array, total_pages - 2)
            add_if_no_duplicates(nav_array, total_pages - 1)
            add_if_no_duplicates(nav_array, total_pages)

            console.log('nav_array LAST :>> ', nav_array);

            setNavigationPages(nav_array);
        }
        setFilters(curr_filters)
    }, [searchParams, total_pages])

    function call_page_callback(page_selected) {
        return (evt) => {
            evt.preventDefault();
            setSearchParams((params) => {
                params.set("page", page_selected)
                return params
            });
            if (onChange == null) return;
            onChange(page_selected);
        };
    }

    return (
        <h6>
            {nav_pages_to_show.map((page_no) => {
                return (
                    <span className="page_number_span" key={"page_no_" + page_no}>
                        {draw_navigation_link(page_no, filters.page, call_page_callback)}
                        &nbsp;&nbsp;&nbsp;
                    </span>
                )
            })}
        </h6>
    )
}//export function Pagination({