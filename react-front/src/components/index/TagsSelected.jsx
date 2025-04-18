import { Tag } from "./Tag";


export function TagsSelected({ tags }) {
    console.log('TagsSelected tags :>> tags ', tags);
    return (
        <div className="row">
            <div className="col">
                {
                    tags.map(
                        (tag) => {
                            return (
                                <Tag tag={tag} selected={true} key={tag.uuid}/>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}