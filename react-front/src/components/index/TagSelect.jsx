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
    // {
    // "tag": "container",
    // "description": "Automatically created description for 'container' tag.",
    // "uuid": "efc745cf-2952-4ffb-9ee9-f588d770fbe5"
    // }

    // console.log('data :>> ', data);

    function onTagSelected(evt, tag) {
        console.log('tag Selected in  TagSelect:>> ', tag);
    }

    function onTagUnselected(evt, tag) {
        console.log('TagUnselected in  TagSelect evt :>> ', evt);
        console.log('tagsSelected :>> ', tagsSelected);
        const newTagsSelected = tagsSelected.filter((old_tag) => old_tag.uuid != tag.uuid)
        console.log('newTagsSelected :>> ', newTagsSelected);
        const newURLTags = newTagsSelected.reduce((url_str, new_tag) => {
            if (url_str.length == 0)
                url_str += new_tag.uuid
            else
                url_str += `,${new_tag.uuid}`
            return url_str
        }, "")
        console.log('newURLTags :>> ', newURLTags);
        setSearchParams((params) => {
            
            if(newURLTags.length==0)
                params.delete("tags")
            else 
                params.set("tags", newURLTags)
            return params
        })
        const splitTags = populateSelectedTagsArray();
        setTagsSelected(splitTags.selected);
        setTagsUnSelected(splitTags.unselected)
    }

    function populateSelectedTagsArray() {
        const selectedTagArr = []
        let unselectedTagArr = []
        if (data) {
            unselectedTagArr = [...data.tags]
            console.log('data  in retrieveTags:>> ', data);
            const tagsSelectedStr = searchParams.get("tags")
            if (tagsSelectedStr != "" && !(tagsSelectedStr === null)) {
                const tagsStrArr = tagsSelectedStr.split(",")
                tagsStrArr.map((tag) => {
                    const fullTagObjArr = unselectedTagArr.filter((fullTag) => fullTag.uuid == tag)
                    if (fullTagObjArr) {
                        selectedTagArr.push(fullTagObjArr[0])
                        unselectedTagArr = unselectedTagArr.filter((unselectedTag) => unselectedTag.uuid != tag)
                    }
                })
            }//if(tagsSelectedStr!="") {
        }; //if(data) {
        return {
            selected: selectedTagArr,
            unselected: unselectedTagArr
        }
    } //function populateSelectedTagsArray() {

    useEffect(() => {
        const splitTags = populateSelectedTagsArray();
        setTagsSelected(splitTags.selected);
        setTagsUnSelected(splitTags.unselected)
    }, [data])


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

    // console.log('tagsData :>> ', data);

    return (
        <>
            <TagsSelected
                tags={tagsSelected}
                onTagUnselected={onTagUnselected}
            />
            <TagsTextFilter />
            <UnselectedTags
                tags={tagsUnSelected}
                onTagSelected={onTagSelected} />
        </>
    )
}