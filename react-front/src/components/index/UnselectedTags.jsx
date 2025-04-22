import { Tag } from "./Tag";


export function UnselectedTags({ tags, onTagSelected, filterText }) {
    // console.log('UnselectedTags filterText :>> ', filterText);
    function tagSelected(evt, tag) {
        // console.log('tag Selected :>> ', tag);
        if (onTagSelected) {
            onTagSelected(evt, tag)
        }
    }
    return (
        <div className="row">
            <div className="col">
                {
                    tags.map(
                        (tag) => {
                            if (filterText == "" || tag.tag.toLowerCase().includes(filterText.toLowerCase()))
                                return (
                                    <Tag tag={tag}
                                        selected={false}
                                        key={tag.uuid}
                                        onSelectClick={tagSelected} />
                                )
                        }
                    )
                }
            </div>
        </div>
    )
} //export function UnselectedTags() {