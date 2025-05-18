import { Tag } from "./Tag";


export function TagsSelected({ tags, onTagUnselected }) {
    // console.log('TagsSelected tags :>> tags ', tags);

    function onTagUnselectedHandler(evt, tag) {
        // console.log('TagsSelected evt :>> ', evt);
        if(onTagUnselected) onTagUnselected(evt, tag)
    }
    return (
        <div className="row">
            <div className="col">
                {
                    tags.map(
                        (tag) => {
                            return (
                                <Tag tag={tag} 
                                    selected={true} 
                                    key={tag.uuid}
                                    onUnselectClick={onTagUnselectedHandler}/>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}