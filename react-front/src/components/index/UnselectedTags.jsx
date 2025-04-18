import { Tag } from "./Tag";


export function UnselectedTags({tags}) {
    // console.log('tags :>> ', tags);
    return (
        <div className="row">
            <div className="col">
                {
                    tags.map(
                        (tag)=>{
                            // console.log('tag :>> ', tag);
                            return (
                                <Tag tag={tag} selected={false} key={tag.uuid}/>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
} //export function UnselectedTags() {