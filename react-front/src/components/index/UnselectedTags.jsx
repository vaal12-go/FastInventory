import { Tag } from "./Tag";


export function UnselectedTags({ tags, onTagSelected }) {
    // console.log('tags :>> ', tags);
    function tagSelected(evt, tag) {
        console.log('tag Selected :>> ', tag);
        if(onTagSelected) {
            onTagSelected(evt, tag)
        }
    }
    return (
        <div className="row">
            <div className="col">
                {
                    tags.map(
                        (tag) => {
                            // console.log('tag :>> ', tag);
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