import { useState, useEffect } from "react";

import { useSearchParams } from 'react-router-dom';

import { getFilterParams } from "./InventoryItems";


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
                    _{link_page_no}_
                </a>
            );
    }
};//const draw_navigation_link = (page_no) => {

export function Pagination({
    total_pages = 1,
    onChange = null,
}) {
    // console.log("Current page:", current_page)
    const [nav_pages_to_show, setNavigationPages] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState(getFilterParams(searchParams))
    // const [current_page, setCurrent_page] = useState(filters.page)

    useEffect(() => {
        // TODO: extend this logic to pages >10
        if (total_pages <= 10) {
            const nav_array = Array.from({ length: total_pages }, (_, i) => i + 1);
            setNavigationPages(nav_array);
        }
        // current_page = filters
        setFilters(getFilterParams(searchParams))
    }, [searchParams, total_pages])

    function call_page_callback(page_selected) {
        return (evt) => {
            evt.preventDefault();
            setSearchParams((params) => {
                params.set("page", page_selected)
                return params
              });
            //   setFilters({
            //     ...filters,
            //     page: selected_page
            //   })


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