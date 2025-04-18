import useSWR from 'swr'
import { useSearchParams } from 'react-router-dom';

import { TagsSelected } from "./TagsSelected";
import { TagsTextFilter } from "./TagsTextFilter";
import { UnselectedTags } from "./UnselectedTags";

import "./tags.css"
import { useEffect, useState } from 'react';


async function fetchTags() {
    console.log('Fetching :>> ');
    const url = "http://127.0.0.1:8080/tag"
    const tagsRes = await fetch(url)
    const tagsJSON = await tagsRes.json()
    console.log('tagsJSON :>> ', tagsJSON);
    return tagsJSON
}


export function TagSelect() {
    const { data, error, isLoading } = useSWR('/tag', fetchTags)

    const [searchParams, setSearchParams] = useSearchParams()


    const [tagsSelected, setTagsSelected] = useState([])
    const [tagsUnSelected, setTagsUnSelected] = useState([])

    // Testing URL: http://localhost:5173/?tags=efc745cf-2952-4ffb-9ee9-f588d770fbe5,b6230611-71c3-4aae-b87b-4602786d3c1a
    // container and electronics

    console.log('data :>> ', data);

    useEffect(() => {
        function retrieveTags() {
            const selectedTagArr = []
            let unselectedTagArr = []
            if (data) {
                unselectedTagArr = [...data.tags]
                // console.log('data  in retrieveTags:>> ', data);
                const tagsSelectedStr = searchParams.get("tags")
                // console.log('tagsSelectedStr :>> ', tagsSelectedStr);
                const tagsStrArr = tagsSelectedStr.split(",")

                console.log('unselectedTagArr :>> ', unselectedTagArr);
                tagsStrArr.map((tag) => {
                    console.log('Searching tags :>> ', tag);
                    const fullTagObjArr = unselectedTagArr.filter((fullTag) => fullTag.uuid == tag)
                    if (fullTagObjArr) {
                        selectedTagArr.push(fullTagObjArr[0])
                        unselectedTagArr = unselectedTagArr.filter((unselectedTag) => unselectedTag.uuid != tag)
                    }
                })
                console.log('selectedTagArr :>> ', selectedTagArr);
                console.log('unselectedTagArr :>> ', unselectedTagArr);
            }; //if(data) {
            return {
                selected: selectedTagArr,
                unselected: unselectedTagArr
            }

        };//function retrieveTags() {
        const splitTags = retrieveTags();
        setTagsSelected(splitTags.selected);
        setTagsUnSelected(splitTags.unselected)
    }, [data])

    console.log('tagsSelected :>> ', tagsSelected);

    if (error) {
        console.error('error :>> ', { err: error });
        return (
            <>
                <div>failed to load: </div>
                {error.message ? <div> {error.message} </div> : ""}
                {error.stack ? <div>{error.stack}</div> : ""}
            </>
        )
    }

    if (isLoading) {
        return (
            <div>Tags loading...</div>
        )
    }

    console.log('tagsData :>> ', data);

    return (
        <>
            <TagsSelected tags={tagsSelected} />
            <TagsTextFilter />
            <UnselectedTags tags={tagsUnSelected} />
        </>
    )
}